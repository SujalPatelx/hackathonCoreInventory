import React, { useEffect, useState } from "react";

export default function AdjustPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    warehouseId: "",
    productId: "",
    type: "increase",
    quantity: "",
    reason: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [whRes, adjRes] = await Promise.all([
          fetch("http://localhost:5000/api/warehouses"),
          fetch("http://localhost:5000/api/adjustments"),
        ]);

        if (!whRes.ok) throw new Error("Failed to load warehouses");
        setWarehouses(await whRes.json());

        if (adjRes.ok) {
          setAdjustments(await adjRes.json());
        }
      } catch (e) {
        console.error("Error loading adjust page data", e);
        setError("Could not load warehouses/adjustments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadProductsForWarehouse = async (warehouseId) => {
    if (!warehouseId) {
      setProducts([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/by-warehouse?warehouse_id=${warehouseId}`,
      );
      if (!res.ok) throw new Error("Failed to load products");
      setProducts(await res.json());
    } catch (e) {
      console.error("Error loading products for warehouse", e);
      setError("Could not load products for selected warehouse");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: value,
    }));

  const handleWarehouseChange = (value) => {
    setForm((f) => ({ ...f, warehouseId: value, productId: "" }));
    loadProductsForWarehouse(value);
  };

  const handleSubmit = async () => {
    if (!form.warehouseId || !form.productId || !form.quantity) {
      alert("Please select warehouse, product, and quantity.");
      return;
    }
    const qty = Number(form.quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouse_id: Number(form.warehouseId),
          product_id: Number(form.productId),
          quantity: qty,
          type: form.type,
          reason: form.reason || "",
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.message || "Failed to adjust stock");
        return;
      }

      setAdjustments((prev) => [body.adjustment, ...prev]);
      // refresh products list to show new available qty
      await loadProductsForWarehouse(form.warehouseId);
      setForm((f) => ({ ...f, productId: "", quantity: "", reason: "" }));
      alert("Stock adjusted.");
    } catch (e) {
      console.error("Error creating adjustment", e);
      alert("Unexpected error while adjusting stock");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 18,
              color: "#1e1b4b",
            }}
          >
            Adjust Stock
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Increase or decrease stock for a product in a specific warehouse.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2fr 1.3fr 1fr auto",
            gap: 12,
            alignItems: "flex-end",
          }}
        >
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              WAREHOUSE
            </label>
            <select
              value={form.warehouseId}
              onChange={(e) => handleWarehouseChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                background: "#fafafa",
                cursor: "pointer",
              }}
            >
              <option value="">Select...</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              PRODUCT
            </label>
            <select
              value={form.productId}
              onChange={(e) => setField("productId", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                background: "#fafafa",
                cursor: form.warehouseId ? "pointer" : "not-allowed",
                opacity: form.warehouseId ? 1 : 0.6,
              }}
              disabled={!form.warehouseId}
            >
              <option value="">
                {form.warehouseId ? "Select product..." : "Select warehouse first"}
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — {p.reorder_level ?? 0} current
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              TYPE
            </label>
            <select
              value={form.type}
              onChange={(e) => setField("type", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                background: "#fafafa",
                cursor: "pointer",
              }}
            >
              <option value="increase">Increase (+)</option>
              <option value="decrease">Decrease (-)</option>
            </select>
          </div>

          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              QTY
            </label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              placeholder="1"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                background: "#fafafa",
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            }}
          >
            Apply
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              marginBottom: 4,
              display: "block",
            }}
          >
            REASON (optional)
          </label>
          <input
            value={form.reason}
            onChange={(e) => setField("reason", e.target.value)}
            placeholder="e.g. Stock count adjustment / damaged goods"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "1.5px solid #e2e8f0",
              fontSize: 13,
              background: "#fafafa",
            }}
          />
        </div>

        {loading && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
            Loading...
          </div>
        )}
        {error && !loading && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#ef4444" }}>
            {error}
          </div>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1e1b4b" }}>
            Recent Adjustments
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Manual corrections and write-offs.
          </div>
        </div>

        {adjustments.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
            No adjustments yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
                {["DATE", "PRODUCT", "SKU", "WAREHOUSE", "TYPE", "QTY", "REASON"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {adjustments.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid #f8f8fb" }}>
                  <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1e1b4b",
                    }}
                  >
                    {a.product_name}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {a.sku}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {a.warehouse_name}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {a.type === "increase" ? "Increase" : "Decrease"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 700,
                      color: a.type === "increase" ? "#16a34a" : "#ef4444",
                    }}
                  >
                    {a.type === "increase" ? "+" : "-"}
                    {a.quantity}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#94a3b8" }}>
                    {a.reason || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

