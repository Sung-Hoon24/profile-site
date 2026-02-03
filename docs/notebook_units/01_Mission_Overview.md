# Notebook Unit 01: Project Overview & Architecture

## 1. Project Mission
**Project Name**: Profile Site (Resume Builder Pro)
**Goal**: A cyberpunk-themed, client-side Resume Builder with real-time preview, pdf export, and cloud synchronization functionality.
**Deployed URL**: Localhost / Tunnel (e.g., `https://my-resume-preview-v2.loca.lt`)

## 2. Tech Stack
- **Core**: React 19, Vite 7
- **Language**: JavaScript (JSX)
- **Styling**: Vanilla CSS (CSS Modules approach via separate files)
- **Routing**: React Router DOM v7
- **Authentication**: Firebase Auth (Google, Anonymous, Email), Kakao SDK (JS)
- **Database**: Firebase Firestore (NoSQL)
- **Deployment**: Localhost (Host exposed via `--host`)

## 3. Directory Structure
```
/src
  /components     # UI Components (Navigator, LogicModal, ResumeForm, etc.)
  /context        # Global State (ResumeContext)
  /constants      # Static Data (Initial States)
  /pages          # Page Views (LandingPage, MainBuilder)
  /styles         # CSS Files (GlobalNavigator.css, LandingPage.css, etc.)
  App.jsx         # Main Entry/Router
  main.jsx        # Root Render
/docs/notebook_units # THIS DOCUMENTATION
firebase.js       # Firebase Configuration & Service Exports
mcp_config.json   # (Missing/Optional) Server Config
```

## 4. Key Architectural Patterns
- **Context API for State**: `ResumeContext` manages the entire application state (User data, Auth status, UI flags).
- **Client-Side Storage Bridging**: Uses LocalStorage for offline persistence and Firestore for cloud sync, handled via `ResumeContext`.
- **Responsive Design**: Mobile-first layout adaptations (`@media` queries in CSS).
