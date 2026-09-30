import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ArrowButtonProps {
  href: string;
  label: string;
  direction?: "right" | "up-right";
  variant?: "solid" | "ghost" | "accent";
  className?: string;
  external?: boolean;
  /** Hide from the tab order when a sibling link already goes to the same place. */
  decorative?: boolean;
}

const variants = {
  solid: "bg-bg-inverse text-text-inverse",
  ghost: "border border-line-strong text-text hover:border-accent hover:text-accent",
  accent: "bg-accent text-text-inverse",
} as const;

export function ArrowButton({
  href,
  label,
  direction = "right",
  variant = "solid",
  className,
  external,
  decorative,
}: ArrowButtonProps) {
  const Icon = direction === "right" ? ArrowRight : ArrowUpRight;
  const classes = cn(
    "group/arrow relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full [clip-path:circle(50%)] transition-[transform,background-color,border-color,color] duration-500 ease-out-expo active:scale-95",
    variants[variant],
    className,
  );
  const icon = (
    <>
      <Icon
        aria-hidden
        size={18}
        strokeWidth={1.75}
        className={cn(
          "transition-[translate,opacity] duration-500 ease-out-expo group-hover/arrow:opacity-0",
          direction === "right"
            ? "group-hover/arrow:translate-x-6"
            : "group-hover/arrow:translate-x-6 group-hover/arrow:-translate-y-6",
        )}
      />
      <Icon
        aria-hidden
        size={18}
        strokeWidth={1.75}
        className={cn(
          // Hidden until hover so it can never peek outside the circle.
          "absolute opacity-0 transition-[translate,opacity] duration-500 ease-out-expo group-hover/arrow:opacity-100",
          direction === "right"
            ? "-translate-x-6 group-hover/arrow:translate-x-0"
            : "-translate-x-6 translate-y-6 group-hover/arrow:translate-x-0 group-hover/arrow:translate-y-0",
        )}
      />
    </>
  );
  const a11y = decorative ? { tabIndex: -1, "aria-hidden": true } : { "aria-label": label };

  if (external || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={classes}
        {...a11y}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...a11y}>
      {icon}
    </Link>
  );
}
