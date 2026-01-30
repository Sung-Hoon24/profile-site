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
// We'll query all [data-editable], [data-settings-text], and [data-settings-link]
let allEditableElements;
let allSettingsTextElements;
let allSettingsLinkElements;

function updateSelectors() {
    allEditableElements = document.querySelectorAll('[data-editable]');
    allSettingsTextElements = document.querySelectorAll('[data-settings-text]');
    allSettingsLinkElements = document.querySelectorAll('[data-settings-link]');
}

async function loadProfile() {
    updateSelectors();
    const docRef = doc(db, 'profiles', 'main');
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // 1. Inline Editable Text
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

            // 2. Settings Configured Text (Read-Only on Main Page)
            allSettingsTextElements.forEach(el => {
                const key = el.getAttribute('data-settings-text');
                if (data[key]) {
                    el.textContent = data[key];
                }
            });

            // 3. Settings Configured Links (Read-Only on Main Page)
            allSettingsLinkElements.forEach(el => {
                const key = el.getAttribute('data-settings-link');
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

    // Text Edits (Only for [data-editable])
    allEditableElements.forEach(el => {
        el.contentEditable = 'true';
        el.classList.add('editable');
        el.addEventListener('blur', saveChange);
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
}

function saveChange(e) {
    if (!currentUser) return;

    const el = e.target;
    const key = el.getAttribute('data-editable');
    const value = el.innerText;

    if (key === 'title') el.setAttribute('data-text', value);

    saveToFirestore(key, value);
}

// Link editing is now handled in settings.html, so handleLinkClick is removed.

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
