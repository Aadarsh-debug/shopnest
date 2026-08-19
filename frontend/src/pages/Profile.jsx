import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Badge from "../components/Badge";
import {
  IconUser,
  IconPackage,
  IconHeart,
  IconShoppingBag,
  IconLayoutDashboard,
  IconLogOut,
  IconShield,
} from "../components/Icons";

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { wishlistCount } = useWishlist();

  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow">MEMBER PROFILE</div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1>Account Sanctuary</h1>
          {isAdmin && <Badge variant="earth">Administrator</Badge>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "3rem", alignItems: "start" }}>
        {/* Left Column: Account Card */}
        <div className="card-3d-depth" style={{ padding: "2rem", background: "var(--bg-surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--bg-dark)", color: "var(--text-inverse)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem" }}>{user.name}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{user.email}</p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Role:</span>
              <span style={{ fontWeight: 600, textTransform: "capitalize" }}>{user.role || "Patron"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Membership:</span>
              <span style={{ fontWeight: 600, color: "var(--accent-pine)" }}>Active Verified</span>
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {isAdmin && (
              <Link to="/admin" className="btn btn-accent btn-full" style={{ marginBottom: "0.5rem" }}>
                <IconLayoutDashboard size={16} />
                <span>Open Admin Dashboard</span>
              </Link>
            )}
            <button onClick={logout} className="btn btn-secondary btn-full">
              <IconLogOut size={16} />
              <span>Sign Out Safely</span>
            </button>
          </div>
        </div>

        {/* Right Column: Metric Cards & Shortcuts */}
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
            <Link to="/orders" className="card-3d-depth" style={{ padding: "1.5rem", background: "var(--bg-surface)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <IconPackage size={22} style={{ color: "var(--accent-pine)" }} />
              <div style={{ fontSize: "1.45rem", fontWeight: 700 }}>Orders</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Track active shipments</div>
            </Link>

            <Link to="/wishlist" className="card-3d-depth" style={{ padding: "1.5rem", background: "var(--bg-surface)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <IconHeart size={22} style={{ color: "var(--accent-earth)" }} />
              <div style={{ fontSize: "1.45rem", fontWeight: 700 }}>{wishlistCount} Saved</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Review wishlist</div>
            </Link>

            <Link to="/cart" className="card-3d-depth" style={{ padding: "1.5rem", background: "var(--bg-surface)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <IconShoppingBag size={22} style={{ color: "var(--text-primary)" }} />
              <div style={{ fontSize: "1.45rem", fontWeight: 700 }}>{count} in Bag</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Ready for checkout</div>
            </Link>
          </div>

          {/* Membership Benefits Box */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconShield size={18} style={{ color: "var(--accent-pine)" }} />
              <span>ShopNest Member Privileges</span>
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <li>✓ Early preview access to limited seasonal artisan drops</li>
              <li>✓ 20% privilege promo code available on all orders (use <strong style={{ color: "var(--text-primary)" }}>NEST20</strong>)</li>
              <li>✓ Dedicated concierge dispatch priority on order preparation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
