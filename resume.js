import { auth, onAuthStateChanged, db, doc, getDoc, setDoc } from './firebase.js';
import { setupExportButtons } from './export.js';

// Initialize Export Buttons specifically for Resume Page
setupExportButtons();

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

            // 1. 기본 필드 채우기 (Flat Fields)
            document.querySelectorAll('[data-field]').forEach(input => {
                const key = input.getAttribute('data-field');
                if (data[key]) input.value = data[key];
            });

            // 2. [안전 장치] 동적 리스트 렌더링 (Dynamic Lists)
            // 데이터가 없으면 빈 배열로 초기화하여 에러 방지
            const expList = data.experience || [];
            const eduList = data.education || [];

            renderExperience(expList);
            renderEducation(eduList);

            console.log('Resume loaded from cloud.');
        } else {
            // 데이터가 없을 때도 초기 렌더링 (빈 입력폼 1개씩)
            renderExperience([{}]);
            renderEducation([{}]);
        }
    } catch (e) {
        console.warn('Could not load resume:', e);
    }
}

// --- Dynamic Rendering Functions (Safe Map Pattern) ---
/*
  [핵심 로직]
  컴포넌트 내부에 map을 직접 쓰지 않고, 데이터(list)를 받아
  순수하게 HTML 문자열만 생성하여 주입합니다.
  이 방식은 무한 렌더링 루프를 원천 차단합니다.
*/

function renderExperience(list) {
    if (!list || list.length === 0) list = [{}]; // 최소 1개 보장

    const container = document.getElementById('experience-list');
    container.innerHTML = list.map((item, index) => `
        <div class="experience-item" data-index="${index}">
            <div class="form-row">
                <div class="form-group">
                    <label>회사명</label>
                    <input type="text" class="form-input" name="exp_company" value="${item.company || ''}" placeholder="(주)코다리테크">
                </div>
                <div class="form-group">
                    <label>직책</label>
                    <input type="text" class="form-input" name="exp_role" value="${item.role || ''}" placeholder="시니어 개발자">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>근무 기간</label>
                    <input type="text" class="form-input" name="exp_period" value="${item.period || ''}" placeholder="2020.03 - 현재">
                </div>
            </div>
            <div class="form-group">
                <label>주요 업무</label>
                <textarea class="form-input" name="exp_desc" placeholder="담당했던 프로젝트와 성과를 작성해주세요...">${item.desc || ''}</textarea>
            </div>
        </div>
    `).join('');
}

function renderEducation(list) {
    if (!list || list.length === 0) list = [{}];

    const container = document.getElementById('education-list');
    container.innerHTML = list.map((item, index) => `
        <div class="education-item" data-index="${index}">
            <div class="form-row">
                <div class="form-group">
                    <label>학교명</label>
                    <input type="text" class="form-input" name="edu_school" value="${item.school || ''}" placeholder="코다리대학교">
                </div>
                <div class="form-group">
                    <label>전공</label>
                    <input type="text" class="form-input" name="edu_major" value="${item.major || ''}" placeholder="컴퓨터공학">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>졸업년도</label>
                    <input type="text" class="form-input" name="edu_year" value="${item.year || ''}" placeholder="2020년 졸업">
                </div>
            </div>
        </div>
    `).join('');
}

// --- Save Resume Data ---
resumeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        alert('로그인이 필요합니다!');
        return;
    }

    const resumeData = {};

    // 1. 기본 필드 수집
    document.querySelectorAll('[data-field]').forEach(input => {
        const key = input.getAttribute('data-field');
        resumeData[key] = input.value;
    });

    // 2. 동적 리스트 데이터 수집 (Array Collection)
    resumeData.experience = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
        company: item.querySelector('[name="exp_company"]').value,
        role: item.querySelector('[name="exp_role"]').value,
        period: item.querySelector('[name="exp_period"]').value,
        desc: item.querySelector('[name="exp_desc"]').value
    }));

    resumeData.education = Array.from(document.querySelectorAll('.education-item')).map(item => ({
        school: item.querySelector('[name="edu_school"]').value,
        major: item.querySelector('[name="edu_major"]').value,
        year: item.querySelector('[name="edu_year"]').value
    }));

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

// --- Add Button Logic (추가 기능) ---
document.getElementById('addExpBtn').addEventListener('click', () => {
    const container = document.getElementById('experience-list');
    // 기존 데이터를 읽어서 배열에 추가하고 다시 렌더링해도 되지만, 
    // 여기서는 간단히 DOM에 추가하는 방식 사용 (React가 아니므로)
    /* 하지만 "데이터 기반 렌더링" 원칙을 지키려면:
       1. 현재 DOM 상태 -> Data Array 변환
       2. Array.push(new Item)
       3. Render(Array)
       이게 정석입니다.
    */
    const currentData = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
        company: item.querySelector('[name="exp_company"]').value,
        role: item.querySelector('[name="exp_role"]').value,
        period: item.querySelector('[name="exp_period"]').value,
        desc: item.querySelector('[name="exp_desc"]').value
    }));
    currentData.push({}); // 빈 아이템 추가
    renderExperience(currentData);
});

document.getElementById('addEduBtn').addEventListener('click', () => {
    const currentData = Array.from(document.querySelectorAll('.education-item')).map(item => ({
        school: item.querySelector('[name="edu_school"]').value,
        major: item.querySelector('[name="edu_major"]').value,
        year: item.querySelector('[name="edu_year"]').value
    }));
    currentData.push({});
    renderEducation(currentData);
});

// --- Cursor Effect ---
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});
