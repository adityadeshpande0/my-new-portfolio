import { cn } from "@/lib/utils";

export interface SectionLabelProps {
  children: string;
  index?: number;
  className?: string;
  tone?: "default" | "inverse";
}

/** Renders `…/About me…` in mono, optionally prefixed with a section index. */
export function SectionLabel({ children, index, className, tone = "default" }: SectionLabelProps) {
  const muted = tone === "inverse" ? "text-inverse-muted" : "text-muted";
  return (
    <p className={cn("type-label flex items-baseline gap-3", className)}>
      {index !== undefined && <span className={cn("tabular-nums", muted)}>{String(index).padStart(2, "0")}</span>}
      <span>
        <span className={muted} aria-hidden>
          …/
        </span>
        <span className={tone === "inverse" ? "text-text-inverse" : "text-text"}>{children}</span>
        <span className={muted} aria-hidden>
          …
        </span>
      </span>
    </p>
  );
}
