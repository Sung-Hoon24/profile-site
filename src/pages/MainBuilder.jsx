import React, { useState } from 'react';
import EditorPanel from '../components/EditorPanel';
import PreviewPanel from '../components/PreviewPanel';
import { useResume } from '../context/ResumeContext';

const MainBuilder = () => {
    const { loading } = useResume();

    if (loading) return <div className="loading-screen">Loading Profile Engine...</div>;

    return (
        <div className="builder-layout">
            <div className="builder-left">
                <EditorPanel />
            </div>
            <div className="builder-right">
                <PreviewPanel />
            </div>
        </div>
    );
};

export default MainBuilder;
