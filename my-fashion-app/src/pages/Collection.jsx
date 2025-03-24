import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
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

const FilterDropdown = ({ title, options, selectedOptions, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionChange = (option) => {
    onOptionChange(option);
  }

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer text-sm text-gray-600 flex items-center justify-between w-28"
      >
        {title} {isOpen ? "−" : "+"}
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-2 bg-white shadow-md rounded-md p-3 w-44 z-10 border border-gray-200">
          {options.length > 0 ? (
            options.map((option, index) => (
              <label key={index} className="flex items-center text-sm space-x-2 py-1 cursor-pointer">
                <input 
                type="checkbox" 
                checked={selectedOptions.includes(option.name)}
                onChange={() => handleOptionChange(option.name)}
                className="appearance-none w-4 h-4 rounded-full border-2 border-gray-400 checked:bg-gray-500 checked:border-gray-500 transition-colors duration-200" 
                />
                <span>{option.name}</span>
                <span className="text-gray-500 text-xs ml-auto">({option.count})</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No options available</p>
          )}
        </div>
      )}
    </div>
  );
};

const Collection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [liked, setLiked] = useState({}); // State to track liked hearts
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [sortBy, setSortBy] = useState("");

  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the like status for the clicked product
    }));
  };

  const colorOptions = [
    { name: "Black", count: 6 },
    { name: "Blue", count: 20 },
    { name: "Brown", count: 10 },
    { name: "Neutral", count: 23 },
    { name: "Gray", count: 16 },
    { name: "Green", count: 12 },
    { name: "Pink", count: 10 },
    { name: "Red", count: 7 },
    { name: "White", count: 24 },
    { name: "Yellow", count: 29 },
  ];

  const categoryOptions = [
    { name: "Top", count: 6 },
    { name: "Sweaters", count: 20 },
    { name: "Pants", count: 10 },
    { name: "Dresses", count: 23 },
    { name: "Bottoms", count: 6 },
    { name: "Bodusuits  & Jumpsuits", count: 6 },
  ]

  const fabricsOptions = [
    { name: "Cotton", count: 6 },
    { name: "Silk", count: 23 },
    { name: "Nylon", count: 10 },
    { name: "Rayon", count: 12 },
    { name: "Wood-Silk", count: 20 },
    { name: "Viscose Jersy", count: 17 },
    { name: "Hemp", count: 8 },
  ]

  const sortOptions = [
    { name: "Best Selling" },
    { name: "Alphabetically, A-Z" },
    { name: "Alphabetically, Z-A" },
    { name: "Price, Low to High" },
    { name: "Price, High to Low" },
    { name: "Date, Old to New" },
    { name: "Date, New to Old" },

  ]

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
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleFabricChange = (fabric) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const filteredProducts = products.filter((product) => {
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const fabricMatch = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);
    return colorMatch && categoryMatch && fabricMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price, Low to High") {
      return a.price - b.price;
    } else if (sortBy === "Price, High to Low") {
      return b.price - a.price;
    } else if (sortBy === "Alphabetically, A-Z") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "Alphabetically, Z-A") {
      return b.name.localeCompare(a.name);
    } else {
      return 0;
    }
  });

  return (
    <div className="font-sans p-6 md:p-10">
      {/* Back Button */}
      <a href="/" className="text-gray-500 text-sm mb-4 inline-block hover:underline">
        ← Back to home
      </a>
      <h1 className="text-2xl font-semibold">Collection</h1>

      {/* Filters & Sort */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-6">
          <FilterDropdown 
          title="Color" 
          options={colorOptions} 
          selectedOptions={selectedColors}
          onOptionChange={handleColorChange}
          />
          <FilterDropdown 
          title="Categories" 
          options={categoryOptions}
          selectedOptions={selectedCategories}
          onOptionChange={handleCategoryChange}
           />
          <FilterDropdown 
          title="Fabrics" 
          options={fabricsOptions}
          selectedOptions={selectedFabrics}
          onOptionChange={handleFabricChange} />
        </div>
        <FilterDropdown 
        title="Sort By" 
        options={sortOptions}
        selectedOptions={[sortBy]}
        onOptionChange={handleSortChange} />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {sortedProducts.map((item) => (
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
            {/* Wishlist Button */}
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
      <div className="flex justify-center mt-10 space-x-6 items-center">
        {[1, 2, 3].map((page) => (
          <button
            key={page}
            className={`text-lg font-medium cursor-pointer ${currentPage === page ? "underline" : "text-black"}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button className="w-10 h-10 flex items-center justify-center border rounded-full">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Collection;
