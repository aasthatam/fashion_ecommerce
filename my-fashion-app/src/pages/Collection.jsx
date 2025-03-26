import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import { colorOptions, categoryOptions, fabricsOptions, sortOptions, products } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate here

const FilterDropdown = ({ title, options, selectedOptions, onOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionChange = (option) => {
    onOptionChange(option);
  };

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
  const location = useLocation();
  
  const category = location.pathname.split('/')[2] || "collection"; // Default to 'collection'
  const navigate = useNavigate(); // Initialize useNavigate hook here

  // Define dynamic page titles based on the category
  const pageTitles = {
    "new-arrivals": "New Arrivals",
    "top": "Tops",
    "shirts": "Shirts",
    "sweaters": "Sweaters",
    "pants": "Pants",
    "dresses": "Dresses",
    "bottoms": "Bottoms",
    "bodysuits-and-jumpsuits": "Bodysuits & Jumpsuits",
    "collection": "Collection"
  };

  const [pageTitle, setPageTitle] = useState(pageTitles[category] || "Collection");

  // Update the title whenever the category changes
  useEffect(() => {
    setPageTitle(pageTitles[category] || "Collection");
  }, [category]); // Recalculate page title when category changes


  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the like status for the clicked product
    }));
  };

 
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleCategoryChange = (categoryName) => {
    const getCategoryKey = (name) => {
      return name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    };
  
    // Check if this is the currently selected category
    const categoryKey = getCategoryKey(categoryName);
    const isCurrentlySelected = category === categoryKey;
  
    // Toggle selection - if same category clicked, deselect it
    if (isCurrentlySelected) {
      // Deselect (return to collection)
      setSelectedCategories([]);
      navigate("/collection"); // Clean base URL
      setPageTitle("Collection");
    } else {
      // Select new category
      setSelectedCategories([categoryName]);
      navigate(`/collection/${categoryKey}`); // Clean category URL
      setPageTitle(pageTitles[categoryKey] || "Collection");
    }
  };

  const handleFabricChange = (fabric) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleSortChange = (sortOption) => {
    if (sortOption === sortBy) {
      // If the same option is clicked again, reset sorting (or set to a default state)
      setSortBy(""); 
    } else {
      setSortBy(sortOption); 
    }
  };

  const filteredProducts = products.filter((product) => {
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    const fabricMatch = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);
  
    // Handle "new-arrivals" special case
    if (category === "new-arrivals") {
      return product.isNewArrival && colorMatch && fabricMatch;
    }
  
    // Normal category filtering
    if (category !== "collection") {
      const normalize = (str) => str.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
      const productCategory = normalize(product.category);
      return productCategory === category && colorMatch && fabricMatch;
    }
  
    // Default collection view
    return colorMatch && fabricMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Best Selling") {
      // Sort products by bestselling status first (true comes before false)
      return b.bestselling ? 1 : -1; // True products come first
    } else if (sortBy === "Price, Low to High") {
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
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>

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
            onOptionChange={handleFabricChange} 
          />
        </div>
        <FilterDropdown 
          title="Sort By" 
          options={sortOptions}
          selectedOptions={[sortBy]}
          onOptionChange={handleSortChange} 
        />
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
