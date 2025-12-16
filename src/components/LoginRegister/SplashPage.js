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
    // Set a timer for 5 seconds
    const timer = setTimeout(() => {
      // Check if user is logged in
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate("/main", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
        // Clean up the listener after checking
        unsubscribe();
      });
    }, 5000);

    // Cleanup timer on unmount
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
