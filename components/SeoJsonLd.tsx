import { jsonLdScript, type JsonLd } from '@/lib/seo';

/**
 * Renders JSON-LD structured data.
 *
 * A component rather than inline <script> tags at each call site so the
 * escaping rule (a literal "<" inside JSON-LD can close the script tag early)
 * lives in exactly one place.
 */
export function SeoJsonLd({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is produced by jsonLdScript, which escapes "<" so it cannot
      // terminate the script element early.
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}