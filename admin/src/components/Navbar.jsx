import React from 'react';
import { Link } from "react-router-dom";

const Navbar = ({setToken}) => {
  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between shadow-md bg-white">
      <Link 
        to="/" 
        className="text-3xl tracking-wide text-gray-800 hover:text-black transition-all"
        style={{ fontFamily: "Inspiration, sans-serif" }}
      >
        WearNova
      </Link>
      <button 
        onClick = {() =>setToken('')}
        className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
