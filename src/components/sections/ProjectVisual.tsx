import type { Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export interface ProjectVisualProps {
  motif: Project["motif"];
  className?: string;
}

/**
 * Recreated, anonymised mockups drawn in code — no proprietary screenshots.
 * Two overlapping rounded panels per project.
 */
export function ProjectVisual({ motif, className }: ProjectVisualProps) {
  return (
    <div className={cn("relative aspect-[5/4] w-full", className)} aria-hidden>
      <div className="absolute inset-0 overflow-hidden rounded-card border border-line bg-bg-elevated">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_10%,rgba(232,161,92,0.18),transparent_60%)]" />
        <div className="absolute top-5 left-5 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full bg-line-strong" />
          ))}
        </div>
        <div className="absolute inset-x-6 top-12 bottom-6 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
          <Primary motif={motif} />
        </div>
      </div>
      <div className="absolute -right-3 -bottom-6 w-[46%] overflow-hidden rounded-[20px] border border-line-strong bg-bg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:rotate-[-2deg] sm:-right-6">
        <div className="aspect-[4/3] p-4">
          <Secondary motif={motif} />
        </div>
      </div>
    </div>
  );
}

function Primary({ motif }: { motif: Project["motif"] }) {
  switch (motif) {
    case "graph": {
      const nodes = [
        [50, 14, "shell"],
        [20, 44, "app-a"],
        [50, 44, "app-b"],
        [80, 44, "app-c"],
        [12, 80, "ui"],
        [38, 80, "data"],
        [62, 80, "auth"],
        [88, 80, "utils"],
      ] as const;
      const edges = [
        [0, 1],
        [0, 2],
        [0, 3],
        [1, 4],
        [1, 5],
        [2, 5],
        [2, 6],
        [3, 6],
        [3, 7],
        [2, 4],
      ];
      return (
        <svg viewBox="0 0 100 94" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          {edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={nodes[a][0]}
              y1={nodes[a][1]}
              x2={nodes[b][0]}
              y2={nodes[b][1]}
              stroke="var(--border-strong)"
              strokeWidth={0.4}
            />
          ))}
          {nodes.map(([x, y, label], i) => (
            <g key={label}>
              <circle
                cx={x}
                cy={y}
                r={i === 0 ? 3.2 : 2.2}
                fill={i === 0 ? "var(--accent)" : "var(--bg)"}
                stroke="var(--accent)"
                strokeWidth={0.5}
              />
              <text
                x={x}
                y={y + 7.5}
                textAnchor="middle"
                fontSize={3.4}
                fill="var(--text-muted)"
                fontFamily="var(--font-jetbrains)"
              >
                {label}
              </text>
            </g>
          ))}
        </svg>
      );
    }
    case "components":
      return (
        <div className="grid h-full grid-cols-3 grid-rows-3 gap-2">
          <div className="col-span-2 rounded-xl border border-line bg-bg p-3">
            <div className="h-2 w-1/2 rounded-full bg-line-strong" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-line" />
          </div>
          <div className="grid place-items-center rounded-xl bg-accent/90">
            <div className="h-2 w-1/2 rounded-full bg-text-inverse/60" />
          </div>
          <div className="rounded-xl border border-line bg-bg p-3">
            <div className="h-4 w-8 rounded-full bg-accent/80" />
          </div>
          <div className="col-span-2 row-span-2 rounded-xl border border-line bg-bg p-3">
            {[70, 55, 85, 40].map((w) => (
              <div key={w} className="mb-2 flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-line-strong" />
                <span className="h-2 rounded-full bg-line-strong" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-line bg-bg" />
        </div>
      );
    case "trophy":
      return (
        <div className="flex h-full flex-col justify-end gap-2">
          <div className="flex h-full items-end gap-2">
            {[38, 62, 48, 92, 70, 56].map((h, i) => (
              <div
                key={i}
                className={cn("flex-1 rounded-t-lg", i === 3 ? "bg-accent" : "bg-line-strong")}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="type-label flex justify-between text-[10px] text-muted">
            <span>00:00</span>
            <span>48:00</span>
          </div>
        </div>
      );
    case "chat":
      return (
        <div className="flex h-full w-[62%] flex-col gap-2">
          <div className="self-end rounded-2xl rounded-br-md bg-bg-inverse px-3 py-2">
            <div className="h-2 w-20 rounded-full bg-text-inverse/30" />
          </div>
          <div className="rounded-2xl rounded-bl-md border border-line bg-bg px-3 py-2.5">
            <div className="h-2 w-40 max-w-full rounded-full bg-line-strong" />
            <div className="mt-1.5 h-2 w-28 rounded-full bg-line-strong" />
            <div className="mt-1.5 h-2 w-16 rounded-full bg-accent/70" />
          </div>
          <div className="self-end rounded-2xl rounded-br-md bg-bg-inverse px-3 py-2">
            <div className="h-2 w-12 rounded-full bg-text-inverse/30" />
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-full border border-line-strong px-3 py-2">
            <div className="h-2 flex-1 rounded-full bg-line" />
            <span className="h-4 w-4 rounded-full bg-accent" />
          </div>
        </div>
      );
  }
}

function Secondary({ motif }: { motif: Project["motif"] }) {
  const lines: Record<Project["motif"], string[]> = {
    graph: ["$ nx affected -t build", "✓ app-b  1.2s", "✓ data   0.4s", "◦ 5 cached"],
    components: ["<Button", '  variant="pill"', '  size="md"', "/>"],
    trophy: ["RESULT", "Runner-Up", "Techzooka", "48h build"],
    chat: ["stream: true", "model: gpt", "tokens ▸▸▸", "200 OK"],
  };
  return (
    <div className="type-label flex h-full flex-col justify-center gap-1 text-[10px] leading-tight sm:text-[11px]">
      {lines[motif].map((l, i) => (
        <span key={l} className={i === 1 ? "text-accent" : "text-muted"}>
          {l}
        </span>
      ))}
    </div>
  );
}
