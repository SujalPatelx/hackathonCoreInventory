import React from "react";

export default function AnalyticsPage() {
  const bars = [65, 80, 45, 90, 70, 55, 85, 60, 75, 50, 95, 40];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Total Revenue", value: "$284,500", change: "+18%", color: "#22c55e" },
          { label: "Orders Fulfilled", value: "1,842", change: "+9%", color: "#6366f1" },
          { label: "Return Rate", value: "2.4%", change: "-0.8%", color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "22px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              border: "1px solid #f0f0f5",
            }}
          >
            <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 6 }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#1e1b4b",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 13,
                color: s.color,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              {s.change} vs last period
            </div>
          </div>
        ))}
      </div>
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
            fontWeight: 800,
            fontSize: 16,
            color: "#1e1b4b",
            marginBottom: 20,
          }}
        >
          Monthly Order Volume
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            height: 140,
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: h * 1.3,
                  background: i === 11 ? "#6366f1" : "#eef2ff",
                  borderRadius: "6px 6px 0 0",
                  transition: "height 0.4s",
                }}
              />
              <span style={{ fontSize: 10, color: "#cbd5e1" }}>
                {months[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

