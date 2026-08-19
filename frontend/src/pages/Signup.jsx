import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";
import { useToast } from "../context/ToastContext";
import { IconArrowRight } from "../components/Icons";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      login(data);
      addToast("Your account has been created. Welcome to ShopNest!", "success", "Welcome");
      navigate("/products");
    } catch (err) {
      setError(err.message || "Could not register account. Please try again.");
      addToast(err.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "440px", margin: "3rem auto", padding: "0 1rem" }}>
      <div className="card-3d-depth" style={{ padding: "2.5rem 2rem", background: "var(--bg-surface)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="eyebrow">JOIN SHOPNEST</div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>Create Your Account</h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Join our community of intentional patrons and enjoy member privileges.
          </p>
        </div>

        {error && (
          <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.82rem", border: "1px solid #f3d4ca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sophia Reynolds"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophia@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              minLength={6}
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: "1rem" }}
          >
            <span>{loading ? "Creating Account…" : "Join Community"}</span>
            <IconArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-hairline)", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          Already a member?{" "}
          <Link to="/login" style={{ color: "var(--accent-earth)", fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
