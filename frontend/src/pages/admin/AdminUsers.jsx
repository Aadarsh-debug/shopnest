import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authHeader, request } from "../../services/api";
import Badge from "../../components/Badge";
import { IconArrowLeft, IconUser, IconCheck } from "../../components/Icons";

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      setLoading(true);
      request("/auth/users", { headers: authHeader(user) })
        .then((data) => {
          if (isMounted) setUsers(data || []);
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
            <IconArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="eyebrow">COMMUNITY DIRECTORY</div>
        <h1>Registered Patrons ({users.length})</h1>
      </div>

      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-hairline)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Patron</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Role</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600, textAlign: "right" }}>Verification</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--bg-subtle)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.8rem" }}>
                        {u.name?.charAt(0).toUpperCase() || "P"}
                      </div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <Badge variant={u.role === "admin" ? "earth" : "default"}>
                      {u.role === "admin" ? "Administrator" : "Patron"}
                    </Badge>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--accent-pine)", fontSize: "0.78rem", fontWeight: 600, background: "var(--accent-pine-light)", padding: "0.2rem 0.55rem", borderRadius: "var(--radius-full)" }}>
                      <IconCheck size={13} />
                      <span>Verified</span>
                    </span>
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
