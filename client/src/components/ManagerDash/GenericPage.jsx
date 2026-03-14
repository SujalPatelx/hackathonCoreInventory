import React from "react";

export default function GenericPage({ title, icon, description, onLogout }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 36,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #f0f0f5",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 22,
            color: "#1e1b4b",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#94a3b8",
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          {description}
        </div>
        {onLogout ? (
          <button
            onClick={onLogout}
            style={{
              marginTop: 24,
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Log out
          </button>
        ) : (
          <button
            style={{
              marginTop: 24,
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 22,
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              border: "1px solid #f0f0f5",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "#eef2ff",
                borderRadius: 10,
                marginBottom: 12,
              }}
            />
            <div
              style={{
                height: 14,
                background: "#f1f5f9",
                borderRadius: 6,
                marginBottom: 8,
                width: "70%",
              }}
            />
            <div
              style={{
                height: 10,
                background: "#f8fafc",
                borderRadius: 6,
                width: "90%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

