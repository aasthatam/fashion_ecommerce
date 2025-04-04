import React, { useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify'

const Login = ({setToken}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            console.log("Submitting login request...");
            const response = await axios.post(`${backendUrl}/api/user/admin`, { email, password });
            if (response.data.success){
                setToken(response.data.token)
            } else{
                toast.error(response.data.message)
            }
      
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">Admin Panel</h1>

        <form onSubmit = {onSubmitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              type="email"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              type="password"
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
            />
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
