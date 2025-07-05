import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const orders = [1, 2, 3];

const AdminDashboard = () => {

  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="flex flex-col gap-6">
        {orders.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm bg-[#fff3e6] hover:shadow-md transition"
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
              <button className="text-sm bg-[#f68402] text-white px-3 py-1 rounded hover:bg-[#e37200]">
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
