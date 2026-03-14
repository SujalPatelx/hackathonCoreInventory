import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import ResetPass from "./components/auth/ResetPass.jsx";
import NewPassword from "./components/auth/NewPassword";
import VerifyCode from "./components/auth/VerifyCode";
import CoreInventoryDashboard from "./components/ManagerDash/CoreInventoryDashboard.jsx";
import StaffDashboard from "./components/ManagerDash/StaffDashboard.jsx";

function RoleDashboard() {
  let role = "";
  try {
    role = localStorage.getItem("ci_role") || "";
  } catch {
    role = "";
  }

  return role === "staff" ? <StaffDashboard /> : <CoreInventoryDashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/dashboard" element={<RoleDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
