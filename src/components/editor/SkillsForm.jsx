import React from 'react';

const SkillsForm = ({ data, handleChange }) => {
    return (
        <div className="form-container-inner">
            <div className="form-group-dark">
                <label>List your skills (comma separated)</label>
                <textarea
                    name="skills"
                    className="input-dark"
                    value={data.skills || ''}
                    onChange={handleChange}
                    rows={6}
                    placeholder="React, Python, Design..."
                />
                <p className="helper-text">💡 Separate skills with commas for best layout.</p>
            </div>
        </div>
    );
};

export default SkillsForm;
