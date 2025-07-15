import React from 'react'
import { NavLink } from 'react-router'

const PageNotFound = () => {
  return (
    <div>
     <h1 className='w-[100vw] h-[50vh] flex flex-col justify-center items-center text-3xl'>
      <p>Page Not Found</p>
      <NavLink to='/'><button className="m-5 bg-[#f61e02] text-white py-2 px-4 rounded-xl hover:bg-[#e30000]">Go back to Home page</button></NavLink>
     </h1>
    </div>
  )
}

export default PageNotFound