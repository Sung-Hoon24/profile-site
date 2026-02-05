import React, { forwardRef } from 'react';
import '../../../styles/resume-form.css'; // Temporarily share styles, will isolate later

const ResumePaper_Designer = forwardRef(({ data }, ref) => {
    // Overflow Detection
    const [isOverflowing, setIsOverflowing] = React.useState(false);
    const pageRef = React.useRef(null);

    React.useEffect(() => {
        const checkOverflow = () => {
            if (pageRef.current) {
                const currentHeight = pageRef.current.scrollHeight;
                const MAX_HEIGHT = 1130;
                setIsOverflowing(currentHeight > MAX_HEIGHT);
            }
        };

        checkOverflow();
        const observer = new ResizeObserver(checkOverflow);
        if (pageRef.current) observer.observe(pageRef.current);

        return () => observer.disconnect();
    }, [data]);

    if (!data) return null;

    return (
        <div className={`a4-page ${data?.__mode || 'preview'}`} ref={(node) => {
            pageRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }} id="resume-print-root">

            {isOverflowing && (
                <div className="overflow-warning" style={{
                    position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                    background: '#9c27b0', color: 'white', padding: '8px 16px', borderRadius: '20px',
                    zIndex: 9999, whiteSpace: 'nowrap'
                }}>
                    ⚠️ Designer Content Overflow
                </div>
            )}

            <div className="resume-content-wrapper" style={{ fontFamily: 'sans-serif' }}>
                {/* Header - Designer Style */}
                <header className="form-header" style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                    <div className="form-icon" style={{ background: '#9c27b0' }}>🎨</div>
                    <div className="form-title-group" style={{ textAlign: 'right' }}>
                        <h1 className="form-title" style={{ color: '#9c27b0' }}>
                            {data.basicInfo?.role || 'DESIGNER PROFILE'}
                        </h1>
                        <p className="form-desc" style={{ marginLeft: 'auto' }}>
                            {data.basicInfo?.summary || "Creative portfolio and professional background."}
                        </p>
                    </div>
                </header>

                {/* Main Content - Two Column Layout for Designer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

                    {/* Left Column */}
                    <aside>
                        <section className="form-section">
                            <h2 className="form-section-title" style={{ borderBottom: '2px solid #9c27b0', paddingBottom: '5px' }}>Contact</h2>
                            <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
                                <div><strong>Email:</strong> {data.basicInfo?.email}</div>
                                <div><strong>Phone:</strong> {data.basicInfo?.phone}</div>
                                <div><strong>Name:</strong> {data.basicInfo?.fullName}</div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2 className="form-section-title" style={{ borderBottom: '2px solid #9c27b0', paddingBottom: '5px' }}>Skills</h2>
                            <div className="skills-container" style={{ gridTemplateColumns: '1fr' }}>
                                {(Array.isArray(data.skills) ? data.skills : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)).map((skill, i) => (
                                    <div key={i} className="checkbox-item">
                                        <div className="checkbox-box" style={{ borderColor: '#9c27b0' }}>•</div>
                                        <span>{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </aside>

                    {/* Right Column */}
                    <main>
                        <section className="form-section">
                            <h2 className="form-section-title" style={{ color: '#9c27b0' }}>Experience</h2>
                            {(data.experience || []).map((item, index) => (
                                <div key={index} style={{ marginBottom: '15px', borderLeft: '2px solid #ddd', paddingLeft: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.company}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{item.period} | {item.role}</div>
                                    <div style={{ fontSize: '12px', marginTop: '5px' }}>{item.desc}</div>
                                </div>
                            ))}
                        </section>

                        <section className="form-section">
                            <h2 className="form-section-title" style={{ color: '#9c27b0' }}>Education</h2>
                            {(data.education || []).map((item, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{item.school}</div>
                                    <div style={{ fontSize: '12px' }}>{item.major} ({item.year})</div>
                                </div>
                            ))}
                        </section>
                    </main>
                </div>

                {/* Footer */}
                <div className="form-footer" style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
                    <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: '24px', color: '#9c27b0' }}>
                        {data.basicInfo?.fullName}
                    </div>
                </div>

            </div>
        </div>
    );
});

export default ResumePaper_Designer;
