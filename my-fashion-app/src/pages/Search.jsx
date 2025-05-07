import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import plusButton from "../assets/ei_plus.svg";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import { toast } from "react-toastify";

const Search = () => {
  const {
    products,
    search,
    setSearch,
    currency,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
  } = useContext(ShopContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchBasedRecommendations, setSearchBasedRecommendations] = useState([]);
  const [imageBasedRecommendations, setImageBasedRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const token = localStorage.getItem("token");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const saveKeyword = async () => {
      const keyword = debouncedSearch.trim();
      if (!token || keyword.length < 2) return;

      try {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        await fetch(`${backendUrl}/api/user/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({ userId, keyword })
        });
      } catch (err) {
        console.error("Search keyword save failed:", err);
      }
    };

    saveKeyword();
  }, [debouncedSearch, token]);

  useEffect(() => {
    const fetchSearchBasedRecommendations = async () => {
      if (!token) return;

      try {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const res = await fetch(`${backendUrl}/api/user/recent-search-recommendations`, {
          method: "POST",
          headers: { "Content-Type": "application/json", token },
          body: JSON.stringify({ userId })
        });

        const data = await res.json();
        if (data.success) {
          setSearchBasedRecommendations(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch keyword recommendations:", error);
      }
    };

    fetchSearchBasedRecommendations();
  }, [token]);

  const togglePopup = () => setShowPopup(!showPopup);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowPopup(false); // close popup immediately after choosing file
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "fashion_upload");

    try {
      const cloudinaryResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dyplzxqu8/image/upload",
        { method: "POST", body: formData }
      );

      const cloudinaryData = await cloudinaryResponse.json();
      const imageUrl = cloudinaryData.secure_url;

      const response = await fetch("http://localhost:4000/api/product/similar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();
      if (result.success) {
        setImageBasedRecommendations(result.similar_products);
      } else {
        console.error("Search failed:", result.message);
      }
    } catch (error) {
      console.error("Error during image search:", error);
    }

    setLoading(false);
    setSelectedFile(null);
  };

  const isItemLiked = (item) => {
    return wishlistItems.some(
      (w) => w._id === item._id && w.size === (item.size || "default")
    );
  };

  const toggleLike = (item) => {
    if (isItemLiked(item)) {
      removeFromWishlist(item._id, item.size || "default");
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(item._id, item.size || "default");
      toast.success("Added to wishlist");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const calculateDiscountedPrice = (price, tag) => {
    if (!tag || !tag.toLowerCase().includes("save")) return null;
    const match = tag.match(/(\d+)%/);
    const percent = match ? parseInt(match[1]) : 0;
    return price - (price * percent) / 100;
  };

  const renderProductCard = (item) => {
    const discountTag = Array.isArray(item.tags) ? item.tags[0] : null;
    const hasDiscount = discountTag?.toLowerCase().includes("save");
    const discountedPrice = hasDiscount ? calculateDiscountedPrice(item.price, discountTag) : null;
  
    return (
      <div key={item._id} className="relative group overflow-hidden">
        <Link to={`/product/${item._id}`}>
          <div className="overflow-hidden">
            <img
              src={Array.isArray(item.images) ? item.images[0] : item.images}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </Link>
  
        {/* Tag Label */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md z-10">
            {discountTag}
          </span>
        )}
  
        {/* Wishlist Button */}
        <button
          className="absolute top-2 right-2 text-gray-700 z-10"
          onClick={() => toggleLike(item)}
        >
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
            <img
              src={isItemLiked(item) ? heartIconFilled : heartIcon}
              alt="Heart"
              className="w-5 h-5"
            />
          </div>
        </button>
  
        {/* Product Info */}
        <div className="mt-3 text-center">
          <p className="text-sm">{item.name ?? "Unnamed"}</p>
          {hasDiscount ? (
            <>
              <p className="text-sm text-gray-500 line-through">
                {currency}{item.price.toFixed(2)}
              </p>
              <p className="text-lg font-semibold text-red-600">
                {currency}{discountedPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-lg font-medium">
              {currency}{typeof item.price === "number" ? item.price.toFixed(2) : "N/A"}
            </p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center px-4 py-10">
      {/* Search Bar + Upload */}
      <div className="relative flex items-center px-4 py-2 w-full max-w-md border-b border-gray-400">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="outline-none w-full text-sm md:text-base text-center bg-transparent placeholder-gray-500"
          value={search}
          onChange={handleInputChange}
        />
        <img
          src={plusButton}
          className="ml-2 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xl font-bold hover:bg-gray-100 rounded-full transition-colors"
          onClick={togglePopup}
          alt="Upload"
        />
        {showPopup && (
          <div className="absolute top-12 right-0 bg-white p-4 w-52 z-10 shadow">
            <p className="text-sm text-gray-700 mb-2">Upload image to search</p>
            <input type="file" className="hidden" id="fileInput" onChange={handleFileChange} />
            <label htmlFor="fileInput" className="block text-sm text-gray-600 cursor-pointer hover:underline">
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {selectedFile && (
        <button
          className="mt-4 bg-black text-white px-5 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
          onClick={handleUpload}
        >
          {loading ? "Searching..." : "Search by Image"}
        </button>
      )}

      {/* Image-Based Results */}
      {search.length === 0 && imageBasedRecommendations.length > 0 && (
        <div className="w-full max-w-6xl mt-14">
          <h2 className="text-xl font-semibold mb-4 text-center">Visually Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {imageBasedRecommendations.map(renderProductCard)}
          </div>
        </div>
      )}

      {/* Logged-in Personalized Recommendations */}
      {token && search.length === 0 && searchBasedRecommendations.length > 0 && (
        <div className="w-full max-w-6xl mt-14">
          <h2 className="text-xl font-semibold mb-4 text-center">Based on Your Recent Searches</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchBasedRecommendations.map(renderProductCard)}
          </div>
        </div>
      )}

      {/* Guest Default View */}
      {!token && search.length === 0 && products.length > 0 && (
        <div className="w-full max-w-6xl mt-14">
          <h2 className="text-xl font-semibold mb-4 text-center">Explore Our Latest Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map(renderProductCard)}
          </div>
        </div>
      )}

      {/* Filtered Search Results */}
      {search.length > 0 && (
        <div className="w-full max-w-6xl mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 8).map(renderProductCard)
          ) : (
            <p className="text-gray-500 text-center col-span-full mt-10">
              No results found for "<span className="font-medium">{search}</span>"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
