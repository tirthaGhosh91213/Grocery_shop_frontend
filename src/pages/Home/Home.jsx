import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { CartContext, SearchContext } from '../../Context/Context' //context hook
import Banner from '../../components/Banner/Banner'
import amul from '/images/products/amul.png'
import bakers from '/images/products/bakers.png'
import cheese from '/images/products/cheese.png'
import Juices from '/images/products/Juices.png'
import lays from '/images/products/lays.png'
import pasta from '/images/products/pasta.png'
import rich from '/images/products/rice.png'
import sauces from '/images/products/sauces.png'
import soup from '/images/products/soup.png'
import spices from '/images/products/spices.png'
import Navbar2 from '../../components/Navbar2/Navbar2'

const Home = () => {

  const [products, setProducts] = useState([
    {
      productName: "Knorr - Hot and Soups",
      img_url: soup,
      price: 50,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Amul Taaza Milky Milk",
      img_url: amul,
      price: 28,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Amul Diced Cheese",
      img_url: cheese,
      price: 120,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Bread - Baker's Choice",
      img_url: bakers,
      price: 35,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Pasta - Pastalicious",
      img_url: pasta,
      price: 90,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Rice - Bharat Rice",
      img_url: rich,
      price: 60,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Sauces",
      img_url: sauces,
      price: 85,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Spices",
      img_url: spices,
      price: 40,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Juices - Maaza",
      img_url: Juices,
      price: 70,
      btnText: "Add to Cart",
      quantity: 1
    },
    {
      productName: "Lays",
      img_url: lays,
      price: 20,
      btnText: "Add to Cart",
      quantity: 1
    }
  ])
  const { cart, setToCart } = useContext(CartContext);
  const { searchTerm } = useContext(SearchContext)

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = (product, index) => {
    const alreadyExists = cart.some(item => item.productName === product.productName);
    if (alreadyExists) {
      toast.warning("Item already added to the cart");
      return;
    }

    setToCart(prevCart => [...prevCart, product]);
    products[index].btnText = "Added to the Cart"
    toast.success("Item added to the card");
  }

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <Navbar2 />
      <Banner />
      <div className='w-[99%] rounded-xl bg-white m-4 px-2 py-5'>
        <h1 className='text-2xl m-3 font-bold relative inline-flex pb-1 after:absolute after:bottom-0 after:right-0 after:w-[70%] after:h-[2px] after:bg-[#b88008]'>Our Products</h1>

        <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-10 py-5'>
          {
            filteredProducts.length > 0 && filteredProducts.map((product, index) => (
              <div
                key={index}
                className='bg-[#f6f5f3] flex flex-col justify-evenly items-center gap-5 p-3 rounded-xl transition-all border-[0.4px] shadow-lg hover:border-indigo-500 hover:scale-[1.02] max-sm:p-2 w-full'
              >
                <div>
                  <img
                    src={product.img_url}
                    alt={product.productName}
                    className='h-[150px] w-[150px] rounded-lg hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <div className='text-center'>
                  <h1 className='text-xl font-semibold max-sm:text-sm'>{product.productName}</h1>
                  <h2 className='text-lg max-sm:text-sm'>Price - ₹{product.price}</h2>
                </div>
                <div>
                  <button
                    className='py-2 px-4 bg-[#f68402] text-white font-medium rounded-md hover:bg-[#e37200] transition-all'
                    onClick={() => handleAdd(product, index)}
                  >
                    {product.btnText}
                  </button>
                </div>
              </div>
            ))
          }
          {
            filteredProducts.length === 0 && (
              <div className='col-span-full text-center text-gray-500'>
                No products found for "{searchTerm}"
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home
