import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { getMoodLogsByUser, getJournalsByUser } from '../../firebases/firebaseService'; 
import { processLogData } from './dataProcessor';

import SummaryChartModal from './SummaryChartModal';
import WeeklyDetailModal from './WeeklyDetailModal'; 
import WeeklyFlowerCard from './WeeklyFlowerCard'; 
import NavigationButtons from '../NavigationButtons'; 

import '../../pages/MainPage.css';
import './FlowerHouse.css'; 
import FlowerHouseBG from '../../assets/images/flowerHouse_bg.png'; 

const MONTH_NAMES = [ 
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' 
];

/* --- HELPER: Handle Multiple Logs & Fix Timezone Bugs --- */
const groupLogsByMonthBlock = (logs, viewYear, viewMonthIndex) => {
    const weeksMap = new Map();
    const safeLogs = Array.isArray(logs) ? logs : [];

    // --- CRITICAL FIX IS HERE ---
    // We check if it is a string first. If yes, return it immediately.
    // We DO NOT let new Date() touch it.
    const getLocalDateKey = (dateInput) => {
        if (!dateInput) return "";
        
        // 1. If it's already a simple string "YYYY-MM-DD", use it directly!
        if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateInput;
        }

        // 2. If it is a Date Object (from the loop logic), extract Local YYYY-MM-DD
        if (dateInput instanceof Date) {
             const year = dateInput.getFullYear();
             const month = String(dateInput.getMonth() + 1).padStart(2, '0');
             const day = String(dateInput.getDate()).padStart(2, '0');
             return `${year}-${month}-${day}`;
        }

        // 3. Fallback for timestamps (rarely used now but safe to keep)
        const d = new Date(dateInput);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Start exactly at the beginning of the month (Local Time)
    let currentBlockStart = new Date(viewYear, viewMonthIndex, 1);
    currentBlockStart.setHours(0, 0, 0, 0);

    let weekCounter = 1;
    // Go until the end of the month
    const endOfMonth = new Date(viewYear, viewMonthIndex + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Loop through 6 potential weeks
    while (currentBlockStart <= endOfMonth && weekCounter <= 6) {
        const blockEnd = new Date(currentBlockStart);
        blockEnd.setDate(currentBlockStart.getDate() + 6); 

        // Cap the week end if it goes into the next month
        const effectiveBlockEnd = blockEnd > endOfMonth ? endOfMonth : blockEnd;
        
        // Key for map (YYYY-MM-DD)
        const weekKey = getLocalDateKey(currentBlockStart);

        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedStartDate = currentBlockStart.toLocaleDateString('en-GB', options);
        const formattedEndDate = effectiveBlockEnd.toLocaleDateString('en-GB', options);

        const blockData = {
            startDate: formattedStartDate, 
            endDate: formattedEndDate,   
            logs: [], 
            weekLabel: `Week ${weekCounter}`,
        };

        // Iterate through every day in this week block
        // We use a new Date object (d) so we don't mess up currentBlockStart
        for (let d = new Date(currentBlockStart); d <= effectiveBlockEnd; d.setDate(d.getDate() + 1)) {
            const dateKey = getLocalDateKey(d);
            
            // COMPARE: We filter safeLogs looking for a strict string match
            const daysLogs = safeLogs.filter(log => getLocalDateKey(log.date) === dateKey);
            
            if (daysLogs.length > 0) {
                blockData.logs.push(...daysLogs);
            }
        }

        weeksMap.set(weekKey, blockData);
        
        // Move to next week
        currentBlockStart.setDate(currentBlockStart.getDate() + 7);
        weekCounter++;
    }
    return Array.from(weeksMap.values());
};

const FlowerHouse = () => {
    const { currentUser, loading } = useAuth();
    
    const [combinedLogs, setCombinedLogs] = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(true); 
    const [activeSummary, setActiveSummary] = useState(null); 
    const [selectedWeekLogs, setSelectedWeekLogs] = useState(null); 
    
    const [viewMonthIndex, setViewMonthIndex] = useState(new Date().getMonth()); 
    const [viewYear, setViewYear] = useState(new Date().getFullYear()); 
    const [isPickerOpen, setIsPickerOpen] = useState(false); 

    const currentMonthLabel = MONTH_NAMES[viewMonthIndex]; 

    // --- FETCH BOTH JOURNALS AND MOOD LOGS ---
    useEffect(() => {
        const fetchAllData = async () => {
            if (loading) return;
            if (!currentUser) {
                setIsFetchingData(false);
                return;
            }
            try {
                const [moods, journals] = await Promise.all([
                    getMoodLogsByUser(currentUser.uid),
                    getJournalsByUser(currentUser.uid)
                ]);

                // Normalize Mood Logs
                const normalizedMoods = (Array.isArray(moods) ? moods : []).map(log => ({
                    ...log,
                    type: 'Mood',
                    emotion: log.emotion || "Neutral",
                    content: log.note || "No note added."
                }));

                // Normalize Journals
                const normalizedJournals = (Array.isArray(journals) ? journals : []).map(log => ({
                    ...log,
                    type: 'Journal',
                    emotion: log.emotionTag || "Neutral", 
                    content: log.content || ""
                }));

                setCombinedLogs([...normalizedMoods, ...normalizedJournals]);

            } catch (error) {
                console.error("Error fetching data:", error);
                setCombinedLogs([]); 
            } finally {
                setIsFetchingData(false); 
            }
        };
        fetchAllData();
    }, [currentUser, loading]);

    // Data Filtering
    const currentMonthLogs = useMemo(() => 
        combinedLogs.filter(log => {
            if (!log.date) return false;
            // Parse date strictly for filtering
            const y = parseInt(log.date.substring(0,4));
            const m = parseInt(log.date.substring(5,7)) - 1; // Month is 0-indexed in JS
            return y === viewYear && m === viewMonthIndex;
        }), [combinedLogs, viewYear, viewMonthIndex]
    );
    
    const allYearLogs = useMemo(() => 
        combinedLogs.filter(log => {
            if (!log.date) return false;
            const y = parseInt(log.date.substring(0,4));
            return y === viewYear;
        }), [combinedLogs, viewYear]
    );

    const weeklyFlowers = useMemo(() => 
        groupLogsByMonthBlock(currentMonthLogs, viewYear, viewMonthIndex), 
        [currentMonthLogs, viewYear, viewMonthIndex]
    );
    
    // Process Data for Charts
    const yearlyAnalysis = useMemo(() => processLogData(allYearLogs || [], 52), [allYearLogs]); 
    const monthlyAnalysis = useMemo(() => processLogData(currentMonthLogs || [], weeklyFlowers.length), [currentMonthLogs, weeklyFlowers]);
    
    // Handlers
    const toggleMonthPicker = () => setIsPickerOpen(prev => !prev);
    const handleMonthSelect = (index) => { 
        setViewMonthIndex(index); 
        setIsPickerOpen(false); 
    };
    
    const handleMonthChange = (direction) => {
        let newMonth = viewMonthIndex + direction;
        let newYear = viewYear;
        if (newMonth > 11) { newMonth = 0; newYear += 1; } 
        else if (newMonth < 0) { newMonth = 11; newYear -= 1; }
        setViewMonthIndex(newMonth);
        setViewYear(newYear);
        setIsPickerOpen(false); 
    };
    
    const handleYearChange = (direction) => setViewYear(prev => prev + direction);
    const viewMonthlySummary = () => setActiveSummary('monthly');
    const handleFlowerClick = (weekObject) => setSelectedWeekLogs(weekObject);

    if (loading || isFetchingData) return <div className="flowerhouse-container">Loading your Garden...</div>;

    return (
        <div className="flowerhouse-container" style={{ backgroundImage: `url(${FlowerHouseBG})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
            <NavigationButtons /> 
            
            <div className="app-viewport-center">
                <div className="yearly-nav-wrapper"> 
                    <div className="year-pill-nav">
                        <button onClick={() => handleYearChange(-1)}>{'<'}</button>
                        <span>{viewYear}</span>
                        <button onClick={() => handleYearChange(1)}>{'>'}</button>
                    </div>
                </div>

                <div className="archive-container">
                    <div className="month-header">
                        <button className="nav-arrow" onClick={() => handleMonthChange(-1)}>{'<'}</button>
                        <h2 onClick={toggleMonthPicker}>{currentMonthLabel}</h2>
                        <button className="nav-arrow" onClick={() => handleMonthChange(1)}>{'>'}</button>
                        
                        {isPickerOpen && (
                            <div className="month-picker-overlay">
                                <div className="month-picker-list-container">
                                    {MONTH_NAMES.map((m, i) => (
                                        <button 
                                            key={m} 
                                            onClick={() => handleMonthSelect(i)}
                                            className={viewMonthIndex === i ? 'active' : ''}
                                        >
                                            {m.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flower-grid">
                        {weeklyFlowers.length > 0 ? (
                            weeklyFlowers.map((week) => (
                                <WeeklyFlowerCard
                                    key={week.startDate} 
                                    weekLogs={week.logs} 
                                    weekLabel={week.weekLabel} 
                                    onClick={() => handleFlowerClick(week)} 
                                />
                            ))
                        ) : (
                            <p className="no-logs">No entries found for {currentMonthLabel}.</p>
                        )}
                    </div>

                    <button className="summary-link" onClick={viewMonthlySummary}>Summary</button>
                </div>
            </div>

            {activeSummary && ( 
                <SummaryChartModal
                    currentMonthLabel={currentMonthLabel}
                    viewYear={viewYear}
                    monthlyData={monthlyAnalysis}
                    yearlyData={yearlyAnalysis}
                    defaultTab={activeSummary}
                    onClose={() => setActiveSummary(null)}
                />
            )}
            
            {selectedWeekLogs && (
                <WeeklyDetailModal
                    weekDetails={selectedWeekLogs} 
                    weeklyLogs={selectedWeekLogs?.logs || []} 
                    onClose={() => setSelectedWeekLogs(null)}
                />
            )}
        </div>
    );
};

export default FlowerHouse;