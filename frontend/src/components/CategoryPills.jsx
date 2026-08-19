import React from "react";

export const CATEGORIES = [
  "All",
  "Electronics",
  "Furniture",
  "Kitchen",
  "Accessories",
  "Clothing",
  "Home Decor",
  "Fitness"
];

export default function CategoryPills({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-pills-bar" role="tablist" aria-label="Product categories">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat || (cat === "All" && !selectedCategory);
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            className={`category-pill ${isActive ? "active" : ""}`}
            onClick={() => onSelectCategory(cat === "All" ? "" : cat)}
          >
            {cat === "All" ? "All Objects" : cat}
          </button>
        );
      })}
    </div>
  );
}
