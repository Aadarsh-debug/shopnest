import React from "react";
import { CATEGORIES } from "./CategoryPills";
import { IconSliders, IconRefresh, IconCheck } from "./Icons";

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  minRating,
  onMinRatingChange,
  sortBy,
  onSortChange,
  onResetFilters,
}) {
  return (
    <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "0.85rem", borderBottom: "1px solid var(--border-hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "0.95rem" }}>
          <IconSliders size={18} />
          <span>Filter Catalog</span>
        </div>
        <button
          onClick={onResetFilters}
          style={{ fontSize: "0.76rem", color: "var(--accent-earth)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem" }}
        >
          <IconRefresh size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By */}
      <div className="form-group">
        <label className="form-label">Sort Order</label>
        <select
          className="input-field"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{ cursor: "pointer" }}
        >
          <option value="featured">Curated & Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Rated</option>
          <option value="newest">Newest Additions</option>
        </select>
      </div>

      {/* Categories */}
      <div className="form-group" style={{ marginTop: "1.5rem" }}>
        <label className="form-label">Collections</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.5rem" }}>
          {CATEGORIES.map((cat) => {
            const isChecked = (!selectedCategory && cat === "All") || selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat === "All" ? "" : cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.45rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.84rem",
                  color: isChecked ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isChecked ? "var(--bg-subtle)" : "transparent",
                  fontWeight: isChecked ? 600 : 400,
                  textAlign: "left",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span>{cat === "All" ? "All Objects" : cat}</span>
                {isChecked && <IconCheck size={14} style={{ color: "var(--accent-earth)" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="form-group" style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Max Price</label>
          <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>₹{Number(priceRange).toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="80000"
          step="1000"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent-earth)", cursor: "pointer" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
          <span>₹1,000</span>
          <span>₹80,000</span>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="form-group" style={{ marginTop: "1.5rem" }}>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            cursor: "pointer",
            fontSize: "0.84rem",
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            style={{ width: "16px", height: "16px", accentColor: "var(--accent-pine)", cursor: "pointer" }}
          />
          <span>In Stock Objects Only</span>
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="form-group" style={{ marginTop: "1.25rem" }}>
        <label className="form-label">Minimum Rating</label>
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem" }}>
          {[0, 4.5, 4.7, 4.9].map((val) => (
            <button
              key={val}
              type="button"
              className={`btn btn-sm ${minRating === val ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.35rem 0.6rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
              onClick={() => onMinRatingChange(val)}
            >
              {val === 0 ? "Any" : `${val}★`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
