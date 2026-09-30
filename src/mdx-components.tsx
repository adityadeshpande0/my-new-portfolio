import type { MDXComponents } from "mdx/types";
import { ArchitectureDiagram } from "@/components/mdx/ArchitectureDiagram";
import { Callout } from "@/components/mdx/Callout";
import { MetricRow } from "@/components/mdx/MetricRow";

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="type-label mt-20 mb-5 text-[13px] first:mt-0">
      <span className="text-muted" aria-hidden>
        …/
      </span>
      <span className="text-text">{children}</span>
      <span className="text-muted" aria-hidden>
        …
      </span>
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-10 mb-3 text-xl font-medium tracking-tight">{children}</h3>,
  p: ({ children }) => <p className="mb-5 text-lg leading-relaxed text-muted">{children}</p>,
  em: ({ children }) => <em>{children}</em>,
  strong: ({ children }) => <strong className="font-medium text-text">{children}</strong>,
  ul: ({ children }) => <ul className="mb-6 flex flex-col gap-2.5">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-6 flex list-decimal flex-col gap-2.5 pl-5 text-muted marker:text-accent">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="relative pl-5 text-[17px] leading-relaxed text-muted [ol_&]:pl-1">
      <span aria-hidden className="absolute top-[0.75em] left-0 h-1 w-2.5 rounded-full bg-accent/70 [ol_&]:hidden" />
      {children}
    </li>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-text underline decoration-accent/60 underline-offset-4 hover:text-accent">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="type-label rounded-md border border-line bg-bg-elevated px-1.5 py-0.5 text-[0.85em] text-text">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="type-label mb-6 overflow-x-auto rounded-2xl border border-line bg-bg-elevated p-5 text-[13px] leading-relaxed [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-16 border-line" />,
  ArchitectureDiagram,
  Callout,
  MetricRow,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
