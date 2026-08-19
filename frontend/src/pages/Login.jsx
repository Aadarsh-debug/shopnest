import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";
import { useToast } from "../context/ToastContext";
import { IconArrowRight, IconSparkles } from "../components/Icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, demoLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || location.state?.from?.pathname || "/products";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
      addToast(err.message || "Sign in failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === "admin") {
      setEmail("admin@shopnest.com");
      setPassword("password123");
    } else {
      setEmail("demo@shopnest.com");
      setPassword("password123");
    }
  };

  return (
    <div style={{ maxWidth: "440px", margin: "3rem auto", padding: "0 1rem" }}>
      <div className="card-3d-depth" style={{ padding: "2.5rem 2rem", background: "var(--bg-surface)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="eyebrow">WELCOME BACK</div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>Sign In to ShopNest</h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Access your orders, saved curation, and private member edits.
          </p>
        </div>

        {/* 1-Click Demo Login Helper Box */}
        <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "1.5rem", border: "1px solid var(--border-hairline)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.6rem" }}>
            <IconSparkles size={14} style={{ color: "var(--accent-earth)" }} />
            <span>Instant Demo Quick-Fill</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleQuickFill("user")}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.74rem", padding: "0.4rem" }}
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.74rem", padding: "0.4rem" }}
            >
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.82rem", border: "1px solid #f3d4ca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. demo@shopnest.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: "1rem" }}
          >
            <span>{loading ? "Authenticating…" : "Sign In"}</span>
            <IconArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-hairline)", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          New to ShopNest?{" "}
          <Link to="/signup" style={{ color: "var(--accent-earth)", fontWeight: 700 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
