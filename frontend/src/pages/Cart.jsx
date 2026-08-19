import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { IconTrash, IconPlus, IconMinus, IconArrowRight, IconShoppingBag, IconTag, IconTruck, IconX } from "../components/Icons";

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingFee,
    freeShippingThreshold,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    applyCoupon(couponInput);
    setCouponInput("");
  };

  // Free shipping progress
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!items.length) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-lg)", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--bg-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <IconShoppingBag size={28} />
        </div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>Your Bag is Empty</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Discover our curated collection of acoustic audio, solid oak furniture, and intentional home objects.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          <span>Explore Catalog</span>
          <IconArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div className="eyebrow">ORDER REVIEW</div>
        <h1>Your Shopping Bag</h1>
      </div>

      {/* Free Shipping Progress Meter */}
      <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", padding: "1.25rem 1.5rem", marginBottom: "2.5rem", border: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem", fontSize: "0.86rem", fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconTruck size={18} style={{ color: "var(--accent-pine)" }} />
            <span>
              {amountToFreeShipping === 0
                ? "Congratulations! You have unlocked Free Carbon-Neutral Delivery."
                : `Add ₹${amountToFreeShipping.toLocaleString("en-IN")} more to qualify for Free Delivery.`}
            </span>
          </div>
          <span style={{ color: "var(--accent-pine)" }}>{Math.round(freeShippingProgress)}%</span>
        </div>
        <div style={{ height: "6px", width: "100%", background: "var(--border-hairline)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${freeShippingProgress}%`,
              background: "var(--accent-pine)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Cart Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.85fr", gap: "3rem", alignItems: "start" }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map((item) => (
            <article
              key={item._id}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr auto",
                gap: "1.5rem",
                padding: "1.5rem",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                borderRadius: "var(--radius-md)",
                alignItems: "center",
              }}
            >
              {/* Image */}
              <Link to={`/products/${item._id}`}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)" }}
                />
              </Link>

              {/* Title, Category & Quantity */}
              <div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {item.category}
                </span>
                <Link to={`/products/${item._id}`}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0.2rem 0 0.5rem" }}>
                    {item.name}
                  </h3>
                </Link>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </div>

                {/* Quantity Controls */}
                <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-sm)" }}>
                  <button
                    onClick={() => updateQuantity(item._id, item.qty - 1)}
                    style={{ padding: "0.35rem 0.65rem", color: "var(--text-secondary)" }}
                    aria-label="Decrease"
                  >
                    <IconMinus size={13} />
                  </button>
                  <span style={{ fontWeight: 700, fontSize: "0.85rem", minWidth: "24px", textAlign: "center" }}>
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.qty + 1)}
                    style={{ padding: "0.35rem 0.65rem", color: "var(--text-secondary)" }}
                    aria-label="Increase"
                  >
                    <IconPlus size={13} />
                  </button>
                </div>
              </div>

              {/* Right: Subtotal & Delete */}
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{ color: "var(--text-muted)", padding: "4px" }}
                  aria-label="Remove item"
                  title="Remove"
                >
                  <IconTrash size={17} />
                </button>

                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "auto" }}>
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </div>
              </div>
            </article>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
            <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              <span>← Continue Browsing Collection</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.35rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-hairline)", paddingBottom: "0.85rem" }}>
            Order Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.88rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {coupon && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-earth)" }}>
                <span>Coupon ({coupon.code} - {coupon.discountPercent}%)</span>
                <span style={{ fontWeight: 600 }}>−₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Delivery Courier</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? "var(--accent-pine)" : "inherit" }}>
                {shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border-hairline)", margin: "0.5rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
              <span>Total Due</span>
              <span>₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Coupon Code Input */}
          <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-hairline)" }}>
            {coupon ? (
              <div style={{ background: "#fcf1ed", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f3d4ca" }}>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--accent-earth)" }}>{coupon.code} Applied</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>{coupon.description}</div>
                </div>
                <button onClick={removeCoupon} style={{ color: "var(--accent-earth)", padding: "4px" }} aria-label="Remove coupon">
                  <IconX size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="text"
                  placeholder="Promo code (e.g. NEST20)"
                  className="input-field"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  style={{ textTransform: "uppercase", fontSize: "0.82rem" }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </form>
            )}
          </div>

          <button
            onClick={() => navigate(user ? "/checkout" : "/login?redirect=checkout")}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: "1.75rem" }}
          >
            <span>Proceed to Secure Checkout</span>
            <IconArrowRight size={18} />
          </button>
        </aside>
      </div>
    </div>
  );
}
