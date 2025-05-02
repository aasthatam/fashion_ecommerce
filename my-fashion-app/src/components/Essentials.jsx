// src/components/Essentials.js
import React from 'react';
import Sweater from "../assets/sweater.png";
import Dress from "../assets/dress.png";
import Shirt from "../assets/shirt.png";
import Pants from "../assets/pant.png";
import { useNavigate } from "react-router-dom";

const Essentials = () => {
  const navigate = useNavigate();

  const navigateToCategory = (category) => {
    navigate(`/collection/${category}`);
  };

  return (
    <section className="py-16 px-10">
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-left">Essentials of Seasons</h2>
        </div>

        {/* Sweaters */}
        <div
          className="relative cursor-pointer overflow-hidden rounded transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigateToCategory("sweaters")}
        >
          <img
            src={Sweater}
            alt="Sweaters"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-bold text-2xl">Sweaters</p>
          </div>
        </div>

        {/* Dresses */}
        <div
          className="relative cursor-pointer row-span-2 overflow-hidden rounded transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigateToCategory("dresses")}
        >
          <img
            src={Dress}
            alt="Dresses"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-bold text-2xl">Dresses</p>
          </div>
        </div>

        {/* Shirts */}
        <div
          className="relative cursor-pointer overflow-hidden rounded transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigateToCategory("shirts")}
        >
          <img
            src={Shirt}
            alt="Shirts"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-bold text-2xl">Shirts</p>
          </div>
        </div>

        {/* Pants */}
        <div
          className="relative cursor-pointer overflow-hidden rounded transition-transform duration-200 hover:scale-105 active:scale-95"
          onClick={() => navigateToCategory("pants")}
        >
          <img
            src={Pants}
            alt="Pants"
            className="w-full h-auto object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white font-bold text-2xl">Pants</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Essentials;
