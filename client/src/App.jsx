// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";

// employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MarkAttendance from "./pages/employee/MarkAttendance";
import AttendanceHistory from "./pages/employee/AttendanceHistory";
import MonthlySummary from "./pages/employee/MonthlySummary";

// manager pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeesAttendance from "./pages/manager/EmployeesAttendance";
import TeamSummary from "./pages/manager/TeamSummary";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Redirect root to employee dashboard */}
        <Route path="/" element={<Navigate to="/employee" replace />} />

        {/* Employee routes (protected) */}
        <Route
          path="/employee/EmployeeDashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/AttendanceHistory"
          element={
            <ProtectedRoute>
              <AttendanceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/MonthlySummary"
          element={
            <ProtectedRoute>
              <MonthlySummary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/MarkAttendance"
          element={
            <ProtectedRoute>
              <MarkAttendance />
            </ProtectedRoute>
          }
        />

        {/* Manager routes (protected + role check) */}
        <Route
          path="/manager/ManagerDashboard"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/EmployeeAttendance"
          element={
            <ProtectedRoute role="manager">
              <EmployeesAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/TeamSummary"
          element={
            <ProtectedRoute role="manager">
              <TeamSummary />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
