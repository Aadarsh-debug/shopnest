import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import RatingStars from "./RatingStars";
import Badge from "./Badge";
import QuickViewModal from "./QuickViewModal";
import { IconHeart, IconEye, IconPlus, IconShoppingBag } from "./Icons";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (!product) return null;

  const isSaved = isInWishlist(product._id);

  return (
    <>
      <article className="card-3d-tilt product-card-root">
        {/* Image Container with 3D Depth layering */}
        <div className="product-card-image-wrap">
          {product.badge && (
            <div className="product-card-badge">
              <Badge variant="earth">{product.badge}</Badge>
            </div>
          )}

          <button
            className={`product-card-wishlist-btn ${isSaved ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            title="Wishlist"
          >
            <IconHeart size={17} filled={isSaved} />
          </button>

          <Link to={`/products/${product._id}`}>
            <img
              src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              className="product-card-img"
              loading="lazy"
            />
          </Link>

          {/* Quick View Button */}
          <button
            className="product-card-quickview-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            aria-label="Quick overview"
          >
            <IconEye size={15} />
            <span>Quick View</span>
          </button>
        </div>

        {/* Product Meta */}
        <div className="product-card-info">
          <span className="product-card-category">{product.category || "Essential"}</span>
          <Link to={`/products/${product._id}`}>
            <h3 className="product-card-title">{product.name}</h3>
          </Link>

          <RatingStars rating={product.ratings || 4.8} numReviews={product.numReviews || 24} />

          <div className="product-card-footer">
            <div className="product-card-price">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </div>

            <button
              className="product-card-add-btn"
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              aria-label={`Add ${product.name} to cart`}
              title="Add to cart"
            >
              <IconPlus size={18} />
            </button>
          </div>
        </div>
      </article>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
