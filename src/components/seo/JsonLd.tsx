export interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/** Structured data for search engines. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
