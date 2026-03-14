import React from "react";
import Sidebar from "./SideBar";
import Topbar from "./Topbar";
import StatsCards from "./StatsCard";
import ActivityLog from "./ActivityLog";
import LowStockTable from "./LowStockTable";
import "./Dashboard.css";

const ManagerDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Topbar />

        <StatsCards />

        <div className="dashboard-middle">
          <div className="chart-box">
            <h3>Warehouse Capacity Usage</h3>
            <div className="chart-placeholder">Chart goes here</div>
          </div>

          <ActivityLog />
        </div>

        <LowStockTable />
      </div>
    </div>
  );
};

export default ManagerDashboard;
