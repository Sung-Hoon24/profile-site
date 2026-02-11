import React, { useState, useRef, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateSelector from './editor/TemplateSelector';
import ThemeForm from './editor/ThemeForm';
import BasicInfoForm from './editor/BasicInfoForm';
import ExperienceForm from './editor/ExperienceForm';
import EducationForm from './editor/EducationForm';
import SkillsForm from './editor/SkillsForm';
import SyncStatus from './SyncStatus';
import PremiumModal from './PremiumModal';
import { exportToJson, validateAndParseJson } from '../utils/fileHelpers';
import { TEMPLATES } from '../constants/templates';

// Simple Accordion Component
const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="accordion-item">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    ▼
                </motion.span>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="accordion-content"
                        style={{ overflow: 'hidden' }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EditorPanel = () => {
    const context = useResume();

    // Safety check for context
    if (!context) {
        return <div style={{ color: 'white', padding: 20 }}>Error: ResumeContext not found.</div>;
    }

    const {
        data, setData, saveResume, user, resetData, importData,
        saveStatus, lastSaved,
        isPremium, setIsPremium // New Phase 3 props
    } = context;

    console.log('[EditorPanel] isPremium:', isPremium);

    const fileInputRef = useRef(null);

    // Safety check for data
    if (!data) {
        return <div style={{ color: 'white', padding: 20 }}>Loading Data...</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Check if field belongs to basicInfo
        if (['fullName', 'role', 'email', 'phone', 'summary'].includes(name)) {
            setData(prev => ({
                ...prev,
                basicInfo: {
                    ...prev.basicInfo,
                    [name]: value
                }
            }));
        } else {
            setData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleListChange = (e, index, section) => {
        const { name, value } = e.target;
        setData(prev => {
            const list = [...(prev[section] || [])];
            list[index] = { ...list[index], [name]: value };
            return { ...prev, [section]: list };
        });
    };

    const addItem = (section) => {
        const newItem = section === 'experience'
            ? { id: Date.now(), company: '', role: '', period: '', desc: '' } // Uses 'role' & 'id'
            : { id: Date.now(), school: '', major: '', year: '' };

        setData(prev => ({
            ...prev,
            [section]: [...(prev[section] || []), newItem]
        }));
    };

    const removeItem = (index, section) => {
        setData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleExport = () => {
        exportToJson(data, `resume_backup_${data.basicInfo?.fullName || 'draft'}.json`);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const parsedData = await validateAndParseJson(file);
            if (window.confirm('This will overwrite your current data. Continue?')) {
                importData(parsedData);
                alert('Resume loaded successfully! ✅');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            e.target.value = ''; // Reset input
        }
    };

    // Template Handler (Premium Feature)
    const [showPricing, setShowPricing] = useState(false); // Modal State

    const handleLoadTemplate = () => {
        if (!isPremium) {
            // Open Premium Modal instead of Alert
            setShowPricing(true);
        } else {
            loadTemplateAction();
        }
    };

    // Auto-load template logic could be added here if needed,
    // but simplified to just unlock UI. Context update handles state.

    // Watch for premium upgrade
    useEffect(() => {
        if (isPremium && showPricing) {
            setShowPricing(false);
            // Optional: Auto-load default template or show success toast
        }
    }, [isPremium]);

    const loadTemplateAction = () => {
        if (window.confirm("Load 'Developer' Example Template? Current data will be replaced.")) {
            if (TEMPLATES.developer) {
                importData(TEMPLATES.developer);
            }
        }
    };

    // 🛠️ DEV MODE CHECK (Only show when ?dev=true is in URL)
    const searchParams = new URLSearchParams(window.location.search);
    const isDevMode = searchParams.get('dev') === 'true';

    return (
        <div className="editor-panel">
            <div className="editor-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <h2>Editor {isDevMode && <span style={{ color: '#ff4081', fontSize: '0.8rem' }}>(DEV)</span>}</h2>
                    <SyncStatus status={saveStatus} lastSaved={lastSaved} onManualSave={saveResume} />
                </div>

                {/* File Input for Import (Hidden) */}
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleFileChange}
                />

                <div className="editor-actions" style={{ gap: '8px', flexWrap: 'wrap' }}>
                    {isPremium ? (
                        <>
                            <button
                                onClick={() => {
                                    if (window.confirm("Load Developer Template?")) importData(TEMPLATES.developer);
                                }}
                                className="save-btn-secondary"
                                style={{ border: '1px solid #ffd700', color: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' }}
                            >
                                Load Dev
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Load Designer Template?")) importData(TEMPLATES.designer);
                                }}
                                className="save-btn-secondary"
                                style={{ border: '1px solid #e040fb', color: '#e040fb', background: 'rgba(224, 64, 251, 0.1)' }}
                            >
                                Load Designer
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Load Future Template?")) importData(TEMPLATES.future);
                                }}
                                className="save-btn-secondary"
                                style={{ border: '1px solid #00e5ff', color: '#00e5ff', background: 'rgba(0, 229, 255, 0.1)' }}
                            >
                                Load Future
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Load Executive Template?")) importData(TEMPLATES.executive);
                                }}
                                className="save-btn-secondary"
                                style={{ border: '1px solid #c5a059', color: '#c5a059', background: 'rgba(197, 160, 89, 0.1)' }}
                            >
                                Load Executive
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Load Startup Template?")) importData(TEMPLATES.startup);
                                }}
                                className="save-btn-secondary"
                                style={{ border: '1px solid #ff3b30', color: '#ff3b30', background: 'rgba(255, 59, 48, 0.1)' }}
                            >
                                Load Startup
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLoadTemplate}
                            className="save-btn-secondary"
                            style={{
                                border: '1px solid #aaa',
                                color: '#aaa',
                                background: 'transparent'
                            }}
                        >
                            🔒 Premium Templates
                        </button>
                    )}
                    <button onClick={handleExport} className="save-btn-secondary" title="Download backup">
                        💾 Backup
                    </button>
                    <button onClick={handleImportClick} className="save-btn-secondary" title="Restore from backup">
                        📂 Restore
                    </button>
                    <button onClick={resetData} className="save-btn-danger" title="Clear all data">
                        🗑️ Reset
                    </button>
                    <button onClick={saveResume} className="save-btn-primary">
                        {user ? '☁️ Save (Manual)' : '☁️ Save (Login Req)'}
                    </button>
                </div>
            </div>

            <div className="editor-scroll-area">
                <Accordion title="0. Select Template" defaultOpen={true}>
                    <TemplateSelector
                        data={data}
                        setData={setData}
                        isPremium={isPremium}
                        onOpenPricing={() => setShowPricing(true)}
                    />
                </Accordion>

                <Accordion title="✨ Template & Style" defaultOpen={true}>
                    <ThemeForm data={data} setData={setData} />
                </Accordion>

                <Accordion title="1. Basic Info" defaultOpen={true}>
                    <BasicInfoForm data={data} handleChange={handleChange} setData={setData} />
                </Accordion>

                <Accordion title="2. Experience">
                    <ExperienceForm
                        data={data}
                        handleListChange={handleListChange}
                        addItem={addItem}
                        removeItem={removeItem}
                    />
                </Accordion>

                <Accordion title="3. Education">
                    <EducationForm
                        data={data}
                        handleListChange={handleListChange}
                        addItem={addItem}
                        removeItem={removeItem}
                    />
                </Accordion>

                <Accordion title="4. Skills">
                    <SkillsForm data={data} handleChange={handleChange} />
                </Accordion>
            </div>

            {/* Premium Pricing Modal */}
            <PremiumModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
            />
        </div>
    );
};

export default EditorPanel;
