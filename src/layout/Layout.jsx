import { useState, useEffect } from 'react';
import Routers from '../routers/Routers';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { CartContext, SearchContext } from '../Context/Context';
import { ToastContainer, Bounce } from 'react-toastify';

const Layout = () => {

  const [cart, setToCart] = useState(() => {
    const initialCarts = JSON.parse(localStorage.getItem('carts'));
    try {
      return initialCarts ? initialCarts : [];
    } catch (error) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('carts', JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
        <CartContext.Provider value={{ cart, setToCart }}>
          <Navbar />
          <Routers />
          <Footer />
        </CartContext.Provider>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce} />
      </SearchContext.Provider>
    </>
  )
}

export default Layout;