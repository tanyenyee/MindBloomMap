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

    const getLocalDateKey = (dateInput) => {
        if (!dateInput) return "";
        if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateInput;
        }
        if (dateInput instanceof Date) {
             const year = dateInput.getFullYear();
             const month = String(dateInput.getMonth() + 1).padStart(2, '0');
             const day = String(dateInput.getDate()).padStart(2, '0');
             return `${year}-${month}-${day}`;
        }
        const d = new Date(dateInput);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 1. Get the 1st day of the selected month
    const firstOfMonth = new Date(viewYear, viewMonthIndex, 1);
    
    // 2. Find the Monday of that week
    const dayOfWeek = firstOfMonth.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
    
    let currentBlockStart = new Date(firstOfMonth);
    currentBlockStart.setDate(firstOfMonth.getDate() + diffToMonday);
    currentBlockStart.setHours(0, 0, 0, 0);

    // 3. Determine end of month
    const endOfMonth = new Date(viewYear, viewMonthIndex + 1, 0);
    
    // Loop for 6 weeks
    for (let i = 0; i < 6; i++) {
        if (currentBlockStart > endOfMonth) break;

        const blockEnd = new Date(currentBlockStart);
        blockEnd.setDate(currentBlockStart.getDate() + 6); 
        blockEnd.setHours(23, 59, 59, 999);

        const weekKey = getLocalDateKey(currentBlockStart);

        // --- FIXED FORMATTING HERE ---
        // Option 1: Full Date (DD/MM/YYYY) - Needed for Logic
        const fullOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const fullStartDate = currentBlockStart.toLocaleDateString('en-GB', fullOptions); // "05/01/2026"
        const fullEndDate = blockEnd.toLocaleDateString('en-GB', fullOptions);     // "11/01/2026"

        // Option 2: Short Date (DD/MM) - Needed for Display Label
        const shortOptions = { month: 'numeric', day: 'numeric' };
        const shortStartDate = currentBlockStart.toLocaleDateString('en-GB', shortOptions); // "05/01"
        const shortEndDate = blockEnd.toLocaleDateString('en-GB', shortOptions);     // "11/01"

        const blockData = {
            startDate: fullStartDate, // Pass WITH YEAR so the Modal can calculate dates
            endDate: fullEndDate,   
            logs: [], 
            weekLabel: `${shortStartDate} - ${shortEndDate}`, // Keep label SHORT and pretty
        };

        for (let d = new Date(currentBlockStart); d <= blockEnd; d.setDate(d.getDate() + 1)) {
            const dateKey = getLocalDateKey(d);
            const daysLogs = safeLogs.filter(log => getLocalDateKey(log.date) === dateKey);
            if (daysLogs.length > 0) {
                blockData.logs.push(...daysLogs);
            }
        }

        weeksMap.set(weekKey, blockData);
        currentBlockStart.setDate(currentBlockStart.getDate() + 7);
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