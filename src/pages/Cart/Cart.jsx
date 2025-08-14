import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/v1/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (!res.ok || result.apiError) {
          throw new Error(result.apiError || "Failed to fetch cart");
        }

        const mappedData = result.data.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          totalQuantity: item.totalQuantity,
          totalPrice: item.totalPrice,
          unitLabel: item.unitLabel,
          unitPrice: item.unitPrice ?? item.totalPrice / item.totalQuantity,
        }));

        setCartData(mappedData);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching cart items.");
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token missing.");
        return;
      }

      const res = await fetch(`http://localhost:8000/api/v1/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.apiError || "Failed to delete item.");
      }

      setCartData(prev => prev.filter(item => item.productId !== productId));
      toast.success("🗑️ Item removed from cart", { autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to remove item: " + err.message);
    }
  };

  const handleChangeQuantity = (index, newQuantity) => {
    setCartData(prev => {
      const updated = [...prev];
      updated[index].quantity = newQuantity > 0 ? newQuantity : 1;
      updated[index].totalPrice = updated[index].quantity * updated[index].unitPrice;
      return updated;
    });
  };

  const totalAmount = cartData.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleManageAddress = () => {
    navigate("/address"); // Redirect to address page
  };

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold text-[#f60202] mb-4">🛒 My Items</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Section */}
        <div className="bg-white w-full lg:w-[65%] rounded-xl shadow-md relative">
          <div className="flex flex-col gap-6 p-4 mb-20 max-h-[60vh] overflow-y-auto">
            {cartData.length > 0 ? (
              cartData.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fef6f5] flex flex-col md:flex-row justify-between items-center gap-5 p-4 rounded-xl shadow-sm hover:shadow-md border hover:border-[#f5483f] transition-all"
                >
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-semibold text-[#444]">Product ID: {item.productId}</h2>
                    <p className="text-gray-700 text-sm">Unit: {item.unitLabel}</p>
                    <p className="text-lg text-gray-600">₹{item.unitPrice?.toFixed(2)}</p>
                    <div>
                      <label>Quantity - </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleChangeQuantity(index, parseInt(e.target.value) || 1)}
                        className="w-16 text-center border rounded-md px-2 py-1 bg-white text-gray-700"
                      />
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-800">Total: ₹{(item.totalPrice).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="py-2 px-4 mt-6 bg-[#f61a02] text-white font-medium rounded-md hover:bg-[#c30000] transition-all"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 font-medium">Your cart is empty 🛒</p>
            )}
          </div>

          {/* Manage Address Button */}
          {cartData.length > 0 && (
            <div className="absolute bottom-0 bg-white w-full p-3 shadow-inner rounded-b-xl z-10 flex justify-between">
              <p className="flex justify-center items-center text-2xl">₹{totalAmount.toFixed(2)}</p>
              <button
                className="py-2 px-4 bg-[#f61a02] text-white font-medium rounded-md hover:bg-[#c30000] transition-all"
                onClick={handleManageAddress}
              >
                Manage Address
              </button>
            </div>
          )}
        </div>

        {/* Price Details Section */}
        <div className="w-full lg:w-[30%] bg-[#ffe9e6] p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#333] text-center mb-2">💰 Price Details</h2>
          <div className="h-[1px] bg-[#e05b54] mb-3"></div>

          {cartData.map((item, index) => (
            <div className="flex justify-between py-1 text-sm text-gray-800" key={index}>
              <span>Product ID: {item.productId}</span>
              <span>₹{item.totalPrice.toFixed(2)}</span>
            </div>
          ))}

          <div className="h-[1px] bg-[#e0a954] mt-3 mb-2"></div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <NavLink to='/'>
        <button className="py-2 px-4 mt-6 bg-[#f61a02] text-white font-medium rounded-md hover:bg-[#c30000] transition-all">
          Add more Products
        </button>
      </NavLink>
    </div>
  );
};

export default Cart;
