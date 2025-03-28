import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../assets/iconamoon_search-light.svg";
import profileIcon from "../assets/iconamoon_profile-light.svg";
import heartIcon from "../assets/solar_heart-linear.svg";
import bagIcon from "../assets/weui_shop-outlined.svg";
import arrowupIcon from "../assets/weui_arrow-outlinedup.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
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

      {/* Center Section - Navigation */}
      <nav className="flex-1 flex justify-center">
        <ul className="flex space-x-8 text-lg font-light">
          <li><a href="/collection" className="hover:underline">Shop Now</a></li>
          <li><a href="/about" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact Us</a></li>
          <li className="relative" ref={dropdownRef}>
            {/* More Options Button */}
            <button
              onClick={toggleDropdown}
              className="flex items-center hover:underline focus:outline-none"
            >
              More Options
              <img
                src={arrowupIcon}
                alt="arrow"
                className={`ml-1 w-4 h-4 transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-md border border-gray-200 rounded-lg z-50">
                <ul>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Style Guide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Customer Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Returns & Exchange
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Privacy Policy
                    </a>
                  </li>
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


