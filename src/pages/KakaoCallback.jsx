import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth'; // Phase 3.4: Anonymous → Custom Token 전환
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

                setStatus('서버에 토큰 교환 요청 중...');

                // Cloud Function 호출: code → firebaseCustomToken 교환
                const functionUrl = import.meta.env.PROD
                    ? '/api/kakao-token'  // 프로덕션: firebase.json rewrite
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

                // 서버 에러 응답 처리
                if (tokenData.error) {
                    throw new Error(`토큰 교환 실패: ${tokenData.message || tokenData.error}`);
                }

                // 서버 응답에서 firebaseCustomToken과 kakaoUserId 수신
                const { firebaseCustomToken, kakaoUserId } = tokenData;

                if (!firebaseCustomToken) {
                    throw new Error('서버에서 Firebase 인증 토큰을 받지 못했습니다');
                }

                setStatus('Firebase 인증 중...');

                // Phase 3.4: Firebase Custom Token으로 직접 인증 (Anonymous 제거)
                await signInWithCustomToken(auth, firebaseCustomToken);
                setCustomDocId(`kakao_${kakaoUserId}`);

                setStatus('로그인 성공! 리다이렉트 중...');

                // 메인 앱으로 리다이렉트
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
