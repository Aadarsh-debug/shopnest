import React from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { IconSparkles, IconArrowRight, IconTag } from "./Icons";

export default function PromoBanner() {
  const { addToast } = useToast();

  const copyCode = () => {
    navigator.clipboard?.writeText("NEST20");
    addToast("Promotional code 'NEST20' copied to clipboard!", "success", "Coupon Copied");
  };

  return (
    <section
      style={{
        background: "var(--bg-dark)",
        color: "var(--text-inverse)",
        borderRadius: "var(--radius-lg)",
        padding: "clamp(2rem, 4vw, 3.5rem)",
        margin: "0 0 4.5rem",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: "2.5rem",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(184, 89, 59, 0.2)", color: "#f08968", padding: "0.25rem 0.65rem", borderRadius: "var(--radius-full)", fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1rem" }}>
          <IconTag size={13} />
          <span>Member Special Offer</span>
        </div>

        <h2 style={{ color: "#ffffff", fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", marginBottom: "0.85rem" }}>
          Elevate your daily ritual with 20% off.
        </h2>

        <p style={{ color: "var(--text-inverse-muted)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "480px", marginBottom: "1.75rem" }}>
          Apply promo code <strong style={{ color: "#fff" }}>NEST20</strong> at checkout to receive 20% off entire audio, desk accessories, and living furniture edits.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          <button onClick={copyCode} className="btn btn-accent">
            <span>Copy Code: NEST20</span>
          </button>
          <Link to="/products" className="btn btn-secondary" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255, 255, 255, 0.2)" }}>
            <span>Shop The Edit</span>
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <img
          src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"
          alt="Solid Walnut Standing Desk"
          style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.15)", transform: "perspective(800px) rotateY(-6deg)" }}
        />
      </div>
    </section>
  );
}
