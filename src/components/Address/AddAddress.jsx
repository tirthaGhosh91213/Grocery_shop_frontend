import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAddress = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    houseNumber: '',
    street: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
    country: 'India',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://localhost:8000/api/v1/address/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to add address");
      }

      toast.success("Address added successfully");
      navigate("/address");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center text-[#f61a02] mb-4">➕ Add Address</h1>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {["houseNumber", "street", "city", "district", "state", "pinCode", "country"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="p-2 border rounded-md"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-[#f61a02] text-white py-2 rounded-md hover:bg-[#c30000] transition"
        >
          Save Address
        </button>
      </form>
    </div>
  );
};

export default AddAddress;
