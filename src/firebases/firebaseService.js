// src/firebases/firebaseService.js
import { ref, set, push, get, update, remove } from "firebase/database";
import { db } from "./firebase";

/* ======================================================
   GENERIC HELPERS
====================================================== */
export async function writeData(path, data) {
  return await set(ref(db, path), data);
}

export async function fetchData(path) {
  const snap = await get(ref(db, path));
  return snap.exists() ? snap.val() : null;
}

export async function updateData(path, data) {
  return await update(ref(db, path), data);
}

export async function deleteData(path) {
  return await remove(ref(db, path));
}

/* ======================================================
   USERS (Users/{userID})
====================================================== */
export async function addUser(userID, data) {
  const userData = {
    userID,
    username: data.username || "",
    password: data.password || "",
    email: data.email || "",
    avatar: data.avatar || "",
  };
  return await set(ref(db, `Users/${userID}`), userData);
}

export async function getUser(userID) {
  return await fetchData(`Users/${userID}`);
}

/* ======================================================
   MOOD LOGS (MoodLogs/{userID}/{moodID})
====================================================== */
export async function addMoodLog(userID, { emotion, date, note }) {
  const newRef = push(ref(db, `MoodLogs/${userID}`));

  const logData = {
    moodID: newRef.key,
    emotion,
    date,
    note: note || "",
  };

  await set(newRef, logData);
  return newRef.key;
}

export async function getMoodLogsByUser(userID) {
  const all = await fetchData(`MoodLogs/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteMoodLog(userID, moodID) {
  return await deleteData(`MoodLogs/${userID}/${moodID}`);
}

/* ======================================================
   JOURNALS (Journals/{userID}/{journalID})
====================================================== */
export async function addJournal(userID, { content, emotionTag, date }) {
  const newRef = push(ref(db, `Journals/${userID}`));

  const journalData = {
    journalID: newRef.key,
    content,
    emotionTag,
    date,
  };

  await set(newRef, journalData);
  return newRef.key;
}

export async function getJournalsByUser(userID) {
  const all = await fetchData(`Journals/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteJournal(userID, journalID) {
  return await deleteData(`Journals/${userID}/${journalID}`);
}

export async function updateJournal(userID, journalID, data) {
  return await update(ref(db, `Journals/${userID}/${journalID}`), data);
}

/* ======================================================
   GARDEN PROGRESS (GardenProgress/{userID}/{plantID})
====================================================== */
export async function addGardenProgress(userID, { stage, lastUpdate }) {
  const newRef = push(ref(db, `GardenProgress/${userID}`));

  const progress = {
    plantID: newRef.key,
    stage,
    lastUpdate,
  };

  await set(newRef, progress);
  return newRef.key;
}

export async function getGardenProgressByUser(userID) {
  const all = await fetchData(`GardenProgress/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteGardenProgress(userID, plantID) {
  return await deleteData(`GardenProgress/${userID}/${plantID}`);
}

/* ======================================================
   ACHIEVEMENTS (Achievements/{userID}/{badgeID})
====================================================== */
export async function addAchievement(userID, { achievementName, dateEarned }) {
  const newRef = push(ref(db, `Achievements/${userID}`));

  const achievement = {
    badgeID: newRef.key,
    achievementName,
    dateEarned,
  };

  await set(newRef, achievement);
  return newRef.key;
}

export async function getAchievementsByUser(userID) {
  const all = await fetchData(`Achievements/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteAchievement(userID, badgeID) {
  return await deleteData(`Achievements/${userID}/${badgeID}`);
}

/* ======================================================
   REPORTS (Reports/{userID}/{reportID})
====================================================== */
export async function addReport(userID, { type, details, date }) {
  const newRef = push(ref(db, `Reports/${userID}`));

  const report = {
    reportID: newRef.key,
    type,
    details,
    date,
  };

  await set(newRef, report);
  return newRef.key;
}

export async function getReportsByUser(userID) {
  const all = await fetchData(`Reports/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteReport(userID, reportID) {
  return await deleteData(`Reports/${userID}/${reportID}`);
}

/* ======================================================
   CHAT MESSAGES (ChatMessages/{userID}/{messageID})
====================================================== */
export async function addChatMessage(userID, { message, sender, timestamp }) {
  const newRef = push(ref(db, `ChatMessages/${userID}`));

  const chatMessage = {
    messageID: newRef.key,
    message,
    sender, // "user" or "ai"
    timestamp,
  };

  await set(newRef, chatMessage);
  return newRef.key;
}

export async function getChatHistory(userID) {
  const all = await fetchData(`ChatMessages/${userID}`);
  if (!all) return [];
  
  // Convert object to array and sort by timestamp
  const messagesArray = Object.values(all);
  return messagesArray.sort((a, b) => a.timestamp - b.timestamp);
}

