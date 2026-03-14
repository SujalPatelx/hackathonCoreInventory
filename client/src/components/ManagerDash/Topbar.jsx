import React from "react";

export default function Topbar() {
  return (
    <header
      style={{
        height: 62,
        background: "#fff",
        borderBottom: "1px solid #ececf3",
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "#f8f8fb",
          borderRadius: 10,
          padding: "8px 16px",
          width: 300,
        }}
      >
        <span style={{ color: "#94a3b8", fontSize: 14 }}>🔍</span>
        <input
          placeholder="Search inventory, orders, or reports..."
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            fontSize: 13,
            color: "#64748b",
            width: "100%",
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          🔔
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          💬
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1e1b4b",
              }}
            >
              Alex Morgan
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              Inventory Manager
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#f59e0b,#f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            AM
          </div>
        </div>
      </div>
    </header>
  );
}

