import { useState } from "react";
import { ShieldAlert, AlertTriangle, Info, CheckCircle } from "lucide-react";

type AlertItem = {
  id: string;
  level: "CRITICAL" | "WARNING" | "INFO";
  message: string;
  createdAt: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      level: "CRITICAL",
      message: "Air pollution above safe limit",
      createdAt: "2025-09-13T10:00:00Z",
    },
    {
      id: "2",
      level: "WARNING",
      message: "Traffic congestion in Zone B",
      createdAt: "2025-09-13T09:45:00Z",
    },
    {
      id: "3",
      level: "INFO",
      message: "Scheduled waste collection in Zone C",
      createdAt: "2025-09-13T08:30:00Z",
    },
  ]);

  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">(
    "ALL"
  );

  const resolveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filteredAlerts =
    filter === "ALL" ? alerts : alerts.filter((a) => a.level === filter);

  const levelConfig: Record<
    AlertItem["level"],
    { color: string; icon: JSX.Element }
  > = {
    CRITICAL: {
      color: "border-red-500 bg-red-50",
      icon: <ShieldAlert className="text-red-500 h-5 w-5" />,
    },
    WARNING: {
      color: "border-yellow-500 bg-yellow-50",
      icon: <AlertTriangle className="text-yellow-500 h-5 w-5" />,
    },
    INFO: {
      color: "border-blue-500 bg-blue-50",
      icon: <Info className="text-blue-500 h-5 w-5" />,
    },
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">System Alerts</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        {["ALL", "CRITICAL", "WARNING", "INFO"].map((f) => (
          <button
            key={f}
            onClick={() =>
              setFilter(f as "ALL" | "CRITICAL" | "WARNING" | "INFO")
            }
            className={`px-4 py-2 rounded ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 ${levelConfig[alert.level].color} rounded-lg shadow p-4 flex justify-between items-start`}
            >
              <div className="flex gap-3">
                {levelConfig[alert.level].icon}
                <div>
                  <p className="font-semibold">{alert.message}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => resolveAlert(alert.id)}
                className="ml-4 px-3 py-1 text-sm bg-green-100 text-green-700 border border-green-400 rounded hover:bg-green-200"
              >
                <CheckCircle className="inline h-4 w-4 mr-1" />
                Resolve
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center text-sm mt-10">
            No {filter !== "ALL" ? filter.toLowerCase() : ""} alerts 🎉
          </p>
        )}
      </div>
    </div>
  );
}
