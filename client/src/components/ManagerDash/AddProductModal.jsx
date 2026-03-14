import { useEffect, useState } from "react";

const CATEGORIES = [
  "Electronics",
  "Peripherals",
  "Accessories",
  "Displays",
  "Storage",
  "Office",
  "Networking",
  "Other",
];

export default function AddProductModal({ onClose, onAdd }) {
  const empty = { name: "", sku: "", category: "", warehouseId: "", stock: "", price: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesError, setWarehousesError] = useState("");

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/warehouses");
        if (!res.ok) throw new Error("Failed to load warehouses");
        const data = await res.json();
        setWarehouses(data);
      } catch (e) {
        console.error("Error loading warehouses", e);
        setWarehousesError("Could not load warehouses");
      }
    };
    loadWarehouses();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.category) e.category = "Select a category";
    if (!form.warehouseId) e.warehouseId = "Select a warehouse";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)
      e.stock = "Enter valid stock quantity";
    if (
      !form.price ||
      isNaN(form.price.replace("$", "")) ||
      Number(form.price.replace("$", "")) <= 0
    )
      e.price = "Enter valid price";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const numericPrice = Number(form.price.replace("$", ""));

    const payload = {
      name: form.name,
      sku: form.sku.toUpperCase(),
      category: form.category,
      warehouse_id: Number(form.warehouseId),
      stock: Number(form.stock),
      // send numeric price to backend; UI will format with "$"
      price: numericPrice,
    };

    try {
      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        // Simple surface of error – can be improved with UI later
        alert(errBody.message || "Failed to add product");
        return;
      }

      const data = await res.json();

      // Prefer backend product shape if returned, otherwise fall back to local payload
      const backendProduct = data.product;
      onAdd(
        backendProduct
          ? {
              name: backendProduct.name,
              sku: backendProduct.sku,
              category: backendProduct.category,
              stock: payload.stock,
              price:
                backendProduct.price != null &&
                !Number.isNaN(Number(backendProduct.price))
                  ? `$${Number(backendProduct.price).toFixed(2)}`
                  : `$${numericPrice.toFixed(2)}`,
            }
          : {
              ...payload,
              price: `$${numericPrice.toFixed(2)}`,
            },
      );

      onClose();
    } catch (e) {
      console.error("Error calling /api/products/add", e);
      alert("Unexpected error while adding product");
    }
  };

  const inputStyle = (err) => ({
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${err ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: 10,
    fontSize: 13,
    color: "#1e1b4b",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  });
  const labelStyle = {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    marginBottom: 5,
    display: "block",
    letterSpacing: 0.5,
  };
  const errStyle = {
    fontSize: 11,
    color: "#ef4444",
    marginTop: 4,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,15,35,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          width: 580,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          animation: "slideUp 0.22s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            borderBottom: "1px solid #f0f0f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 18,
                color: "#1e1b4b",
              }}
            >
              Add New Product
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginTop: 2,
              }}
            >
              Fill in the details to add to your catalog
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: 8,
              width: 34,
              height: 34,
              fontSize: 16,
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div
          style={{
            padding: "24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Product Name */}
          <div>
            <label style={labelStyle}>PRODUCT NAME *</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Wireless Ergonomic Mouse"
              style={inputStyle(errors.name)}
            />
            {errors.name && <div style={errStyle}>⚠ {errors.name}</div>}
          </div>

          {/* SKU + Category row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>SKU *</label>
              <input
                value={form.sku}
                onChange={(e) => set("sku", e.target.value)}
                placeholder="e.g. SKU-WM-099"
                style={inputStyle(errors.sku)}
              />
              {errors.sku && <div style={errStyle}>⚠ {errors.sku}</div>}
            </div>
            <div>
              <label style={labelStyle}>CATEGORY *</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                style={{
                  ...inputStyle(errors.category),
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <div style={errStyle}>⚠ {errors.category}</div>}
            </div>
          </div>

          {/* Warehouse */}
          <div>
            <label style={labelStyle}>DEFAULT WAREHOUSE *</label>
            <select
              value={form.warehouseId}
              onChange={(e) => set("warehouseId", e.target.value)}
              style={{
                ...inputStyle(errors.warehouseId),
                appearance: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Select warehouse...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} {w.location ? `(${w.location})` : ""}
                </option>
              ))}
            </select>
            {errors.warehouseId && <div style={errStyle}>⚠ {errors.warehouseId}</div>}
            {warehousesError && !errors.warehouseId && (
              <div style={{ ...errStyle, color: "#ef4444" }}>{warehousesError}</div>
            )}
          </div>

          {/* Stock + Price row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={labelStyle}>INITIAL STOCK *</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                min="0"
                style={inputStyle(errors.stock)}
              />
              {errors.stock && <div style={errStyle}>⚠ {errors.stock}</div>}
            </div>
            <div>
              <label style={labelStyle}>UNIT PRICE *</label>
              <input
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 29.99"
                style={inputStyle(errors.price)}
              />
              {errors.price && <div style={errStyle}>⚠ {errors.price}</div>}
            </div>
          </div>

          {/* Footer Buttons */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
              paddingTop: 8,
              borderTop: "1px solid #f0f0f5",
              marginTop: 4,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 26px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
              }}
            >
              + Add Product
            </button>
          </div>
        </div>
      </div>
      <style>
        {`@keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }`}
      </style>
    </div>
  );
}

