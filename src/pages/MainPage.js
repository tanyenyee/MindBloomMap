// src/pages/MainPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../context/AuthContext"; // use global auth context
import './MainPage.css';

// Assets
import bgImage from '../assets/images/main_background.png';
import volcanoImg from '../assets/images/volcano_asset.png';
import forestImg from '../assets/images/forest_asset.png';
import sailingImg from '../assets/images/sailing_boat.png';
import gardenImg from '../assets/images/garden_flowers.png';

const MainPage = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const { user, loading } = useAuth(); // get user from context

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

  // Navigation handlers with animation
  const handleNavigation = (path, key) => {
    setActiveItem(key);
    setTimeout(() => navigate(path), 180);
  };

  const handleKeyActivate = (e, path, key) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleNavigation(path, key);
    }
  };

  // Show loading or nothing until user data is ready
  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="main-page-container">
      <img src={bgImage} alt="World Map Background" className="background-layer" />

      {/* Header */}
      <div className="main-header">
        <h2 id="welcome_message">Welcome, {user?.username || "Guest"}!</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Navigation items */}
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
    </div>
  );
};

export default MainPage;
