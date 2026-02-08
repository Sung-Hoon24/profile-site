import React from 'react';

const ThemeForm = ({ data, setData }) => {
    const fontSizes = ['small', 'medium', 'large', 'x-large'];

    const handleFontSizeChange = (size) => {
        setData(prev => ({
            ...prev,
            theme: { ...prev.theme, fontSize: size }
        }));
    };

    return (
        <div className="form-container-inner">
            <div className="form-group-dark">
                <label>Font Size</label>
                <div className="text-size-options">
                    {fontSizes.map(size => (
                        <button
                            key={size}
                            onClick={() => handleFontSizeChange(size)}
                            className={`size-btn ${data.theme?.fontSize === size ? 'active' : ''}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
            <p className="helper-text">✨ Controls the overall scale of your resume.</p>
        </div>
    );
};

export default ThemeForm;
