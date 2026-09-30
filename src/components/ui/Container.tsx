import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h1" | "h2" | "h3" | "aside";
}

export function Container({ children, className, as: Tag = "div" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-[var(--container)] px-[var(--gutter)]", className)}>{children}</Tag>;
}
