import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../context/ResumeContext';
import ResumePaper from '../components/ResumePaper';
import EditorPanel from '../components/EditorPanel';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
    const { data, isEditMode, setIsEditMode, saveResume, saveStatus } = useResume();
    const componentRef = useRef();

    // react-to-print v3.x API: contentRef + async onBeforePrint 필수
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        onBeforePrint: async () => { console.log('[PDF_PREPARE]'); },
        onAfterPrint: () => { console.log('[PDF_DONE]'); },
        onPrintError: (errorLocation, error) => { console.error('[PDF_ERR]', errorLocation, error); },
    });

    const onPdfClick = () => {
        // 1) Saving 중이면 프린트 금지 (간헐 실패 원인 제거)
        if (saveStatus === 'saving') {
            console.warn('[PDF] Blocked: saving in progress');
            alert('저장 중입니다. 저장 완료 후 PDF를 눌러주세요.');
            return;
        }

        // 2) 다음 프레임에 실행해서 DOM/레이아웃 안정화
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                handlePrint();
            });
        });
    };

    return (
        <div className="resume-builder-container">
            {/* Toolbar */}
            <div className="builder-toolbar">
                <div className="toolbar-left">
                    <button
                        className={`mode-btn ${isEditMode ? 'active' : ''}`}
                        onClick={() => setIsEditMode(true)}
                    >
                        📝 Edit
                    </button>
                    <button
                        className={`mode-btn ${!isEditMode ? 'active' : ''}`}
                        onClick={() => setIsEditMode(false)}
                    >
                        👁️ Preview
                    </button>
                </div>

                <div className="toolbar-right">
                    <div className={`save-indicator ${saveStatus}`}>
                        {saveStatus === 'saving' ? 'Saving...' :
                            saveStatus === 'saved' ? 'All changes saved' :
                                'Unsaved changes'}
                    </div>
                    <button onClick={saveResume} className="save-action-btn">
                        💾 Save
                    </button>
                    <button onClick={onPdfClick} className="save-action-btn pdf-btn" style={{ background: '#ff4b2b', borderColor: '#ff4b2b' }}>
                        📥 PDF
                    </button>
                </div>
            </div>

            {/* Main Builder Area */}
            <main className="builder-main">
                {isEditMode && (
                    <aside className="editor-sidebar">
                        <EditorPanel />
                    </aside>
                )}

                <div className={`workspace ${isEditMode ? 'edit-mode' : 'view-mode'}`}>
                    <div className="paper-canvas" ref={componentRef}>
                        <ResumePaper data={data} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumeBuilder;
