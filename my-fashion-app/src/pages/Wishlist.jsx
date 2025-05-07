import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import removeIcon from "../assets/material-symbols-light_delete-outline.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Wishlist = () => {
  const {
    token,
    navigate,
    wishlistItems,
    setWishlistItems,
    currency,
    removeFromWishlist,
    addToCart,
    backendUrl
  } = useContext(ShopContext);

  const handleAddToCart = (itemId, size) => {
    if (!token) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }
    addToCart(itemId, size); // Add item to cart from wishlist
    removeFromWishlist(itemId, size); // Optionally remove it from wishlist after adding to cart
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 font-sans">
      {/* Header */}
      <header className="text-center pt-20">
        <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-15">
            <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
            <p className="text-gray-500 mt-2">
              Browse products and add them to your wishlist!
            </p>
            <Link to="/collection" className="text-gray-800 hover:underline mt-4 inline-block">
              Go back to shop
            </Link>
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="space-y-4">
              {wishlistItems.map((item, index) => (
                <div key={`${item._id}-${item.size}-${index}`} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.name}
                        className="w-24 h-32 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-xs sm:text-lg font-medium">{item.name}</h3>
                        <div className='flex items-center gap-5 mt-2'>
                        {(() => {
                              const discountTag = item.tags?.find(tag => tag.toLowerCase().includes("save"));
                              let discount = 0;

                              if (discountTag) {
                                const match = discountTag.match(/\d+/);
                                if (match) discount = parseInt(match[0]);
                              }

                              const discountedPrice = item.price - (item.price * (discount / 100));

                              return (
                                <div className="flex gap-3 items-center">
                                  {discount > 0 ? (
                                    <>
                                      <p className="text-sm line-through text-gray-500">
                                        {currency}{item.price.toFixed(2)}
                                      </p>
                                      <p className="text-sm font-semibold text-red-600">
                                        {currency}{discountedPrice.toFixed(2)} ({discountTag})
                                      </p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-medium">{currency}{item.price.toFixed(2)}</p>
                                  )}
                                </div>
                              );
                            })()}
                          <select
                            value={item.size}
                            onChange={async (e) => {
                              const newSize = e.target.value;
                              const oldSize = wishlistItems[index].size;
                              const updatedWishlist = [...wishlistItems];
                              updatedWishlist[index].size = newSize;
                              setWishlistItems(updatedWishlist);
                              localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
                            
                              if (token) {
                                try {
                                  // Remove old entry
                                  await axios.post(backendUrl + '/api/wishlist/remove', {
                                    itemId: item._id,
                                    size: oldSize
                                  }, {
                                    headers: { token }
                                  });
                            
                                  // Add new entry with updated size
                                  await axios.post(backendUrl + '/api/wishlist/add', {
                                    itemId: item._id,
                                    size: newSize
                                  }, {
                                    headers: { token }
                                  });
                                } catch (error) {
                                  toast.error("Failed to sync wishlist size change.");
                                  console.error(error);
                                }
                              }
                            }}
                            className="px-2 py-1 border bg-slate-50 text-sm rounded"
                          >
                            <option disabled value="default">Select Size</option>
                            {item.sizes?.map(sz => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Add to Cart Button */}
                      <button
                            onClick={() => {
                              if (item.size === "default") {
                                toast.error("Please select a size before adding to cart");
                                return;
                              }
                              handleAddToCart(item._id, item.size);
                            }}
                            className={`py-1 px-3 rounded transition-colors ${
                              item.size === "default" 
                                ? "bg-gray-400 cursor-not-allowed text-white" 
                                : "bg-black text-white hover:bg-gray-700"
                            }`}
                            disabled={item.size === "default"}
                          >
                        Add to Cart
                      </button>

                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => removeFromWishlist(item._id, item.size)}
                        className="text-gray-500 hover:text-black p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <img
                          src={removeIcon}
                          alt="Remove item"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
