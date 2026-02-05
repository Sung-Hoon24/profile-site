import React, { forwardRef } from 'react';
import '../../../styles/resume-form.css';

const ResumePaper_Startup = forwardRef(({ data }, ref) => {
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

    // --- STARTUP THEME (SWISS STYLE) ---
    const ACCENT_RED = '#ff3b30'; // Swiss Red
    const DARK_BG = '#111';
    const TEXT_MAIN = '#000';

    // Google Font Injection for 'Oswald' & 'Inter'
    React.useEffect(() => {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;600;800&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => document.head.removeChild(link);
    }, []);

    const styles = {
        page: {
            background: '#ffffff',
            color: TEXT_MAIN,
            fontFamily: "'Inter', sans-serif",
            padding: '40px',
            minHeight: '297mm',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr', // Left 1/3, Right 2/3
            gap: '40px'
        },
        leftCol: {
            borderRight: `4px solid ${TEXT_MAIN}`,
            paddingRight: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        },
        rightCol: {
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
        },
        name: {
            fontFamily: "'Oswald', sans-serif",
            fontSize: '64px',
            lineHeight: 0.9,
            fontWeight: '700',
            textTransform: 'uppercase',
            color: TEXT_MAIN,
            wordBreak: 'break-word'
        },
        role: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '18px',
            fontWeight: '800',
            background: TEXT_MAIN,
            color: '#fff',
            display: 'inline-block',
            padding: '5px 12px',
            marginTop: '20px',
            textTransform: 'uppercase'
        },
        sectionTitle: {
            fontFamily: "'Oswald', sans-serif",
            fontSize: '24px',
            fontWeight: '700',
            textTransform: 'uppercase',
            borderBottom: `4px solid ${ACCENT_RED}`,
            display: 'inline-block',
            marginBottom: '20px',
            paddingBottom: '5px'
        },
        contactItem: {
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'flex',
            flexDirection: 'column'
        },
        contactLabel: {
            fontSize: '10px',
            color: '#666',
            textTransform: 'uppercase'
        },
        expItem: {
            marginBottom: '30px'
        },
        expRole: {
            fontSize: '20px',
            fontWeight: '800',
            color: ACCENT_RED
        },
        expCompany: {
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '5px'
        },
        expDate: {
            fontSize: '14px',
            fontWeight: '500',
            color: '#555',
            fontStyle: 'italic',
            marginBottom: '10px'
        },
        expDesc: {
            fontSize: '14px',
            lineHeight: 1.5,
            fontWeight: '400'
        },
        skillTag: {
            display: 'inline-block',
            padding: '8px 12px',
            background: '#eee',
            fontSize: '14px',
            fontWeight: '700',
            margin: '0 8px 8px 0',
            borderLeft: `3px solid ${ACCENT_RED}`
        },
        summaryBox: {
            border: `2px solid ${TEXT_MAIN}`,
            padding: '20px',
            fontSize: '15px',
            lineHeight: 1.6,
            fontWeight: '500'
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
                    position: 'absolute', top: 10, right: 10,
                    background: ACCENT_RED, color: 'white', padding: '5px 10px',
                    zIndex: 9999, fontSize: '12px', fontWeight: 'bold'
                }}>
                    ⚠️ OVERFLOW
                </div>
            )}

            <div style={styles.page}>
                {/* LEFT COLUMN - Identity & Skills */}
                <div style={styles.leftCol}>
                    <div>
                        <h1 style={styles.name}>{data.basicInfo?.fullName}</h1>
                        <div style={styles.role}>{data.basicInfo?.role || 'Growth Hacker'}</div>
                    </div>

                    {data.basicInfo?.profileImage && (
                        <img
                            src={data.basicInfo.profileImage}
                            alt="Profile"
                            style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                objectFit: 'cover',
                                filter: 'grayscale(100%) contrast(1.2)' // Swiss Style: Grayscale High Contrast
                            }}
                        />
                    )}

                    <div>
                        <div style={styles.sectionTitle}>Contact</div>
                        <div style={styles.contactItem}>
                            <span style={styles.contactLabel}>Email</span>
                            {data.basicInfo?.email}
                        </div>
                        <div style={styles.contactItem}>
                            <span style={styles.contactLabel}>Phone</span>
                            {data.basicInfo?.phone}
                        </div>
                        <div style={styles.contactItem}>
                            <span style={styles.contactLabel}>Base</span>
                            {data.basicInfo?.address || 'Seoul, KR'}
                        </div>
                    </div>

                    <div>
                        <div style={styles.sectionTitle}>Skills</div>
                        <div>
                            {(Array.isArray(data.skills) ? data.skills : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)).map((skill, i) => (
                                <span key={i} style={styles.skillTag}>{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - Experience */}
                <div style={styles.rightCol}>
                    <div style={styles.summaryBox}>
                        "{data.basicInfo?.summary}"
                    </div>

                    <div>
                        <div style={styles.sectionTitle}>Experience</div>
                        {(data.experience || []).map((item, i) => (
                            <div key={i} style={styles.expItem}>
                                <div style={styles.expRole}>{item.role}</div>
                                <div style={styles.expCompany}>{item.company}</div>
                                <div style={styles.expDate}>{item.period}</div>
                                <div style={styles.expDesc}>{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <div style={styles.sectionTitle}>Education</div>
                        {(data.education || []).map((item, i) => (
                            <div key={i} style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '18px', fontWeight: '800' }}>{item.school}</div>
                                <div style={{ fontSize: '14px', color: '#555' }}>{item.major} | {item.year}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ResumePaper_Startup;
