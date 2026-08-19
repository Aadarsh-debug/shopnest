import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { IconShield, IconTruck, IconRefresh, IconArrowRight } from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast("Thank you for subscribing to our private editorial journal.", "success", "Subscribed");
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand & Manifesto */}
        <div className="footer-brand">
          <Link to="/" className="brand-logo" style={{ fontSize: "1.45rem" }}>
            ShopNest<span className="dot">.</span>
          </Link>
          <p>
            Curated essentials for calm, modern living. Thoughtfully engineered
            objects produced with ethical materials and honest craftsmanship.
          </p>
          <form onSubmit={handleSubscribe} style={{ marginTop: "1.5rem", display: "flex", gap: "0.4rem" }}>
            <input
              type="email"
              placeholder="Your email for seasonal edits"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ fontSize: "0.82rem", padding: "0.6rem 0.85rem" }}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm" aria-label="Subscribe">
              <IconArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Column 1: Collections */}
        <div className="footer-col">
          <h5>Collections</h5>
          <ul>
            <li><Link to="/products?category=Electronics">Electronics & Audio</Link></li>
            <li><Link to="/products?category=Furniture">Nordic Living & Chairs</Link></li>
            <li><Link to="/products?category=Kitchen">Artisan Kitchenware</Link></li>
            <li><Link to="/products?category=Accessories">Everyday Carry & Leather</Link></li>
            <li><Link to="/products?category=Clothing">Merino & Raw Denim</Link></li>
          </ul>
        </div>

        {/* Column 2: Client Service */}
        <div className="footer-col">
          <h5>Client Service</h5>
          <ul>
            <li><Link to="/orders">Track Purchase Order</Link></li>
            <li><Link to="/cart">Complimentary Shipping</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
            <li><Link to="/profile">Account Preferences</Link></li>
            <li><Link to="/login">Member Portal</Link></li>
          </ul>
        </div>

        {/* Column 3: Guarantees */}
        <div className="footer-col">
          <h5>Our Promises</h5>
          <ul style={{ gap: "0.85rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconTruck size={17} style={{ color: "var(--accent-pine)" }} />
              <span>Zero-Carbon Delivery</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconRefresh size={17} style={{ color: "var(--accent-pine)" }} />
              <span>30-Day Effortless Returns</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconShield size={17} style={{ color: "var(--accent-pine)" }} />
              <span>2-Year Authentic Warranty</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ShopNest Studio Inc. All rights reserved.</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <span style={{ color: "var(--text-muted)" }}>Crafted for intentional everyday life</span>
        </div>
      </div>
    </footer>
  );
}
