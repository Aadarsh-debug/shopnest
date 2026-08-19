import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authHeader, request } from "../../services/api";
import Badge from "../../components/Badge";
import { IconArrowLeft, IconSearch, IconArrowRight } from "../../components/Icons";

export default function AdminOrders() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchOrders = () => {
    setLoading(true);
    request("/orders", { headers: authHeader(user) })
      .then((data) => {
        setOrders(data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await request(`/orders/${orderId}/status`, {
        method: "PUT",
        headers: authHeader(user),
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      addToast(`Order #${orderId.slice(-6).toUpperCase()} marked as ${newStatus}`, "success", "Status Updated");
    } catch (err) {
      addToast(err.message || "Failed to update order status.", "error");
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = `${o._id} ${o.user?.name || ""} ${o.address?.fullName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && o.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            <IconArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
          <div>
            <div className="eyebrow">ORDER FULFILLMENT</div>
            <h1>Manage Customer Orders ({orders.length})</h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search orders or patrons..."
                className="input-field"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.2rem", width: "240px", fontSize: "0.82rem" }}
              />
              <IconSearch size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>

            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: "140px", fontSize: "0.82rem" }}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-hairline)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Order Ref</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Patron & Destination</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Date Placed</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Total Amount</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Status Control</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600, textAlign: "right" }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "1rem 1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    #{ord._id?.slice(-6).toUpperCase()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 600 }}>{ord.user?.name || ord.address?.fullName || "Patron"}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {ord.address?.city || "Bengaluru"}, {ord.address?.country || "India"}
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>
                    ₹{Number(ord.totalAmount).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={ord.status || "Processing"}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="input-field"
                      style={{
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: "var(--bg-subtle)",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <Link
                      to={`/orders/${ord._id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "0.35rem 0.65rem" }}
                    >
                      <IconArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
