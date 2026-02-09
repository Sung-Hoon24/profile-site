import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ResumeProvider } from './context/ResumeContext';
import ResumeBuilder from './pages/ResumeBuilder';
import LandingPage from './pages/LandingPage';
import KakaoCallback from './pages/KakaoCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Navigator from './components/Navigator';
import LoginModal from './components/LoginModal';
import ResumePreviewModal from './components/ResumePreviewModal';
import PricingModal from './components/PricingModal';

function App() {
    const location = useLocation();

    return (
        <ResumeProvider>
            <Navigator />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/builder" element={<ResumeBuilder />} />
                    <Route path="/kakao-callback" element={<KakaoCallback />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                </Routes>
            </AnimatePresence>
            <LoginModal />
            <ResumePreviewModal />
            <PricingModal />
        </ResumeProvider>
    );
}

export default App;
