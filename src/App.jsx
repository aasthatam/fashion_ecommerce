import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import Collection from "./pages/Collection";


const App = () => {
  return (
    
    <div >
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createaccount" element={<CreateAccount />} />
      <Route path="/collection" element={<Collection/>} />
      
    </Routes>
    <Footer/>
    </div>
  
  );
};

export default App;

