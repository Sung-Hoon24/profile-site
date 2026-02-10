import React, { createContext, useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { db, doc, getDoc, setDoc, onSnapshot, auth, onAuthStateChanged } from '../../firebase.js';
import { INITIAL_RESUME_STATE } from '../constants/resumeConstants';
import ConflictModal from '../components/ConflictModal';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

const LOCAL_STORAGE_KEY = 'resumeData_v2';
const LEGACY_STORAGE_KEY = 'resumeData_v1';
const CLOUD_COLLECTION = 'resumes_v2';

// Helper: Sanitize and Migrate Data
const sanitizeData = (parsed) => {
    if (!parsed) return INITIAL_RESUME_STATE;
    return {
        ...INITIAL_RESUME_STATE,
        ...parsed,
        templateId: parsed.templateId || INITIAL_RESUME_STATE.templateId,
        theme: parsed.theme || INITIAL_RESUME_STATE.theme,
        lang: parsed.lang || INITIAL_RESUME_STATE.lang,
        basicInfo: { ...INITIAL_RESUME_STATE.basicInfo, ...(parsed.basicInfo || {}) },
        experience: Array.isArray(parsed.experience)
            ? parsed.experience.map(item => ({
                ...item,
                role: item.role || item.title || '',
                id: item.id || Date.now() + Math.random() // Ensure ID exists
            }))
            : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        skills: parsed.skills || ''
    };
};

export const ResumeProvider = ({ children }) => {
    // 1. Initial State with Sanitization
    const [data, setData] = useState(() => {
        try {
            const savedV2 = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedV2) return sanitizeData(JSON.parse(savedV2));

            // Migration: Check V1 if V2 is missing
            const savedV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
            if (savedV1) {
                console.info('🛠 Migrating data from V1 to V2...');
                return sanitizeData(JSON.parse(savedV1));
            }
            return INITIAL_RESUME_STATE;
        } catch (e) {
            console.warn('LocalStorage parse error:', e);
            return INITIAL_RESUME_STATE;
        }
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customDocId, setCustomDocId] = useState(null);

    // WYSIWYG & Global State
    const [isEditMode, setIsEditMode] = useState(true); // Default to Edit mode
    const [lang, setLang] = useState(INITIAL_RESUME_STATE.lang);
    const [isPremium, setIsPremium] = useState(false); // Premium Status (Default: False)

    // Sync Status
    const [saveStatus, setSaveStatus] = useState('saved');
    const [lastSaved, setLastSaved] = useState(null);

    // Conflict Handling
    const [showConflict, setShowConflict] = useState(false);
    const [cloudDataBuffer, setCloudDataBuffer] = useState(null);
    const [cloudDate, setCloudDate] = useState(null);
    const isDirtyRef = useRef(false);

    // 2. Local Sync & Dirty Check
    useEffect(() => {
        // Always sync valid data to localStorage to prevent data loss
        if (data) {
            isDirtyRef.current = true;
            setSaveStatus('unsaved');
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
    }, [data]);

    // Actions wrapped in useCallback
    const importData = useCallback((newData) => {
        setData(sanitizeData(newData));
    }, []);

    const resetData = useCallback(() => {
        if (window.confirm('Are you sure you want to reset all data? (This cannot be undone)')) {
            setData(INITIAL_RESUME_STATE);
            setSaveStatus('saved');
            isDirtyRef.current = false;
        }
    }, []);

    const saveResumeToCloud = useCallback(async () => {
        if (!user) {
            alert('클라우드 저장 기능을 사용하려면 먼저 로그인해주세요.');
            return;
        }

        const targetUid = customDocId || user.uid;
        console.log('Saving to:', targetUid);

        setSaveStatus('saving');
        try {
            const docRef = doc(db, CLOUD_COLLECTION, targetUid);
            // Save current state 'data'
            // Note: 'data' dependency will cause this function to recreate on every change. 
            // This is expected unless we use a Ref for data, but for now this is fine.
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
    }, [user, customDocId, data]);

    const checkConflict = async (uid) => {
        const docRef = doc(db, CLOUD_COLLECTION, uid);
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
            const docRef = doc(db, CLOUD_COLLECTION, uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                importData(docSnap.data());
                setSaveStatus('saved');
                setLastSaved(new Date());
                isDirtyRef.current = false;
            }
        } catch (e) {
            console.warn('Cloud load failed:', e);
            setSaveStatus('error');
        }
    };

    // 3. Auth & Cloud Sync Logic
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser && !customDocId) {
                if (isDirtyRef.current) {
                    checkConflict(currentUser.uid);
                } else {
                    await loadResumeFromCloud(currentUser.uid);
                }
            } else if (!currentUser) {
                setCustomDocId(null);
                // Only reset to initial state if we have NO valid local data
                // This prevents wiping data on reload when user is not logged in
                const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (!localData) {
                    setData(INITIAL_RESUME_STATE);
                }
                isDirtyRef.current = false;
                setSaveStatus('saved');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

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

    // 🔒 Real-time Entitlements Sync (FAIL-B Fix)
    useEffect(() => {
        if (!user) {
            setIsPremium(false);
            return;
        }

        // Listen to 'users' collection, strict check for 'resume_premium'
        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const hasPremium = data.entitlements?.includes('resume_premium') || false;
                setIsPremium(hasPremium);
                console.log('entitlements updated:', hasPremium);
            } else {
                setIsPremium(false); // Fail closed
            }
        }, (error) => {
            console.warn("Entitlement sync skipped:", error.code);
            setIsPremium(false);
        });

        return () => unsubscribe();
    }, [user]);

    const resolveConflict = (decision) => {
        // 🛡️ Safety First: Auto-Backup Local State
        const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const backupUrl = URL.createObjectURL(backupBlob);
        const link = document.createElement('a');
        link.href = backupUrl;
        link.download = `backup_local_${backupTimestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (decision === 'keepLocal') {
            setShowConflict(false);
            setCloudDataBuffer(null);
            alert('Kept local data. Don\'t forget to Save to Cloud!');
        } else if (decision === 'loadCloud') {
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

    const dismissConflict = () => {
        setShowConflict(false);
        setCloudDataBuffer(null);
    };

    // Memoize the context value
    const value = useMemo(() => ({
        data,
        setData,
        user,
        saveResume: saveResumeToCloud,
        resetData,
        importData,
        loading,
        saveStatus,
        lastSaved,
        setCustomDocId,
        // New Exports
        isEditMode,
        setIsEditMode,
        lang,
        setLang,
        isPremium,
        setIsPremium
    }), [data, user, saveResumeToCloud, resetData, importData, loading, saveStatus, lastSaved, isEditMode, lang, isPremium]);

    return (
        <ResumeContext.Provider value={value}>
            {children}
            <ConflictModal
                isOpen={showConflict}
                onKeepLocal={() => resolveConflict('keepLocal')}
                onLoadCloud={() => resolveConflict('loadCloud')}
                onClose={dismissConflict}
                cloudDate={cloudDate}
                localDate={Date.now()}
            />
        </ResumeContext.Provider>
    );
};
