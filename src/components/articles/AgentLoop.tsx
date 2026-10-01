const steps = [
  {
    title: "Context",
    body: "The harness assembles instructions, project rules, the conversation so far and tool definitions.",
  },
  { title: "Model", body: "The model reads that context and replies with text or a request to use a tool." },
  {
    title: "Permissions",
    body: "The harness checks the request against the rules: allowed, needs approval, or blocked.",
  },
  { title: "Tool", body: "The harness runs the tool: a shell command, a file edit, a browser, an API call." },
  { title: "Result", body: "Output and errors go back into the context, and the loop repeats until the task is done." },
] as const;

/** Responsive diagram of an agent loop: a row of steps on wide screens, a stacked list on phones. */
export function AgentLoop() {
  return (
    <figure className="my-10" aria-labelledby="agent-loop-caption">
      <ol className="grid gap-3 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.title} className="relative rounded-2xl border border-line bg-bg-elevated p-4">
            <span className="type-label text-accent">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-2 font-mono text-[15px] font-bold">{s.title}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.body}</p>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="absolute -bottom-3 left-1/2 z-10 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full border border-line-strong bg-bg text-[12px] text-accent md:top-1/2 md:-right-3 md:bottom-auto md:left-auto md:translate-x-0 md:-translate-y-1/2"
              >
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="type-label mt-3 text-center text-muted">↺ back to step 01 with the result in context</p>
      <figcaption id="agent-loop-caption" className="sr-only">
        The agent loop: the harness builds context, the model decides, the harness checks permissions, runs the tool,
        and feeds the result back.
      </figcaption>
    </figure>
  );
}
