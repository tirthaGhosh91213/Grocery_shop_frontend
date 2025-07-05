import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageNotFound from '../../pages/PageNotFound';
import AdminDashboard from '../pages/dashborad/Dashborad';
import AvailableProducts from '../pages/availableProducts/AvailableProducts';
import AddProduct from '../pages/addProduct/AddProduct';

const Routers = () => {
  return (
    <>
      <Routes>
        <Route path='/admin/dashborad' element={<AdminDashboard/>}/>
        <Route path='/admin/available-product' element={<AvailableProducts/>}/>
        <Route path='/admin/add-product' element={<AddProduct/>}/>
        <Route path='/*' element={<PageNotFound/>}/>
      </Routes>
    </>
  )
}

export default Routers;