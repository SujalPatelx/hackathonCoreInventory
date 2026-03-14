import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", {
        email,
        password,
      });
      // Persist basic session info for dashboard UI
      if (res?.data) {
        try {
          localStorage.setItem("ci_name", res.data.name || "");
          localStorage.setItem("ci_role", res.data.role || "");
        } catch {
          // ignore storage errors (private mode, etc.)
        }
      }
      // Redirect or handle login success
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="brand">
            <span className="logo">✱</span>
            <h1>CoreInventory</h1>
          </div>

          <div className="hero">
            <h2>
              Streamline your <br /> warehouse operations.
            </h2>

            <p>
              The modern inventory management system built for growing teams.
              Track shipments, manage stock levels, and optimize your supply
              chain in real-time.
            </p>
          </div>

          <div className="testimonial">
            <div className="stars">★★★★★</div>

            <p>
              “CoreInventory transformed how we handle our global logistics.
              Efficiency is up by 40% since the migration.”
            </p>

            <div className="testimonial-user">
              <div className="avatar"></div>

              <div>
                <strong>Sarah Jenkins</strong>
                <span>OPERATIONS DIRECTOR, GLOBALLOG</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <h2>Welcome back</h2>
          <p className="subtitle">Please enter your details to sign in.</p>

          <form className="login-form" onSubmit={handleLogin}>
            {/* ROLE */}
            <label className="label">Login as</label>

            <div className="role-select">
              <button
                type="button"
                className={`role ${role === "manager" ? "active" : ""}`}
                onClick={() => setRole("manager")}
              >
                Manager
              </button>

              <button
                type="button"
                className={`role ${role === "staff" ? "active" : ""}`}
                onClick={() => setRole("staff")}
              >
                Staff
              </button>
            </div>

            {/* EMAIL */}
            <label className="label">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <div className="password-row">
              <label className="label">Password</label>
              <Link to="/reset-password">Forgot password?</Link>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* REMEMBER */}
            <div className="remember">
              <input type="checkbox" />
              <span>Remember me for 30 days</span>
            </div>

            {/* ERROR MESSAGE */}
            {error && <div className="error-msg">{error}</div>}

            {/* BUTTON */}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="signup">
            Don't have an account? <Link to="/signup">Go to Signup</Link>
          </p>

          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
