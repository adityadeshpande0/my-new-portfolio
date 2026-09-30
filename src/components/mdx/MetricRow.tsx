export interface MetricRowProps {
  items: Array<{ value: string; label: string }>;
}

export function MetricRow({ items }: MetricRowProps) {
  return (
    <ul className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((m) => (
        <li key={m.label} className="rounded-2xl border border-line bg-bg-elevated p-5">
          <p className="type-display text-[40px] text-text">{m.value}</p>
          <p className="type-label mt-3 text-muted">{m.label}</p>
        </li>
      ))}
    </ul>
  );
}
