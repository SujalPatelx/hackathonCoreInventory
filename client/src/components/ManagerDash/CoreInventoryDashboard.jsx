import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import GenericPage from "./GenericPage";
import AnalyticsPage from "./AnalyticsPage";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ReceivePage from "./ReceivePage";
import DeliverPage from "./DeliverPage";
import TransferPage from "./TransferPage";
import AdjustPage from "./AdjustPage";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "products", label: "Products", icon: "📦" },
  { id: "receive", label: "Receive Items", icon: "↙" },
  { id: "deliver", label: "Deliver Items", icon: "↗" },
  { id: "transfer", label: "Transfer Stock", icon: "⇄" },
  { id: "adjust", label: "Adjust Stock", icon: "⊿" },
  { id: "analytics", label: "Analytics Reports", icon: "📊" },
];

const PAGE_MAP = {
  products: <ProductsPage />,
  deliver: <DeliverPage />,
  transfer: <TransferPage />,
  adjust: <AdjustPage />,
  analytics: <AnalyticsPage />,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [incomingShipments, setIncomingShipments] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWarehouses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/warehouses");
        if (!res.ok) return;
        setWarehouses(await res.json());
      } catch {
        // ignore, dashboard still works without warehouses preloaded
      }
    };
    loadWarehouses();
  }, []);

  const handleOrderMore = (item) => {
    const qtyInput = window.prompt(
      `Enter quantity to order for ${item.name}`,
      "10",
    );
    if (!qtyInput) return;
    const quantity = Number(qtyInput);
    if (Number.isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (!warehouses.length) {
      alert("Warehouses are not loaded yet. Please try again in a moment.");
      return;
    }

    const optionsText = warehouses
      .map((w, idx) => `${idx + 1}) ${w.name}`)
      .join("\n");
    const whInput = window.prompt(
      `Select warehouse for this order:\n${optionsText}`,
      "1",
    );
    if (!whInput) return;
    const whIndex = Number(whInput) - 1;
    const warehouse = warehouses[whIndex];
    if (!warehouse) {
      alert("Invalid warehouse selection.");
      return;
    }

    const newShipment = {
      id: `${item.id}-${Date.now()}`,
      productId: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category,
      quantity,
      status: "Pending",
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
    };

    setIncomingShipments((prev) => [newShipment, ...prev]);
    setActive("receive");
  };

  const handleReceiveShipment = async (shipment) => {
    try {
      const res = await fetch("http://localhost:5000/api/products/receive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: shipment.productId,
          quantity: shipment.quantity,
          warehouse_id: shipment.warehouseId,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.message || "Failed to receive shipment");
        return;
      }

      setIncomingShipments((prev) =>
        prev.map((s) =>
          s.id === shipment.id ? { ...s, status: "Received" } : s,
        ),
      );
      alert("Shipment received and stock updated.");
    } catch (e) {
      console.error("Error receiving shipment", e);
      alert("Unexpected error while receiving shipment");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("ci_name");
      localStorage.removeItem("ci_role");
    } catch {
      // ignore storage errors
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

      {/* Main */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar />

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 24,
          }}
        >
          {/* Page heading */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#1e1b4b" }}>
              {NAV_ITEMS.find(n => n.id === active)?.label ?? "Settings"}
            </h1>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>

          {/* Dynamic page */}
          {active === "settings" && (
            <GenericPage
              title="Settings"
              icon="⚙️"
              description="Manage your portal preferences, notifications, user roles, and integrations."
              onLogout={handleLogout}
            />
          )}
          {active === "dashboard" && (
            <DashboardPage onOrderMore={handleOrderMore} />
          )}
          {active === "receive" && (
            <ReceivePage
              shipments={incomingShipments}
              onReceive={handleReceiveShipment}
            />
          )}
          {active !== "settings" &&
            active !== "dashboard" &&
            active !== "receive" &&
            PAGE_MAP[active]}
        </main>
      </div>
    </div>
  );
}
