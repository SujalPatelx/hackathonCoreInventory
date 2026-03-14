<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react'

const App = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error: ' + err.message))
  }, [])

  return <div>{message || 'Loading...'}</div>
>>>>>>> 09540f6f6c0b6f1b961d5077a419730073e72814
}

export default App;