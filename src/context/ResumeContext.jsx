import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { db, doc, getDoc, setDoc, auth, onAuthStateChanged } from '../../firebase.js';
import { INITIAL_RESUME_STATE } from '../constants/resumeConstants';
import ConflictModal from '../components/ConflictModal';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

const LOCAL_STORAGE_KEY = 'resumeData_v1';

export const ResumeProvider = ({ children }) => {
    // 1. Initial State
    const [data, setData] = useState(() => {
        let parsed = null;
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) parsed = JSON.parse(saved);
        } catch (e) {
            console.warn('LocalStorage parse error:', e);
        }

        if (!parsed) return INITIAL_RESUME_STATE;

        // PHASE 1: MIGRATION & SANITIZATION
        return {
            ...INITIAL_RESUME_STATE,
            ...parsed,
            basicInfo: { ...INITIAL_RESUME_STATE.basicInfo, ...(parsed.basicInfo || {}) },
            experience: Array.isArray(parsed.experience)
                ? parsed.experience.map(item => ({
                    ...item,
                    role: item.role || item.title || '',
                    id: item.id || Date.now() + Math.random()
                }))
                : [],
            education: Array.isArray(parsed.education) ? parsed.education : [],
            skills: parsed.skills || ''
        };
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customDocId, setCustomDocId] = useState(null); // STABLE KEY for Social Logins (e.g. Kakao)

    // Sync Status
    const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
    const [lastSaved, setLastSaved] = useState(null);

    // Conflict Handling
    const [showConflict, setShowConflict] = useState(false);
    const [cloudDataBuffer, setCloudDataBuffer] = useState(null); // Temp store for cloud data
    const [cloudDate, setCloudDate] = useState(null);
    const isDirtyRef = useRef(false); // Track if user made changes

    // 2. Local Sync & Dirty Check
    useEffect(() => {
        if (data === INITIAL_RESUME_STATE) return;

        // Mark as dirty if it differs from initial (simplistic check)
        isDirtyRef.current = true;
        setSaveStatus('unsaved');

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // 3. Auth & Cloud Sync Logic (Optimized)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            // Determine the ID to load: Custom (if set manually before log in? Rare) or User UID
            // Important: If we use Kakao, we might set customDocId AFTER this triggers. 
            // So we handle the "Load" trigger separately or react to customDocId changes.
            
            if (currentUser && !customDocId) {
                // Standard Login (Google/Email) -> Use UID
                // Logic remains similar but we wait for potential customID if it's an anonymous user?
                // No, default to UID. If Kakao sets customDocId later, we re-load.
                if (isDirtyRef.current) {
                    checkConflict(currentUser.uid);
                } else {
                    await loadResumeFromCloud(currentUser.uid);
                }
            } else if (!currentUser) {
                // LOGOUT
                setCustomDocId(null); // Reset custom ID
                setData(INITIAL_RESUME_STATE);
                isDirtyRef.current = false;
                setSaveStatus('saved');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []); // Note: We might need to listen to customDocId too

    // New Effect: Reload if customDocId changes (e.g. Kakao login completes)
    useEffect(() => {
        if (customDocId && user) {
            console.log('Switching to Stable Storage ID:', customDocId);
            if (isDirtyRef.current) {
                checkConflict(customDocId);
            } else {
                loadResumeFromCloud(customDocId);
            }
        }
    }, [customDocId, user]);

    const checkConflict = async (uid) => {
        const docRef = doc(db, 'resumes', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCloudDataBuffer(docSnap.data());
            setCloudDate(docSnap.data().updatedAt?.toDate() || null);
            setShowConflict(true);
        } else {
            setSaveStatus('unsaved');
        }
    };

    const loadResumeFromCloud = async (uid) => {
        if (!uid) return;
        try {
            setSaveStatus('saving');
            const docRef = doc(db, 'resumes', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const cloudData = docSnap.data();
                importData(cloudData); // Use import logic to sanitize
                setSaveStatus('saved');
                setLastSaved(new Date());
                isDirtyRef.current = false;
            }
        } catch (e) {
            console.warn('Cloud load failed:', e);
            setSaveStatus('error');
        }
    };

    const saveResumeToCloud = async () => {
        if (!user) {
            alert('클라우드 저장 기능을 사용하려면 먼저 로그인해주세요.');
            return;
        }

        const targetUid = customDocId || user.uid; // Use Stable ID if available
        console.log('Saving to:', targetUid);

        setSaveStatus('saving');
        try {
            const docRef = doc(db, 'resumes', targetUid);
            // MERGE true? No, overwrite is safer for consistency, but we keep updatedAt
            await setDoc(docRef, { ...data, updatedAt: new Date() });
            setSaveStatus('saved');
            setLastSaved(new Date());
            isDirtyRef.current = false;
            alert('Cloud Save Complete! ✅');
        } catch (e) {
            console.error('Save failed:', e);
            setSaveStatus('error');
            alert('Save failed: ' + e.message);
        }
    };

    const resolveConflict = (decision) => {
        if (decision === 'keepLocal') {
            // Keep Local: Just close modal. State is already 'unsaved'.
            setShowConflict(false);
            setCloudDataBuffer(null);
            alert('Kept local data. Don\'t forget to Save to Cloud!');
        } else if (decision === 'loadCloud') {
            // Load Cloud: Overwrite local
            if (cloudDataBuffer) {
                importData(cloudDataBuffer);
                setSaveStatus('saved');
                setLastSaved(new Date());
                isDirtyRef.current = false;
                alert('Loaded data from cloud.');
            }
            setShowConflict(false);
            setCloudDataBuffer(null);
        }
    };

    const resetData = () => {
        if (window.confirm('Are you sure you want to reset all data? (This cannot be undone)')) {
            setData(INITIAL_RESUME_STATE);
            setSaveStatus('saved');
            isDirtyRef.current = false;
        }
    };

    const importData = (newData) => {
        setData({
            ...INITIAL_RESUME_STATE,
            ...newData,
            basicInfo: { ...INITIAL_RESUME_STATE.basicInfo, ...(newData.basicInfo || {}) },
            experience: Array.isArray(newData.experience) ? newData.experience : [],
            education: Array.isArray(newData.education) ? newData.education : [],
            skills: newData.skills || ''
        });
    };

    return (
        <ResumeContext.Provider value={{
            data,
            setData,
            user,
            saveResume: saveResumeToCloud,
            resetData,
            importData,
            loading,
            saveStatus, // Expose status
            lastSaved,
            setCustomDocId // Export for LoginModal
        }}>
            {children}

            {/* Context-Level Modal for Conflicts */}
            <ConflictModal
                isOpen={showConflict}
                onKeepLocal={() => resolveConflict('keepLocal')}
                onLoadCloud={() => resolveConflict('loadCloud')}
                cloudDate={cloudDate}
                localDate={Date.now()} // Approx
            />
        </ResumeContext.Provider>
    );
};
