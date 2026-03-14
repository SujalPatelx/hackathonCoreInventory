import React, { useEffect, useState } from "react";

export default function DeliverPage() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({
    warehouseId: "",
    productId: "",
    customer: "",
    quantity: "",
  });
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [whRes, prodRes, delRes] = await Promise.all([
          fetch("http://localhost:5000/api/warehouses"),
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/deliveries"),
        ]);

        if (!whRes.ok) throw new Error("Failed to load warehouses");
        if (!prodRes.ok) throw new Error("Failed to load products");
        if (!delRes.ok) throw new Error("Failed to load deliveries");

        const whData = await whRes.json();
        const prodData = await prodRes.json();
        const delData = await delRes.json();

        setWarehouses(whData);
        setProducts(prodData);
        setDeliveries(delData);
      } catch (e) {
        console.error("Error loading deliver page data", e);
        setError("Could not load warehouses/products/deliveries");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleWarehouseChange = async (warehouseId) => {
    setForm((f) => ({ ...f, warehouseId, productId: "" }));
    setLoading(true);
    setError("");

    try {
      if (!warehouseId) {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to load products");
        setProducts(await res.json());
      } else {
        const res = await fetch(
          `http://localhost:5000/api/products/by-warehouse?warehouse_id=${warehouseId}`,
        );
        if (!res.ok) throw new Error("Failed to load products by warehouse");
        setProducts(await res.json());
      }
    } catch (e) {
      console.error("Error filtering products by warehouse", e);
      setError("Could not load products for selected warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDelivery = async () => {
    if (!form.warehouseId || !form.productId || !form.customer || !form.quantity) {
      alert("Please fill in warehouse, product, customer, and quantity.");
      return;
    }
    const qty = Number(form.quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouse_id: Number(form.warehouseId),
          product_id: Number(form.productId),
          customer: form.customer,
          quantity: qty,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.message || "Failed to create delivery");
        return;
      }

      setDeliveries((prev) => [body.delivery, ...prev]);
      setForm({ warehouseId: form.warehouseId, productId: "", customer: "", quantity: "" });
      alert("Delivery created and stock updated.");
    } catch (e) {
      console.error("Error creating delivery", e);
      alert("Unexpected error while creating delivery");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Create delivery */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
        }}
      >
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 18,
                color: "#1e1b4b",
              }}
            >
              Create Delivery
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Ship products to customers and reduce available stock.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 2fr 2fr 1fr auto",
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
              <option value="">Select warehouse...</option>
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
              onChange={(e) => handleChange("productId", e.target.value)}
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
                  {p.name} ({p.sku})
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
              CUSTOMER
            </label>
            <input
              value={form.customer}
              onChange={(e) => handleChange("customer", e.target.value)}
              placeholder="Acme Corp"
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
              QUANTITY
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              placeholder="1"
              min="1"
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
            onClick={handleCreateDelivery}
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
            Ship
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#94a3b8" }}>
            Loading products...
          </div>
        )}
        {error && !loading && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#ef4444" }}>
            {error}
          </div>
        )}
      </div>

      {/* Delivery history */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 16,
                color: "#1e1b4b",
              }}
            >
              Recent Deliveries
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Completed shipments to your customers.
            </div>
          </div>
        </div>

        {deliveries.length === 0 ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No deliveries yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
                {[
                  "DATE",
                  "CUSTOMER",
                  "WAREHOUSE",
                  "PRODUCT",
                  "SKU",
                  "QTY",
                ].map((h) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveries.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #f8f8fb" }}>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {new Date(d.created_at).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1e1b4b",
                    }}
                  >
                    {d.customer}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {d.warehouse_name || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {d.product_name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {d.sku}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#1e1b4b",
                      fontWeight: 600,
                    }}
                  >
                    {d.quantity}
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

