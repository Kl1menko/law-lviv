import { siteConfig } from "@/lib/site-config";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type SiteSchemaOverrides = {
  legalName?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  address?: string;
  workHours?: string;
  mapsUrl?: string | null;
};

export function buildOrganizationJsonLd(overrides: SiteSchemaOverrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: overrides.legalName ?? siteConfig.legalName,
    areaServed: overrides.city ?? siteConfig.city,
    telephone: overrides.phone ?? siteConfig.phone,
    email: overrides.email ?? siteConfig.email,
    url: siteConfig.domain,
  };
}

export function buildLegalServiceJsonLd(overrides: SiteSchemaOverrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: overrides.legalName ?? siteConfig.legalName,
    areaServed: overrides.city ?? siteConfig.city,
    telephone: overrides.phone ?? siteConfig.phone,
    email: overrides.email ?? siteConfig.email,
    url: siteConfig.domain,
    address: {
      "@type": "PostalAddress",
      addressLocality: overrides.city ?? siteConfig.city,
      addressRegion: overrides.region ?? "Львівська область",
      streetAddress: overrides.address ?? overrides.city ?? siteConfig.city,
    },
    openingHours: overrides.workHours,
    hasMap: overrides.mapsUrl ?? undefined,
  };
}

export function buildServiceJsonLd({
  title,
  description,
  path,
  providerName,
  areaServed,
}: {
  title: string;
  description: string;
  path: string;
  providerName?: string;
  areaServed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: title,
    areaServed: areaServed ?? siteConfig.city,
    description,
    provider: {
      "@type": "LegalService",
      name: providerName ?? siteConfig.legalName,
    },
    url: new URL(path, siteConfig.domain).toString(),
  };
}

export function buildArticleJsonLd({
  title,
  description,
  path,
  publishedAt,
  authorName,
}: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: publishedAt,
    author: {
      "@type": "Organization",
      name: authorName ?? siteConfig.legalName,
    },
    mainEntityOfPage: new URL(path, siteConfig.domain).toString(),
  };
}

export function buildFaqJsonLd(
  items: Array<{
    question: string;
    answer: string;
  }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.domain).toString(),
    })),
  };
}
