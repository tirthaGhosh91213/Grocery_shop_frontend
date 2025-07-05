import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';
import PageNotFound from '../pages/PageNotFound';
import AdminDashboard from '../admin/pages/dashborad/Dashborad';
import AvailableProducts from '../admin/pages/availableProducts/AvailableProducts';
import AddProduct from '../admin/pages/addProduct/AddProduct';

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/*' element={<PageNotFound/>}/>
      </Routes>
    </>
  )
}

export default Routers;