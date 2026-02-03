import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Background Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="grid-overlay"></div>
            <div className="landing-bg"></div>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-badge">✨ V2.0 Now Live</div>
                <h1 className="hero-title">
                    Resume Builder <span className="highlight-text">Pro</span>
                </h1>
                <p className="hero-subtitle">
                    Craft your professional identity with our <span className="text-gradient">AI-powered</span> editor.
                    <br />Real-time preview, ATS-friendly, and completely free.
                </p>

                <div className="hero-actions">
                    <Link to="/builder" className="cta-button primary">
                        🚀 Start Building
                        <div className="btn-glow"></div>
                    </Link>
                    <button className="cta-button secondary" onClick={() => alert('Coming Soon!')}>
                        📂 Load Template
                    </button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Real-time Preview</h3>
                    <p>See changes instantly as you type. No more switching back and forth.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📄</div>
                    <h3>PDF Export</h3>
                    <p>Download high-quality A4 PDFs ready for application.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">☁️</div>
                    <h3>Cloud Sync</h3>
                    <p>Save your progress automatically and access it from anywhere.</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2026 Future Vision. Built for developers.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
