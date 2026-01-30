import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase.js';

const settingsForm = document.getElementById('settingsForm');
const inputs = document.querySelectorAll('[data-setting]');

// --- Auth Check ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('Admin logged in:', user.email);
        loadSettings();
    } else {
        alert('관리자 로그인이 필요합니다.');
        window.location.href = './index.html';
    }
});

// --- Load Settings ---
async function loadSettings() {
    const docRef = doc(db, 'profiles', 'main');
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            inputs.forEach(input => {
                const key = input.getAttribute('data-setting');
                if (data[key]) {
                    input.value = data[key];
                }
            });
        }
    } catch (e) {
        console.error('Error loading settings:', e);
        alert('설정을 불러오는 중 오류가 발생했습니다.');
    }
}

// --- Save Settings ---
settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updates = {};
    inputs.forEach(input => {
        const key = input.getAttribute('data-setting');
        updates[key] = input.value;
    });

    const docRef = doc(db, 'profiles', 'main');
    try {
        await setDoc(docRef, updates, { merge: true });
        alert('✅ 설정이 저장되었습니다!');
    } catch (e) {
        console.error('Error saving settings:', e);
        alert('저장 실패: ' + e.message);
    }
});

// --- Cursor Effect ---
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}
