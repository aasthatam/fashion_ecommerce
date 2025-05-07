import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import heartIcon from "../assets/heart1.svg";
import heartIconFilled from "../assets/heart2.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; 

function RecommendationsSection({ currentProductId, category }) {
  const {
    products,
    currency,
    wishlistItems,
    addToWishlist,
    removeFromWishlist
  } = useContext(ShopContext);

  useEffect(() => {
    console.log('Current Category:', category); // Debugging category value
  }, [category, products]);

  // Get recommended products based on the same category, excluding the current product
  const recommendedProducts = products
  .filter((product) => 
    product.category === category && product._id !== currentProductId
  )
  .slice(0, 8);

  return (
    <div className="mt-16">
      {/* Section Title */}
      <h2 className="text-xl text-center mb-8">You might also like</h2>

      {/* Recommended Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendedProducts.length > 0 ? (
          recommendedProducts.map((product) => {
            const isWishlisted = wishlistItems.some(
              (item) => item._id === product._id
            );

            const handleWishlistToggle = () => {
              if (isWishlisted) {
                removeFromWishlist(product._id, product.size || 'default');
                toast.info("Removed from wishlist");
              } else {
                addToWishlist(product._id, product.size || 'default');
                toast.success("Added to wishlist");
              }
            };

            return (
              <div key={product._id} className="relative group overflow-hidden">
                {/* Product Image with Link */}
                <Link to={`/product/${product._id}`}>
                  <div className="overflow-hidden">
                    <img
                      src={
                        Array.isArray(product.images)
                          ? product.images[0]
                          : product.images
                      }
                      alt={product.name}
                      className="w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </Link>

                {/* Like Button */}
                <button
                  className="absolute top-2 right-2 text-gray-700 z-10"
                  onClick={handleWishlistToggle}
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                    <img
                      src={isWishlisted ? heartIconFilled : heartIcon}
                      alt="Heart"
                      className="w-5 h-5"
                    />
                  </div>
                </button>

                {/* Product Info */}
                <div className="mt-2 text-center">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="text-sm font-medium">
                    {currency}
                    {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No recommendations available</p>
        )}
      </div>
    </div>
  );
}

export default RecommendationsSection;
