import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { isValidElement, type ReactNode } from "react";

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export interface FigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

/** Optimised image for articles: `<Figure src="/images/articles/x.png" alt="…" width={1600} height={900} />`. */
export function Figure({ src, alt, width, height, caption }: FigureProps) {
  return (
    <figure className="my-10">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 44rem, 100vw"
        className="h-auto w-full rounded-2xl border border-line"
      />
      {caption && <figcaption className="type-label mt-3 text-center text-muted">{caption}</figcaption>}
    </figure>
  );
}

function Heading({ level, children }: { level: 2 | 3; children: ReactNode }) {
  const id = slugify(textOf(children));
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      id={id}
      className={
        level === 2
          ? "group mt-16 mb-5 scroll-mt-24 font-mono text-[clamp(24px,3vw,32px)] leading-tight font-bold tracking-tight"
          : "group mt-10 mb-3 scroll-mt-24 text-xl font-medium tracking-tight sm:text-2xl"
      }
    >
      <a href={`#${id}`} className="no-underline">
        {children}
        <span aria-hidden className="ml-2 text-accent opacity-0 transition-opacity group-hover:opacity-100">
          #
        </span>
      </a>
    </Tag>
  );
}

/** Long-form reading styles for articles (case studies keep their own MDX components). */
export const articleComponents: MDXComponents = {
  h1: ({ children }) => <Heading level={2}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  p: ({ children }) => <p className="mb-6 text-[17px] leading-[1.8] text-text/85 sm:text-lg">{children}</p>,
  strong: ({ children }) => <strong className="font-medium text-text">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-text underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => <ul className="mb-6 flex flex-col gap-2.5">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-6 flex list-decimal flex-col gap-2.5 pl-6 text-text/85 marker:text-accent">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="relative pl-5 text-[17px] leading-[1.75] text-text/85 sm:text-lg [ol_&]:pl-1">
      <span aria-hidden className="absolute top-[0.8em] left-0 h-1 w-2.5 rounded-full bg-accent/70 [ol_&]:hidden" />
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-accent pl-6 text-xl leading-relaxed text-text italic [&_p]:text-text">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md border border-line bg-bg-elevated px-1.5 py-0.5 font-mono text-[0.85em] text-text">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-8 overflow-x-auto rounded-2xl border border-line bg-bg-elevated p-5 font-mono text-[13.5px] leading-relaxed sm:p-6 [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-14 border-line" />,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-[15px]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="type-label border-b border-line bg-bg-elevated px-4 py-3 font-normal text-muted">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-line px-4 py-3 text-text/85">{children}</td>,
  Figure,
};
