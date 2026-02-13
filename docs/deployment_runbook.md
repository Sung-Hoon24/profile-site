# Deployment Runbook

> **목적**: 누가, 언제, 어디서 실행해도 동일한 결과를 재현할 수 있는 배포 절차서.
> 실제 키/시크릿/토큰 값은 절대 이 문서에 포함하지 않습니다.

---

## 1. Prerequisites (사전 요구사항)

### 1.1 Firebase CLI
```bash
# 설치 (미설치 시)
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 선택
firebase use YOUR_PROJECT_ID
```

### 1.2 Node.js 버전
- Functions Runtime: **Node.js 18** (functions/package.json `engines` 기준)
- 로컬 개발 시에도 Node 18 권장 (nvm 사용 시: `nvm use 18`)

### 1.3 Functions 의존성 설치
```bash
cd functions
npm install
```

---

## 2. Config 세팅 (배포 전 필수)

> 📋 전체 Config 목록은 [config_inventory.md](./config_inventory.md) 참조 (SSOT)

### 2.1 Config 설정 명령어

```bash
# Kakao OAuth
firebase functions:config:set kakao.rest_api_key="YOUR_KEY"
firebase functions:config:set kakao.client_secret="YOUR_SECRET"
firebase functions:config:set kakao.redirect_uri="https://YOUR_DOMAIN/kakao-callback"

# CORS 허용 오리진 (쉼표 구분)
firebase functions:config:set app.allowed_origins="https://DOMAIN_1,https://DOMAIN_2,http://localhost:5173"

# LemonSqueezy
firebase functions:config:set lemonsqueezy.secret="YOUR_WEBHOOK_SECRET"

# PortOne
firebase functions:config:set portone.key="YOUR_KEY"
firebase functions:config:set portone.secret="YOUR_SECRET"
```

### 2.2 Config 확인 (배포 전 체크)
```bash
firebase functions:config:get
```

**확인 포인트:**
- [ ] `kakao.rest_api_key` 존재하는가?
- [ ] `kakao.redirect_uri` 존재하는가?
- [ ] `app.allowed_origins` 존재하는가?
- [ ] `lemonsqueezy.secret` 존재하는가?
- [ ] `portone.key` / `portone.secret` 존재하는가?
- [ ] 값이 비어있지 않은가?

> ⚠️ 하나라도 누락되면 해당 함수가 500으로 실패합니다 (Fail-Fast 설계).

---

## 3. 로컬 에뮬레이터 실행

### 3.1 에뮬레이터 시작
```bash
firebase emulators:start --only functions
```

### 3.2 kakaoTokenExchange 로컬 테스트
```bash
# 형식 예시 (더미 코드, 실제 인증 코드 사용 금지)
curl -X POST http://localhost:5001/YOUR_PROJECT_ID/us-central1/kakaoTokenExchange \
  -H "Content-Type: application/json" \
  -d '{"code":"DUMMY_AUTH_CODE","redirectUri":"http://localhost:5173/kakao-callback"}'
```

**예상 결과 (더미 코드):**
- 카카오 API에서 인증 코드 거부 → `502 kakao_exchange_failed`

### 3.3 LemonSqueezy / PortOne 웹훅 테스트
- 서명(X-Signature) 검증이 필요하므로 로컬에서 직접 테스트는 제한적
- 실제 테스트는 LemonSqueezy/PortOne 대시보드에서 웹훅을 보내야 함
- `lemonsqueezy.secret` / `portone.key` / `portone.secret` 값을 에뮬레이터 환경에서도 config로 설정 필요

---

## 4. 배포 절차 (Functions Only)

### 4.1 전체 Functions 배포
```bash
firebase deploy --only functions
```

### 4.2 특정 함수만 배포
```bash
# 카카오 토큰 교환만
firebase deploy --only functions:kakaoTokenExchange

# 결제 검증만
firebase deploy --only functions:verifyPayment

# LemonSqueezy 웹훅만
firebase deploy --only functions:lemonSqueezyWebhook
```

### 4.3 배포 후 확인 포인트

1. **Firebase 콘솔 → Functions 탭**
   - 모든 함수가 `Active` 상태인지 확인
   - 최신 배포 시간이 방금인지 확인

2. **로그 확인**
   ```bash
   firebase functions:log --only kakaoTokenExchange
   firebase functions:log --only lemonSqueezyWebhook
   ```

3. **Smoke Test 실행**
   - [smoke_test_checklist.md](./smoke_test_checklist.md) 참조

---

## 5. 롤백 절차

```bash
# 이전 커밋으로 코드 되돌리기
git log --oneline -5
git checkout <PREVIOUS_COMMIT_HASH> -- functions/

# 재배포
firebase deploy --only functions
```

> ⚠️ Config 변경은 롤백되지 않습니다. Config 문제 시 `firebase functions:config:set`으로 수동 복원하세요.

---

> **보안 원칙**: 이 문서에 실제 키/시크릿/토큰 값을 절대 기재하지 않습니다.
