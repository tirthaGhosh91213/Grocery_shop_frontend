import { useState } from "react";
import AdminNavbar from '../../component/adminNavbar/AdminNavbar';

const AvailableProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    { id: 1, name: "Apple 🍎", availability: "In Stock" },
    { id: 2, name: "Banana 🍌", availability: "Low Stock" },
    { id: 3, name: "Orange 🍊", availability: "Out of Stock" },
  ]);

  const handleEdit = (id) => {
    alert("Edit product with id: " + id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AdminNavbar/>
      <div className="w-full max-w-4xl border rounded-md p-6 space-y-6 border-red-400 bg-[#ffeae6] shadow-xl">
        <h2 className="text-red-500 text-xl font-semibold mb-2">Available Products</h2>
        
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-red-500 rounded-md bg-transparent text-black focus:outline-none"
        />

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-red-500 rounded-md p-4 flex items-center justify-between"
            >
              <div className="flex gap-4 w-full">
                <div className="flex-1 border border-red-500 rounded-md p-4 text-black text-center">
                  {product.name}
                </div>
                <div className="flex-1 border border-red-500 rounded-md p-4 text-black text-center">
                  {product.availability}
                </div>
              </div>

              <button
                onClick={() => handleEdit(product.id)}
                className="ml-4 w-10 h-10 border border-red-500 rounded-full text-black hover:bg-white hover:text-black transition"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvailableProducts;