import React from "react";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>CoreInventory</h2>
        <span>MANAGER PORTAL</span>
      </div>

      <nav className="menu">
        <a className="active">Dashboard</a>
        <a>Products</a>
        <a>Receive Items</a>
        <a>Deliver Items</a>
        <a>Transfer Stock</a>
        <a>Adjust Stock</a>
        <a>Analytics Reports</a>
      </nav>

      <div className="settings">Settings</div>

    </aside>
  );
};

export default Sidebar;