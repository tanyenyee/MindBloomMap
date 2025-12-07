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
   USERS (Users/{uid})
====================================================== */

export async function addUser(userID, data) {
  return await set(ref(db, `Users/${userID}`), data);
}

export async function getUser(userID) {
  return await fetchData(`Users/${userID}`);
}

/* ======================================================
   MOOD LOGS  (MoodLogs/{uid}/{moodID})
====================================================== */

// Add a new mood log
export async function addMoodLog({ userID, emotion, date, note }) {
  if (!userID) throw new Error("User ID is required");

  const newRef = push(ref(db, "MoodLogs"));
  
  const logData = {
    moodID: newRef.key,
    userID,
    emotion,
    date,
    note: note || "",
  };

  await set(newRef, logData);
  return newRef.key;
}

// Get mood logs by user
export async function getMoodLogsByUser(userID) {
  const snapshot = await get(ref(db, "MoodLogs"));
  const data = snapshot.val() || {};
  return Object.values(data).filter((log) => log.userID === userID);
}

// Delete a mood log by moodID
export async function deleteMoodLog(moodID) {
  if (!moodID) throw new Error("Mood ID is required");
  await remove(ref(db, `MoodLogs/${moodID}`));
}

/* ======================================================
   JOURNALS (Journals/{uid}/{journalID})
====================================================== */

export async function addJournal(userID, data) {
  const newRef = push(ref(db, `Journals/${userID}`));
  await set(newRef, {
    journalID: newRef.key,
    userID,
    ...data
  });
  return newRef.key;
}

export async function getJournalsByUser(userID) {
  const all = await fetchData(`Journals/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteJournal(userID, journalID) {
  return await deleteData(`Journals/${userID}/${journalID}`);
}

/* ======================================================
   GARDEN PROGRESS (Garden/{uid}/{plantID})
====================================================== */

export async function addGardenProgress(userID, data) {
  const newRef = push(ref(db, `Garden/${userID}`));
  await set(newRef, {
    plantID: newRef.key,
    userID,
    ...data
  });
  return newRef.key;
}

export async function getGardenProgressByUser(userID) {
  const all = await fetchData(`Garden/${userID}`);
  return all ? Object.values(all) : [];
}

export async function deleteGardenProgress(userID, plantID) {
  return await deleteData(`Garden/${userID}/${plantID}`);
}

/* ======================================================
   ACHIEVEMENTS (Achievements/{uid}/{badgeID})
====================================================== */

export async function addAchievement(userID, data) {
  const newRef = push(ref(db, `Achievements/${userID}`));
  await set(newRef, {
    badgeID: newRef.key,
    userID,
    ...data
  });
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
   REPORTS (Reports/{uid}/{reportID})
====================================================== */

export async function addReport(userID, data) {
  const newRef = push(ref(db, `Reports/${userID}`));
  await set(newRef, {
    reportID: newRef.key,
    userID,
    ...data
  });
  return newRef.key;
}

export async function getReportsByUser(userID) {
  const reports = await fetchData(`Reports/${userID}`);
  return reports ? Object.values(reports) : [];
}

export async function deleteReport(userID, reportID) {
  return await deleteData(`Reports/${userID}/${reportID}`);
}
