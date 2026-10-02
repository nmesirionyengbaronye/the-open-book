/**
 * Site-wide SEO.
 *
 * Every page used to hand-roll its own `metadata` object, which meant the same
 * three mistakes were repeated across the site:
 *
 *   1. Titles carried their own brand suffix ("Top Referrers - Uni UI") while the
 *      root layout applies a "%s | Uni UI" template, so they rendered as
 *      "Top Referrers - Uni UI | Uni UI".
 *   2. Canonical URLs were missing on all but two pages, so any campaign URL
 *      could be indexed as a duplicate of the clean one.
 *   3. Open Graph fell back to the generic brand card, so a shared /creators or
 *      /join link showed the homepage image instead of something describing the
 *      page it pointed at.
 *
 * `pageMeta()` produces all of it consistently, and the schema builders below
 * cover structured data. Import these rather than writing a metadata literal.
 */

import type { Metadata } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://waitlist.uniui.com.ng';

export const SITE_NAME = 'Uni UI';

export const SITE_DESCRIPTION =
  'Uni UI is an AI academic platform for Nigerian university students. Upload your ' +
  'course materials and get answers grounded in your own notes, exam prep, and a ' +
  'student referral programme. Live at FUTO.';

/** Default social card. Page-specific cards override this. */
export const DEFAULT_OG_IMAGE = '/og-image.png';

/**
 * Titles are supplied WITHOUT a brand suffix — the root layout appends
 * "%s | Uni UI". The `absolute` flag bypasses the template for the homepage,
 * where a suffixed title wastes the most valuable characters.
 */
export function pageMeta(input: {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  /** Social share card. Defaults to the brand card. */
  image?: string;
  imageAlt?: string;
  /** Set false for user-specific, private, or thin pages. */
  index?: boolean;
  absolute?: boolean;
}): Metadata {
  const {
    title,
    description,
    keywords,
    path,
    image = DEFAULT_OG_IMAGE,
    imageAlt,
    index = true,
    absolute = false,
  } = input;

  const url = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: absolute ? title : `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_NG',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt ?? title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: absolute ? title : `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

export type JsonLd = Record<string, unknown>;

/** Organization + WebSite, emitted once from the root layout. */
export function organizationSchema(): JsonLd[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.jpg`,
      description: SITE_DESCRIPTION,
      email: 'sofia@uniui.com.ng',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-NG',
    },
  ];
}

/**
 * Page-level schema. `breadcrumb` should run leaf-first, excluding Home, whose
 * item id is the site root.
 */
export function webPageSchema(input: {
  name: string;
  description: string;
  path: string;
  breadcrumb?: { name: string; path: string }[];
  dateModified?: string;
}): JsonLd {
  const url = `${SITE_URL}${input.path === '/' ? '' : input.path}`;

  const node: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    description: input.description,
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'en-NG',
  };
  if (input.dateModified) node.dateModified = input.dateModified;

  if (input.breadcrumb?.length) {
    node.breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        ...input.breadcrumb.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 2,
          name: b.name,
          item: `${SITE_URL}${b.path === '/' ? '' : b.path}`,
        })),
      ],
    };
  }

  return node;
}

export type Faq = { question: string; answer: string };

/**
 * FAQPage schema. Only include questions that are visibly rendered on the page —
 * marking up content a visitor cannot see is a manual-action risk.
 */
export function faqSchema(faqs: Faq[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Serialise JSON-LD for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}