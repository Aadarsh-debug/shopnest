import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { authHeader, request, INITIAL_PRODUCTS } from "../../services/api";
import ProductModal from "./ProductModal";
import Badge from "../../components/Badge";
import { IconPlus, IconEdit, IconTrash, IconSearch, IconArrowLeft } from "../../components/Icons";

export default function AdminProducts() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    request("/products")
      .then((data) => {
        setProducts(data || INITIAL_PRODUCTS);
      })
      .catch(() => {
        setProducts(INITIAL_PRODUCTS);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSaveProduct = async (productData) => {
    try {
      if (productData._id) {
        // Update
        await request(`/products/${productData._id}`, {
          method: "PUT",
          headers: authHeader(user),
          body: JSON.stringify(productData),
        });
        setProducts((prev) =>
          prev.map((p) => (p._id === productData._id ? { ...p, ...productData } : p))
        );
        addToast("Product updated successfully!", "success", "Catalog Updated");
      } else {
        // Create
        const created = await request("/products", {
          method: "POST",
          headers: authHeader(user),
          body: JSON.stringify(productData),
        });
        setProducts((prev) => [created._id ? created : { ...productData, _id: "prod_" + Date.now() }, ...prev]);
        addToast("New product added to catalog!", "success", "Product Created");
      }
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      addToast(err.message || "Failed to save product.", "error");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this object from the catalog?")) return;
    try {
      await request(`/products/${id}`, {
        method: "DELETE",
        headers: authHeader(user),
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      addToast("Object removed from catalog.", "info", "Product Deleted");
    } catch (err) {
      addToast(err.message || "Failed to delete product.", "error");
    }
  };

  const filtered = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="eyebrow">CATALOG INVENTORY</div>
            <h1>Manage Objects ({products.length})</h1>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Filter by name..."
                className="input-field"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "2.2rem", width: "240px", fontSize: "0.82rem" }}
              />
              <IconSearch size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <IconPlus size={16} />
              <span>Add Object</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border-hairline)", textAlign: "left", color: "var(--text-secondary)" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Object</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Category</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Price</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Stock</th>
                <th style={{ padding: "1rem 1rem", fontWeight: 600 }}>Rating</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item._id} style={{ borderBottom: "1px solid var(--border-hairline)" }}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "var(--radius-xs)", background: "var(--bg-subtle)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</div>
                        <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", maxWidth: "260px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <Badge variant="default">{item.category}</Badge>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 700 }}>
                    ₹{Number(item.price).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ color: item.stock < 10 ? "var(--accent-earth)" : "var(--accent-pine)", fontWeight: 600 }}>
                      {item.stock} in stock
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    ★ {item.ratings || 4.8} ({item.numReviews || 0})
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => {
                          setEditingProduct(item);
                          setModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.4rem 0.6rem" }}
                        title="Edit Product"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(item._id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "0.4rem 0.6rem", color: "var(--accent-earth)" }}
                        title="Delete Product"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
}
