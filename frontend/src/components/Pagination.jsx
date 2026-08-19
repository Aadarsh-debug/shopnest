import React from "react";
import { IconArrowLeft, IconArrowRight } from "./Icons";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "3rem" }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <IconArrowLeft size={16} />
        <span>Previous</span>
      </button>

      <div style={{ display: "flex", gap: "0.25rem" }}>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              className={`btn btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              style={{ minWidth: "36px", padding: "0.45rem" }}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <span>Next</span>
        <IconArrowRight size={16} />
      </button>
    </div>
  );
}
