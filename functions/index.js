/**
 * Firebase Cloud Function: Kakao OAuth Token Exchange
 * 
 * This function securely exchanges the authorization code for an access token.
 * The App Secret is stored server-side, never exposed to the client.
 */

const functions = require('firebase-functions');
const fetch = require('node-fetch');

// Kakao App credentials - stored in Firebase Functions config
// Set via: firebase functions:config:set kakao.client_id="YOUR_REST_API_KEY" kakao.client_secret="YOUR_CLIENT_SECRET"
const KAKAO_CLIENT_ID = functions.config().kakao?.client_id || process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = functions.config().kakao?.client_secret || process.env.KAKAO_CLIENT_SECRET;

/**
 * Exchange Kakao authorization code for access token
 * 
 * Request body: { code: string, redirectUri: string }
 * Response: { access_token: string, ... } or { error: string }
 */
exports.kakaoTokenExchange = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
        res.status(400).json({ error: 'Missing code or redirectUri' });
        return;
    }

    if (!KAKAO_CLIENT_ID) {
        res.status(500).json({ error: 'Server configuration error: KAKAO_CLIENT_ID not set' });
        return;
    }

    try {
        // Exchange code for token
        const tokenUrl = 'https://kauth.kakao.com/oauth/token';
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: KAKAO_CLIENT_ID,
            redirect_uri: redirectUri,
            code: code,
        });

        // Add client_secret if available (optional for Kakao)
        if (KAKAO_CLIENT_SECRET) {
            params.append('client_secret', KAKAO_CLIENT_SECRET);
        }

        const tokenResponse = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            body: params.toString(),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('Kakao token exchange error:', tokenData);
            res.status(400).json({
                error: tokenData.error,
                error_description: tokenData.error_description
            });
            return;
        }

        // Return the access token to the client
        res.json({
            access_token: tokenData.access_token,
            token_type: tokenData.token_type,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
        });

    } catch (error) {
        console.error('Token exchange failed:', error);
        res.status(500).json({ error: 'Token exchange failed', message: error.message });
    }
});
