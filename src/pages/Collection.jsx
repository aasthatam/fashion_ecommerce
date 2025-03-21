import React, { useState } from "react";
import { ChevronLeft, Heart } from "lucide-react";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import Shirt1 from "../assets/shirt1.png";
import Shirt2 from "../assets/shirt2.png";
import Shirt3 from "../assets/shirt3.png";
import Shirt4 from "../assets/shirt4.png";
import Shirt5 from "../assets/shirt5.png";
import Shirt6 from "../assets/shirt6.png";
import Shirt7 from "../assets/shirt7.png";
import Shirt8 from "../assets/shirt8.png";
import Shirt9 from "../assets/shirt9.png";
import Shirt10 from "../assets/shirt10.png";
import Shirt11 from "../assets/shirt11.png";
import Shirt12 from "../assets/shirt12.png";

const Collection = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [liked, setLiked] = useState({}); // State to track liked hearts
  
    const toggleLike = (id) => {
      setLiked((prev) => ({
        ...prev,
        [id]: !prev[id], // Toggle the like status for the clicked product
      }));
    };
  
    const products = [
      { id: 1, name: "Basic Bae Full Size Ribbed Round Neck Long T-Shirt", price: 1500, image: Shirt1 },
      { id: 2, name: "Round Neck Tiered Tank Top", price: 3000, image: Shirt2 },
      { id: 3, name: "Lantern Sleeve O-neck Casual Party Tunic Blouse", price: 3000, image: Shirt3 },
      { id: 4, name: "Full Size Ribbed Round Neck Short Sleeve T-Shirt", price: 1500, image: Shirt4 },
      { id: 5, name: "Simon Longsleeve Top", price: 2500, image: Shirt5 },
      { id: 6, name: "Blouse with Notched Neck", price: 3000, image: Shirt6, tag: "Save 20%" },
      { id: 7, name: "Halter Neck Blouse With Keyhole Back", price: 2500, image: Shirt7 },
      { id: 8, name: "Urban Solid Color Lapel Long Sleeves Blouse", price: 2700, image: Shirt8, tag: "Save 20%" },
      { id: 9, name: "Full Size Round Neck Tank Top", price: 3000, image: Shirt9 },
      { id: 10, name: "Mads Turtleneck Top", price: 3000, image: Shirt10, tag: "Save 20%" },
      { id: 11, name: "Lace Top with High Neck", price: 2200, image: Shirt11 },
      { id: 12, name: "Swiss Dot Blouse with Shirred Flounce Sleeve", price: 3000, image: Shirt12 },
    ];
  return (
    <div className="font-sans p-6 md:p-10">
      {/* Back Button */}
      <a href="/" className="text-gray-500 text-sm mb-4 inline-block hover:underline">
        ← Back to home
      </a>
      <h1 className="text-2xl font-semibold">Shirts</h1>

       {/* Filters & Sort */}
       <div className="flex justify-between items-center mt-4">
        <div className="flex gap-6 text-sm text-gray-600">
          <div className="cursor-pointer">Color +</div>
          <div className="cursor-pointer">Categories +</div>
          <div className="cursor-pointer">Fabrics +</div>
        </div>
        <div className="cursor-pointer text-sm text-gray-600">Sort By +</div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products.map((item) => (
          <div key={item.id} className="relative group overflow-hidden">
            {/* Image */}
            <div className="overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full transition-transform duration-300 group-hover:scale-110" />
            </div>
            {/* Discount Tag */}
            {item.tag && (
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">
                {item.tag}
              </span>
            )}
           {/* Wishlist Button with custom heart icon */}
           <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => toggleLike(item.id)} // Toggle like on click
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
                <img
                  src={liked[item.id] ? heartIconFilled : heartIcon} // Use filled heart when liked
                  alt="Heart"
                  className="w-5 h-5"
                />
              </div>
            </button>
            {/* Product Details */}
            <div className="mt-3 text-center">
              <p className="text-sm">{item.name}</p>
              <p className="text-lg font-medium">Rs. {item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-4">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`w-8 h-8 flex items-center justify-center border rounded-full ${
              currentPage === page ? "bg-black text-white" : "bg-gray-100"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Collection;
