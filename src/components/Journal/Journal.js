import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
// Added fetchData and writeData to update the Garden
import { addJournal, fetchData, writeData } from '../../firebases/firebaseService';
import NavigationButtons from '../NavigationButtons';
import './Journal.css';
import JournalBG from '../../assets/images/Journal_bg.png';

/* --- Helper to get the correct Garden Week Key --- */
function getMondayDateKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(d.getTime() - diffToMonday * 24 * 3600 * 1000);
  const yyyy = monday.getFullYear();
  const mm = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const Journal = () => {
  const { currentUser, loading } = useAuth();
  const [journalText, setJournalText] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);
  const today = new Date().toISOString().split('T')[0];

  // Helper to count words
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  function showToast(msg, ms = 2000) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), ms);
  }

  async function submitJournal() {
    if (loading) return;

    if (!currentUser) {
      showToast('Please log in to save your progress.');
      return;
    }

    const words = countWords(journalText);
    if (words === 0) {
      showToast('Please write something before saving.');
      return;
    }

    try {
      // 1. Save the Journal Entry
      await addJournal(currentUser.uid, { 
        content: journalText, 
        emotionTag: 'Neutral', 
        date: today 
      });

      // 2. UPDATE GARDEN POINTS
      // We do this silently so the user still gets points even if they are on this page
      const weekKey = getMondayDateKey();
      const gardenPath = `GardenProgress/${currentUser.uid}/${weekKey}`;
      
      // Calculate Points: 5 points for every 20 words, max 30 points
      const pointsEarned = Math.min(30, Math.floor(words / 20) * 5);
      
      if (pointsEarned > 0) {
        // Fetch current garden state
        const gardenData = await fetchData(gardenPath) || {};
        const currentProgress = gardenData.dailyProgress || 0;
        const currentWords = gardenData.journalWordsToday || 0;
        
        // Calculate allowed growth (don't exceed 100)
        const allowedPoints = Math.min(100 - currentProgress, pointsEarned);
        
        // Write back to garden
        await writeData(gardenPath, {
          journalWordsToday: currentWords + words,
          dailyProgress: currentProgress + allowedPoints,
          updatedAt: Date.now()
        });
        
        showToast(`Saved! You earned points for your garden 🌱`);
      } else {
        showToast('Journal entry saved! 📝');
      }

      setJournalText('');
      
    } catch (err) {
      console.error('Save journal failed:', err);
      showToast('Database Error: Permission denied.');
    }
  }

  if (loading) return <div className="loading-container">Verifying identity...</div>;

  return (
    <div className="journal-container" style={{ backgroundImage: `url(${JournalBG})` }}>
      <NavigationButtons />
      <div className="journal-viewport">
        <h1 className="journal-title">Journal</h1>
        <div className="journal-card">
          <div className="journal-header">
            <h2>Today's Entry</h2>
            <span className="journal-date">{today}</span>
          </div>
          <textarea
            className="journal-textarea"
            placeholder="Write your thoughts here..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          />
          <div className="journal-footer">
            <div className="word-count">
              {countWords(journalText)} words
            </div>
            <div className="journal-actions">
              <button className="journal-btn save-btn" onClick={submitJournal}>Save Entry</button>
              <button className="journal-btn cancel-btn" onClick={() => setJournalText('')}>Clear</button>
            </div>
          </div>
        </div>
      </div>
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
};

export default Journal;