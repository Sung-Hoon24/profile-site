# Firebase Functions Config Inventory (SSOT)

> **Single Source of Truth** — 모든 환경 변수/설정은 이 문서에서만 관리합니다.
> 실제 값은 절대 문서에 기재하지 않습니다 (변수명/형식만).

---

## 1. Config 전체 목록

| Key | 필수 | 분류 | 타입 | 사용처 | 설명 |
|-----|------|------|------|--------|------|
| `kakao.rest_api_key` | ✅ 필수 | 🔒 Secret | `string` | `kakaoTokenExchange` | 카카오 REST API 키 |
| `kakao.client_secret` | ⬜ 선택 | 🔒 Secret | `string` | `kakaoTokenExchange` | 카카오 Client Secret (보안 강화 시 사용) |
| `kakao.redirect_uri` | ✅ 필수 | 🔓 Non-secret | `string(url)` | `kakaoTokenExchange` | OAuth 콜백 URI |
| `app.allowed_origins` | ✅ 필수 | 🔓 Non-secret | `string(csv)` | `kakaoTokenExchange` | CORS 허용 오리진 (쉼표 구분) |
| `lemonsqueezy.secret` | ✅ 필수 | 🔒 Secret | `string` | `lemonSqueezyWebhook` | 웹훅 서명 검증 시크릿 |
| `portone.key` | ✅ 필수 | 🔒 Secret | `string` | `verifyPayment`, `paymentWebhook` | PortOne API Key |
| `portone.secret` | ✅ 필수 | 🔒 Secret | `string` | `verifyPayment`, `paymentWebhook` | PortOne API Secret |

---

## 2. Config 세팅 명령어 (플레이스홀더)

```bash
# Kakao OAuth
firebase functions:config:set kakao.rest_api_key="YOUR_KAKAO_REST_API_KEY"
firebase functions:config:set kakao.client_secret="YOUR_KAKAO_CLIENT_SECRET"
firebase functions:config:set kakao.redirect_uri="https://YOUR_DOMAIN/kakao-callback"

# CORS 허용 오리진
firebase functions:config:set app.allowed_origins="https://PROD_DOMAIN_1,https://PROD_DOMAIN_2,http://localhost:5173"

# LemonSqueezy
firebase functions:config:set lemonsqueezy.secret="YOUR_WEBHOOK_SECRET"

# PortOne
firebase functions:config:set portone.key="YOUR_PORTONE_KEY"
firebase functions:config:set portone.secret="YOUR_PORTONE_SECRET"

# 전체 확인
firebase functions:config:get
```

---

## 3. 미설정 시 동작 (Fail-Fast)

| Key | 미설정 시 HTTP | 응답 메시지 | 비고 |
|-----|---------------|------------|------|
| `kakao.rest_api_key` | `500` | `Kakao REST API Key not configured` | 토큰 교환 불가 |
| `kakao.redirect_uri` | `500` | `Kakao redirect URI not configured` | 토큰 교환 불가 |
| `app.allowed_origins` | `500` | `CORS allowed origins not configured` | 모든 요청 차단 (개방 금지) |
| `lemonsqueezy.secret` | `500` | `Webhook secret not configured` | 웹훅 처리 불가 |
| `portone.key` / `portone.secret` | 내부 에러 | PortOne API 호출 실패 | 결제 검증 불가 |
| `kakao.client_secret` (선택) | 정상 동작 | — | 카카오 설정에 따라 불필요할 수 있음 |

---

## 4. 변경 영향도

| Config 변경 | 영향 범위 | 주의사항 |
|------------|----------|---------|
| `app.allowed_origins` 변경 | 카카오 로그인 콜백 | 새 도메인 추가 시 반드시 포함, 누락 시 CORS 차단 |
| `kakao.redirect_uri` 변경 | 카카오 로그인 전체 | 카카오 개발자 콘솔의 Redirect URI와 반드시 일치 |
| `lemonsqueezy.secret` 변경 | 결제 웹훅 검증 | LemonSqueezy 대시보드의 시크릿과 반드시 일치 |
| `portone.key` / `portone.secret` 변경 | 결제 검증 | PortOne 콘솔의 값과 반드시 일치 |

---

> **보안 원칙**: 이 문서에 실제 키/시크릿/토큰 값을 절대 기재하지 않습니다.
> 값은 `firebase functions:config:set` 명령으로만 설정하고, `firebase functions:config:get`으로 확인합니다.
