import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPass.css";

function ResetPass() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // store OTP temporarily
    localStorage.setItem("resetOTP", otp);

    // demo alert
    alert("Demo OTP: " + otp);

    navigate("/verify-code");
  };

  return (
    <div className="reset-page">

      <div className="reset-card">

        <h2>Reset Password</h2>
        <p>Enter your email to receive a verification code</p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="admin@coreinventory.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Send Verification Code →
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPass;