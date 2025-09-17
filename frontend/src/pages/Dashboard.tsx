import { useEffect, useState } from "react";
import { Activity, Wind, Trash2, Car, Bell } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: JSX.Element;
  color: string;
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div
      className={`p-5 border-l-4 ${color} bg-white rounded-lg shadow hover:shadow-lg transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
    </div>
  );
}

// Dummy data for charts
const trafficData = [
  { time: "6 AM", vehicles: 40 },
  { time: "9 AM", vehicles: 90 },
  { time: "12 PM", vehicles: 60 },
  { time: "3 PM", vehicles: 70 },
  { time: "6 PM", vehicles: 120 },
  { time: "9 PM", vehicles: 50 },
];

const airData = [
  { day: "Mon", aqi: 80 },
  { day: "Tue", aqi: 95 },
  { day: "Wed", aqi: 70 },
  { day: "Thu", aqi: 110 },
  { day: "Fri", aqi: 100 },
];

const energyData = [
  { day: "Mon", usage: 200 },
  { day: "Tue", usage: 250 },
  { day: "Wed", usage: 180 },
  { day: "Thu", usage: 300 },
  { day: "Fri", usage: 220 },
];

export default function Dashboard() {
  const [stats] = useState({
    airQuality: 95,
    traffic: "Moderate",
    waste: "75%",
    energy: "Normal",
    alerts: 2,
  });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">City Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Air Quality Index"
          value={stats.airQuality}
          color="border-green-500"
          icon={<Wind className="h-6 w-6 text-green-600" />}
        />
        <StatCard
          title="Traffic Status"
          value={stats.traffic}
          color="border-yellow-500"
          icon={<Car className="h-6 w-6 text-yellow-600" />}
        />
        <StatCard
          title="Waste Collection"
          value={stats.waste}
          color="border-blue-500"
          icon={<Trash2 className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Energy Usage"
          value={stats.energy}
          color="border-purple-500"
          icon={<Activity className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Active Alerts"
          value={stats.alerts}
          color="border-red-500"
          icon={<Bell className="h-6 w-6 text-red-600" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Line Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Traffic Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trafficData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="vehicles" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Air Quality Area Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Air Quality (AQI)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={airData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="#10b981"
                fill="#a7f3d0"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Usage Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Energy Usage</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={energyData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
