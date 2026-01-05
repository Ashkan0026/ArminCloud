import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Pages (public)
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterUserPage from "../pages/RegisterUserPage";
import RegisterCompanyPage from "../pages/RegisterCompanyPage";

// Pages (protected)
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import MachinesPage from "../pages/dashboard/MachinesPage";
import ProfilePage from "../pages/dashboard/ProfilePage";

// --- Simple auth helpers (replace later with your auth store/context) ---
function getToken() {
  return localStorage.getItem("token");
}

function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  // Public routes
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register/user", element: <RegisterUserPage /> },
  { path: "/register/company", element: <RegisterCompanyPage /> },

  // Protected routes (dashboard)
  {
  path: "/dashboard",
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="machines" replace /> },
    { path: "machines", element: <MachinesPage /> },
    { path: "profile", element: <ProfilePage /> },
  ]
},

  // Fallback
  { path: "*", element: <Navigate to="/" replace /> },
]);
