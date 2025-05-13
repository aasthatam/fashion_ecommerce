import React, { useEffect, useState } from "react";
import axios from "axios";
import shoppingImage from "../assets/fashionimage.png";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: { token },
        });
        const user = response.data.user;
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Shopping Image */}
        <div className="md:w-1/2 bg-gray-200">
          <img
            src={shoppingImage}
            alt="Shopping Design"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right: Profile Info */}
        <div className="p-6 md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  value={userData.name}
                  readOnly
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  value={userData.email}
                  readOnly
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Body Shape</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                  value={userData.bodyShape || "Not available"}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
