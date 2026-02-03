import React from 'react';

const SyncStatus = ({ status, lastSaved, onManualSave }) => { // Accept onManualSave
    // status: 'saved' | 'saving' | 'unsaved' | 'error'

    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return { color: '#00e5ff', text: 'Saving...', icon: '⏳', isActionable: false };
            case 'unsaved':
                return { color: '#ffb74d', text: 'Unsaved Changes (Click to Save)', icon: '🟠', isActionable: true };
            case 'error':
                return { color: '#ff5252', text: 'Save Failed (Retry)', icon: '🔴', isActionable: true };
            case 'saved':
            default:
                return { color: '#69f0ae', text: 'All Saved', icon: '☁️', isActionable: false };
        }
    };

    const config = getStatusConfig();
    const isClickable = config.isActionable && onManualSave;

    return (
        <div 
            className={`sync-status ${isClickable ? 'clickable' : ''}`} 
            title={isClickable ? "Click to save immediately" : "Auto-save active"}
            onClick={isClickable ? onManualSave : undefined}
            style={{ 
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isClickable ? 1 : 0.9,
                padding: '5px 10px',
                borderRadius: '20px',
                background: isClickable ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                transition: 'all 0.2s'
            }}
        >
            <span style={{ marginRight: '5px' }}>{config.icon}</span>
            <span style={{ color: config.color, fontWeight: 'bold', fontSize: '0.85rem' }}>
                {config.text}
            </span>
            {status === 'saved' && lastSaved && (
                <span style={{ marginLeft: '8px', color: '#666', fontSize: '0.75rem' }}>
                    ({lastSaved.toLocaleTimeString()})
                </span>
            )}
        </div>
    );
};

export default SyncStatus;
