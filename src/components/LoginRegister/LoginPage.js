import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/main", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password!");
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="login-page-container">
      {/* --- RESTORED THE TITLE HERE --- */}
      <h2>Login</h2> 

      {/* Inputs are centered using flexbox */}
      <form 
        onSubmit={handleLogin} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '100%' 
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit">Login</button>
      </form>
      
      {/* Register button is centered */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button className="secondary" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}