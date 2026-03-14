import React from "react";

export default function ReceivePage({ shipments, onReceive }) {
  const hasShipments = shipments.length > 0;

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
                fontSize: 18,
                color: "#1e1b4b",
              }}
            >
              Incoming Shipments
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>
              Track products you&apos;ve ordered and receive them into stock.
            </div>
          </div>
        </div>

        {!hasShipments ? (
          <div
            style={{
              padding: 24,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 14,
            }}
          >
            No incoming shipments yet. Use the dashboard &quot;Order More&quot; action on
            low stock items to create one.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f0f5" }}>
                {[
                  "PRODUCT",
                  "SKU",
                  "CATEGORY",
                  "WAREHOUSE",
                  "ORDERED QTY",
                  "STATUS",
                  "ACTION",
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
              {shipments.map((s) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: "1px solid #f8f8fb" }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1e1b4b",
                    }}
                  >
                    {s.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {s.sku}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {s.category}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {s.warehouseName || "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontSize: 13,
                      color: "#1e1b4b",
                      fontWeight: 600,
                    }}
                  >
                    {s.quantity}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span
                      style={{
                        background:
                          s.status === "Received" ? "#ecfdf3" : "#eff6ff",
                        color:
                          s.status === "Received" ? "#16a34a" : "#2563eb",
                        borderRadius: 999,
                        padding: "4px 10px",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {s.status === "Pending" ? (
                      <button
                        onClick={() => onReceive(s)}
                        style={{
                          background:
                            "linear-gradient(135deg,#22c55e,#4ade80)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 999,
                          padding: "6px 14px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow:
                            "0 4px 10px rgba(34,197,94,0.35)",
                        }}
                      >
                        Receive
                      </button>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                        }}
                      >
                        Received
                      </span>
                    )}
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

