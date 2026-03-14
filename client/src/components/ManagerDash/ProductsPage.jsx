import { useEffect, useState } from "react";
import AddProductModal from "./AddProductModal";

export default function ProductsPage() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [productsRes, warehousesRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/warehouses"),
        ]);

        if (!productsRes.ok) {
          throw new Error("Failed to load products");
        }
        if (!warehousesRes.ok) {
          throw new Error("Failed to load warehouses");
        }

        const productsData = await productsRes.json();
        const warehousesData = await warehousesRes.json();

        const mapped = productsData.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          category: p.category,
          stock: p.reorder_level ?? 0,
          price:
            p.price != null && !Number.isNaN(Number(p.price))
              ? `$${Number(p.price).toFixed(2)}`
              : "-",
        }));

        setList(mapped);
        setWarehouses(warehousesData);
      } catch (e) {
        console.error("Error fetching products", e);
        setError("Could not load products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const handleFilterChange = async (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setLoading(true);
    setError("");

    try {
      const url =
        warehouseId === ""
          ? "http://localhost:5000/api/products"
          : `http://localhost:5000/api/products/by-warehouse?warehouse_id=${warehouseId}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to load products");
      }
      const data = await res.json();
      const mapped = data.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        stock: p.reorder_level ?? 0,
        price:
          p.price != null && !Number.isNaN(Number(p.price))
            ? `$${Number(p.price).toFixed(2)}`
            : "-",
      }));
      setList(mapped);
    } catch (e) {
      console.error("Error fetching filtered products", e);
      setError("Could not load products from server");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (newProduct) => {
    setList((prev) => [newProduct, ...prev]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#1e1b4b",
              }}
            >
              Products
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              {loading
                ? "Loading products..."
                : error
                ? error
                : `Manage your full product catalog · ${list.length} items`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div>
              <select
                value={selectedWarehouse}
                onChange={(e) => handleFilterChange(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  fontSize: 13,
                  background: "#fafafa",
                  cursor: "pointer",
                }}
              >
                <option value="">All warehouses</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              + Add Product
            </button>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
              {["PRODUCT", "SKU", "CATEGORY", "STOCK", "PRICE"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 14px",
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
            {list.map((p, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: "1px solid #f8f8fb",
                  cursor: "pointer",
                }}
              >
                <td
                  style={{
                    padding: "14px",
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#1e1b4b",
                  }}
                >
                  {p.name}
                </td>
                <td
                  style={{
                    padding: "14px",
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  {p.sku}
                </td>
                <td style={{ padding: "14px", fontSize: 13 }}>
                  <span
                    style={{
                      background: "#f0f0ff",
                      color: "#6366f1",
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {p.category}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px",
                    fontSize: 13,
                    color: "#1e1b4b",
                    fontWeight: 600,
                  }}
                >
                  {p.stock}
                </td>
                <td
                  style={{
                    padding: "14px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#22c55e",
                  }}
                >
                  {p.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

