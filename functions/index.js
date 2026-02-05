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

        // 4. Verify Amount & Status
        const TARGET_AMOUNT = 5000;
        if (paymentData.status !== 'paid' || paymentData.amount !== TARGET_AMOUNT) {
            console.error('[VERIFY_FAIL] Invalid Status/Amount', paymentData);
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
                    productId: 'template_dev_premium',
                    amount: paymentData.amount,
                    status: 'paid',
                    purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                    method: paymentData.pay_method,
                    receipt_url: paymentData.receipt_url
                });

                // Update Entitlements (Safe Array Union)
                t.set(userRef, {
                    entitlements: admin.firestore.FieldValue.arrayUnion('template_dev_premium')
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
                productId: 'template_dev_premium',
                amount: paymentData.amount,
                status: 'paid',
                purchasedAt: admin.firestore.FieldValue.serverTimestamp(),
                method: paymentData.pay_method,
                receipt_url: paymentData.receipt_url,
                via: 'webhook' // Audit trail
            });

            // Update Entitlements
            t.set(userRef, {
                entitlements: admin.firestore.FieldValue.arrayUnion('template_dev_premium')
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
                    entitlements: admin.firestore.FieldValue.arrayUnion('template_dev_premium'),
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
