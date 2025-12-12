// src/pages/SplashPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebases/firebase";
import "./SplashPage.css";
import splashVideo from "../../assets/images/splash_screen.mp4";

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if user is logged in
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/main"); // User already logged in
        } else {
          navigate("/login"); // Not logged in
        }
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <video autoPlay muted className="splash-video">
        <source src={splashVideo} type="video/mp4" />
      </video>
    </div>
  );
}
