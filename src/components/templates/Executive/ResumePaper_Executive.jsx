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

    // --- EXECUTIVE THEME CONSTANTS ---
    const PRIMARY_COLOR = '#1a237e'; // Navy Blue
    const ACCENT_COLOR = '#c5a059'; // Muted Gold
    const TEXT_MAIN = '#222';
    const TEXT_MUTED = '#555';
    const BORDER_COLOR = '#ddd';

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
            gap: '35px'
        },
        header: {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
            paddingBottom: '25px',
            textAlign: 'center'
        },
        name: {
            fontFamily: "'Merriweather', serif",
            fontSize: '36px',
            fontWeight: '900',
            color: PRIMARY_COLOR,
            margin: '0 0 10px 0',
            letterSpacing: '-0.5px'
        },
        role: {
            fontFamily: "'Merriweather', serif",
            fontSize: '16px',
            color: ACCENT_COLOR,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '15px'
        },
        contactRow: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            fontSize: '13px',
            color: TEXT_MUTED,
            fontFamily: "'Lato', sans-serif"
        },
        section: {
            marginBottom: '10px'
        },
        sectionTitle: {
            fontFamily: "'Merriweather', serif",
            fontSize: '18px',
            fontWeight: '700',
            color: PRIMARY_COLOR,
            textTransform: 'uppercase',
            borderBottom: `1px solid ${ACCENT_COLOR}`,
            paddingBottom: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        summaryText: {
            fontSize: '14px',
            lineHeight: 1.8,
            color: '#333',
            textAlign: 'justify'
        },
        expItem: {
            marginBottom: '25px',
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '20px'
        },
        expDate: {
            fontSize: '13px',
            color: TEXT_MUTED,
            fontWeight: '700',
            textAlign: 'right',
            paddingTop: '3px'
        },
        expContent: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        },
        expRole: {
            fontSize: '15px',
            fontWeight: '700',
            color: PRIMARY_COLOR,
            fontFamily: "'Merriweather', serif"
        },
        expCompany: {
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#444'
        },
        expDesc: {
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#444',
            marginTop: '5px'
        },
        skillGrid: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px'
        },
        skillTag: {
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: '4px',
            padding: '6px 14px',
            fontSize: '12px',
            background: '#fcfcfc',
            color: '#333'
        },
        eduItem: {
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: `1px dashed ${BORDER_COLOR}`,
            paddingBottom: '10px'
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
