import React from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge";
import RatingStars from "./RatingStars";
import { IconArrowRight, IconSparkles, IconShield } from "./Icons";

export default function HeroBanner() {
  return (
    <section className="hero-wrapper scene-3d">
      <div className="hero-grid">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="hero-content">
          <div className="eyebrow">
            <IconSparkles size={13} />
            <span>Autumn & Winter 2026 Collection</span>
          </div>

          <h1>
            Considered objects for calm everyday living.
          </h1>

          <p className="hero-subtitle">
            A restrained collection of tactile audio, handcrafted furniture, and honest
            everyday essentials designed to bring enduring warmth into your space.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", alignItems: "center" }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              <span>Explore Collection</span>
              <IconArrowRight size={18} />
            </Link>

            <Link to="/products?category=Electronics" className="btn btn-secondary btn-lg">
              <span>Acoustic Edit</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="hero-stats-row">
            <div className="hero-stat-item">
              <h4>4.9 ★</h4>
              <p>Over 3,200 Verified Reviews</p>
            </div>
            <div className="hero-stat-item">
              <h4>100%</h4>
              <p>Carbon-Neutral Fulfillment</p>
            </div>
            <div className="hero-stat-item">
              <h4>2-Year</h4>
              <p>Complimentary Warranty</p>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Perspective Card Showcase */}
        <div className="hero-3d-visual">
          <div className="hero-card-3d-main">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
              alt="Acoustic Studio ANC Headphones"
            />
            <div style={{ padding: "1.25rem", background: "#ffffff", borderTop: "1px solid var(--border-hairline)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent-earth)", textTransform: "uppercase" }}>Featured Object</span>
                  <h4 style={{ fontSize: "1.05rem", marginTop: "2px" }}>Acoustic Studio ANC</h4>
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>₹18,990</div>
              </div>
            </div>
          </div>

          {/* 3D Floating Interactive Badge */}
          <div className="hero-floating-badge">
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-pine-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-pine)" }}>
              <IconShield size={18} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)" }}>Precision Aluminum</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>38-Hour Battery Life</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
