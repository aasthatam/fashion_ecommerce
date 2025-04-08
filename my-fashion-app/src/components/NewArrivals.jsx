// src/components/NewArrivals.js
import React from 'react';
import { Link } from 'react-router-dom';
import Image from "../assets/image.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.png";

const NewArrivals = ({ handleViewNewArrivals }) => {
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-semibold">New Arrivals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 mt-8">
        {[ 
          { id: 1, name: "Neck High Waisted Mini Dress", price: "Rs. 2500.00", image: Image },
          { id: 2, name: "Halter Neck Ribbed Cropped Top", price: "Rs. 1500.00", image: Image2 },
          { id: 3, name: "Long Sleeve Lapel Collar Blazer", price: "Rs. 3000.00", image: Image3 },
        ].map((item, index) => (
          <div key={index} className="text-center relative">
            <Link to={`/product/${item.id}`}>
              <div className="group overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </Link>
            <div className="mt-2">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-6 border border-gray-900 px-6 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition"
        onClick={handleViewNewArrivals}
      >
        View More
      </button>
    </section>
  );
};

export default NewArrivals;

