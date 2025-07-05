import React from 'react'

const Navbar2 = () => {
  return (
    <div className="px-6 py-3 bg-[#1E293B] w-full shadow-md overflow-auto">
      <ul className="flex justify-around gap-3 text-white font-medium text-sm sm:text-base">
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200">
          Fruits & Veggies
        </li>
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200">
          Dairy & Bakery
        </li>
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200">
          Personal Care
        </li>
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200 max-md:hidden">
          Household Items
        </li>
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200 max-md:hidden">
          Beverages
        </li>
        <li className="cursor-pointer hover:text-yellow-300 transition-all duration-200 max-sm:hidden">
          Snacks
        </li>
      </ul>
    </div>
  )
}

export default Navbar2
