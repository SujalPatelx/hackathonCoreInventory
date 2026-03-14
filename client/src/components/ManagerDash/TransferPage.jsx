import React, { useEffect, useMemo, useState } from "react";

export default function TransferPage() {
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transfersError, setTransfersError] = useState("");

  const [form, setForm] = useState({
    fromWarehouseId: "",
    toWarehouseId: "",
    productId: "",
    quantity: "",
  });

  const toWarehouseOptions = useMemo(() => {
    if (!form.fromWarehouseId) return warehouses;
    return warehouses.filter((w) => String(w.id) !== String(form.fromWarehouseId));
  }, [warehouses, form.fromWarehouseId]);

  useEffect(() => {
    const load = async () => {
      try {
        // Load warehouses first so dropdowns work even if transfers endpoint fails
        const whRes = await fetch("http://localhost:5000/api/warehouses");
        if (!whRes.ok) throw new Error("Failed to load warehouses");
        setWarehouses(await whRes.json());

        // Transfers are nice-to-have; failure shouldn't block warehouse dropdowns
        try {
          const transfersRes = await fetch("http://localhost:5000/api/transfers");
          if (!transfersRes.ok) throw new Error("Failed to load transfers");
          setTransfers(await transfersRes.json());
          setTransfersError("");
        } catch (e) {
          console.error("Error loading transfers", e);
          setTransfers([]);
          setTransfersError(
            "Transfers history unavailable (database may need refresh).",
          );
        }
      } catch (e) {
        console.error("Error loading transfer page data", e);
        setError("Could not load warehouses/transfers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadProductsForWarehouse = async (warehouseId) => {
    setLoading(true);
    setError("");
    setProducts([]);

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/by-warehouse?warehouse_id=${warehouseId}`,
      );
      if (!res.ok) throw new Error("Failed to load products for warehouse");
      setProducts(await res.json());
    } catch (e) {
      console.error("Error loading products for warehouse", e);
      setError("Could not load products for selected warehouse");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleFromWarehouseChange = async (value) => {
    setForm((f) => ({
      ...f,
      fromWarehouseId: value,
      productId: "",
      // auto-clear toWarehouse if user picked the same
      toWarehouseId: f.toWarehouseId && f.toWarehouseId === value ? "" : f.toWarehouseId,
    }));
    if (value) {
      await loadProductsForWarehouse(value);
    } else {
      setProducts([]);
    }
  };

  const handleTransfer = async () => {
    if (!form.fromWarehouseId || !form.toWarehouseId || !form.productId || !form.quantity) {
      alert("Please select from/to warehouse, product, and quantity.");
      return;
    }

    const qty = Number(form.quantity);
    if (Number.isNaN(qty) || qty <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_warehouse_id: Number(form.fromWarehouseId),
          to_warehouse_id: Number(form.toWarehouseId),
          product_id: Number(form.productId),
          quantity: qty,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(body.message || "Transfer failed");
        return;
      }

      setTransfers((prev) => [body.transfer, ...prev]);
      // Refresh products for "from" warehouse to reflect new qty
      await loadProductsForWarehouse(form.fromWarehouseId);
      setForm((f) => ({ ...f, productId: "", quantity: "" }));
      alert("Transfer completed.");
    } catch (e) {
      console.error("Error creating transfer", e);
      alert("Unexpected error while transferring stock");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Create transfer */}
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
          <div style={{ fontWeight: 800, fontSize: 18, color: "#1e1b4b" }}>
            Transfer Stock
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Move a product from one warehouse to another.
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1.5fr 2fr 1fr auto",
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
              FROM WAREHOUSE
            </label>
            <select
              value={form.fromWarehouseId}
              onChange={(e) => handleFromWarehouseChange(e.target.value)}
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
              TO WAREHOUSE
            </label>
            <select
              value={form.toWarehouseId}
              onChange={(e) => setField("toWarehouseId", e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1.5px solid #e2e8f0",
                fontSize: 13,
                background: "#fafafa",
                cursor: form.fromWarehouseId ? "pointer" : "not-allowed",
                opacity: form.fromWarehouseId ? 1 : 0.6,
              }}
              disabled={!form.fromWarehouseId}
            >
              <option value="">
                {form.fromWarehouseId ? "Select..." : "Select from-warehouse first"}
              </option>
              {toWarehouseOptions.map((w) => (
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
              PRODUCT (FROM WAREHOUSE)
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
                cursor: form.fromWarehouseId ? "pointer" : "not-allowed",
                opacity: form.fromWarehouseId ? 1 : 0.6,
              }}
              disabled={!form.fromWarehouseId}
            >
              <option value="">
                {form.fromWarehouseId ? "Select product..." : "Select from-warehouse first"}
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku}) — {p.reorder_level ?? 0} available
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
            onClick={handleTransfer}
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
            Transfer
          </button>
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

      {/* Transfer history */}
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
            Recent Transfers
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>
            Warehouse-to-warehouse stock movements.
          </div>
        </div>

        {transfers.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
            {transfersError || "No transfers yet."}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
                {["DATE", "PRODUCT", "SKU", "FROM", "TO", "QTY"].map((h) => (
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
              {transfers.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f8f8fb" }}>
                  <td style={{ padding: "12px", fontSize: 12, color: "#94a3b8" }}>
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 600, color: "#1e1b4b" }}>
                    {t.product_name}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {t.sku}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {t.from_warehouse_name}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, color: "#64748b" }}>
                    {t.to_warehouse_name}
                  </td>
                  <td style={{ padding: "12px", fontSize: 13, fontWeight: 700, color: "#1e1b4b" }}>
                    {t.quantity}
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

