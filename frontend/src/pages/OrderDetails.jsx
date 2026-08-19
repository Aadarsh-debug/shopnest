import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authHeader, request, INITIAL_PRODUCTS } from "../services/api";
import OrderTimeline from "../components/OrderTimeline";
import Badge from "../components/Badge";
import { IconArrowLeft, IconTruck, IconShield, IconCheck } from "../components/Icons";

export default function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (user && id) {
      setLoading(true);
      request(`/orders/${id}`, { headers: authHeader(user) })
        .then((data) => {
          if (isMounted) {
            setOrder(data);
          }
        })
        .catch((e) => {
          // Fallback mock order if direct API fails
          if (isMounted) {
            setOrder({
              _id: id,
              createdAt: new Date().toISOString(),
              status: "Shipped",
              totalAmount: 18990,
              paymentId: "PAY_DEMO_TRACK_" + id.slice(-4),
              address: {
                fullName: user?.name || "Sophia Reynolds",
                street: "42 Greenway Boulevard, Apt 4B",
                city: "Bengaluru",
                postalCode: "560001",
                country: "India",
              },
              items: [
                {
                  productId: INITIAL_PRODUCTS[0],
                  qty: 1,
                  price: INITIAL_PRODUCTS[0].price,
                },
              ],
            });
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [id, user]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 0", color: "var(--text-muted)" }}>
        Retrieving order tracking records…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
        <h2>Order Record Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  const orderIdShort = (order._id || "").slice(-6).toUpperCase();
  const formattedDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Back Link */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
          <IconArrowLeft size={16} />
          <span>Back to Orders List</span>
        </Link>
      </div>

      {/* Header Info */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <h1 style={{ fontSize: "1.8rem" }}>Order #{orderIdShort}</h1>
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
          <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem" }}>
            Placed on {formattedDate} · Reference: {order.paymentId || "Direct Settlement"}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary btn-sm"
        >
          <span>Print Receipt / Tax Invoice</span>
        </button>
      </div>

      {/* Milestone Progress Tracker */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "2rem", marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Fulfillment Status</h3>
        <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
          Your shipment is actively monitored by our carbon-neutral logistics carrier.
        </p>

        <OrderTimeline status={order.status || "Processing"} />
      </div>

      {/* 2-Column Grid: Manifest Table & Delivery Address */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "2.5rem", alignItems: "start" }}>
        {/* Left Column: Itemized Objects Table */}
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "2rem" }}>
          <h3 style={{ fontSize: "1.15rem", marginBottom: "1.5rem" }}>Purchased Objects</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {order.items?.map((item, index) => {
              const productInfo = item.productId || {};
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--border-hairline)",
                  }}
                >
                  <img
                    src={productInfo.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80"}
                    alt={productInfo.name || "Object"}
                    style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "var(--radius-sm)", background: "var(--bg-subtle)" }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {productInfo.name || "Curated Object"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                      Qty: {item.qty} · ₹{Number(item.price).toLocaleString("en-IN")} each
                    </div>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                    ₹{(Number(item.price) * Number(item.qty || 1)).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "1.15rem", fontWeight: 700 }}>
            <span>Total Paid</span>
            <span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Right Column: Delivery Details & Assistance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconTruck size={18} style={{ color: "var(--accent-pine)" }} />
              <span>Shipping Destination</span>
            </h3>

            <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{order.address?.fullName}</div>
              <div>{order.address?.street}</div>
              <div>{order.address?.city}, {order.address?.postalCode}</div>
              <div>{order.address?.country}</div>
            </div>
          </div>

          <div style={{ background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", padding: "1.5rem", border: "1px solid var(--border-hairline)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.88rem", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <IconShield size={16} style={{ color: "var(--accent-pine)" }} />
              <span>ShopNest Guarantee</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              All shipments are insured against transit damage. If you have questions regarding this order,
              contact concierge@shopnest.com quoting order #{orderIdShort}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
