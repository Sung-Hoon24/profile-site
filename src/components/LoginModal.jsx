import React, { useState, useEffect } from 'react';
import {
    auth,
    provider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from '../../firebase';
import '../styles/login-modal.css';

const LoginModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
    const [isSuccess, setIsSuccess] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');

    // UI States
    const [showPw, setShowPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Reset on Open
    useEffect(() => {
        if (isOpen) {
            setActiveTab('login');
            setIsSuccess(false);
            setEmail('');
            setPassword('');
            setConfirmPw('');
            setError('');
        }
    }, [isOpen]);

    // Initialize Kakao SDK
    // Initialize Kakao SDK
    useEffect(() => {
        // Fallback to hardcoded key if env var fails
        const kakaoKey = import.meta.env.VITE_KAKAO_KEY || 'b0d2b8461daab0efebf5e296a1ab9661';
        console.log('Kakao Key used:', kakaoKey); // Debug

        if (window.Kakao) {
            if (!window.Kakao.isInitialized()) {
                if (kakaoKey) {
                    try {
                        window.Kakao.init(kakaoKey);
                        console.log('Kakao SDK Initialized');
                    } catch (e) {
                        console.error('Kakao Init Error:', e);
                    }
                } else {
                    console.error('Kakao Key is missing in .env');
                }
            }
        } else {
            console.error('Kakao SDK script not loaded on window');
        }
    }, []);

    if (!isOpen) return null;

    // --- Validation Logic ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // PW: At least 8 chars, 1 letter, 1 number, 1 special char
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const isEmailValid = emailRegex.test(email);
    const isPwValid = pwRegex.test(password);
    const isMatch = password === confirmPw;

    const canSubmit = activeTab === 'login'
        ? (email && password)
        : (isEmailValid && isPwValid && isMatch);

    // --- Handlers ---
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, provider);
            onClose(); // Auto close on Google success (it's auto signup too)
        } catch (err) {
            console.error(err);
            setError('구글 로그인 실패: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            alert('오류: window.Kakao가 없습니다.');
            return;
        }

        if (!window.Kakao.isInitialized()) {
            // alert('오류: Kakao SDK가 초기화되지 않았습니다. 재시도합니다.');
            const key = import.meta.env.VITE_KAKAO_KEY || 'b0d2b8461daab0efebf5e296a1ab9661';
            try {
                window.Kakao.init(key);
            } catch (e) {
                alert('초기화 실패: ' + e.message);
                return;
            }
        }

        // Redirect 방식 로그인
        try {
            // 현재 페이지 도메인으로 리다이렉트
            const redirectUri = window.location.origin;
            window.Kakao.Auth.authorize({
                redirectUri: redirectUri
            });
        } catch (err) {
            alert('로그인 요청 중 에러: ' + err.message);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit || loading) return;

        setLoading(true);
        setError('');

        try {
            if (activeTab === 'login') {
                // Login
                await signInWithEmailAndPassword(auth, email, password);
                onClose();
            } else {
                // Sign Up
                await createUserWithEmailAndPassword(auth, email, password);
                // On Success -> Show Celebration
                setIsSuccess(true);
                // Auto close after 3s
                setTimeout(() => {
                    onClose();
                }, 3000);
            }
        } catch (err) {
            console.error(err);
            let msg = err.message;
            if (err.code === 'auth/email-already-in-use') msg = '이미 가입된 이메일입니다.';
            if (err.code === 'auth/wrong-password') msg = '비밀번호가 틀렸습니다.';
            if (err.code === 'auth/user-not-found') msg = '가입되지 않은 이메일입니다.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    // --- Success Screen ---
    if (isSuccess) {
        return (
            <div className="auth-overlay">
                <div className="auth-modal">
                    <button className="auth-close-btn" onClick={onClose}>×</button>
                    <div className="auth-success-screen">
                        <div className="auth-success-icon">🎉</div>
                        <h2 className="auth-success-title">축하합니다!</h2>
                        <p className="auth-success-desc">회원가입이 성공적으로 완료되었습니다.<br />잠시 후 자동으로 로그인됩니다.</p>
                        <button className="auth-submit-btn" onClick={onClose}>바로 시작하기</button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Form ---
    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={onClose}>×</button>

                {/* Header */}
                <div className="auth-header">
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            로그인
                        </button>
                        <button
                            className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                            onClick={() => setActiveTab('signup')}
                        >
                            회원가입
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="auth-body">
                    <form onSubmit={handleEmailSubmit}>
                        {/* Email */}
                        <div className="auth-input-group">
                            <label className="auth-label">이메일</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-input-group">
                            <label className="auth-label">비밀번호</label>
                            <div className="auth-input-wrapper">
                                <input
                                    className="auth-input"
                                    type={showPw ? "text" : "password"}
                                    placeholder="8자 이상, 영문/숫자/특수문자 포함"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="button" className="auth-eye-btn" onClick={() => setShowPw(!showPw)}>
                                    {showPw ? '👁️' : '🙈'}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password (Only Signup) */}
                        {activeTab === 'signup' && (
                            <div className="auth-input-group">
                                <label className="auth-label">비밀번호 확인</label>
                                <div className="auth-input-wrapper">
                                    <input
                                        className="auth-input"
                                        type={showConfirmPw ? "text" : "password"}
                                        placeholder="비밀번호를 한 번 더 입력해주세요"
                                        value={confirmPw}
                                        onChange={e => setConfirmPw(e.target.value)}
                                    />
                                    <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPw(!showConfirmPw)}>
                                        {showConfirmPw ? '👁️' : '🙈'}
                                    </button>
                                </div>

                                {/* Real-time Validation Feedback */}
                                <div className="auth-validation-list">
                                    <div className={`auth-val-item ${isPwValid ? 'valid' : 'invalid'}`}>
                                        {isPwValid ? '✔' : '•'} 8자 이상, 영문/숫자/특수문자 포함
                                    </div>
                                    <div className={`auth-val-item ${isMatch && confirmPw ? 'valid' : confirmPw ? 'invalid' : ''}`}>
                                        {isMatch && confirmPw ? '✔' : '•'} 비밀번호 일치
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <div className="auth-helper-text error" style={{ marginBottom: '10px' }}>{error}</div>}

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={!canSubmit || loading}
                        >
                            {loading ? '처리 중...' : (activeTab === 'login' ? '이메일로 로그인' : '가입완료')}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>또는 소셜 계정으로 로그인</span>
                    </div>

                    <div className="auth-social-section">
                        {/* Google Button with Tooltip */}
                        <button
                            className="auth-social-btn google"
                            onClick={handleGoogleLogin}
                            data-tooltip="구글로 로그인할 경우 자동 회원가입이 진행됩니다. 진행할까요?"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="auth-social-icon" />
                            Google로 계속하기
                        </button>

                        <div className="auth-social-others">
                            <button
                                type="button"
                                className="auth-social-icon-btn kakao"
                                onClick={handleKakaoLogin}
                                title="카카오 로그인"
                            >K</button>
                            {/* Naver and Twitter removed as requested */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginModal;
