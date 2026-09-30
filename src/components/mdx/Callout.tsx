import type { ReactNode } from "react";

export interface CalloutProps {
  children: ReactNode;
  label?: string;
}

export function Callout({ children, label = "Note" }: CalloutProps) {
  return (
    <aside className="mb-8 rounded-2xl border border-accent/30 bg-accent-soft/50 px-6 py-5 [&_p:last-child]:mb-0">
      <p className="type-label mb-2 text-accent">{label}</p>
      {children}
    </aside>
  );
}
