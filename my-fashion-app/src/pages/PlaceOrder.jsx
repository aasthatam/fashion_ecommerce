import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartSummary from '../components/CartSummary';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { cartItems, products, currency, backendUrl, token, setCartItems, delivery_fee } = useContext(ShopContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isVisible, setIsVisible] = useState(false); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });
   useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);


  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const getDiscountedPrice = (item) => {
    const tag = Array.isArray(item.tags) ? item.tags.find(tag => tag.toLowerCase().includes("save")) : null;
    if (!tag) return item.price;
    const match = tag.match(/(\d+)%/);
    const percent = match ? parseInt(match[1]) : 0;
    return item.price - (item.price * percent) / 100;
  };

  const cartList = [];
  for (const productId in cartItems) {
    for (const size in cartItems[productId]) {
      const quantity = cartItems[productId][size];
      const product = products.find(p => p._id?.toString() === productId);

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
  const totalPrice = cartList.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const orderItems = cartList.map(item => ({
        _id: item._id,
        name: item.name,
        price: getDiscountedPrice(item),
        size: item.size,
        quantity: item.quantity,
        category: item.category,
        images: item.images
      }));

      const amount = totalPrice + delivery_fee;

      const orderData = {
        userId: JSON.parse(localStorage.getItem("user"))._id,
        address: formData,
        items: orderItems,
        amount,
        paymentMethod
      };

      if (paymentMethod === "COD") {
        const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
          headers: { token }
        });
        if (response.data.success) {
          setCartItems({});
          localStorage.removeItem("cartItems");
          navigate('/orders');
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
      } else if (paymentMethod === "PayPal") {
        localStorage.setItem("paypalData", JSON.stringify({
          userId: JSON.parse(localStorage.getItem("user"))._id,
          items: orderItems,
          address: formData,
          amount,
          email: formData.email,
          paymentMethod: "PayPal"
        }));

        const response = await axios.post(`${backendUrl}/api/order/paypal/create`, { total: amount }, {
          headers: { token }
        });

        if (response.data.success) {
          window.location.href = response.data.approvalUrl;
        }
      }

    } catch (error) {
      console.error(error);
      toast.error("Error placing order");
    }
  };

  return (
     <div
      className={`min-h-[80vh] pt-5 sm:pt-14 transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="px-4 sm:px-8 md:px-12">
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left - Delivery Form */}
          <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
            <div className="text-xl sm:text-2xl my-3">
              <h1>Delivery Information</h1>
            </div>
            <div className="flex gap-3">
              <input required name='firstName' value={formData.firstName} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
              <input required name='lastName' value={formData.lastName} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
            </div>
            <input required name='email' value={formData.email} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" />
            <input required name='street' value={formData.street} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
            <div className="flex gap-3">
              <input required name='city' value={formData.city} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
              <input required name='state' value={formData.state} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
            </div>
            <div className="flex gap-3">
              <input required name='zipcode' value={formData.zipcode} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="number" placeholder="Zipcode" />
              <input required name='country' value={formData.country} onChange={onChangeHandler} className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
            </div>
            <input required name="phone" value={formData.phone} onChange={onChangeHandler} type="tel" pattern="[0-9]{10}" title="Phone number must be 10 digits" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" placeholder="Phone" />
          </div>

          {/* Right - Cart Summary */}
          <div className="w-full sm:max-w-md">
            <div className="text-xl sm:text-2xl mb-4">
              <h2>Cart Summary</h2>
            </div>
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              currency={currency}
              cartList={cartList}
              hideCheckoutButton={true}
            />

            {/* Payment Method */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
              <div className="flex items-center gap-4">
                <label>
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={e => setPaymentMethod(e.target.value)} /> Cash on Delivery
                </label>
                <label>
                  <input type="radio" name="paymentMethod" value="PayPal" checked={paymentMethod === "PayPal"} onChange={e => setPaymentMethod(e.target.value)} /> PayPal
                </label>
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
