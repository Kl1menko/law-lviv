import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  siteName?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  siteName = siteConfig.name,
}: MetadataInput): Metadata {
  const canonical = new URL(path, siteConfig.domain).toString();

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildPageTitle(pageTitle: string, siteName = siteConfig.name) {
  return `${pageTitle} | ${siteName}`;
}
