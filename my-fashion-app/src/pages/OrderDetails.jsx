import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const OrderDetails = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className='pt-16 px-4 sm:px-8 md:px-12'>
      <div className="text-2xl font-semibold mb-6">
        <h1>My Orders</h1>
      </div>

      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                src={Array.isArray(item.image) ? item.image[0] : item.image}
                alt={item.name}
                className="w-16 sm:w-20 object-cover rounded"
              />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                  <p className='text-lg'>{currency}{item.price.toFixed(2)}</p>
                  <p>Quantity: 1</p>
                  <p>Size: M</p>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm md:text-base">Ready To Ship</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
