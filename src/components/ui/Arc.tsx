import { cn } from "@/lib/utils";

export interface ArcProps {
  size: number;
  className?: string;
  /** Portion of the circle to draw, 0–1. */
  sweep?: number;
  rotate?: number;
  accent?: boolean;
}

/** Large faint decorative circle outline. */
export function Arc({ size, className, sweep = 1, rotate = 0, accent }: ArcProps) {
  const r = 49.75;
  const c = 2 * Math.PI * r;
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("pointer-events-none absolute", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
    >
      <circle
        cx="50"
        cy="50"
        r={r}
        stroke={accent ? "var(--accent)" : "var(--border-strong)"}
        strokeOpacity={accent ? 0.35 : 0.6}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        strokeDasharray={sweep < 1 ? `${c * sweep} ${c}` : undefined}
      />
    </svg>
  );
}
