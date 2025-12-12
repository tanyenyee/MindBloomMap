// src/TestFullFirebase.js
import { useState } from "react";
import { registerUser, loginUser, logoutUser } from "./authService";
import { addMoodLog, addJournal, addGardenProgress, addAchievement, addReport,
         fetchUsers, fetchMoodLogs, fetchJournals, fetchGardenProgress, fetchAchievements, fetchReports } from "./firebaseService";

function TestFullFirebase() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState({});

  /** Register + Add to DB */
  const handleRegister = async () => {
    try {
      const newUser = await registerUser({ email, password, username });
      setUser(newUser);
      alert("User registered and added to Users table!");
    } catch (error) {
      alert(error.message);
    }
  };

  /** Login */
  const handleLogin = async () => {
    try {
      const loggedInUser = await loginUser(email, password);
      setUser(loggedInUser);
      alert("Logged in successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  /** Logout */
  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    alert("Logged out!");
  };

  /** Add sample data for the logged-in user */
  const handleAddSampleData = async () => {
    if (!user) return alert("Login first!");

    const userID = user.uid;
    await addMoodLog({ moodID: "m001", userID, emotion: "Happy", date: "2025-12-03", note: "Feeling great!" });
    await addJournal({ journalID: "j001", userID, content: "Today was awesome!", emotionTag: "Happy", date: "2025-12-03" });
    await addGardenProgress({ plantID: "p001", userID, stage: "Seedling", lastUpdate: "2025-12-03" });
    await addAchievement({ badgeID: "b001", userID, achievementName: "First Login", dateEarned: "2025-12-03" });
    await addReport({ reportID: "r001", type: "Emergency", details: "Test report", date: "2025-12-03" });

    alert("Sample data added!");
  };

  /** Fetch all tables */
  const handleFetchAll = async () => {
    const allUsers = await fetchUsers();
    const allMoods = await fetchMoodLogs();
    const allJournals = await fetchJournals();
    const allGarden = await fetchGardenProgress();
    const allAchievements = await fetchAchievements();
    const allReports = await fetchReports();

    setData({ Users: allUsers, MoodLogs: allMoods, Journals: allJournals, GardenProgress: allGarden, Achievements: allAchievements, Reports: allReports });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Firebase Full Test</h2>

      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

      <div style={{ marginTop: "10px" }}>
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleAddSampleData}>Add Sample Data</button>
        <button onClick={handleFetchAll}>Fetch All Data</button>
      </div>

      <h3>Current User:</h3>
      <pre>{user ? JSON.stringify(user, null, 2) : "No user logged in"}</pre>

      <h3>Database Preview:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestFullFirebase;
