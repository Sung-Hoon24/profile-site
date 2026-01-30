import html2pdf from 'html2pdf.js';
import * as htmlToImage from 'html-to-image';

/**
 * 이력서 내보내기 기능을 초기화합니다.
 * PDF 및 이미지 저장 버튼에 이벤트를 바인딩합니다.
 */
export function setupExportButtons() {
    const exportContainer = document.createElement('div');
    exportContainer.className = 'export-buttons';
    exportContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 1000;
  `;

    const pdfBtn = createButton('PDF 저장', () => exportContent('pdf'));
    const imgBtn = createButton('이미지 저장', () => exportContent('image'));

    exportContainer.appendChild(pdfBtn);
    exportContainer.appendChild(imgBtn);
    document.body.appendChild(exportContainer);
}

function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.style.cssText = `
    padding: 10px 20px;
    background: var(--primary-color);
    color: #050510;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    transition: transform 0.2s;
  `;
    btn.onmouseover = () => btn.style.transform = 'translateY(-2px)';
    btn.onmouseout = () => btn.style.transform = 'translateY(0)';
    btn.onclick = onClick;
    return btn;
}

/**
 * 콘텐츠를 지정된 형식으로 내보냅니다.
 * @param {'pdf' | 'image'} type
 */
async function exportContent(type) {
    // 1. 캡처 대상 (이력서 컨테이너)
    const element = document.querySelector('.resume-container') || document.body;

    if (!element) {
        alert('내보낼 콘텐츠를 찾을 수 없습니다.');
        return;
    }

    // ============================================================
    // [수정 1] 전체 스크롤 높이(scrollHeight)를 미리 계산
    // 화면에 보이는 영역만 캡처하는 버그를 방지합니다.
    // ============================================================
    const fullHeight = element.scrollHeight;
    const fullWidth = element.scrollWidth;

    // 2. Ink Saving Mode 적용 (클론 생성)
    // 화면 깜빡임 없이 처리하기 위해 cloneNode 사용
    const clone = element.cloneNode(true);

    // 클론에 스타일 강제 적용 클래스 추가
    clone.classList.add('print-mode');

    // ============================================================
    // [수정 2] 클론의 높이를 scrollHeight로 강제 설정
    // overflow: visible로 숨겨진 영역까지 다 그립니다.
    // ============================================================
    clone.style.height = fullHeight + 'px';
    clone.style.width = fullWidth + 'px';
    clone.style.overflow = 'visible';
    clone.style.position = 'static'; // 고정된 위치 해제

    // 클론을 화면 밖(보이지 않는 곳)에 임시 배치
    // html2pdf, html-to-image는 DOM에 붙어있어야 렌더링이 잘 됨
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    // [수정] 너비를 원본과 동일하게 설정
    container.style.width = fullWidth + 'px';
    container.appendChild(clone);
    document.body.appendChild(container);

    // 이미지 로딩 대기 (배경 이미지, 폰트 등)
    await document.fonts.ready;
    // 추가 대기 (렌더링 안정화)
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        if (type === 'pdf') {
            // ============================================================
            // [수정 3] PDF 여백을 10mm로 설정하여 답답함 해소
            // ============================================================
            const opt = {
                margin: 10, // 상하좌우 여백 10mm
                filename: 'my-resume.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,              // 고해상도
                    useCORS: true,
                    scrollY: 0,            // 스크롤 위치 리셋
                    scrollX: 0,
                    height: fullHeight,    // 전체 높이 캡처
                    windowHeight: fullHeight
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // html2pdf는 element 자체를 받아서 처리
            await html2pdf().set(opt).from(clone).save();
        } else if (type === 'image') {
            // ============================================================
            // [수정 4] html-to-image에 height, overflow 옵션 추가
            // 스크롤 아래 숨겨진 영역까지 모두 캡처합니다.
            // ============================================================
            const dataUrl = await htmlToImage.toPng(clone, {
                quality: 1.0,
                pixelRatio: 2,           // 2배 해상도 (선명하게)
                backgroundColor: '#ffffff', // 투명 배경 방지
                height: fullHeight,      // 전체 높이 강제 지정
                width: fullWidth,        // 전체 너비 강제 지정
                style: {
                    height: 'auto',      // 높이 자동 확장
                    overflow: 'visible', // 숨겨진 영역 표시
                    transform: 'scale(1)'
                }
            });

            const link = document.createElement('a');
            link.download = 'my-resume.png';
            link.href = dataUrl;
            link.click();
        }
    } catch (err) {
        console.error('Export failed:', err);
        alert('저장 중 오류가 발생했습니다: ' + err.message);
    } finally {
        // 3. 클론 제거 (메모리 정리)
        document.body.removeChild(container);
    }
}
