// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [intent, setIntent] = useState(null);
  const navigate = useNavigate();

  // login and then navigate to either employee or manager area
  async function handleLoginAs(targetRole) {
    if (loading) return;
    setError(null);
    setIntent(targetRole);
    setLoading(true);

    try {
      // authService.login should call your backend API
      const res = await authService.login({ email, password });
      // normalize possible shapes: res, res.data, res.data.data etc.
      const payload = res?.data ?? res;
      if (!payload) throw new Error("Invalid server response");

      // common token field names
      const token = payload.token ?? payload.accessToken ?? payload.data?.token;
      // common user field names
      const user = payload.user ?? payload.data?.user ?? payload;

      if (!token) {
        throw new Error("No token returned from server");
      }

      // store token + user for ProtectedRoute & other components
      localStorage.setItem("token", token);
      // if server returned a user object use it; otherwise create a minimal user fallback
      const userToStore = (user && typeof user === "object")
        ? user
        : { email, role: targetRole === "manager" ? "manager" : "employee" };

      localStorage.setItem("user", JSON.stringify(userToStore));

      // determine the route to go to
      // prefer the server-provided role if present, else use the clicked intent
      const actualRole = userToStore.role ?? (targetRole === "manager" ? "manager" : "employee");
      const route = actualRole === "manager" ? "/manager" : "/employee";

      navigate(route, { replace: true });
    } catch (err) {
      console.error("login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
      setIntent(null);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Attendance System</h2>
        <p className="muted">Sign in to continue</p>

        <form onSubmit={(e) => e.preventDefault()} className="auth-form">
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>

          {error && <div className="error" style={{ marginBottom: 8 }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="button" className="btn" onClick={() => handleLoginAs("employee")} disabled={loading}>
              {loading && intent === "employee" ? "Signing in..." : "Employee Sign In"}
            </button>

            <button type="button" className="btn" onClick={() => handleLoginAs("manager")} disabled={loading}>
              {loading && intent === "manager" ? "Signing in..." : "Manager Sign In"}
            </button>
          </div>
        </form>

        <div className="small" style={{ marginTop: 12 }}>
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
}
