import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import CategoryPills from "../components/CategoryPills";
import Pagination from "../components/Pagination";
import { request } from "../services/api";
import { IconSearch, IconX, IconSliders, IconGrid, IconList } from "../components/Icons";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const categoryFromUrl = searchParams.get("category") || "";
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [priceRange, setPriceRange] = useState(80000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    request("/products")
      .then((data) => {
        if (isMounted) {
          setProducts(data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (category) => {
    setCurrentPage(1);
    if (category) {
      setSearchParams({ ...Object.fromEntries(searchParams), category });
    } else {
      const next = Object.fromEntries(searchParams);
      delete next.category;
      setSearchParams(next);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange(80000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (categoryFromUrl && item.category?.toLowerCase() !== categoryFromUrl.toLowerCase()) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      // Price filter
      if (Number(item.price) > priceRange) return false;
      // In stock filter
      if (inStockOnly && Number(item.stock) <= 0) return false;
      // Min rating filter
      if (minRating > 0 && (Number(item.ratings) || 0) < minRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating_desc") return (b.ratings || 0) - (a.ratings || 0);
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0; // featured default
    });
  }, [products, categoryFromUrl, searchQuery, priceRange, inStockOnly, minRating, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Header Section */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="eyebrow">SHOPNEST EDITIONS</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
          <div>
            <h1>The Curated Catalog</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Showing {filteredProducts.length} considered objects for daily life
            </p>
          </div>

          {/* Search bar & Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", maxWidth: "420px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                placeholder="Search by object name, category..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field"
                style={{ paddingLeft: "2.4rem", paddingRight: searchQuery ? "2.2rem" : "1rem" }}
              />
              <IconSearch
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  aria-label="Clear search"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>

            <button
              className="btn btn-secondary btn-icon-only"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              title={`Switch to ${viewMode === "grid" ? "List" : "Grid"} view`}
            >
              {viewMode === "grid" ? <IconList size={18} /> : <IconGrid size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <CategoryPills
        selectedCategory={categoryFromUrl}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Content Layout: Sidebar + Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2.5rem", alignItems: "start" }}>
        {/* Left Column: Filter Sidebar */}
        <FilterSidebar
          selectedCategory={categoryFromUrl}
          onCategoryChange={handleCategorySelect}
          priceRange={priceRange}
          onPriceChange={(p) => {
            setPriceRange(p);
            setCurrentPage(1);
          }}
          inStockOnly={inStockOnly}
          onInStockChange={(v) => {
            setInStockOnly(v);
            setCurrentPage(1);
          }}
          minRating={minRating}
          onMinRatingChange={(r) => {
            setMinRating(r);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(s) => {
            setSortBy(s);
            setCurrentPage(1);
          }}
          onResetFilters={handleResetFilters}
        />

        {/* Right Column: Catalog Grid */}
        <div>
          {error && (
            <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
              Loading catalog objects…
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setCurrentPage(p);
                  window.scrollTo({ top: 120, behavior: "smooth" });
                }}
              />
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)" }}>
              <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>No objects found matching your criteria.</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                Try adjusting your search query, clearing filters, or increasing the max price slider.
              </p>
              <button className="btn btn-primary" onClick={handleResetFilters}>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
