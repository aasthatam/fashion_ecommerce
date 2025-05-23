import React, { useState, useRef, useContext, useEffect } from 'react'; 
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import { ShopContext } from '../context/ShopContext';
import RecommendationsSection from '../components/RecommendationsSection';
import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1); 
  const [isProductLiked, setIsProductLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('S');
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailRef = useRef(null); 
  const { token, currency, addToCart , addToWishlist, removeFromWishlist, wishlistItems, backendUrl} = useContext(ShopContext); 
  const [ product, setProduct ] = useState(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

   useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let userId = null;
        if (token) {
          const decoded = jwtDecode(token);
          userId = decoded.id;
        }
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id,  userId: userId });
        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
  
    fetchProduct();
  }, [id]);

  // const product = products.find((prod) => prod.id === parseInt(id));

  useEffect(() => {
    if (product) {
      const liked = wishlistItems.some(
        (item) => item._id === product._id && item.size === selectedSize
      );
      setIsProductLiked(liked);
    }
  }, [wishlistItems, selectedSize, product]);

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-8">Product not found</div>;
  }

  const toggleProductLike = () => {
    const isLiked = wishlistItems.some(
      (item) => item._id === product._id && item.size === selectedSize
    );
  
    if (isLiked) {
      removeFromWishlist(product._id, selectedSize);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product._id, selectedSize);
      toast.success("Added to wishlist");
    }
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      thumbnailRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const productImages = Array.isArray(product.images) ? product.images : [product.images];

  const calculateDiscountedPrice = (price, tag) => {
    if (!tag || !tag.toLowerCase().includes("save")) return null;
    const match = tag.match(/(\d+)%/);
    const percent = match ? parseInt(match[1]) : 0;
    return price - (price * percent) / 100;
  };

  return (
    <div
      className={`max-w-6xl mx-auto px-4 py-8 transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
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
              className={`w-full h-[800px] object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110 ${
                isVisible ? "scale-100" : "scale-110"
              }`}
            />
            {/* Navigation Buttons */}
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
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                <img src={isProductLiked ? heartIconFilled : heartIcon} alt="Heart" className="w-5 h-5" />
              </div>
            </button>
          </div>
          
          {/* Thumbnail Carousel */}
          {productImages.length > 1 && (
            <div className="relative mt-4">
              <button 
                onClick={() => scrollThumbnails('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10"
              >
                <ChevronLeft size={16} />
              </button>
              
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
          {Array.isArray(product.tags) && product.tags[0]?.toLowerCase().includes("save") ? (
            <>
              <p className="text-sm text-gray-500 line-through">
                {currency}{product.price.toFixed(2)}
              </p>
              <p className="text-xl font-semibold text-red-600">
                {currency}{calculateDiscountedPrice(product.price, product.tags[0]).toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-xl mb-1">
              {currency}{product.price.toFixed(2)}
            </p>
          )}

          <p className={`text-sm mb-4 ${product.availability === "In Stock" ? "text-green-600" : "text-red-600"}`}>
            {product.availability || "In Stock"}
          </p>

          {/* Color and Size Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm mb-2">Color</p>
              <div className="flex space-x-2">
              {product.colors.split(',').map((color, index) => (
                  <div 
                    key={index} 
                    className="w-6 h-6 rounded-full border border-gray-300" 
                    style={{ backgroundColor: color }} 
                  />
                ))}
              </div>
            </div>
          )}

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

          {/* Quantity and Details */}
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

          {/* Details
          {product.details && product.details.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Details</h3>
              <ul className="text-sm space-y-1">
                {product.details.map((detail, index) => (
                  <li key={index}>• {detail}</li>
                ))}
              </ul>
            </div>
          )} */}

            {product.details && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Details</h3>
                <ul className="text-sm space-y-1">
                  {product.details
                    .split(/\r?\n/)
                    .filter(line => line.trim() !== "")
                    .map((line, index) => (
                      <li key={index}>• {line}</li>
                    ))}
                </ul>
              </div>
            )}

          {/* Buttons */}
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
            <button 
              onClick={() => {
                if (!token) {
                  toast.error("Please login to add items to your cart");
                  navigate("/login");
                  return;
                }
                addToCart(product._id, selectedSize, quantity);
              }}
              className="px-6 py-3 rounded-md border border-black bg-white text-black flex-1 hover:bg-gray-100 transition"
            >
              Add to bag
            </button>
            <button 
                onClick={toggleProductLike}
                className={`px-6 py-3 rounded-md flex-1 transition ${
                  isProductLiked 
                    ? "bg-gray-200 text-black border border-black" 
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isProductLiked ? "Remove from wishlist" : "Add to wishlist"}
              </button>
            </div>
            <button
            onClick={() => {
              if (!token) {
                toast.error("Please login to proceed");
                navigate("/login");
                return;
              }
              addToCart(product._id, selectedSize, quantity);
              navigate("/place-order"); // redirect to PlaceOrder
            }} 
            className="w-full py-3 rounded-md bg-black text-white hover:bg-gray-800 transition">
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
                <div
                  key={index}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`border p-4 rounded-md shadow-sm transition-all duration-700 ease-in-out transform ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                <div className="font-medium">{review.username}</div>
                <div className="text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-sm mt-1">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
        )}

        {token && (
          <form
          onSubmit={async (e) => {
            e.preventDefault();
            const rating = e.target.rating.value;
            const comment = e.target.comment.value;
            const decoded = jwtDecode(token);
          
            try {
              await axios.post(`${backendUrl}/api/product/review`, {
                productId: product._id,
                userId: decoded.id,
                username: decoded.name || "User",
                rating,
                comment,
              });
              toast.success("Review submitted!");
              window.location.reload();
            } catch (err) {
              toast.error("Failed to submit review");
              console.error("Review submission error:", err);
            }
          }}
            className="mt-8 space-y-4"
          >
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <select name="rating" required className="border p-2 rounded w-full">
                <option value="">Select Rating</option>
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>{star} Star{star > 1 && "s"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Comment</label>
              <textarea name="comment" rows="3" required className="border p-2 rounded w-full" />
            </div>
            <button type="submit" className="mt-4 bg-black text-white py-2 px-4 rounded transition hover:bg-white hover:text-black hover:border hover:border-black hover:scale-105 cursor-pointer">
              Submit Review
            </button>
          </form>
        )}
      </div>
      {/* Recommendations Section */}
      <RecommendationsSection currentProductId={product._id} category={product.category} />
    </div>
  );
}

export default ProductDetailPage;
