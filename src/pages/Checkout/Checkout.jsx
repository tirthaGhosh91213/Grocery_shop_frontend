import React, { useContext, useState } from 'react';
import { CartContext } from '../../Context/Context';

const Checkout = () => {
  const { cart } = useContext(CartContext);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <h2 className="text-center text-xl text-gray-500 mt-10">Your cart is empty.</h2>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#f60202] my-4 mx-2">Checkout</h1>

      <div className="bg-white p-4 rounded-xl shadow-md w-full sm:w-[80%] mx-auto my-7">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <ul className="space-y-4">
          {cart.map((item, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{item.productName} (x{item.quantity})</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        {user && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">User Information</h3>
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Address:</span> {user.address.line1}, {user.address.city}, {user.address.state} - {user.address.zip}</p>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Total: ₹{totalAmount}</h3>
          <button
            className="py-2 px-4 mt-6 bg-[#f61a02] text-white font-medium rounded-md hover:bg-[#c30000] transition-all">
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;