import React, { forwardRef } from 'react';
import '../styles/resume-form.css'; // Switch to Form CSS

const ResumePaper = forwardRef(({ data }, ref) => {
    // Overflow Detection
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const pageRef = React.useRef(null);
    const contentRef = React.useRef(null);

    React.useEffect(() => {
        const checkOverflow = () => {
            if (pageRef.current) {
                // A4 Height ~ 1122px (297mm at 96 DPI)
                // We use scrollHeight to detect actual content size
                const currentHeight = pageRef.current.scrollHeight;
                // Standard A4 height threshold (slightly less than 1122 to be safe)
                // UPDATE: Increased to 1130 to allow slight buffer/margin of error for "Exact 1 Page"
                const MAX_HEIGHT = 1130;

                setIsOverflowing(currentHeight > MAX_HEIGHT);
            }
        };

        // Check on mount and data change
        checkOverflow();

        // Optional: Resize observer for more robustness
        const observer = new ResizeObserver(checkOverflow);
        if (pageRef.current) observer.observe(pageRef.current);

        return () => observer.disconnect();
    }, [data]);

    // Workflow Step 1-B & 3: Log props and Scan keys
    if (data) {
        // ... (logging kept minimal or removed)
    }

    if (!data) return null;

    return (
        <div className={`a4-page ${data?.__mode || 'preview'}`} ref={(node) => {
            // Merge refs: generic ref + internal pageRef
            pageRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }} id="resume-print-root">

            {/* Overflow Warning Badge (Hidden in Print via CSS) */}
            {isOverflowing && (
                <div style={{
                    position: 'absolute',
                    top: -40,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ff4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    whiteSpace: 'nowrap',
                    animation: 'bounce 1s infinite'
                }} className="overflow-warning">
                    ⚠️ Content Exceeds 1 Page (Will be Cut Off)
                </div>
            )}

            {/* Remove Old Debug Overlay */}


            <div className="resume-content-wrapper">
                {/* 1. Header with Title */}
                <header className="form-header">
                    <div className="form-icon">📝</div>
                    <div className="form-title-group">
                        <h1 className="form-title">{data.basicInfo?.role || 'APPLICATION FORM'}</h1>
                        <p className="form-desc">
                            {data.basicInfo?.summary || "Please review the candidate's professional details below. This document serves as a standard profile summary."}
                        </p>
                    </div>
                </header>

                {/* 2. Personal Information (Underlined Fields) */}
                <section className="form-section">
                    <h2 className="form-section-title">PERSONAL INFORMATION</h2>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Full Name:</span>
                        <div className="field-input">{data.basicInfo?.fullName}</div>
                    </div>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Position:</span>
                        <div className="field-input">{data.basicInfo?.role}</div>
                    </div>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Email Address:</span>
                        <div className="field-input">{data.basicInfo?.email}</div>
                    </div>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Phone Number:</span>
                        <div className="field-input">{data.basicInfo?.phone}</div>
                    </div>
                </section>

                {/* 3. Experience (Styled as Form Entries) - Forced Render for Visibility Check */}
                <section className="form-section">
                    <h2 className="form-section-title">PROFESSIONAL EXPERIENCE</h2>
                    {(!data.experience || data.experience.length === 0) && (
                        <div style={{ color: '#ccc', padding: '10px' }}>(No Experience Added)</div>
                    )}
                    {(data.experience || []).map((item, index) => (
                        <div key={index} className="form-exp-item">
                            <div className="exp-header-row">
                                <div className="field-half">
                                    <span className="field-bullet">•</span>
                                    <span className="field-label">Company:</span>
                                    <div className="field-input">{item.company}</div>
                                </div>
                                <div className="field-half">
                                    <span className="field-label">Date:</span>
                                    <div className="field-input">{item.period}</div>
                                </div>
                            </div>
                            <div className="form-field-row" style={{ marginTop: '-4px' }}>
                                <span className="field-bullet" style={{ visibility: 'hidden' }}>•</span>
                                <span className="field-label">Role:</span>
                                <div className="field-input">{item.role}</div>
                            </div>
                            <div className="exp-desc-box">
                                {item.desc}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. Education - Forced Render */}
                <section className="form-section">
                    <h2 className="form-section-title">EDUCATION</h2>
                    {(!data.education || data.education.length === 0) && (
                        <div style={{ color: '#ccc', padding: '10px' }}>(No Education Added)</div>
                    )}
                    {(data.education || []).map((item, index) => (
                        <div key={index} className="form-field-row">
                            <span className="field-bullet">•</span>
                            <span className="field-label">School:</span>
                            <div className="field-input">
                                {item.school} ({item.major}) - {item.year}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 5. Skills (Checkboxes) - Safe Parse */}
                <section className="form-section">
                    <h2 className="form-section-title">SKILLS & QUALIFICATIONS</h2>
                    <div className="skills-container">
                        {(Array.isArray(data.skills)
                            ? data.skills
                            : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)
                        ).map((skill, i) => (
                            <div key={i} className="checkbox-item">
                                <div className="checkbox-box">✓</div>
                                <span>{skill}</span>
                            </div>
                        ))}
                        {(!data.skills || data.skills.length === 0) && (
                            <div style={{ color: '#ccc', fontSize: '12px' }}>(No Skills Added)</div>
                        )}
                    </div>
                </section>

                {/* 6. Footer / Agreement */}
                <div className="form-footer">
                    <h2 className="form-section-title">AGREEMENT</h2>
                    <p className="agreement-text">
                        I hereby certify that the information contained in this application form is true and correct to the best of my knowledge.
                        I understand that any misrepresentation may lead to disqualification.
                    </p>
                    <div className="signature-row">
                        <div className="field-half">
                            <span className="field-label">Signature:</span>
                            <div className="field-input" style={{ fontFamily: '"Dancing Script", cursive', fontSize: '24px', lineHeight: '1.2' }}>{data.basicInfo?.fullName}</div>
                        </div>
                        <div className="field-half">
                            <span className="field-label">Date:</span>
                            <div className="field-input">{new Date().toISOString().slice(0, 10)}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default ResumePaper;
