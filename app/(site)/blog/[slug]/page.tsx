import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MarkdownRenderer } from "@/components/content/markdown-renderer";
import { JsonLd } from "@/components/shared/json-ld";
import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getPublishedArticles,
  getArticleBySlug,
  getServicesByArticleId,
} from "@/lib/content/repositories";
import type { ArticleRecord } from "@/lib/content/types";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildRuntimeArticleJsonLd } from "@/lib/runtime-seo";
import { buildBreadcrumbJsonLd } from "@/lib/structured-data";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const settings = await getRuntimeSiteSettings();

  if (!article) {
    return buildMetadata({
      title: buildPageTitle("Статтю не знайдено", settings.companyName),
      description: "Сторінка статті не знайдена.",
      path: `/blog/${slug}`,
      siteName: settings.companyName,
    });
  }

  return buildMetadata({
    title: article.seoTitle || buildPageTitle(article.title, settings.companyName),
    description: article.seoDescription,
    path: `/blog/${slug}`,
    siteName: settings.companyName,
  });
}

export async function generateStaticParams() {
  const articles: ArticleRecord[] = await getPublishedArticles();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [articleJsonLd, relatedServices, relatedArticles] = await Promise.all([
    buildRuntimeArticleJsonLd({
      title: article.title,
      description: article.seoDescription,
      path: `/blog/${article.slug}`,
      publishedAt: article.publishedAt?.toISOString(),
    }),
    getServicesByArticleId(article.id),
    getPublishedArticles({
      category: article.category,
      excludeId: article.id,
      limit: 3,
    }),
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Головна", path: "/" },
          { name: "Блог", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ])}
      />
      <PageShell eyebrow={article.category} title={article.title} description={article.excerpt}>
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="space-y-4 border-[var(--foreground)] bg-[var(--foreground)] text-white">
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">Про цей матеріал</p>
            <h2 className="font-serif text-3xl tracking-tight">Коротке пояснення перед повним розбором</h2>
            <p className="max-w-2xl text-sm leading-7 text-white/80">
              Стаття допомагає зрозуміти логіку питання, але не замінює оцінку документів і фактів саме у вашій ситуації.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href="/kontakty" variant="secondary">
                Обговорити кейс
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
          <Card className="space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Деталі</p>
            <div className="grid gap-3">
              <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                Автор: <span className="text-[var(--foreground)]">{article.authorName}</span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                Опубліковано:{" "}
                <span className="text-[var(--foreground)]">
                  {article.publishedAt ? article.publishedAt.toLocaleDateString("uk-UA") : "Чернетка"}
                </span>
              </div>
              {article.readingTime ? (
                <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
                  Час читання: <span className="text-[var(--foreground)]">{article.readingTime} хв</span>
                </div>
              ) : null}
            </div>
            {article.tags.length ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Теги</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--border)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            <MarkdownRenderer content={article.contentMarkdown} />
            <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--muted)] p-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Після читання</p>
                <h2 className="font-serif text-3xl tracking-tight">Якщо тема вже стала прикладною, час перейти від читання до аналізу</h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  На практиці вирішальними стають документи, строки і нюанси конкретної ситуації. Це вже не вирішується загальною статтею.
                </p>
              </div>
              <Button href="/kontakty">Надіслати запит</Button>
            </section>
          </div>

          <aside className="space-y-4">
            {relatedServices.length ? (
              <Card className="space-y-4">
                <h2 className="font-serif text-2xl tracking-tight">Пов’язані послуги</h2>
                <div className="space-y-3">
                  {relatedServices.map((service) => (
                    <a key={service.id} href={`/poslugy/${service.slug}`} className="block rounded-2xl border border-[var(--border)] px-4 py-4">
                      <p className="font-medium">{service.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{service.shortDescription}</p>
                    </a>
                  ))}
                </div>
              </Card>
            ) : null}
            <Card className="space-y-4">
              <h2 className="font-serif text-2xl tracking-tight">Навіщо це читати</h2>
              <div className="space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                <p>Щоб зрозуміти базову логіку питання до консультації.</p>
                <p>Щоб підготувати документи і питання до першої розмови.</p>
                <p>Щоб швидше перейти до релевантної послуги, якщо ситуація вже практична.</p>
              </div>
            </Card>
          </aside>
        </div>

        {relatedArticles.length ? (
          <section className="space-y-6">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight">Схожі матеріали</h2>
              <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
                Додаткові статті по суміжних запитах для внутрішньої навігації і глибшого розуміння теми.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <article key={relatedArticle.id} className="rounded-[28px] border border-[var(--border)] p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{relatedArticle.category}</p>
                  <h3 className="mt-3 font-serif text-2xl tracking-tight">{relatedArticle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{relatedArticle.excerpt}</p>
                  <a href={`/blog/${relatedArticle.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Читати статтю
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </PageShell>
    </>
  );
}
