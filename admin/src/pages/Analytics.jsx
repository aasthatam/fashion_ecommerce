import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user/all");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const url = selectedUser
          ? `http://localhost:4000/api/analytics/behavior?userId=${selectedUser}`
          : "http://localhost:4000/api/analytics/behavior";
        const res = await axios.get(url);
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch behavior data:", err.message);
      }
    };

    fetchAnalytics();
      // Set up polling every 10 seconds
      const interval = setInterval(fetchAnalytics, 10000); // 10,000ms = 10 sec

      // Clean up on unmount
      return () => clearInterval(interval);
  }, [selectedUser]);

  // Extract unique dates and actions
  const uniqueDates = [...new Set(stats.map(item => item.date))];
  const actions = [...new Set(stats.map(item => item.action))];

  // Color for each action
  const actionColors = {
    purchase: "rgba(75, 192, 192, 0.6)",
    cart: "rgba(255, 159, 64, 0.6)",
    wishlist: "rgba(153, 102, 255, 0.6)",
    "wishlist remove": "rgba(201, 203, 207, 0.6)",
    view: "rgba(54, 162, 235, 0.6)",
    "cart remove": "rgba(255, 99, 132, 0.6)"
  };

  // Prepare chart datasets: group by action
  const datasets = actions.map(action => ({
    label: action,
    data: uniqueDates.map(date => {
      const matched = stats.find(item =>
        item.date === date && item.action === action
      );
      return matched ? { x: date, y: matched.count, productName: matched.productName } : { x: date, y: 0, productName: null };
    }),
    backgroundColor: actionColors[action] || "rgba(100, 100, 100, 0.6)",
    borderRadius: 4
  }));

  const chartData = {
    labels: uniqueDates,
    datasets: datasets
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (context) {
            const product = context.raw.productName || "Unknown Product";
            const action = context.dataset.label;
            const value = context.raw.y;
            return `${action} on ${context.raw.x} — ${product} (${value})`;
          }
        }
      }
    },
    scales: {
            x: {
              type: "category",
              title: {
                display: true,
                text: "Date"
              }
            },
            y: {
              title: {
                display: true,
                text: "Interaction Count"
              }
            }
          }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Behavior Analytics (Last 7 Days)</h2>

      {/* User Filter */}
      <div className="mb-6">
        <label htmlFor="userFilter" className="block mb-1 font-medium">Filter by User:</label>
        <select
          id="userFilter"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name || user.email || user._id}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="mb-10">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-gray-300 font-medium">Date</th>
              <th className="p-2 border border-gray-300 font-medium">Product</th>
              <th className="p-2 border border-gray-300 font-medium">Action</th>
              <th className="p-2 border border-gray-300 font-medium">Count</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 border border-gray-300">{item.date}</td>
                <td className="p-2 border border-gray-300">{item.productName}</td>
                <td className="p-2 border border-gray-300">{item.action}</td>
                <td className="p-2 border border-gray-300">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;

