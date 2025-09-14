import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChartBarIcon,
  BellAlertIcon,
  CubeIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/", icon: ChartBarIcon },
    { name: "Sensors", path: "/sensors", icon: CubeIcon },
    { name: "Alerts", path: "/alerts", icon: BellAlertIcon },
    { name: "Settings", path: "/settings", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 text-xl font-bold text-blue-600 border-b">
          🏙️ Smart City
        </div>
        <nav className="p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white shadow flex justify-between items-center px-6">
          <h1 className="text-lg font-semibold">Smart City Management</h1>
          <div className="text-sm text-gray-500">👤 Admin</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
