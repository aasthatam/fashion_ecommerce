import React, { useState } from "react";

const ShoppingCart = () => {
  // Sample cart data (initially empty)
  const [cartItems, setCartItems] = useState([]);

  // Function to remove an item from the cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate total items and total price
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 font-sans">
      {/* Header */}
      <header className="text-center pt-20">
        <h1 className="text-2xl font-semibold mb-6 ">Shopping Cart</h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center">
        {/* Display message if cart is empty */}
        {cartItems.length === 0 ? (
          <div className="text-center py-15">
            <p className="text-gray-600 text-lg">Your shopping cart is empty.</p>
            <p className="text-gray-500 mt-2">
              Add some products to your cart to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Cart Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">No.</th>
                    <th className="py-2 px-4 border-b">Preview</th>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Size</th>
                    <th className="py-2 px-4 border-b">Price</th>
                    <th className="py-2 px-4 border-b">Qty</th>
                    <th className="py-2 px-4 border-b">Discount</th>
                    <th className="py-2 px-4 border-b">Payment</th>
                    <th className="py-2 px-4 border-b">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {/* Replace with actual image */}
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-2 px-4 border-b">{item.name}</td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.size}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        Rs {item.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.discount > 0 ? `-Rs ${item.discount.toFixed(2)}` : "-"}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Summary */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Total:</span>
                <span className="font-semibold">Rs {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer (Checkout Button) */}
      <footer className="mt-6">
        {cartItems.length > 0 && (
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
            Checkout
          </button>
        )}
      </footer>
    </div>
  );
};

export default ShoppingCart;