# Notebook Unit 04: Core Data Structure

## 1. Resume Schema (`INITIAL_RESUME_STATE`)
The master object that holds all user data.

```javascript
{
    basicInfo: {
        id: "basic",
        title: "Basic Info",
        name: "",
        email: "",
        phone: "",
        jobTitle: "",
        summary: ""
    },
    experience: [
        { id: 1, company: "", role: "", startDate: "", endDate: "", description: "" }
    ],
    education: [
        { id: 1, school: "", degree: "", graduationDate: "" }
    ],
    skills: "", // Text area string
    projects: [], // (Future)
    languages: [] // (Future)
}
```

## 2. State Management (`ResumeContext`)
- **`data`**: The current in-memory resume object.
- **`user`**: The current Firebase Auth user object.
- **`saveStatus`**:
    - `'saved'`: Synced with cloud.
    - `'unsaved'`: Local changes exist (Red/Yellow dot).
    - `'saving'`: Network request in progress (Spinner).
    - `'error'`: Save failed.
- **`customDocId`**: Override key for Kakao persistence.

## 3. Synchronization Logic
1.  **Local Init**: Load from `localStorage` on boot.
2.  **Auth Detect**: If user logs in:
    - Check for **Conflict** (Local dirty vs Cloud data).
    - If Conflict: Show `ConflictModal` (Keep Local vs Load Cloud).
    - If Clean: Auto-load Cloud Data.
3.  **Auto-Save**: Currently Manual-Triggered (via Button or SyncStatus click) to save costs/reads, though `localStorage` is auto-updated on every keystroke.
