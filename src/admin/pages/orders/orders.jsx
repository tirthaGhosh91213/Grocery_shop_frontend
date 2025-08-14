import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-[#e63946] mb-6">All Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const orderId = order.orderId || "N/A";
              const placedAt = order.placedAt
                ? new Date(order.placedAt).toLocaleString()
                : "N/A";
              const address = order.addresses || {};

              return (
                <div
                  key={orderId}
                  className="border border-gray-200 rounded-lg shadow-md p-6 bg-white"
                >
                  {/* Order Info */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Order ID: <span className="font-medium">{orderId}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed At: <span className="font-medium">{placedAt}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          order.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                    <h2 className="font-semibold text-lg mb-2 text-gray-700">
                      Customer Details
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
                    <h2 className="font-semibold text-lg mb-2 text-gray-700">
                      Products
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
                            ₹{(product.price || 0) * (product.quantity || 1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="mt-4 flex justify-end">
                    <p className="text-lg font-bold">
                      Total: ₹{order.totalAmount || 0}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
