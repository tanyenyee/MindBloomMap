import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import threebirdsImg from '../assets/images/buttons_threebirds.png';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState({});

  const buttons = [
    { alt: 'Back', onClick: () => navigate('/main', { replace: true}), title: 'Go back to previous page' },
    { alt: 'Main Page', onClick: () => navigate('/main', { replace: true }), title: 'Return to main page' },
    { alt: 'Profile Page', onClick: () => navigate('/profile'), title: 'Go to profile page' },
  ];

  const containerStyle = {
    position: 'absolute',
    top: '12px',
    right: '0px',
    display: 'flex',
    gap: '10px',
    zIndex: 1000,
  };

  const backgroundStyle = {
    position: 'absolute',
    top: '-4px',
    right: '0px',
    width: '220px',
    height: '78px',
    zIndex: 999,
    pointerEvents: 'none',
  };

  const getButtonStyle = (key) => ({
    width: '45px',
    height: '45px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 0,
    margin: 0,
    transition: 'transform 0.15s ease',
    transform: pressed[key] ? 'scale(0.85)' : 'scale(1)',
  });

  return (
    <div style={containerStyle}>
      <img src={threebirdsImg} alt="Three Birds Background" style={backgroundStyle} />
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          aria-label={btn.alt}
          title={btn.title}
          style={getButtonStyle(idx)}
          onMouseDown={() => setPressed({ ...pressed, [idx]: true })}
          onMouseUp={() => {
            setPressed({ ...pressed, [idx]: false });
            btn.onClick();
          }}
          onMouseLeave={() => setPressed({ ...pressed, [idx]: false })}
          onTouchStart={() => setPressed({ ...pressed, [idx]: true })}
          onTouchEnd={() => {
            setPressed({ ...pressed, [idx]: false });
            btn.onClick();
          }}
        />
      ))}
    </div>
  );
};

export default NavigationButtons;