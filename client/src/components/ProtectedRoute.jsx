// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Usage:
 * <ProtectedRoute> ... </ProtectedRoute>               // any authenticated user
 * <ProtectedRoute role="manager"> ... </ProtectedRoute> // only manager
 */
function getUserFromStorageOrToken() {
  try {
    const userJson = localStorage.getItem("user");
    if (userJson) return JSON.parse(userJson);

    const token = localStorage.getItem("token");
    if (!token) return null;

    // try decode JWT payload to extract role (if token is JWT)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub ?? payload.id,
        role: payload.role ?? payload?.roles?.[0],
        name: payload.name ?? payload.username,
      };
    } catch {
      return null;
    }
  } catch (err) {
    return null;
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // not authenticated
    return <Navigate to="/login" replace />;
  }

  // if role isn't requested, token presence is enough
  if (!role) return children;

  // role check: try user object or decode token
  const user = getUserFromStorageOrToken();
  if (!user) {
    // cannot determine role -> block access
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // not authorized for this role
    return <Navigate to="/login" replace />;
  }

  return children;
}
