import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/animations/PageTransition';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <PageTransition>
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
                        <h3>실시간 미리보기</h3>
                        <p>타이핑하는 동시에 변경사항을 즉시 확인하세요.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>PDF 내보내기</h3>
                        <p>지원서 제출용 고품질 A4 PDF를 다운로드하세요.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">☁️</div>
                        <h3>클라우드 동기화</h3>
                        <p>자동 저장으로 어디서든 작업을 이어가세요.</p>
                    </div>
                </section>

                {/* Premium Templates Section - Required for Payment Provider */}
                <section className="premium-section" id="premium">
                    <h2 className="section-title">💎 프리미엄 템플릿</h2>
                    <p className="section-subtitle">전문적인 이력서로 성공적인 취업을 준비하세요</p>

                    <div className="premium-grid">
                        <div className="premium-card">
                            <div className="premium-badge">POPULAR</div>
                            <h3>Developer Pro</h3>
                            <p className="premium-price">₩5,000</p>
                            <ul className="premium-features">
                                <li>✓ 현대적인 개발자 레이아웃</li>
                                <li>✓ 기술 스택 시각화</li>
                                <li>✓ ATS 최적화</li>
                                <li>✓ PDF/PNG 내보내기</li>
                            </ul>
                            <Link to="/builder" className="premium-btn">템플릿 사용하기</Link>
                        </div>
                    </div>
                </section>

                {/* Contact Section - Required for Payment Provider */}
                <section className="contact-section" id="contact">
                    <h2 className="section-title">📧 문의하기</h2>
                    <p>서비스 관련 문의사항이 있으시면 연락주세요.</p>
                    <p className="contact-email">📩 heejung240000@gmail.com</p>
                </section>

                {/* Footer with Policies - Required for Payment Provider */}
                <footer className="landing-footer">
                    <div className="footer-content">
                        <p>© 2026 Resume Builder Pro. All rights reserved.</p>
                        <div className="footer-links">
                            <Link to="/privacy">개인정보 처리방침</Link>
                            <span className="link-divider">|</span>
                            <Link to="/terms">이용약관</Link>
                        </div>
                        <div className="footer-policies">
                            <div className="policy-item">
                                <strong>환불 정책:</strong> 디지털 상품 특성상 다운로드 후 환불이 불가합니다.
                                구매 전 무료 버전으로 충분히 테스트해주세요.
                            </div>
                            <div className="policy-item">
                                <strong>취소 정책:</strong> 결제 완료 전까지 언제든지 취소 가능합니다.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </PageTransition>
    );
};

export default LandingPage;
