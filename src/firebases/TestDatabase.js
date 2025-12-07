// src/TestDatabase.js
import { useState } from "react";
import {
  addUser,
  fetchUsers,
  addMoodLog,
  fetchMoodLogs,
  addJournal,
  fetchJournals,
  addGardenProgress,
  fetchGardenProgress,
  addAchievement,
  fetchAchievements,
  addReport,
  fetchReports
} from "./firebaseService";

function TestDatabase() {
  const [data, setData] = useState({
    users: {},
    moods: {},
    journals: {},
    garden: {},
    achievements: {},
    reports: {}
  });

  const handleAddDummyData = async () => {
    // Add dummy data
    await addUser({ userID: "u001", username: "John", password: "123", email: "john@example.com", avatar: "" });
    await addMoodLog({ moodID: "m001", userID: "u001", emotion: "Happy", date: "2025-12-03", note: "Feeling good" });
    await addJournal({ journalID: "j001", userID: "u001", content: "Today was awesome", emotionTag: "Happy", date: "2025-12-03" });
    await addGardenProgress({ plantID: "p001", userID: "u001", stage: "Seedling", lastUpdate: "2025-12-03" });
    await addAchievement({ badgeID: "b001", userID: "u001", achievementName: "First Login", dateEarned: "2025-12-03" });
    await addReport({ reportID: "r001", type: "Emergency", details: "Test report", date: "2025-12-03" });

    alert("Dummy data added!");
    handleFetchAll();
  };

  const handleFetchAll = async () => {
    const users = await fetchUsers();
    const moods = await fetchMoodLogs();
    const journals = await fetchJournals();
    const garden = await fetchGardenProgress();
    const achievements = await fetchAchievements();
    const reports = await fetchReports();

    setData({ users, moods, journals, garden, achievements, reports });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Firebase Service Test</h2>
      <button onClick={handleAddDummyData} style={{ marginBottom: "20px" }}>
        Add All Dummy Data
      </button>
      <button onClick={handleFetchAll} style={{ marginLeft: "10px" }}>
        Fetch All Data
      </button>

      <h3>Data Preview:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestDatabase;
