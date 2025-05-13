import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          headers: {
            token: token,
          },
        });
        setUserData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

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
      className={`flex items-center justify-center min-h-screen px-4 transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        className={`w-full max-w-md bg-white p-6 rounded-xl shadow-md transition-all duration-1000 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">My Profile</h1>
        <div className="space-y-4 text-gray-700 text-base">
          <div>
            <span className="font-medium">Name:</span> {userData.name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userData.email}
          </div>
          <div>
            <span className="font-medium">Role:</span> {userData.role}
          </div>
          <div>
            <span className="font-medium">Body Shape:</span>{" "}
            {userData.bodyShape || "Not predicted yet"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
