import React, { useState } from 'react';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';
import MobileToggleBar from '../components/MobileToggleBar';
import { useResume } from '../context/ResumeContext';

const MainBuilder = () => {
    const { loading } = useResume();
    const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

    if (loading) return <div className="loading-screen">Loading Profile Engine...</div>;

    return (
        <div className="builder-layout">
            <div className={`builder-left ${mobileTab === 'preview' ? 'mobile-hidden' : ''}`}>
                <EditorPanel />
            </div>
            <div className={`builder-right ${mobileTab === 'editor' ? 'mobile-hidden' : ''}`}>
                <PreviewPanel />
            </div>

            {/* Visible only on mobile via CSS */}
            <MobileToggleBar activeTab={mobileTab} onToggle={setMobileTab} />
        </div>
    );
};

export default MainBuilder;
