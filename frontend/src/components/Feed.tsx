export default function FeedCard() {
  const items = [
    { id: 1, text: "Traffic congestion on A-23", level: "CRITICAL" },
    { id: 2, text: "Garbage pickup delayed in Sector 8", level: "WARNING" },
    { id: 3, text: "Air quality moderate in West Zone", level: "INFO" }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Live Feed</h3>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.id} className="p-3 rounded border">
            <div className="text-sm text-gray-500">{it.level}</div>
            <div className="mt-1">{it.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


