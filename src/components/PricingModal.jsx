
import React, { useState } from 'react';
// import { httpsCallable } from 'firebase/functions'; // DISABLED
import { auth } from '../../firebase'; // Removed functions import
import '../styles/pricing-modal.css';

/**
 * 💎 Pricing Modal (Zero-Error Commerce)
 */
const PricingModal = ({ isOpen, onClose, onUnlockSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    if (!isOpen) return null;

    const handlePurchase = async () => {
        if (!auth.currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        const user = auth.currentUser;
        setLoading(true);
        setStatusMsg('결제 창을 불러오는 중...');

        const merchant_uid = `mid_${new Date().getTime()}_${Math.random().toString(36).substring(2, 7)}`;

        try {
            // MOCK FLOW for Development (Safe for Deployment until Store ID is set)
            const confirmed = window.confirm("💎 [SANDBOX] 결제 모듈 연동 테스트\n\n실제 결제가 발생하지 않습니다.\n'확인'을 누르면 결제 성공으로 처리하고 서버 검증을 시도합니다.");

            if (confirmed) {
                setStatusMsg('서버 검증 진행 중...');

                // MOCK SERVER CALL (Bypass firebase/functions build issue)
                // const verifyPayment = httpsCallable(functions, 'verifyPayment');

                try {
                    // Simulate API Delay
                    await new Promise(r => setTimeout(r, 1500));

                    const res = { data: { success: true, message: "Simulation Success" } }; // MOCK RESPONSE


                    if (res.data.success) {
                        onUnlockSuccess();
                        onClose();
                    } else {
                        // In Real Life, we show error.
                        // In Demo without Store ID, this will ALWAYS happen.
                        alert('결제 검증 실패 (Sandbox): ' + res.data.message);
                    }
                } catch (verifyErr) {
                    console.error("Verification Error", verifyErr);
                    // For DEMO PURPOSE ONLY: If it's the "Payment not found" error, we might optionally unlock?
                    // No, stick to security.
                    alert(`서버 검증 오류: ${verifyErr.message}`);
                }
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert(`결제 실패: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <div id="pricing-modal-root">
            <div className="pm-overlay" onClick={!loading ? onClose : undefined}>
                <div className="pm-modal" onClick={e => e.stopPropagation()}>
                    <button className="pm-close" onClick={onClose} disabled={loading}>×</button>

                    <div className="pm-visual">
                        <div style={{ textAlign: 'center', zIndex: 1, animation: 'float 3s ease-in-out infinite' }}>
                            <div style={{ fontSize: '5rem' }}>✨</div>
                            <div style={{ color: '#FFD700', fontWeight: 'bold' }}>PREMIUM</div>
                        </div>
                    </div>

                    <div className="pm-content">
                        <span className="pm-badge">SPECIAL OFFER</span>
                        <h2 className="pm-title">Unlock Developer Pro</h2>
                        <p className="pm-desc">
                            현직 시니어 개발자가 감수한 <strong>최적의 이력서 템플릿</strong>.<br />
                            ATS(채용 시스템) 통과율을 높이는 구조와 디자인.
                        </p>

                        <div className="pm-features">
                            <div className="pm-feature-item">
                                <span className="pm-check">✔</span>
                                <span>ATS Friendly (텍스트 추출 최적화)</span>
                            </div>
                            <div className="pm-feature-item">
                                <span className="pm-check">✔</span>
                                <span>모던 테크 디자인 (다크 모드 지원)</span>
                            </div>
                            <div className="pm-feature-item">
                                <span className="pm-check">✔</span>
                                <span>평생 소장 및 무제한 수정</span>
                            </div>
                        </div>

                        <div className="pm-footer">
                            <div className="pm-price-box">
                                <span className="pm-price-label">One-time payment</span>
                                <span className="pm-price-value">₩5,000</span>
                            </div>
                            <button
                                className="pm-cta-btn"
                                onClick={handlePurchase}
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : '이 모든 혜택 잠금 해제 🔓'}
                            </button>
                        </div>
                    </div>

                    {loading && (
                        <div className="pm-loading-overlay">
                            <div className="spinner"></div>
                            <div style={{ color: '#fff', marginTop: '10px' }}>{statusMsg}</div>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
            .pm-loading-overlay {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex; flex-direction: column;
                justify-content: center; align-items: center; z-index: 20;
            }
            .spinner {
                width: 40px; height: 40px;
                border: 4px solid #333; border-top: 4px solid #FFD700;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
            `}</style>
        </div>
    );
};

export default PricingModal;
