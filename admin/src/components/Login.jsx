import React, { useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import EyeIcon from "../assets/image120.svg";
import EyeSlashIcon from "../assets/image121.svg";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Add this

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting login request...");
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Admin Panel</h1>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field with eye toggle */}
          <div className="mb-4 relative">
            <label className="block text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              <img
                src={showPassword ? EyeSlashIcon : EyeIcon}
                alt="Toggle password visibility"
                className="w-5 h-5"
              />
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
