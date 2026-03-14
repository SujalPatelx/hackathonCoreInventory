import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import ResetPass from "./components/auth/ResetPass.jsx";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Default Page */}
        <Route path="/" element={<Login />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Reset page*/}
        <Route path="/reset-password" element={<ResetPass />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;