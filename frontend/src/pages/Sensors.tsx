import { useEffect, useState } from "react";
import api from "../services/api";

type SensorItem = {
  id: string;
  name: string;
  type: string;
  location?: string;
  metadata?: any;
  status?: string;
  createdAt: string;
};

export default function Sensors() {
  const [sensors, setSensors] = useState<SensorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get("/sensors");
      setSensors(res.data ?? []);
    } catch (err) {
      console.error(err);
      alert("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  }

  async function addSensor() {
    try {
      await api.post("/sensors", {
        name: form.name,
        type: form.type,
        location: form.location,
        status: "ACTIVE",
      });
      setShowModal(false);
      setForm({ name: "", type: "", location: "" });
      load(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to add sensor");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sensors</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Sensor
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : sensors.length === 0 ? (
        <div className="text-gray-500">No sensors available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((s) => (
            <div
              key={s.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg">{s.name}</h2>
                <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                  {s.type}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">
                {s.location ?? "Unknown Location"}
              </p>

              <div className="mt-3">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    s.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Added: {new Date(s.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow w-96">
            <h2 className="text-lg font-bold mb-4">Add Sensor</h2>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Type (e.g. Air, Traffic)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addSensor}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
