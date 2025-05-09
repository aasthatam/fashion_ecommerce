// src/components/NewArrivals.js
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from "../assets/image.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";
import { ShopContext } from '../context/ShopContext';

const NewArrivals = ({handleViewNewArrivals}) => {
  const { products } = useContext(ShopContext);
  const { currency } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() =>{
    const newArrivals = products.filter(item => item.isNewArrival);
    setLatestProducts(newArrivals.slice(0, 3));
  }, [products]);

  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-semibold">New Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-8">
        {
        latestProducts.map((item, index) => (
          <div key={index} className="text-center relative">
            <Link to={`/product/${item._id}`}>
              <div className="group overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className={`w-full h-auto object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 ${isVisible ? 'scale-100' : 'scale-110'}`}
                />
              </div>
            </Link>
            <div className="mt-2">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">{currency}{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))
        }
      </div>
      <button
        className="mt-6 border border-gray-900 px-6 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition cursor-pointer"
        onClick={handleViewNewArrivals}
      >
        View More
      </button>
    </section>
  )
};

export default NewArrivals;

