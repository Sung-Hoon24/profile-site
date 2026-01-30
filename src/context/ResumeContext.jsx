import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, doc, getDoc, setDoc, auth, onAuthStateChanged } from '../../firebase.js';

const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

const LOCAL_STORAGE_KEY = 'resumeData_v1';

const DEFAULT_SCHEMA = {
    basicInfo: {
        fullName: '',
        role: '',
        email: '',
        phone: '',
        summary: ''
    },
    experience: [],
    education: [],
    skills: '' // string (comma separated)
};

export const ResumeProvider = ({ children }) => {
    // 1. Initial State: Try LocalStorage First + Schema Migration
    const [data, setData] = useState(() => {
        let parsed = null;
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) parsed = JSON.parse(saved);
        } catch (e) {
            console.warn('LocalStorage parse error:', e);
        }

        if (!parsed) return DEFAULT_SCHEMA;

        // MIGRATION CHECK: If old flat structure (has 'name' at root), migrate to basicInfo
        if (parsed.name !== undefined || parsed.position !== undefined) {
            console.log('[ResumeContext] Migrating old flat data to new schema...');
            return {
                ...DEFAULT_SCHEMA,
                basicInfo: {
                    fullName: parsed.name || '',
                    role: parsed.position || '',
                    email: parsed.email || '',
                    phone: parsed.phone || '',
                    summary: parsed.summary || ''
                },
                experience: parsed.experience || [],
                education: parsed.education || [],
                skills: parsed.skills || ''
            };
        }

        // Just Merge to ensure Missing fields are filled
        return {
            ...DEFAULT_SCHEMA,
            ...parsed,
            basicInfo: { ...DEFAULT_SCHEMA.basicInfo, ...(parsed.basicInfo || {}) }
        };
    });

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 2. Sync: Save to LocalStorage on every change
    useEffect(() => {
        console.log('[EDITOR STATE]', data); // Workflow Step 1-A
        console.log('[ResumeContext] Data Changed:', data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    // 3. Auth & Cloud Sync
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // If user logs in, we might want to fetch cloud data.
                await loadResumeFromCloud();
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loadResumeFromCloud = async () => {
        try {
            const docRef = doc(db, 'resumes', 'main');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const cloudData = docSnap.data();
                // Merge cloud data into state (prioritizing cloud structure)
                setData(prev => ({
                    ...prev,
                    ...cloudData,
                    // Ensure arrays are arrays
                    experience: cloudData.experience || [],
                    education: cloudData.education || []
                }));
            }
        } catch (e) {
            console.warn('Cloud load failed:', e);
        }
    };

    const saveResumeToCloud = async () => {
        if (!user) return alert('Please login to save to cloud.');
        try {
            const docRef = doc(db, 'resumes', 'main');
            await setDoc(docRef, data);
            alert('Saved to cloud successfully!');
        } catch (e) {
            console.error('Save failed:', e);
            alert('Cloud save failed: ' + e.message);
        }
    };

    return (
        <ResumeContext.Provider value={{ data, setData, user, saveResume: saveResumeToCloud, loading }}>
            {children}
        </ResumeContext.Provider>
    );
};
