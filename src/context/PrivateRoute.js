import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
  // Use 'currentUser' to match your AuthContext.js
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 

  // Redirect to login if currentUser is null
  return currentUser ? children : <Navigate to="/login" replace />;
}