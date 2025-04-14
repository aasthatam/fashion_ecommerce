import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartSummary from '../components/CartSummary';

const PlaceOrder = () => {
  const { cartItems, products, currency } = useContext(ShopContext);

  const cartList = [];
  const { navigate } = useContext(ShopContext);

  for (const productId in cartItems) {
    for (const size in cartItems[productId]) {
      const quantity = cartItems[productId][size];
      const product = products.find((p) => p.id.toString() === productId);

      if (product) {
        cartList.push({
          ...product,
          size,
          quantity,
        });
      }
    }
  }

  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-[80vh] pt-5 sm:pt-14">
      <div className="px-4 sm:px-8 md:px-12">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* ----------- Left: Delivery Form ----------- */}
          <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
            <div className="text-xl sm:text-2xl my-3">
              <h1>Delivery Information</h1>
            </div>

            <div className="flex gap-3">
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
            </div>

            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />

            <div className="flex gap-3">
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
            </div>

            <div className="flex gap-3">
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
              <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
            </div>

            <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
          </div>

          {/* ----------- Right: Cart Summary ----------- */}
          <div className="w-full sm:max-w-md">
            <div className="text-xl sm:text-2xl mb-4">
              <h2>Cart Summary</h2>
            </div>
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              currency={currency}
            />
             {/* ----------- Payment Method ----------- */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <div className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" id="cod" defaultChecked />
                <label htmlFor="cod" className="text-gray-700">Cash on Delivery</label>
              </div>
            </div>
            <div className="w-full text-end mt-8">
            <button onClick={() => navigate('/orders')} className="bg-black text-white px-16 py-3 text-sm border rounded-lg hover:bg-gray-800 transition-colors">
              Place Order
            </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
