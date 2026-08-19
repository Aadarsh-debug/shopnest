import React from "react";
import RatingStars from "./RatingStars";
import { IconCheck } from "./Icons";

export default function CustomerReviews() {
  const reviews = [
    {
      author: "Aditi Rao",
      location: "Bengaluru, India",
      rating: 5,
      date: "August 2026",
      item: "Acoustic Studio ANC Headphones",
      comment:
        "The soundstage is remarkably balanced. Aluminum finish feels exceptionally tactile and cold in hand. Unbelievable battery longevity.",
    },
    {
      author: "Marcus Vance",
      location: "Mumbai, India",
      rating: 5,
      date: "July 2026",
      item: "Nordic Oak Lounge Armchair",
      comment:
        "Arrived in zero-plastic packaging. The natural oak grain is stunning, and the linen seating cushion offers the perfect firm lumbar support.",
    },
    {
      author: "Pooja Mehta",
      location: "New Delhi, India",
      rating: 5,
      date: "July 2026",
      item: "Ceramic Pour-Over & Kettle",
      comment:
        "Pour speed control on the gooseneck kettle is surgical. Has completely elevated my morning coffee ritual. Worth every single rupee.",
    },
  ];

  return (
    <section style={{ marginBottom: "4.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        <div>
          <div className="eyebrow">COMMUNITY JOURNAL</div>
          <h2>Reflections from our patrons</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {reviews.map((r, i) => (
          <div key={i} className="card-3d-depth" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <RatingStars rating={r.rating} showScore={false} />
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{r.date}</span>
            </div>

            <p style={{ fontSize: "0.92rem", color: "var(--text-primary)", fontStyle: "italic", lineHeight: 1.6, flex: 1, marginBottom: "1.25rem" }}>
              "{r.comment}"
            </p>

            <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)" }}>{r.author}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{r.location}</div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", color: "var(--accent-pine)", fontWeight: 600, background: "var(--accent-pine-light)", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)" }}>
                <IconCheck size={12} />
                <span>Verified Buyer</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
