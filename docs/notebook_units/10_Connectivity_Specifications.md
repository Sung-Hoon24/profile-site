# Notebook Unit 10: Connectivity Specifications

## 1. Firebase Config
**Location**: `firebase.js`
**Variables**:
- `apiKey`: Public identifier.
- `authDomain`: OAuth redirect handler.
- `projectId`: Firestore/Storage bucket ID.
**Status**: Currently hardcoded (Safe for Firebase Client SDKs, but Env Vars preferred for cleanup).

## 2. Kakao SDK Config
**Key**: Javascript Key (starts with `b0d...`).
**Flow**:
- `Kakao.init(key)` checks connection.
- `Kakao.Auth.login` opens `accounts.kakao.com/login`.
- Returns `authObj.access_token`.
- Uses `Kakao.API.request('/v2/user/me')` for User ID.

## 3. Local Environment Variables (`.env`)
- `VITE_KAKAO_KEY`: Injectable Kakao Key.
- `VITE_FIREBASE_Config`: (Not yet implemented, future proofing).

## 4. Port Allocations
- `5173`: Vite Dev Server (Web).
- `5174+`: Fallback if 5173 is busy.
- `9222`: Chrome Debugging (if used).
