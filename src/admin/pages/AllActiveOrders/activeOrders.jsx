import React, { useEffect, useState } from "react";
import AdminNavbar from "../../component/adminNavbar/AdminNavbar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AdminActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState({});
  const token = localStorage.getItem("accessToken");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(data.data || []);

      // initialize statuses
      const statusMap = {};
      (data.data || []).forEach((order) => {
        statusMap[order.orderId] = order.status;
      });
      setStatuses(statusMap);

    } catch (error) {
      console.error(error);
      toast.error("Error fetching active orders");
    } finally {
      setLoading(false);
    }
  };

  // Update Order Status (Instant UI Update)
  const updateOrderStatus = async (orderId, newStatus) => {
    // Optimistically update UI
    setStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Error updating order status");

      // Revert UI on error
      const originalStatus =
        orders.find((o) => o.orderId === orderId)?.status || "PENDING";

      setStatuses((prev) => ({
        ...prev,
        [orderId]: originalStatus,
      }));

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status: originalStatus } : order
        )
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-[#f61a02] border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-[#f61a02] mb-6"
        >
          📦 Active Orders
        </motion.h1>

        {orders.length > 0 ? (
          <div className="grid gap-6">
            {orders.map((order, idx) => (
              <motion.div
                key={order.orderId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 hover:shadow-xl transition"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order #{order.orderId}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Placed: {new Date(order.placedAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Status:{" "}
                      <span
                        className={`font-semibold px-2 py-1 rounded-md ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#f61a02]">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-gray-600">{order.customerName}</p>
                    <p className="text-gray-600">{order.mob_no}</p>
                    <p className="text-gray-600">{order.customerEmail}</p>

                    {/* Status select */}
                    <select
                      value={statuses[order.orderId] || order.status}
                      onChange={(e) =>
                        setStatuses((prev) => ({
                          ...prev,
                          [order.orderId]: e.target.value,
                        }))
                      }
                      className="mt-3 border rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#f61a02]"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>

                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.orderId,
                          statuses[order.orderId] || order.status
                        )
                      }
                      className="ml-2 mt-3 bg-[#f61a02] text-white px-3 py-1.5 rounded hover:bg-[#e10000] transition"
                    >
                      Submit
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <h3 className="font-semibold text-gray-700 mb-2">🛒 Items</h3>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <span>{item.productName}</span>
                        <span>
                          {item.quantity} x ₹{item.price.toFixed(2)} (
                          {item.weight})
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="font-semibold text-gray-700 mb-2">📍 Address</h3>
                  <p className="text-gray-600">
                    {order.addresses.houseNumber}, {order.addresses.street},{" "}
                    {order.addresses.city}, {order.addresses.district},{" "}
                    {order.addresses.state} - {order.addresses.pinCode},{" "}
                    {order.addresses.country}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600"
          >
            No active orders found.
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default AdminActiveOrders;
