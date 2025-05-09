import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import { toast } from "react-toastify";

const calculateDiscountedPrice = (price, tag) => {
  if (!tag || !tag.toLowerCase().includes("save")) return null;
  const match = tag.match(/(\d+)%/);
  const percent = match ? parseInt(match[1]) : 0;
  return price - (price * percent) / 100;
};

const StyleGuide = () => {
  const { currency, wishlistItems, addToWishlist, removeFromWishlist } = useContext(ShopContext);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bodyShape, setBodyShape] = useState(null);
  const [description, setDescription] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
  const timer = setTimeout(() => {
    setIsVisible(true);
  }, 100);
  return () => clearTimeout(timer);
}, []);

  useEffect(() => {
    const stored = localStorage.getItem("styleGuideData");
    if (stored) {
      const data = JSON.parse(stored);
      setImageUploaded(true);
      setImagePreview(data.imagePreview);
      setResultImageUrl(data.resultImageUrl);
      setBodyShape(data.shape);
      setDescription(data.description);
      setRecommendedProducts(data.recommendedProducts);
    }
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setImagePreview(reader.result);
        setImageUploaded(true);
        setErrorMessage(null);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("height", 160);

        try {
          setLoading(true);
          const response = await axios.post("http://localhost:5000/predict", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const shape = response.data.shape;
          setBodyShape(shape);

          try {
            const token = localStorage.getItem("token");
            if (token) {
              await axios.put("http://localhost:4000/api/user/body-shape", { bodyShape: shape }, {
                headers: { token }
              });
            }
          } catch (err) {
            console.error("Failed to store body shape:", err);
          }

          setDescription(response.data.description);
          setResultImageUrl(response.data.result_image_url);

          setLoadingRecommendations(true);
          const recResponse = await axios.get(`http://localhost:4000/api/product/recommendations?shape=${shape.toLowerCase()}`);
          setRecommendedProducts(recResponse.data.products);

          localStorage.setItem("styleGuideData", JSON.stringify({
            imagePreview: reader.result,
            resultImageUrl: response.data.result_image_url,
            shape: response.data.shape,
            description: response.data.description,
            recommendedProducts: recResponse.data.products
          }));
        } catch (error) {
          console.error("Error uploading image or fetching recommendations:", error);
          let msg = "An error occurred. Please try again.";
          if (error.response?.data?.error) msg = error.response.data.error;
          if (error.response?.data?.detail) msg = error.response.data.detail;
          toast.error(msg);
          setErrorMessage(msg);
          setBodyShape(null);
          setDescription(null);
          setRecommendedProducts([]);
        } finally {
          setLoading(false);
          setLoadingRecommendations(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("styleGuideData");
    setImageUploaded(false);
    setImagePreview(null);
    setBodyShape(null);
    setDescription(null);
    setResultImageUrl(null);
    setRecommendedProducts([]);
    setErrorMessage(null);
  };

  return (
    <div
  className={`flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 transition-all duration-1000 ease-in-out transform ${
    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`}
>
      <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
        Find Your Perfect Style Based on Your Body Type
      </h1>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-8">
        {/* Left: Upload and Preview */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
            {loading ? (
              <div className="text-gray-500 animate-pulse">Processing...</div>
            ) : imagePreview ? (
              <img src={imagePreview} alt="Uploaded preview" className="w-full object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-64">
                <p className="text-gray-600 text-sm text-center px-6">Upload your image here</p>
              </div>
            )}
          </div>

          <label className="mt-4 w-full bg-black text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-gray-700">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            Upload Image
          </label>

          {!imageUploaded && (
            <div className="mt-3 text-sm text-gray-600 text-center px-2">
              <p>Upload a clear, front-facing full body photo.</p>
              <p>Avoid sitting, angled poses, or group shots.</p>
            </div>
          )}

          {imageUploaded && !loading && (
            <p className="text-center text-sm text-green-600 mt-3 font-medium">Upload Successful</p>
          )}

          {imageUploaded && (
            <button onClick={handleReset} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Upload Another Image
            </button>
          )}
        </div>

        {/* Right: Result & Recommendations */}
        {imageUploaded && (
          <div className="flex flex-col w-full md:w-2/3">
            {errorMessage ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center text-base font-medium">{errorMessage}</div>
            ) : (
              <>
                {bodyShape && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 text-center md:text-left">
                      Your Body Type: {bodyShape}
                    </h2>
                    <p className="text-gray-600 mb-6">{description}</p>
                    {resultImageUrl && (
                      <button
                    onClick={async () => {
                      const url = `http://localhost:5000${resultImageUrl}`;
                      const response = await fetch(url);
                      const blob = await response.blob();
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = "analyzed_result.jpg";
                      link.click();
                      URL.revokeObjectURL(link.href);
                    }}
                     className="inline-block bg-black text-white text-sm px-4 py-2 rounded border border-black hover:bg-white hover:text-black transition"
                  >
                    Download Analyzed Image
                  </button>
                    )}
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
                  Our Recommendations
                </h3>

                {loadingRecommendations ? (
                  <div className="text-center text-gray-500 animate-pulse">Loading Recommendations...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recommendedProducts.length > 0 ? (
                      recommendedProducts.map((product) => {
                        const isWishlisted = wishlistItems.some(item => item._id === product._id);
                        const handleWishlistToggle = (e) => {
                          e.preventDefault();
                          if (isWishlisted) {
                            removeFromWishlist(product._id, "default");
                            toast.info("Removed from wishlist");
                          } else {
                            addToWishlist(product._id, "default");
                            toast.success("Added to wishlist");
                          }
                        };

                        return (
                          <div key={product._id} className="relative group flex flex-col items-center">
                            <button className="absolute top-2 right-2 z-10" onClick={handleWishlistToggle}>
                              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer">
                                <img src={isWishlisted ? heartIconFilled : heartIcon} alt="Wishlist" className="w-5 h-5" />
                              </div>
                            </button>
                            <Link to={`/product/${product._id}`} className="group w-full flex flex-col items-center transition">
                              <div className="w-full overflow-hidden">
                                {Array.isArray(product.tags) && product.tags[0]?.toLowerCase().includes("save") && (
                                  <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md z-10">
                                    {product.tags[0]}
                                  </span>
                                )}
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className={`w-full h-auto object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 ${isVisible ? 'scale-100' : 'scale-110'}`}
                                />
                              </div>
                              <div className="mt-2 text-center">
                                <p className="text-sm font-medium text-gray-800">{product.name}</p>
                                {Array.isArray(product.tags) && product.tags[0]?.toLowerCase().includes("save") ? (
                                  <>
                                    <p className="text-xs text-gray-500 line-through">
                                      {currency}{product.price.toFixed(2)}
                                    </p>
                                    <p className="text-sm font-semibold text-red-600">
                                      {currency}{calculateDiscountedPrice(product.price, product.tags[0]).toFixed(2)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {currency}{product.price.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-500 col-span-2 md:col-span-3">No Recommendations Found</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleGuide;

