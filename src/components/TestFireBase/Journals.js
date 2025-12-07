// src/pages/FlowerHouse.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getJournalsByUser, getMoodLogsByUser } from "../../firebases/firebaseService";
import "./Journals.css";

export default function FlowerHouse() {
  const { user } = useAuth();
  const [journals, setJournals] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    const journalData = await getJournalsByUser(user.uid);
    const moodData = await getMoodLogsByUser(user.uid);
    setJournals(journalData || []);
    setMoodLogs(moodData || []);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Filter journals by week (simple example: select latest 7 days)
  const latestWeekJournals = journals.filter(journal => {
    if (!selectedWeek) return true; // show all if no week selected
    return new Date(journal.date) >= new Date(selectedWeek);
  });

  return (
    <div className="flower-house-container">
      <h2>Flower House (Journals)</h2>

      <div className="journal-list">
        {latestWeekJournals.length === 0 && <p>No journals found.</p>}
        {latestWeekJournals.map((j) => (
          <div key={j.journalID} className="journal-entry">
            <strong>{j.date}</strong> [{j.emotionTag}]
            <p>{j.content}</p>
          </div>
        ))}
      </div>

      {/* Optional: show mood trend */}
      <div className="mood-trend">
        <h3>Mood Trend</h3>
        {moodLogs.length === 0 && <p>No mood data.</p>}
        {moodLogs.map((m) => (
          <div key={m.moodID}>
            <strong>{m.date}</strong>: {m.emotion}
          </div>
        ))}
      </div>
    </div>
  );
}
