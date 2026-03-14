import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import GenericPage from "./GenericPage";
import ReceivePage from "./ReceivePage";
import DeliverPage from "./DeliverPage";
import TransferPage from "./TransferPage";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "receive", label: "Receive Items", icon: "↙" },
  { id: "deliver", label: "Deliver Items", icon: "↗" },
  { id: "transfer", label: "Transfer Stock", icon: "⇄" },
];

function StaffHome({ onGo }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {[
        {
          title: "Receive Items",
          description: "Process incoming shipments and add stock to warehouses.",
          icon: "📥",
          id: "receive",
        },
        {
          title: "Deliver Items",
          description: "Ship products to customers from a selected warehouse.",
          icon: "🚚",
          id: "deliver",
        },
        {
          title: "Transfer Stock",
          description: "Move inventory between warehouses when needed.",
          icon: "🔄",
          id: "transfer",
        },
      ].map((card) => (
        <button
          key={card.id}
          onClick={() => onGo(card.id)}
          style={{
            textAlign: "left",
            background: "#fff",
            borderRadius: 14,
            padding: 22,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            border: "1px solid #f0f0f5",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 10 }}>{card.icon}</div>
          <div style={{ fontWeight: 900, color: "#1e1b4b", fontSize: 16 }}>
            {card.title}
          </div>
          <div style={{ marginTop: 6, color: "#94a3b8", fontSize: 13 }}>
            {card.description}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function StaffDashboard() {
  const [active, setActive] = useState("dashboard");
  const [incomingShipments, setIncomingShipments] = useState([]);
  const navigate = useNavigate();

  // Reuse the existing "Incoming Shipments" behavior (order list + receive)
  const handleReceiveShipment = async (shipment) => {
    try {
      const res = await fetch("http://localhost:5000/api/products/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: shipment.productId,
          quantity: shipment.quantity,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.message || "Failed to receive shipment");
        return;
      }

      setIncomingShipments((prev) =>
        prev.map((s) => (s.id === shipment.id ? { ...s, status: "Received" } : s)),
      );
      alert("Shipment received and stock updated.");
    } catch (e) {
      console.error("Error receiving shipment", e);
      alert("Unexpected error while receiving shipment");
    }
  };

  const PAGE_MAP = {
    deliver: <DeliverPage />,
    transfer: <TransferPage />,
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("ci_name");
      localStorage.removeItem("ci_role");
    } catch {
      // ignore
    }
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f4f4f9",
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
      }}
    >
      <Sidebar active={active} setActive={setActive} navItems={NAV_ITEMS} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e1b4b" }}>
              {NAV_ITEMS.find((n) => n.id === active)?.label ?? "Dashboard"}
            </h1>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {active === "dashboard" && <StaffHome onGo={setActive} />}

          {active === "receive" && (
            <ReceivePage shipments={incomingShipments} onReceive={handleReceiveShipment} />
          )}

          {active !== "dashboard" && active !== "receive" && PAGE_MAP[active]}

          {active === "settings" && (
            <GenericPage
              title="Settings"
              icon="⚙️"
              description="Manage your portal preferences, notifications, and profile."
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>
    </div>
  );
}

