import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken('');
    toast.success("Logged out successfully!");
    navigate("/login"); // optional: redirect to login
  };

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
        onClick={handleLogout}
        className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
