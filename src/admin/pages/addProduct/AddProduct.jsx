import { useState } from "react";
import AdminNavbar from '../../component/adminNavbar/AdminNavbar'

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productImg, setProductImg] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleAddOrEdit = () => {
    if (!name || !price || !quantity || !productImg) return alert("Fill all fields");

    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, name, price: +price, quantity: +quantity } : p
        )
      );
      setEditId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        price: +price,
        quantity: +quantity,
      };
      setProducts([...products, newProduct]);
    }

    setName("");
    setPrice("");
    setQuantity("");
  };

  const handleEdit = (id) => {
    const prod = products.find((p) => p.id === id);
    setName(prod.name);
    setPrice(prod.price);
    setQuantity(prod.quantity);
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
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <AdminNavbar />
      <div className="border border-orange-400 bg-[#fff3e6] rounded-md p-8 w-full max-w-xl text-center shadow-xl space-y-6">
        <h1 className="text-orange-500 text-xl font-semibold mb-6 text-left">Add Products</h1>
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
            type="file"
            placeholder="productImg"
            value={productImg}
            onChange={(e) => setProductImg(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none bg-orange-500"
          />
          <button
            onClick={handleAddOrEdit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
          >
            {editId ? "Update Product" : "Add Product"}
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
                    <p className="font-bold text-orange-300">{prod.name}</p>
                    <p>Price: ₹{prod.price}</p>
                    <p>Qty: {prod.quantity}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(prod.id)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuantity(prod.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white"
                      disabled={prod.quantity <= 1}
                    >
                      -Qty
                    </button>
                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProduct;