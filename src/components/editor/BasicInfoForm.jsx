import React, { useRef } from 'react';

const BasicInfoForm = ({ data, handleChange, setData }) => {
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 500 * 1024) { // 500KB Limit
            alert("Image is too large! Please use an image under 500KB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    profileImage: reader.result // Store Base64 string
                }
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        if (window.confirm("Remove profile photo?")) {
            setData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    profileImage: null
                }
            }));
        }
    };

    return (
        <div className="form-container-inner">
            <div className="profile-upload-section">
                <div
                    className="profile-preview-circle"
                    style={{
                        backgroundImage: data.basicInfo?.profileImage ? `url(${data.basicInfo.profileImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {!data.basicInfo?.profileImage && <span>📷</span>}
                </div>
                <div className="profile-actions">
                    <label className="save-btn-secondary" style={{ cursor: 'pointer', fontSize: '12px' }}>
                        Upload Photo
                        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                    {data.basicInfo?.profileImage && (
                        <button onClick={removeImage} className="text-btn-danger">
                            Remove
                        </button>
                    )}
                </div>
                <p className="helper-text">(Max 500KB. Stored locally in JSON.)</p>
            </div>

            <div className="form-group-dark">
                <label>Full Name</label>
                <input name="fullName" className="input-dark" value={data.basicInfo?.fullName || ''} onChange={handleChange} placeholder="Hong Gil Dong" />
            </div>

            <div className="form-group-dark">
                <label>Position / Role</label>
                <input name="role" className="input-dark" value={data.basicInfo?.role || ''} onChange={handleChange} placeholder="Senior Developer" />
            </div>

            <div className="form-row-dark">
                <div className="form-group-dark">
                    <label>Email</label>
                    <input name="email" className="input-dark" value={data.basicInfo?.email || ''} onChange={handleChange} placeholder="email@example.com" />
                </div>
                <div className="form-group-dark">
                    <label>Phone</label>
                    <input name="phone" className="input-dark" value={data.basicInfo?.phone || ''} onChange={handleChange} placeholder="010-0000-0000" />
                </div>
            </div>

            <div className="form-group-dark">
                <label>Summary / Intro</label>
                <textarea name="summary" className="input-dark" value={data.basicInfo?.summary || ''} onChange={handleChange} rows={4} />
            </div>
        </div>
    );
};

export default BasicInfoForm;
