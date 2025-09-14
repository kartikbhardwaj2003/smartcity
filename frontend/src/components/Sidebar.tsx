// src/components/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Bell,
  LogOut,
  Menu,
} from "lucide-react"; // install if not present: npm i lucide-react

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } h-screen bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`${!open ? "hidden" : ""} text-xl font-bold`}>SmartCity</span>
        <button
          className="p-1 rounded hover:bg-gray-800"
          aria-label="Toggle"
          onClick={() => setOpen(!open)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          {open && <span>Dashboard</span>}
        </NavLink>

        <NavLink
          to="/sensors"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <Activity className="w-5 h-5" />
          {open && <span>Sensors</span>}
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <Bell className="w-5 h-5" />
          {open && <span>Alerts</span>}
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-red-600 w-full"
        >
          <LogOut className="w-5 h-5" />
          {open && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
