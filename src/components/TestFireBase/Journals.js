// src/pages/FlowerHouse.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getJournalsByUser,
  addJournal,
  deleteJournal,
  updateData,
} from "../../firebases/firebaseService";
import "./Journals.css";

export default function FlowerHouse() {
  const { user, loading } = useAuth();
  const [journals, setJournals] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [content, setContent] = useState("");
  const [emotionTag, setEmotionTag] = useState("");

  // Fetch journals
  useEffect(() => {
    const fetchJournals = async () => {
      if (!user) return;
      try {
        const data = await getJournalsByUser(user.uid);
        setJournals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setJournals([]);
      }
    };
    fetchJournals();
  }, [user]);

  // Filter journals by selected week
  const filteredJournals = journals.filter((journal) => {
    if (!selectedWeek) return true;
    return new Date(journal.date) >= new Date(selectedWeek);
  });

  // Add or Edit Journal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emotionTag || !content.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editJournal) {
        // Update journal using updateData helper
        await updateData(`Journals/${user.uid}/${editJournal.journalID}`, {
          content,
          emotionTag,
          date: new Date().toISOString(),
        });
        setEditJournal(null);
      } else {
        await addJournal(user.uid, {
          content,
          emotionTag,
          date: new Date().toISOString(),
        });
      }
      setContent("");
      setEmotionTag("");
      setShowForm(false);

      // Refresh journals
      const data = await getJournalsByUser(user.uid);
      setJournals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert("Error saving journal");
    }
  };

  // Edit journal
  const handleEdit = (journal) => {
    setEditJournal(journal);
    setContent(journal.content);
    setEmotionTag(journal.emotionTag);
    setShowForm(true);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditJournal(null);
    setContent("");
    setEmotionTag("");
    setShowForm(false);
  };

  // Delete journal
  const handleDelete = async (journalID) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        await deleteJournal(user.uid, journalID);
        const data = await getJournalsByUser(user.uid);
        setJournals(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        alert("Failed to delete journal");
      }
    }
  };

  if (loading) return <div className="flower-house-container">Loading...</div>;

  return (
    <div className="flower-house-container">
      <h2>Flower House (Journals)</h2>

      {/* Weekly / Monthly Filter */}
      <div className="journal-filter">
        <label>Show journals from: </label>
        <input
          type="date"
          value={selectedWeek || ""}
          onChange={(e) => setSelectedWeek(e.target.value)}
        />
        <button onClick={() => setSelectedWeek(null)}>Reset</button>
      </div>

      {/* Add Journal Button */}
      <button
        className="journal-add-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : editJournal ? "Edit Journal" : "Add Journal"}
      </button>

      {/* Journal Form */}
      {showForm && (
        <div className="journal-card">
          <form onSubmit={handleSubmit}>
            <label>Emotion Tag</label>
            <select
              value={emotionTag}
              onChange={(e) => setEmotionTag(e.target.value)}
            >
              <option value="">Select Emotion</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="angry">😡 Angry</option>
              <option value="calm">😌 Calm</option>
              <option value="stressed">😖 Stressed</option>
            </select>

            <label>Journal Content</label>
            <textarea
              placeholder="Write your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">
                {editJournal ? "Save Changes" : "Add Journal"}
              </button>
              {editJournal && (
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Journal List */}
      <div className="journal-list">
        {filteredJournals.length === 0 ? (
          <p>No journals found.</p>
        ) : (
          filteredJournals.map((j) => (
            <div key={j.journalID} className="journal-entry">
              <strong>{j.date?.split("T")[0]}</strong> [{j.emotionTag}]
              <p>{j.content}</p>
              <div className="journal-actions">
                <button onClick={() => handleEdit(j)}>Edit</button>
                <button onClick={() => handleDelete(j.journalID)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Animated flowers */}
      <div className="flower-animation">
        {journals.map((_, idx) => (
          <span key={idx} className="flower">🌸</span>
        ))}
      </div>
    </div>
  );
}
