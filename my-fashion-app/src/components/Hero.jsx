// src/components/Hero.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Img1 from "../assets/Rectangle1.webp";
import Img2 from "../assets/Rectangle2.webp";
import Img3 from "../assets/Rectangle3.webp";
import Img4 from "../assets/Rectangle4.webp";

const Hero = () => {
  const navigate = useNavigate();
  const slides = [
    {
      image: Img1,
      text: "Effortless style, timeless fashion",
    },
    {
      image: Img2,
      text: "Bold trends for every season",
    },
    {
      image: Img3,
      text: "Redefine your wardrobe",
    },
    {
      image: Img4,
      text: "Confidence in every look",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative text-center py-0 overflow-hidden">
      <img
        src={slides[currentSlide].image}
        alt="Fashion banner"
        className="w-full h-[75vh] sm:h-[80vh] md:h-[85vh] object-cover transition-opacity duration-1000 ease-in-out"
        key={currentSlide}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/30">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
          {slides[currentSlide].text}
        </h1>
        <button
          className="mt-6 bg-black text-white py-3 px-6 rounded transition hover:bg-white hover:text-black hover:scale-105 cursor-pointer"
          onClick={() => navigate("/collection")}
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Hero;

