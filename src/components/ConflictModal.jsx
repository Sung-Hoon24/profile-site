import React from 'react';
import '../styles/login-modal.css';

const ConflictModal = ({ isOpen, onKeepLocal, onLoadCloud, onClose, cloudDate, localDate }) => {
    if (!isOpen) return null;

    return (
        <div className="auth-overlay">
            <div className="auth-modal conflict-modal" style={{ position: 'relative' }}>
                <button
                    onClick={onClose}
                    className="modal-close-btn"
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        padding: '5px',
                        lineHeight: '1',
                        zIndex: 10
                    }}
                    title="닫기"
                >
                    &times;
                </button>
                <div className="auth-header">
                    <h2 className="stitch-title-small" style={{ color: '#ff4081', margin: 0, fontSize: '1.4rem' }}>
                        ⚠️ Data Conflict
                    </h2>
                </div>

                <div className="auth-body">
                    <p style={{ color: '#ccc', marginBottom: '25px', lineHeight: '1.6' }}>
                        We found <strong>unsaved local changes</strong> on this device, but you also have <strong>saved data</strong> in the cloud.
                    </p>

                    <div className="conflict-comparison">
                        {/* Local Card */}
                        <div className="conflict-card local">
                            <div className="conflict-label">💻 THIS DEVICE</div>
                            <div className="conflict-value">Local Draft</div>
                            <div className="conflict-date">
                                {localDate ? new Date(localDate).toLocaleString() : 'Just now'}
                            </div>
                        </div>

                        {/* Cloud Card */}
                        <div className="conflict-card cloud">
                            <div className="conflict-label">☁️ CLOUD</div>
                            <div className="conflict-value">Saved Profile</div>
                            <div className="conflict-date">
                                {cloudDate ? new Date(cloudDate).toLocaleString() : 'Unknown date'}
                            </div>
                        </div>
                    </div>

                    <div className="auth-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={onKeepLocal}
                            className="auth-submit-btn secondary"
                            style={{ background: 'transparent', borderColor: '#666', color: '#ccc' }}>
                            ✋ Keep Local (Overwrite Cloud)
                        </button>
                        <button
                            onClick={onLoadCloud}
                            className="auth-submit-btn primary">
                            ⬇️ Load from Cloud (Discard Local)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConflictModal;
