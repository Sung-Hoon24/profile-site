import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../firebase';
import { useResume } from '../context/ResumeContext';

/**
 * Kakao OAuth Callback Handler
 * This page handles the redirect from Kakao after user authorizes the app.
 * URL: /kakao-callback?code=...
 */
const KakaoCallback = () => {
    const navigate = useNavigate();
    const { setCustomDocId } = useResume();
    const [status, setStatus] = useState('카카오 로그인 처리 중...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check if Kakao SDK is loaded
                if (!window.Kakao) {
                    throw new Error('Kakao SDK not loaded');
                }

                // Initialize if needed
                if (!window.Kakao.isInitialized()) {
                    const key = import.meta.env.VITE_KAKAO_KEY || 'b0d2b8461daab0efebf5e296a1ab9661';
                    window.Kakao.init(key);
                }


                // Get authorization code from URL query params
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');

                if (error) {
                    throw new Error(`카카오 인증 실패: ${error}`);
                }

                if (!code) {
                    throw new Error('인증 코드가 없습니다');
                }

                setStatus('액세스 토큰 요청 중...');

                // Call Cloud Function to exchange code for token
                // In production: use the deployed function URL
                // For local dev: use emulator or deployed function
                const functionUrl = import.meta.env.PROD
                    ? '/api/kakao-token'  // Production: rewrite to function
                    : `https://us-central1-my-awesome-site-f3f94.cloudfunctions.net/kakaoTokenExchange`;

                const tokenResponse = await fetch(functionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: code,
                        redirectUri: window.location.origin + '/kakao-callback',
                    }),
                });

                const tokenData = await tokenResponse.json();

                if (tokenData.error) {
                    throw new Error(`토큰 교환 실패: ${tokenData.error_description || tokenData.error}`);
                }

                setStatus('사용자 정보 요청 중...');

                // Set access token in SDK
                window.Kakao.Auth.setAccessToken(tokenData.access_token);

                // SDK v2.7.4: Kakao.API.request() returns a Promise directly
                const userInfo = await window.Kakao.API.request({
                    url: '/v2/user/me',
                });

                const kakaoId = userInfo.id;
                console.log('Kakao User ID:', kakaoId);

                setStatus('Firebase 연결 중...');

                // Bridge to Firebase Anonymous Auth
                await signInAnonymously(auth);
                setCustomDocId(`kakao_${kakaoId}`);

                setStatus('로그인 성공! 리다이렉트 중...');

                // Redirect to main app
                setTimeout(() => {
                    navigate('/resume?logged_in=kakao');
                }, 500);

            } catch (err) {
                console.error('Kakao Callback Error:', err);
                setStatus(`오류: ${err.message}`);

                // Redirect back after showing error
                setTimeout(() => {
                    navigate('/?error=kakao_failed');
                }, 2000);
            }
        };

        handleCallback();
    }, [navigate, setCustomDocId]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)',
            color: '#fff',
            fontFamily: 'Outfit, sans-serif',
        }}>
            <div style={{
                background: 'rgba(30, 30, 40, 0.6)',
                padding: '40px 60px',
                borderRadius: '20px',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔐</div>
                <h2 style={{ marginBottom: '10px' }}>카카오 로그인</h2>
                <p style={{ color: '#aaa' }}>{status}</p>
                <div style={{
                    marginTop: '20px',
                    width: '200px',
                    height: '4px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: '50%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #FEE500, #FFD700)',
                        animation: 'loading 1s infinite alternate',
                    }} />
                </div>
            </div>
            <style>{`
                @keyframes loading {
                    0% { width: 20%; margin-left: 0; }
                    100% { width: 80%; margin-left: 20%; }
                }
            `}</style>
        </div>
    );
};

export default KakaoCallback;
