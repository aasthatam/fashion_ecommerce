import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import NewArrivals from "../components/NewArrivals";
import Essentials from "../components/Essentials";
import Promotions from "../components/Promotions";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleViewNewArrivals = () => {
    navigate("/collection/new-arrivals");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`font-sans transition-opacity duration-1000 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Hero />
      <NewArrivals handleViewNewArrivals={handleViewNewArrivals} />
      <Essentials />
      <Promotions />
    </div>
  );
};

export default Home;
