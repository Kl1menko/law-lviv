import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqList } from "@/components/content/faq-list";
import { StaticSections } from "@/components/content/static-sections";
import { JsonLd } from "@/components/shared/json-ld";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getArticlesByIds,
  getPublishedSeoLandingPages,
  getSeoLandingPageBySlug,
  getServicesByIds,
} from "@/lib/content/repositories";
import type { ContentSection } from "@/lib/content/types";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildRuntimeMetadata, buildRuntimeServiceJsonLd } from "@/lib/runtime-seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/structured-data";

type SeoLandingPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: SeoLandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getSeoLandingPageBySlug(slug);
  const settings = await getRuntimeSiteSettings();

  if (!page) {
    return buildRuntimeMetadata({
      pageTitle: "SEO сторінку не знайдено",
      description: "Локальна SEO-сторінка не знайдена.",
      path: `/lviv/${slug}`,
    });
  }

  return buildMetadata({
    title: page.seoTitle || buildPageTitle(page.title, settings.companyName),
    description: page.seoDescription,
    path: `/lviv/${slug}`,
    siteName: settings.companyName,
  });
}

export async function generateStaticParams() {
  const pages = await getPublishedSeoLandingPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function SeoLandingPage({ params }: SeoLandingPageProps) {
  const { slug } = await params;
  const page = await getSeoLandingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const [relatedServices, relatedArticles, serviceJsonLd, allSeoPages] = await Promise.all([
    getServicesByIds(page.relatedServiceIds),
    getArticlesByIds(page.relatedArticleIds),
    buildRuntimeServiceJsonLd({
      title: page.title,
      description: page.seoDescription,
      path: `/lviv/${page.slug}`,
    }),
    getPublishedSeoLandingPages(),
  ]);

  const faqItems = (page.faqItems as Array<{ question: string; answer: string }>).map((item, index) => ({
    id: String(index),
    question: item.question,
    answer: item.answer,
  }));
  const siblingPages = allSeoPages
    .filter((item) => item.id !== page.id)
    .filter((item) => item.relatedServiceIds.some((id) => page.relatedServiceIds.includes(id)))
    .slice(0, 3);

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {faqItems.length ? <JsonLd data={buildFaqJsonLd(faqItems)} /> : null}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Головна", path: "/" },
          { name: "Львів", path: `/lviv/${page.slug}` },
          { name: page.title, path: `/lviv/${page.slug}` },
        ])}
      />
      <PageShell eyebrow="Локальне SEO" title={page.heroTitle} description={page.heroDescription}>
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4 border-[var(--foreground)] bg-[var(--foreground)] text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Локальний намір</p>
            <h2 className="font-serif text-3xl tracking-tight">{page.title}</h2>
            <p className="text-sm leading-7 text-white/80">{page.intro}</p>
            <div className="flex flex-wrap gap-3">
              <Button href="/kontakty" variant="secondary">
                Отримати консультацію
              </Button>
              {relatedServices[0] ? (
                <a
                  href={`/poslugy/${relatedServices[0].slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--foreground)]"
                >
                  Перейти до послуги
                </a>
              ) : null}
            </div>
          </Card>
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Що дає ця сторінка</p>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Локальний сценарій пошуку для користувача, який хоче знайти адвоката у Львові під конкретну задачу.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              {relatedServices.length} пов’язаних послуг і {relatedArticles.length} матеріалів для уточнення наміру.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              FAQ-блок і внутрішня перелінковка для локальної SEO-структури без thin pages.
            </div>
          </Card>
        </section>
        <StaticSections sections={page.contentSections as ContentSection[]} />
        {faqItems.length ? (
          <section id="seo-faq" className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Часті питання</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Відповіді на типові запити користувачів, які шукають допомогу саме у Львові.
              </p>
            </div>
            <FaqList items={faqItems} />
          </section>
        ) : null}
        {siblingPages.length ? (
          <section className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Суміжні локальні сторінки</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Додаткові сценарії пошуку по Львову для користувачів, чий запит межує з цією темою.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {siblingPages.map((siblingPage) => (
                <article key={siblingPage.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <h3 className="font-serif text-2xl tracking-tight">{siblingPage.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{siblingPage.seoDescription}</p>
                  <a href={`/lviv/${siblingPage.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Відкрити сторінку
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {relatedServices.length ? (
          <section className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Пов’язані послуги</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {relatedServices.map((service) => (
                <article key={service.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <h3 className="font-serif text-2xl tracking-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{service.shortDescription}</p>
                  <a href={`/poslugy/${service.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Перейти до послуги
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {relatedArticles.length ? (
          <section className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Корисні статті</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {relatedArticles.map((article) => (
                <article key={article.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{article.category}</p>
                  <h3 className="mt-3 font-serif text-2xl tracking-tight">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{article.excerpt}</p>
                  <a href={`/blog/${article.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Читати статтю
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--muted)] p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">CTA</p>
            <h2 className="font-serif text-3xl tracking-tight">Локальний запит має завершуватися простим наступним кроком</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              Якщо ця сторінка описує ваш сценарій, достатньо коротко описати ситуацію й залишити контакт для зворотного зв’язку.
            </p>
          </div>
          <Button href="/kontakty">Перейти до контактів</Button>
        </section>
      </PageShell>
    </>
  );
}
