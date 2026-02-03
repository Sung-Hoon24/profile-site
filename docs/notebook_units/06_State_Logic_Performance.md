# Notebook Unit 06: State Logic & Performance

## 1. ResumeContext Mechanics
The `ResumeContext` is the heart of the application. It employs a **Single Source of Truth** pattern.

- **Initialization**:
    - Lazy initialization of `useState` to read `localStorage` only once on boot.
    - `JSON.parse` is wrapped in `try-catch` to prevent white-screen crashes on data corruption.
- **Migration Logic**:
    - On load, incoming data is merged with `INITIAL_RESUME_STATE`.
    - This ensures new fields added in future updates (e.g., `projects: []`) are automatically backfilled for old users, preventing `undefined` errors.

## 2. React Performance Optimizations
- **Memoization**:
    - `useMemo` is used for derived data (though currently light).
    - Components like `PreviewPanel` are candidates for `React.memo` to prevent re-renders when only `EditorPanel` UI state changes (not data).
- **Debouncing**:
    - Auto-save to Cloud is **not** currently debounced to save writes (Cost Control). It requires explicit user action (Click 'Unsaved').
    - LocalStorage save **is** immediate (per keystroke) because it is free and fast.

## 3. Asynchronous Operations
- **Firebase Calls**:
    - `getDoc`, `setDoc` are async.
    - `loading` state blocks UI interactions during these calls to prevent race conditions.
    - `onAuthStateChanged` is an event listener that manages the session lifecycle independently of the React render cycle.
