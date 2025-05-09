import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderDetails = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getDiscountedPrice = (item) => {
    const tag = Array.isArray(item.tags) ? item.tags.find(tag => tag.toLowerCase().includes("save")) : null;
    const match = tag?.match(/(\d+)%/);
    const percent = match ? parseInt(match[1]) : 0;
    return item.price - (item.price * percent / 100);
  };

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const itemWithOrderInfo = {
              ...item,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            };
            allOrdersItem.push(itemWithOrderInfo);
          });
        });

        setOrderData([...allOrdersItem].reverse());
      } else {
        console.error("Failed to load orders:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order cancelled successfully");
        loadOrderData();
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error.message || error);
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div
      className={`pt-16 px-4 sm:px-8 md:px-12 transition-all duration-1000 ease-in-out transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="text-2xl font-semibold mb-6">
        <h1>My Orders</h1>
      </div>

      <div>
        {orderData
          .filter((item) => item.status !== "Cancelled")
          .map((item, index) => (
            <div
              key={index}
              className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  src={Array.isArray(item.images) ? item.images[0] : item.images}
                  alt={item.name}
                  className="w-16 sm:w-20 object-cover rounded"
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p className='text-lg'>
                      {currency}
                      {(getDiscountedPrice(item) * item.quantity + 10).toFixed(2)}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>
                    Date:{' '}
                    <span className='text-gray-400'>
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className='mt-1'>
                    Payment:{' '}
                    <span className='text-gray-400'>
                      {item.paymentMethod === "PayPal"
                        ? "PayPal"
                        : item.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : "Not Specified"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-7 md:mt-0">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={loadOrderData}
                  className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100 hover:text-black transition duration-200 cursor-pointer'
                >
                  Track Order
                </button>

                {(item.status === "Order Placed" || item.status === "Packing") && (
                  <button
                    onClick={() => cancelOrder(item.orderId)}
                    className='border px-4 py-2 text-sm font-medium rounded-sm text-red-600 hover:bg-red-100 transition duration-200 cursor-pointer'
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderDetails;
