import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const { setCartItems } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const paymentId = query.get("paymentId");
    const PayerID = query.get("PayerID");
  
    const token = localStorage.getItem("token");
    const data = JSON.parse(localStorage.getItem("paypalData"));
  
    // Fix: reset session marker at start of page load
    sessionStorage.removeItem("paypal_executed");
  
    if (!paymentId || !PayerID || !data || !token) {
      console.error("Missing PayPal or user data");
      return;
    }
  
    console.log("Executing PayPal payment...");
  
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order/paypal/execute`, {
      paymentId,
      PayerID,
      userId: data.userId,
      items: data.items,
      address: data.address,
      amount: data.amount,
      email: data.email,
      paymentMethod: "PayPal"
    }, {
      headers: { token }
    })
    .then((res) => {
      console.log("Response:", res.data);
      if (res.data.success) {
        // Only mark executed after a successful result
        sessionStorage.setItem("paypal_executed", "true");
        setCartItems({});
        localStorage.removeItem("cartItems");
        localStorage.removeItem("paypalData");
        navigate("/orders");
      }
    })
    .catch((err) => {
      console.error("Execute failed:", err.response?.data || err.message);
    });
  }, []);
  

  return <div className="text-center mt-20 text-xl">Processing your order...</div>;
};

export default PaymentSuccess;
