import React, { useEffect, useState, useRef } from "react";
import "./MoodGarden.css";
import { useAuth } from "../../context/AuthContext";
import {
  writeData,
  fetchData,
  addJournal,
  addMoodLog,
} from "../../firebases/firebaseService";
import NavigationButtons from "../NavigationButtons";
import { useNavigate } from "react-router-dom";

// assets
import potImg from "../../assets/images/pot.png";
import redflower from "../../assets/images/redflower.png";
import purpleflower from "../../assets/images/purpleflower.png";
import blueflower from "../../assets/images/blueflower.png";
import yellowflower from "../../assets/images/yellowflower.png";
import pinkflower from "../../assets/images/pinkflower.png";
import whiteflower from "../../assets/images/whiteflower.png";
import Plants from "../../assets/images/plant_stem.png"; 
import fertilizerIcon from "../../assets/images/fertilizer_icon.png";
import wateringIcon from "../../assets/images/watering_icon.png";
import journalIcon from "../../assets/images/journal_icon.png";
import flowerHouseIcon from "../../assets/images/flowerhouse_icon.png";

/* ---------- Config / Points ---------- */
const MOOD_POINTS = { happy: 50, calm: 40, anxious: 30, angry: 20, sad: 10 };
const MAX_DAILY_GROWTH = 100;
const MAX_JOURNAL_POINTS = 30;
const MAX_WATERING_COUNT = 10;
const MAX_FLOWERS_PER_WEEK = 7;

// Helpers
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

function todayDateKey(date = new Date()) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const FLOWER_IMAGES = [redflower, purpleflower, blueflower, yellowflower, pinkflower, whiteflower];

export default function MoodGarden() {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // State for keys
  const [weekKey] = useState(getMondayDateKey());
  const [todayKey] = useState(todayDateKey());
  
  // Garden State
  const [seedChosen, setSeedChosen] = useState(false);
  const [selectedSeedIndex, setSelectedSeedIndex] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [flowersBloomed, setFlowersBloomed] = useState(0);
  const [hasBloomedToday, setHasBloomedToday] = useState(false);
  const [moodSubmittedDate, setMoodSubmittedDate] = useState(null);
  const [journalWordsToday, setJournalWordsToday] = useState(0);
  const [wateringCountToday, setWateringCountToday] = useState(0);
  
  // UI State
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false); 
  const [journalText, setJournalText] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);
  const [lastBloomedIndex, setLastBloomedIndex] = useState(null);
  const [waterDroplets, setWaterDroplets] = useState([]);

  // Use the real UID for the database path
  const docPath = currentUser ? `GardenProgress/${currentUser.uid}/${weekKey}` : null;

  // --- REF: Keeps track of latest state instantly ---
  const gardenRef = useRef({
    seedChosen: false,
    selectedSeedIndex: 0,
    dailyProgress: 0,
    flowersBloomed: 0,
    hasBloomedToday: false,
    moodSubmittedDate: null,
    journalWordsToday: 0,
    wateringCountToday: 0
  });

  const updateState = (updates) => {
    gardenRef.current = { ...gardenRef.current, ...updates };
    if (updates.hasOwnProperty('seedChosen')) setSeedChosen(updates.seedChosen);
    if (updates.hasOwnProperty('selectedSeedIndex')) setSelectedSeedIndex(updates.selectedSeedIndex);
    if (updates.hasOwnProperty('dailyProgress')) setDailyProgress(updates.dailyProgress);
    if (updates.hasOwnProperty('flowersBloomed')) setFlowersBloomed(updates.flowersBloomed);
    if (updates.hasOwnProperty('hasBloomedToday')) setHasBloomedToday(updates.hasBloomedToday);
    if (updates.hasOwnProperty('moodSubmittedDate')) setMoodSubmittedDate(updates.moodSubmittedDate);
    if (updates.hasOwnProperty('journalWordsToday')) setJournalWordsToday(updates.journalWordsToday);
    if (updates.hasOwnProperty('wateringCountToday')) setWateringCountToday(updates.wateringCountToday);
  };

  function showToast(msg, ms = 2000) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), ms);
  }

  function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  // 1. LOAD DATA (FIXED: Includes Auto-Repair for missing seeds)
  useEffect(() => {
    if (authLoading || !currentUser || !docPath) return;

    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchData(docPath);
        
        if (mounted) {
            const safeData = data || {};
            
            // --- AUTO REPAIR LOGIC ---
            // If we have progress (points or flowers) but 'seedChosen' is false/missing,
            // we assume the seed was actually chosen (prevents the "Pick Seed" glitch).
            const hasActivity = (safeData.dailyProgress > 0) || (safeData.flowersBloomed > 0);
            const correctedSeedChosen = !!safeData.seedChosen || hasActivity;

            const lastActive = safeData.lastActiveDate; 
            const isNewDay = lastActive !== todayKey;

            if (isNewDay) {
                console.log("New day detected! Resetting daily counters.");
                
                const newState = {
                    seedChosen: correctedSeedChosen, // Use corrected value
                    selectedSeedIndex: safeData.selectedSeedIndex ?? 0,
                    flowersBloomed: safeData.flowersBloomed ?? 0,
                    // RESET DAILY ITEMS
                    dailyProgress: 0,
                    wateringCountToday: 0,
                    journalWordsToday: 0,
                    hasBloomedToday: false,
                    moodSubmittedDate: safeData.moodSubmittedDate === todayKey ? safeData.moodSubmittedDate : null 
                };

                updateState(newState);

                await writeData(docPath, {
                    ...newState,
                    lastActiveDate: todayKey,
                    updatedAt: Date.now()
                });

            } else {
                // SAME DAY: Load normally
                updateState({
                    seedChosen: correctedSeedChosen, // Use corrected value
                    selectedSeedIndex: safeData.selectedSeedIndex ?? 0,
                    dailyProgress: safeData.dailyProgress ?? 0,
                    flowersBloomed: safeData.flowersBloomed ?? 0,
                    hasBloomedToday: safeData.hasBloomedTodayDate === todayKey ? !!safeData.hasBloomedToday : false,
                    moodSubmittedDate: safeData.moodSubmittedDate ?? null,
                    journalWordsToday: safeData.journalWordsToday ?? 0,
                    wateringCountToday: safeData.wateringCountToday ?? 0,
                });
            }
        }
      } catch (err) {
        console.error("Load garden error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [docPath, authLoading, currentUser, todayKey]);

  // 2. PERSIST DATA
  async function persist(explicitChanges = {}) {
    if (!currentUser || !docPath) return;

    if (Object.keys(explicitChanges).length > 0) {
        updateState(explicitChanges);
    }

    const currentStats = gardenRef.current;

    const payload = {
      seedChosen: currentStats.seedChosen,
      selectedSeedIndex: currentStats.selectedSeedIndex,
      flowersBloomed: currentStats.flowersBloomed,
      dailyProgress: currentStats.dailyProgress,
      hasBloomedToday: currentStats.hasBloomedToday,
      hasBloomedTodayDate: currentStats.hasBloomedToday ? todayKey : null,
      moodSubmittedDate: currentStats.moodSubmittedDate,
      journalWordsToday: currentStats.journalWordsToday,
      wateringCountToday: currentStats.wateringCountToday,
      lastActiveDate: todayKey,
      updatedAt: Date.now(),
    };

    try {
      await writeData(docPath, payload);
    } catch (err) {
      console.warn("persist failed", err);
    }
  }

  // --- AUTO RECOVERY for Bloom ---
  useEffect(() => {
    if (!loading && currentUser && dailyProgress >= MAX_DAILY_GROWTH && !hasBloomedToday) {
      console.log("Auto-correcting: Progress is 100% but bloom not triggered.");
      
      const currentFlowers = gardenRef.current.flowersBloomed;
      const newFlowerCount = currentFlowers < MAX_FLOWERS_PER_WEEK ? currentFlowers + 1 : currentFlowers;

      updateState({
          hasBloomedToday: true,
          flowersBloomed: newFlowerCount
      });
      showToast("Flower restored! 🌸");

      persist(); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentUser, dailyProgress, hasBloomedToday]);

  const handlePlantSeed = (index) => {
    updateState({ 
        seedChosen: true, 
        selectedSeedIndex: index 
    });
    persist();
  };

  function addProgressPoints(points) {
    const currentStats = gardenRef.current;

    if (currentStats.dailyProgress >= MAX_DAILY_GROWTH && currentStats.hasBloomedToday) {
      showToast("You’ve helped your plant grow as much as it can today 🌱");
      return;
    }

    const allowed = Math.min(MAX_DAILY_GROWTH - currentStats.dailyProgress, points || 0);
    const newProgress = Math.min(MAX_DAILY_GROWTH, currentStats.dailyProgress + (allowed > 0 ? allowed : 0));
    
    let bloomUpdates = {};

    if (newProgress >= MAX_DAILY_GROWTH && !currentStats.hasBloomedToday) {
        let newFlowerCount = currentStats.flowersBloomed;
        
        if (currentStats.flowersBloomed < MAX_FLOWERS_PER_WEEK) {
            newFlowerCount = currentStats.flowersBloomed + 1;
            setLastBloomedIndex(newFlowerCount - 1);
            setTimeout(() => setLastBloomedIndex(null), 900);
        }
        
        bloomUpdates = {
            hasBloomedToday: true,
            flowersBloomed: newFlowerCount
        };
        showToast("A flower has bloomed today 🌸");
    }

    const updates = {
        dailyProgress: newProgress,
        ...bloomUpdates
    };

    updateState(updates);
    persist();
  }

  async function fertilizerChoose(mood) {
    if (gardenRef.current.moodSubmittedDate === todayKey) {
      showToast("Mood already submitted today.");
      setShowMoodModal(false);
      return;
    }
    const pts = MOOD_POINTS[mood] ?? 0;
    
    updateState({ moodSubmittedDate: todayKey });
    addProgressPoints(pts);
    setShowMoodModal(false);

    try {
      await addMoodLog(currentUser.uid, { emotion: mood, date: todayKey, note: "" });
    } catch (err) {
      console.warn("addMoodLog failed", err);
    }
  }

  function waterPlant() {
    const currentWatering = gardenRef.current.wateringCountToday;

    if (currentWatering >= MAX_WATERING_COUNT) {
      showToast("Watering limit reached for today.");
      return;
    }
    
    const newCount = currentWatering + 1;
    updateState({ wateringCountToday: newCount });
    addProgressPoints(1); 

    const baseId = Date.now();
    const dropletIds = Array.from({ length: 5 }, (_, i) => `${baseId}-${i}`);
    setWaterDroplets(prev => [...prev, ...dropletIds]);
    setTimeout(() => {
      setWaterDroplets(prev => prev.filter(id => !dropletIds.includes(id)));
    }, 1200);
  }

  async function submitJournal(text) {
    const words = countWords(text);
    const journalPoints = Math.min(MAX_JOURNAL_POINTS, Math.floor(words / 20) * 5);
    
    const currentWords = gardenRef.current.journalWordsToday || 0;
    const newWords = currentWords + words;
    
    updateState({ journalWordsToday: newWords });
    addProgressPoints(journalPoints);
    
    setShowJournalModal(false);
    setJournalText("");

    try {
      await addJournal(currentUser.uid, { content: text, emotionTag: "", date: todayKey });
    } catch (err) {
      console.warn("addJournal failed", err);
    }
  }

  if (authLoading) return <div className="loading-container">Verifying identity...</div>;
  if (!currentUser) {
    return (
      <div className="moodgarden-wrap">
        <NavigationButtons />
        <div className="error-container" style={{ padding: '20px', textAlign: 'center', marginTop: '50px' }}>
          <h2>Access Denied</h2>
          <p>Please log in to access your Mood Garden.</p>
          <button style={{ padding: '10px 20px', fontSize: '16px' }} onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }
  if (loading) return <div className="loading-container">Loading Garden...</div>;

  const flowerPositions = [
    { left: "50%", bottom: "80%" }, { left: "40%", bottom: "85%" },
    { left: "60%", bottom: "90%" }, { left: "50%", bottom: "95%" },
    { left: "40%", bottom: "100%" }, { left: "55%", bottom: "110%" },
    { left: "60%", bottom: "120%" },
  ];

  return (
    <div className="moodgarden-wrap">
      <NavigationButtons />
      <div className="top-nav-spacer" />
      <div className="top-row">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button className="top-btn" onClick={() => setShowMoodModal(true)}>
            <img src={fertilizerIcon} alt="fertilize" />
            <div>Fertilize</div>
          </button>
          <button className="water-main-btn" onClick={() => waterPlant()}>
            <img src={wateringIcon} alt="water" />
            <div>Water</div>
          </button>
        </div>
        <div className="top-row-spacer" />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button className="top-btn" onClick={() => navigate('/journal')}>
            <img src={journalIcon} alt="journal" />
            <div>Journal</div>
          </button>
          <button className="flowerhouse-main-btn" onClick={() => navigate('/flower-house')}>
            <img src={flowerHouseIcon} alt="flowerhouse" />
            <div>Flower House</div>
          </button>
        </div>
      </div>

      <div className="middle-row">
        <div className="middle-center">
          <div className="garden-center-mini">
            <img src={potImg} alt="Pot" className="pot-image" />
            {seedChosen && <img src={Plants} alt="stem" className="stem-image" />}
            
            {waterDroplets.map((dropletId, index) => (
              <div key={dropletId} className="water-droplet animate" style={{ left: `${40 + (index % 5) * 8}%`, top: `${10 + (index % 3) * 5}%` }} />
            ))}

            {Array.from({ length: flowersBloomed }).map((_, i) => {
              const src = FLOWER_IMAGES[selectedSeedIndex % FLOWER_IMAGES.length];
              const pos = flowerPositions[i] || flowerPositions[0];
              return (
                <img key={i} src={src} className={`flower-image ${i === lastBloomedIndex ? "bloom" : ""}`} alt={`flower-${i}`} style={{ left: pos.left, bottom: pos.bottom, transform: "translateX(-50%)" }} />
              );
            })}

            {!seedChosen && (
              <div className="seed-picker-compact">
                <div className="seed-label">Pick a seed to plant</div>
                <div className="seed-list-compact">
                  {FLOWER_IMAGES.map((img, idx) => (
                    <button 
                      key={idx} 
                      className="seed-select-compact" 
                      onClick={() => handlePlantSeed(idx)}
                    >
                      <img src={img} alt={`seed-${idx}`} className="seed-thumb-compact" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="progress-bar-outer"><div className="progress-fill" style={{ width: `${dailyProgress}%` }} /></div>
        <div className="progress-text">{dailyProgress}/100</div>
        <button className="info-btn" onClick={() => setShowInfoModal(true)}>?</button>
      </div>

      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <h3>How the Mood Garden works</h3>
            <ul>
              <li>Each Monday you choose a seed to start the week's plant.</li>
              <li>Each day you can add points by: mood (once/day), journal words, and watering.</li>
              <li>Daily cap is 100 points. Reach 100 → 1 flower blooms today.</li>
              <li>Maximum 7 flowers per week (one per day).</li>
            </ul>
            <div className="modal-actions">
              <button onClick={() => setShowInfoModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showMoodModal && (
        <div className="modal-overlay" onClick={() => setShowMoodModal(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <h3>Choose today's mood</h3>
            <div className="mood-grid">
              {Object.keys(MOOD_POINTS).map((mood) => (
                <button key={mood} className="mood-btn" onClick={() => fertilizerChoose(mood)}>
                  <div className="mood-emoji">{mood === "happy" ? "😊" : mood === "calm" ? "😌" : mood === "anxious" ? "😰" : mood === "angry" ? "😠" : "😢"}</div>
                  <div className="mood-label">{mood}</div>
                </button>
              ))}
            </div>
            <div className="modal-actions"><button onClick={() => setShowMoodModal(false)}>Cancel</button></div>
          </div>
        </div>
      )}
      
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}