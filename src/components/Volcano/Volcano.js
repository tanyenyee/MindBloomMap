import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Volcano.css';
import volcanoButton from '../../assets/images/volcano_button.png';
import lavaSplash from '../../assets/images/lava_splash.mp4';
import pizzaCharacter from '../../assets/images/pizza_character.png';

const Volcano = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [isErupting, setIsErupting] = useState(false);
  const [showPizzaDialog, setShowPizzaDialog] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [shake, setShake] = useState(false);
  const [particles, setParticles] = useState([]);
  const clickSoundRef = useRef(null);
  const eruptionSoundRef = useRef(null);
  const particleIdRef = useRef(0);

  // Preload sounds
  if (!clickSoundRef.current) {
    clickSoundRef.current = new Audio('/assets/sounds/click.wav');
  }
  if (!eruptionSoundRef.current) {
    eruptionSoundRef.current = new Audio('/assets/sounds/volcano_eruption.wav');
  }

  const createParticle = (x, y) => {
    const particleId = particleIdRef.current++;
    const colors = ['#ff6b35', '#d32f2f', '#ffa726', '#ff5722'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const size = 8 + Math.random() * 12;

    const newParticle = {
      id: particleId,
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity - 3,
      color: randomColor,
      size
    };

    setParticles(prev => [...prev, newParticle]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particleId));
    }, 2000);
  };

  const handleVolcanoClick = (e) => {
    if (isErupting) return;

    // Play click sound
    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(err => console.log('Sound play error:', err));
    }

    // Vibrate
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Create lava particles at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const particleCount = Math.min(newCount, 5);
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => createParticle(x, y), i * 50);
    }

    if (newCount >= 10) {
      triggerEruption();
    }
  };

  const triggerEruption = () => {
    setIsErupting(true);
    setShake(true);

    // Play eruption sound
    if (eruptionSoundRef.current) {
      eruptionSoundRef.current.currentTime = 0;
      eruptionSoundRef.current.play().catch(err => console.log('Sound play error:', err));
    }

    // Strong vibration
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    setTimeout(() => setShake(false), 600);
    
    // Show pizza character after 4 seconds
    setTimeout(() => {
      setShowPizzaDialog(true);
    }, 4000);
    
    // Show back button 0.5 seconds after pizza
    setTimeout(() => {
      setShowBackButton(true);
    }, 4500);
  };

  const handleGoBack = () => {
    setIsErupting(false);
    setShowPizzaDialog(false);
    setShowBackButton(false);
    setClickCount(0);
    setParticles([]);
  };

  return (
    <div className="volcano-container">
      <button className="volcano-back-btn" onClick={() => navigate('/main')}>
        ←
      </button>

      <div className="volcano-content">
        {/* Instruction text */}
        {!isErupting && (
          <p className="volcano-instruction">
            Tap the volcano to release stress! ({clickCount}/10)
          </p>
        )}

        <div className={`volcano-wrapper ${shake ? 'shake' : ''}`}>
          <button 
            className="volcano-button"
            onClick={handleVolcanoClick}
            disabled={isErupting}
          >
            <img src={volcanoButton} alt="Volcano" />
            
            {/* Render lava particles */}
            {particles.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}px`,
                  top: `${particle.y}px`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  '--vx': particle.vx,
                  '--vy': particle.vy
                }}
              />
            ))}
          </button>

          {/* Progress bar */}
          {!isErupting && clickCount > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{
                  width: `${(clickCount / 10) * 100}%`
                }}
              />
            </div>
          )}

          {/* Eruption video with pizza dialog */}
          {isErupting && (
            <div className="eruption-video-container">
              <video 
                className="eruption-video"
                src={lavaSplash}
                autoPlay
              />
              {/* Pizza dialog on top of video */}
              <div className="pizza-dialog">
                {showPizzaDialog && (
                  <img src={pizzaCharacter} alt="Pizza Character" className="pizza-character fade-in" />
                )}
                {showBackButton && (
                  <button className="pizza-back-btn fade-in" onClick={handleGoBack}>
                    Go Back
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volcano;
