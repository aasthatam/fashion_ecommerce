import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../assets/iconamoon_search-light.svg";
import profileIcon from "../assets/iconamoon_profile-light.svg";
import heartIcon from "../assets/solar_heart-linear.svg";
import bagIcon from "../assets/weui_shop-outlined.svg";
import arrowupIcon from "../assets/weui_arrow-outlinedup.svg";
import menuIcon from "../assets/material-symbols-light_menu-rounded.svg"
import { Link } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
      {/* Left Section - Logo */}
      <Link to="/" className="text-2xl font-medium tracking-wide" style={{ fontFamily: "Inspiration, sans-serif" }}>
        WearNova
      </Link>

      {/* Mobile Menu Button */}
      <button onClick={toggleMobileMenu} className="lg:hidden flex items-center">
        <img src={menuIcon} alt="menu" className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="absolute left-0 top-0 w-64 h-full bg-white shadow-md p-4 z-50">
          <ul className="flex flex-col space-y-4 text-lg font-light">
            <li><a href="/collection" className="hover:underline">Shop Now</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
            <li><a href="/Contact-us" className="hover:underline">Contact Us</a></li>
            <li><a href="/styleguide" className="hover:underline">Style Guide</a></li>
            <li><a href="/Customer-support" className="hover:underline">Customer Support</a></li>
            <li><a href="/Returns-and-refunds" className="hover:underline">Returns & Exchange</a></li>
            <li><a href="/Privacy-policy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </nav>
      )}

      {/* Center Section - Navigation (Web version) */}
      <nav className="hidden lg:flex flex-1 justify-center space-x-8 text-lg font-light">
        <ul className="flex space-x-8">
          <li><a href="/collection" className="hover:underline">Shop Now</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="/Contact-us" className="hover:underline">Contact Us</a></li>
          <li className="relative" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="flex items-center hover:underline focus:outline-none">
              More Options
              <img src={arrowupIcon} alt="arrow" className={`ml-1 w-4 h-4 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-md border border-gray-200 rounded-lg z-50">
                <ul>
                  <li><a href="/styleguide" className="block px-4 py-2 hover:bg-gray-100">Style Guide</a></li>
                  <li><a href="/Customer-support" className="block px-4 py-2 hover:bg-gray-100">Customer Support</a></li>
                  <li><a href="/Returns-and-refunds" className="block px-4 py-2 hover:bg-gray-100">Returns & Exchange</a></li>
                  <li><a href="/Privacy-policy" className="block px-4 py-2 hover:bg-gray-100">Privacy Policy</a></li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Right Section - Icons */}
      <div className="flex space-x-6 items-center">
        <a href="/wishlist">
          <img src={heartIcon} alt="Wishlist" className="w-6 h-6 cursor-pointer hover:opacity-75" />
        </a>
        <a href="/cart">
          <img src={bagIcon} alt="Cart" className="w-6 h-6 cursor-pointer hover:opacity-75" />
        </a>
        <a href="/login">
          <img src={profileIcon} alt="Profile" className="w-6 h-6 cursor-pointer hover:opacity-75" />
        </a>
        <a href="/search">
          <img src={searchIcon} alt="Search" className="w-6 h-6 cursor-pointer hover:opacity-75" />
        </a>
      </div>
    </header>
  );
};

export default Header;


