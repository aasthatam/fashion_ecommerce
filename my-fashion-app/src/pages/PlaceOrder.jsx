import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartSummary from '../components/CartSummary';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { navigate, cartItems, products, currency, backendUrl, token, setCartItems, delivery_fee } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone:''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({...data, [name]:value}))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
  
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items));
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }
  
      let orderData = {
        address: formData,
        items: orderItems,
        amount: totalPrice + delivery_fee,
        paymentMethod: "COD" // optional: for backend clarity
      };
  
      const response = await axios.post(backendUrl + '/api/order/place', orderData, {
        headers: { token }
      });
      console.log(response.data);
  
      if (response.data.success) {
        setCartItems({});
        localStorage.removeItem("cartItems"); // optional: clear saved cart
        navigate('/orders');
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  

  const cartList = [];
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
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-8">
          {/* ----------- Left: Delivery Form ----------- */}
          <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
            <div className="text-xl sm:text-2xl my-3">
              <h1>Delivery Information</h1>
            </div>

            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name='firstName' value = {formData.firstName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
              <input required onChange={onChangeHandler} name='lastName' value = {formData.lastName} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
            </div>

            <input required onChange={onChangeHandler} name='email' value = {formData.email} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
            <input required onChange={onChangeHandler} name='street' value = {formData.street} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />

            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name='city' value = {formData.city} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
              <input required onChange={onChangeHandler} name='state' value = {formData.state} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
            </div>

            <div className="flex gap-3">
              <input required onChange={onChangeHandler} name='zipcode' value = {formData.zipcode} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
              <input required onChange={onChangeHandler} name='country' value = {formData.country} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
            </div>

            <input required onChange={onChangeHandler} name='phone' value = {formData.phone} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Phone" />
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
            <button type='submit' className="bg-black text-white px-16 py-3 text-sm border rounded-lg hover:bg-gray-800 transition-colors">
              Place Order
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
