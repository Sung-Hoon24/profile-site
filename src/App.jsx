import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import MainBuilder from './pages/MainBuilder';

// 1. Landing Page (Home)
const Home = () => (
    <div className="container" style={{ textAlign: 'center', paddingTop: '150px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>
            Resume Builder <span style={{ color: '#9d4edd' }}>Pro</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '50px' }}>
            Professional A4 Resume Editor with Real-time Preview
        </p>
        <Link to="/builder" className="cta-btn" style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
            🚀 Start Building
        </Link>
    </div>
);

function App() {
    return (
        <ResumeProvider>
            <Routes>
                {/* 1. Main Landing Page */}
                <Route path="/" element={<Home />} />

                {/* 2. Builder (Split View) */}
                <Route path="/builder" element={<MainBuilder />} />

                {/* 3. Redirects for legacy routes */}
                <Route path="/edit" element={<MainBuilder />} />
                <Route path="/preview" element={<MainBuilder />} />
            </Routes>
        </ResumeProvider>
    );
}

export default App;
