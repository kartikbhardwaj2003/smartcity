import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const s = await api.get("/sensors");
      const a = await api.get("/alerts");
      setSensors(s.data ?? []);
      setAlerts(a.data ?? []);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    }
  }

  const activeAlerts = alerts.filter((a) => !a.resolvedAt).length;
  const resolvedAlerts = alerts.filter((a) => a.resolvedAt).length;

  // Dummy trend chart data (replace with sensor readings later)
  const chartData = [
    { time: "08:00", air: 50, traffic: 30 },
    { time: "10:00", air: 70, traffic: 60 },
    { time: "12:00", air: 90, traffic: 80 },
    { time: "14:00", air: 120, traffic: 110 },
    { time: "16:00", air: 100, traffic: 70 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Smart City Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-500">Total Sensors</h3>
          <p className="text-2xl font-bold text-blue-600">{sensors.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-500">Active Alerts</h3>
          <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-500">Resolved Alerts</h3>
          <p className="text-2xl font-bold text-green-600">{resolvedAlerts}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h3 className="text-sm text-gray-500">System Uptime</h3>
          <p className="text-2xl font-bold text-purple-600">99.9%</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Air Quality & Traffic Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="air" stroke="#ef4444" name="Air Quality" />
            <Line type="monotone" dataKey="traffic" stroke="#3b82f6" name="Traffic" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Preview */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        {alerts.length === 0 && <div className="text-gray-500">No alerts yet</div>}
        <ul className="divide-y">
          {alerts.slice(0, 5).map((a) => (
            <li key={a.id} className="py-3 flex justify-between items-center">
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    a.level === "CRITICAL"
                      ? "bg-red-100 text-red-700"
                      : a.level === "WARNING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {a.level}
                </span>
                <p className="mt-1">{a.message}</p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
