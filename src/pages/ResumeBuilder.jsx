import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../context/ResumeContext';
import ResumePaper from '../components/ResumePaper';
import EditorPanel from '../components/EditorPanel';
import '../styles/ResumeBuilder.css';

const ResumeBuilder = () => {
    const { data, isEditMode, setIsEditMode, saveResume, saveStatus } = useResume();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
                    <button onClick={handlePrint} className="save-action-btn pdf-btn" style={{ background: '#ff4b2b', borderColor: '#ff4b2b' }}>
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
                    <div className="paper-canvas">
                        <ResumePaper data={data} ref={componentRef} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResumeBuilder;
