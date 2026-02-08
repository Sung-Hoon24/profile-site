import React, { createContext, useState, useEffect, useContext, useRef, useMemo, useCallback } from 'react';
import { db, doc, getDoc, setDoc, auth, onAuthStateChanged } from '../../firebase.js';
import { INITIAL_RESUME_STATE } from '../constants/resumeConstants';
import ConflictModal from '../components/ConflictModal';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

const LOCAL_STORAGE_KEY = 'resumeData_v1';

// Helper: Sanitize and Migrate Data
const sanitizeData = (parsed) => {
    if (!parsed) return INITIAL_RESUME_STATE;
    return {
        ...INITIAL_RESUME_STATE,
        ...parsed,
        templateId: parsed.templateId || INITIAL_RESUME_STATE.templateId,
        theme: parsed.theme || INITIAL_RESUME_STATE.theme,
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
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            return saved ? sanitizeData(JSON.parse(saved)) : INITIAL_RESUME_STATE;
        } catch (e) {
            console.warn('LocalStorage parse error:', e);
            return INITIAL_RESUME_STATE;
        }
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customDocId, setCustomDocId] = useState(null);

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
        if (data === INITIAL_RESUME_STATE) return;

        isDirtyRef.current = true;
        setSaveStatus('unsaved');
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
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
            const docRef = doc(db, 'resumes', targetUid);
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
                setData(INITIAL_RESUME_STATE);
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

    const resolveConflict = (decision) => {
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
        setCustomDocId
    }), [data, user, saveResumeToCloud, resetData, importData, loading, saveStatus, lastSaved]);

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
