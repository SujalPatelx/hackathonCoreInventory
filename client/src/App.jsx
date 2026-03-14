import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import ResetPass from "./components/auth/ResetPass.jsx";
import NewPassword from "./components/auth/NewPassword";
import VerifyCode from "./components/auth/VerifyCode";
import CoreInventoryDashboard from "./components/ManagerDash/CoreInventoryDashboard.jsx";

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
        <Route path="/dashboard" element={<CoreInventoryDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
