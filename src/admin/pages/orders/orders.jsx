import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminNavbar from "../../component/adminNavbar/AdminNavbar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/orders/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();
        console.log("Orders API response:", data);

        if (Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-gray-600 animate-pulse">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AdminNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#e63946] mb-8 tracking-tight">
          All Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 italic text-lg">No orders found.</p>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order) => {
                const orderId = order.orderId || "N/A";
                const placedAt = order.placedAt
                  ? new Date(order.placedAt).toLocaleString()
                  : "N/A";
                const address = order.addresses || {};

                return (
                  <motion.div
                    key={orderId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300"
                  >
                    {/* Order Info */}
                    <div className="mb-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order ID:{" "}
                          <span className="font-medium text-gray-800">
                            {orderId}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed At:{" "}
                          <span className="font-medium text-gray-800">
                            {placedAt}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                      <h2 className="font-semibold text-lg mb-2 text-gray-700 flex items-center gap-2">
                        👤 Customer Details
                      </h2>
                      <p>
                        <strong>Name:</strong> {order.customerName || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {order.mob_no || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong> {order.customerEmail || "N/A"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {address.houseNumber
                          ? `${address.houseNumber}, ${address.street}, ${address.city}, ${address.state}, ${address.district} - ${address.pinCode}, ${address.country}`
                          : "N/A"}
                      </p>
                    </div>

                    {/* Products */}
                    <div>
                      <h2 className="font-semibold text-lg mb-3 text-gray-700">
                        🛒 Products
                      </h2>
                      <div className="space-y-4">
                        {order.items.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-4 border-b pb-3"
                          >
                            <div className="flex-1">
                              <p className="font-medium">
                                {product.productName}
                              </p>
                              <p className="text-sm text-gray-500">
                                ₹{product.price} × {product.quantity}
                              </p>
                              <p className="text-xs text-gray-400">
                                Weight: {product.weight}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ₹
                              {(product.price || 0) *
                                (product.quantity || 1)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="mt-4 flex justify-end">
                      <p className="text-lg font-bold text-[#e63946]">
                        Total: ₹{order.totalAmount || 0}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
