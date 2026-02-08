import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import MainBuilder from './pages/MainBuilder';
import LandingPage from './pages/LandingPage';
import KakaoCallback from './pages/KakaoCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

import Navigator from './components/Navigator';

function App() {
    const location = useLocation();

    return (
        <ResumeProvider>
            <Navigator /> {/* Global Navigation */}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* 1. Main Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* 2. Builder (Split View) */}
                    <Route path="/builder" element={<MainBuilder />} />

                    {/* 3. Kakao OAuth Callback */}
                    <Route path="/kakao-callback" element={<KakaoCallback />} />

                    {/* 4. Legal Pages */}
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />

                    {/* 5. Redirects for legacy routes */}
                    <Route path="/edit" element={<MainBuilder />} />
                    <Route path="/preview" element={<MainBuilder />} />
                </Routes>
            </AnimatePresence>
        </ResumeProvider>
    );
}

export default App;
