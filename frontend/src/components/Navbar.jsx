import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  IconShoppingBag,
  IconHeart,
  IconSearch,
  IconUser,
  IconMenu,
  IconX,
  IconLayoutDashboard,
  IconPackage,
  IconLogOut,
} from "./Icons";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { wishlistCount } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          ShopNest<span className="dot">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Catalog
          </NavLink>
          {user && (
            <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} style={{ color: "var(--accent-earth)", fontWeight: 600 }}>
              Admin Panel
            </NavLink>
          )}
        </nav>

        {/* Navigation Action Buttons */}
        <div className="nav-actions">
          {/* Quick Search */}
          <button
            className="nav-icon-btn"
            onClick={() => navigate("/products")}
            aria-label="Search Catalog"
            title="Search Catalog"
          >
            <IconSearch size={19} />
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="nav-icon-btn"
            aria-label="View Saved Wishlist"
            title="Wishlist"
          >
            <IconHeart size={19} />
            {wishlistCount > 0 && <span className="nav-badge-count">{wishlistCount}</span>}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="nav-icon-btn"
            aria-label="View Shopping Cart"
            title="Shopping Cart"
          >
            <IconShoppingBag size={19} />
            {count > 0 && <span className="nav-badge-count">{count}</span>}
          </Link>

          {/* User Account / Menu */}
          {user ? (
            <div className="user-menu-dropdown" ref={dropdownRef}>
              <button
                className="nav-icon-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User Account"
                style={{
                  background: dropdownOpen ? "var(--bg-subtle)" : "transparent",
                }}
              >
                <IconUser size={19} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-name">{user.name}</div>
                    <div className="dropdown-email">{user.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <IconUser size={16} />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <IconPackage size={16} />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <IconHeart size={16} />
                    <span>Saved Items</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ color: "var(--accent-earth)", fontWeight: 600 }}
                    >
                      <IconLayoutDashboard size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    className="dropdown-item danger"
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                  >
                    <IconLogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="nav-icon-btn mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ display: "none" }}
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
