import { useState } from "react";
import AdminNavbar from '../../component/adminNavbar/AdminNavbar'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitLabel, setUnitLabel] = useState("");
  const [description, setDescription] = useState("");
  const [productImg, setProductImg] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddOrEdit = async () => {
    if (!name || !price || !quantity || !unitLabel || !description || !productImg) {
      toast.error("Fill all fields", { autoClose: 2000 });
      return;
    }

    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, name, price: +price, quantity: +quantity } : p
        )
      );
      setEditId(null);
      toast.success("✅ Product updated", { autoClose: 2000 });
    } else {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("unitQuantity", quantity);
        formData.append("unitLabel", unitLabel);
        formData.append("unitPrice", price);
        formData.append("description", description);
        formData.append("imageFile", productImg);;

        const res = await fetch("http://localhost:8000/api/v1/products/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.apiError || "Failed to add product");

        setProducts((prev) => [...prev, data.data]);
        toast.success("✅ Product added successfully", { autoClose: 2000 });
      } catch (error) {
        toast.error(error.message, { autoClose: 2000 });
      } finally {
        setLoading(false);
      }
    }

    setName("");
    setPrice("");
    setQuantity("");
    setUnitLabel("");
    setDescription("");
    setProductImg(null);
  };

  const handleEdit = (id) => {
    const prod = products.find((p) => p.id === id);
    setName(prod.name);
    setPrice(prod.unitPrice || prod.price);
    setQuantity(prod.unitQuantity || prod.quantity);
    setUnitLabel(prod.unitLabel || "");
    setDescription(prod.description || "");
    setEditId(id);
  };

  const deleteQuantity = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id && p.quantity > 1
          ? { ...p, quantity: p.quantity - 1 }
          : p
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.info("🗑️ Product deleted", { autoClose: 2000 });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AdminNavbar />
      <div className="border border-red-400 bg-[#ffe9e6] rounded-md p-8 w-full max-w-xl text-center shadow-xl space-y-6">
        <h1 className="text-red-500 text-xl font-semibold mb-6 text-left">Add Products</h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Unit Label (e.g. ltr, kg)"
            value={unitLabel}
            onChange={(e) => setUnitLabel(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none"
          />
          <input
            type="file"
            onChange={(e) => setProductImg(e.target.files[0])}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-red-500 text-white"
          />
          <button
            onClick={handleAddOrEdit}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Processing..." : editId ? "Update Product" : "Add Product"}
          </button>
        </div>
        <div className="text-white">
          {products.length === 0 ? (
            <p className="text-gray-700">No products added yet.</p>
          ) : (
            <ul className="space-y-3">
              {products.map((prod) => (
                <li
                  key={prod.id}
                  className="bg-gray-800 p-4 rounded-md flex justify-between items-center"
                >
                  <div className="text-left">
                    <p className="font-bold text-red-300">{prod.name}</p>
                    <p>Price: ₹{prod.unitPrice || prod.price}</p>
                    <p>Qty: {prod.unitQuantity || prod.quantity} {prod.unitLabel}</p>
                  </div>
                  
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-center" />
    </div>
  );
}

export default AddProduct;
