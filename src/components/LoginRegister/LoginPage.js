import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../firebases/authService";
import { getUser } from "../../firebases/firebaseService";
import { useAuth } from "../../context/AuthContext"; // Import the hook
import "./LoginPage.css";

// 1. The component name should match the import in App.js
export default function LoginPage() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/main", { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) return alert("Please enter email and password!");
    try {
      const firebaseUser = await loginUser(email, password);
      const dbUser = await getUser(firebaseUser.uid);

      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: dbUser?.username || "",
      };

      setUser(userData); // This triggers the localStorage save in AuthContext
      alert("Login successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login-page-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}