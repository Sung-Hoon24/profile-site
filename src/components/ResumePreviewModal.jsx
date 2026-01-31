import React, { useRef, useState, useEffect } from 'react';
import ResumePaper from './ResumePaper';
import { useA4Scale } from '../hooks/useA4Scale';
import { useAutoFitFont } from '../hooks/useAutoFitFont';
import { exportToPdf } from '../utils/exportToPdf';
import '../styles/preview.css';

const ResumePreviewModal = ({ isOpen, onClose, data }) => {
    console.log('[ResumePreviewModal] Data Prop:', data); // Debug Log
    const stageRef = useRef(null);
    const paperRef = useRef(null);
    const autoScale = useA4Scale(stageRef);
    const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | '100'

    const scale = zoomMode === 'fit' ? autoScale : 1.0;

    // Toolbar States
    const [quality, setQuality] = useState(2); // 1.5, 2, 3
    const [margin, setMargin] = useState(0); // mm. (Logic handles this in ResumePaper padding usually, but here we can add extra print margin)
    // Actually, margin usually handled by ResumePaper padding (12mm). 
    // Let's interpret this "margin" as the 'print' margin option if needed, 
    // but usually user just wants "Standard" or "No Margin".
    // For simplicity / robustness, let's keep ResumePaper fixed 12mm padding INTERNAL, 
    // and this margin option adds WHITE SPACE around.

    const [forceOnePage, setForceOnePage] = useState(true);

    // Auto Fit Settings - Only active when Force 1-Page is checked
    // maxHeight: 1123px (A4@96dpi height) - padding(approx 40px*2) = ~1040 safely.
    // Let's be conservative: 1050px.
    const { fontSize, status } = useAutoFitFont(paperRef, data, 1050, {
        minSize: 10,
        active: forceOnePage // New option to toggle activity
    });

    // Export State
    const [isSaving, setIsSaving] = useState(false);

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSavePdf = async () => {
        if (!paperRef.current) return;
        setIsSaving(true);

        setTimeout(async () => {
            const filename = `Resume_${data.name || 'User'}_${new Date().toISOString().slice(0, 10)}.pdf`;
            await exportToPdf(paperRef.current, filename, {
                quality: quality,
                margin: 0, // We rely on internal CSS padding
                forceOnePage: forceOnePage
            });
            setIsSaving(false);
        }, 100);
    };

    return (
        <div className="preview-modal-overlay">
            <div className="preview-modal-content">
                {/* Header & Toolbar */}
                <div className="preview-modal-header">
                    <div className="preview-header-left">
                        <span className="preview-title">A4 Print Preview</span>

                        <div className="toolbar-group">
                            <label className="toolbar-label">Quality:</label>
                            <select value={quality} onChange={e => setQuality(Number(e.target.value))} className="toolbar-select">
                                <option value={1.5}>Medium (1.5x)</option>
                                <option value={2}>High (2.0x)</option>
                                <option value={3}>Ultra (3.0x)</option>
                            </select>
                        </div>

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
                                        console.log('FIT clicked');
                                        e.stopPropagation();
                                        setZoomMode('fit');
                                    }}
                                >
                                    FIT
                                </button>
                                <button
                                    className={`zoom-btn ${zoomMode === '100' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        console.log('100% clicked');
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
                        <div className="status-badges">
                            {/* Stats */}
                            <span className="badge info">Scale: {Math.round(scale * 100)}%</span>
                            <span className={`badge ${status === 'OK' ? 'success' : status === 'ADJUSTED' ? 'warning' : 'danger'}`}>
                                {status === 'OK' ? 'Fit' : status === 'ADJUSTED' ? `Auto-Shrink (${fontSize}px)` : 'OVERFLOW'}
                            </span>
                        </div>

                        <button className="btn-close" onClick={onClose} disabled={isSaving}>
                            Close
                        </button>
                        <button className="btn-save" onClick={handleSavePdf} disabled={isSaving}>
                            {isSaving ? 'Saving...' : '💾 Save PDF'}
                        </button>
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
