import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase.js';

// --- Auth Logic ---
const loginBtn = document.getElementById('loginBtn');
let currentUser = null;

loginBtn.addEventListener('click', async () => {
    if (currentUser) {
        await signOut(auth);
        alert('Logged out');
    } else {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error(error);
            alert('Login failed: ' + error.message);
        }
    }
});

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginBtn.textContent = 'Logout';
        enableEditMode();
    } else {
        loginBtn.textContent = 'Login';
        disableEditMode();
    }
});

// --- Firestore Data Logic ---
// We'll query all [data-editable] AND [data-editable-link]
let allEditableElements;
let allLinkElements;

function updateSelectors() {
    allEditableElements = document.querySelectorAll('[data-editable]');
    allLinkElements = document.querySelectorAll('[data-editable-link]');
}

async function loadProfile() {
    updateSelectors();
    const docRef = doc(db, 'profiles', 'main');
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // Text Content
            allEditableElements.forEach(el => {
                const key = el.getAttribute('data-editable');
                if (data[key]) {
                    if (el.querySelector('.highlight')) {
                        el.innerText = data[key];
                    } else {
                        el.textContent = data[key];
                    }
                    if (key === 'title') el.setAttribute('data-text', data[key]);
                }
            });

            // Links
            allLinkElements.forEach(el => {
                const key = el.getAttribute('data-editable-link');
                if (data[key]) {
                    el.href = data[key];
                }
            });

            console.log('Profile loaded from cloud.');
        } else {
            console.log('No profile found, using default.');
        }
    } catch (e) {
        console.warn('Could not load profile (Check Firebase Config):', e);
    }
}

// --- Edit Mode Logic ---
function enableEditMode() {
    updateSelectors();
    document.body.classList.add('edit-mode-active');

    // Text Edits
    allEditableElements.forEach(el => {
        el.contentEditable = 'true';
        el.classList.add('editable');
        el.addEventListener('blur', saveChange);
    });

    // Link Edits
    allLinkElements.forEach(el => {
        el.addEventListener('click', handleLinkClick);
        el.title = "Shift+Click to edit URL";
    });
}

function disableEditMode() {
    updateSelectors();
    document.body.classList.remove('edit-mode-active');

    // Text Edits
    allEditableElements.forEach(el => {
        el.contentEditable = 'false';
        el.classList.remove('editable');
        el.removeEventListener('blur', saveChange);
    });

    // Link Edits
    allLinkElements.forEach(el => {
        el.removeEventListener('click', handleLinkClick);
        el.removeAttribute('title');
    });
}

function saveChange(e) {
    if (!currentUser) return;

    const el = e.target;
    const key = el.getAttribute('data-editable');
    const value = el.innerText;

    if (key === 'title') el.setAttribute('data-text', value);

    saveToFirestore(key, value);
}

function handleLinkClick(e) {
    if (!currentUser) return;

    const el = e.currentTarget;
    const currentHref = el.getAttribute('href');

    // Shift + Click to Edit
    if (e.shiftKey) {
        e.preventDefault(); // preventing navigation
        const key = el.getAttribute('data-editable-link');
        const displayHref = currentHref !== '#' ? currentHref : '';

        const newUrl = prompt("🔗 링크 주소를 입력하세요 (예: https://naver.com):", displayHref);

        if (newUrl !== null && newUrl.trim() !== '') {
            el.href = newUrl;
            saveToFirestore(key, newUrl);
            alert('링크가 저장되었습니다!');
        }
    } else {
        // Normal Click -> Only proceed if valid URL
        if (currentHref === '#' || !currentHref) {
            e.preventDefault();
            alert('🔗 아직 링크가 설정되지 않았습니다.\\nShift + 클릭으로 링크를 먼저 설정해주세요!');
        }
        // else: let the browser open the link naturally (new tab via target="_blank")
    }
}

function saveToFirestore(key, value) {
    const docRef = doc(db, 'profiles', 'main');
    setDoc(docRef, { [key]: value }, { merge: true })
        .then(() => console.log('Saved:', key))
        .catch(err => console.error('Save failed:', err));
}

// --- Interaction Logic (Original) ---
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Load data on init
loadProfile();
