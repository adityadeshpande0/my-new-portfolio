import { FileDown, Mail } from "lucide-react";
import type { SocialLink } from "@/content/profile";
import { cn } from "@/lib/utils";
import { GitHubIcon, LinkedInIcon } from "./icons";

export interface SocialPillProps {
  link: SocialLink;
  className?: string;
}

const icons = {
  GitHub: <GitHubIcon width={14} height={14} />,
  LinkedIn: <LinkedInIcon width={13} height={13} />,
  Email: <Mail aria-hidden size={14} strokeWidth={1.75} />,
  Resume: <FileDown aria-hidden size={14} strokeWidth={1.75} />,
} as const;

export function SocialPill({ link, className }: SocialPillProps) {
  return (
    <a
      href={link.href}
      className={cn(
        "type-label inline-flex h-9 items-center gap-2 rounded-pill border border-line-strong px-4 text-text transition-[border-color,color,background-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft hover:text-accent",
        className,
      )}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(link.download ? { download: "" } : {})}
    >
      {icons[link.label]}
      {link.label}
      {link.download && <span className="sr-only">(PDF download)</span>}
    </a>
  );
}
