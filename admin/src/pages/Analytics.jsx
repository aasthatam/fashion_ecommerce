import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Analytics = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/analytics/behavior");
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch behavior data:", err.message);
      }
    };

    fetchAnalytics();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: stats.map(item => {
        const name = item.productName || item.productId;
        const shortName = name.length > 20 ? name.substring(0, 17) + "..." : name;
        return `${shortName} (${item.action})`;
      }),
    datasets: [
      {
        label: 'User Interactions',
        data: stats.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 5,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Behavior Analytics</h2>
      <div className="mb-10">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Optional: keep the table below as backup */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border border-gray-300">Product</th>
            <th className="p-2 border border-gray-300">Action</th>
            <th className="p-2 border border-gray-300">Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border border-gray-300">{item.productName || item.productId}</td>
              <td className="p-2 border border-gray-300">{item.action}</td>
              <td className="p-2 border border-gray-300">{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
