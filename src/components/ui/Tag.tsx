import { cn } from "@/lib/utils";

export interface TagProps {
  children: string;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        "type-label inline-flex h-7 items-center rounded-pill border border-line-strong px-3 text-[12px] text-muted transition-[border-color,color,box-shadow] duration-500 hover:border-accent/60 hover:text-text hover:shadow-[0_0_18px_-4px_var(--accent-soft)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
