# Notebook Unit 09: Troubleshooting Guide

## 1. "Network Error" / Black Screen on Mobile
- **Cause**: Firewall blocking port 5173 or Public Network Profile.
- **Fix**:
    1. Switch WiFi profile to **Private**.
    2. Allow Node.js in Firewall.
    3. Use `localtunnel` HTTPS link.

## 2. "Unsaved Changes" (Data Loss)
- **Cause**: Switching between Auth providers (Kakao <-> Google) changes the User ID.
- **Fix**:
    - Log out and log back in with the original provider.
    - (Implemented) Stable Kakao ID ensures persistence even if session resets.

## 3. "Permission Denied" (Firstore)
- **Cause**: Firestore Security Rules block write.
- **Fix**: Check `firestore.rules` in Firebase Console. Currently set to allow all (monitor for abuse).

## 4. Kakao Login Popup Blocked
- **Cause**: Browser popup blocker.
- **Fix**: Allow popups for the domain. SDK usually falls back, but sometimes fails silently.
