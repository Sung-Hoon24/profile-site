import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPage.css';

const TermsOfService = () => {
    return (
        <div className="legal-container">
            <div className="legal-content">
                <Link to="/" className="back-link">← 홈으로 돌아가기</Link>

                <h1>이용약관 (Terms of Service)</h1>
                <p className="last-updated">최종 수정: 2026년 2월 4일</p>

                <section>
                    <h2>1. 서비스 개요</h2>
                    <p>Resume Builder Pro는 이력서 작성 및 템플릿 제공 서비스입니다.</p>
                </section>

                <section>
                    <h2>2. 이용 조건</h2>
                    <ul>
                        <li>본 서비스는 개인적, 비상업적 용도로만 사용해야 합니다.</li>
                        <li>프리미엄 템플릿은 구매자 본인만 사용할 수 있습니다.</li>
                        <li>템플릿의 재배포, 재판매는 금지됩니다.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. 결제 및 환불</h2>
                    <ul>
                        <li><strong>결제:</strong> 모든 결제는 Lemon Squeezy를 통해 안전하게 처리됩니다.</li>
                        <li><strong>환불 정책:</strong> 디지털 상품의 특성상 다운로드/사용 후에는 환불이 불가합니다.</li>
                        <li><strong>기술적 문제:</strong> 결제 후 기술적 문제로 서비스 이용이 불가한 경우, 고객 지원을 통해 해결해드립니다.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. 지적 재산권</h2>
                    <p>서비스 내 모든 콘텐츠(디자인, 코드, 템플릿)의 저작권은 Resume Builder Pro에 있습니다.</p>
                </section>

                <section>
                    <h2>5. 면책 조항</h2>
                    <p>서비스 이용 중 발생하는 직/간접적 손해에 대해 책임지지 않습니다. 이력서 작성 결과는 사용자의 입력에 따라 달라집니다.</p>
                </section>

                <section>
                    <h2>6. 약관 변경</h2>
                    <p>약관이 변경될 경우 서비스 내 공지를 통해 알려드립니다.</p>
                </section>

                <section>
                    <h2>7. 문의처</h2>
                    <p>서비스 관련 문의: <a href="mailto:heejung240000@gmail.com">heejung240000@gmail.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default TermsOfService;
