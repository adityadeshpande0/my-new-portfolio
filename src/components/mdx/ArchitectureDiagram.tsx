/** Nx workspace dependency diagram used in the monorepo case study. */
export function ArchitectureDiagram() {
  const apps = ["app-projects", "app-reports", "app-admin"];
  const libs = [
    { name: "ui-kit", x: 60 },
    { name: "data-access", x: 250 },
    { name: "auth", x: 440 },
    { name: "utils", x: 630 },
  ];
  const box = "fill-[var(--bg-elevated)] stroke-[var(--border-strong)]";
  return (
    <figure className="mb-10 overflow-hidden rounded-2xl border border-line bg-bg p-4 sm:p-8">
      <svg viewBox="0 0 780 360" className="h-auto w-full" role="img" aria-labelledby="arch-title arch-desc">
        <title id="arch-title">Nx workspace architecture</title>
        <desc id="arch-desc">
          Three applications depend on four shared libraries. CI uses the Nx project graph to build and test only
          affected projects, with remote caching.
        </desc>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" />
          </marker>
        </defs>
        <text x="20" y="28" className="fill-[var(--text-muted)] font-mono text-[13px]">
          apps/
        </text>
        {apps.map((a, i) => {
          const x = 90 + i * 220;
          return (
            <g key={a}>
              <rect x={x} y={44} width={160} height={52} rx={14} className={box} />
              <text x={x + 80} y={75} textAnchor="middle" className="fill-[var(--text)] font-mono text-[14px]">
                {a}
              </text>
              {libs.map((l, j) =>
                (i + j) % 3 !== 2 ? (
                  <line
                    key={l.name}
                    x1={x + 80}
                    y1={96}
                    x2={l.x + 45}
                    y2={200}
                    stroke="var(--accent)"
                    strokeOpacity={0.35}
                    markerEnd="url(#arrow)"
                  />
                ) : null,
              )}
            </g>
          );
        })}
        <text x="20" y="190" className="fill-[var(--text-muted)] font-mono text-[13px]">
          libs/
        </text>
        {libs.map((l) => (
          <g key={l.name}>
            <rect
              x={l.x}
              y={204}
              width={90 + 40}
              height={48}
              rx={24}
              className="fill-[var(--bg)] stroke-[var(--accent)]"
              strokeOpacity={0.6}
            />
            <text x={l.x + 65} y={233} textAnchor="middle" className="fill-[var(--text)] font-mono text-[13px]">
              {l.name}
            </text>
          </g>
        ))}
        <rect x={20} y={290} width={740} height={50} rx={14} className="fill-[var(--accent-soft)]" />
        <text x={390} y={320} textAnchor="middle" className="fill-[var(--accent)] font-mono text-[13px]">
          Azure DevOps · nx affected -t lint test build · remote cache
        </text>
      </svg>
      <figcaption className="type-label mt-4 text-center text-muted">Simplified, anonymised workspace graph</figcaption>
    </figure>
  );
}
