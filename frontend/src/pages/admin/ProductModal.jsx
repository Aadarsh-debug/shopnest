import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { CATEGORIES } from "../../components/CategoryPills";

export default function ProductModal({ isOpen, onClose, onSave, productToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [stock, setStock] = useState("10");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price || "");
      setCategory(productToEdit.category || "Electronics");
      setStock(productToEdit.stock || "10");
      setImageUrl(productToEdit.imageUrl || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("Electronics");
      setStock("15");
      setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80");
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: productToEdit?._id,
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? "Edit Catalog Object" : "Introduce New Object"}
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Object Title</label>
          <input
            type="text"
            required
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sculptural Ceramic Accent Table"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Price (₹ INR)</label>
            <input
              type="number"
              required
              min="1"
              className="input-field"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 14500"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Stock Quantity</label>
            <input
              type="number"
              required
              min="0"
              className="input-field"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 12"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Collection / Category</label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.filter((c) => c !== "All").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL (High-Resolution Unsplash)</label>
          <input
            type="url"
            required
            className="input-field"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Material & Design Narrative</label>
          <textarea
            rows={3}
            required
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the materials, provenance, and tactile qualities..."
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {productToEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
