# Notebook Unit 05: Component Blueprints

## 1. LandingPage (`src/pages/LandingPage.jsx`)
- **Role**: Entry point/Marketing page.
- **Features**: Hero section, Animated background (ORBs), Feature Grid, CTA to `/builder`.
- **Style**: Full-screen Cyberpunk layout.

## 2. GlobalNavigator (`src/components/Navigator.jsx`)
- **Role**: Top-level navigation bar.
- **Features**:
    - Home Button.
    - Back Button.
    - **Login/Logout Toggle**: Displays Profile Pic or Lock Icon.
    - **SyncStatus Integration**: Shows save state (integrated in EditorPanel usually, but Navigator handles Auth).

## 3. EditorPanel (`src/components/EditorPanel.jsx`)
- **Role**: The "Left Side" of the builder.
- **Features**:
    - ResumeForm inputs (Accordion style).
    - **SyncStatus Indicator**: Clickable save button.
    - Toolbars (Reset, Load Example).

## 4. PreviewPanel (`src/components/PreviewPanel.jsx` / `RenderedResume`)
- **Role**: The "Right Side" (WYSIWYG Preview).
- **Features**:
    - Real-time rendering of `ResumeContext` data.
    - **A4 Layout**: CSS-forced aspect ratio for PDF accuracy.
    - `html2pdf` / print integration.

## 5. LoginModal (`src/components/LoginModal.jsx`)
- **Role**: Authentication Entry.
- **Features**:
    - Email/PW Form (Login & Signup tabs).
    - Social Buttons (Google, Kakao).
    - Validation Feedback (Password strength).
