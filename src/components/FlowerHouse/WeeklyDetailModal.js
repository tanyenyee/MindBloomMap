// src/components/FlowerHouse/WeeklyDetailModal.js

import React, { useMemo } from 'react';
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
        width: '550px', // Slightly wider for better side-by-side layout
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
    // --- NEW: CENTERED HEADER SECTION ---
    headerContainer: {
        textAlign: 'center',
        marginBottom: '10px',
        borderBottom: '1px solid #eee',
        paddingBottom: '10px'
    },
    weekLabel: {
        fontSize: '1.8rem',
        margin: '0',
        color: '#4A4A4A'
    },
    dateRange: {
        fontSize: '1rem',
        color: '#777',
        margin: '5px 0 0 0'
    },
    contentWrapper: {
        display: 'flex',
        justifyContent: 'flex-start', // Shifted items to start
        alignItems: 'flex-start',
        marginTop: '20px',
        gap: '10px', // Reduced gap to pull journal to the left
    },
    leftPanel: { 
        flex: '0 0 35%', // Reduced width from 45% to 35% to shrink flower area
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        marginTop: '20px', // Lowered flower as requested
    },
    rightPanel: { 
        flex: '1', // Take up remaining space
        padding: '10px 0 10px 5px', 
    },
    journalHeading: {
        marginTop: '0px', 
        marginBottom: '15px', 
        fontSize: '1.1rem',
    },
    flowerImage: { 
        width: '160px', // Reduced size from 250px
        height: 'auto', 
        marginBottom: '15px',
        objectFit: 'contain',
        filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))',
    },
    journalEntry: { 
        padding: '10px', 
        marginBottom: '10px', 
        borderLeft: '4px solid #8ABAC5', 
        backgroundColor: '#f9f9f9', 
        borderRadius: '5px' 
    },
    noteText: { 
        fontSize: '0.9rem', 
        marginTop: '5px', 
        color: '#555',
        display: 'block', 
        lineHeight: '1.4',
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
    
    const logsArray = useMemo(() => Array.isArray(weeklyLogs) ? weeklyLogs : [], [weeklyLogs]); 

    const { flower, avgScore } = useMemo(() => getWeeklyFlowerData(logsArray), [logsArray]);
    
    const qualitativeMood = getQualitativeMoodLabel(avgScore); 

    const daysOfWeek = useMemo(() => {
        const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const logsMap = new Map(logsArray.map(log => [new Date(log.date).toISOString().split('T')[0], log]));
        const calendarBlock = [];
        
        const [day, month, year] = weekDetails.startDate.split('/');
        let currentDay = new Date(`${year}-${month}-${day}`); 
        currentDay.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const dateKey = currentDay.toISOString().split('T')[0];
            const log = logsMap.get(dateKey);
            
            const dayName = fullDayNames[currentDay.getDay()];
            const dateLabel = currentDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (log) {
                calendarBlock.push({
                    dayName: dayName,
                    date: dateLabel,
                    emotion: log.emotion,
                    note: log.note,
                    isLogged: true
                });
            } else {
                 calendarBlock.push({
                    dayName: dayName,
                    date: dateLabel,
                    emotion: 'N/A',
                    note: null,
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

    const startParts = fullStartDate.split('/');
    const endParts = fullEndDate.split('/');
    
    const condensedDateRange = (startParts.length >= 2 && endParts.length >= 2) 
        ? `${startParts[0]}/${startParts[1]} – ${endParts[0]}/${endParts[1]}`
        : fullStartDate + ' - ' + fullEndDate; 

    return (
        <div style={styles.backdrop} onClick={onClose}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} style={styles.closeButton}>×</button>
                
                {/* --- CENTERED TOP HEADER --- */}
                <div style={styles.headerContainer}>
                    <h3 style={styles.weekLabel}>{weekLabel}</h3> 
                    <p style={styles.dateRange}>{condensedDateRange}</p>
                </div>
                
                <div style={styles.contentWrapper}>
                    {/* --- LEFT PANEL: SMALLER & LOWERED FLOWER --- */}
                    <div style={styles.leftPanel}>
                        <img 
                            src={flower.imagePath} 
                            alt={flower.name} 
                            style={styles.flowerImage} 
                        />
                        <p style={{
                            fontSize: '1.1rem', 
                            fontWeight: 'bold', 
                            color: qualitativeMood.color, 
                            marginTop: '0',
                            textAlign: 'center'
                        }}>
                            Overall Mood: {qualitativeMood.label}
                        </p>
                    </div>
                    
                    {/* --- RIGHT PANEL: JOURNAL ENTRIES (Shifted Left) --- */}
                    <div style={styles.rightPanel}>
                        <h4 style={styles.journalHeading}>Daily Mood & Journal</h4>
                        
                        {daysOfWeek.map((dayEntry, index) => {
                            if (dayEntry.isLogged) {
                                let noteContent = dayEntry.note || 'No journal entry.';
                                if (dayEntry.note) {
                                    noteContent = noteContent.replace(/^(?:[A-Za-z]{3}\s\d{1,2}\s(?:entry,)?\s*)/, '').trim();
                                }
                                
                                const dayTitle = `${dayEntry.date}, ${dayEntry.dayName} - ${dayEntry.emotion}`;
                                const moodColor = MOOD_PALETTE[dayEntry.emotion]?.color || '#555';

                                return (
                                    <div key={index} style={{...styles.journalEntry, borderLeftColor: moodColor }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: moodColor }}>
                                            {dayTitle}
                                        </p>
                                        <span style={styles.noteText}>
                                            {noteContent}
                                        </span>
                                    </div>
                                );
                            } else {
                                const neutralColor = '#aaa'; 
                                const titleColor = '#777';   
                                const dayTitle = `${dayEntry.date}, ${dayEntry.dayName} - ?`;
                                
                                return (
                                    <div key={index} style={{...styles.journalEntry, borderLeftColor: neutralColor }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: titleColor }}>
                                            {dayTitle}
                                        </p>
                                        <span style={{ 
                                            ...styles.noteText, 
                                            color: titleColor, 
                                            fontStyle: 'italic', 
                                            marginTop: '0' 
                                        }}>
                                            No entry
                                        </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyDetailModal;