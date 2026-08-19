import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight, IconSparkles } from "../components/Icons";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-lg)", maxWidth: "580px", margin: "3rem auto" }}>
      <div className="eyebrow" style={{ justifyContent: "center" }}>
        <IconSparkles size={14} />
        <span>PAGE UNCHARTED</span>
      </div>
      <h1 style={{ fontSize: "3.5rem", fontWeight: 700, margin: "0.5rem 0 1rem", color: "var(--text-primary)" }}>
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
        The space or object you sought could not be found. It may have been archived or moved to a new collection.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <Link to="/" className="btn btn-secondary">
          <span>Return Home</span>
        </Link>
        <Link to="/products" className="btn btn-primary">
          <span>Browse Catalog</span>
          <IconArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
