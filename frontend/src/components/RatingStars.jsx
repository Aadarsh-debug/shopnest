import React from "react";
import { IconStar } from "./Icons";

export default function RatingStars({ rating = 4.8, numReviews = null, showScore = true, size = 15 }) {
  const rounded = Math.round(Number(rating) * 10) / 10;
  const fullStars = Math.floor(rounded);

  return (
    <div className="product-card-rating" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", color: "#c9933b" }}>
        {[...Array(5)].map((_, i) => (
          <IconStar
            key={i}
            size={size}
            filled={i < fullStars}
            className={i < fullStars ? "star-filled" : "star-empty"}
          />
        ))}
      </div>
      {showScore && <span style={{ fontWeight: 600, fontSize: "0.8rem", marginLeft: "2px" }}>{rounded.toFixed(1)}</span>}
      {numReviews !== null && (
        <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
}
