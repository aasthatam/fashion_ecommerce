import React, { useState, useEffect, useRef, useContext } from "react";
import searchIcon from "../assets/iconamoon_search-light.svg";
import profileIcon from "../assets/iconamoon_profile-light.svg";
import heartIcon from "../assets/solar_heart-linear.svg";
import bagIcon from "../assets/weui_shop-outlined.svg";
import arrowupIcon from "../assets/weui_arrow-outlinedup.svg";
import menuIcon from "../assets/material-symbols-light_menu-rounded.svg";
import dropdown from "../assets/dropdown_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  // const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [isAccountOpenDesktop, setIsAccountOpenDesktop] = useState(false);
  const [isAccountOpenMobile, setIsAccountOpenMobile] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const dropdownRef = useRef(null);
  // const accountRef = useRef(null);
  const accountRefDesktop = useRef(null);
  const accountRefMobile = useRef(null);

  // const {
  //   getCartCount,
  //   getWishlistCount,
  //   setCartItems,
  //   token,
  //   setToken,
  // } = useContext(ShopContext);
  const {
    getCartCount,
    getWishlistCount,
    token,
    logoutUser,
    backendUrl
  } = useContext(ShopContext);
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // const toggleAccountMenu = () => {
  //   setIsAccountOpen(!isAccountOpen);
  // };

  const toggleAccountMenuDesktop = () => {
    setIsAccountOpenDesktop((prev) => !prev);
  };
  
  const toggleAccountMenuMobile = () => {
    setIsAccountOpenMobile((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      // if (accountRef.current && !accountRef.current.contains(event.target)) {
      //   setIsAccountOpen(false);
      // }
      if (
        accountRefDesktop.current &&
        !accountRefDesktop.current.contains(event.target)
      ) {
        setIsAccountOpenDesktop(false);
      }
      if (
        accountRefMobile.current &&
        !accountRefMobile.current.contains(event.target)
      ) {
        setIsAccountOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${backendUrl}/api/user/notifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', token },
        });
        const data = await response.json();
        if (data.success) {
          const unread = data.notifications?.some(n => !n.read);
          setHasUnreadNotifications(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchUnreadNotifications();
  }, [token, backendUrl]);

  const location = useLocation();

    useEffect(() => {
      if (location.pathname === "/notifications") {
        setHasUnreadNotifications(false);
      }
    }, [location.pathname]);


  return (
    <header className="flex items-center justify-between px-4 md:px-8 lg:px-10 xl:px-12 py-4 shadow-md bg-white relative">
      {/* Mobile: Menu Icon Left, Logo Center */}
      <div className="relative flex w-full items-center justify-center lg:hidden">
        {/* Menu Icon (left) */}
        <div className="absolute left-0">
          <img
            onClick={() => setVisible(true)}
            src={menuIcon}
            className="w-6 h-6 cursor-pointer"
            alt="menu"
          />
        </div>

        {/* Centered Logo */}
        <Link
          to="/"
          className="text-2xl font-medium tracking-wide"
          style={{ fontFamily: "Inspiration, sans-serif" }}
        >
          WearNova
        </Link>

        {/* Right Icons */}
        <div className="absolute right-0 flex space-x-4 items-center">
          <Link to="/wishlist" className="relative">
            <img src={heartIcon} alt="Wishlist" className="w-5 h-5" />
            <p className="absolute -top-1 -right-1 w-5 h-5 text-xs text-center leading-5 bg-black text-white rounded-full">
              {getWishlistCount()}
            </p>
          </Link>
          <Link to="/cart" className="relative">
            <img src={bagIcon} alt="Cart" className="w-5 h-5" />
            <p className="absolute -top-1 -right-1 w-5 h-5 text-xs text-center leading-5 bg-black text-white rounded-full">
              {getCartCount()}
            </p>
          </Link>
          {
        token ? (
          <div className="relative" ref={accountRefMobile}>
            <img
              src={profileIcon}
              alt="User"
              className="w-5 h-5 cursor-pointer"
              onClick={toggleAccountMenuMobile}
            />
            {isAccountOpenMobile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                <ul className="text-sm">
                  <li>
                                <Link
                                  to="/profile"
                                  className="block px-4 py-2 hover:bg-gray-100"
                                  onClick={() => setIsAccountOpenMobile(false)}
                                >
                                  My Profile
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to="/orders"
                                  className="block px-4 py-2 hover:bg-gray-100"
                                  onClick={() => setIsAccountOpenMobile(false)}
                                >
                                  My Orders
                                </Link>
                              </li>
                              <li className="relative">
                              <Link
                                to="/notifications"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setIsAccountOpenDesktop(false)}
                              >
                                Notifications
                                {hasUnreadNotifications && (
                                  <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                              </Link>
                            </li>
                              <li
                                className="block px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                                onClick={() => {
                                  logoutUser();
                                  setIsAccountOpenMobile(false);
                                }}
                              >
                                Logout
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link to="/login">
                        <img src={profileIcon} alt="Login" className="w-5 h-5" />
                      </Link>
                    )
                  }

          <Link to="/search">
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </Link>

        </div>
      </div>

      {/* Desktop: Full Layout */}
      <div className="hidden lg:flex w-full justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-medium tracking-wide"
          style={{ fontFamily: "Inspiration, sans-serif" }}
        >
          WearNova
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-8 text-lg font-light">
          <Link to="/collection" className="hover:underline">
            Shop Now
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/Contact-us" className="hover:underline">
            Contact Us
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center hover:underline focus:outline-none"
            >
              More Options
              <img
                src={arrowupIcon}
                alt="arrow"
                className={`ml-1 w-4 h-4 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-md border border-gray-200 rounded-lg z-50">
                <ul>
                  <li>
                    <Link
                      to="/styleguide"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Style Guide
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Returns-and-refunds"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Returns & Exchange
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/Privacy-policy"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Icons */}
        <div className="flex space-x-6 items-center">
          <Link to="/wishlist" className="relative">
            <img src={heartIcon} alt="Wishlist" className="w-6 h-6" />
            <p className="absolute -top-1 -right-1 w-5 h-5 text-xs text-center leading-5 bg-black text-white rounded-full">
              {getWishlistCount()}
            </p>
          </Link>
          <Link to="/cart" className="relative">
            <img src={bagIcon} alt="Cart" className="w-6 h-6" />
            <p className="absolute -top-1 -right-1 w-5 h-5 text-xs text-center leading-5 bg-black text-white rounded-full">
              {getCartCount()}
            </p>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={accountRefDesktop}>
            {token ? (
              <>
                <img
                  src={profileIcon}
                  alt="User"
                  className="w-6 h-6 cursor-pointer"
                  onClick={toggleAccountMenuDesktop}
                />
                {isAccountOpenDesktop && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <ul className="text-sm">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setIsAccountOpenDesktop(false);
                
                          }}
                        >
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setIsAccountOpenDesktop(false);
                        }}
                        >
                          My Orders
                        </Link>
                      </li>
                      <li className="relative">
                        <Link
                          to="/notifications"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setIsAccountOpenDesktop(false)}
                        >
                          Notifications
                          {hasUnreadNotifications && (
                            <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                        </Link>
                      </li>
                      <li
                        className="block px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                        // onClick={() => {
                        //   setToken("");
                        //   localStorage.removeItem("token");
                        //   setIsAccountOpen(false);
                        //   setCartItems({});
                        //   toast.success("Logged out successfully!");
                        // }}
                        onClick={() => {
                          logoutUser();
                          setIsAccountOpenDesktop(false);
                        }}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <img src={profileIcon} alt="Login" className="w-6 h-6" />
              </Link>
            )}
          </div>

          <Link to="/search">
            <img src={searchIcon} alt="Search" className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Sidebar menu (Mobile only) */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-50 shadow-md transition-all duration-300 ${
          visible ? "w-64" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 mb-6 cursor-pointer"
          >
            <img src={dropdown} className="h-4 rotate-180" alt="Back" />
            <span>Back</span>
          </div>
          <nav>
            <ul className="flex flex-col space-y-4 text-lg font-light">
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/collection"
                  className="hover:underline"
                >
                  Shop Now
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/about"
                  className="hover:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/Contact-us"
                  className="hover:underline"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/styleguide"
                  className="hover:underline"
                >
                  Style Guide
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/Customer-support"
                  className="hover:underline"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/Returns-and-refunds"
                  className="hover:underline"
                >
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setVisible(false)}
                  to="/Privacy-policy"
                  className="hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
