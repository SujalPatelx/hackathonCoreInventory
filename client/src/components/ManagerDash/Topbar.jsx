import React from "react";

const Topbar = () => {
  return (
    <div className="topbar">

      <input
        type="text"
        placeholder="Search inventory, orders, or reports..."
      />

      <div className="profile">
        <span>Alex Morgan</span>
      </div>

    </div>
  );
};

export default Topbar;