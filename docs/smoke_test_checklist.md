# Smoke Test Checklist

> **목적**: 배포 후 핵심 기능이 정상 동작하는지 확인하는 최소 검증 체크리스트.
> 테스트 시 실제 토큰/키/PII를 로그에 남기지 않습니다.

---

## A. 카카오 로그인 (kakaoTokenExchange)

### A-1. 정상 로그인 (Happy Path)
- **조건**: 유효한 카카오 인증 코드 + config 정상 설정
- **요청**: `POST /kakaoTokenExchange` with `{ code, redirectUri }`
- **예상 응답**: `200`
  ```json
  { "firebaseCustomToken": "...", "kakaoUserId": "...", "issuedAt": ... }
  ```
- **예상 로그**: `[KAKAO_TOKEN] Stage: mint — Custom Token 발급 성공 (uid: kakao_...)`
- **프론트 확인**: `signInWithCustomToken` 성공 → `/resume?logged_in=kakao` 리다이렉트
- [ ] PASS

### A-2. 인증 코드 누락
- **조건**: `code` 파라미터 없이 요청
- **요청**: `POST /kakaoTokenExchange` with `{}`
- **예상 응답**: `400`
  ```json
  { "error": "missing_code", "message": "Authorization code is required", "stage": "receive" }
  ```
- [ ] PASS

### A-3. 만료/잘못된 인증 코드
- **조건**: 유효하지 않은 `code` 값
- **예상 응답**: `502`
  ```json
  { "error": "kakao_exchange_failed", "message": "...", "stage": "exchange" }
  ```
- **예상 로그**: `[KAKAO_TOKEN] Stage: exchange — HTTP 4xx` (토큰 값 미포함)
- [ ] PASS

### A-4. Config 누락 (app.allowed_origins)
- **조건**: `app.allowed_origins` config 미설정
- **예상 응답**: `500`
  ```json
  { "error": "config_missing", "message": "CORS allowed origins not configured", "stage": "config" }
  ```
- [ ] PASS

### A-5. Config 누락 (kakao.rest_api_key)
- **조건**: `kakao.rest_api_key` config 미설정
- **예상 응답**: `500`
  ```json
  { "error": "config_missing", "message": "Kakao REST API Key not configured", "stage": "config" }
  ```
- [ ] PASS

### A-6. CORS 미허용 오리진
- **조건**: `Origin` 헤더가 `app.allowed_origins`에 없는 도메인
- **예상 동작**: `Access-Control-Allow-Origin` 헤더 미설정 → 브라우저에서 CORS 차단
- [ ] PASS

---

## B. LemonSqueezy 웹훅 (lemonSqueezyWebhook)

### B-1. 정상 서명 검증
- **조건**: 유효한 `X-Signature` + 정상 `order_created` 이벤트
- **예상 응답**: `200`
- **예상 로그**: `🍋 [LEMON_HIT] Event: order_created`
- [ ] PASS

### B-2. 서명 불일치
- **조건**: 잘못된 `X-Signature`
- **예상 응답**: `401` `Invalid signature`
- **예상 로그**: `🍋 [LEMON_FAIL] Invalid Signature.`
- [ ] PASS

### B-3. Secret 미설정
- **조건**: `lemonsqueezy.secret` config 미설정
- **예상 응답**: `500` `Webhook secret not configured`
- **예상 로그**: `🍋 [LEMON_FAIL] Webhook secret이 config에 설정되지 않음`
- [ ] PASS

---

## C. PortOne 결제 (verifyPayment / paymentWebhook)

### C-1. 미인증 사용자 요청
- **조건**: Firebase Auth 미인증 상태에서 `verifyPayment` 호출
- **예상 동작**: `unauthenticated` 에러
- [ ] PASS

### C-2. Config 누락 (portone.key / portone.secret)
- **조건**: `portone.key` 또는 `portone.secret` 미설정
- **예상 동작**: PortOne API 호출 실패 → 내부 에러 처리
- **비고**: 현재 코드는 `process.env` fallback 존재 — 환경에 따라 동작이 다를 수 있음
- [ ] PASS

---

## D. 보안 검증

### D-1. 로그 토큰/PII 미노출
- **확인 방법**: `firebase functions:log`에서 아래 항목 검색
  - `access_token` 값 → 로그에 없어야 함
  - `firebaseCustomToken` 값 → 로그에 없어야 함
  - 이메일/전화번호/이름 → 로그에 없어야 함
- **허용**: `kakaoUserId`(숫자 ID), `firebaseUid`(`kakao_` 접두사 + 숫자 ID)
- [ ] PASS

### D-2. 응답에 access_token 미포함
- **확인**: `kakaoTokenExchange` 성공 응답에 `access_token` 필드가 없어야 함
- **허용 응답 필드**: `firebaseCustomToken`, `kakaoUserId`, `issuedAt`
- [ ] PASS

---

> **테스트 규칙**: 테스트 시 실제 인증 코드/토큰/시크릿 값을 공유 채널(슬랙, 문서 등)에 절대 붙이지 않습니다.
