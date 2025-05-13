import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import shoppingImage from "../assets/fashionimage.png"; 

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bodyShape, setBodyShape] = useState("");

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
        setName(user.name);
        setEmail(user.email);
        setBodyShape(user.bodyShape || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update-profile`,
        { name, email, bodyShape },
        { headers: { token } }
      );

      if (response.data.success) {
        setUserData(response.data.user);
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Error updating profile.");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete-account`,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Account deleted successfully.");
        localStorage.clear();
        window.location.href = "/";
      } else {
        toast.error(response.data.message || "Deletion failed.");
      }
    } catch (error) {
      toast.error("Error deleting account.");
      console.error(error);
    }
  };

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

        {/* Right: Editable Profile Form */}
        <div className="p-6 md:w-1/2">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">My Profile</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={!editMode}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={!editMode}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Body Shape</label>
              <input
              className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              value={bodyShape}
              readOnly
              disabled
            />
            </div>
          </div>

         <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded border border-black transition duration-200 hover:bg-white hover:text-black"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded border border-black transition duration-200 hover:bg-white hover:text-black"
              >
                Save Changes
              </button>
            )}

            <button
              onClick={handleDelete}
              className="w-full sm:w-auto bg-rose-500 text-white px-4 py-2 rounded border border-rose-500 transition duration-200 hover:bg-white hover:text-rose-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
