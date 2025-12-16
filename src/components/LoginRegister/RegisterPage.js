// src/components/LoginRegister/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../firebases/authService";
import { addUser } from "../../firebases/firebaseService";
import "./LoginPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !username) {
      return alert("Please fill in all fields!");
    }

    try {
      // Create user in Firebase Auth
      const user = await registerUser(email, password);

      // Add user data to Realtime Database
      await addUser(user.uid, {
        username,
        email,
        avatar: "",
        password: "", // Note: Don't store passwords in DB in production
      });

      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page-container">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <button onClick={handleRegister}>Register</button>
      <button className="secondary" onClick={() => navigate("/login")}>
        Back to Login
      </button>
    </div>
  );
}
