import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { requestPayment } from '../utils/payment'; // [Step Lock] Disabled - firebase exports not ready
import { useResume } from '../context/ResumeContext';

const PremiumModal = ({ isOpen, onClose }) => {
    const { user } = useResume();
    const [loading, setLoading] = useState(false);

    const handlePurchase = async () => {
        // [Step Lock] UI Only Mode: DB/Server connection disabled
        alert("현재 결제 기능은 준비중입니다. (Test Mode)");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            }} onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="premium-modal"
                    style={{
                        backgroundColor: '#1E1E1E', padding: '2rem', borderRadius: '16px',
                        maxWidth: '400px', width: '90%', textAlign: 'center',
                        color: '#fff', border: '1px solid #333'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>프리미엄 업그레이드</h2>
                    <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                        단 한 번의 결제로 모든 프리미엄 템플릿과 기능을 평생 소유하세요.
                    </p>

                    <div style={{
                        background: '#2A2A2A', padding: '1rem', borderRadius: '8px',
                        marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 'bold'
                    }}>
                        ₩5,000 / Lifetime
                    </div>

                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '1rem', borderRadius: '8px',
                            border: 'none', background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                            color: '#000', fontWeight: 'bold', fontSize: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? '결제 처리 중...' : '지금 결제하고 잠금 해제'}
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            marginTop: '1rem', background: 'none', border: 'none',
                            color: '#666', cursor: 'pointer', textDecoration: 'underline'
                        }}
                    >
                        다음에 하기
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PremiumModal;
