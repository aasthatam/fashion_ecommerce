import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const CartSummary = ({ totalItems, totalPrice, currency }) => {
  const navigate = useNavigate();
  const { delivery_fee } = useContext(ShopContext); 

  const finalTotal = totalPrice + delivery_fee;

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between">
        <span className="font-medium">Total Items:</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between mt-2">
        <span className="font-medium">Subtotal:</span>
        <span>
          {currency} {totalPrice.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between mt-2">
        <span className="font-medium">Delivery Fee:</span>
        <span>
          {currency} {delivery_fee.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between mt-2 text-lg font-semibold">
        <span>Total:</span>
        <span>
          {currency} {finalTotal.toFixed(2)}
        </span>
      </div>

      {/* Checkout Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/place-order')}
          className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
