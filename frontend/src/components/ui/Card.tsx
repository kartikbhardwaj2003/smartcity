// src/components/ui/Card.tsx
type Props = {
  title: string;
  value: number | string;
  color?: string;
};

export function Card({ title, value, color }: Props) {
  return (
    <div className={`rounded-lg shadow p-4 text-white ${color ?? "bg-gray-600"}`}>
      <div className="text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
