import React from 'react';
import FadeIn from '../animations/FadeIn';

const EducationForm = ({ data, handleListChange, addItem, removeItem }) => {
    return (
        <>
            {(data.education || []).map((item, index) => (
                <FadeIn key={item.id || index} delay={index * 0.05}>
                    <div className="sub-card">
                        <div className="card-top-actions">
                            <span className="card-num">#{index + 1}</span>
                            <button onClick={() => removeItem(index, 'education')} className="delete-btn">×</button>
                        </div>
                        <input className="input-dark" name="school" value={item.school || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="School Name" />
                        <input className="input-dark" name="major" value={item.major || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="Major" />
                        <input className="input-dark" name="year" value={item.year || ''} onChange={(e) => handleListChange(e, index, 'education')} placeholder="Graduation Year" />
                    </div>
                </FadeIn>
            ))}
            <button onClick={() => addItem('education')} className="add-btn-dark">+ Add Education</button>
        </>
    );
};

export default EducationForm;
