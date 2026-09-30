import { RevealText } from "@/components/motion/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  label: string;
  index: number;
  title: string;
  id: string;
  className?: string;
}

export function SectionHeading({ label, index, title, id, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 flex flex-col gap-5 sm:mb-16", className)}>
      <SectionLabel index={index}>{label}</SectionLabel>
      <RevealText as="h2" id={`${id}-title`} text={title} className="type-h2 max-w-[18ch]" />
    </div>
  );
}
