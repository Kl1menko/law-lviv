import { notFound } from "next/navigation";

import { StaticSections } from "@/components/content/static-sections";
import { PageShell } from "@/components/shared/page-shell";
import { getStaticPageByKey } from "@/lib/content/repositories";
import type { ContentSection } from "@/lib/content/types";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export async function generateMetadata() {
  const page = await getStaticPageByKey("about");

  return buildMetadata({
    title: page?.seoTitle ?? buildPageTitle("Про компанію"),
    description: page?.seoDescription ?? "Історія, підхід до роботи і позиціонування юридичної компанії у Львові.",
    path: "/pro-kompaniyu",
  });
}

export default async function AboutPage() {
  const page = await getStaticPageByKey("about");

  if (!page) {
    notFound();
  }

  return (
    <PageShell eyebrow="Про компанію" title={page.title} description={page.intro ?? page.seoDescription}>
      <StaticSections sections={page.bodySections as ContentSection[]} />
    </PageShell>
  );
}
