import React, { forwardRef } from 'react';
// We are using inline styles for isolation, but importing the base CSS for resets
import '../../../styles/resume-form.css';

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

    // --- DESIGNER STYLE CONSTANTS ---
    const THEME_COLOR = '#8e24aa'; // Deep Purple
    const SIDEBAR_BG = '#f3e5f5'; // Light Purple BG for sidebar
    const TEXT_DARK = '#333';
    const TEXT_LIGHT = '#666';

    const styles = {
        page: {
            display: 'grid',
            gridTemplateColumns: '32% 68%',
            height: '100%',
            minHeight: '297mm', // Ensure full A4 height
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            color: TEXT_DARK,
        },
        sidebar: {
            background: SIDEBAR_BG,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            borderRight: '1px solid rgba(0,0,0,0.05)'
        },
        main: {
            padding: '40px 30px',
            background: 'white',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px',
        },
        // Components
        avatarPlaceholder: {
            width: '120px',
            height: '120px',
            background: THEME_COLOR,
            borderRadius: '50%',
            margin: '0 auto 10px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'white',
            boxShadow: '0 4px 10px rgba(142, 36, 170, 0.3)'
        },
        nameTitle: {
            textAlign: 'center',
            marginBottom: '10px'
        },
        h1: {
            fontSize: '28px',
            fontWeight: '800',
            color: THEME_COLOR,
            margin: 0,
            lineHeight: 1.2
        },
        role: {
            fontSize: '14px',
            color: TEXT_LIGHT,
            fontWeight: '600',
            marginTop: '5px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        },
        sectionTitleSide: {
            fontSize: '16px',
            fontWeight: '700',
            color: THEME_COLOR,
            textTransform: 'uppercase',
            borderBottom: `2px solid ${THEME_COLOR}`,
            paddingBottom: '5px',
            marginBottom: '15px'
        },
        sectionTitleMain: {
            fontSize: '20px',
            fontWeight: '800',
            color: TEXT_DARK,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px'
        },
        contactItem: {
            fontSize: '13px',
            marginBottom: '10px',
            wordBreak: 'break-all'
        },
        contactLabel: {
            fontWeight: 'bold',
            display: 'block',
            fontSize: '11px',
            color: THEME_COLOR
        },
        skillTag: {
            display: 'inline-block',
            background: 'white',
            border: `1px solid ${THEME_COLOR}`,
            color: THEME_COLOR,
            padding: '4px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            marginBottom: '8px',
            marginRight: '5px',
            fontWeight: '600'
        },
        expItem: {
            marginBottom: '25px',
            position: 'relative',
            paddingLeft: '20px',
            borderLeft: `2px solid #eee`
        },
        expCompany: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: TEXT_DARK
        },
        expRole: {
            fontSize: '14px',
            color: THEME_COLOR,
            fontWeight: '600',
            marginBottom: '5px'
        },
        expDate: {
            fontSize: '12px',
            color: '#999',
            marginBottom: '8px'
        },
        expDesc: {
            fontSize: '13px',
            lineHeight: 1.6,
            color: '#555'
        }
    };

    return (
        <div className={`a4-page ${data?.__mode || 'preview'}`} ref={(node) => {
            pageRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }} id="resume-print-root" style={{ padding: 0 }}>
            {/* Override default padding for full layout */}

            {isOverflowing && (
                <div className="overflow-warning" style={{
                    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                    background: THEME_COLOR, color: 'white', padding: '8px 16px', borderRadius: '20px',
                    zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                    ⚠️ Minimize Content to Fit 1 Page
                </div>
            )}

            <div style={styles.page}>
                {/* --- LEFT SIDEBAR --- */}
                <aside style={styles.sidebar}>
                    {/* Profile */}
                    <div style={styles.nameTitle}>
                        {data.basicInfo?.profileImage ? (
                            <img
                                src={data.basicInfo.profileImage}
                                alt="Profile"
                                style={{
                                    ...styles.avatarPlaceholder,
                                    background: 'none',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <div style={styles.avatarPlaceholder}>
                                {data.basicInfo?.fullName?.charAt(0) || 'D'}
                            </div>
                        )}
                        <h1 style={styles.h1}>{data.basicInfo?.fullName}</h1>
                        <div style={styles.role}>{data.basicInfo?.role || 'Designer'}</div>
                    </div>

                    {/* Contact */}
                    <section>
                        <h2 style={styles.sectionTitleSide}>Contact</h2>
                        <div style={styles.contactItem}>
                            <span style={styles.contactLabel}>EMAIL</span>
                            {data.basicInfo?.email}
                        </div>
                        <div style={styles.contactItem}>
                            <span style={styles.contactLabel}>PHONE</span>
                            {data.basicInfo?.phone}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 style={styles.sectionTitleSide}>Skills</h2>
                        <div>
                            {(Array.isArray(data.skills) ? data.skills : String(data.skills || '').split(',').map(s => s.trim()).filter(Boolean)).map((skill, i) => (
                                <span key={i} style={styles.skillTag}>{skill}</span>
                            ))}
                        </div>
                    </section>
                </aside>

                {/* --- RIGHT MAIN CONTENT --- */}
                <main style={styles.main}>
                    {/* Summary */}
                    <section>
                        <h2 style={styles.sectionTitleMain}>
                            <span style={{ color: THEME_COLOR }}>//</span> Profile
                        </h2>
                        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#555' }}>
                            {data.basicInfo?.summary || "Driven creative professional with a passion for user-centric design and innovative solutions."}
                        </p>
                    </section>

                    {/* Experience */}
                    <section>
                        <h2 style={styles.sectionTitleMain}>
                            <span style={{ color: THEME_COLOR }}>//</span> Experience
                        </h2>
                        <div>
                            {(data.experience || []).map((item, index) => (
                                <div key={index} style={styles.expItem}>
                                    <div style={styles.expCompany}>{item.company}</div>
                                    <div style={styles.expRole}>{item.role}</div>
                                    <div style={styles.expDate}>{item.period}</div>
                                    <div style={styles.expDesc}>{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                        <h2 style={styles.sectionTitleMain}>
                            <span style={{ color: THEME_COLOR }}>//</span> Education
                        </h2>
                        {(data.education || []).map((item, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{item.school}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>
                                    {item.major}, {item.year}
                                </div>
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
});

export default ResumePaper_Designer;
