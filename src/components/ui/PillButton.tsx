import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PillButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: ComponentPropsWithoutRef<"button">["onClick"];
  external?: boolean;
  download?: boolean;
}

const base =
  "group/pill relative inline-flex h-11 items-center justify-center overflow-hidden rounded-pill px-6 font-sans text-[15px] font-medium italic tracking-tight transition-[transform,background-color,border-color,color] duration-500 ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  solid: "bg-bg-inverse text-text-inverse hover:bg-white",
  ghost: "border border-line-strong text-text hover:border-accent hover:text-accent",
} as const;

export function PillButton({
  children,
  href,
  variant = "solid",
  className,
  external,
  download,
  ...rest
}: PillButtonProps) {
  const classes = cn(base, variants[variant], className);
  const label = (
    <span className="relative -mx-1 block overflow-hidden px-1">
      <span className="block transition-transform duration-500 ease-out-expo group-hover/pill:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover/pill:translate-y-0"
      >
        {children}
      </span>
    </span>
  );

  if (href) {
    if (external || download || href.startsWith("mailto:")) {
      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...(download ? { download: "" } : {})}
        >
          {label}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button className={classes} type={rest.type ?? "button"} disabled={rest.disabled} onClick={rest.onClick}>
      {label}
    </button>
  );
}
