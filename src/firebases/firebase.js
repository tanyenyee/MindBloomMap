import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Use process.env for Create React App (CRA) instead of import.meta.env
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

// Validate that API key exists
if (!apiKey) {
  console.error(
    "❌ Firebase API Key is missing! Check your .env file and ensure REACT_APP_FIREBASE_API_KEY is set."
  );
}

const firebaseConfig = {
  apiKey: apiKey || "MISSING_API_KEY", // Fallback to prevent crashes
  authDomain: "mindbloommap.firebaseapp.com",
  projectId: "mindbloommap",
  storageBucket: "mindbloommap.firebasestorage.app",
  messagingSenderId: "557294934352",
  appId: "1:557294934352:web:885f85e2397f629f0c7455",
  measurementId: "G-3WK9Y4JD2B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
