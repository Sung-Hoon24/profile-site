import React, { useState, useEffect } from 'react';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';
import MobileToggleBar from '../components/MobileToggleBar';
import PageTransition from '../components/animations/PageTransition';
import { useResume } from '../context/ResumeContext';
import { useSearchParams } from 'react-router-dom';

const MainBuilder = () => {
    const { loading, data, setData } = useResume();
    const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'
    const [searchParams] = useSearchParams();

    // DEV FEATURE: Allow template selection via URL query (e.g., ?template=designer)
    useEffect(() => {
        const templateFromUrl = searchParams.get('template');
        if (templateFromUrl && ['developer', 'designer', 'future', 'executive', 'startup'].includes(templateFromUrl)) {
            if (data.templateId !== templateFromUrl) {
                console.log('[DEV] Switching template via URL:', templateFromUrl);
                setData(prev => ({ ...prev, templateId: templateFromUrl }));
            }
        }
    }, [searchParams, data.templateId, setData]);

    if (loading) return <div className="loading-screen">Loading Profile Engine...</div>;

    return (
        <PageTransition>
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
        </PageTransition>
    );
};

export default MainBuilder;
