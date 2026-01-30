import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';

const EditorPage = () => {
    const { data, setData, saveResume, user, loading } = useResume();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleListChange = (e, index, type) => {
        const { name, value } = e.target;
        const newList = [...data[type]];
        newList[index][name] = value;
        setData(prev => ({ ...prev, [type]: newList }));
    };

    const addItem = (type) => {
        setData(prev => ({ ...prev, [type]: [...prev[type], {}] }));
    };

    const removeItem = (index, type) => {
        const newList = data[type].filter((_, i) => i !== index);
        setData(prev => ({ ...prev, [type]: newList }));
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div className="resume-container" style={{ maxWidth: '800px', margin: '40px auto' }}>
            <div className="resume-header">
                <h1>Editor Mode</h1>
                <p>Enter your details below. Changes are saved locally until you click Save.</p>
                {!user && <div className="login-notice show" style={{ display: 'block' }}>Please login to save.</div>}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveResume(data); }}>
                {/* Basic Info */}
                <div className="resume-section">
                    <h2>Basic Info</h2>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-input" name="name" value={data.name} onChange={handleChange} placeholder="Hong Gil Dong" />
                        </div>
                        <div className="form-group">
                            <label>Position</label>
                            <input className="form-input" name="position" value={data.position} onChange={handleChange} placeholder="Full Stack Developer" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input className="form-input" name="email" value={data.email} onChange={handleChange} placeholder="email@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input className="form-input" name="phone" value={data.phone} onChange={handleChange} placeholder="010-1234-5678" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Summary</label>
                        <textarea className="form-input" name="summary" value={data.summary} onChange={handleChange} placeholder="Self introduction..." />
                    </div>
                </div>

                {/* Experience */}
                <div className="resume-section">
                    <h2>Experience <button type="button" onClick={() => addItem('experience')} className="add-btn" style={{ fontSize: '0.8rem', float: 'right' }}>+ Add</button></h2>
                    {data.experience.map((item, index) => (
                        <div key={index} className="experience-item" style={{ marginBottom: '20px' }}>
                            <div style={{ textAlign: 'right' }}><button type="button" onClick={() => removeItem(index, 'experience')} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Company</label>
                                    <input className="form-input" name="company" value={item.company || ''} onChange={(e) => handleListChange(e, index, 'experience')} />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input className="form-input" name="role" value={item.role || ''} onChange={(e) => handleListChange(e, index, 'experience')} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Period</label>
                                <input className="form-input" name="period" value={item.period || ''} onChange={(e) => handleListChange(e, index, 'experience')} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="form-input" name="desc" value={item.desc || ''} onChange={(e) => handleListChange(e, index, 'experience')} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Education */}
                <div className="resume-section">
                    <h2>Education <button type="button" onClick={() => addItem('education')} className="add-btn" style={{ fontSize: '0.8rem', float: 'right' }}>+ Add</button></h2>
                    {data.education.map((item, index) => (
                        <div key={index} className="education-item" style={{ marginBottom: '20px' }}>
                            <div style={{ textAlign: 'right' }}><button type="button" onClick={() => removeItem(index, 'education')} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button></div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>School</label>
                                    <input className="form-input" name="school" value={item.school || ''} onChange={(e) => handleListChange(e, index, 'education')} />
                                </div>
                                <div className="form-group">
                                    <label>Major</label>
                                    <input className="form-input" name="major" value={item.major || ''} onChange={(e) => handleListChange(e, index, 'education')} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input className="form-input" name="year" value={item.year || ''} onChange={(e) => handleListChange(e, index, 'education')} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Skills */}
                <div className="resume-section">
                    <h2>Skills</h2>
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <textarea className="form-input" name="skills" value={data.skills} onChange={handleChange} placeholder="React, Node.js..." />
                    </div>
                </div>

                <button type="submit" class="save-btn" disabled={!user}>Save to Cloud</button>
            </form>
        </div>
    );
};

export default EditorPage;
