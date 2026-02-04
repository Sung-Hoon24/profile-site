# 🌍 제11부대: 글로벌 페이먼트 콥스 (Global Payment Corps)
**임무**: 해외 결제 시스템 연동, 사업자 없이 수익화, 국제 결제 대행(MoR), 다국적 세금 처리

## 📡 NotebookLM 입력용 프롬프트 (복사해서 사용)
```text
당신은 글로벌 핀테크 전문가이자 인디 해커(Indie Hacker) 멘토입니다.
한국에서 개인 사업자 등록 없이 해외 고객에게 디지털 상품(템플릿, 소프트웨어 등)을 판매하려면
어떤 결제 플랫폼이 최적인지 비교 분석해 주세요.

특히 다음 항목을 중심으로:
1. Paddle vs Gumroad vs Lemon Squeezy 상세 비교
2. MoR(Merchant of Record) 모델의 장단점
3. 한국 개발자가 주의해야 할 세금 신고 절차
4. 각 플랫폼의 Webhook/API 연동 방법
5. 환율 및 정산 주기
```

## 💾 [수신된 정보] NotebookLM 최신 팁 붙여넣기
(아래에 NotebookLM의 답변을 주기적으로 업데이트해 주세요.)

### 🏆 플랫폼 비교표
| 항목 | Paddle | Gumroad | Lemon Squeezy |
|------|--------|---------|---------------|
| 개인 사용 | ✅ | ✅ | ✅ |
| 수수료 | 5% + 50¢ | 10% | 5% + 50¢ |
| 한국 결제 | ✅ 카카오/네이버 | ⚠️ 카드만 | ✅ 일부 |
| 세금 대행 | ✅ MoR | ❌ | ✅ MoR |
| 정산 주기 | 월 1회 | 금요일 | 월 2회 |

### 📋 MoR (Merchant of Record) 이란?
> 판매자 대신 "법적 판매자" 역할을 수행하는 모델
> - 장점: 세금 신고, 환불 처리, VAT 등을 대행
> - 단점: 수수료가 다소 높음

### 🔗 SDK/API 연동 가이드
- **Paddle**: https://developer.paddle.com
- **Gumroad**: https://gumroad.com/api
- **Lemon Squeezy**: https://docs.lemonsqueezy.com

## 🎯 현재 프로젝트 적용 계획
- [ ] Paddle 계정 생성 (Individual)
- [ ] Paddle SDK 연동 코드 작성
- [ ] 기존 PortOne 코드 마이그레이션
- [ ] Webhook 엔드포인트 설정
- [ ] 테스트 결제 검증

## ⚠️ 주의사항
1. **세금**: MoR 사용해도 한국 종합소득세 신고 필요
2. **환율**: USD → KRW 전환 시 환율 수수료 발생
3. **심사**: Paddle 심사 통과까지 며칠 소요 가능
