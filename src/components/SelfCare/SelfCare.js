import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationButtons from '../NavigationButtons';
import '../../styles/PageContainer.css';
import forestBg from '../../assets/images/forest_background.png';
import capybaraImg from '../../assets/images/capybara.png';
import stonesImg from '../../assets/images/relaxation_stones.png';
import birdImg from '../../assets/images/bird_music.png';

const VIEWS = {
  FOREST: 'forest',
  RELAXATION: 'relaxation',
  MUSIC: 'music',
};

const SelfCare = () => {
  const navigate = useNavigate();
  const [view, setView] = useState(VIEWS.FOREST);

  // Timer state for the Relaxation view
  const INITIAL_SECONDS = 5 * 60; // 5 minutes
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let t = null;
    if (running && secondsLeft > 0) {
      t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    }
    if (secondsLeft === 0 && running) {
      setRunning(false);
      alert("Time's up — your relaxation session finished.");
    }
    return () => clearInterval(t);
  }, [running, secondsLeft]);

  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(INITIAL_SECONDS);
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const renderForest = () => (
    <div style={styles.forestView}>
      {/* Capybara / AI Friend clickable image */}
      <img
        src={capybaraImg}
        alt="AI Friend"
        style={styles.capybaraImg}
        onClick={() => navigate('/ai-friend')}
        role="button"
      />

      {/* Relaxation stones clickable image */}
      <img
        src={stonesImg}
        alt="Relaxation"
        style={styles.relaxationImg}
        onClick={() => setView(VIEWS.RELAXATION)}
        role="button"
      />

      {/* Music bird clickable image (navigates to the MusicPlayer page) */}
      <img
        src={birdImg}
        alt="Music"
        style={styles.musicImg}
        onClick={() => navigate('/music')}
        role="button"
      />
    </div>
  );

  const renderRelaxation = () => (
    <div style={styles.relaxationContainer}>
      <h2>Relaxation Timer</h2>
      <div style={styles.timer}>{minutes}:{seconds}</div>
      <div style={styles.verticalButtons}>
        <button style={styles.bigButton} onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Start'}</button>
        <button style={styles.bigButton} onClick={resetTimer}>Reset</button>
        <button style={styles.bigButton} onClick={() => { resetTimer(); setView(VIEWS.FOREST); }}>Back</button>
      </div>
    </div>
  );

  const renderMusic = () => (
    <div style={styles.musicContainer}>
      <h2>Music Player</h2>
      <div style={{ marginTop: 8, marginBottom: 12 }}>
        <audio controls style={{ width: 260 }}>
          <track kind="captions" />
          Sorry, your browser does not support the audio element.
        </audio>
      </div>
      <div style={styles.verticalButtons}>
        <button style={styles.bigButton} onClick={() => setView(VIEWS.FOREST)}>Back</button>
      </div>
    </div>
  );

  return (
    <div className="main-page-container" style={styles.mainContainer}>
      <NavigationButtons />
      
      {/* Fixed background */}
      <img 
        src={forestBg} 
        alt="Forest Background" 
        style={styles.backgroundImage}
      />

      {/* Content area - overlays the background */}
      <div style={styles.contentArea}>
        {view === VIEWS.FOREST && renderForest()}
        {view === VIEWS.RELAXATION && renderRelaxation()}
        {view === VIEWS.MUSIC && renderMusic()}
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  contentArea: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forestView: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  timer: { 
    fontSize: 48, 
    fontWeight: '700', 
    marginTop: 12 
  },
  relaxationContainer: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: 28,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  musicContainer: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: 28,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  verticalButtons: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 10, 
    width: '70%', 
    alignItems: 'center' 
  },
  bigButton: { 
    padding: '10px 14px', 
    fontSize: 16, 
    width: '100%', 
    borderRadius: 6,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#08477b',
    color: 'white',
    fontWeight: 'bold',
  },
  capybaraImg: {
    position: 'absolute',
    left: '5%',
    top: '50%',
    width: 221,
    height: 221,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 20,
  },
  relaxationImg: {
    position: 'absolute',
    right: '-14%',
    top: '57%',
    width: 240,
    height: 240,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 20,
  },
  musicImg: {
    position: 'absolute',
    left: '15%',
    bottom: '-2%',
    width: 252,
    height: 252,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 20,
  },
};

export default SelfCare;
