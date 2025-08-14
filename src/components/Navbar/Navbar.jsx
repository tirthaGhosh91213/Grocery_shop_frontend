import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SearchIcon from '/images/search.svg';
import CartIcon from '/images/cartIcon.svg';
import ProfileIcon from '/images/profileIcon.svg';
import { CartContext, SearchContext } from '../../Context/Context';

const Navbar = () => {
  const { cart } = useContext(CartContext);
  const cartLen = cart.length;
  const { setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="py-3 px-4 bg-[#fff0f0] border-b-2 border-[#ff7373] sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-2xl text-[#f60202] max-sm:text-xl">Darbhanga Dairy</p>

        {/* Search bar - Desktop */}
        <div className="hidden sm:flex items-center group">
          <input
            type="search"
            name="search"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-[300px] p-2 px-4 text-sm sm:text-base border border-[#ff978b] focus:outline-none rounded-l-full transition-all duration-300 group-hover:shadow-md group-hover:w-[320px]"
            placeholder="Search for items..."
          />
          <button className="bg-[#f60202] p-2 rounded-r-full hover:bg-[#e10000] transition">
            <img src={SearchIcon} alt="search" className="h-5 invert" />
          </button>
        </div>

        {/* Right-side icons */}
        <div className="flex items-center gap-4">
          <NavLink
            to="/cart"
            className="rounded-full p-1 bg-[#ff4c4c] hover:bg-[#f72626] relative"
          >
            <img src={CartIcon} alt="Cart" className="w-7" />
            <span className="text-[10px] absolute -top-1 -right-1 bg-[#ff3333] rounded-full px-1.5 py-0.5 text-white">
              {cartLen}
            </span>
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className="rounded-full p-1 bg-[#ff4c4c] hover:bg-[#f72626]"
              >
                <img src={ProfileIcon} alt="Profile" className="w-7" />
              </NavLink>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-[#f60202] text-white text-sm px-4 py-1.5 rounded hover:bg-[#e10000] transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Search bar - Mobile */}
      <div className="flex sm:hidden mt-2 items-center group">
        <input
          type="search"
          name="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-[300px] p-2 px-4 text-sm sm:text-base border border-[#ff978b] focus:outline-none rounded-l-full transition-all duration-300 group-hover:shadow-md group-hover:w-[320px]"
          placeholder="Search for items..."
        />
        <button className="bg-[#f60202] p-2 rounded-r-full hover:bg-[#e10000] transition">
          <img src={SearchIcon} alt="search" className="h-5 invert" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
