import React from "react";

const LowStockTable = () => {
  return (
    <div className="table-section">

      <div className="table-header">
        <h3>Low Stock Product Alert</h3>
        <button>Create Bulk PO</button>
      </div>

      <table>

        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>In Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td>SteelSeries Gaming Keyboard</td>
            <td>SKU-KB-992</td>
            <td>Peripherals</td>
            <td>4</td>
            <td className="critical">Critical Low</td>
            <td><button>Order More</button></td>
          </tr>

          <tr>
            <td>Dell UltraSharp 27"</td>
            <td>SKU-MN-440</td>
            <td>Displays</td>
            <td>2</td>
            <td className="critical">Critical Low</td>
            <td><button>Order More</button></td>
          </tr>

        </tbody>

      </table>

    </div>
  );
};

export default LowStockTable;