import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResume } from '../context/ResumeContext'; // Import Context
import { signInWithPopup, auth, provider, signOut, signInAnonymously } from '../../firebase'; // Import Auth
import LoginModal from './LoginModal';
import '../styles/GlobalNavigator.css'; // Import Styles

const Navigator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useResume(); // Get User State
    const [showLoginModal, setShowLoginModal] = useState(false); // Modal State

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleBack = () => {
        if (location.pathname === '/') return;
        navigate(-1);
    };

    const handleHome = () => {
        navigate('/');
    };

    // Old handleLogin removed, now using Modal

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('로그아웃 되었습니다 👋');
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    };

    return (
        <>
            <div className="global-navigator">
                <button onClick={handleHome} className="nav-btn home-btn" title="홈으로">
                    🏠
                </button>
                <button onClick={handleBack} className="nav-btn back-btn" title="뒤로가기">
                    ⬅️
                </button>

                <div className="nav-divider" style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>

                {user ? (
                    <button onClick={handleLogout} className="nav-btn logout-btn" title={`로그아웃 (${user.displayName || user.email})`}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                        )}
                    </button>
                ) : (
                    <button onClick={handleLoginClick} className="nav-btn login-btn" title="로그인 / 회원가입">
                        🔐
                    </button>
                )}
            </div>

            {/* Login Modal */}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
};

export default Navigator;
