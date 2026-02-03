import React from 'react';
import '../styles/resume-form.css';

const MobileToggleBar = ({ activeTab, onToggle }) => {
    return (
        <div className="mobile-toggle-bar">
            <button
                className={`mobile-tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => onToggle('editor')}
            >
                📝 Editor
            </button>
            <button
                className={`mobile-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => onToggle('preview')}
            >
                👁️ Preview
            </button>
        </div>
    );
};

export default MobileToggleBar;
