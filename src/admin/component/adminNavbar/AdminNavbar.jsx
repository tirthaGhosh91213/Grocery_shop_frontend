import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin"); // Default name

  useEffect(() => {
    const storedName = localStorage.getItem("adminName");
    if (storedName && storedName.trim() !== "") {
      setAdminName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("adminName");
    navigate("/login");
  };

  const activeClass =
    "px-4 py-2 bg-[#e63946] text-white rounded-md hover:bg-[#c53030] transition";
  const inactiveClass =
    "px-4 py-2 border border-[#e63946] text-[#e63946] rounded-md hover:bg-[#e63946] hover:text-white transition";

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-gray-100 shadow-md flex-wrap relative">
      {/* Left Navigation */}
      <div className="flex gap-4 flex-wrap">
        <NavLink
          to="/admin"
          end // ✅ Only active for exact "/admin"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/add-product"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Add Products with quantity
        </NavLink>

        <NavLink
          to="/admin/available-product"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Available Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          All Orders
        </NavLink>

        <NavLink
          to="/admin/active-orders"
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          Active Orders
        </NavLink>
      </div>

      {/* Profile Section with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          {/* Circle with first letter of name */}
          <div className="w-8 h-8 bg-[#e63946] text-white flex justify-center items-center rounded-full font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>

          {/* Full name */}
          <span className="font-medium">{adminName}</span>

          {/* Dropdown arrow */}
          <svg
            className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
