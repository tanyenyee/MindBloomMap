import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { addMoodLog, getMoodLogsByUser } from "../../firebases/firebaseService";
import "./MoodLogs.css";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Angry", emoji: "😡" },
  { label: "Calm", emoji: "😌" },
  { label: "Excited", emoji: "🤩" },
];

export default function MoodGarden() {
  const { user, loading } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);

  // Fetch mood logs for current user
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const data = await getMoodLogsByUser(user.uid);
      setLogs(data || []);
    };
    fetchData();
  }, [user]);

  const handleAddMood = async () => {
    if (!selectedMood) return alert("Please select a mood!");

    await addMoodLog(
      user.uid,
      {
        emotion: selectedMood.label,
        date: new Date().toISOString().split("T")[0],
        note,
      }
    );

    setSelectedMood(null);
    setNote("");

    const data = await getMoodLogsByUser(user.uid);
    setLogs(data || []);

    alert("Mood logged successfully!");
  };


  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="mood-garden-container">
      <h2>Mood Garden</h2>

      {/* Mood Selection */}
      <div className="mood-picker">
        {moods.map((mood) => (
          <button
            key={mood.label}
            className={selectedMood?.label === mood.label ? "active" : ""}
            onClick={() => setSelectedMood(mood)}
          >
            {mood.emoji} {mood.label}
          </button>
        ))}
      </div>

      {/* Optional Note */}
      <textarea
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={handleAddMood} disabled={!selectedMood}>
        Log Mood
      </button>

      {/* Mood History */}
      <div className="mood-history">
        <h3>Past Mood Logs</h3>
        {logs.length === 0 ? (
          <p>No moods logged yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.moodID} className="mood-log">
              <strong>{log.date}</strong>: {log.emotion} {log.note && `- ${log.note}`}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
