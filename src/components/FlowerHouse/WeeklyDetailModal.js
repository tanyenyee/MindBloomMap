// src/components/FlowerHouse/WeeklyDetailModal.js

import React, { useMemo, useState } from 'react';
import { getWeeklyFlowerData, MOOD_PALETTE } from './dataProcessor';

// --- STYLING ---
const styles = {
    backdrop: { 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', 
        alignItems: 'center', zIndex: 1000 
    },
    modalCard: { 
        padding: '25px', 
        background: 'white', 
        borderRadius: '25px', 
        maxWidth: '95%',
        width: '500px', // Slightly reduced width for vertical layout look
        maxHeight: '90vh', 
        overflowY: 'auto', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)', 
        position: 'relative', 
        fontFamily: 'Comic Sans MS',
    },
    closeButton: {
        position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer', color: '#A3523B', fontWeight: 'bold',
    },
    headerContainer: {
        textAlign: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px'
    },
    weekLabel: { fontSize: '1.8rem', margin: '0', color: '#4A4A4A' },
    dateRange: { fontSize: '1rem', color: '#777', margin: '5px 0 0 0' },
    
    // --- CHANGED: Layout is now vertical (column) ---
    contentWrapper: {
        display: 'flex', 
        flexDirection: 'column', // Stack items vertically
        alignItems: 'center',    // Center items horizontally
        marginTop: '10px', 
        gap: '20px', 
    },
    
    // --- CHANGED: Left Panel (Flower) takes full width and centers content ---
    leftPanel: { 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '10px', 
        marginTop: '0', 
    },
    
    // --- CHANGED: Right Panel (List) takes full width ---
    rightPanel: { 
        width: '100%', 
        padding: '0 10px' 
    },

    journalHeading: { marginTop: '0px', marginBottom: '15px', fontSize: '1.3rem', textAlign: 'center' },
    
    flowerImage: { 
        width: '160px', // Slightly larger for emphasis
        height: 'auto', 
        marginBottom: '10px', 
        objectFit: 'contain',
        filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))',
    },
    
    journalEntry: { 
        padding: '12px', marginBottom: '12px', borderLeft: '5px solid #ccc', 
        backgroundColor: '#f9f9f9', borderRadius: '8px', position: 'relative',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)' 
    },
    noteText: { fontSize: '0.9rem', marginTop: '5px', color: '#555', display: 'block', lineHeight: '1.4' },
    moreButton: {
        display: 'inline-block',
        marginTop: '8px',
        fontSize: '0.8rem',
        color: 'white',
        backgroundColor: '#8ABAC5',
        padding: '4px 10px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    subBackdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 2000, 
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    subModal: {
        backgroundColor: '#fff', padding: '20px', borderRadius: '15px',
        width: '400px', maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 5px 20px rgba(0,0,0,0.25)', position: 'relative'
    }
};

const getQualitativeMoodLabel = (avgScore) => {
    if (avgScore >= 0.7) return { label: 'Excellent', color: MOOD_PALETTE.Happy.color };
    if (avgScore >= 0.3) return { label: 'Good', color: MOOD_PALETTE.Productive.color };
    if (avgScore >= -0.3) return { label: 'Stable', color: MOOD_PALETTE.Calm.color };
    if (avgScore >= -0.7) return { label: 'Low', color: MOOD_PALETTE.Sad.color };
    return { label: 'Challenging', color: MOOD_PALETTE.Angry.color };
};

const WeeklyDetailModal = ({ weeklyLogs, weekDetails, onClose }) => { 
    const [expandedDay, setExpandedDay] = useState(null); 

    const logsArray = useMemo(() => Array.isArray(weeklyLogs) ? weeklyLogs : [], [weeklyLogs]); 
    const { flower, avgScore } = useMemo(() => getWeeklyFlowerData(logsArray), [logsArray]);
    const qualitativeMood = getQualitativeMoodLabel(avgScore); 

    const cleanNote = (text) => {
        if (!text) return '';
        return text.replace(/^(?:[A-Za-z]{3}\s\d{1,2}\s(?:entry,)?\s*)/, '').trim();
    };

    // Robust Color Lookup
    const getMoodColor = (emotion) => {
        if (!emotion) return '#888'; 
        if (MOOD_PALETTE[emotion]) return MOOD_PALETTE[emotion].color;
        const capitalized = emotion.charAt(0).toUpperCase() + emotion.slice(1);
        if (MOOD_PALETTE[capitalized]) return MOOD_PALETTE[capitalized].color;
        const lower = emotion.toLowerCase();
        if (MOOD_PALETTE[lower]) return MOOD_PALETTE[lower].color;
        return '#888'; 
    };

    const daysOfWeek = useMemo(() => {
        if (!weekDetails || !weekDetails.startDate) return [];

        const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const logsMap = new Map();
        
        logsArray.forEach(log => {
            if(log.date) {
                if (!logsMap.has(log.date)) logsMap.set(log.date, []);
                logsMap.get(log.date).push(log);
            }
        });

        const calendarBlock = [];
        const [day, month, year] = weekDetails.startDate.split('/');
        if (!day || !month || !year) return [];

        let currentDay = new Date(`${year}-${month}-${day}`); 
        currentDay.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const y = currentDay.getFullYear();
            const m = String(currentDay.getMonth() + 1).padStart(2, '0');
            const d = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${y}-${m}-${d}`; 

            const dayLogs = logsMap.get(dateKey) || [];
            
            // 1. Daily Mood (Header) - from Mood Garden
            const moodLog = dayLogs.filter(l => l.moodID).pop();
            
            // 2. Journal Entries (List)
            const journalEntries = dayLogs.filter(l => l.journalID);

            const dayName = fullDayNames[currentDay.getDay()];
            const dateLabel = currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const moodEmotion = moodLog ? moodLog.emotion : null;
            const journalCount = journalEntries.length;

            if (moodEmotion || journalCount > 0) {
                let displayText = '';
                let listEmotion = 'neutral'; 
                
                if (journalCount > 0) {
                    const latestJournal = journalEntries[journalEntries.length - 1];
                    displayText = cleanNote(latestJournal.content);
                    listEmotion = latestJournal.emotionTag || latestJournal.emotion || 'neutral';
                }

                calendarBlock.push({
                    dayName,
                    dateLabel,
                    headerMood: moodEmotion, 
                    listEmotion: listEmotion, 
                    displayText: displayText,
                    allJournals: journalEntries,
                    journalCount: journalCount,
                    isLogged: true
                });
            } else {
                 calendarBlock.push({
                    dayName,
                    dateLabel,
                    isLogged: false
                });
            }
            currentDay.setDate(currentDay.getDate() + 1);
        }
        return calendarBlock;
    }, [logsArray, weekDetails]);

    const weekLabel = weekDetails?.weekLabel || 'Weekly Archive'; 
    const fullStartDate = weekDetails?.startDate || 'N/A'; 
    const fullEndDate = weekDetails?.endDate || 'N/A';     
    const condensedDateRange = `${fullStartDate} – ${fullEndDate}`;

    if (!weekDetails) return null;

    return (
        <div style={styles.backdrop} onClick={onClose}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeButton}>×</button>
                
                <div style={styles.headerContainer}>
                    <h3 style={styles.weekLabel}>{weekLabel}</h3> 
                    <p style={styles.dateRange}>{condensedDateRange}</p>
                </div>
                
                <div style={styles.contentWrapper}>
                    {/* Flower Section on TOP */}
                    <div style={styles.leftPanel}>
                        <img src={flower.imagePath} alt={flower.name} style={styles.flowerImage} />
                        <p style={{
                            fontSize: '1.2rem', fontWeight: 'bold', color: qualitativeMood.color, 
                            marginTop: '0', textAlign: 'center'
                        }}>
                            Overall Mood: {qualitativeMood.label}
                        </p>
                    </div>
                    
                    {/* List Section BELOW */}
                    <div style={styles.rightPanel}>
                        <h4 style={styles.journalHeading}>Daily Mood & Journal</h4>
                        
                        {daysOfWeek.map((dayEntry, index) => {
                            if (dayEntry.isLogged) {
                                const { headerMood, listEmotion, displayText, journalCount, allJournals } = dayEntry;
                                
                                const activeColor = headerMood 
                                    ? getMoodColor(headerMood)
                                    : (journalCount > 0 ? getMoodColor(listEmotion) : '#ccc');

                                const moodSuffix = headerMood ? ` - ${headerMood}` : '';
                                const headerText = `${dayEntry.dateLabel}, ${dayEntry.dayName}${moodSuffix}`;

                                return (
                                    <div key={index} style={{
                                        ...styles.journalEntry, 
                                        borderLeftColor: activeColor,
                                        backgroundColor: '#f9f9f9' 
                                    }}>
                                        <p style={{ 
                                            fontWeight: 'bold', 
                                            margin: '0 0 5px 0', 
                                            color: headerMood ? getMoodColor(headerMood) : '#555'
                                        }}>
                                            {headerText}
                                        </p>
                                        
                                        {journalCount > 0 && (
                                            <>
                                                <span style={styles.noteText}>
                                                    {displayText}
                                                </span>
                                                {journalCount > 1 && (
                                                    <button 
                                                        style={styles.moreButton}
                                                        onClick={() => setExpandedDay({ 
                                                            dateLabel: headerText, 
                                                            entries: allJournals 
                                                        })}
                                                    >
                                                        View all {journalCount} entries
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {journalCount === 0 && (
                                            <span style={{fontSize:'0.85rem', color:'#999', fontStyle:'italic'}}>
                                                (No journal entry)
                                            </span>
                                        )}
                                    </div>
                                );
                            } else {
                                const dayTitle = `${dayEntry.dateLabel}, ${dayEntry.dayName}`;
                                return (
                                    <div key={index} style={{...styles.journalEntry, borderLeftColor: '#aaa' }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#777' }}>{dayTitle}</p>
                                        <span style={{ ...styles.noteText, color: '#999', fontStyle: 'italic', marginTop: '0' }}>
                                            No entry
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            {/* --- SUB-MODAL --- */}
            {expandedDay && (
                <div style={styles.subBackdrop} onClick={() => setExpandedDay(null)}>
                    <div style={styles.subModal} onClick={(e) => e.stopPropagation()}>
                        <button 
                            style={{...styles.closeButton, top: '10px', right: '10px', fontSize: '1.2rem'}} 
                            onClick={() => setExpandedDay(null)}
                        >
                            Close
                        </button>
                        <h3 style={{marginTop: 0, color: '#4A4A4A', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                            {expandedDay.dateLabel}
                        </h3>
                        
                        <div style={{ marginTop: '15px' }}>
                            {expandedDay.entries.map((log, idx) => {
                                const entryEmotion = log.emotionTag || log.emotion || 'neutral';
                                const moodColor = getMoodColor(entryEmotion);
                                const note = cleanNote(log.content || log.note);
                                
                                return (
                                    <div key={idx} style={{
                                        marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', 
                                        borderRadius: '8px', borderLeft: `4px solid ${moodColor}`
                                    }}>
                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                                            <span style={{fontWeight:'bold', color: moodColor}}>{entryEmotion}</span>
                                            <span style={{fontSize:'0.8rem', color:'#999'}}>
                                                Entry #{idx + 1}
                                            </span>
                                        </div>
                                        <p style={{margin:0, fontSize:'0.9rem', color:'#555'}}>{note}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyDetailModal;