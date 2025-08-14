import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink, useNavigate } from 'react-router-dom';

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false); // New loading state
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/address/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const result = await res.json();
        setAddresses(result.data || []);
        const active = result.data?.find((a) => a.isActive);
        setActiveId(active?.id || null);
      } catch (err) {
        console.error(err);
        toast.error('Error fetching addresses');
      }
    };

    fetchAddresses();
  }, [token]);

  const handleSetActive = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/address/set-active/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to set active address');
      toast.success('Address set as active');
      setActiveId(id);
    } catch (err) {
      console.error(err);
      toast.error('Could not set address as active');
    }
  };

  const handlePlaceOrder = async () => {
    if (!activeId) {
      toast.warning('Please select an address first');
      return;
    }

    try {
      setPlacingOrder(true); // Start spinner
      const res = await fetch('http://localhost:8000/api/v1/orders/place', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to place order');

      const result = await res.json();
      setOrderAmount(result.totalAmount || 0);
      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to place order');
    } finally {
      setPlacingOrder(false); // Stop spinner
    }
  };

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold text-[#f60202] mb-4">📍 My Addresses</h1>

      {addresses.length > 0 ? (
        <div className="grid gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white p-4 rounded-md shadow-md border ${
                addr.id === activeId ? 'border-[#f61a02] bg-red-50' : 'border-gray-300'
              }`}
            >
              <p><strong>House No:</strong> {addr.houseNumber}</p>
              <p><strong>Street:</strong> {addr.street}</p>
              <p><strong>City:</strong> {addr.city}</p>
              <p><strong>District:</strong> {addr.district}</p>
              <p><strong>State:</strong> {addr.state}</p>
              <p><strong>Pin Code:</strong> {addr.pinCode}</p>
              <p><strong>Country:</strong> {addr.country}</p>

              <button
                onClick={() => handleSetActive(addr.id)}
                className={`mt-2 px-4 py-1 rounded-md text-white ${
                  addr.id === activeId ? 'bg-green-600' : 'bg-[#f61a02]'
                } hover:opacity-90 transition`}
              >
                {addr.id === activeId ? '✔ Active' : 'Set as Active'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No addresses found.</p>
      )}

      <div className="flex items-center gap-4 mt-6">
        <NavLink to="/add-address">
          <button className="bg-[#f61a02] text-white px-4 py-2 rounded-md hover:bg-[#c30000] transition-all">
            ➕ Add Address
          </button>
        </NavLink>

        <button
          onClick={handlePlaceOrder}
          disabled={!activeId || placingOrder}
          className={`px-6 py-2 rounded-md text-white transition flex items-center justify-center gap-2 ${
            activeId
              ? 'bg-[#f61a02] hover:bg-[#c30000]'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {placingOrder ? (
            <>
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
              Placing...
            </>
          ) : (
            '🛒 Place Order'
          )}
        </button>
      </div>

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold text-green-600 mb-2">✅ Order Placed!</h2>
            <p className="text-gray-700 mb-4">Your order has been placed successfully.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-[#f61a02] text-white rounded hover:bg-[#c30000] transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;
