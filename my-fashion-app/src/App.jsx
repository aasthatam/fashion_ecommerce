import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import CustomerSupport from "./pages/CustomerSupport";
import StyleGuide from "./pages/StyleGuide";
import PlaceOrder from "./pages/PlaceOrder";
import OrderDetails from "./pages/OrderDetails";
import { ToastContainer } from 'react-toastify';
import ResetPasswordPage from "./pages/ResetPasswordPage";
import PaymentSuccess from "./pages/PaymentSuccess";


const App = () => {
  return (
    
    <div >
    <ToastContainer/>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/collection/:category?" element={<Collection />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/product/:id" element={<ProductDetail/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/wishlist" element={<Wishlist/>} />
      <Route path="/place-order" element={<PlaceOrder/>} />
      <Route path="/orders" element={<OrderDetails/>} />
      <Route path="/:section" element={<CustomerSupport/>} />
      <Route path="/styleguide" element={<StyleGuide/>} />
      <Route path="/reset-password" element={<ResetPasswordPage/>} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
  
    </Routes>
    <Footer/>
    </div>
  
  );
};

export default App;

