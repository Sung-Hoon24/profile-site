import React from 'react';
import FadeIn from '../animations/FadeIn';

const ExperienceForm = ({ data, handleListChange, addItem, removeItem }) => {
    return (
        <>
            {(data.experience || []).map((item, index) => (
                <FadeIn key={item.id || index} delay={index * 0.05}>
                    <div className="sub-card">
                        <div className="card-top-actions">
                            <span className="card-num">#{index + 1}</span>
                            <button onClick={() => removeItem(index, 'experience')} className="delete-btn">×</button>
                        </div>
                        <input className="input-dark" name="company" value={item.company || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Company Name" />
                        <input className="input-dark" name="role" value={item.role || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Job Title" />
                        <input className="input-dark" name="period" value={item.period || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Period (e.g. 2020 - Present)" />
                        <textarea className="input-dark" name="desc" value={item.desc || ''} onChange={(e) => handleListChange(e, index, 'experience')} placeholder="Description..." rows={3} />
                    </div>
                </FadeIn>
            ))}
            <button onClick={() => addItem('experience')} className="add-btn-dark">+ Add Experience</button>
        </>
    );
};

export default ExperienceForm;
