import React, { forwardRef } from 'react';
import '../../../styles/resume-form.css';

const ResumePaper_Future = forwardRef(({ data }, ref) => {

    // Overflow Check
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

    // --- FUTURE THEME CONSTANTS ---
    const ACCENT_COLOR = '#00e5ff'; // Neon Cyan
    const BG_COLOR = '#ffffff';
    const TEXT_MAIN = '#111';
    const TEXT_MUTED = '#666';
    const BORDER_COLOR = '#eee';

    // Google Font Injection for 'Orbitron'
    React.useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const styles = {
        page: {
            background: BG_COLOR,
            color: TEXT_MAIN,
            fontFamily: "'Inter', sans-serif",
            padding: '40px 50px',
            minHeight: '297mm',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        },
        header: {
            borderBottom: `1px solid ${ACCENT_COLOR}`,
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        name: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '32px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin: 0
        },
        role: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '14px',
            color: ACCENT_COLOR,
            fontWeight: '600',
            letterSpacing: '1px',
            marginTop: '5px'
        },
        contact: {
            fontSize: '12px',
            textAlign: 'right',
            color: TEXT_MUTED,
            lineHeight: 1.6
        },
        section: {
            marginBottom: '10px'
        },
        sectionTitle: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '16px',
            fontWeight: '700',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px',
            color: TEXT_MAIN
        },
        line: {
            flex: 1,
            height: '1px',
            background: BORDER_COLOR
        },
        grid2: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
        },
        expItem: {
            marginBottom: '20px',
            borderLeft: `2px solid ${ACCENT_COLOR}`,
            paddingLeft: '15px'
        },
        expHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px'
        },
        expRole: {
            fontWeight: '700',
            fontSize: '14px'
        },
        expDate: {
            fontSize: '12px',
            color: ACCENT_COLOR,
            fontFamily: "'Orbitron', sans-serif"
        },
        expCompany: {
            fontSize: '13px',
            color: TEXT_MUTED,
            marginBottom: '5px'
        },
        skillTag: {
            border: `1px solid ${BORDER_COLOR}`,
            padding: '5px 10px',
            fontSize: '11px',
            display: 'inline-block',
            marginRight: '8px',
            marginBottom: '8px',
            fontFamily: "'Orbitron', sans-serif",
            color: TEXT_MUTED
        }
    };

    return (
        <div className={`a4-page ${data?.__mode || 'preview'}`} ref={(node) => {
            pageRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }} style={{ padding: 0 }}>

            {isOverflowing && (
                <div style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    background: ACCENT_COLOR, color: 'black', padding: '5px 15px', borderRadius: '4px',
                    zIndex: 9999, fontSize: '12px', fontWeight: 'bold'
                }}>
                    SYSTEM OVERLOAD: REDUCE CONTENT
                </div>
            )}

            <div style={styles.page}>
                {/* Header */}
                <header style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {data.basicInfo?.profileImage && (
                            <img
                                src={data.basicInfo.profileImage}
                                alt="Profile"
                                style={{
                                    width: '80px', height: '80px',
                                    objectFit: 'cover',
                                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
                                    border: `2px solid ${ACCENT_COLOR}`
                                }}
                            />
                        )}
                        <div>
                            <h1 style={styles.name}>{data.basicInfo?.fullName}</h1>
                            <div style={styles.role}>{data.basicInfo?.role || 'CYBER SECURITY ANALYST'}</div>
                        </div>
                    </div>
                    <div style={styles.contact}>
                        <div>{data.basicInfo?.email}</div>
                        <div>{data.basicInfo?.phone}</div>
                        <div>{data.basicInfo?.address}</div>
                    </div>
                </header>

                {/* Summary */}
                <section style={styles.section}>
                    <div style={styles.sectionTitle}>
                        <span style={{ color: ACCENT_COLOR }}>&gt;</span> MISSION OBJECTIVE <div style={styles.line}></div>
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#444' }}>
                        {data.basicInfo?.summary}
                    </p>
                </section>

                {/* Main Grid */}
                <div style={styles.grid2}>
                    {/* Left Col: Experience */}
                    <div>
                        <div style={styles.sectionTitle}>
                            <span style={{ color: ACCENT_COLOR }}>&gt;</span> LOGS (EXPERIENCE) <div style={styles.line}></div>
                        </div>
                        {(data.experience || []).map((item, i) => (
                            <div key={i} style={styles.expItem}>
                                <div style={styles.expHeader}>
                                    <span style={styles.expRole}>{item.role}</span>
                                    <span style={styles.expDate}>{item.period}</span>
                                </div>
                                <div style={styles.expCompany}>{item.company}</div>
                                <div style={{ fontSize: '12px', color: '#555' }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    {/* Right Col: Skills & Edu */}
                    <div>
                        {/* Skills */}
                        <div style={{ marginBottom: '30px' }}>
                            <div style={styles.sectionTitle}>
                                <span style={{ color: ACCENT_COLOR }}>&gt;</span> PROTOCOLS (SKILLS) <div style={styles.line}></div>
                            </div>
                            <div>
                                {(Array.isArray(data.skills) ? data.skills : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)).map((skill, i) => (
                                    <span key={i} style={styles.skillTag}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div>
                            <div style={styles.sectionTitle}>
                                <span style={{ color: ACCENT_COLOR }}>&gt;</span> DATABASE (EDUCATION) <div style={styles.line}></div>
                            </div>
                            {(data.education || []).map((item, i) => (
                                <div key={i} style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{item.school}</div>
                                    <div style={{ fontSize: '12px', color: ACCENT_COLOR }}>{item.major}</div>
                                    <div style={{ fontSize: '11px', color: TEXT_MUTED }}>{item.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ResumePaper_Future;
