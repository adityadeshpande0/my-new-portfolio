import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  children: ReactNode;
  variant?: "default" | "inverse" | "outline";
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h1" | "h2" | "h3" | "aside";
  interactive?: boolean;
}

const variants = {
  default: "bg-bg-elevated border-line text-text",
  inverse: "bg-bg-inverse border-transparent text-text-inverse",
  outline: "bg-transparent border-line-strong text-text",
} as const;

export function Card({ children, variant = "default", className, as: Tag = "div", interactive }: CardProps) {
  return (
    <Tag
      className={cn(
        "relative rounded-card border p-6 sm:p-8",
        variants[variant],
        interactive &&
          "transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_60px_-30px_rgba(232,161,92,0.35)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
