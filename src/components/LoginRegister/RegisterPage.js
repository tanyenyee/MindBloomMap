// src/pages/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../firebases/authService";
import { addUser } from "../../firebases/firebaseService";
import { getAuth, signOut } from "firebase/auth";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      return alert("Please fill all fields!");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    try {
      const user = await registerUser(email, password);

      await addUser(user.uid, {
        username,
        email,
        avatar: ""
      });

      // SIGN OUT immediately after registration
      const auth = getAuth();
      await signOut(auth);

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <div className="register-page-container">
        <h2>Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button onClick={handleRegister}>Register</button>
    </div>

  );
}
