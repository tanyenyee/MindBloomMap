// src/TestAuth.js
import { useState } from "react";
import { registerUser, loginUser, logoutUser } from "./authService";

function TestAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);

  const handleRegister = async () => {
    try {
      const newUser = await registerUser({ email, password, username });
      setUser(newUser);
      alert("Registered and added to database!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      alert("Logged in successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Firebase Auth Test</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin} style={{ marginLeft: "10px" }}>Login</button>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
      </div>

      <h3>Current User:</h3>
      <pre>{user ? JSON.stringify(user, null, 2) : "No user logged in"}</pre>
    </div>
  );
}

export default TestAuth;
