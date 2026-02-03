import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import MainBuilder from './pages/MainBuilder';
import LandingPage from './pages/LandingPage';
import KakaoCallback from './pages/KakaoCallback';

import Navigator from './components/Navigator';

function App() {
    return (
        <ResumeProvider>
            <Navigator /> {/* Global Navigation */}
            <Routes>
                {/* 1. Main Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* 2. Builder (Split View) */}
                <Route path="/builder" element={<MainBuilder />} />

                {/* 3. Kakao OAuth Callback */}
                <Route path="/kakao-callback" element={<KakaoCallback />} />

                {/* 4. Redirects for legacy routes */}
                <Route path="/edit" element={<MainBuilder />} />
                <Route path="/preview" element={<MainBuilder />} />
            </Routes>
        </ResumeProvider>
    );
}

export default App;
