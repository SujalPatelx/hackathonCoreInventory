import { useState } from "react";
import AddProductModal from "./AddProductModal";

const initialProducts = [
  { name: "Wireless Mouse", sku: "SKU-WM-001", category: "Electronics", stock: 120, price: "$29.99" },
  { name: "Mechanical Keyboard", sku: "SKU-KB-044", category: "Peripherals", stock: 85, price: "$89.99" },
  { name: "USB-C Hub", sku: "SKU-UH-221", category: "Accessories", stock: 200, price: "$39.99" },
  { name: "4K Webcam", sku: "SKU-WC-118", category: "Electronics", stock: 47, price: "$149.99" },
  { name: "Standing Desk Mat", sku: "SKU-DM-330", category: "Office", stock: 63, price: "$59.99" },
];

export default function ProductsPage() {
  const [list, setList] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);

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
              Manage your full product catalog · {list.length} items
            </div>
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

