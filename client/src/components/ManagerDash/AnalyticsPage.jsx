import React, { useEffect, useMemo, useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, delRes, trRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/deliveries"),
          fetch("http://localhost:5000/api/transfers"),
        ]);

        if (!prodRes.ok) throw new Error("Failed to load products");
        if (!delRes.ok) throw new Error("Failed to load deliveries");

        setProducts(await prodRes.json());
        setDeliveries(await delRes.json());
        if (trRes.ok) {
          setTransfers(await trRes.json());
        }
      } catch (e) {
        console.error("Error loading analytics data", e);
        setError("Could not load analytics data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    if (!products.length && !deliveries.length) {
      return {
        totalSkus: 0,
        totalUnits: 0,
        inventoryValue: 0,
        totalDeliveries: 0,
        transfersCount: 0,
        monthlyVolumes: new Array(12).fill(0),
      };
    }

    const totalSkus = products.length;
    const totalUnits = products.reduce((sum, p) => sum + (p.reorder_level ?? 0), 0);
    const inventoryValue = products.reduce((sum, p) => {
      const qty = p.reorder_level ?? 0;
      const price = p.price != null ? Number(p.price) : 0;
      return sum + qty * (Number.isNaN(price) ? 0 : price);
    }, 0);

    const totalDeliveries = deliveries.length;
    const transfersCount = transfers.length;

    const monthlyVolumes = new Array(12).fill(0);
    deliveries.forEach((d) => {
      const date = new Date(d.created_at);
      if (!Number.isNaN(date.getTime())) {
        const month = date.getMonth();
        monthlyVolumes[month] += d.quantity ?? 1;
      }
    });

    return {
      totalSkus,
      totalUnits,
      inventoryValue,
      totalDeliveries,
      transfersCount,
      monthlyVolumes,
    };
  }, [products, deliveries, transfers]);

  const valueFormatted = useMemo(
    () =>
      stats.inventoryValue > 0
        ? `$${stats.inventoryValue.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`
        : "$0",
    [stats.inventoryValue],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          {
            label: "Total SKUs",
            value: stats.totalSkus.toString(),
            helper: "Unique products in catalog",
            color: "#6366f1",
          },
          {
            label: "Total Units on Hand",
            value: stats.totalUnits.toString(),
            helper: "Across all warehouses",
            color: "#22c55e",
          },
          {
            label: "Inventory Value",
            value: valueFormatted,
            helper: "Qty × unit price (approx.)",
            color: "#f59e0b",
          },
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
                fontSize: 12,
                color: s.color,
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              {s.helper}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        {/* Monthly volume chart */}
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
            Monthly Delivery Volume
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 10,
              height: 160,
            }}
          >
            {stats.monthlyVolumes.map((h, i) => {
              const height = stats.monthlyVolumes.length
                ? (h / Math.max(...stats.monthlyVolumes, 1)) * 130
                : 0;
              return (
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
                      height: height || 4,
                      background: h > 0 ? "#6366f1" : "#eef2ff",
                      borderRadius: "6px 6px 0 0",
                      transition: "height 0.4s",
                    }}
                  />
                  <span style={{ fontSize: 10, color: "#cbd5e1" }}>
                    {MONTHS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity summary */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 22,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            border: "1px solid #f0f0f5",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 15,
              color: "#1e1b4b",
              marginBottom: 4,
            }}
          >
            Activity Snapshot
          </div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>
            Last known counts across operations.
          </div>
          <div style={{ fontSize: 13, color: "#1e293b" }}>
            <strong>{stats.totalDeliveries}</strong> deliveries created
          </div>
          <div style={{ fontSize: 13, color: "#1e293b" }}>
            <strong>{stats.transfersCount}</strong> stock transfers completed
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
            Data is based on current products, deliveries, and transfers stored in the
            system.
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Loading analytics...</div>
      )}
      {error && !loading && (
        <div style={{ fontSize: 12, color: "#ef4444" }}>{error}</div>
      )}
    </div>
  );
}

