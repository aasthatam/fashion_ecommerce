import React, { useState, useRef } from 'react'; 
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { products } from "../assets/assets";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";

function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState({});
  const [isProductLiked, setIsProductLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRef = useRef(null); // Added useRef declaration

  // Find the product by id
  const product = products.find((prod) => prod.id === parseInt(id));

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Product not found</div>;
  }

  // Get first 4 products as recommendations (excluding current product)
  const recommendedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 8);


  const toggleProductLike = () => {
    setIsProductLiked(!isProductLiked);
  };

  const toggleLike = (productId) => {
    setLiked(prev => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Scroll thumbnails left/right
  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Ensure image is always treated as an array
  const productImages = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <a href="/" className="text-gray-500 text-sm mb-4 inline-block hover:underline">
          ← Back to home
        </a>
      </div>

      {/* Product Detail Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="relative">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name} 
              className="w-full h-[800px] object-cover"
            />
            {/* Navigation Buttons (only show if multiple images) */}
            {productImages.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1))}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
                  onClick={() => setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0))}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            {/* Like Button */}
            <button className="absolute top-2 right-2 text-gray-700" onClick={toggleProductLike}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
                <img src={isProductLiked ? heartIconFilled : heartIcon} alt="Heart" className="w-5 h-5" />
              </div>
            </button>
          </div>
          
          {/* Thumbnail Carousel */}
          {productImages.length > 1 && (
            <div className="relative mt-4">
              {/* Left scroll button */}
              <button 
                onClick={() => scrollThumbnails('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Thumbnail container */}
              <div 
                ref={thumbnailRef}
                className="flex space-x-2 overflow-x-auto scrollbar-hide py-2"
                style={{ scrollbarWidth: 'none' }}
              >
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 cursor-pointer border-2 ${
                      selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Right scroll button */}
              <button 
                onClick={() => scrollThumbnails('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-medium mb-2">{product.name}</h1>
          <p className="text-xl mb-1">Rs. {product.price.toFixed(2)}</p>
          {product.code && (
            <p className="text-gray-500 text-sm mb-4">CODE: {product.code}</p>
          )}
          <p className={`text-sm mb-4 ${product.availability === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            {product.availability || "In Stock"}
          </p>

          {/* Color Options (if available) */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm mb-2">Color</p>
              <div className="flex space-x-2">
                {product.colors.map((color, index) => (
                  <div 
                    key={index} 
                    className="w-6 h-6 rounded-full border border-gray-300" 
                    style={{ backgroundColor: color }} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Options (if available) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button 
                    key={size} 
                    className={`w-10 h-10 border flex items-center justify-center ${
                      selectedSize === size ? "border-black" : "border-gray-300"
                    }`} 
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm mb-2">Quantity</p>
              <div className="flex items-center border border-gray-300 w-fit rounded-md px-2 py-1">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-lg hover:bg-gray-200 transition focus:outline-none focus:ring-0 active:outline-none"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="px-6 py-2 text-lg font-medium">{quantity}</div>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 text-lg hover:bg-gray-200 transition focus:outline-none focus:ring-0 active:outline-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>


          {/* Details (if available) */}
          {product.details && product.details.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Details</h3>
              <ul className="text-sm space-y-1">
                {product.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <button className="px-6 py-3 rounded-md border border-black bg-white text-black flex-1 hover:bg-gray-100 transition">
                Add to bag
              </button>
              <button className="px-6 py-3 rounded-md bg-black text-white flex-1 hover:bg-gray-800 transition">
                Add to wishlist
              </button>
            </div>
            <button className="w-full py-3 rounded-md bg-black text-white hover:bg-gray-800 transition">
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl text-center mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="relative group">
                <div className="relative">
                  <img 
                    src={Array.isArray(product.image) ? product.image[0] : product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Like Button */}
                  <button
                    className="absolute top-2 right-2 text-gray-700"
                    onClick={() => toggleLike(product.id)}
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
                      <img
                        src={liked[product.id] ? heartIconFilled : heartIcon}
                        alt="Heart"
                        className="w-5 h-5"
                      />
                    </div>
                  </button>
                  {/* Tag */}
                  {product.tag && (
                    <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                      {product.tag}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-sm">{product.name}</h3>
                  <p className="text-sm font-medium">Rs. {product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;