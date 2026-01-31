import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';

// Simple Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <span>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

const EditorPanel = () => {
    const { data, setData, saveResume, user } = useResume();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Check if field belongs to basicInfo
        if (['fullName', 'role', 'email', 'phone', 'summary'].includes(name)) {
            setData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    [name]: value
                }
            }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleListChange = (e, index, section) => {
        const { name, value } = e.target;
        setData(prev => {
            const list = [...(prev[section] || [])];
            list[index] = { ...list[index], [name]: value };
            return { ...prev, [section]: list };
        });
    };

    const addItem = (section) => {
        const newItem = section === 'experience'
            ? { company: '', title: '', period: '', desc: '' } // Uses 'title' as per fix
            : { school: '', major: '', year: '' };

        setData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), newItem]
        }));
    };

    const removeItem = (index, section) => {
        setData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="editor-panel">
            <div className="editor-header">
                <h2>Editor</h2>
                {/* ... header actions ... */}
                <div className="editor-actions">
                    <button onClick={saveResume} className="save-btn-primary">
                        {user ? '☁️ Save Checkpoint' : '☁️ Save (Login Req)'}
                    </button>
                </div>
            </div>

            <div className="editor-scroll-area">
                <Accordion title="1. Basic Info" defaultOpen={true}>
                    <div className="form-group-dark">
                        <label>Full Name</label>
                        <input name="fullName" value={data.basicInfo?.fullName || ''} onChange={handleChange} placeholder="Hong Gil Dong" />
                    </div>
                    <div className="form-group-dark">
                        <label>Position / Role</label>
                        <input name="role" value={data.basicInfo?.role || ''} onChange={handleChange} placeholder="Senior Developer" />
                    </div>
                    <div className="form-row-dark">
                        <div className="form-group-dark">
                            <label>Email</label>
                            <input name="email" value={data.basicInfo?.email || ''} onChange={handleChange} placeholder="email@example.com" />
                        </div>
                        <div className="form-group-dark">
                            <label>Phone</label>
                            <input name="phone" value={data.basicInfo?.phone || ''} onChange={handleChange} placeholder="010-0000-0000" />
                        </div>
                    </div>
                    <div className="form-group-dark">
                        <label>Summary / Intro</label>
                        <textarea name="summary" value={data.basicInfo?.summary || ''} onChange={handleChange} rows={4} />
                    </div>
                </Accordion>

                <Accordion title="2. Experience">
                    {data.experience.map((item, index) => (
                        <div key={index} className="sub-card">
                            <div className="card-top-actions">
                                <span className="card-num">#{index + 1}</span>
                                <button onClick={() => removeItem(index, 'experience')} className="delete-btn">×</button>
                            </div>
                            <input className="input-dark" name="company" value={item.company || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Company Name" />
                            <input className="input-dark" name="title" value={item.title || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Job Title" />
                            <input className="input-dark" name="period" value={item.period || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Period (e.g. 2020 - Present)" />
                            <textarea className="input-dark" name="desc" value={item.desc || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Description..." rows={3} />
                        </div>
                    ))}
                    <button onClick={() => addItem('experience')} className="add-btn-dark">+ Add Experience</button>
                </Accordion>

                <Accordion title="3. Education">
                    {data.education.map((item, index) => (
                        <div key={index} className="sub-card">
                            <div className="card-top-actions">
                                <span className="card-num">#{index + 1}</span>
                                <button onClick={() => removeItem(index, 'education')} className="delete-btn">×</button>
                            </div>
                            <input className="input-dark" name="school" value={item.school || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="School Name" />
                            <input className="input-dark" name="major" value={item.major || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="Major" />
                            <input className="input-dark" name="year" value={item.year || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="Graduation Year" />
                        </div>
                    ))}
                    <button onClick={() => addItem('education')} className="add-btn-dark">+ Add Education</button>
                </Accordion>

                <Accordion title="4. Skills">
                    <div className="form-group-dark">
                        <label>List your skills (comma separated)</label>
                        <textarea name="skills" value={data.skills} onChange={handleChange} rows={4} placeholder="React, Python, Design..." />
                    </div>
                </Accordion>
            </div>
        </div>
    );
};

export default EditorPanel;
