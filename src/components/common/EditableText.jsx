import React, { useState, useEffect, useRef } from 'react';

const EditableText = ({
    value,
    onChange,
    placeholder = 'Click to edit',
    isEditMode = true,
    tagName = 'span',
    className = '',
    style = {},
    multiline = false
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        if (multiline && inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
    }, [value, multiline, isFocused]);

    if (!isEditMode) {
        const Tag = tagName;
        return <Tag className={className} style={style}>{value || ''}</Tag>;
    }

    const commonStyles = {
        background: 'transparent',
        border: isFocused ? '1px dashed #666' : '1px solid transparent',
        color: 'inherit',
        font: 'inherit',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        textAlign: 'inherit',
        lineHeight: 'inherit',
        outline: 'none',
        width: '100%',
        padding: '0',
        margin: '0',
        resize: 'none',
        minWidth: '50px',
        ...style
    };

    if (multiline) {
        return (
            <textarea
                ref={inputRef}
                className={className}
                style={{ ...commonStyles, overflow: 'hidden' }}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                rows={1}
            />
        );
    }

    return (
        <input
            ref={inputRef}
            className={className}
            style={commonStyles}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
        />
    );
};

export default EditableText;
