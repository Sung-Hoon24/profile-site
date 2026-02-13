/**
 * Firebase Cloud Function: Kakao OAuth Token Exchange
 * 
 * This function securely exchanges the authorization code for an access token.
 * The App Secret is stored server-side, never exposed to the client.
 */

const functions = require('firebase-functions');
const fetch = require('node-fetch');

// PortOne Credentials (Set via firebase functions:config:set portone.key="..." portone.secret="...")
const PORTONE_API_KEY = functions.config().portone?.key || process.env.PORTONE_API_KEY;
const PORTONE_API_SECRET = functions.config().portone?.secret || process.env.PORTONE_API_SECRET;

const admin = require('firebase-admin');
admin.initializeApp();
const axios = require('axios');

/**
 * Verify Payment & Grant Entitlement (Atomic)
 * 
 * Flow:
 * 1. Client sends { imp_uid, merchant_uid }
 * 2. Get Access Token from PortOne
 * 3. Get Payment Details from PortOne
 * 4. Verify status 'paid' and amount == 5000
 * 5. Run Firestore Transaction:
 *    - Check if Purchase already exists (Idempotency)
 *    - Create Purchase Document
 *    - Add 'template_dev_premium' to User Entitlements
 */
exports.verifyPayment = functions.https.onCall(async (data, context) => {
    // 1. Auth Check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }
    const uid = context.auth.uid;
    const { imp_uid, merchant_uid } = data;

    if (!imp_uid) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing imp_uid');
    }

    console.log(`[VERIFY_START] User: ${uid}, ImpUID: ${imp_uid}`);

    try {
        // 2. Get PortOne Access Token
        // NOTE: In production, cache this token to avoid rate limits
        const tokenRes = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: PORTONE_API_KEY,
            imp_secret: PORTONE_API_SECRET
        });
        const { access_token } = tokenRes.data.response;

        // 3. Get Payment Data
        const paymentRes = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
            headers: { Authorization: access_token }
        });
        const paymentData = paymentRes.data.response;

        if (!paymentData) {
            throw new functions.https.HttpsError('not-found', 'Payment not found in PortOne');
        }

        // 4. Verify Amount & Status (Dynamic Check)
        const productRef = admin.firestore().collection('products').doc('resume_premium');
        const productSnap = await productRef.get();

        if (!productSnap.exists) {
            console.error('[VERIFY_FAIL] Product not found: resume_premium');
            throw new functions.https.HttpsError('not-found', 'Product definition not found');
        }

        const productData = productSnap.data();
        // Ensure price is compared as number
        const TARGET_AMOUNT = Number(productData.price);

        if (paymentData.status !== 'paid' || paymentData.amount !== TARGET_AMOUNT) {
            console.error(`[VERIFY_FAIL] Amount Mismatch. Expected: ${TARGET_AMOUNT}, Got: ${paymentData.amount}`);
            throw new functions.https.HttpsError('failed-precondition', 'Payment verification failed (Amount mismatch or not paid)');
        }

        // 5. Atomic Transaction (With Auto-Refund Circuit Breaker)
        try {
            await admin.firestore().runTransaction(async (t) => {
                const purchaseRef = admin.firestore().collection('users').doc(uid).collection('purchases').doc(imp_uid);
                const userRef = admin.firestore().collection('users').doc(uid);

                const purchaseDoc = await t.get(purchaseRef);
                if (purchaseDoc.exists) {
                    console.log('[IDEMPOTENCY] Purchase already exists.');
                    return { success: true, message: 'Already processed' };
                }

                // Write Purchase Receipt
                t.set(purchaseRef, {
                    imp_uid: imp_uid,
                    merchant_uid: merchant_uid,
                    productId: 'resume_premium',
                    amount: paymentData.amount,
                    status: 'paid',
                    purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                    method: paymentData.pay_method,
                    receipt_url: paymentData.receipt_url
                });

                // Update Entitlements (Safe Array Union)
                t.set(userRef, {
                    entitlements: admin.firestore.FieldValue.arrayUnion('resume_premium')
                }, { merge: true });
            });

            console.log(`[VERIFY_SUCCESS] Entitlement Granted for ${uid}`);
            return { success: true };

        } catch (dbError) {
            console.error('[CRITICAL_DB_FAIL] Transaction Failed. Initiating Auto-Refund...', dbError);

            // 🚨 CIRCUIT BREAKER: Auto-Refund
            try {
                await axios.post('https://api.iamport.kr/payments/cancel', {
                    imp_uid: imp_uid,
                    reason: 'System Error: Purchase Record Failed (Auto-Refund)',
                    checksum: paymentData.amount
                }, {
                    headers: { Authorization: access_token }
                });
                console.log(`[REFUND_SUCCESS] Refunded ${imp_uid} due to DB error.`);
                throw new functions.https.HttpsError('aborted', 'System error during saving. Payment has been automatically refunded.');
            } catch (refundError) {
                console.error('[REFUND_FAIL] ⚠️ FATAL: Could not refund user!', refundError);
                // This is a P0 critical alert scenario (Need manual intervention)
                throw new functions.https.HttpsError('internal', 'System error. Please contact support. (Ref: ' + imp_uid + ')');
            }
        }

    } catch (error) {
        console.error('[VERIFY_ERR]', error);
        // Clean Error to Client
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', 'Payment verification server error');
    }
});

/**
 * Webhook Handler (Async Payment Notification)
 * 
 * Flow:
 * 1. PortOne sends POST { imp_uid, merchant_uid, status }
 * 2. Get Payment Details from PortOne (Security Check)
 * 3. Atomic Transaction (Same logic as verifyPayment)
 * 4. Return 200 OK (Stop PortOne from retrying)
 */
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { imp_uid, status } = req.body;
    console.log(`[WEBHOOK_HIT] ImpUID: ${imp_uid}, Status: ${status}`);

    if (status !== 'paid') {
        // We only care about success (or maybe 'cancelled' for refund logic later)
        res.send({ status: 'ignored' });
        return;
    }

    try {
        // 1. Get PortOne Access Token
        const tokenRes = await axios.post('https://api.iamport.kr/users/getToken', {
            imp_key: PORTONE_API_KEY,
            imp_secret: PORTONE_API_SECRET
        });
        const { access_token } = tokenRes.data.response;

        // 2. Get Payment Data
        const paymentRes = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, {
            headers: { Authorization: access_token }
        });
        const paymentData = paymentRes.data.response;

        if (!paymentData || paymentData.status !== 'paid') {
            console.error('[WEBHOOK_FAIL] Invalid Data', paymentData);
            res.status(400).send('Verification Failed');
            return;
        }

        const uid = paymentData.custom_data?.uid; // Assumes we sent 'custom_data' during payment
        if (!uid) {
            // Serious issue: We don't know who this is for.
            // But we must return 200 to stop retry, or log for manual fix.
            console.error('[WEBHOOK_CRITICAL] Missing UID in custom_data');
            res.status(200).send({ status: 'manual_check_needed' });
            return;
        }

        // 3. Atomic Transaction
        await admin.firestore().runTransaction(async (t) => {
            const purchaseRef = admin.firestore().collection('users').doc(uid).collection('purchases').doc(imp_uid);
            const userRef = admin.firestore().collection('users').doc(uid);

            const purchaseDoc = await t.get(purchaseRef);
            if (purchaseDoc.exists) {
                console.log('[WEBHOOK_IDEMPOTENCY] Already processed.');
                return;
            }

            // Write Purchase Receipt
            t.set(purchaseRef, {
                imp_uid: imp_uid,
                merchant_uid: paymentData.merchant_uid,
                productId: 'resume_premium',
                amount: paymentData.amount,
                status: 'paid',
                purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                method: paymentData.pay_method,
                receipt_url: paymentData.receipt_url,
                via: 'webhook' // Audit trail
            });

            // Update Entitlements
            t.set(userRef, {
                entitlements: admin.firestore.FieldValue.arrayUnion('resume_premium')
            }, { merge: true });
        });

        res.send({ status: 'success' });

    } catch (error) {
        console.error('[WEBHOOK_ERR]', error);
        res.status(500).send('Internal Server Error');
    }
});
/**
 * 🍋 Lemon Squeezy Webhook Handler
 * 
 * Handles 'order_created' events to unlock premium features.
 * Validates X-Signature to ensure request is legit.
 */
exports.lemonSqueezyWebhook = functions.https.onRequest(async (req, res) => {
    const crypto = require('crypto');
    const secret = functions.config().lemonsqueezy?.secret || process.env.LEMON_SQUEEZY_SECRET || "silver-castle-secret-key-1234";

    // 1. Validate Signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.rawBody).digest('hex'), 'utf8');
    const signature = Buffer.from(req.get('X-Signature') || '', 'utf8');

    if (!crypto.timingSafeEqual(digest, signature)) {
        console.error("🍋 [LEMON_FAIL] Invalid Signature.");
        res.status(401).send('Invalid signature');
        return;
    }

    const event = req.body;
    console.log(`🍋 [LEMON_HIT] Event: ${event.meta.event_name}`);

    // 2. Process 'order_created'
    if (event.meta.event_name === 'order_created') {
        const { id, attributes } = event.data;
        const customData = event.meta.custom_data || {};
        const userId = customData.user_id; // Passed from frontend: checkout[custom][user_id]

        if (!userId) {
            console.error("🍋 [LEMON_FAIL] No user_id in custom_data. Cannot attribute purchase.");
            res.status(400).send('Missing user_id');
            return;
        }

        try {
            await admin.firestore().runTransaction(async (t) => {
                const userRef = admin.firestore().collection('users').doc(userId);
                const purchaseRef = userRef.collection('purchases').doc(id);

                // Check Idempotency
                const doc = await t.get(purchaseRef);
                if (doc.exists) return;

                // Grant Premium
                t.set(purchaseRef, {
                    orderId: id,
                    amount: attributes.total,
                    currency: attributes.currency,
                    status: attributes.status,
                    email: attributes.user_email,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    provider: 'lemonsqueezy'
                });

                t.set(userRef, {
                    entitlements: admin.firestore.FieldValue.arrayUnion('resume_premium'),
                    isPremium: true
                }, { merge: true });
            });

            console.log(`🍋 [LEMON_SUCCESS] Premium granted to ${userId}`);
            res.status(200).send('Premium Granted');
        } catch (err) {
            console.error("🍋 [LEMON_ERR] Firestore update failed:", err);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(200).send('Event ignored');
    }
});

/**
 * Kakao Token Exchange (실 구현)
 *
 * firebase.json rewrite: /api/kakao-token → kakaoTokenExchange
 *
 * 흐름 4단계:
 *  1. Receive: 클라이언트에서 { code, redirectUri }를 받는다
 *  2. Exchange: 카카오 토큰 엔드포인트에서 access_token 교환
 *  3. Verify: access_token으로 카카오 사용자 정보 조회
 *  4. Mint: Firebase Custom Token 발급
 *
 * 보안 원칙:
 *  - 민감정보는 functions.config()에서만 읽음
 *  - 토큰/개인정보는 로그에 절대 남기지 않음
 *  - CORS 허용목록 기반 제어
 */
exports.kakaoTokenExchange = functions.https.onRequest(async (req, res) => {
    // ─── CORS 처리 (허용 오리진 기반) ───
    const allowedOrigins = [
        // 프로덕션 도메인 (firebase.json hosting 기준)
        'https://my-awesome-site-f3f94.web.app',
        'https://my-awesome-site-f3f94.firebaseapp.com',
        // 로컬 개발용
        'http://localhost:5173',
        'http://localhost:3000'
    ];

    const origin = req.headers.origin || '';

    // 허용 오리진 매칭
    if (allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
    }
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');

    // OPTIONS 프리플라이트 처리
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // POST 외 메서드 차단
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'method_not_allowed', message: 'Only POST is accepted', stage: 'receive' });
        return;
    }

    // ─── Step 1: Receive (요청 파라미터 수신) ───
    const authCode = req.body.code || req.body.auth_code; // 프론트 호환: 'code' 또는 'auth_code'
    const clientRedirectUri = req.body.redirectUri; // 프론트에서 보내는 redirectUri

    if (!authCode) {
        functions.logger.warn('[KAKAO_TOKEN] Stage: receive — 인증 코드 누락');
        res.status(400).json({ error: 'missing_code', message: 'Authorization code is required', stage: 'receive' });
        return;
    }

    functions.logger.info('[KAKAO_TOKEN] Stage: receive — 요청 수신 완료');

    // ─── config에서 민감정보 읽기 (하드코딩 0) ───
    const kakaoConfig = functions.config().kakao || {};
    const KAKAO_REST_API_KEY = kakaoConfig.rest_api_key;
    const KAKAO_CLIENT_SECRET = kakaoConfig.client_secret; // 선택사항 (없을 수 있음)
    const KAKAO_REDIRECT_URI = clientRedirectUri || kakaoConfig.redirect_uri;
    const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
    const KAKAO_ME_URL = 'https://kapi.kakao.com/v2/user/me';

    // config 유효성 검증
    if (!KAKAO_REST_API_KEY) {
        functions.logger.error('[KAKAO_TOKEN] Stage: config — REST API Key가 설정되지 않음');
        res.status(500).json({ error: 'config_missing', message: 'Kakao REST API Key is not configured', stage: 'config' });
        return;
    }

    if (!KAKAO_REDIRECT_URI) {
        functions.logger.error('[KAKAO_TOKEN] Stage: config — Redirect URI가 설정되지 않음');
        res.status(500).json({ error: 'config_missing', message: 'Redirect URI is not configured', stage: 'config' });
        return;
    }

    try {
        // ─── Step 2: Exchange (카카오 토큰 교환) ───
        functions.logger.info('[KAKAO_TOKEN] Stage: exchange — 카카오 토큰 교환 시작');

        // 요청 파라미터 구성
        const tokenParams = new URLSearchParams();
        tokenParams.append('grant_type', 'authorization_code');
        tokenParams.append('client_id', KAKAO_REST_API_KEY);
        tokenParams.append('redirect_uri', KAKAO_REDIRECT_URI);
        tokenParams.append('code', authCode);

        // client_secret이 설정된 경우에만 추가
        if (KAKAO_CLIENT_SECRET) {
            tokenParams.append('client_secret', KAKAO_CLIENT_SECRET);
        }

        const tokenResponse = await axios.post(KAKAO_TOKEN_URL, tokenParams.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000 // 10초 타임아웃
        });

        const kakaoAccessToken = tokenResponse.data.access_token;

        if (!kakaoAccessToken) {
            functions.logger.error('[KAKAO_TOKEN] Stage: exchange — access_token이 응답에 없음');
            res.status(502).json({ error: 'kakao_exchange_failed', message: 'No access_token in Kakao response', stage: 'exchange' });
            return;
        }

        functions.logger.info('[KAKAO_TOKEN] Stage: exchange — 토큰 교환 성공');

        // ─── Step 3: Verify (카카오 사용자 정보 조회) ───
        functions.logger.info('[KAKAO_TOKEN] Stage: verify — 사용자 정보 조회 시작');

        const userResponse = await axios.get(KAKAO_ME_URL, {
            headers: { 'Authorization': `Bearer ${kakaoAccessToken}` },
            timeout: 10000
        });

        const kakaoUserId = userResponse.data.id;

        if (!kakaoUserId) {
            functions.logger.error('[KAKAO_TOKEN] Stage: verify — 카카오 사용자 ID를 가져올 수 없음');
            res.status(502).json({ error: 'kakao_verify_failed', message: 'Could not retrieve Kakao user ID', stage: 'verify' });
            return;
        }

        // 안전 로깅: userId만 남기고, 이름/이메일/전화번호 등은 절대 로깅하지 않음
        functions.logger.info(`[KAKAO_TOKEN] Stage: verify — 사용자 확인 완료 (kakaoId: ${kakaoUserId})`);

        // ─── Step 4: Mint (Firebase Custom Token 발급) ───
        functions.logger.info('[KAKAO_TOKEN] Stage: mint — Firebase Custom Token 발급 시작');

        // 카카오 사용자 ID를 Firebase UID로 변환 (문자열 보장)
        const firebaseUid = `kakao_${String(kakaoUserId)}`;

        const firebaseCustomToken = await admin.auth().createCustomToken(firebaseUid);

        functions.logger.info(`[KAKAO_TOKEN] Stage: mint — Custom Token 발급 성공 (uid: ${firebaseUid})`);

        // ─── 응답 반환 ───
        // 프론트 호환: KakaoCallback.jsx가 access_token을 기대하므로 포함
        // 보안 주의: access_token은 클라이언트에서 Kakao SDK용으로만 사용
        // 캐시 방지: 토큰이 브라우저/프록시 캐시에 남지 않도록 차단
        res.set('Cache-Control', 'no-store');
        res.set('Pragma', 'no-cache');
        res.status(200).json({
            access_token: kakaoAccessToken,        // 프론트 호환용 (기존 KakaoCallback.jsx)
            firebaseCustomToken: firebaseCustomToken, // 향후 Firebase Auth 마이그레이션용
            kakaoUserId: String(kakaoUserId),
            issuedAt: Date.now()
        });

    } catch (error) {
        // ─── 에러 핸들링 (단계별 분류) ───
        const stage = error.config?.url?.includes('kauth') ? 'exchange'
            : error.config?.url?.includes('kapi') ? 'verify'
                : 'unknown';

        // Axios 에러인 경우 카카오 응답 포함
        if (error.response) {
            functions.logger.error(`[KAKAO_TOKEN] Stage: ${stage} — HTTP ${error.response.status}`, {
                kakaoError: error.response.data?.error || 'unknown',
                kakaoErrorDesc: error.response.data?.error_description || ''
            });

            res.status(502).json({
                error: `kakao_${stage}_failed`,
                message: error.response.data?.error_description || error.response.data?.msg || 'Kakao API error',
                stage: stage
            });
            return;
        }

        // 타임아웃 또는 네트워크 에러
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
            functions.logger.error(`[KAKAO_TOKEN] Stage: ${stage} — 타임아웃 발생`);
            res.status(504).json({
                error: 'timeout',
                message: 'Kakao API request timed out',
                stage: stage
            });
            return;
        }

        // Firebase Admin 에러 (Custom Token 발급 실패)
        if (error.code?.startsWith('auth/')) {
            functions.logger.error(`[KAKAO_TOKEN] Stage: mint — Firebase Auth 에러: ${error.code}`);
            res.status(500).json({
                error: 'mint_failed',
                message: 'Failed to create Firebase custom token',
                stage: 'mint'
            });
            return;
        }

        // 기타 예상치 못한 에러
        functions.logger.error('[KAKAO_TOKEN] Stage: unknown — 예상치 못한 에러 발생', {
            errorMessage: error.message || 'Unknown error'
        });
        res.status(500).json({
            error: 'internal_error',
            message: 'An unexpected error occurred',
            stage: 'unknown'
        });
    }
});
