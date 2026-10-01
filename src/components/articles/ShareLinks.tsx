"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { LinkedInIcon } from "@/components/ui/icons";

export interface ShareLinksProps {
  url: string;
  title: string;
}

export function ShareLinks({ url, title }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const pill =
    "type-label inline-flex h-9 items-center gap-2 rounded-pill border border-line-strong px-4 transition-colors hover:border-accent hover:text-accent";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="type-label mr-2 text-muted">Share</span>
      <a
        className={pill}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon width={13} height={13} />
        LinkedIn
      </a>
      <a
        className={pill}
        href={`https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <button type="button" className={pill} onClick={copy}>
        {copied ? <Check size={14} aria-hidden /> : <Link2 size={14} aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
