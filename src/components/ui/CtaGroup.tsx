import { Magnetic } from "@/components/motion/Magnetic";
import { cn } from "@/lib/utils";
import { ArrowButton } from "./ArrowButton";
import { PillButton } from "./PillButton";

export interface CtaGroupProps {
  label: string;
  href: string;
  className?: string;
}

/** Pill + circular arrow, both magnetic, both pointing at the same target. */
export function CtaGroup({ label, href, className }: CtaGroupProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Magnetic>
        <PillButton href={href}>{label}</PillButton>
      </Magnetic>
      <Magnetic>
        <ArrowButton href={href} label={label} decorative />
      </Magnetic>
    </div>
  );
}
