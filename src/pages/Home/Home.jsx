import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CartContext, SearchContext } from '../../Context/Context';
import Banner from '../../components/Banner/Banner';

const toNumber = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [addedProduct, setAddedProduct] = useState(null); // New state for popup
  const { setToCart } = useContext(CartContext);
  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/products');
        const result = await res.json();

        if (!Array.isArray(result?.data)) {
          toast.error('Invalid product data format');
          return;
        }

        const mapped = result.data.map((p) => {
          const discountPercentage =
            toNumber(
              p.discountPercentage ??
              p.discount?.discountPercentage ??
              p.discount?.percentage,
              0
            );

          const durationInHours =
            toNumber(
              p.durationInHours ??
              p.discount?.durationInHours ??
              p.discount?.duration ??
              p.discountDurationHours,
              0
            );

          return {
            id: p.id,
            productName: p.name,
            price: toNumber(p.unitPrice, 0),
            img_url: p.imageUrl,
            description: p.description,
            btnText: 'Add to Cart',
            quantity: 1,
            discountPercentage,
            durationInHours,
            discountEndTime: durationInHours > 0
              ? Date.now() + durationInHours * 60 * 60 * 1000
              : null
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const discountedProducts = products.filter((p) => p.discountPercentage > 0);
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (index, value) => {
    const updated = [...products];
    updated[index].quantity = Math.max(1, toNumber(value, 1));
    setProducts(updated);
  };

  const handleAdd = async (product, index) => {
    if (!product.quantity || product.quantity < 1) {
      toast.warning('Please enter a valid quantity');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Authentication token not found. Please log in.');
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: product.quantity,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.apiError || result.message || 'Server error');
      }

      // Update product card button
      const updatedProducts = [...products];
      updatedProducts[index].btnText = 'Added';
      setProducts(updatedProducts);

      // Update cart context
      setToCart((prevCart) => {
        const existingIndex = prevCart.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          const updatedCart = [...prevCart];
          updatedCart[existingIndex].quantity += product.quantity;
          return updatedCart;
        } else {
          return [...prevCart, { ...product }];
        }
      });

      // Set popup state
      setAddedProduct(product);

      // Auto hide popup after 3 seconds
      setTimeout(() => setAddedProduct(null), 3000);

      toast.success('✅ Product successfully added to the cart');
    } catch (err) {
      console.error('Add to cart error:', err.message);
      toast.error('❌ Could not add to cart: ' + err.message);
    }
  };

  // Countdown timer
  const useCountdown = (endTime) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      if (!endTime) return;

      const interval = setInterval(() => {
        const diff = endTime - Date.now();
        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft('Expired');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [endTime]);

    return timeLeft;
  };

  const PriceBlock = ({ price, discountPercentage }) => {
    if (discountPercentage > 0) {
      const discounted = (price * (1 - discountPercentage / 100)).toFixed(2);
      return (
        <div className="flex flex-col items-center">
          <div className="text-lg font-semibold">
            ₹{discounted}{' '}
            <span className="line-through text-gray-500 text-sm ml-1">₹{price}</span>
          </div>
        </div>
      );
    }
    return <h2 className="text-lg max-sm:text-sm">Price - ₹{price}</h2>;
  };

  const DiscountBadge = ({ discountPercentage }) =>
    discountPercentage > 0 ? (
      <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow">
        -{discountPercentage}% OFF
      </span>
    ) : null;

  const DurationLabel = ({ endTime }) => {
    const timeLeft = useCountdown(endTime);
    return endTime ? (
      <p className={`text-sm ${timeLeft === 'Expired' ? 'text-gray-500' : 'text-red-600'} mt-1`}>
        ⏳ {timeLeft === 'Expired' ? 'Offer ended' : `Ends in ${timeLeft}`}
      </p>
    ) : null;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center relative">
      {searchTerm.trim() === '' && <Banner />}

      {discountedProducts.length > 0 && (
        <div className="w-[99%] rounded-xl bg-yellow-50 m-4 px-2 py-5 shadow-lg border border-yellow-300">
          <h1 className="text-2xl m-3 font-bold text-yellow-800">🎉 Limited Time Discounts</h1>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-4">
            {discountedProducts.map((product, index) => (
              <div
                key={`disc-${product.id}`}
                className="relative bg-white flex flex-col justify-evenly items-center gap-4 p-4 rounded-xl border shadow-md hover:shadow-lg transition"
              >
                <DiscountBadge discountPercentage={product.discountPercentage} />
                <img
                  src={product.img_url}
                  alt={product.productName}
                  className="h-[150px] w-[150px] rounded-lg object-cover"
                />
                <div className="text-center">
                  <h1 className="text-xl font-semibold">{product.productName}</h1>
                  <PriceBlock price={product.price} discountPercentage={product.discountPercentage} />
                  <DurationLabel endTime={product.discountEndTime} />
                </div>
                <button
                  className="py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-all"
                  onClick={() => handleAdd(product, index)}
                >
                  {product.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="w-[99%] rounded-xl bg-white m-4 px-2 py-5">
        <h1 className="text-2xl m-3 font-bold relative inline-flex pb-1 after:absolute after:bottom-0 after:right-0 after:w-[70%] after:h-[2px] after:bg-[#b83a08]">
          Our Products
        </h1>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-10 py-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="relative bg-[#f6f5f3] flex flex-col justify-evenly items-center gap-4 p-4 rounded-xl transition-all border-[0.4px] shadow-lg hover:border-indigo-500 hover:scale-[1.02] max-sm:p-2 w-full"
              >
                <DiscountBadge discountPercentage={product.discountPercentage} />
                <img
                  src={product.img_url}
                  alt={product.productName}
                  className="h-[150px] w-[150px] rounded-lg hover:scale-110 transition-transform duration-300 object-cover"
                />
                <div className="text-center">
                  <h1 className="text-xl font-semibold max-sm:text-sm">{product.productName}</h1>
                  <PriceBlock price={product.price} discountPercentage={product.discountPercentage} />
                  <DurationLabel endTime={product.discountEndTime} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-20 px-2 py-1 rounded border border-gray-400"
                  />
                  <span className="text-sm">Qty</span>
                </div>
                <button
                  className="py-2 px-4 bg-[#f63302] text-white font-medium rounded-md hover:bg-[#e30000] transition-all"
                  onClick={() => handleAdd(product, index)}
                >
                  {product.btnText}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* Popup modal for added product */}
      {addedProduct && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50 animate-slide-in">
          ✅ {addedProduct.productName} added to cart!
        </div>
      )}
    </div>
  );
};

export default Home;
