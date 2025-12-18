import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const apiKey = process.env.REACT_APP_API_KEY;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "mindbloommap.firebaseapp.com",
  projectId: "mindbloommap",
  storageBucket: "mindbloommap.firebasestorage.app",
  messagingSenderId: "557294934352",
  appId: "1:557294934352:web:885f85e2397f629f0c7455",
  measurementId: "G-3WK9Y4JD2B"
};

//console.log("MY KEY IS:", process.env.REACT_APP_API_KEY);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
