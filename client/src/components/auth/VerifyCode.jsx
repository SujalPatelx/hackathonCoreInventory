import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Verify.css";

function VerifyCode() {

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {

    const storedOTP = localStorage.getItem("resetOTP");

    if (otp === storedOTP) {
      alert("OTP Verified Successfully");
      navigate("/new-password");
    } else {
      alert("Invalid OTP");
    }

  };

  return (
    <div className="verify-page">

      <div className="verify-card">

        <h2>Verify Code</h2>
        <p>Enter the verification code sent to your email</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify}>
          Verify Code
        </button>

      </div>

    </div>
  );
}

export default VerifyCode;