import React, { useState, useEffect, useContext } from "react";
import { ChevronRight } from "lucide-react";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import {  sortOptions, hexToColorName } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 8; // Number of products per page

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
  const { products, currency, wishlistItems, addToWishlist, removeFromWishlist } = useContext(ShopContext); // Using products from ShopContext
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const category = location.pathname.split('/')[2] || "collection";

  const pageTitles = {
    "new-arrivals": "New Arrivals",
    "tops": "Tops",
    "shirts": "Shirts",
    "outerwears": "Outerwears",
    "sweaters": "Sweaters",
    "pants": "Pants",
    "dresses": "Dresses",
    "bottoms": "Bottoms",
    "bodysuits-and-jumpsuits": "Bodysuits & Jumpsuits",
    "collection": "Collection"
  };

  const [pageTitle, setPageTitle] = useState(pageTitles[category] || "Collection");

  useEffect(() => {
    setPageTitle(pageTitles[category] || "Collection");
  }, [category]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, selectedColors, selectedFabrics, sortBy]);

  const handleWishlistToggle = (product) => {
    const size = product.size || "default";
    const isWishlisted = wishlistItems.some(item => item._id === product._id && item.size === size);
  
    if (isWishlisted) {
      removeFromWishlist(product._id, size);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product._id, size);
      toast.success("Added to wishlist");
    }
  
    // Notify other components if needed
    window.dispatchEvent(new CustomEvent("wishlistUpdated", {
      detail: wishlistItems
    }));
  };
  

  const handleColorChange = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleCategoryChange = (categoryName) => {
    const getCategoryKey = (name) => name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
    const categoryKey = getCategoryKey(categoryName);
    const isCurrentlySelected = category === categoryKey;

    if (isCurrentlySelected) {
      setSelectedCategories([]);
      navigate("/collection");
      setPageTitle("Collection");
    } else {
      setSelectedCategories([categoryName]);
      navigate(`/collection/${categoryKey}`);
      setPageTitle(pageTitles[categoryKey] || "Collection");
    }
  };

  const handleFabricChange = (fabric) => {
    setSelectedFabrics(prev =>
      prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]
    );
  };

  const handleSortChange = (sortOption) => {
    setSortBy(prev => prev === sortOption ? "" : sortOption);
  };

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    const hexColors = Array.isArray(product.colors) ? product.colors : [product.colors].filter(Boolean);
    const colorNames = hexColors.map(hex => hexToColorName[hex.toLowerCase()] || "").filter(Boolean);
    const colorMatch = selectedColors.length === 0 || colorNames.some(name => selectedColors.includes(name));
    const fabricMatch = selectedFabrics.length === 0 || selectedFabrics.includes(product.fabric);
  
    if (category === "new-arrivals") {
      return product.isNewArrival && colorMatch && fabricMatch;
    }
  
    if (category !== "collection") {
      const normalize = (str) => str.toLowerCase().replace(/\s+/g, '-').replace('&', 'and');
      const productCategory = normalize(product.category);
      return productCategory === category && colorMatch && fabricMatch;
    }
  
    return colorMatch && fabricMatch;
  });
  

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Best Selling") return b.bestselling ? 1 : -1;
    if (sortBy === "Price, Low to High") return a.price - b.price;
    if (sortBy === "Price, High to Low") return b.price - a.price;
    if (sortBy === "Alphabetically, A-Z") return a.name.localeCompare(b.name);
    if (sortBy === "Alphabetically, Z-A") return b.name.localeCompare(a.name);
    return 0;
  });

  // Pagination calculations
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const generateColorCounts = () => {
    const colorMap = {};
  
    products.forEach(product => {
      const hexColors = Array.isArray(product.colors) ? product.colors : [product.colors].filter(Boolean);
      hexColors.forEach(hex => {
        const colorName = hexToColorName[hex.toLowerCase()];
        if (colorName) {
          colorMap[colorName] = (colorMap[colorName] || 0) + 1;
        }
      });
    });
  
    return Object.entries(colorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // Optional: sort by count
  };

  const generateCategoryCounts = () => {
    const categoryMap = {};
    products.forEach(product => {
      const category = product.category;
      if (category) {
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      }
    });
  
    return Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
      key: name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')
    }));
  };

  const generateFabricCounts = () => {
    const fabricMap = {};
    products.forEach(product => {
      const fabric = product.fabric;
      if (fabric) {
        fabricMap[fabric] = (fabricMap[fabric] || 0) + 1;
      }
    });
  
    return Object.entries(fabricMap).map(([name, count]) => ({
      name,
      count
    }));
  };
  
  const dynamicColorOptions = generateColorCounts();

  return (
    <div className="font-sans p-6 md:p-10">
      <a href="/" className="text-gray-500 text-sm mb-4 inline-block hover:underline">
        ← Back to home
      </a>
      <h1 className="text-2xl font-semibold">{pageTitle}</h1>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-6">
          <FilterDropdown 
            title="Color" 
            options={dynamicColorOptions} 
            selectedOptions={selectedColors}
            onOptionChange={handleColorChange}
          />
          <FilterDropdown 
            title="Categories" 
            options={generateCategoryCounts()}
            selectedOptions={selectedCategories}
            onOptionChange={handleCategoryChange}
          />
          <FilterDropdown 
            title="Fabrics" 
            options={generateFabricCounts()}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {paginatedProducts.map((item) => (
          <div key={item._id} className="relative group overflow-hidden">
            <Link to={`/product/${item._id}`}>
              <div className="overflow-hidden">
                <img 
                  src={Array.isArray(item.images) ? item.images[0] : item.images} 
                  alt={item.name} 
                  className="w-full h-full transition-transform duration-300 group-hover:scale-110" 
                />
              </div>
            </Link>
            {Array.isArray(item.tags) && item.tags.length > 0 && item.tags[0] && (
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md">
                {item.tags[0]}
              </span>
            )}
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={() => handleWishlistToggle(item)}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
              <img
                  src={
                    wishlistItems.some(wItem => wItem._id === item._id)
                      ? heartIconFilled
                      : heartIcon
                  }
                  alt="Heart"
                  className="w-5 h-5"
                />
              </div>
            </button>
            <div className="mt-3 text-center">
              <p className="text-sm">{item.name}</p>
              <p className="text-lg font-medium">{currency}{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 space-x-3 items-center">
          {/* Left Arrow Button */}
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center border rounded-full disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                className={`px-3 text-lg ${currentPage === pageNum ? "underline font-semibold" : "text-gray-600 hover:underline"}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && <span className="mx-2">...</span>}

          {/* Right Arrow Button */}
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center border rounded-full disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Collection;
