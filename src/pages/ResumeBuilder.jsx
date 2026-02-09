import React from 'react';
import { useResume } from '../context/ResumeContext';
import ResumePaper_Developer from '../components/templates/Developer/ResumePaper_Developer';
import '../styles/ResumeBuilder.css'; // Will create this next

const ResumeBuilder = () => {
    const { data, isEditMode, setIsEditMode, saveResume, saveStatus, lang, setLang } = useResume();

    return (
        <div className="resume-builder-container">
            {/* Toolbar */}
            <div className="builder-toolbar">
                <div className="toolbar-left">
                    <button
                        className={`mode-btn ${isEditMode ? 'active' : ''}`}
                        onClick={() => setIsEditMode(true)}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        className={`mode-btn ${!isEditMode ? 'active' : ''}`}
                        onClick={() => setIsEditMode(false)}
                    >
                        👁️ Preview
                    </button>
                </div>

                <div className="toolbar-center">
                    <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
                        <option value="ko">KR (한국어)</option>
                        <option value="en">EN (English)</option>
                    </select>
                </div>

                <div className="toolbar-right">
                    <span className={`save-indicator ${saveStatus}`}>
                        {saveStatus === 'saved' && '✅ All Saved'}
                        {saveStatus === 'saving' && '💾 Saving...'}
                        {saveStatus === 'unsaved' && '⚠️ Unsaved Changes'}
                        {saveStatus === 'error' && '❌ Error'}
                    </span>
                    <button onClick={saveResume} className="save-action-btn">
                        Force Save
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className={`workspace ${isEditMode ? 'edit-mode' : 'view-mode'}`}>
                {/* The Paper */}
                <div className="paper-canvas">
                    <ResumePaper_Developer data={data} />
                    {/* <div>Resume Paper Placeholder</div> */}
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
