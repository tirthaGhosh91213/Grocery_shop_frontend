import { useState, useEffect } from 'react'
import Routers from '../routers/Routers'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import { CartContext } from '../Context/Context'
import { ToastContainer, Bounce } from 'react-toastify'
import AdminNavbar from '../admin/component/adminNavbar/AdminNavbar';

const Layout = () => {

  const [cart, setToCart] = useState(() => {
    const initialCarts = JSON.parse(localStorage.getItem('carts'));
    try {
      return initialCarts ? initialCarts : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('carts', JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <CartContext.Provider value={{ cart, setToCart }}>
        <Navbar />
        <Routers />
        <Footer />
      </CartContext.Provider>
      <ToastContainer
        position="top-right"
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
    </>
  )
}

export default Layout;