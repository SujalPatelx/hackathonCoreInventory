import React, { useState } from "react";
import "./Signup.css";

const Signup = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Manager",
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("You must agree to Terms and Privacy Policy");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Account Created Successfully!");
    console.log(formData);
  };

  const goToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="signup-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">📦</span>
          CoreInventory
        </div>

        <button className="signin-btn" onClick={goToLogin}>
          Sign In
        </button>
      </nav>

      {/* FORM CARD */}
      <div className="signup-card">

        <h2>Create your account</h2>
        <p className="subtitle">
          Join CoreInventory to manage your assets efficiently
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="password-row">

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option>Manager</option>
            <option>Staff</option>
          </select>

          <div className="terms">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <span>
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </span>
          </div>

          <button className="create-btn" type="submit">
            Create Account
          </button>

        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={goToLogin}>
            Sign In
          </span>
        </p>

      </div>

      <div className="footer">
        <span>🔒 Secure Data</span>
        <span>☁ Cloud Sync</span>
      </div>

    </div>
  );
};

export default Signup;