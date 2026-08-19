import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { IconArrowRight } from "./Icons";

export default function FeaturedCollection({ products = [] }) {
  const [activeTab, setActiveTab] = useState("curated");

  const filterProducts = () => {
    if (!products.length) return [];
    if (activeTab === "new") {
      return [...products].reverse().slice(0, 8);
    }
    if (activeTab === "bestseller") {
      return [...products].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 8);
    }
    // curated
    return products.slice(0, 8);
  };

  const displayed = filterProducts();

  return (
    <section style={{ marginBottom: "4.5rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", gap: "1rem" }}>
        <div>
          <div className="eyebrow">CURATED SELECTION</div>
          <h2>Seasonal Spotlight</h2>
        </div>

        {/* Tab Filters */}
        <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-subtle)", padding: "0.3rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border-hairline)" }}>
          <button
            className={`btn btn-sm ${activeTab === "curated" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)", border: "none" }}
            onClick={() => setActiveTab("curated")}
          >
            Curated Picks
          </button>
          <button
            className={`btn btn-sm ${activeTab === "new" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)", border: "none" }}
            onClick={() => setActiveTab("new")}
          >
            New Arrivals
          </button>
          <button
            className={`btn btn-sm ${activeTab === "bestseller" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "var(--radius-full)", border: "none" }}
            onClick={() => setActiveTab("bestseller")}
          >
            Best Sellers
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="product-grid">
        {displayed.map((prod) => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link to="/products" className="btn btn-secondary btn-lg" style={{ minWidth: "220px" }}>
          <span>Explore Entire Catalog</span>
          <IconArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
