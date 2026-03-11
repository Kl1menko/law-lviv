import type { MetadataRoute } from "next";

import {
  getPublishedArticles,
  getPublishedSeoLandingPages,
  getPublishedServices,
} from "@/lib/content/repositories";
import { siteConfig } from "@/lib/site-config";

const staticRoutes = [
  "/",
  "/pro-kompaniyu",
  "/poslugy",
  "/blog",
  "/faq",
  "/kontakty",
  "/vartist-poslug",
  "/vidguky",
  "/privacy-policy",
  "/terms",
] as const;

function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.domain).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, articles, seoPages] = await Promise.all([
    getPublishedServices(),
    getPublishedArticles(),
    getPublishedSeoLandingPages(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: toAbsoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: toAbsoluteUrl(`/poslugy/${service.slug}`),
    lastModified: service.updatedAt,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: toAbsoluteUrl(`/blog/${article.slug}`),
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const seoEntries: MetadataRoute.Sitemap = seoPages.map((page) => ({
    url: toAbsoluteUrl(`/lviv/${page.slug}`),
    lastModified: page.updatedAt,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticEntries, ...serviceEntries, ...articleEntries, ...seoEntries];
}
