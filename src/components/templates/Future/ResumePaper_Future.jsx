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

    // --- FUTURE THEME CONSTANTS (프리미엄 업그레이드) ---
    const ACCENT_COLOR = '#0d9488'; // 뮤트드 틸 (네온→세련된 톤)
    const ACCENT_GLOW = 'rgba(13, 148, 136, 0.15)'; // 은은한 글로우
    const BG_COLOR = '#fafbfc'; // 미세하게 차가운 화이트
    const TEXT_MAIN = '#0f172a'; // 슬레이트-900 (깊은 대비)
    const TEXT_MUTED = '#64748b'; // 슬레이트-500
    const BORDER_COLOR = '#e2e8f0'; // 슬레이트-200

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
            padding: '45px 50px',
            minHeight: '297mm',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px' // 간격 확대
        },
        header: {
            borderBottom: `2px solid ${ACCENT_COLOR}`,
            paddingBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        name: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '30px', // 약간 축소하여 세련됨
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            margin: 0,
            color: TEXT_MAIN
        },
        role: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '11px',
            color: ACCENT_COLOR,
            fontWeight: '600',
            letterSpacing: '2px',
            marginTop: '8px'
        },
        contact: {
            fontSize: '12px',
            textAlign: 'right',
            color: TEXT_MUTED,
            lineHeight: 1.8
        },
        section: {
            marginBottom: '12px'
        },
        sectionTitle: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '11px', // 작고 넓은 자간으로 고급감
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
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
            gap: '36px' // 그리드 간격 확대
        },
        expItem: {
            marginBottom: '24px', // 간격 확대
            borderLeft: `2px solid ${ACCENT_COLOR}`,
            paddingLeft: '16px'
        },
        expHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px'
        },
        expRole: {
            fontWeight: '700',
            fontSize: '14px',
            color: TEXT_MAIN
        },
        expDate: {
            fontSize: '11px',
            color: ACCENT_COLOR,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.5px'
        },
        expCompany: {
            fontSize: '12px',
            color: TEXT_MUTED,
            marginBottom: '6px'
        },
        skillTag: {
            border: `1px solid ${BORDER_COLOR}`,
            padding: '6px 12px',
            fontSize: '11px',
            display: 'inline-block',
            marginRight: '8px',
            marginBottom: '8px',
            fontFamily: "'Orbitron', sans-serif",
            color: TEXT_MUTED,
            letterSpacing: '0.5px',
            background: 'white'
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
