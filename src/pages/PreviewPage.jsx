import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useResume } from '../context/ResumeContext';

const PreviewPage = () => {
    const componentRef = useRef();
    const { data } = useResume();

    // Custom handling for react-to-print to properly inject styles
    // In many cases, react-to-print works best when the styles are globally available 
    // or passed via pageStyle prop.
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'my-resume',
        pageStyle: `
        @page { size: A4; margin: 0mm; }
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
        `
    });

    return (
        <div style={{ background: '#333', minHeight: '100vh', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={handlePrint} className="save-btn">Print / Save PDF</button>
                <button onClick={() => window.history.back()} className="save-btn" style={{ background: '#555' }}>Back to Editor</button>
            </div>

            {/* A4 Paper Simulation */}
            <div className="print-container" ref={componentRef}>
                <div className="resume-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '32px', color: 'black', marginBottom: '5px' }}>{data.name || 'Your Name'}</h1>
                    <p style={{ color: '#555', fontSize: '16px' }}>{data.position || 'Position'}</p>
                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
                        <span>{data.email}</span> | <span>{data.phone}</span>
                    </div>
                </div>

                <div className="resume-section print-section">
                    <h2>Summary</h2>
                    <p style={{ lineHeight: '1.6', color: '#333' }}>{data.summary}</p>
                </div>

                {data.experience.length > 0 && (
                    <div className="resume-section print-section">
                        <h2>Experience</h2>
                        {data.experience.map((item, index) => (
                            <div key={index} style={{ marginBottom: '15px', borderLeft: '3px solid #333', paddingLeft: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <strong style={{ fontSize: '16px' }}>{item.company}</strong>
                                    <span style={{ fontSize: '14px', color: '#555' }}>{item.period}</span>
                                </div>
                                <div style={{ fontSize: '15px', fontStyle: 'italic', marginBottom: '5px' }}>{item.role}</div>
                                <p style={{ fontSize: '14px', color: '#444', whiteSpace: 'pre-wrap' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                )}

                {data.education.length > 0 && (
                    <div className="resume-section print-section">
                        <h2>Education</h2>
                        {data.education.map((item, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{item.school}</strong>
                                    <span>{item.year}</span>
                                </div>
                                <div>{item.major}</div>
                            </div>
                        ))}
                    </div>
                )}

                {data.skills && (
                    <div className="resume-section print-section">
                        <h2>Skills</h2>
                        <p style={{ lineHeight: '1.6' }}>{data.skills}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviewPage;
