import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import RatingStars from "./RatingStars";
import Badge from "./Badge";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { IconHeart, IconPlus, IconMinus, IconShoppingBag, IconCheck } from "./Icons";

export default function QuickViewModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const isSaved = isInWishlist(product._id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Overview" maxWidth="760px">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "2rem", alignItems: "start" }}>
        {/* Product Image & Badge */}
        <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-subtle)" }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", aspectRatio: "1 / 1.1", objectFit: "cover" }}
          />
          {product.badge && (
            <div style={{ position: "absolute", top: "10px", left: "10px" }}>
              <Badge variant="earth">{product.badge}</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.25rem" }}>{product.category}</div>
          <h2 style={{ fontSize: "1.45rem", marginBottom: "0.5rem" }}>{product.name}</h2>
          <RatingStars rating={product.ratings} numReviews={product.numReviews} />

          <div style={{ fontSize: "1.5rem", fontWeight: 700, margin: "1rem 0 0.8rem", color: "var(--text-primary)" }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", marginBottom: "1.5rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: product.stock > 0 ? "#4aa772" : "#d9534f" }}></span>
            <span style={{ fontWeight: 600, color: product.stock > 0 ? "var(--text-primary)" : "#d9534f" }}>
              {product.stock > 0 ? `${product.stock} units available in stock` : "Temporarily Sold Out"}
            </span>
          </div>

          {/* Quantity and Actions */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)" }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "0.6rem 0.85rem", color: "var(--text-secondary)" }}
                aria-label="Decrease quantity"
              >
                <IconMinus size={14} />
              </button>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", minWidth: "24px", textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                style={{ padding: "0.6rem 0.85rem", color: "var(--text-secondary)" }}
                aria-label="Increase quantity"
              >
                <IconPlus size={14} />
              </button>
            </div>

            <button
              className="btn btn-primary btn-full"
              disabled={!product.stock}
              onClick={handleAddToCart}
            >
              <IconShoppingBag size={18} />
              <span>Add to Cart — ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
            </button>

            <button
              className="btn btn-secondary btn-icon-only"
              onClick={() => toggleWishlist(product)}
              title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
              style={{ color: isSaved ? "var(--accent-earth)" : "inherit" }}
            >
              <IconHeart size={18} filled={isSaved} />
            </button>
          </div>

          <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "1rem" }}>
            <Link
              to={`/products/${product._id}`}
              onClick={onClose}
              style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", textDecoration: "underline" }}
            >
              View Full Product Specifications & Details →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
