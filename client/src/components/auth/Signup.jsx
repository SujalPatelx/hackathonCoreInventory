import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Manager",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!formData.agree) {
      setError("You must agree to Terms and Privacy Policy");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:5000/api/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
      });
      setSuccess("Account Created Successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Manager",
        agree: false,
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
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

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          <button className="create-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
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
