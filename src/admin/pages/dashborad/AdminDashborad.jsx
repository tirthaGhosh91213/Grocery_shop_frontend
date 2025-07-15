import React from "react";
import AdminNavbar from '../../component/adminNavbar/AdminNavbar'

const orders = [1, 2, 3];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <AdminNavbar/>
      <div className="flex flex-col gap-6">
        {orders.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm bg-[#ffe9e6] hover:shadow-md transition"
          >
            {/* User Details */}
            <div className="p-4 border rounded-md bg-white text-[#333] font-medium">User Details</div>

            {/* Product Details */}
            <div className="p-4 border rounded-md bg-white text-[#333] font-medium">Product Details</div>

            {/* Total Price */}
            <div className="p-4 border rounded-md bg-white text-[#333] font-medium">Total Price</div>

            {/* Delivery Status */}
            <div className="p-4 border rounded-md bg-white text-[#333] font-medium flex justify-between items-center">
              <span>Delivery Status</span>
              <button className="py-2 px-4 mt-6 bg-[#f61a02] text-white font-medium rounded-md hover:bg-[#c30000] transition-all">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;