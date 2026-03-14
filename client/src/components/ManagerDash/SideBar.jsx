import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className="sidebar">

      <div className="logo">
        <h2>CoreInventory</h2>
        <span>MANAGER PORTAL</span>
      </div>
<nav className="menu">

  <Link to="/manager-dashboard" className="active">Dashboard</Link>

  <Link to="/products">Products</Link>

  <Link to="/receive-items">Receive Items</Link>

  <Link to="/deliver-items">Deliver Items</Link>

  <Link to="/transfer-stock">Transfer Stock</Link>

  <Link to="/adjust-stock">Adjust Stock</Link>

  <Link to="/analytics">Analytics Reports</Link>

</nav>
      <div className="settings">Settings</div>

    </aside>
  );
};

export default Sidebar;