import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Image2 from "../assets/image2.png";
import Image4 from "../assets/image4.png";
import Image5 from "../assets/image5.png";
import Image6 from "../assets/image6.png";
import Shirt4 from "../assets/shirt4.png";
import Shirt2 from "../assets/shirt2.png";
import Shirt9 from "../assets/shirt9.png";
import Shirt8 from "../assets/shirt8.png";
import Sweater from "../assets/cassiancardigan.png";
import Coat from "../assets/trenchcoat.png";
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";

function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState({}); // Track liked state for recommended products
  const [isProductLiked, setIsProductLiked] = useState(false); // Track liked state for the main product
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);

  // Toggle like for recommended products
  const toggleLike = (id) => {
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the like status for the clicked product
    }));
  };

  // Toggle like for the main product
  const toggleProductLike = () => {
    setIsProductLiked((prev) => !prev); // Toggle the like status for the main product
  };

  const productImages = [Image4, Image5, Image6];

  const colorOptions = [
    { name: 'Nude', color: '#d3b8a0' },
    { name: 'Brown', color: '#8b572a' },
    { name: 'Black', color: '#000000' },
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL'];

  const recommendedProducts = [
    {
      id: 1,
      name: 'Full Size Ribbed Round Neck Short Sleeve T-Shirt',
      price: 'Rs. 1500.00',
      image: Shirt4,
    },
    {
      id: 2,
      name: 'Round Neck Tiered Tank Top',
      price: 'Rs. 2200.00',
      image: Shirt2,
    },
    {
      id: 3,
      name: 'Full Size Round Neck Tank Top',
      price: 'Rs. 2000.00',
      image: Shirt9,
    },
    {
      id: 4,
      name: 'Urban Solid Chic Lapel Long Sleeve Blouse',
      price: 'Rs. 2700.00',
      image: Shirt8,
      tag: '40% off',
    },
    {
      id: 5,
      name: 'The Coassian Cardigan',
      price: 'Rs. 4000.00',
      image: Sweater,
    },
    {
      id: 6,
      name: 'Khaki Room Flap Double Breasted Trench Coat',
      price: 'Rs. 5500.00',
      image: Coat,
      tag: 'New',
    },
  ];

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

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
              alt="Halter Neck Ribbed Cropped Top"
              className="w-full h-auto"
            />
            {/* Navigation Buttons */}
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev > 0 ? prev - 1 : productImages.length - 1
                )
              }
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev < productImages.length - 1 ? prev + 1 : 0
                )
              }
            >
              <ChevronRight size={20} />
            </button>
            {/* Like Button for Main Product */}
            <button
              className="absolute top-2 right-2 text-gray-700"
              onClick={toggleProductLike} // Toggle like for the main product
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
                <img
                  src={isProductLiked ? heartIconFilled : heartIcon} // Use filled heart when liked
                  alt="Heart"
                  className="w-5 h-5"
                />
              </div>
            </button>
          </div>
          {/* Thumbnails */}
          <div className="flex mt-4 space-x-2">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 ${
                  selectedImage === index ? 'border-black' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-20 h-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="w-full md:w-1/2">
          <h1 className="text-xl font-medium mb-2">Halter Neck Ribbed Cropped Top</h1>
          <p className="text-xl mb-1">Rs. 1500.00</p>
          <p className="text-gray-500 text-sm mb-4">CODE: CLAS-746</p>

          <div className="mb-4">
            <p className="text-sm text-green-600">Availability: In Stock</p>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <div className="flex space-x-2">
              {colorOptions.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color.color }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <p className="text-sm mb-2">Size</p>
            <div className="flex space-x-2">
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`w-8 h-8 border ${
                    selectedSize === size ? 'border-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm mb-2">Quantity</p>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 p-2 w-32"
            />
          </div>

          {/* Details */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Details</h3>
            <ul className="text-sm space-y-1">
              <li>• Soft cotton material</li>
              <li>• Ethical manufacturing</li>
              <li>• Halter neck style</li>
              <li>• Moderate stretch</li>
              <li>• Premium bamboo fibers</li>
              <li>• Quick-dry technology</li>
              <li>• Ribbed texture</li>
              <li>• Hand wash cold</li>
              <li>• Hang dry for best results</li>
              <li>• Ribbed design for extra comfort</li>
              <li>• Perfect for layering</li>
              <li>• Body fits snug - if between sizes, order a size up</li>
              <li>• Made with fabric that's been specially treated to be wrinkle-free</li>
              <li>• Finished with premium stitching for durability</li>
              <li>• Ribbed texture keeps its shape after wash and wear</li>
              <li>• Body length: 18 in (for size S) / Waist width: 11 in (for size S)</li>
              <li>• Dimensions may vary by size</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-4">
            <button className="px-6 py-3 border border-black bg-white text-black flex-1">
              Add to bag
            </button>
            <button className="px-6 py-3 bg-black text-white flex-1">
              Add to wishlist
            </button>
          </div>

          <button className="w-full py-3 bg-black text-white">Buy it now</button>
        </div>
      </div>

      {/* Recommendations Section */}
      <div>
        <h2 className="text-xl text-center mb-8">Have you seen these</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="relative group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-auto"
                />
                {/* Like Button for Recommended Products */}
                <button
                  className="absolute top-2 right-2 text-gray-700"
                  onClick={() => toggleLike(product.id)} // Toggle like on click
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white">
                    <img
                      src={liked[product.id] ? heartIconFilled : heartIcon} // Use filled heart when liked
                      alt="Heart"
                      className="w-5 h-5"
                    />
                  </div>
                </button>
                {product.tag && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1">
                    {product.tag}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h3 className="text-sm">{product.name}</h3>
                <p className="text-sm">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;