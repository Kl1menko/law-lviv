import { notFound } from "next/navigation";

import { StaticSections } from "@/components/content/static-sections";
import { PageShell } from "@/components/shared/page-shell";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArticleBySlug, getStaticPageByKey } from "@/lib/content/repositories";
import { seedStaticPages } from "@/lib/content/seed-data";
import type { ContentSection } from "@/lib/content/types";
import { buildRuntimeMetadata } from "@/lib/runtime-seo";

const pricingFallback = seedStaticPages.find((page) => page.key === "pricing");

export async function generateMetadata() {
  const page = await getStaticPageByKey("pricing");

  return buildRuntimeMetadata({
    pageTitle: page?.title ?? pricingFallback?.title ?? "Вартість послуг",
    description:
      page?.seoDescription ?? pricingFallback?.seoDescription ?? "Сторінка про формування вартості юридичних послуг.",
    path: "/vartist-poslug",
  });
}

export default async function PricingPage() {
  const [page, article] = await Promise.all([
    getStaticPageByKey("pricing"),
    getArticleBySlug("shcho-vplyvaye-na-vartist-yurydychnykh-posluh"),
  ]);
  const content = page ?? pricingFallback;

  if (!content) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Вартість"
      title={content.title}
      description={content.intro ?? content.seoDescription}
    >
      <StaticSections sections={content.bodySections as ContentSection[]} />
      {article ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="Детальніше"
            title="Матеріал про формування вартості"
            description="Окрема стаття пояснює, чому бюджет справи залежить не від назви послуги, а від реального обсягу роботи."
          />
          <Card>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{article.category}</p>
            <h2 className="mt-3 font-serif text-3xl tracking-tight">{article.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{article.excerpt}</p>
            <a href={`/blog/${article.slug}`} className="mt-5 inline-block text-sm font-medium">
              Читати статтю
            </a>
          </Card>
        </section>
      ) : null}
    </PageShell>
  );
}
