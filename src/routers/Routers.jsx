import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Address from '../components/Address/Address';
import AddAddress from '../components/Address/AddAddress';
import Profile from '../pages/Profile/Profile';
import Checkout from '../pages/Checkout/Checkout';
import Signup from '../pages/SignUp/SignUp';
import LogIn from '../pages/LogIn/LogIn';
import AdminDashboard from '../admin/pages/dashborad/AdminDashborad';
import AvailableProducts from '../admin/pages/availableProducts/AvailableProducts';
import AddProduct from '../admin/pages/addProduct/AddProduct';
import PageNotFound from '../pages/PageNotFound';
import AdminOrders from '../admin/pages/orders/orders';
import AdminActiveOrders from '../admin/pages/AllActiveOrders/activeOrders';

const Routers = () => {
  return (
    <Routes>
      {/* User routes with layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="address" element={<Address />} />
        <Route path="add-address" element={<AddAddress />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login" element={<LogIn />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/dashborad" element={<AdminDashboard />} />
      <Route path="/admin/available-product" element={<AvailableProducts />} />
      
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/active-orders" element={<AdminActiveOrders />} />

      {/* 404 */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default Routers;
