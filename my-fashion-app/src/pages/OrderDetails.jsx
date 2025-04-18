// import React, { useContext, useState, useEffect } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import axios from 'axios';

// const OrderDetails = () => {
//   const { backendUrl, token,  currency } = useContext(ShopContext);

//   const [orderData, setorderData] = useState([]);

//   const loadOrderData = async () => {

//     try{
//       if (!token) {
//         return null

//       }
//       const response = await axios.post(backendUrl + '/api/order/userorders', {}, {headers: {token}})
//       if (response.data.success) {
//         let allOrdersItem = []
//         response.data.orders.map((order) => {
//           order.items.map((item)=>{
//             item['status'] = order.status
//             item['payment'] = order.payment
//             item['paymentMethod'] = order.paymentMethod
//             item['date'] = order.date
//             allOrdersItem.push(item)

//           })

//         })
//         setorderData(allOrdersItem.reverse());
//       }

//     } catch(error) {

//     }
//   }

//   useEffect(() => {
//     loadOrderData()

//   }, [token])

//   return (
//     <div className='pt-16 px-4 sm:px-8 md:px-12'>
//       <div className="text-2xl font-semibold mb-6">
//         <h1>My Orders</h1>
//       </div>

//       <div>
//         {orderData.map((item, index) => (
//           <div
//             key={index}
//             className="py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
//           >
//             <div className="flex items-start gap-6 text-sm">
//               <img
//                 src={Array.isArray(item.image) ? item.image[0] : item.image}
//                 alt={item.name}
//                 className="w-16 sm:w-20 object-cover rounded"
//               />
//               <div>
//                 <p className="sm:text-base font-medium">{item.name}</p>
//                 <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
//                   <p className='text-lg'>{currency}{item.price.toFixed(2)}</p>
//                   <p>Quantity: {item.quantity}</p>
//                   <p>Size: {item.size}</p>
//                 </div>
//                 <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
//                 <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
//               </div>
//             </div>

//             <div className="md:w-1/2 flex justify-between md:justify-end">
//               <div className="flex items-center gap-2">
//                 <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
//                 <p className="text-sm md:text-base">{item.status}</p>
//               </div>
//               <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
//           </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const OrderDetails = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

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

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='pt-16 px-4 sm:px-8 md:px-12'>
      <div className="text-2xl font-semibold mb-6">
        <h1>My Orders</h1>
      </div>

      <div>
        {orderData.map((item, index) => (
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
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p className='text-lg'>
                    {currency}
                    {(item.price ?? 0).toFixed(2)}
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
                  <span className='text-gray-400'>{item.paymentMethod}</span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className='border px-4 py-2 text-sm font-medium rounded-sm'
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;

