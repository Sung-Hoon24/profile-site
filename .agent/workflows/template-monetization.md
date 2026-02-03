---
description: "템플릿 유료화 시스템 구축을 위한 안티그레버티 통합 워크플로우 (Operation Golden Key)"
---

# 💰 Operation Golden Key: 템플릿 유료화 판매 시스템

이 워크플로우는 "프리미엄 이력서 템플릿"을 판매하기 위한 **엔터프라이즈급 결제 및 데이터 시스템** 구축 절차입니다.
안티그레버티 예하 **10개 부대의 50회 시뮬레이션 검토**를 거쳐 설계되었습니다. 단순한 클라이언트 코드가 아닌, 보안과 데이터 무결성이 보장된 시스템입니다.

---

## 🏗️ Phase 1: 아키텍처 및 데이터 설계 (Foundation)
**담당:** 제1부대(Architects), 제7부대(Data Engineers), 제4부대(Security Guard)

### 1-1. 데이터 모델링 (Firestore)
사용자의 구매 내역과 권한을 관리하기 위한 스키마를 정의합니다.

- **`products` (Collection)**: 판매할 상품 정보 (프론트 변경 없이 가격 수정 가능하도록)
  - `docId`: `template_dev_premium`
  - `price`: 5000 (Number)
  - `currency`: "KRW"
  - `name`: "시니어 개발자 템플릿"
  - `isActive`: true

- **`users/{userId}/purchases` (Collection)**: 구매 영수증 (Immutable)
  - **`Document ID`**: `imp_uid` 값 (예: "imp_1234567890") - **Idempotency 보장 (중복 결제 방지)**
  - `merchant_uid`: "mid_timestamp"
  - `amount`: 5000
  - `status`: "paid" | "refunded"
  - `purchasedAt`: Timestamp
  - `receipt_url`: "https://dashboard.portone..." (영수증 링크)

- **`users/{userId}` (Document)**: 빠른 권한 확인용
  - `entitlements`: ["template_dev_premium", "template_designer_pro"] (Array)

### 1-2. 보안 규칙 (Firestore Rules)
- `products`: **Public Read** (누구나 가격 확인 가능), **Write Deny** (관리자만 수정)
- `purchases`: **Create Deny** (클라이언트 직접 생성 금지, 오직 서버만 생성), **Read Owner Only**
- `users`: **Update Rule Check**
  - 클라이언트가 프로필 수정 시 `entitlements` 필드는 **절대 건드리지 못하게** 방어.
  - `allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['basicInfo', 'experience', ...])`

---

## 🔗 Phase 2: 결제 연동 및 서버 검증 (Connectivity)
**담당:** 제10부대(Connectivity), 제3부대(Logic Core), 제5부대(Deploy Rangers)

### 2-1. PG사 선정 및 연동
- **PortOne (구 I'mport)** 도입: 카카오페이, 토스페이먼트 사용.
- `index.html`에 V2 SDK 추가.
- **Mobile 대응**: `request_pay` 호출 시 `m_redirect_url` 파라미터 필수 설정 (인앱 브라우저 탈출).

### 2-2. Cloud Functions (서버리스 백엔드) 필수 구현
클라이언트 조작 방지를 위해 핵심 로직은 서버에서 수행합니다.

1.  **`verifyPayment` (Callable Function)**
    - 클라이언트가 결제 완료 후 `imp_uid`를 보냄.
    - 서버가 PortOne API로 "실제 결제된 금액"과 "DB의 상품 가격"이 일치하는지 대조.
    - **검증 성공 시**: `purchases/{imp_uid}` 문서 생성 (Key로 중복 방지) 및 `entitlements` 업데이트.
    - **검증 실패 시**: 결제 취소 API 호출 (자동 환불) 및 에러 반환.

2.  **`paymentWebhook` (HTTP Function)**
    - **목적**: 브라우저 닫힘, 네트워크 오류로 인한 데이터 누락 방지.
    - PG사 서버 신호를 받아 DB 업데이트 (Idempotency 보장).

3.  **`onPurchaseRefund` (Firestore Trigger)**
    - `purchases` 문서의 `status`가 "refunded"로 변경되면,
    - 자동으로 `entitlements` 배열에서 해당 상품 ID 제거 (데이터 일관성 자동 유지).

### 2-3. Zero Error Protocol (무결점 방어 전략)
**담당:** 제1부대(Architects), 제6부대(Inspector Squad)
- **Atomic Transactions**: 결제 검증 로직(`verifyPayment`)은 반드시 `runTransaction`으로 수행. (User 읽기 + Purchase 쓰기 + Entitlement 업데이트가 한 몸처럼 동작)
- **Idempotency**: Webhook이 10번 들어와도 `imp_uid`가 같으면 DB는 딱 1번만 업데이트. (중복 처리 0%)
- **Circuit Breaker**: `verifyPayment` 함수 호출 전, 서버 상태를 Ping. 응답 없으면 아예 결제창을 띄우지 않음. (보이지 않는 에러 방지)
- **Structured Logging**: 단순 텍스트 로그 금지. `{ event: "PAYMENT_ERR", uid: "...", error: "..." }` 형태의 JSON 로그 적재.

---

## 🎨 Phase 3: 프론트엔드 구축 (User Experience)
**담당:** 제2부대(Design Ops), 제3부대(Logic Core)

### 3-1. Premium Guard 로직
- `TEMPLATES` 상수를 분리:
  - `BASIC_TEMPLATES`: 번들에 포함.
  - `PREMIUM_TEMPLATES`: 번들에서 제외하거나, 내용을 암호화/더미 데이터로 처리.
- **Fetch Logic**: 사용자가 프리미엄 템플릿 클릭 -> `entitlements` 확인 -> 권한 있으면 원본 데이터 다운로드/해금.

### 3-2. UI 컴포넌트
- **`PricingModal.jsx`**:
  - 상품 설명, 가격, 결제 수단 선택, "구매하기" 버튼.
  - 로딩 상태(결제 검증 중) 처리.
- **Lock UI**:
  - 잠금 아이콘(🔒), 블러(Blur) 효과 처리된 미리보기 이미지.

---

## 🕵️ Phase 4: 검증 및 시나리오 테스트 (Quality Assurance)
**담당:** 제6부대(Inspector Squad)

### 4-1. 테스트 시나리오
1.  **Happy Path**: 결제 성공 -> 모달 닫힘 -> 즉시 템플릿 로드 -> 새로고침 해도 권한 유지.
2.  **Abuse Path**: 개발자 도구로 `isPremium` 변수 조작 -> 서버 데이터(`entitlements`)가 없으므로 실제 저장/다운로드 시 차단됨.
3.  **Disaster Path**: 결제 승인 직후 인터넷 연결 해제 -> Webhook이 나중에 들어와서 권한 복구되는지 확인.

---

## 🚀 실행 가이드 (Action Plan)

1.  **PortOne 가입 및 API Key 발급**
2.  **Firebase Cloud Functions 세팅** (`npm init functions`)
3.  **DB 스키마 생성 및 상품 등록**
4.  **UI 개발 (Modal & SDK연동)**

이 워크플로우를 승인하시면, **Phase 1 (DB 및 서버 설정)**부터 착수하겠습니다.
