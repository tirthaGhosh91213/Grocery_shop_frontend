// import React, { useRef, useState, useContext } from 'react';
// import { FiChevronRight } from 'react-icons/fi';
// import { SearchContext } from '../../Context/Context';

// const Navbar2 = () => {
//   const scrollRef = useRef(null);
//   const [allItemTypes] = useState([
//     "Fruits & Veggies", "Dairy & Bakery", "Personal Care",
//     "Household Items", "Beverages", "Snacks"
//   ]);

//   const { setSearchTerm } = useContext(SearchContext);

//   const scrollRight = () => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollBy({
//         left: 150,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const handleSearchType = (e) => {
//     const searchType = e.target.innerText;
//     setSearchTerm(searchType);

//     // Optional: scroll back to start
//     if (scrollRef.current) {
//       scrollRef.current.scrollTo({
//         left: 0,
//         behavior: 'smooth'
//       });
//     }
//   };

//   return (
//     <div className="relative px-4 py-3 bg-[#1E293B] w-full shadow-md">
//       <div ref={scrollRef} className="overflow-x-auto no-scrollbar">
//         <ul className="flex gap-4 text-white font-medium text-sm sm:text-base whitespace-nowrap min-w-max pr-6 justify-around">
//           {allItemTypes.map((item, index) => (
//             <li
//               className="cursor-pointer hover:text-yellow-300 transition-all duration-200"
//               key={index}
//               onClick={handleSearchType}
//             >
//               {item}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Right Scroll Button (Mobile only) */}
//       <button
//         onClick={scrollRight}
//         className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#1E293B] p-1 rounded-full shadow-md sm:hidden"
//       >
//         <FiChevronRight className="text-yellow-300 text-xl" />
//       </button>
//     </div>
//   );
// };

// export default Navbar2;
