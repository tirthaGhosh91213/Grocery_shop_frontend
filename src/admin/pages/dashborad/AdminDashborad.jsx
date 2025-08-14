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

  useEffect(() => {
    fetchProducts();
  }, []);

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

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }

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

      if (!res.ok) {
        throw new Error(`Failed to update status: ${res.status}`);
      }

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <AdminNavbar />

      {popup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex flex-col gap-6">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg shadow-sm bg-[#ffe9e6] hover:shadow-md transition"
            >
              <div className="p-4 border rounded-md bg-white flex justify-center items-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
              <div className="p-4 border rounded-md bg-white flex items-center">
                {product.name} ({product.unitQuantity} {product.unitLabel})
              </div>
              <div className="p-4 border rounded-md bg-white flex items-center">
                ₹{product.unitPrice}
              </div>
              <div className="p-4 border rounded-md bg-white flex items-center">
                {product.active ? "Active" : "Inactive"}
              </div>
              <div className="p-4 border rounded-md bg-white flex justify-center items-center">
                <button
                  className={`py-2 px-4 rounded-md text-white font-medium ${
                    product.active
                      ? "bg-red-500 hover:bg-red-700"
                      : "bg-green-500 hover:bg-green-700"
                  } transition-all`}
                  onClick={() =>
                    toggleProductStatus(product.id, product.active)
                  }
                >
                  {product.active ? "Deactivate" : "Activate"}
                </button>
              </div>
              <div className="p-4 border rounded-md bg-white flex justify-center items-center">
                <button
                  className="py-2 px-4 rounded-md text-white font-medium bg-blue-500 hover:bg-blue-700 transition-all"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              Edit Product - {editProduct.name}
            </h2>

            {/* Update Details */}
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

            {/* Update Image */}
            <div className="mb-4">
              <label className="block font-medium">Product Image</label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
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
              <button
                onClick={handleUpdateImage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
