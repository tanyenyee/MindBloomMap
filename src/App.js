// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages/Components
import MainPage from './pages/MainPage';
import Volcano from './components/Volcano/Volcano'; 
import Community from './components/Community/Community';
import SelfCare from './components/SelfCare/SelfCare';
import MoodGarden from './components/MoodGarden/MoodGarden';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/volcano" element={<Volcano />} />
        <Route path="/community" element={<Community />} />
        <Route path="/self-care" element={<SelfCare />} />
        <Route path="/mood-garden" element={<MoodGarden />} />
        {/* Add other routes like Login/Register here */}
      </Routes>
    </Router>
  );
}

export default App;
