import React from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroImg from "../assets/Rectangle1.png";
import Image from "../assets/image.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import Shirt from "../assets/shirt.png";
import Pants from "../assets/pant.png";
import Sweater from "../assets/sweater.png";
import Dress from "../assets/dress.png";
import Fashion from "../assets/fashion.png";
import Sales from "../assets/sales.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="font-sans">
    
    {/* Hero Section */}
      <section className="relative text-center py-0">
        <img
          src={HeroImg}
          alt="Fashion model"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
          <h1 className="text-4xl font-bold">Effortless style, timeless fashion</h1>
          <button className="mt-4 bg-black text-white py-2 px-4 rounded transition hover:bg-white hover:text-black hover:scale-105"
          onClick={() => navigate("/collection")}>Shop Now</button>
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-8">
          {[ 
            { name: "Neck High Waisted Mini Dress", price: "Rs. 2500.00", image: Image },
            { name: "Halter Neck Ribbed Cropped Top", price: "Rs. 1500.00", image: Image2 },
            { name: "Long Sleeve Lapel Collar Blazer", price: "Rs. 3000.00", image: Image3 },
          ].map((item, index) => (
            <div key={index} className="text-center relative">
              {/* Image with zoom effect */}
              <div className="group overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
              {/* Static Text Content */}
              <div className="mt-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 border border-gray-900 px-6 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition">View More</button>
      </section>

      <section className="py-16 px-10">
        {/* Grid Layout */}
        <div className="grid grid-cols-3 grid-rows-2 gap-4">
          {/* Title Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-left">
              Essentials of Seasons
            </h2>
          </div>

          {/* Sweaters */}
          <div className="relative group">
            <img
              src={Sweater}
              alt="Sweaters"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-black font-bold text-lg px-2 py-1 rounded">
                Sweaters
              </p>
            </div>
          </div>

          {/* Dresses */}
          <div className="relative group row-span-2">
            <img
              src={Dress}
              alt="Dresses"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-black font-bold text-lg px-2 py-1 rounded">
                Dresses
              </p>
            </div>
          </div>

          {/* Shirts */}
          <div className="relative group">
            <img
              src={Shirt}
              alt="Shirts"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-black font-bold text-lg px-2 py-1 rounded">
                Shirts
              </p>
            </div>
          </div>

          {/* Pants */}
          <div className="relative group">
            <img
              src={Pants}
              alt="Pants"
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-black font-bold text-lg px-2 py-1 rounded">
                Pants
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Promotions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 py-16 px-10">
        <div className="relative text-center">
          <img src={Fashion} alt="Modern Edge" className="w-full h-[300px] object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
            <h3 className="text-xl font-bold">Timeless fashion, modern edge</h3>
            <button className="mt-2 bg-black text-white px-4 py-2 rounded transition hover:bg-white hover:text-black hover:scale-105">Discover Now</button>
          </div>
        </div>
        <div className="relative text-center">
          <img src={Sales} alt="Clearance Sale" className="w-full h-[300px] object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
            <h3 className="text-xl font-bold">Clearance Sales Up to 70% off</h3>
            <button className="mt-2 bg-black text-white px-4 py-2 rounded transition hover:bg-white hover:text-black hover:scale-105">Discover Now</button>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default Home;
