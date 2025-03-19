import React from 'react';
import facebookIcon from "../assets/ic_baseline-facebook.svg";
import instagramIcon from "../assets/mdi_instagram.svg";
import twitterIcon from "../assets/proicons_x-twitter.svg";

const Footer = () => {
  return (
    <footer className="bg-white px-16 py-10">
      <div className="border-t border-black-300 w-full mb-8 "></div>
      {/* Top Section */}
      <div className="flex justify-between border-b pb-8">
        {/* Logo Section */}
        <div>
          <h3 className="text-3xl font-medium" style={{ fontFamily: "Inspiration, sans-serif" }}>
            WearNova
          </h3>
        </div>

        {/* Navigation Section */}
        <div className="flex space-x-16">
          <div>
            <h4 className="font-semibold mb-2">Shop</h4>
            <ul className="text-gray-600 space-y-1">
              <li><a href="#" className="hover:underline">Shop Now</a></li>
              <li><a href="#" className="hover:underline">New Arrivals</a></li>
              <li><a href="#" className="hover:underline">Trending Styles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Customer Support</h4>
            <ul className="text-gray-600 space-y-1">
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Shipping & Delivery</a></li>
              <li><a href="#" className="hover:underline">Returns & Exchange</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="max-w-sm">
          <h4 className="font-semibold mb-2">Stay Ahead with Fashion Trends</h4>
          <p className="text-gray-600 text-sm mb-4">
            Subscribe to our newsletter for the latest trends, features, and exclusive offers just for you.
          </p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="border rounded-full px-4 py-2 flex-grow focus:outline-none"
            />
            <button className="bg-black text-white px-6 py-2 rounded-full ml-2">
              Subscribe
            </button>
          </div>

          {/* Follow Us Section Below Newsletter */}
          <div className="mt-20 flex flex-col items-start ml-60">
            <p className="text-gray-700 font-medium mb-2">Follow Us</p>
            <div className="flex space-x-4">
              <a href="#"><img src={facebookIcon} alt="Facebook" className="w-5 h-5" /></a>
              <a href="#"><img src={instagramIcon} alt="Instagram" className="w-5 h-5" /></a>
              <a href="#"><img src={twitterIcon} alt="Twitter X" className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-center items-center mt-6 text-sm text-gray-600">
        <p>© 2025 WearNova. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
