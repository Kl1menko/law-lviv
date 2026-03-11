import type { Metadata } from "next";

import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import {
  buildArticleJsonLd,
  buildLegalServiceJsonLd,
  buildOrganizationJsonLd,
  buildServiceJsonLd,
} from "@/lib/structured-data";

type RuntimeMetadataInput = {
  pageTitle: string;
  description: string;
  path?: string;
};

export async function buildRuntimeMetadata({
  pageTitle,
  description,
  path = "/",
}: RuntimeMetadataInput): Promise<Metadata> {
  const settings = await getRuntimeSiteSettings();

  return buildMetadata({
    title: buildPageTitle(pageTitle, settings.companyName),
    description,
    path,
    siteName: settings.companyName,
  });
}

export async function buildRuntimeOrganizationJsonLd() {
  const settings = await getRuntimeSiteSettings();

  return buildOrganizationJsonLd({
    legalName: settings.legalName,
    city: settings.city,
    phone: settings.phonePrimary,
    email: settings.emailPrimary,
  });
}

export async function buildRuntimeLegalServiceJsonLd() {
  const settings = await getRuntimeSiteSettings();

  return buildLegalServiceJsonLd({
    legalName: settings.legalName,
    city: settings.city,
    region: settings.region,
    phone: settings.phonePrimary,
    email: settings.emailPrimary,
    address: settings.address,
    workHours: settings.workHours,
    mapsUrl: settings.googleMapsUrl,
  });
}

export async function buildRuntimeServiceJsonLd(input: {
  title: string;
  description: string;
  path: string;
}) {
  const settings = await getRuntimeSiteSettings();

  return buildServiceJsonLd({
    ...input,
    providerName: settings.legalName,
    areaServed: settings.city,
  });
}

export async function buildRuntimeArticleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
}) {
  const settings = await getRuntimeSiteSettings();

  return buildArticleJsonLd({
    ...input,
    authorName: settings.legalName,
  });
}
