import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authHeader, request } from "../services/api";
import Badge from "../components/Badge";
import { IconPackage, IconArrowRight, IconShoppingBag } from "../components/Icons";

export default function Orders() {
  const { user } = useAuth();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setLoading(true);
      request("/orders/myorders", { headers: authHeader(user) })
        .then((data) => {
          if (isMounted) setOrders(data || []);
        })
        .catch((e) => {
          if (isMounted) setError(e.message);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-hairline)", maxWidth: "500px", margin: "2rem auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>Please Sign In</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Sign in to access your order history, delivery milestones, and invoices.
        </p>
        <Link to="/login" className="btn btn-primary">
          <span>Sign In to Your Account</span>
        </Link>
      </div>
    );
  }

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "All") return true;
    return o.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div className="eyebrow">ORDER REPOSITORY</div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
          <div>
            <h1>My Order History</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginTop: "0.25rem" }}>
              Track shipments, review past edits, and access tax invoices
            </p>
          </div>

          {/* Filter Status Tabs */}
          <div style={{ display: "flex", gap: "0.4rem", background: "var(--bg-subtle)", padding: "0.3rem", borderRadius: "var(--radius-full)", border: "1px solid var(--border-hairline)" }}>
            {["All", "Processing", "Shipped", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-secondary"}`}
                style={{ borderRadius: "var(--radius-full)", border: "none" }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {location.state?.notice && (
        <div style={{ background: "var(--accent-pine-light)", color: "var(--accent-pine)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "2rem", border: "1px solid #c9dacd", fontWeight: 600 }}>
          {location.state.notice}
        </div>
      )}

      {error && (
        <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-muted)" }}>
          Loading your order history…
        </div>
      ) : filteredOrders.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {filteredOrders.map((order) => {
            const itemCount = order.items?.reduce((total, i) => total + (i.qty || 1), 0) || 1;
            const orderIdShort = (order._id || "").slice(-6).toUpperCase();
            const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <article
                key={order._id}
                className="card-3d-depth"
                style={{
                  padding: "1.75rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1.5rem",
                  alignItems: "center",
                  background: "var(--bg-surface)",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent-earth)", textTransform: "uppercase" }}>
                      ORDER #{orderIdShort}
                    </span>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "pine"
                          : order.status === "Shipped"
                          ? "earth"
                          : "default"
                      }
                    >
                      {order.status || "Processing"}
                    </Badge>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", marginBottom: "0.35rem" }}>
                    Placed on {formattedDate}
                  </h3>

                  <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                    {itemCount} object{itemCount > 1 ? "s" : ""} · Total: <strong style={{ color: "var(--text-primary)" }}>₹{Number(order.totalAmount).toLocaleString("en-IN")}</strong>
                  </p>

                  {/* Thumbnail Previews */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    {order.items?.slice(0, 4).map((item, idx) => (
                      <img
                        key={idx}
                        src={item.productId?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"}
                        alt={item.productId?.name || "Order object"}
                        style={{ width: "42px", height: "42px", objectFit: "cover", borderRadius: "var(--radius-xs)", border: "1px solid var(--border-hairline)" }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                    <span>View Tracking & Receipt</span>
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-hairline)" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--bg-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            <IconPackage size={26} />
          </div>
          <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>No orders placed under this filter.</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "1.75rem" }}>
            Discover our latest objects and start your curated collection today.
          </p>
          <Link to="/products" className="btn btn-primary">
            <span>Explore Catalog</span>
          </Link>
        </div>
      )}
    </div>
  );
}
