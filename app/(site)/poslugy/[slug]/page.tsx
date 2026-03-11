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
  getPublishedServices,
  getServiceBySlug,
  getPublishedSeoLandingPages,
} from "@/lib/content/repositories";
import type { ContentListItem } from "@/lib/content/types";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildRuntimeServiceJsonLd } from "@/lib/runtime-seo";
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/structured-data";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const settings = await getRuntimeSiteSettings();

  if (!service) {
    return buildMetadata({
      title: buildPageTitle("Послугу не знайдено", settings.companyName),
      description: "Сторінка послуги не знайдена.",
      path: `/poslugy/${slug}`,
      siteName: settings.companyName,
    });
  }

  return buildMetadata({
    title: service.seoTitle || buildPageTitle(service.title, settings.companyName),
    description: service.seoDescription,
    path: `/poslugy/${slug}`,
    siteName: settings.companyName,
  });
}

export async function generateStaticParams() {
  const services = await getPublishedServices();

  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [relatedArticles, seoPages] = await Promise.all([
    getArticlesByIds(service.relatedArticleIds),
    getPublishedSeoLandingPages(),
  ]);
  const faqItems = service.faqRelations.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  const contentSections = [
    {
      heading: "Для кого ця послуга",
      body: service.intro,
      items: (service.audience as ContentListItem[]).map((item) => `${item.title} - ${item.description}`),
    },
    {
      heading: "З якими питаннями допомагаємо",
      body: service.heroDescription,
      items: (service.problemsSolved as ContentListItem[]).map((item) => `${item.title} - ${item.description}`),
    },
    {
      heading: "Як проходить співпраця",
      body: "Кожен етап зафіксований: від первинного аналізу до процесуальних дій і наступних рішень.",
      items: (service.processSteps as ContentListItem[]).map((item) => `${item.title} - ${item.description}`),
    },
    {
      heading: "Переваги підходу",
      body: "Фокусуємося на тому, що реально впливає на результат і зрозумілість для клієнта.",
      items: (service.benefits as ContentListItem[]).map((item) => `${item.title} - ${item.description}`),
    },
  ];
  const serviceJsonLd = await buildRuntimeServiceJsonLd({
    title: service.title,
    description: service.seoDescription,
    path: `/poslugy/${service.slug}`,
  });
  const localSeoPages = seoPages.filter((page) => page.relatedServiceIds.includes(service.id)).slice(0, 3);
  const actionSummary = [
    `Формат роботи під задачу, а не навпаки`,
    `${faqItems.length} FAQ по темі`,
    `${relatedArticles.length} пов’язаних статей`,
  ];

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      {faqItems.length ? <JsonLd data={buildFaqJsonLd(faqItems)} /> : null}
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Головна", path: "/" },
          { name: "Послуги", path: "/poslugy" },
          { name: service.title, path: `/poslugy/${service.slug}` },
        ])}
      />
      <PageShell eyebrow="Послуга" title={service.heroTitle} description={service.heroDescription}>
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4 border-[var(--foreground)] bg-[var(--foreground)] text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Коли звертаються</p>
            <h2 className="font-serif text-3xl tracking-tight">{service.title}</h2>
            <p className="text-sm leading-7 text-white/80">{service.shortDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Button href="/kontakty" variant="secondary">
                Обговорити ситуацію
              </Button>
              <Button
                href={faqItems.length ? `#service-faq` : relatedArticles.length ? `#service-articles` : "/kontakty"}
                variant="ghost"
                className="border border-white/20 text-white hover:bg-white/10"
              >
                Перейти до релевантного блоку
              </Button>
            </div>
          </Card>
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Що важливо</p>
            {actionSummary.map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                {item}
              </div>
            ))}
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Якщо питання вже в спорі або прив’язане до строків, краще не відкладати первинний аналіз.
            </p>
          </Card>
        </section>
        <StaticSections sections={contentSections} />
        {faqItems.length ? (
          <section id="service-faq" className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Часті питання</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Короткі відповіді на запитання, з якими найчастіше приходять перед консультацією.
              </p>
            </div>
            <FaqList items={faqItems} />
          </section>
        ) : null}
        {relatedArticles.length ? (
          <section id="service-articles" className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Корисні статті</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Матеріали, які допоможуть краще зорієнтуватися в темі до або після консультації.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {relatedArticles.map((article) => (
                <article key={article.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">{article.category}</p>
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
        {localSeoPages.length ? (
          <section className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Локальні сторінки по темі</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Додаткові сторінки під локальні запити у Львові для точнішої навігації по намірах користувача.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {localSeoPages.map((page) => (
                <article key={page.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <h3 className="font-serif text-2xl tracking-tight">{page.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{page.seoDescription}</p>
                  <a href={`/lviv/${page.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Відкрити сторінку
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--muted)] p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">CTA</p>
            <h2 className="font-serif text-3xl tracking-tight">Потрібно зрозуміти саме ваш маршрут дій</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              Навіть у межах однієї практики формат допомоги може бути різним: консультація, окремий документ або повний супровід спору.
            </p>
          </div>
          <Button href="/kontakty">Надіслати запит</Button>
        </section>
      </PageShell>
    </>
  );
}
