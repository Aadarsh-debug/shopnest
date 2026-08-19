import React from "react";
import { IconTruck, IconRefresh, IconShield, IconSparkles } from "./Icons";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <IconTruck size={22} />,
      title: "Zero-Carbon Delivery",
      description: "Complimentary express courier across India on all orders exceeding ₹999 with 100% carbon offsetting.",
    },
    {
      icon: <IconRefresh size={22} />,
      title: "30-Day Honest Trial",
      description: "Experience your objects at home with a 30-day effortless return window and complimentary pickups.",
    },
    {
      icon: <IconShield size={22} />,
      title: "2-Year Craft Warranty",
      description: "Every electronic, timepiece, and furniture piece includes a 2-year warranty covering materials and assembly.",
    },
    {
      icon: <IconSparkles size={22} />,
      title: "Ethical Provenance",
      description: "Crafted exclusively with FSC-certified timbers, recycled brass, and unbleached Belgian organic textiles.",
    },
  ];

  return (
    <section style={{ marginBottom: "4.5rem" }}>
      <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
        <div className="eyebrow">THE SHOPNEST COMMITMENT</div>
        <h2>Designed to endure, delivered with respect.</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {features.map((f, index) => (
          <div key={index} className="card-3d-depth" style={{ padding: "2rem 1.5rem", background: "var(--bg-surface)" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-subtle)",
                color: "var(--accent-pine)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.25rem",
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{f.title}</h3>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
