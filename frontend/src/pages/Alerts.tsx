import { useEffect, useState } from "react";
import api from "../services/api";

type AlertItem = {
  id: string;
  level: string;
  message: string;
  createdAt: string;
  resolvedAt?: string | null;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data ?? []);
    } catch (err) {
      console.error(err);
      alert("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }

  async function resolveAlert(id: string) {
    try {
      const res = await api.put(`/alerts/${id}/resolve`, { resolvedBy: "Admin User" });
      setAlerts((s) => s.map((a) => (a.id === id ? res.data.alert : a)));
    } catch (err) {
      console.error(err);
      alert("Resolve failed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Alerts</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created At</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-3 font-medium">{a.level}</td>
                  <td className="p-3">{a.message}</td>
                  <td className="p-3">
                    {a.resolvedAt ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-center">
                    {!a.resolvedAt && (
                      <button
                        onClick={() => resolveAlert(a.id)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No alerts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
