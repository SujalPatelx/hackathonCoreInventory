import { useState } from "react";
import DashboardPage from "./DashboardPage";
import ProductsPage from "./ProductsPage";
import GenericPage from "./GenericPage";
import AnalyticsPage from "./AnalyticsPage";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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
  dashboard: <DashboardPage />,
  products: <ProductsPage />,
  receive: (
    <GenericPage
      title="Receive Items"
      icon="📥"
      description="Log and process incoming inventory shipments from your suppliers and warehouses."
    />
  ),
  deliver: (
    <GenericPage
      title="Deliver Items"
      icon="🚚"
      description="Manage outbound deliveries and dispatch orders to customers or retail locations."
    />
  ),
  transfer: (
    <GenericPage
      title="Transfer Stock"
      icon="🔄"
      description="Move inventory between your warehouses and fulfillment centers with ease."
    />
  ),
  adjust: (
    <GenericPage
      title="Adjust Stock"
      icon="⚖️"
      description="Manually correct stock levels, write-offs, and reconcile inventory discrepancies."
    />
  ),
  analytics: <AnalyticsPage />,
};

export default function App() {
  const [active, setActive] = useState("dashboard");

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
          {active === "settings"
            ? <GenericPage title="Settings" icon="⚙️" description="Manage your portal preferences, notifications, user roles, and integrations." />
            : PAGE_MAP[active]
          }
        </main>
      </div>
    </div>
  );
}
