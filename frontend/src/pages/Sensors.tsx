// frontend/src/pages/Sensors.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { PlusCircle, Trash2, Edit, MapPin, Activity, X } from "lucide-react";

type Sensor = {
  id: string;
  name: string;
  type: string;
  location?: any;
  metadata?: any;
  createdAt: string;
  readings?: { id: string; value?: number; timestamp?: string }[];
};

const SENSOR_TYPES = ["air", "traffic", "waste", "energy", "water", "parking"];

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [form, setForm] = useState({
    name: "",
    type: "air",
    location: "",
    metadata: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/sensors");
      setSensors(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load sensors");
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: "", type: "air", location: "", metadata: "" });
    setShowModal(true);
  }

  function openEdit(sensor: Sensor) {
    setEditing(sensor);
    setForm({
      name: sensor.name ?? "",
      type: sensor.type ?? "air",
      location: typeof sensor.location === "string" ? sensor.location : JSON.stringify(sensor.location ?? ""),
      metadata: sensor.metadata ? JSON.stringify(sensor.metadata) : "",
    });
    setShowModal(true);
  }

  async function submitForm(e?: any) {
    if (e) e.preventDefault();
    try {
      const payload: any = {
        name: form.name,
        type: form.type,
      };
      // try parse location/metadata JSON if looks like JSON
      if (form.location) {
        try {
          payload.location = JSON.parse(form.location);
        } catch {
          payload.location = form.location;
        }
      }
      if (form.metadata) {
        try {
          payload.metadata = JSON.parse(form.metadata);
        } catch {
          payload.metadata = form.metadata;
        }
      }

      if (editing) {
        await api.put(`/sensors/${editing.id}`, payload);
      } else {
        await api.post("/sensors", payload);
      }

      await load();
      setShowModal(false);
    } catch (err: any) {
      console.error("submit error", err);
      alert("Failed to save sensor: " + (err?.response?.data?.error ?? err.message));
    }
  }

  async function deleteSensor(id: string) {
    if (!confirm("Delete this sensor? This will remove readings and alerts for it.")) return;
    try {
      await api.delete(`/sensors/${id}`);
      setSensors((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete sensor");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sensors</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" /> Add Sensor
          </button>
          <button
            onClick={load}
            className="px-3 py-2 bg-white border rounded hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading sensors...</p>
      ) : sensors.length === 0 ? (
        <p className="text-gray-500">No sensors available</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Last Reading</th>
                <th className="p-3">Created</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((s) => {
                const last = s.readings?.[0];
                return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 capitalize">{s.type}</td>
                    <td className="p-3 text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      {typeof s.location === "string"
                        ? s.location
                        : s.location
                        ? `${s.location.lat ?? ""}${s.location.lng ? ", " + s.location.lng : ""}`
                        : "—"}
                    </td>
                    <td className="p-3 text-sm text-gray-600 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      {last ? `${last.value ?? "—"} (${new Date(last.timestamp ?? "").toLocaleString()})` : "No data"}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-yellow-700" />
                      </button>
                      <button
                        onClick={() => deleteSensor(s.id)}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-700" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-3 top-3 p-1 rounded hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">{editing ? "Edit sensor" : "Add sensor"}</h2>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full border rounded px-3 py-2">
                  {SENSOR_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location (string or JSON)</label>
                <textarea value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="w-full border rounded px-3 py-2" rows={2} />
                <p className="text-xs text-gray-400 mt-1">Examples: "Sector 12"  OR  {"{ \"lat\": 28.6, \"lng\": 77.2 }"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Metadata (JSON) — optional</label>
                <textarea value={form.metadata} onChange={(e) => setForm((f) => ({ ...f, metadata: e.target.value }))} className="w-full border rounded px-3 py-2" rows={3} />
                <p className="text-xs text-gray-400 mt-1">Example: {"{ \"threshold\": 100, \"unit\": \"µg/m³\" }"}</p>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 bg-white border rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? "Save" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
