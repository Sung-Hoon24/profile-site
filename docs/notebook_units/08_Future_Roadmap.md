# Notebook Unit 08: Future Roadmap

## 1. PDF Export Engine V2
- **Current**: Basic browser print / `html2pdf.js` (Canvas based).
- **Goal**: Vector-based PDF generation using `react-pdf` or backend generation (Puppeteer).
- **Why**: Canvas based is blurry; Vector is crisp and selectable.

## 2. AI Resume Analysis
- **Goal**: Integrate Gemini/GPT API to analyze resume content.
- **Features**:
    - "Roast My Resume" (Critique).
    - Auto-summarize "About Me".
    - Skill keyword suggestion based on Job Title.

## 3. Multiple Templates
- **Current**: Single "Modern/Standard" layout.
- **Goal**: Switchable CSS themes (ResumeContext `theme` property).
    - *Themes*: Minimalist, Ivy League, Tech, Creative.

## 4. Backend migration (Optional)
- If logic becomes too complex for client-side, migrate to **Firebase Cloud Functions** or **Supabase**.
- Would solve the "Anonymous Auth" bridge hack by handling Kakao tokens server-side.
