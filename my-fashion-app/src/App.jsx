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


const App = () => {
  return (
    
    <div >
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/collection/:category?" element={<Collection />} />
      <Route path="/cart" element={<Cart/>} />
      <Route path="/productdetail" element={<ProductDetail/>} />
      <Route path="/search" element={<Search/>} />
      <Route path="/wishlist" element={<Wishlist/>} />
    
      
    </Routes>
    <Footer/>
    </div>
  
  );
};

export default App;

