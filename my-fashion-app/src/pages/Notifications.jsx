import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false); // Finish loading even if no token yet
      return;
    }

    const fetchNotifications = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/notifications`,
          {},
          {
            headers: { token },
          }
        );
        if (response.data.success) {
          setNotifications(response.data.notifications || []);
        } else {
          toast.error(response.data.message || "Failed to fetch notifications");
        }
      } catch (err) {
        toast.error("Something went wrong while fetching notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, backendUrl]);
  
  useEffect(() => {
  if (!loading && notifications.length > 0) {
    const markNotificationsAsRead = async () => {
      try {
        await axios.post(`${backendUrl}/api/user/mark-notifications-read`, {}, {
          headers: { token }
        });
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    };
    markNotificationsAsRead();
  }
}, [loading, notifications]);

  useEffect(() => {
    if (!loading && !token) {
      toast.info("Please log in to view notifications.");
      navigate("/login");
    }
  }, [loading, token, navigate]);

  if (loading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  return (
    <div
  className={`flex justify-center items-center min-h-[calc(100vh-6rem)] px-4 transition-all duration-1000 ease-in-out transform ${
    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`}
>
      <div
    className={`w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg transform transition-all duration-1000 ease-in-out ${
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
    }`}
  >
        <h1 className="text-2xl font-semibold mb-6 text-center">Your Notifications</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((note, index) => (
              <li
                key={index}
                className={`p-4 border rounded-md shadow-sm ${
                  note.read ? "bg-gray-100" : "bg-gray-50"
                }`}
              >
                <p className="text-sm text-gray-800">{note.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">You have no notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
