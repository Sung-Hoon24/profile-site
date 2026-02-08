import React, { useRef, useState, useEffect } from 'react';
import ResumePaper from './ResumePaper';
import { useA4Scale } from '../hooks/useA4Scale';
import { useAutoFitFont } from '../hooks/useAutoFitFont';
// import { ReactToPrint } from 'react-to-print'; // Dynamic import used instead
import '../styles/preview.css';

const ResumePreviewModal = ({ isOpen, onClose, data }) => {
    // console.log('[ResumePreviewModal] Data Prop:', data); // Debug Log
    const stageRef = useRef(null);
    const paperRef = useRef(null);
    const autoScale = useA4Scale(stageRef);
    const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | '100'
    const [ReactToPrint, setReactToPrint] = useState(null);

    const scale = zoomMode === 'fit' ? autoScale : 1.0;

    // Toolbar States
    const [forceOnePage, setForceOnePage] = useState(true);

    // Auto Fit Settings - Only active when Force 1-Page is checked
    // maxHeight: 1123px (A4@96dpi height) - padding(approx 40px*2) = ~1040 safely.
    // Let's be conservative: 1050px.
    const { fontSize, status } = useAutoFitFont(paperRef, data, 1050, {
        minSize: 10,
        active: forceOnePage // New option to toggle activity
    });

    // Load ReactToPrint dynamically to avoid build crash
    useEffect(() => {
        if (isOpen) {
            // import('react-to-print')
            //     .then(module => {
            //         // v3 export might be module.ReactToPrint or module.default.ReactToPrint or just module.default
            //         // Let's check keys or rely on named export if verified.
            //         // package.json says main: lib/index.js.
            //         if (module.ReactToPrint) setReactToPrint(() => module.ReactToPrint);
            //         else if (module.default && module.default.ReactToPrint) setReactToPrint(() => module.default.ReactToPrint);
            //         else if (module.default) setReactToPrint(() => module.default);
            //     })
            //     .catch(err => console.error("Failed to load react-to-print", err));
            console.log("React-to-print disabled for build check");
        }
    }, [isOpen]);


    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="preview-modal-overlay">
            <div className="preview-modal-content">
                {/* Header & Toolbar */}
                <div className="preview-modal-header">
                    <div className="preview-header-left">
                        <span className="preview-title">A4 Print Preview</span>

                        <div className="toolbar-group">
                            <label className="toolbar-label">
                                <input
                                    type="checkbox"
                                    checked={forceOnePage}
                                    onChange={e => setForceOnePage(e.target.checked)}
                                />
                                Force 1-Page
                            </label>
                        </div>

                        <div className="toolbar-group">
                            <label className="toolbar-label">Zoom:</label>
                            <div className="zoom-controls">
                                <button
                                    className={`zoom-btn ${zoomMode === 'fit' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setZoomMode('fit');
                                    }}
                                >
                                    FIT
                                </button>
                                <button
                                    className={`zoom-btn ${zoomMode === '100' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setZoomMode('100');
                                    }}
                                >
                                    100%
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="preview-actions">
                        <button className="btn-close" onClick={onClose}>
                            Close (닫기)
                        </button>
                        {ReactToPrint ? (
                            <ReactToPrint
                                trigger={() => <button className="btn-save">🖨️ Print / Save as PDF</button>}
                                content={() => paperRef.current}
                                documentTitle={`Resume_${data.name || 'User'}`}
                                onAfterPrint={() => console.log('Print success')}
                                removeAfterPrint
                            />
                        ) : (
                            <button className="btn-save" disabled>
                                Loading Print...
                            </button>
                        )}
                    </div>
                </div>

                {/* Stage */}
                <div className="preview-stage" ref={stageRef} style={{ overflow: zoomMode === '100' ? 'auto' : 'hidden', display: zoomMode === '100' ? 'block' : 'grid' }}>
                    {/* Transform Wrapper */}
                    <div
                        className="paper-transform-wrapper"
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: zoomMode === '100' ? 'top center' : 'center',
                            margin: zoomMode === '100' ? '40px auto' : '0'
                        }}
                    >
                        {/* The Actual A4 Paper DOM - Allow auto height for overflow */}
                        <div
                            style={{
                                width: '100%',
                                height: 'auto', // Allow expansion
                                minHeight: '100%',
                                fontSize: forceOnePage ? `${fontSize}px` : undefined // Only apply font size if forced
                            }}
                        >
                            <ResumePaper ref={paperRef} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePreviewModal;
