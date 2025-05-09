import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import removeIcon from "../assets/material-symbols-light_delete-outline.svg";
import { Link } from "react-router-dom";
import CartSummary from "../components/CartSummary";

const Cart = () => {
  const { 
    cartItems, 
    products, 
    currency, 
    removeFromCart, 
    updateCartItem 
  } = useContext(ShopContext);

  const [cartList, setCartList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const tempData = [];

    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        const product = products.find(p => p._id?.toString() === productId);

        if (product && quantity > 0) {
          tempData.push({
            ...product,
            size,
            quantity,
          });
        }
      }
    }

    setCartList(tempData);
  }, [cartItems, products]);

  const getDiscountedPrice = (item) => {
    const tag = Array.isArray(item.tags) ? item.tags.find(tag => tag.toLowerCase().includes("save")) : null;
    if (!tag) return item.price;

    const match = tag.match(/(\d+)%/);
    const percent = match ? parseInt(match[1]) : 0;
    return item.price - (item.price * percent) / 100;
  };

  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);

  const handleQuantityChange = (itemId, size, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    updateCartItem(itemId, size, quantity);
  };

  return (
    <div
    className={`min-h-screen flex flex-col justify-between p-6 font-sans transition-all duration-1000 ease-in-out transform ${
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}
  >
      {/* Header */}
      <header className="text-center pt-20">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center">
        {cartList.length === 0 ? (
          <div className="text-center py-15">
            <p className="text-gray-600 text-lg">Your shopping cart is empty.</p>
            <p className="text-gray-500 mt-2">
              Add some products to your cart to get started!
            </p>
            <Link to="/collection" className="text-gray-800 hover:underline mt-4 inline-block">
              Go back to shop
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4">
              {cartList.map((item, index) => (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`border-b pb-4 transform transition-all duration-700 ease-in-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.images?.[0] || item.images} // fallback
                        alt={item.name}
                        className="w-24 h-32 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-xs sm:text-lg font-medium">{item.name}</h3>
                        <div className='flex items-center gap-5 mt-2'>
                          <div>
                            {Array.isArray(item.tags) && item.tags[0]?.toLowerCase().includes("save") ? (
                              <>
                                <p className="text-sm text-gray-500 line-through">
                                  {currency}{item.price.toFixed(2)}
                                </p>
                                <p className="text-md font-semibold text-red-600">
                                  {currency}{getDiscountedPrice(item).toFixed(2)}
                                </p>
                              </>
                            ) : (
                              <p className="text-md font-semibold">
                                {currency}{item.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                          <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                        </div>
                      </div>
                    </div>
                    <input 
                      className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center'
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, item.size, e.target.value)}
                    />
                    <button
                      onClick={() => removeFromCart(item._id, item.size)}
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
              ))}
            </div>

            {/* Summary */}
            <CartSummary 
              totalItems={totalItems} 
              totalPrice={totalPrice} 
              currency={currency}
              cartList={cartList} 
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
