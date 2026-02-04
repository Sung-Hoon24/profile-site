import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LegalPage.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-container">
            <div className="legal-content">
                <Link to="/" className="back-link">← 홈으로 돌아가기</Link>

                <h1>개인정보 처리방침 (Privacy Policy)</h1>
                <p className="last-updated">최종 수정: 2026년 2월 4일</p>

                <section>
                    <h2>1. 수집하는 개인정보</h2>
                    <p>Resume Builder Pro는 서비스 제공을 위해 다음 정보를 수집합니다:</p>
                    <ul>
                        <li><strong>계정 정보:</strong> 이메일 주소, 이름 (소셜 로그인 시)</li>
                        <li><strong>결제 정보:</strong> 결제 처리는 Lemon Squeezy를 통해 이루어지며, 당사는 카드 정보를 직접 저장하지 않습니다.</li>
                        <li><strong>사용 데이터:</strong> 서비스 이용 기록, 접속 로그</li>
                    </ul>
                </section>

                <section>
                    <h2>2. 개인정보 이용 목적</h2>
                    <ul>
                        <li>서비스 제공 및 계정 관리</li>
                        <li>구매 내역 확인 및 고객 지원</li>
                        <li>서비스 개선 및 통계 분석</li>
                    </ul>
                </section>

                <section>
                    <h2>3. 개인정보 보유 기간</h2>
                    <p>회원 탈퇴 시 즉시 삭제되며, 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
                </section>

                <section>
                    <h2>4. 개인정보 제3자 제공</h2>
                    <p>결제 처리를 위해 Lemon Squeezy(Stripe)에 필요한 정보가 전달됩니다. 그 외에는 사용자 동의 없이 제3자에게 제공하지 않습니다.</p>
                </section>

                <section>
                    <h2>5. 쿠키 사용</h2>
                    <p>로그인 상태 유지 및 서비스 개선을 위해 쿠키를 사용합니다.</p>
                </section>

                <section>
                    <h2>6. 문의처</h2>
                    <p>개인정보 관련 문의: <a href="mailto:heejung240000@gmail.com">heejung240000@gmail.com</a></p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
