import React, { useEffect, useState } from "react";
import AdminNavbar from "../../component/adminNavbar/AdminNavbar";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [discountProduct, setDiscountProduct] = useState(null);
  const [discountData, setDiscountData] = useState({
    discountPercentage: "",
    durationInHours: "",
  });
  const [discountLoading, setDiscountLoading] = useState(false);

  // NEW: admin identity
  const [adminName, setAdminName] = useState("");
  const [adminInitial, setAdminInitial] = useState("");

  useEffect(() => {
    loadAdminIdentity();
    fetchProducts();
  }, []);

  const loadAdminIdentity = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // 1) Try your backend profile endpoint
    try {
      const res = await fetch("http://localhost:8000/api/v1/admin/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();
        const nameFromApi =
          json?.data?.name ||
          json?.name ||
          json?.fullName ||
          json?.user?.name ||
          json?.username ||
          (json?.email ? json.email.split("@")[0] : "");

        if (nameFromApi) {
          setAdminName(nameFromApi);
          setAdminInitial(nameFromApi.charAt(0).toUpperCase());
          return;
        }
      }
    } catch (e) {
      // ignore and fall back to JWT
    }

    // 2) Fallback: decode JWT payload for a name-like field
    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      const fallbackName =
        payload?.name ||
        payload?.given_name ||
        payload?.preferred_username ||
        payload?.username ||
        (payload?.email ? payload.email.split("@")[0] : "");

      if (fallbackName) {
        setAdminName(fallbackName);
        setAdminInitial(fallbackName.charAt(0).toUpperCase());
      }
    } catch (e) {
      // If decoding fails, we simply leave name/initial empty (no placeholder is shown)
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showPopup("No admin token found");
        return;
      }

      const res = await fetch(
        "http://localhost:8000/api/v1/products/admin/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);

      const json = await res.json();
      setProducts(json.data || []);
    } catch (error) {
      showPopup("Error loading products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const toggleProductStatus = async (productId, isActive) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showPopup("No admin token found");
        return;
      }

      const endpoint = isActive
        ? `http://localhost:8000/api/v1/products/deactive/${productId}`
        : `http://localhost:8000/api/v1/products/active/${productId}`;
      const method = isActive ? "DELETE" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);

      showPopup(isActive ? "Product deactivated" : "Product activated");
      fetchProducts();
    } catch (error) {
      showPopup("Error updating product");
      console.error(error);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setUpdatedDetails({
      name: product.name,
      unitPrice: product.unitPrice,
      unitQuantity: product.unitQuantity,
      unitLabel: product.unitLabel,
      active: product.active,
    });
    setImageFile(null);
  };

  const handleUpdateDetails = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8000/api/v1/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedDetails),
        }
      );

      if (!res.ok) throw new Error("Failed to update product details");

      showPopup("Product details updated");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      showPopup("Error updating details");
    }
  };

  const handleUpdateImage = async () => {
    if (!imageFile) {
      showPopup("Please select an image");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(
        `http://localhost:8000/api/v1/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update image");

      showPopup("Product image updated");
      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      showPopup("Error updating image");
    }
  };

  const handleDiscountSubmit = async () => {
    if (!discountData.discountPercentage || !discountData.durationInHours) {
      showPopup("Please enter valid discount and duration");
      return;
    }

    try {
      setDiscountLoading(true);
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:8000/api/v1/products/admin/${discountProduct.id}/discount`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(discountData),
        }
      );

      if (!res.ok) throw new Error("Failed to set discount");

      showPopup("Discount applied successfully");
      setDiscountProduct(null);
      setDiscountData({ discountPercentage: "", durationInHours: "" });
      fetchProducts();
    } catch (error) {
      console.error(error);
      showPopup("Error applying discount");
    } finally {
      setDiscountLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));

  return (
    <div className="min-h-screen bg-gradient-to-b  from-pink-50 to-white px-4 py-6">
      {/* Pass computed name/initial to the navbar */}
      <AdminNavbar adminName={adminName} adminInitial={adminInitial}  />

      {popup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all animate-bounce">
          {popup}
        </div>
      )}

      <div className="mb-6 mt-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-pink-300 transition"
        />
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-center animate-pulse">Loading...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 border rounded-lg shadow-md bg-white hover:shadow-xl transition transform hover:-translate-y-1 duration-200"
            >
              <div className="p-4 border rounded-md bg-pink-50 flex justify-center items-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <div className="p-4 border rounded-md flex items-center font-semibold text-gray-800">
                {product.name} ({product.unitQuantity} {product.unitLabel})
              </div>
              <div className="p-4 border rounded-md flex items-center text-pink-600 font-bold">
                ₹{product.unitPrice}
              </div>
              <div className="p-4 border rounded-md flex items-center">
                {product.active ? "Active" : "Inactive"}
              </div>
              <div className="p-4 border rounded-md flex justify-center items-center">
                <button
                  className={`py-2 px-4 rounded-md text-white font-medium ${
                    product.active
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green-500 hover:bg-green-700"
                  } transition-all`}
                  onClick={() => toggleProductStatus(product.id, product.active)}
                >
                  {product.active ? "Deactivate" : "Activate"}
                </button>
              </div>
              <div className="p-4 border rounded-md flex justify-center items-center">
                <button
                  className="py-2 px-4 rounded-md text-white font-medium bg-blue-500 hover:bg-blue-700 transition-all"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </div>
              <div className="p-4 border rounded-md flex flex-col justify-center items-center">
                <button
                  className="py-2 px-4 rounded-md text-white font-medium bg-purple-500 hover:bg-purple-700 transition-all mb-1"
                  onClick={() => setDiscountProduct(product)}
                >
                  Set Discount
                </button>
                {product.discountPercentage > 0 && (
                  <div className="text-pink-600 font-bold text-sm">
                    {product.discountPercentage}% OFF -{" "}
                    {product.discountDuration || discountData.durationInHours} hrs
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>

      {/* Discount Modal */}
      {discountProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-slideUp">
            <h2 className="text-xl font-bold mb-4 text-purple-600">
              Set Discount for {discountProduct.name}
            </h2>
            <div className="mb-4">
              <label className="block font-medium">Discount Percentage</label>
              <input
                type="number"
                value={discountData.discountPercentage}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    discountPercentage: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., 30"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Duration (Hours)</label>
              <input
                type="number"
                value={discountData.durationInHours}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    durationInHours: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                placeholder="e.g., 1"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDiscountProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDiscountSubmit}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700 flex items-center gap-2"
              >
                {discountLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                )}
                Apply Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Edit Product - {editProduct.name}
            </h2>
            <div className="mb-4">
              <label className="block font-medium">Name</label>
              <input
                type="text"
                value={updatedDetails.name}
                onChange={(e) =>
                  setUpdatedDetails({ ...updatedDetails, name: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Unit Price</label>
              <input
                type="number"
                value={updatedDetails.unitPrice}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    unitPrice: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Unit Quantity</label>
              <input
                type="number"
                value={updatedDetails.unitQuantity}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    unitQuantity: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Unit Label</label>
              <input
                type="text"
                value={updatedDetails.unitLabel}
                onChange={(e) =>
                  setUpdatedDetails({
                    ...updatedDetails,
                    unitLabel: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDetails}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Update Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
