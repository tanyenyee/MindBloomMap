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
        width: '600px', // Slightly wider to accommodate more info
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
    contentWrapper: {
        display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start',
        marginTop: '20px', gap: '15px', 
    },
    leftPanel: { 
        flex: '0 0 30%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '10px', marginTop: '20px', 
    },
    rightPanel: { flex: '1', padding: '10px 0 10px 5px' },
    journalHeading: { marginTop: '0px', marginBottom: '15px', fontSize: '1.1rem' },
    flowerImage: { 
        width: '140px', height: 'auto', marginBottom: '15px', objectFit: 'contain',
        filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))',
    },
    journalEntry: { 
        padding: '12px', marginBottom: '12px', borderLeft: '4px solid #8ABAC5', 
        backgroundColor: '#f9f9f9', borderRadius: '8px', position: 'relative'
    },
    noteText: { fontSize: '0.9rem', marginTop: '5px', color: '#555', display: 'block', lineHeight: '1.4' },
    
    // --- NEW STYLES FOR MULTIPLE ENTRIES ---
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
    // Sub-modal styles for viewing all entries of a day
    subBackdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 2000, // Higher than main modal
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
    
    // State to handle the "View All Entries" sub-modal
    const [expandedDay, setExpandedDay] = useState(null); // { dateLabel: "Jan 5", entries: [] }

    const logsArray = useMemo(() => Array.isArray(weeklyLogs) ? weeklyLogs : [], [weeklyLogs]); 
    const { flower, avgScore } = useMemo(() => getWeeklyFlowerData(logsArray), [logsArray]);
    const qualitativeMood = getQualitativeMoodLabel(avgScore); 

    const daysOfWeek = useMemo(() => {
        const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // --- 1. Group logs by date ---
        // logsMap will store an ARRAY of logs for each date
        const logsMap = new Map();
        
        logsArray.forEach(log => {
            if(log.date) {
                if (!logsMap.has(log.date)) {
                    logsMap.set(log.date, []);
                }
                logsMap.get(log.date).push(log);
            }
        });

        const calendarBlock = [];
        const [day, month, year] = weekDetails.startDate.split('/');
        
        // Create Local Date Object
        let currentDay = new Date(`${year}-${month}-${day}`); 
        currentDay.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            // Manual string construction
            const y = currentDay.getFullYear();
            const m = String(currentDay.getMonth() + 1).padStart(2, '0');
            const d = String(currentDay.getDate()).padStart(2, '0');
            const dateKey = `${y}-${m}-${d}`; 

            const dayLogs = logsMap.get(dateKey) || [];
            
            const dayName = fullDayNames[currentDay.getDay()];
            const dateLabel = currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // If we have logs, pick the LAST one (assuming latest) to show on the card
            // But keep the whole array available for the "See More" feature
            if (dayLogs.length > 0) {
                const latestLog = dayLogs[dayLogs.length - 1]; 
                calendarBlock.push({
                    dayName,
                    dateLabel,
                    latestLog: {
                        emotion: latestLog.emotion,
                        note: latestLog.content || latestLog.note,
                    },
                    allLogs: dayLogs, // Pass all logs for this day
                    count: dayLogs.length,
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
    }, [logsArray, weekDetails.startDate]);

    const weekLabel = weekDetails?.weekLabel || 'Weekly Archive'; 
    const fullStartDate = weekDetails?.startDate || 'N/A'; 
    const fullEndDate = weekDetails?.endDate || 'N/A';     

    const condensedDateRange = `${fullStartDate} – ${fullEndDate}`;

    // Helper to clean up "Day DD entry" text if it exists in notes
    const cleanNote = (text) => {
        if (!text) return 'No text content.';
        return text.replace(/^(?:[A-Za-z]{3}\s\d{1,2}\s(?:entry,)?\s*)/, '').trim();
    };

    return (
        <div style={styles.backdrop} onClick={onClose}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeButton}>×</button>
                
                <div style={styles.headerContainer}>
                    <h3 style={styles.weekLabel}>{weekLabel}</h3> 
                    <p style={styles.dateRange}>{condensedDateRange}</p>
                </div>
                
                <div style={styles.contentWrapper}>
                    {/* Left Panel: Flower & Mood */}
                    <div style={styles.leftPanel}>
                        <img src={flower.imagePath} alt={flower.name} style={styles.flowerImage} />
                        <p style={{
                            fontSize: '1.1rem', fontWeight: 'bold', color: qualitativeMood.color, 
                            marginTop: '0', textAlign: 'center'
                        }}>
                            Overall Mood: {qualitativeMood.label}
                        </p>
                    </div>
                    
                    {/* Right Panel: List of Days */}
                    <div style={styles.rightPanel}>
                        <h4 style={styles.journalHeading}>Daily Mood & Journal</h4>
                        
                        {daysOfWeek.map((dayEntry, index) => {
                            if (dayEntry.isLogged) {
                                const { latestLog, count, allLogs } = dayEntry;
                                const noteContent = cleanNote(latestLog.note);
                                const dayTitle = `${dayEntry.dateLabel}, ${dayEntry.dayName} - ${latestLog.emotion}`;
                                const moodColor = MOOD_PALETTE[latestLog.emotion]?.color || '#555';

                                return (
                                    <div key={index} style={{...styles.journalEntry, borderLeftColor: moodColor }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: moodColor }}>
                                            {dayTitle}
                                        </p>
                                        <span style={styles.noteText}>{noteContent}</span>
                                        
                                        {/* --- NEW: Show "View All" button if multiple entries exist --- */}
                                        {count > 1 && (
                                            <button 
                                                style={styles.moreButton}
                                                onClick={() => setExpandedDay({ 
                                                    dateLabel: `${dayEntry.dayName}, ${dayEntry.dateLabel}`, 
                                                    entries: allLogs 
                                                })}
                                            >
                                                View all {count} entries
                                            </button>
                                        )}
                                    </div>
                                );
                            } else {
                                // No Entry Styling
                                const dayTitle = `${dayEntry.dateLabel}, ${dayEntry.dayName} - ?`;
                                return (
                                    <div key={index} style={{...styles.journalEntry, borderLeftColor: '#aaa' }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#777' }}>{dayTitle}</p>
                                        <span style={{ ...styles.noteText, color: '#777', fontStyle: 'italic', marginTop: '0' }}>
                                            No entry
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>

            {/* --- SUB-MODAL: Shows ALL entries for a specific day --- */}
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
                            Entries for {expandedDay.dateLabel}
                        </h3>
                        
                        <div style={{ marginTop: '15px' }}>
                            {expandedDay.entries.map((log, idx) => {
                                const moodColor = MOOD_PALETTE[log.emotion]?.color || '#555';
                                const note = cleanNote(log.content || log.note);
                                
                                return (
                                    <div key={idx} style={{
                                        marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', 
                                        borderRadius: '8px', borderLeft: `4px solid ${moodColor}`
                                    }}>
                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                                            <span style={{fontWeight:'bold', color: moodColor}}>{log.emotion}</span>
                                            <span style={{fontSize:'0.8rem', color:'#999'}}>
                                                {/* If you have timestamps, you could show time here. Otherwise just Entry # */}
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