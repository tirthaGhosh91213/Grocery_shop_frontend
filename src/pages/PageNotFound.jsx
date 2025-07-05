import React from 'react'
import { NavLink } from 'react-router'

const PageNotFound = () => {
  return (
    <div>
     <h1 className='w-[100vw] h-[50vh] flex flex-col justify-center items-center text-3xl'>
      <p>Page Not Found</p>
      <NavLink to='/'><button className="m-6 py-2 px-6 bg-[#f68402] font-semibold text-white rounded-md hover:bg-[#d96a00] transition-all inline-flex">Go back to Home page</button></NavLink>
     </h1>
    </div>
  )
}

export default PageNotFound