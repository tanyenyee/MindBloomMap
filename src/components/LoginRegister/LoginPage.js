// src/pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebases/authService";
import { getUser } from "../../firebases/firebaseService";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/main", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) return alert("Please enter email and password!");

    try {
      // Firebase Auth login
      const firebaseUser = await loginUser(email, password);

      // Fetch additional user info (like username) from Realtime Database
      const dbUser = await getUser(firebaseUser.uid);

      // Create user object with serializable data
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: dbUser?.username || "",
      };

      // ✅ KEY FIX: Set user in AuthContext
      setUser(userData);

      alert("Login successful!");
      // Navigate will happen automatically via useEffect when user state updates
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button className="secondary" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}
