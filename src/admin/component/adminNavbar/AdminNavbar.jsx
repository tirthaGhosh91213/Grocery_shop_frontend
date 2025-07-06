import React from 'react'
import { NavLink } from 'react-router-dom';

const AdminNavbar = () => {

  //styles
  const activeClass = "px-4 py-2 bg-[#f68402] text-white rounded-md hover:bg-[#e37200] transition";
  const inactiveClass = "px-4 py-2 border border-[#f68402] text-[#f68402] rounded-md hover:bg-[#f68402] hover:text-white transition";


  return (
    <>
      <div className="w-full flex justify-center items-center gap-4 my-6 flex-wrap">
        <NavLink to="/admin/dashborad" className={(navbar) => navbar.isActive? activeClass : inactiveClass}><button>Dashboard</button></NavLink>
        <NavLink to="/admin/add-product" className={(navbar) => navbar.isActive? activeClass : inactiveClass}><button>Add Products with quantity</button></NavLink>
        <NavLink to="/admin/available-product" className={(navbar) => navbar.isActive? activeClass : inactiveClass}><button>Available Products</button></NavLink>
      </div>
    </>
  )
}

export default AdminNavbar;
