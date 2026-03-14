import React, { useState } from "react";
import "./ResetPass.css";

function ResetPass() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset email sent to:", email);
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