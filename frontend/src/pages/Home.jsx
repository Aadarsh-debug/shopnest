import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import CategoryPills from "../components/CategoryPills";
import FeaturedCollection from "../components/FeaturedCollection";
import PromoBanner from "../components/PromoBanner";
import FeaturesGrid from "../components/FeaturesGrid";
import CustomerReviews from "../components/CustomerReviews";
import { request } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    request("/products")
      .then((data) => {
        if (isMounted) setProducts(data || []);
      })
      .catch((err) => console.warn("Failed to load products for homepage", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = (category) => {
    if (category) {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div>
      {/* 3D Visual Hero */}
      <HeroBanner />

      {/* Category Pills Navigation */}
      <div style={{ marginBottom: "2.5rem" }}>
        <CategoryPills
          selectedCategory=""
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Featured Collection Grid & Tabs */}
      <FeaturedCollection products={products} />

      {/* High-Contrast Promo Banner */}
      <PromoBanner />

      {/* Brand Trust Propositions */}
      <FeaturesGrid />

      {/* Customer Community Reviews */}
      <CustomerReviews />
    </div>
  );
}
