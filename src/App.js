// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import PrivateRoute from "./context/PrivateRoute";

// Import all your pages
import SplashPage from "./components/LoginRegister/SplashPage";
import LoginPage from "./components/LoginRegister/LoginPage";
import RegisterPage from "./components/LoginRegister/RegisterPage";
import MainPage from "./pages/MainPage";
import Volcano from "./components/Volcano/Volcano";
import Community from "./components/Community/Community";
import SelfCare from "./components/SelfCare/SelfCare";
import MoodGarden from "./components/MoodGarden/MoodGarden";
import AIVirtualFriend from "./components/AIVirtualFriend/AIVirtualFriend";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Splash Screen (Initial Landing) */}
            <Route path="/" element={<SplashPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/volcano"
              element={
                <PrivateRoute>
                  <Volcano />
                </PrivateRoute>
              }
            />
            <Route
              path="/community"
              element={
                <PrivateRoute>
                  <Community />
                </PrivateRoute>
              }
            />
            <Route
              path="/self-care"
              element={
                <PrivateRoute>
                  <SelfCare />
                </PrivateRoute>
              }
            />
            <Route
              path="/mood-garden"
              element={
                <PrivateRoute>
                  <MoodGarden />
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-friend"
              element={
                <PrivateRoute>
                  <AIVirtualFriend />
                </PrivateRoute>
              }
            />
            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;