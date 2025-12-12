// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages/Components
import MainPage from './pages/MainPage';
import Volcano from './components/Volcano/Volcano'; 
import Community from './components/Community/Community';
import SelfCare from './components/SelfCare/SelfCare';
import MoodGarden from './components/MoodGarden/MoodGarden';
import ProfilePage from './pages/ProfilePage';
// Add missing pages
import LoginPage from './components/LoginRegister/LoginPage';
import RegisterPage from './components/LoginRegister/RegisterPage';
import SplashPage from './components/LoginRegister/SplashPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<MainPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/volcano" element={<Volcano />} />
        <Route path="/community" element={<Community />} />
        <Route path="/self-care" element={<SelfCare />} />
        <Route path="/mood-garden" element={<MoodGarden />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* New routes for auth and splash */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/splash" element={<SplashPage />} />
      </Routes>
    </Router>
  );
}

export default App;
