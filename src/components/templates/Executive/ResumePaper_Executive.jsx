import React, { forwardRef } from 'react';
import '../../../styles/resume-form.css';

const ResumePaper_Executive = forwardRef(({ data }, ref) => {

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

    // --- EXECUTIVE THEME CONSTANTS (프리미엄 업그레이드) ---
    const PRIMARY_COLOR = '#1e293b'; // 깊은 슬레이트 (네이비→뮤트드)
    const ACCENT_COLOR = '#a67c52'; // 앤틱 골드 (더 우아한 톤)
    const TEXT_MAIN = '#0f172a';    // 슬레이트-900
    const TEXT_MUTED = '#64748b';   // 슬레이트-500
    const BORDER_COLOR = '#e2e8f0'; // 슬레이트-200

    // Google Font Injection for 'Merriweather' (Serif)
    React.useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Lato:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const styles = {
        page: {
            background: '#ffffff',
            color: TEXT_MAIN,
            fontFamily: "'Lato', sans-serif",
            padding: '50px 60px',
            minHeight: '297mm',
            display: 'flex',
            flexDirection: 'column',
            gap: '36px' // 간격 확대
        },
        header: {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
            paddingBottom: '28px', // 확대
            textAlign: 'center'
        },
        name: {
            fontFamily: "'Merriweather', serif",
            fontSize: '38px', // 크고 임팩트 있는 이름
            fontWeight: '900',
            color: PRIMARY_COLOR,
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px',
            lineHeight: 1.15
        },
        role: {
            fontFamily: "'Merriweather', serif",
            fontSize: '12px', // 축소 + 넓은 자간으로 고급감
            color: ACCENT_COLOR,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '3px', // 넓은 자간
            marginBottom: '16px'
        },
        contactRow: {
            display: 'flex',
            justifyContent: 'center',
            gap: '24px', // 간격 확대
            fontSize: '12px',
            color: TEXT_MUTED,
            fontFamily: "'Lato', sans-serif",
            letterSpacing: '0.3px'
        },
        section: {
            marginBottom: '12px' // 약간 확대
        },
        sectionTitle: {
            fontFamily: "'Merriweather', serif",
            fontSize: '11px', // 작고 넓은 자간 = 최고급
            fontWeight: '700',
            color: PRIMARY_COLOR,
            textTransform: 'uppercase',
            letterSpacing: '3px', // 넓은 자간
            borderBottom: `1px solid ${ACCENT_COLOR}`,
            paddingBottom: '10px', // 확대
            marginBottom: '22px', // 확대
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        summaryText: {
            fontSize: '14px',
            lineHeight: 1.85, // 줄간격 확대
            color: TEXT_MUTED,
            textAlign: 'justify',
            fontWeight: '300'
        },
        expItem: {
            marginBottom: '28px', // 항목 간격 확대
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '24px' // 확대
        },
        expDate: {
            fontSize: '12px',
            color: ACCENT_COLOR, // 골드로 날짜 강조
            fontWeight: '700',
            textAlign: 'right',
            paddingTop: '3px',
            letterSpacing: '0.5px'
        },
        expContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: '6px' // 약간 확대
        },
        expRole: {
            fontSize: '15px',
            fontWeight: '700',
            color: PRIMARY_COLOR,
            fontFamily: "'Merriweather', serif",
            letterSpacing: '-0.2px'
        },
        expCompany: {
            fontSize: '13px',
            fontStyle: 'italic',
            color: TEXT_MUTED
        },
        expDesc: {
            fontSize: '13px',
            lineHeight: 1.75, // 줄간격 확대
            color: TEXT_MUTED,
            marginTop: '5px'
        },
        skillGrid: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
        },
        skillTag: {
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: '2px', // 직각에 가까운 형태 (클래식)
            padding: '6px 14px',
            fontSize: '11px',
            background: '#fafbfc',
            color: PRIMARY_COLOR,
            fontWeight: '500',
            letterSpacing: '0.3px'
        },
        eduItem: {
            marginBottom: '18px', // 확대
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${BORDER_COLOR}`, // dashed → solid (클래식)
            paddingBottom: '14px' // 확대
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
                    background: PRIMARY_COLOR, color: 'white', padding: '5px 15px', borderRadius: '4px',
                    zIndex: 9999, fontSize: '12px', fontWeight: 'bold'
                }}>
                    ⚠️ Reduce Content for Executive Layout
                </div>
            )}

            <div style={styles.page}>
                {/* Header */}
                <header style={styles.header}>
                    <h1 style={styles.name}>{data.basicInfo?.fullName}</h1>
                    <div style={styles.role}>{data.basicInfo?.role || 'Chief Executive Officer'}</div>

                    {/* Photo for Executive (Optional, Centered if exists) */}
                    {data.basicInfo?.profileImage && (
                        <div style={{ margin: '0 auto 20px auto', width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${ACCENT_COLOR}` }}>
                            <img src={data.basicInfo.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div style={styles.contactRow}>
                        <span>{data.basicInfo?.email}</span>
                        <span>•</span>
                        <span>{data.basicInfo?.phone}</span>
                        <span>•</span>
                        <span>{data.basicInfo?.address || 'Seoul, Republic of Korea'}</span>
                    </div>
                </header>

                {/* Professional Summary */}
                <section style={styles.section}>
                    <div style={styles.sectionTitle}>Professional Profile</div>
                    <p style={styles.summaryText}>
                        {data.basicInfo?.summary}
                    </p>
                </section>

                {/* Experience (Chronological) */}
                <section style={styles.section}>
                    <div style={styles.sectionTitle}>Executive Experience</div>
                    <div>
                        {(data.experience || []).map((item, i) => (
                            <div key={i} style={styles.expItem}>
                                <div style={styles.expDate}>{item.period}</div>
                                <div style={styles.expContent}>
                                    <div style={styles.expRole}>{item.role}</div>
                                    <div style={styles.expCompany}>{item.company}</div>
                                    <div style={styles.expDesc}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education & Skills (Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <section>
                        <div style={styles.sectionTitle}>Education</div>
                        {(data.education || []).map((item, i) => (
                            <div key={i} style={styles.eduItem}>
                                <div style={{ fontWeight: '700' }}>{item.school}</div>
                                <div style={{ fontSize: '13px' }}>{item.year}</div>
                                <div style={{ fontSize: '12px', fontStyle: 'italic', width: '100%', marginTop: '5px' }}>{item.major}</div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <div style={styles.sectionTitle}>Core Competencies</div>
                        <div style={styles.skillGrid}>
                            {(Array.isArray(data.skills) ? data.skills : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)).map((skill, i) => (
                                <span key={i} style={styles.skillTag}>{skill}</span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
});

export default ResumePaper_Executive;
