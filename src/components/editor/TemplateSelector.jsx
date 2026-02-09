import React from 'react';

const TemplateSelector = ({ data, setData, isPremium, onOpenPricing }) => {
    console.log('[TemplateSelector] isPremium:', isPremium);
    const templates = ['developer', 'designer', 'future', 'executive', 'startup'];

    const handleTemplateSwitch = (templateId) => {
        // Lock Logic: 'developer' is free, others require premium
        if (templateId !== 'developer' && !isPremium) {
            onOpenPricing();
            return;
        }
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
                        {id !== 'developer' && !isPremium && <span style={{ marginLeft: '6px' }}>🔒</span>}
                    </button>
                ))}
            </div>
            <p className="helper-text">🚀 Switching templates will reformat your current data immediately.</p>
        </div>
    );
};

export default TemplateSelector;
