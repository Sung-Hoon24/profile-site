import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase.js';

// --- Auth State ---
let currentUser = null;
const loginNotice = document.getElementById('loginNotice');
const resumeForm = document.getElementById('resumeForm');
const saveBtn = document.getElementById('saveBtn');
const statusMessage = document.getElementById('statusMessage');

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        loginNotice.classList.remove('show');
        saveBtn.disabled = false;
        loadResume();
    } else {
        loginNotice.classList.add('show');
        saveBtn.disabled = true;
    }
});

// --- Load Resume Data ---
async function loadResume() {
    const docRef = doc(db, 'resumes', 'main');
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Populate all fields
            document.querySelectorAll('[data-field]').forEach(input => {
                const key = input.getAttribute('data-field');
                if (data[key]) {
                    input.value = data[key];
                }
            });
            console.log('Resume loaded from cloud.');
        }
    } catch (e) {
        console.warn('Could not load resume:', e);
    }
}

// --- Save Resume Data ---
resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert('로그인이 필요합니다!');
        return;
    }

    // Collect all field values
    const resumeData = {};
    document.querySelectorAll('[data-field]').forEach(input => {
        const key = input.getAttribute('data-field');
        resumeData[key] = input.value;
    });

    // Save to Firestore
    const docRef = doc(db, 'resumes', 'main');
    try {
        await setDoc(docRef, resumeData);
        statusMessage.textContent = '✅ 이력서가 성공적으로 저장되었습니다!';
        statusMessage.className = 'status-message success';
        setTimeout(() => {
            statusMessage.className = 'status-message';
        }, 3000);
    } catch (err) {
        console.error('Save failed:', err);
        alert('저장 실패: ' + err.message);
    }
});

// --- Cursor Effect ---
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});
