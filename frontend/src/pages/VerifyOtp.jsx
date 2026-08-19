import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { request } from "../services/api";
import { useToast } from "../context/ToastContext";
import { IconShield, IconArrowRight } from "../components/Icons";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await request("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: email || initialEmail, otp }),
      });

      login({ ...data.user, token: data.token });
      addToast("Account verified successfully! Welcome to ShopNest.", "success", "Verified");
      navigate("/products");
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
      addToast(err.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "440px", margin: "3rem auto", padding: "0 1rem" }}>
      <div className="card-3d-depth" style={{ padding: "2.5rem 2rem", background: "var(--bg-surface)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="eyebrow">
            <IconShield size={14} />
            <span>SECURITY VERIFICATION</span>
          </div>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>Verify Account</h1>
          <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
            Enter the 6-digit one-time code sent to your registered email address.
          </p>
        </div>

        {error && (
          <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.82rem", border: "1px solid #f3d4ca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!initialEmail && (
            <div className="form-group">
              <label className="form-label">Account Email</label>
              <input
                type="email"
                required
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sophia@example.com"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">6-Digit Code</label>
            <input
              type="text"
              required
              maxLength={6}
              className="input-field"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              style={{ letterSpacing: "0.25em", textAlign: "center", fontSize: "1.2rem", fontWeight: 700 }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: "1rem" }}
          >
            <span>{loading ? "Verifying…" : "Confirm Code"}</span>
            <IconArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-hairline)", fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          <Link to="/login" style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
