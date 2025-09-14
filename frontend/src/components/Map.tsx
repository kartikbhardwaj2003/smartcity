import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapCard() {
  const defaultPos: [number, number] = [28.6139, 77.209]; // example

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">City Map</h3>
      <div style={{ height: 300 }}>
        <MapContainer center={defaultPos} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={defaultPos}>
            <Popup>SmartCity Center</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
