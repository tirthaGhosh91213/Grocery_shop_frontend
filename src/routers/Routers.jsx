import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';
import Checkout from '../pages/Checkout/Checkout'
import PageNotFound from '../pages/PageNotFound';
import Signup from '../pages/SignUp/SignUp';
import LogIn from '../pages/LogIn/LogIn';
import AdminDashboard from '../admin/pages/dashborad/AdminDashborad';
import AvailableProducts from '../admin/pages/availableProducts/AvailableProducts';
import AddProduct from '../admin/pages/addProduct/AddProduct';

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        
        {/* Admin Routes */}
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<LogIn/>}/>

        <Route path='/admin/dashborad' element={<AdminDashboard />} />
        <Route path='/admin/available-product' element={<AvailableProducts />} />
        <Route path='/admin/add-product' element={<AddProduct />} />

        <Route path='/*' element={<PageNotFound/>}/>
      </Routes>
    </>
  )
}

export default Routers;