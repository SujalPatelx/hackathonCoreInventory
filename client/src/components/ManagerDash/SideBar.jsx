import React from "react";

export default function Sidebar({ active, setActive, navItems }) {
  return (
    <aside
      style={{
        width: 210,
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #ececf3",
        display: "flex",
        flexDirection: "column",
        padding: "0 0 16px 0",
        boxShadow: "2px 0 12px rgba(99,102,241,0.05)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid #f0f0f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: 16,
            }}
          >
            C
          </div>
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: 14,
                color: "#1e1b4b",
                lineHeight: 1,
              }}
            >
              CoreInventory
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#94a3b8",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Manager Portal
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: isActive ? "#eef2ff" : "transparent",
                color: isActive ? "#6366f1" : "#64748b",
                fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                transition: "all 0.15s",
                textAlign: "left",
                outline: "none",
                boxShadow: isActive ? "inset 3px 0 0 #6366f1" : "none",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div style={{ padding: "0 10px" }}>
        <button
          onClick={() => setActive("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: active === "settings" ? "#eef2ff" : "transparent",
            color: active === "settings" ? "#6366f1" : "#64748b",
            fontWeight: 500,
            fontSize: 13,
            width: "100%",
            transition: "all 0.15s",
          }}
        >
          <span style={{ fontSize: 16 }}>⚙️</span> Settings
        </button>
      </div>
    </aside>
  );
}

