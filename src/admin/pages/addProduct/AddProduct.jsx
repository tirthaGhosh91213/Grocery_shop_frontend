import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {

  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();

  if(!isAdmin){
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      
    </div>
  )
}

export default AddProduct;