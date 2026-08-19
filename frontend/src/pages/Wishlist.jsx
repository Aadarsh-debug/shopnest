import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { IconHeart, IconShoppingBag, IconTrash, IconArrowRight } from "../components/Icons";

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((product) => {
      addToCart(product, 1);
    });
  };

  if (!wishlist.length) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-lg)", maxWidth: "600px", margin: "2rem auto" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--bg-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          <IconHeart size={28} />
        </div>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>Your Wishlist is Empty</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Save your favorite objects while exploring our seasonal collections.
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
        <div className="eyebrow">SAVED CURATION</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
          <div>
            <h1>Saved Objects ({wishlist.length})</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Personal edit saved for future considerations
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={clearWishlist} className="btn btn-secondary btn-sm" style={{ color: "var(--text-muted)" }}>
              <IconTrash size={15} />
              <span>Clear List</span>
            </button>
            <button onClick={handleAddAllToCart} className="btn btn-primary btn-sm">
              <IconShoppingBag size={15} />
              <span>Move All to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
