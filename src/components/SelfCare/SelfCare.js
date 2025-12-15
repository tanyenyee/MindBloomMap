import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import forestBg from '../../assets/images/forest_background.png';
import forestIcon from '../../assets/images/forest_asset.png';
import capybaraImg from '../../assets/images/capybara.png';
import stonesImg from '../../assets/images/relaxation_stones.png';
import birdImg from '../../assets/images/bird_music.png';
import mainBg from '../../assets/images/main_background.png';

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
    <div style={{ ...styles.overlay, position: 'relative' }}>
      <img
        src={forestIcon}
        alt="Back to map"
        style={styles.topRightIcon}
        onClick={() => navigate('/main')}
        role="button"
        tabIndex={0}
        aria-label="Back to map"
      />

      {/* Capybara / AI Friend clickable image */}
      <img
        src={capybaraImg}
        alt="AI Friend"
        style={styles.capybaraImg}
        onClick={(e) => { e.stopPropagation(); alert('AI Friend coming soon!'); }}
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
        onClick={() => navigate('/music', { state: { autoplay: true } })}
        role="button"
      />

      {/* In-forest music player panel (appears near bird) */}
      

      {/* small labels for accessibility / visual */}
      <div style={styles.labelsContainer}>
        <div style={styles.label}>AI Friend</div>
        <div style={styles.label}>Relaxation</div>
        <div style={styles.label}>Music</div>
      </div>
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

  

  const background = view === VIEWS.FOREST ? forestBg : mainBg;

  return (
    <div className="main-page-container">
      <img src={background} alt="background" className="background-layer" />

      {/* Content area positioned over the background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {view === VIEWS.FOREST && renderForest()}
        {view === VIEWS.RELAXATION && renderRelaxation()}
        {view === VIEWS.MUSIC && renderMusic()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    background: 'transparent',
    padding: 0,
    borderRadius: 0,
    textAlign: 'center',
    minWidth: 0,
    width: '100%',
    height: '100%',
  },
  buttonsRow: { display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 },
  timer: { fontSize: 48, fontWeight: '700', marginTop: 12 },
  relaxationContainer: {
    background: 'transparent',
    padding: 28,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  musicContainer: {
    background: 'transparent',
    padding: 28,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  verticalButtons: { display: 'flex', flexDirection: 'column', gap: 10, width: '70%', alignItems: 'center' },
  bigButton: { padding: '10px 14px', fontSize: 16, width: '100%', borderRadius: 6 },
  topRightIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 72,
    height: 72,
    cursor: 'pointer',
    zIndex: 5,
  },
  capybaraImg: {
    position: 'absolute',
    left: '5%',
    top: '50%',
    width: 221,
    height: 221,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 110,
  },
  relaxationImg: {
    position: 'absolute',
    right: '-14%',
    top: '57%',
    width: 240,
    height: 240,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 4,
  },
  musicImg: {
    position: 'absolute',
    left: '15%',
    bottom: '-2%',
    width: 252,
    height: 252,
    objectFit: 'contain',
    cursor: 'pointer',
    zIndex: 50,
  },
  labelsContainer: {
    display: 'none',
  },
  label: {
    background: 'rgba(255,255,255,0.7)',
    padding: '6px 10px',
    borderRadius: 6,
    fontWeight: 600,
  }
};

export default SelfCare;
