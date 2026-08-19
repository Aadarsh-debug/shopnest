import React from "react";

export default function Badge({ children, variant = "default", className = "" }) {
  const variantMap = {
    default: "badge-tag",
    pine: "badge-tag pine",
    earth: "badge-tag earth",
    dark: "badge-tag dark",
  };

  return (
    <span className={`${variantMap[variant] || "badge-tag"} ${className}`}>
      {children}
    </span>
  );
}
