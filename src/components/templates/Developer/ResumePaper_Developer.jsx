import React, { forwardRef } from 'react';
import { useResume } from '../../../context/ResumeContext';
import EditableText from '../../common/EditableText';
import '../../../styles/resume-form.css'; // Keep existing styles for Developer template

const ResumePaper_Developer = forwardRef(({ data }, ref) => {
    const { setData, isEditMode } = useResume(); // Use context for updates

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

    // Helper functions for updates
    const updateBasicInfo = (field, value) => {
        setData(prev => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [field]: value }
        }));
    };

    const updateList = (index, field, value, type) => {
        const newList = [...(data[type] || [])];
        newList[index] = { ...newList[index], [field]: value };
        setData(prev => ({ ...prev, [type]: newList }));
    };

    const addListItem = (type) => {
        const newItem = type === 'experience'
            ? { id: Date.now(), company: 'Company Name', role: 'Role', period: '2024 - Present', desc: 'Description...' }
            : { id: Date.now(), school: 'School Name', major: 'Major', year: '2024' };

        setData(prev => ({
            ...prev,
            [type]: [...(prev[type] || []), newItem]
        }));
    };

    const removeListItem = (index, type) => {
        if (!window.confirm('Remove this item?')) return;
        const newList = [...(data[type] || [])];
        newList.splice(index, 1);
        setData(prev => ({ ...prev, [type]: newList }));
    };

    const updateSkills = (value) => {
        setData(prev => ({ ...prev, skills: value }));
    };


    if (!data) return null;

    return (
        <div className={`a4-page ${data?.__mode || 'preview'} font-size-${data?.theme?.fontSize || 'medium'}`} ref={(node) => {
            pageRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        }} id="resume-print-root">

            {/* Overflow Warning Badge */}
            {isOverflowing && (
                <div style={{
                    position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                    background: '#ff4444', color: 'white', padding: '8px 16px', borderRadius: '20px',
                    fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                    zIndex: 9999, whiteSpace: 'nowrap', animation: 'bounce 1s infinite'
                }}>
                    ⚠️ Content Exceeds 1 Page
                </div>
            )}

            <div className="resume-content-wrapper">
                {/* 1. Header with Title */}
                <header className="form-header">
                    <div className="form-icon">📝</div>
                    <div className="form-title-group" style={{ width: '100%' }}>
                        <h1 className="form-title">
                            <EditableText
                                value={data.basicInfo?.role}
                                onChange={(val) => updateBasicInfo('role', val)}
                                isEditMode={isEditMode}
                                placeholder="TARGET ROLE / TITLE"
                            />
                        </h1>
                        <div className="form-desc">
                            <EditableText
                                value={data.basicInfo?.summary}
                                onChange={(val) => updateBasicInfo('summary', val)}
                                isEditMode={isEditMode}
                                multiline
                                placeholder="Professional Summary..."
                            />
                        </div>
                    </div>
                </header>

                {/* 2. Personal Information */}
                <section className="form-section">
                    <h2 className="form-section-title">PERSONAL INFORMATION</h2>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Full Name:</span>
                        <div className="field-input">
                            <EditableText
                                value={data.basicInfo?.fullName}
                                onChange={(val) => updateBasicInfo('fullName', val)}
                                isEditMode={isEditMode}
                                placeholder="Your Full Name"
                            />
                        </div>
                    </div>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Email:</span>
                        <div className="field-input">
                            <EditableText
                                value={data.basicInfo?.email}
                                onChange={(val) => updateBasicInfo('email', val)}
                                isEditMode={isEditMode}
                                placeholder="email@address.com"
                            />
                        </div>
                    </div>

                    <div className="form-field-row">
                        <span className="field-bullet">•</span>
                        <span className="field-label">Phone:</span>
                        <div className="field-input">
                            <EditableText
                                value={data.basicInfo?.phone}
                                onChange={(val) => updateBasicInfo('phone', val)}
                                isEditMode={isEditMode}
                                placeholder="010-0000-0000"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Experience */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        PROFESSIONAL EXPERIENCE
                        {isEditMode && <button onClick={() => addListItem('experience')} className="add-item-btn-text" style={{ fontSize: '12px', marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#666', textDecoration: 'underline' }}>+ Add</button>}
                    </h2>

                    {(!data.experience || data.experience.length === 0) && !isEditMode && (
                        <div style={{ color: '#ccc', padding: '10px' }}>(No Experience Added)</div>
                    )}

                    {(data?.experience || []).map((item, index) => (
                        <div key={index} className="form-exp-item" style={{ position: 'relative' }}>
                            {isEditMode && (
                                <button
                                    onClick={() => removeListItem(index, 'experience')}
                                    style={{ position: 'absolute', right: -25, top: 0, color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                                    title="Remove Item"
                                >
                                    ×
                                </button>
                            )}
                            <div className="exp-header-row">
                                <div className="field-half">
                                    <span className="field-bullet">•</span>
                                    <span className="field-label">Company:</span>
                                    <div className="field-input">
                                        <EditableText
                                            value={item.company}
                                            onChange={(val) => updateList(index, 'company', val, 'experience')}
                                            isEditMode={isEditMode}
                                            placeholder="Company Name"
                                        />
                                    </div>
                                </div>
                                <div className="field-half">
                                    <span className="field-label">Date:</span>
                                    <div className="field-input">
                                        <EditableText
                                            value={item.period}
                                            onChange={(val) => updateList(index, 'period', val, 'experience')}
                                            isEditMode={isEditMode}
                                            placeholder="YYYY.MM - Present"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-field-row" style={{ marginTop: '-4px' }}>
                                <span className="field-bullet" style={{ visibility: 'hidden' }}>•</span>
                                <span className="field-label">Role:</span>
                                <div className="field-input">
                                    <EditableText
                                        value={item.role}
                                        onChange={(val) => updateList(index, 'role', val, 'experience')}
                                        isEditMode={isEditMode}
                                        placeholder="Job Title / Role"
                                    />
                                </div>
                            </div>
                            <div className="exp-desc-box">
                                <EditableText
                                    value={item.desc}
                                    onChange={(val) => updateList(index, 'desc', val, 'experience')}
                                    isEditMode={isEditMode}
                                    multiline
                                    placeholder="Describe your responsibilities and achievements..."
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. Education */}
                <section className="form-section">
                    <h2 className="form-section-title">
                        EDUCATION
                        {isEditMode && <button onClick={() => addListItem('education')} className="add-item-btn-text" style={{ fontSize: '12px', marginLeft: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#666', textDecoration: 'underline' }}>+ Add</button>}
                    </h2>

                    {(!data.education || data.education.length === 0) && !isEditMode && (
                        <div style={{ color: '#ccc', padding: '10px' }}>(No Education Added)</div>
                    )}

                    {(data?.education || []).map((item, index) => (
                        <div key={index} className="form-field-row" style={{ position: 'relative' }}>
                            {isEditMode && (
                                <button
                                    onClick={() => removeListItem(index, 'education')}
                                    style={{ position: 'absolute', right: -25, top: 0, color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                                    title="Remove Item"
                                >
                                    ×
                                </button>
                            )}
                            <span className="field-bullet">•</span>
                            <span className="field-label">School:</span>
                            <div className="field-input">
                                <EditableText
                                    value={item.school}
                                    onChange={(val) => updateList(index, 'school', val, 'education')}
                                    isEditMode={isEditMode}
                                    placeholder="University / School"
                                />
                                <span style={{ margin: '0 5px' }}>-</span>
                                <EditableText
                                    value={item.major}
                                    onChange={(val) => updateList(index, 'major', val, 'education')}
                                    isEditMode={isEditMode}
                                    placeholder="Major"
                                    style={{ width: '40%' }}
                                />
                                <span style={{ margin: '0 5px' }}>(</span>
                                <EditableText
                                    value={item.year}
                                    onChange={(val) => updateList(index, 'year', val, 'education')}
                                    isEditMode={isEditMode}
                                    placeholder="Year"
                                    style={{ width: '60px' }}
                                />
                                <span>)</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 5. Skills */}
                <section className="form-section">
                    <h2 className="form-section-title">SKILLS & QUALIFICATIONS</h2>

                    {isEditMode ? (
                        <EditableText
                            value={data.skills}
                            onChange={updateSkills}
                            isEditMode={true}
                            multiline
                            placeholder="Enter skills separated by commas (e.g. React, JavaScript, Node.js)"
                            style={{ minHeight: '60px' }}
                        />
                    ) : (
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
                        </div>
                    )}
                </section>

                {/* 6. Footer / Agreement */}
                <div className="form-footer">
                    <h2 className="form-section-title">AGREEMENT</h2>
                    <p className="agreement-text">
                        I hereby certify that the information contained in this application form is true and correct to the best of my knowledge.
                    </p>
                    <div className="signature-row">
                        <div className="field-half">
                            <span className="field-label">Signature:</span>
                            <div className="field-input" style={{ fontFamily: '"Dancing Script", cursive', fontSize: '24px', lineHeight: '1.2' }}>
                                {data.basicInfo?.fullName}
                            </div>
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

export default ResumePaper_Developer;
