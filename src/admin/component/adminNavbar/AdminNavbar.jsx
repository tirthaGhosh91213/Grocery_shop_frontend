import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/admin/login");
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
          to="/admin/dashborad"
          className={(navbar) =>
            navbar.isActive ? activeClass : inactiveClass
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/add-product"
          className={(navbar) =>
            navbar.isActive ? activeClass : inactiveClass
          }
        >
          Add Products with quantity
        </NavLink>

        <NavLink
          to="/admin/available-product"
          className={(navbar) =>
            navbar.isActive ? activeClass : inactiveClass
          }
        >
          Available Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={(navbar) =>
            navbar.isActive ? activeClass : inactiveClass
          }
        >
          All Orders
        </NavLink>

        <NavLink
          to="/admin/active-orders"
          className={(navbar) =>
            navbar.isActive ? activeClass : inactiveClass
          }
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
          <div className="w-8 h-8 bg-[#e63946] text-white flex justify-center items-center rounded-full font-bold">
            A
          </div>
          <span className="font-medium">Admin</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => {
                navigate("/admin/profile");
                setDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              View Profile
            </button>
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
