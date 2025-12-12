// src/firebases/authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user; // ✅ FIX: return only the user object
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user; // also return user for consistency
}

export async function logoutUser() {
  return await signOut(auth);
}
