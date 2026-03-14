import React from "react";

const statCards = [
  { label: "Total Products", value: "2,450", change: "+2.5%", color: "#6366f1", bg: "#eef2ff" },
  { label: "Low Stock Items", value: "12", badge: "Alert", color: "#ef4444", bg: "#fef2f2" },
  { label: "Incoming Shipments", value: "45", color: "#3b82f6", bg: "#eff6ff" },
  { label: "Pending Deliveries", value: "18", change: "+12%", color: "#f59e0b", bg: "#fffbeb" },
];

const lowStockItems = [
  { name: "SteelSeries Gaming Keyboard", sku: "SKU-KB-992", category: "Peripherals", stock: 4 },
  { name: 'Dell UltraSharp 27"', sku: "SKU-MN-449", category: "Displays", stock: 2 },
  { name: "Logitech MX Master 3", sku: "SKU-MS-103", category: "Peripherals", stock: 1 },
  { name: "Samsung 970 EVO SSD", sku: "SKU-ST-210", category: "Storage", stock: 3 },
];

export default function DashboardPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "20px 22px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              border: "1px solid #f0f0f5",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: s.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                {s.label.includes("Product")
                  ? "📦"
                  : s.label.includes("Low")
                  ? "⚠️"
                  : s.label.includes("Ship")
                  ? "🚚"
                  : "📬"}
              </div>
              {s.change && (
                <span
                  style={{
                    fontSize: 12,
                    color: "#22c55e",
                    fontWeight: 700,
                  }}
                >
                  {s.change}
                </span>
              )}
              {s.badge && (
                <span
                  style={{
                    fontSize: 11,
                    background: "#fef2f2",
                    color: "#ef4444",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontWeight: 700,
                  }}
                >
                  {s.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#1e1b4b",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock */}
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
            marginBottom: 6,
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
              Low Stock Product Alert
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Products currently below their minimum threshold
            </div>
          </div>
          <button
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "9px 18px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🛒 Create Bulk PO
          </button>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 14,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
              {["PRODUCT NAME", "SKU", "CATEGORY", "IN STOCK", "STATUS", "ACTION"].map(
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
            {lowStockItems.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #f8f8fb" }}>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1e1b4b",
                  }}
                >
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  {item.sku}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  {item.category}
                </td>
                <td
                  style={{
                    padding: "12px",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  {item.stock} units
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      background: "#fef2f2",
                      color: "#ef4444",
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Critical Low
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      color: "#6366f1",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Order More
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

