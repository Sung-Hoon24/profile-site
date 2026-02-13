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

    // --- STARTUP THEME (프리미엄 업그레이드 - SWISS STYLE) ---
    const ACCENT_RED = '#c0392b'; // 뮤트드 다크 레드 (원색→고급 톤)
    const DARK_BG = '#1a1a2e'; // 깊은 차콜 (더 세련된 다크)
    const TEXT_MAIN = '#0f172a'; // 슬레이트-900

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
            padding: '45px', // 여유로운 패딩
            minHeight: '297mm',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '44px' // 간격 확대
        },
        leftCol: {
            borderRight: `3px solid ${TEXT_MAIN}`, // 4px→3px (세련된 비율)
            paddingRight: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px' // 간격 확대
        },
        rightCol: {
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
        },
        name: {
            fontFamily: "'Oswald', sans-serif",
            fontSize: '52px', // 약간 축소하여 세련됨
            lineHeight: 0.92,
            fontWeight: '700',
            textTransform: 'uppercase',
            color: TEXT_MAIN,
            wordBreak: 'break-word',
            letterSpacing: '-1px'
        },
        role: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px', // 축소 + 넓은 자간
            fontWeight: '700',
            background: ACCENT_RED, // 포인트 컬러 적용
            color: '#fff',
            display: 'inline-block',
            padding: '6px 14px',
            marginTop: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px' // 넓은 자간
        },
        sectionTitle: {
            fontFamily: "'Oswald', sans-serif",
            fontSize: '14px', // 축소 + 넓은 자간
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px', // 넓은 자간
            borderBottom: `3px solid ${ACCENT_RED}`, // 4px→3px
            display: 'inline-block',
            marginBottom: '22px', // 확대
            paddingBottom: '8px' // 확대
        },
        contactItem: {
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px', // 간격 확대
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1.5
        },
        contactLabel: {
            fontSize: '10px',
            color: '#94a3b8', // 슬레이트-400 (뮤트드)
            textTransform: 'uppercase',
            letterSpacing: '1px', // 자간 추가
            marginBottom: '2px'
        },
        expItem: {
            marginBottom: '32px' // 간격 확대
        },
        expRole: {
            fontSize: '16px', // 약간 축소
            fontWeight: '800',
            color: ACCENT_RED,
            letterSpacing: '-0.3px'
        },
        expCompany: {
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '4px',
            color: TEXT_MAIN
        },
        expDate: {
            fontSize: '12px',
            fontWeight: '500',
            color: '#94a3b8', // 뮤트드 그레이
            fontStyle: 'italic',
            marginBottom: '10px',
            letterSpacing: '0.3px'
        },
        expDesc: {
            fontSize: '13px',
            lineHeight: 1.7, // 줄간격 확대
            fontWeight: '400',
            color: '#475569' // 슬레이트-600
        },
        skillTag: {
            display: 'inline-block',
            padding: '6px 14px', // 약간 확대
            background: 'transparent', // 투명 배경
            border: `1px solid #e2e8f0`, // 아웃라인 스타일
            fontSize: '12px',
            fontWeight: '600',
            margin: '0 8px 10px 0', // 간격 확대
            borderLeft: `3px solid ${ACCENT_RED}`,
            color: TEXT_MAIN,
            letterSpacing: '0.3px'
        },
        summaryBox: {
            border: `1px solid ${TEXT_MAIN}`, // 2px→1px (세련된 비율)
            padding: '22px', // 확대
            fontSize: '14px',
            lineHeight: 1.75, // 줄간격 확대
            fontWeight: '400',
            color: '#475569' // 슬레이트-600
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
