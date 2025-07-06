import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import SearchIcon from '/images/search.svg'
import CartIcon from '/images/cartIcon.svg'
import ProfileIcon from '/images/profileIcon.svg'
import { CartContext } from '../../Context/Context'

const Navbar = () => {

  const [search, setSearch] = useState("")
  const { cart, setToCart } = useContext(CartContext);
  const cartLen = cart.length;

  return (
    <>
      <nav className="py-3 px-4 bg-[#fff8f0] flex justify-between items-center border-b-2 border-[#ffc773] sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <p className="px-2 font-semibold text-2xl max-sm:px-1 max-sm:text-xl text-[#f68402]">GetGrocery</p>
        </div>

        <div className="flex justify-start items-center inputHoverWidth">
          <input
            type="search"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-[300px] p-2 px-4 text-sm sm:text-base border border-[#ffcf8b] focus:outline-[#f68402] rounded-l-full indexWidth max-sm:w-[200px]"
            placeholder="Search for items..."
            required
          />
          <button className="bg-[#f68402] p-2 rounded-r-full hover:bg-[#e17200] transition">
            <img src={SearchIcon} alt="search" className="h-5 invert" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <NavLink
            to="/cart"
            className="rounded-full p-1 bg-[#ffc773] hover:bg-[#fcae3b] relative"
          >
            <img src={CartIcon} alt="Cart icon" className="w-7" />
            <span className="text-[10px] absolute -top-1 -right-1 bg-[#ff5733] rounded-full px-1.5 py-0.5 text-white">{cartLen}</span>
          </NavLink>

          <NavLink
            to="/profile"
            className="rounded-full p-1 bg-[#ffc773] hover:bg-[#fcae3b]"
          >
            <img
              src={ProfileIcon}
              alt="Profile icon"
              className='w-7'
            />
          </NavLink>
        </div>
      </nav>
    </>
  )
}

export default Navbar
