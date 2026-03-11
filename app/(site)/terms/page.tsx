import { notFound } from "next/navigation";

import { StaticSections } from "@/components/content/static-sections";
import { PageShell } from "@/components/shared/page-shell";
import { getStaticPageByKey } from "@/lib/content/repositories";
import type { ContentSection } from "@/lib/content/types";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export async function generateMetadata() {
  const page = await getStaticPageByKey("terms");

  return buildMetadata({
    title: page?.seoTitle ?? buildPageTitle("Умови використання"),
    description: page?.seoDescription ?? "Службова сторінка умов використання сайту.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const page = await getStaticPageByKey("terms");

  if (!page) {
    notFound();
  }

  return (
    <PageShell eyebrow="Legal" title={page.title} description={page.intro ?? page.seoDescription}>
      <StaticSections sections={page.bodySections as ContentSection[]} />
    </PageShell>
  );
}
