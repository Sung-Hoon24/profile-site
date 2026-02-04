import React, { useState } from 'react';
import { auth } from '../../firebase';
import '../styles/pricing-modal.css';

/**
 * 💎 Pricing Modal (Lemon Squeezy Integration)
 */
const PricingModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    // Lemon Squeezy 상품 Checkout URL
    const CHECKOUT_URL = "https://heejung240000.lemonsqueezy.com/checkout/buy/4bbcc3ca-bd77-4bb5-9d94-be1370c56cdb";

    if (!isOpen) return null;

    const handlePurchase = () => {
        if (!auth.currentUser) {
            alert("구매하시려면 먼저 로그인이 필요합니다.");
            return;
        }

        const userId = auth.currentUser.uid;
        const userEmail = auth.currentUser.email;

        // Custom Data로 userId 전달 (웹훅 처리를 위해 필수)
        // 이메일은 프리필(prefill)
        let finalUrl = CHECKOUT_URL;
        if (finalUrl.includes('?')) {
            finalUrl += `&checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`;
        } else {
            finalUrl += `?checkout[custom][user_id]=${userId}&checkout[email]=${userEmail}`;
        }

        console.log("Opening Lemon Squeezy Checkout:", finalUrl);

        try {
            setLoading(true);
            if (window.LemonSqueezy) {
                window.LemonSqueezy.Url.Open(finalUrl);
                // 모달 닫기보다 Overlay가 뜨므로 대기
                setLoading(false);
            } else {
                // Fallback (새 탭 열기)
                window.open(finalUrl, '_blank');
                setLoading(false);
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("결제 창을 여는 중 문제가 발생했습니다.");
            setLoading(false);
        }
    };

    return (
        <div className="pm-overlay" onClick={onClose}>
            <div className="pm-container" onClick={(e) => e.stopPropagation()}>
                <button className="pm-close-btn" onClick={onClose}>×</button>

                <div className="pm-content">
                    <div className="pm-header">
                        <h2>Developer Pro</h2>
                        <p className="pm-subtitle">Unlock Your Full Potential</p>
                    </div>

                    <div className="pm-body">
                        <div className="pm-features-list">
                            <div className="pm-feature-item">
                                <span className="pm-icon">🔓</span>
                                <div className="pm-feature-text">
                                    <strong>모든 프리미엄 템플릿 해제</strong>
                                    <p>전문가급 디자인 템플릿 5종 무제한 사용</p>
                                </div>
                            </div>
                            <div className="pm-feature-item">
                                <span className="pm-icon">📄</span>
                                <div className="pm-feature-text">
                                    <strong>PDF 다운로드 & 워터마크 제거</strong>
                                    <p>깔끔한 고화질 PDF 내보내기</p>
                                </div>
                            </div>
                            <div className="pm-feature-item">
                                <span className="pm-icon">🚀</span>
                                <div className="pm-feature-text">
                                    <strong>우선 기술 지원</strong>
                                    <p>문제 발생 시 우선적으로 지원해드립니다.</p>
                                </div>
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
                                {loading ? '로딩 중...' : '지금 업그레이드하기 ⚡'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingModal;
