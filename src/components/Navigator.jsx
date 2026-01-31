import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResume } from '../context/ResumeContext'; // Import Context
import { signInWithPopup, auth, provider, signOut } from '../../firebase'; // Import Auth

const Navigator = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useResume(); // Get User State

    const handleBack = () => {
        if (location.pathname === '/') return;
        navigate(-1);
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login Failed:', error);
            alert('Login Failed: ' + error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('Logged out 👋');
        } catch (error) {
            console.error('Logout Failed:', error);
        }
    };

    return (
        <div className="global-navigator">
            <button onClick={handleHome} className="nav-btn home-btn" title="Go Dashboard">
                🏠
            </button>
            <button onClick={handleBack} className="nav-btn back-btn" title="Go Back">
                ⬅️
            </button>

            <div className="nav-divider" style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>

            {user ? (
                <button onClick={handleLogout} className="nav-btn logout-btn" title={`Logout (${user.displayName})`}>
                    <img src={user.photoURL} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </button>
            ) : (
                <button onClick={handleLogin} className="nav-btn login-btn" title="Google Login">
                    🔑
                </button>
            )}
        </div>
    );
};

export default Navigator;
