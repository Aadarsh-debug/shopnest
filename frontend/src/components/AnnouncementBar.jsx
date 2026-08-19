import React from "react";
import { Link } from "react-router-dom";
import { IconSparkles } from "./Icons";

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <IconSparkles size={14} style={{ color: "var(--accent-earth)" }} />
        <span>Complimentary carbon-neutral delivery on all orders over ₹999</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="pill">CODE: NEST20</span>
        <span style={{ color: "var(--text-inverse-muted)" }}>20% off your edit</span>
        <Link to="/products" style={{ textDecoration: "underline", color: "var(--text-inverse)", fontWeight: 600, fontSize: "0.75rem" }}>
          Shop Collection →
        </Link>
      </div>
    </div>
  );
}
