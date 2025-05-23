import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import EyeIcon from "../assets/image120.svg";
import EyeSlashIcon from "../assets/image121.svg";

const LoginPage = () => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [name, setName] = useState(""); // only for register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const [formVisible, setFormVisible] = useState(false);
  useEffect(() => {
  setFormVisible(false); // reset animation
  const timer = setTimeout(() => setFormVisible(true), 50); // short delay for effect
  return () => clearTimeout(timer);
}, [mode]);

  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (mode === "register") {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      if (!passwordRegex.test(password)) {
        toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        return;
      }
    }

    try {
      if (mode === "login") {
        const response = await axios.post(`${backendUrl}/api/user/login`, { email, password });

        if (response.data?.success && response.data?.token) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(response.data?.message || "Invalid login credentials");
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });

        if (response.data?.success) {
          toast.success("Account created successfully! Please login.");
          setMode("login");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          toast.error(response.data?.message || "Registration failed");
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Something went wrong.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center bg-white-100 transition-all duration-700 ease-in-out transform ${
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}>
      <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-700 ease-in-out transform ${
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>
        <form
        onSubmit={handleSubmit}
        className={`transition-all duration-500 ease-in-out transform ${
          formVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
          {mode === "register" && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 cursor-pointer"
            >
              <img
                src={showPassword ? EyeSlashIcon : EyeIcon}
                alt="Toggle password visibility"
                className="w-5 h-5"
              />
            </span>
          </div>

          {mode === "register" && (
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 cursor-pointer"
              >
                <img
                  src={showConfirmPassword ? EyeSlashIcon : EyeIcon}
                  alt="Toggle confirm password visibility"
                  className="w-5 h-5"
                />
              </span>
            </div>
          )}

          {mode === "login" && (
            <div className="mb-6 text-right">
              <Link to="/reset-password" className="text-sm text-gray-500 hover:underline">
                Forgot your password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === "login" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button className="text-gray-500 hover:underline" onClick={() => setMode("register")}>
                Create account
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button className="text-gray-500 hover:underline" onClick={() => setMode("login")}>
                Sign In
              </button>
            </p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            <a href="/" className="text-gray-500 hover:underline">
              Return to Store
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
