import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import { getMoodLogsByUser } from '../../firebases/firebaseService'; 
import { processLogData } from './dataProcessor';

// Import all child components
import SummaryChartModal from './SummaryChartModal';
import WeeklyDetailModal from './WeeklyDetailModal'; 
import WeeklyFlowerCard from './WeeklyFlowerCard'; 
import NavigationButtons from '../NavigationButtons'; 

// Import CSS
import '../../pages/MainPage.css';
import './FlowerHouse.css'; 

// Import the correct background image 
import FlowerHouseBG from '../../assets/images/flowerHouse_bg.png'; 

// --- STATIC DATA AND HELPERS ---
const MONTH_NAMES = [ 
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December' 
];

// MOCK DATA (Maintained as requested)
const mockLogs = [
    { moodID: 'o1', emotion: 'Calm', date: '2025-10-27', note: 'Oct 27 entry, slow start to the week.', moodScore: 0.5 },
    { moodID: 'o2', emotion: 'Sad', date: '2025-10-30', note: 'Oct 30 entry, feeling tired.', moodScore: -0.5 },
    { moodID: 'o3', emotion: 'Happy', date: '2025-11-02', note: 'Nov 2 entry, fun day out.', moodScore: 1.0 },
    { moodID: 'n1', emotion: 'Productive', date: '2025-11-03', note: 'Nov 3 entry, focused work session.', moodScore: 0.7 },
    { moodID: 'n2', emotion: 'Anxious', date: '2025-11-05', note: 'Nov 5 entry, meeting stress.', moodScore: -0.8 },
    { moodID: 'n3', emotion: 'Happy', date: '2025-11-07', note: 'Nov 7 entry, relaxed Friday.', moodScore: 1.0 },
    { moodID: 'n4', emotion: 'Calm', date: '2025-11-10', note: 'Nov 10 entry, peaceful morning.', moodScore: 0.5 },
    { moodID: 'n5', emotion: 'Angry', date: '2025-11-14', note: 'Nov 14 entry, traffic was terrible.', moodScore: -1.0 },
    { moodID: 'n6', emotion: 'Productive', date: '2025-11-16', note: 'Nov 16 entry, got a lot done.', moodScore: 0.7 },
    { moodID: 'n7', emotion: 'Happy', date: '2025-11-17', note: 'Nov 17 entry, exciting news.', moodScore: 1.0 },
    { moodID: 'n8', emotion: 'Sad', date: '2025-11-20', note: 'Nov 20 entry, missing home.', moodScore: -0.5 },
    { moodID: 'n9', emotion: 'Calm', date: '2025-11-23', note: 'Nov 23 entry, slow cook dinner.', moodScore: 0.5 },
    { moodID: 'n10', emotion: 'Anxious', date: '2025-11-24', note: 'Nov 24 entry, exam pressure.', moodScore: -0.8 },
    { moodID: 'n11', emotion: 'Productive', date: '2025-11-26', note: 'Nov 26 entry, solid study day.', moodScore: 0.7 },
    { moodID: 'd1', emotion: 'Happy', date: '2025-12-01', note: 'Dec 1 entry, feeling great today!', moodScore: 1.0 },
    { moodID: 'd2', emotion: 'Productive', date: '2025-12-02', note: 'Dec 2 entry, long hours but successful.', moodScore: 0.7 },
    { moodID: 'd3', emotion: 'Calm', date: '2025-12-03', note: 'Dec 3 entry, a peaceful afternoon break.', moodScore: 0.5 }, 
    { moodID: 'd4', emotion: 'Anxious', date: '2025-12-04', note: 'Dec 4 entry, worried about project deadlines.', moodScore: -0.8 },
    { moodID: 'd5', emotion: 'Sad', date: '2025-12-05', note: 'Dec 5 entry, rainy day blues.', moodScore: -0.5 },
    { moodID: 'd6', emotion: 'Happy', date: '2025-12-06', note: 'Dec 6 entry, celebrated a small win!', moodScore: 1.0 }, 
    { moodID: 'd7', emotion: 'Happy', date: '2025-12-07', note: 'Dec 7 entry, restful weekend.', moodScore: 1.0 },
    { moodID: 'd8', emotion: 'Angry', date: '2025-12-08', note: 'Dec 8 entry, frustrating bug in code.', moodScore: -1.0 },
    { moodID: 'd9', emotion: 'Productive', date: '2025-12-09', note: 'Dec 9 entry, finished the report ahead of schedule.', moodScore: 0.8 },
    { moodID: 'd10', emotion: 'Calm', date: '2025-12-10', note: 'Dec 10 entry, meditation helped today.', moodScore: 0.5 },
    { moodID: 'j1', emotion: 'Angry', date: '2026-01-05', note: 'Jan 5 entry, frustrating bug in code.', moodScore: -1.0 },
    { moodID: 'j2', emotion: 'Calm', date: '2026-01-08', note: 'Jan 8 entry, calm day.', moodScore: 0.5 },
];

/**
 * HELPER: Groups logs into 7-day blocks starting precisely on the 1st of the month.
 */
const groupLogsByMonthBlock = (logs, viewYear, viewMonthIndex) => {
    const weeksMap = new Map();
    const logsByDate = new Map(logs.map(log => [log.date, log])); 
    
    let currentBlockStart = new Date(viewYear, viewMonthIndex, 1);
    currentBlockStart.setHours(0, 0, 0, 0);

    let weekCounter = 1;
    let maxBlockIndex = 6; 

    const endOfMonth = new Date(viewYear, viewMonthIndex + 1, 0);
    endOfMonth.setHours(0, 0, 0, 0);

    while (currentBlockStart.getMonth() === viewMonthIndex && currentBlockStart.getFullYear() === viewYear && weekCounter <= maxBlockIndex) {
        const blockEnd = new Date(currentBlockStart);
        blockEnd.setDate(currentBlockStart.getDate() + 6); 

        const effectiveBlockEnd = blockEnd > endOfMonth ? endOfMonth : blockEnd;
        const weekKey = currentBlockStart.toISOString().split('T')[0];

        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedStartDate = currentBlockStart.toLocaleDateString('en-GB', options);
        const formattedEndDate = effectiveBlockEnd.toLocaleDateString('en-GB', options);

        const blockData = {
            startDate: formattedStartDate, 
            endDate: formattedEndDate,   
            logs: [],
            weekLabel: `Week ${weekCounter}`,
        };

        for (let d = new Date(currentBlockStart); d <= effectiveBlockEnd; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            const log = logsByDate.get(dateKey);
            if (log) blockData.logs.push(log);
        }

        weeksMap.set(weekKey, blockData);
        currentBlockStart.setDate(currentBlockStart.getDate() + 7);
        weekCounter++;
    }
    return Array.from(weeksMap.values());
};

const FlowerHouse = () => {
    const { currentUser } = useAuth();
    const userID = currentUser ? currentUser.uid : null;
    
    const [allMoodLogs, setAllMoodLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [activeSummary, setActiveSummary] = useState(null); 
    const [selectedWeekLogs, setSelectedWeekLogs] = useState(null); 
    
    const [viewMonthIndex, setViewMonthIndex] = useState(10); 
    const [viewYear, setViewYear] = useState(2025); 
    const [isPickerOpen, setIsPickerOpen] = useState(false); 

    const currentMonthLabel = MONTH_NAMES[viewMonthIndex]; 

    useEffect(() => {
        const fetchLogs = async () => {
            if (!userID) { 
                setAllMoodLogs(mockLogs);
                setIsLoading(false); 
                return;
            }
            try {
                const logs = await getMoodLogsByUser(userID); 
                setAllMoodLogs(logs.length > 0 ? logs : mockLogs); 
            } catch (error) {
                setAllMoodLogs(mockLogs); 
            } finally {
                setIsLoading(false); 
            }
        };
        fetchLogs();
    }, [userID]); 

    const currentMonthLogs = useMemo(() => 
        allMoodLogs.filter(log => {
            if (!log.date) return false;
            const logDate = new Date(log.date);
            return logDate.getFullYear() === viewYear && logDate.getMonth() === viewMonthIndex;
        }), [allMoodLogs, viewYear, viewMonthIndex]
    );
    
    const allYearLogs = useMemo(() => 
        allMoodLogs.filter(log => {
            if (!log.date) return false;
            const logDate = new Date(log.date);
            return logDate.getFullYear() === viewYear;
        }), [allMoodLogs, viewYear]
    );

    const weeklyFlowers = useMemo(() => 
        groupLogsByMonthBlock(currentMonthLogs, viewYear, viewMonthIndex), 
        [currentMonthLogs, viewYear, viewMonthIndex]
    );
    
    const yearlyAnalysis = useMemo(() => processLogData(allYearLogs, 52), [allYearLogs]); 
    const monthlyAnalysis = useMemo(() => processLogData(currentMonthLogs, weeklyFlowers.length), [currentMonthLogs, weeklyFlowers]);
    
    const toggleMonthPicker = () => setIsPickerOpen(prev => !prev);
    const handleMonthSelect = (index) => { setViewMonthIndex(index); setIsPickerOpen(false); };
    
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

    if (isLoading) return <div className="flowerhouse-container">Loading...</div>;

    return (
        <div className="flowerhouse-container" style={{ backgroundImage: `url(${FlowerHouseBG})`, backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
            <NavigationButtons /> 
            
            <div className="app-viewport-center">
                {/* 1. YEARLY NAVIGATION */}
                <div className="yearly-nav-wrapper"> 
                    <div className="year-pill-nav">
                        <button onClick={() => handleYearChange(-1)}>{'<'}</button>
                        <span>{viewYear}</span>
                        <button onClick={() => handleYearChange(1)}>{'>'}</button>
                    </div>
                </div>

                {/* 2. ARCHIVE CONTAINER */}
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
                                            style={{ backgroundColor: viewMonthIndex === i ? '#A3523B' : '' }}
                                        >
                                            {m.substring(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. SCROLLABLE FLOWER GRID */}
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
                            <p className="no-logs">No mood logs found for {currentMonthLabel}.</p>
                        )}
                    </div>

                    {/* 4. SUMMARY LINK */}
                    <button className="summary-link" onClick={viewMonthlySummary}>Summary</button>
                </div>
            </div>

            {/* Modals */}
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