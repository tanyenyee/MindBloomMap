// src/pages/MainPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { getAuth, signOut } from "firebase/auth";
import './MainPage.css';
// Importing Assets (Assumed names based on your description)
// Ensure these images exist in your src/assets/images folder
import bgImage from '../assets/images/main_background.png'; // The sea/sky background
import volcanoImg from '../assets/images/volcano_asset.png';
import forestImg from '../assets/images/forest_asset.png';
import sailingImg from '../assets/images/sailing_boat.png';
import gardenImg from '../assets/images/garden_flowers.png';

// Import Navigation Buttons
import NavigationButtons from '../components/NavigationButtons';

const MainPage = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);

  // Logout function
  const auth = getAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth); // no need to getAuth here; use default auth in context
      navigate("/login", { replace: true });
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  // Navigation handlers with brief active animation
  const handleNavigation = (path, key) => {
    setActiveItem(key);
    // delay navigation slightly to allow animation to show
    setTimeout(() => {
      navigate(path);
    }, 180); // match CSS transition duration
  };

  const handleKeyActivate = (e, path, key) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation(path, key);
    }
  };

  return (
    <div className="main-page-container page-container">
      {/* Ensure navigation buttons are only inside the container */}
      <NavigationButtons />

      {/* 1. Base Layer: Background Image */}
      <img src={bgImage} alt="World Map Background" className="background-layer" />

      {/* 2. Interactive Layer: Navigation Items */}
      
      {/* Volcano -> Volcano Interaction */}
      <div 
        className={"nav-item volcano-position" + (activeItem === 'volcano' ? ' active' : '')}
        onClick={() => handleNavigation('/volcano', 'volcano')}
        onMouseDown={() => setActiveItem('volcano')}
        onBlur={() => setActiveItem(null)}
        onKeyDown={(e) => handleKeyActivate(e, '/volcano', 'volcano')}
        role="button"
        tabIndex={0}
      >
        <img src={volcanoImg} alt="Volcano" className="nav-image" />
        <h2 className="nav-label">Volcano</h2>
      </div>

      {/* Forest -> SelfCare */}
      <div 
        className={"nav-item forest-position" + (activeItem === 'forest' ? ' active' : '')}
        onClick={() => handleNavigation('/self-care', 'forest')}
        onMouseDown={() => setActiveItem('forest')}
        onBlur={() => setActiveItem(null)}
        onKeyDown={(e) => handleKeyActivate(e, '/self-care', 'forest')}
        role="button"
        tabIndex={0}
      >
        <img src={forestImg} alt="Forest" className="nav-image" />
        <h2 className="nav-label">Forest</h2>
      </div>

      {/* Sailing -> Community */}
      <div 
        className={"nav-item sailing-position" + (activeItem === 'sailing' ? ' active' : '')}
        onClick={() => handleNavigation('/community', 'sailing')}
        onMouseDown={() => setActiveItem('sailing')}
        onBlur={() => setActiveItem(null)}
        onKeyDown={(e) => handleKeyActivate(e, '/community', 'sailing')}
        role="button"
        tabIndex={0}
      >
        <img src={sailingImg} alt="Sailing Boat" className="nav-image" />
        <h2 className="nav-label">Sailing</h2>
      </div>

      {/* Garden -> MoodGarden */}
      <div 
        className={"nav-item garden-position" + (activeItem === 'garden' ? ' active' : '')}
        onClick={() => handleNavigation('/mood-garden', 'garden')}
        onMouseDown={() => setActiveItem('garden')}
        onBlur={() => setActiveItem(null)}
        onKeyDown={(e) => handleKeyActivate(e, '/mood-garden', 'garden')}
        role="button"
        tabIndex={0}
      >
        <img src={gardenImg} alt="Flower Garden" className="nav-image" />
        <h2 className="nav-label">Garden</h2>
      </div>

      {/* ===== AI FRIEND BUTTON ===== */}
      <button
        onClick={() => navigate('/ai-friend')}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '12px 24px',
          backgroundColor: '#08477b',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          fontFamily: 'inherit',
          zIndex: 10,
        }}
      >
        AI Friend
      </button>
      {/* ===== END AI FRIEND BUTTON ===== */}
    </div>
  );
};

export default MainPage;
