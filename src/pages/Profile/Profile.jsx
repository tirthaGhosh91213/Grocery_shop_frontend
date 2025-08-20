import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Popup state
  const [popupMessage, setPopupMessage] = useState("");

  // Address Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editAddressId, setEditAddressId] = useState(null);

  // Profile Edit Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", mob_no: "" });

  const accessToken = localStorage.getItem("accessToken");

  // Fetch User Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/user-profile/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to fetch profile");
      setUser(result.data);
      setProfileForm({ name: result.data.name, mob_no: result.data.mob_no }); // Prefill edit profile form
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/orders/my", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to fetch orders");
      setOrders(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/address/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to fetch addresses");
      setAddresses(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load default tab
  useEffect(() => {
    if (!accessToken) {
      setError("User not authenticated.");
      return;
    }
    fetchProfile();
  }, []);

  // Handle Tab Switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "profile") fetchProfile();
    if (tab === "orders") fetchOrders();
    if (tab === "addresses") fetchAddresses();
  };

  // Address Edit
  const handleEditClick = (addr) => {
    setEditForm(addr);
    setEditAddressId(addr.id);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/v1/address/update/${editAddressId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to update address");

      setPopupMessage(result.data);
      setTimeout(() => setPopupMessage(""), 2000);

      setIsEditModalOpen(false);
      fetchAddresses();
    } catch (err) {
      setPopupMessage("Error: " + err.message);
      setTimeout(() => setPopupMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Address Delete
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/v1/address/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to delete address");

      setPopupMessage(result.data);
      setTimeout(() => setPopupMessage(""), 2000);

      fetchAddresses();
    } catch (err) {
      setPopupMessage("Error: " + err.message);
      setTimeout(() => setPopupMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Profile Update Submit
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/user-profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });
      const result = await res.json();
      if (!res.ok || result.apiError) throw new Error(result.apiError || "Failed to update profile");

      setPopupMessage("Profile updated successfully!");
      setTimeout(() => setPopupMessage(""), 2000);

      setIsProfileModalOpen(false);
      fetchProfile();
    } catch (err) {
      setPopupMessage("Error: " + err.message);
      setTimeout(() => setPopupMessage(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-10">

      {/* Popup Message */}
      {popupMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
          {popupMessage}
        </div>
      )}

      <h1 className="text-3xl font-bold text-red-600 mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {["profile", "orders", "addresses"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-5 py-2 font-semibold transition-colors border-b-4 ${
              activeTab === tab
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-600 hover:text-red-500"
            }`}
          >
            {tab === "profile" && "Profile Info"}
            {tab === "orders" && "My Orders"}
            {tab === "addresses" && "My Addresses"}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && user && (
        <div className="border rounded-lg shadow-sm p-5 bg-white">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">User Info</h2>
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">Phone:</span> {user.mob_no}</p>
        </div>
      )}

      {/* Orders Section */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border rounded-lg shadow-sm p-5 bg-white">
                <div className="flex justify-between mb-3">
                  <div>
                    <p><span className="font-medium">Order ID:</span> {order.id}</p>
                    <p><span className="font-medium">Status:</span> {order.status}</p>
                    <p><span className="font-medium">Placed At:</span> {new Date(order.placedAt).toLocaleString()}</p>
                  </div>
                  <div className="text-red-600 font-bold text-lg">
                    ₹{order.totalAmount.toLocaleString()}
                  </div>
                </div>
                <div className="border-t pt-3">
                  <h3 className="font-semibold text-gray-700 mb-2">Items:</h3>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.productName} ({item.weight}) × {item.quantity}</span>
                      <span>₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Addresses Section */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <p className="text-gray-500">No addresses found.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border rounded-lg shadow-sm p-5 ${
                  addr.isActive ? "border-green-500" : "border-gray-200"
                } bg-white`}
              >
                <p className="font-medium">{addr.houseNumber}, {addr.street}</p>
                <p>{addr.city}, {addr.district}</p>
                <p>{addr.state} - {addr.pinCode}</p>
                <p>{addr.country}</p>
                {addr.isActive && (
                  <span className="text-green-600 font-semibold mt-2 block">Active Address</span>
                )}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEditClick(addr)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(addr.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Address</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              {["houseNumber", "street", "city", "district", "state", "pinCode", "country"].map((field) => (
                <input
                  key={field}
                  type="text"
                  value={editForm[field] || ""}
                  onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  placeholder={field}
                  className="w-full border px-3 py-2 rounded-md"
                  required
                />
              ))}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-3">
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Name"
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="text"
                value={profileForm.mob_no}
                onChange={(e) => setProfileForm({ ...profileForm, mob_no: e.target.value })}
                placeholder="Mobile Number"
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8">
        <NavLink to="/">
          <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md">
            Back to Home
          </button>
        </NavLink>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md"
        >
          Edit Profile
        </button>

        <NavLink to="/address">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md">
            Manage Address
          </button>
        </NavLink>

        <button
          onClick={() => {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
          }}
          className="border border-blue-500 text-blue-600 px-5 py-2 rounded-md hover:bg-blue-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
