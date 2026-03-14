import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import ResetPass from "./components/auth/ResetPass.jsx";
import NewPassword from "./components/auth/NewPassword";
import VerifyCode from "./components/auth/VerifyCode";
import ManagerDashboard from "./components/ManagerDash/ManagerDash.jsx";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/reset-password" element={<ResetPass />} />

        <Route path="/verify-code" element={<VerifyCode />} />

        <Route path="/new-password" element={<NewPassword />} />
        //dashboard
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />

    
    
      </Routes>

    </BrowserRouter>
  );
}

export default App;