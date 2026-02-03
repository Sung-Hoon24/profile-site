# Notebook Unit 03: Authentication Protocols

## 1. Hybrid Auth Strategy
The app uses a hybrid approach to support both traditional and social logins without a dedicated backend server.

| Method | Provider | Flow | Persistence Key |
| :--- | :--- | :--- | :--- |
| **Email/PW** | Firebase | Standard Firebase Auth | `user.uid` |
| **Google** | Firebase | Standard OAuth Popup | `user.uid` |
| **Kakao** | Kakao SDK | Client-side Token + Anon Auth | `kakao_{id}` |
| **Guest** | None | LocalStorage Only | N/A |

## 2. The "Kakao Bridge" Solution
Since there is no backend to exchange Kakao Tokens for Firebase Custom Tokens:
1.  **Kakao Login (Popup)**: User logs in via Kakao SDK.
2.  **ID Retrieval**: App fetches `user.id` (Stable ID) from Kakao API.
3.  **Anonymous Tunnel**: App triggers `signInAnonymously(auth)` to get a Firebase Session.
4.  **Context Override**: `ResumeContext` sets `customDocId = 'kakao_' + id`.
5.  **Storage**: Firestore reads/writes to `resumes/kakao_{id}` instead of the random Anonymous UID.

## 3. Security Rules (Firestore)
*Current State (Dev):* Open or loosely restricted.
*Target State:*
```javascript
match /resumes/{userId} {
  allow read, write: if request.auth != null; // Basic check
  // ideally: if request.auth.uid == userId OR userId.matches('kakao_' + ...)
}
```

## 4. UI/UX
- **LoginModal**: Tabs for Login/Signup. Real-time password validation (Regex).
- **GlobalNavigator**: Displays User Avatar (Google) or Generic Icon (Email/Kakao).
- **Logout**: Clears Firebase Session and Local State.
