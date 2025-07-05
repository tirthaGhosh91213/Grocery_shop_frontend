import React from "react";
import { NavLink } from "react-router";

const orders = [
    { id: "#123456", date: "2025-06-15", total: "₹2999", status: "Delivered" },
    { id: "#123457", date: "2025-06-20", total: "₹1299", status: "Shipped" },
  ];

  const user = {
    name: "Sourav Kumar Bera",
    email: "sourav@example.com",
    phone: "+91 98765 43210",
    address: {
      line1: "Khandamouda",
      city: "Baharagora",
      state: "Jharkhand",
      zip: "832101",
    },
  };

const Profile = () => {


  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">My Profile</h1>

      {/* User Info */}
      <div className="border rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">User Info</h2>
        <p><span className="font-medium">Name:</span> {user.name}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Phone:</span> {user.phone}</p>
      </div>

      {/* Address */}
      <div className="border rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-2">Shipping Address</h2>
        <p>{user.address.line1}</p>
        <p>{user.address.city}, {user.address.state} - {user.address.zip}</p>
      </div>

      {/* Orders */}
      <div className="border rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">My Orders</h2>
        {orders.map(order => (
          <div
            key={order.id}
            className="border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Date:</span> {order.date}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
            </div>
            <div className="text-orange-600 font-bold">{order.total}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        <NavLink to='/'><button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md">
          Back to Home
        </button></NavLink>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md">
          Edit Profile
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md">
          Manage Address
        </button>
        <button className="border border-blue-500 text-blue-600 px-5 py-2 rounded-md hover:bg-blue-50">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
