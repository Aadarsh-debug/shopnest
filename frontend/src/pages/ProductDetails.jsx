import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { request } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import RatingStars from "../components/RatingStars";
import Badge from "../components/Badge";
import ProductCard from "../components/ProductCard";
import {
  IconHeart,
  IconPlus,
  IconMinus,
  IconShoppingBag,
  IconTruck,
  IconShield,
  IconRefresh,
  IconArrowLeft,
  IconCheck,
} from "../components/Icons";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'specs' | 'reviews'

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewsList, setReviewsList] = useState([]);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    request(`/products/${id}`)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          // Set initial demo reviews
          setReviewsList([
            {
              author: "Elena Rostova",
              rating: 5,
              date: "3 weeks ago",
              comment: "The precision and material hand-feel are remarkable. Exceeded my highest expectations.",
            },
            {
              author: "Rohan Varma",
              rating: 5,
              date: "1 month ago",
              comment: "Packaging was pristine and arrival was lightning fast. Truly an everyday investment piece.",
            },
          ]);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Fetch related products
    request("/products")
      .then((all) => {
        if (isMounted && all) {
          setRelated(all.filter((p) => p._id !== id).slice(0, 4));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewText) return;
    const newRev = {
      author: reviewAuthor,
      rating: Number(reviewRating),
      date: "Just now",
      comment: reviewText,
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewAuthor("");
    setReviewText("");
    addToast("Your review has been published. Thank you!", "success", "Review Submitted");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 0", color: "var(--text-muted)" }}>
        Loading product details…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-hairline)" }}>
        <h2 style={{ marginBottom: "1rem" }}>Product Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
          The object you are looking for might have been retired or moved.
        </p>
        <Link to="/products" className="btn btn-primary">
          <IconArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);

  return (
    <div>
      {/* Breadcrumbs */}
      <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
        <Link to="/" style={{ color: "var(--text-secondary)" }}>Home</Link>
        <span>/</span>
        <Link to="/products" style={{ color: "var(--text-secondary)" }}>Catalog</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} style={{ color: "var(--text-secondary)" }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "3.5rem", alignItems: "start", marginBottom: "4.5rem" }}>
        {/* Left: 3D Product Visual */}
        <div style={{ position: "relative" }}>
          <div
            className="card-3d-tilt"
            style={{
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-hairline)",
              background: "var(--bg-subtle)",
            }}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: "100%", aspectRatio: "1 / 1.05", objectFit: "cover" }}
            />
            {product.badge && (
              <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                <Badge variant="earth">{product.badge}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Meta & Purchase Actions */}
        <div>
          <div className="eyebrow">{product.category}</div>
          <h1 style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", marginBottom: "0.75rem", lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <RatingStars rating={product.ratings} numReviews={product.numReviews} size={17} />
            <span style={{ color: "var(--border-hairline)" }}>|</span>
            <span style={{ fontSize: "0.8rem", color: "var(--accent-pine)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <IconCheck size={14} />
              <span>Verified In Stock</span>
            </span>
          </div>

          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
            ₹{Number(product.price).toLocaleString("en-IN")}
          </div>

          <p style={{ fontSize: "0.94rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
            {product.description}
          </p>

          {/* Quantity & CTA Buttons */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-sm)", background: "var(--bg-surface)" }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}
                aria-label="Decrease quantity"
              >
                <IconMinus size={15} />
              </button>
              <span style={{ fontWeight: 700, fontSize: "0.95rem", minWidth: "28px", textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}
                aria-label="Increase quantity"
              >
                <IconPlus size={15} />
              </button>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
              disabled={!product.stock}
              onClick={() => addToCart(product, quantity)}
            >
              <IconShoppingBag size={20} />
              <span>Add to Cart — ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
            </button>

            <button
              className="btn btn-secondary btn-icon-only"
              style={{ width: "48px", height: "48px", color: isSaved ? "var(--accent-earth)" : "inherit" }}
              onClick={() => toggleWishlist(product)}
              title={isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
            >
              <IconHeart size={20} filled={isSaved} />
            </button>
          </div>

          {/* Guarantees Box */}
          <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", padding: "1.25rem", display: "grid", gap: "0.85rem", border: "1px solid var(--border-hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconTruck size={17} style={{ color: "var(--accent-pine)" }} />
              <span>Complimentary express delivery across India on orders over ₹999</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconRefresh size={17} style={{ color: "var(--accent-pine)" }} />
              <span>30-Day effortless in-home trial & return policy</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <IconShield size={17} style={{ color: "var(--accent-pine)" }} />
              <span>2-Year manufacturer craftsmanship warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Specifications & Reviews */}
      <div style={{ marginBottom: "5rem" }}>
        <div style={{ display: "flex", gap: "2rem", borderBottom: "1px solid var(--border-hairline)", marginBottom: "2rem" }}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              padding: "0.75rem 0",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: activeTab === "overview" ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeTab === "overview" ? "2px solid var(--text-primary)" : "2px solid transparent",
              position: "relative",
              bottom: "-1px",
            }}
          >
            Design & Details
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            style={{
              padding: "0.75rem 0",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: activeTab === "specs" ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeTab === "specs" ? "2px solid var(--text-primary)" : "2px solid transparent",
              position: "relative",
              bottom: "-1px",
            }}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              padding: "0.75rem 0",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: activeTab === "reviews" ? "var(--text-primary)" : "var(--text-muted)",
              borderBottom: activeTab === "reviews" ? "2px solid var(--text-primary)" : "2px solid transparent",
              position: "relative",
              bottom: "-1px",
            }}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div style={{ maxWidth: "780px", fontSize: "0.94rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
            <p style={{ marginBottom: "1.25rem" }}>
              The {product.name} embodies our philosophy of intentional form and material integrity.
              Each component has been refined through rigorous prototyping to ensure seamless integration into
              your living or workspace environment.
            </p>
            <p>
              Built using responsibly sourced materials, this piece will gracefully patina over time,
              recording the quiet milestones of everyday life.
            </p>
          </div>
        )}

        {/* Tab 2: Specs */}
        {activeTab === "specs" && (
          <div style={{ maxWidth: "640px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "0.85rem 0", fontWeight: 600, color: "var(--text-primary)", width: "35%" }}>Collection</td>
                  <td style={{ padding: "0.85rem 0", color: "var(--text-secondary)" }}>{product.category}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "0.85rem 0", fontWeight: 600, color: "var(--text-primary)" }}>Stock Availability</td>
                  <td style={{ padding: "0.85rem 0", color: "var(--text-secondary)" }}>{product.stock} units ready to dispatch</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "0.85rem 0", fontWeight: 600, color: "var(--text-primary)" }}>Warranty</td>
                  <td style={{ padding: "0.85rem 0", color: "var(--text-secondary)" }}>2-Year Comprehensive</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "0.85rem 0", fontWeight: 600, color: "var(--text-primary)" }}>Origin & Craft</td>
                  <td style={{ padding: "0.85rem 0", color: "var(--text-secondary)" }}>Hand-inspected in ShopNest Studio</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === "reviews" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "3.5rem", alignItems: "start" }}>
            {/* Reviews List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {reviewsList.map((rev, index) => (
                <div key={index} style={{ padding: "1.5rem", background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{rev.author}</div>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{rev.date}</span>
                  </div>
                  <RatingStars rating={rev.rating} showScore={false} size={14} />
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "0.6rem", lineHeight: 1.6 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <form onSubmit={handleAddReview} style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "1.75rem" }}>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>Write a Reflection</h3>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  className="input-field"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Sophia Reynolds"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <select
                  className="input-field"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                >
                  <option value={5}>5 Stars — Exceptional</option>
                  <option value={4}>4 Stars — Very Pleased</option>
                  <option value={3}>3 Stars — Satisfactory</option>
                  <option value={2}>2 Stars — Room for Improvement</option>
                  <option value={1}>1 Star — Disappointed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with the craftsmanship and utility..."
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                <span>Submit Review</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Related Products Recommendations */}
      {related.length > 0 && (
        <section style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "4rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <div className="eyebrow">CURATED COMPANIONS</div>
            <h2>You May Also Appreciate</h2>
          </div>

          <div className="product-grid">
            {related.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
