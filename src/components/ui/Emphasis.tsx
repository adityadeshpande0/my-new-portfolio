import { parseEmphasis } from "@/lib/utils";

export interface EmphasisProps {
  text: string;
}

/** Renders "*word*" segments as italic, full-contrast emphasis. */
export function Emphasis({ text }: EmphasisProps) {
  return (
    <>{parseEmphasis(text).map((seg, i) => (seg.em ? <em key={i}>{seg.text}</em> : <span key={i}>{seg.text}</span>))}</>
  );
}
