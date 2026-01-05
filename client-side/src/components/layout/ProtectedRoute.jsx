// src/components/layout/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute
 * - Blocks access if there is no auth token
 * - Optionally restricts to a specific mode: "user" or "company"
 *
 * Usage:
 * <ProtectedRoute>
 *   <DashboardLayout />
 * </ProtectedRoute>
 *
 * Usage (role/mode restricted):
 * <ProtectedRoute allow={["company"]}>
 *   <MachinesPage />
 * </ProtectedRoute>
 */

function getToken() {
  return localStorage.getItem("token");
}

function getAuthMode() {
  return localStorage.getItem("auth_mode") || "user";
}

export default function ProtectedRoute({ children, allow }) {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    // send the user back to login and remember where they were going
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (Array.isArray(allow) && allow.length > 0) {
    const mode = getAuthMode();
    if (!allow.includes(mode)) {
      // Logged in, but not allowed for this route
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
