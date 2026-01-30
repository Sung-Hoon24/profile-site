import React, { useRef, useState } from 'react';
import { useResume } from '../context/ResumeContext';
import ResumePaper from './ResumePaper';
import ResumePreviewModal from './ResumePreviewModal';

const PreviewPanel = () => {
    const { data } = useResume();
    console.log('[PreviewPanel] Data from Context:', data); // Debug Log
    const [scale, setScale] = useState(0.6); // Default lighter zoom for better fit
    const [isModalOpen, setIsModalOpen] = useState(false);
    const componentRef = useRef();

    // The Print Button now opens the Modal
    const onPrintClick = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="preview-panel">
            <div className="preview-toolbar">
                <span className="toolbar-title">Live Preview (A4)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '15px' }}>
                    <span style={{ fontSize: '0.8rem' }}>🔍 Zoom:</span>
                    <input
                        type="range"
                        min="0.3"
                        max="1.5"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        style={{ width: '80px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', width: '30px' }}>{Math.round(scale * 100)}%</span>
                </div>
                <button onClick={onPrintClick} className="print-btn">🖨️ PDF / Print</button>
            </div>

            <div className="preview-scroll-area" style={{
                overflow: 'auto',
                width: '100%',
                height: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                background: '#525659', // PDF Viewer Gray
                paddingTop: '40px',
                paddingBottom: '40px'
            }}>
                {/* Scale Wrapper */}
                <div style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out'
                }}>
                    {/* Reusing the unified ResumePaper component */}
                    <ResumePaper ref={componentRef} data={data} />
                </div>
            </div>

            {/* A4 Preview & Export Modal */}
            <ResumePreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={data}
            />
        </div>
    );
};

export default PreviewPanel;
