import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPassword.css";

function NewPassword() {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully");

    navigate("/login");
  };

  return (
    <div className="newpass-page">

      <div className="newpass-card">

        <h2>Create New Password</h2>
        <p>Please enter and confirm your new password</p>

        <form onSubmit={handleUpdate}>

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">
            Update Password
          </button>

        </form>

      </div>

    </div>
  );
}

export default NewPassword;