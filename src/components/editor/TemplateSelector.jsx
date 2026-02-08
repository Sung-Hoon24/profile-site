import React from 'react';

const TemplateSelector = ({ data, setData }) => {
    const templates = ['developer', 'designer', 'future', 'executive', 'startup'];

    const handleTemplateSwitch = (templateId) => {
        setData(prev => ({ ...prev, templateId }));
    };

    return (
        <div className="form-container-inner">
            <div className="template-selector-grid">
                {templates.map(id => (
                    <button
                        key={id}
                        onClick={() => handleTemplateSwitch(id)}
                        className={`template-option-btn ${data.templateId === id ? 'active' : ''}`}
                    >
                        {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                ))}
            </div>
            <p className="helper-text">🚀 Switching templates will reformat your current data immediately.</p>
        </div>
    );
};

export default TemplateSelector;
