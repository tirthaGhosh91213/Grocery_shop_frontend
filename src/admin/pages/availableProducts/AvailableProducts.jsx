import { useState, useEffect } from "react";
import AdminNavbar from "../../component/adminNavbar/AdminNavbar";
import { useNavigate } from "react-router-dom";

const AvailableProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2000);
  };

  const fetchProducts = async () => {
    try {
      if (!token) {
        showPopup("Please log in first");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/api/v1/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        showPopup("Session expired, please log in again");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error(err);
      showPopup("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setEditImage(null);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEditImage(e.target.files[0]);
  };

  const saveProductChanges = async () => {
    if (!editProduct) return;

    try {
      // 1️⃣ Update product details (JSON)
      const res1 = await fetch(
        `http://localhost:8000/api/v1/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editProduct.name,
            unitQuantity: editProduct.unitQuantity,
            unitLabel: editProduct.unitLabel,
            unitPrice: editProduct.unitPrice,
            description: editProduct.description,
          }),
        }
      );

      if (!res1.ok) throw new Error("Failed to update product details");

      // 2️⃣ Update image (FormData) if selected
      if (editImage) {
        const formData = new FormData();
        formData.append("image", editImage);

        const res2 = await fetch(
          `http://localhost:8000/api/v1/products/${editProduct.id}`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        if (!res2.ok) throw new Error("Failed to update product image");
      }

      showPopup("Product updated successfully");
      setEditProduct(null);
      setEditImage(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      showPopup("Error updating product");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      {popup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {popup}
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <h2 className="text-2xl font-bold">Available Products</h2>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {product.unitQuantity} {product.unitLabel}
                  </p>
                  <p className="text-xl font-bold text-red-500">
                    ₹{product.unitPrice}
                  </p>
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full mt-3 bg-red-500 text-white py-2 rounded-md"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              name="name"
              value={editProduct.name}
              onChange={handleProductChange}
              placeholder="Product Name"
              className="border px-3 py-2 w-full mb-3"
            />
            <input
              type="number"
              name="unitQuantity"
              value={editProduct.unitQuantity}
              onChange={handleProductChange}
              placeholder="Quantity"
              className="border px-3 py-2 w-full mb-3"
            />
            <input
              type="text"
              name="unitLabel"
              value={editProduct.unitLabel}
              onChange={handleProductChange}
              placeholder="Unit Label"
              className="border px-3 py-2 w-full mb-3"
            />
            <input
              type="number"
              name="unitPrice"
              value={editProduct.unitPrice}
              onChange={handleProductChange}
              placeholder="Price"
              className="border px-3 py-2 w-full mb-3"
            />
            <textarea
              name="description"
              value={editProduct.description}
              onChange={handleProductChange}
              placeholder="Description"
              className="border px-3 py-2 w-full mb-3"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="border px-3 py-2 w-full mb-3"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditProduct(null);
                  setEditImage(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveProductChanges}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableProducts;
