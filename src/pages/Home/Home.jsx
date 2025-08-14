import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CartContext, SearchContext } from '../../Context/Context';
import Banner from '../../components/Banner/Banner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { cart, setToCart } = useContext(CartContext);
  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/products');
        const result = await res.json();
        console.log("API result:", result);

        if (!Array.isArray(result.data)) {
          toast.error("Invalid product data format");
          return;
        }

        const productsWithBtn = result.data.map(p => ({
          id: p.id,
          productName: p.name,
          price: p.unitPrice,
          img_url: p.imageUrl,
          description: p.description,
          btnText: "Add to Cart",
          quantity: 1,
        }));

        setProducts(productsWithBtn);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to fetch products");
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    updated[index].quantity = Number(value);
    setProducts(updated);
  };

  const handleAdd = async (product, index) => {
    if (!product.quantity || product.quantity < 1) {
      toast.warning("Please enter a valid quantity");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: product.quantity
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.apiError || result.message || "Server error");
      }

      const updatedProducts = [...products];
      updatedProducts[index].btnText = "Added to the Cart";
      setProducts(updatedProducts);

      // Optionally update CartContext
      setToCart(prevCart => {
        const existingIndex = prevCart.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingIndex].quantity += product.quantity;
          return updatedCart;
        } else {
          return [...prevCart, { ...product }];
        }
      });

      toast.success("✅ Product successfully added to the cart");
    } catch (err) {
      console.error("Add to cart error:", err.message);
      toast.error("❌ Could not add to cart: " + err.message);
    }
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <Banner />
      <div className='w-[99%] rounded-xl bg-white m-4 px-2 py-5'>
        <h1 className='text-2xl m-3 font-bold relative inline-flex pb-1 after:absolute after:bottom-0 after:right-0 after:w-[70%] after:h-[2px] after:bg-[#b83a08]'>
          Our Products
        </h1>

        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-10 py-5'>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className='bg-[#f6f5f3] flex flex-col justify-evenly items-center gap-4 p-4 rounded-xl transition-all border-[0.4px] shadow-lg hover:border-indigo-500 hover:scale-[1.02] max-sm:p-2 w-full'
              >
                <img
                  src={product.img_url}
                  alt={product.productName}
                  className='h-[150px] w-[150px] rounded-lg hover:scale-110 transition-transform duration-300 object-cover'
                />
                <div className='text-center'>
                  <h1 className='text-xl font-semibold max-sm:text-sm'>{product.productName}</h1>
                  <h2 className='text-lg max-sm:text-sm'>Price - ₹{product.price}</h2>
                </div>
                <div className='flex items-center gap-2'>
                  <input
                    type='number'
                    min='1'
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className='w-20 px-2 py-1 rounded border border-gray-400'
                  />
                  <span className='text-sm'>Qty</span>
                </div>
                <button
                  className='py-2 px-4 bg-[#f63302] text-white font-medium rounded-md hover:bg-[#e30000] transition-all'
                  onClick={() => handleAdd(product, index)}
                >
                  {product.btnText}
                </button>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center text-gray-500'>
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
