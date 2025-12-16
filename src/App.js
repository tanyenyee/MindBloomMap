// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import all your pages
import SplashPage from "./components/LoginRegister/SplashPage";
import LoginPage from "./components/LoginRegister/LoginPage";
import RegisterPage from "./components/LoginRegister/RegisterPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import EmergencyReport from "./components/EmergencyReport/EmergencyReport";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Splash Screen (Initial Landing) */}
          <Route path="/" element={<SplashPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Main Application Routes */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/emergency-report" element={<EmergencyReport />} />

          {/* Add other routes here */}
          {/* <Route path="/volcano" element={<VolcanoPage />} />
          <Route path="/self-care" element={<SelfCarePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/mood-garden" element={<MoodGardenPage />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;