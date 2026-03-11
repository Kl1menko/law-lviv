import { PageShell } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPublishedArticles, getPublishedServices } from "@/lib/content/repositories";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: buildPageTitle("Блог"),
  description: "Список статей для локального SEO та пояснювального контенту юридичної компанії.",
  path: "/blog",
});

export default async function BlogPage() {
  const [articles, services] = await Promise.all([getPublishedArticles(), getPublishedServices()]);
  const featuredArticle = articles[0];
  const latestArticles = featuredArticle ? articles.slice(1) : articles;
  const categories = Array.from(new Set(articles.map((article) => article.category))).slice(0, 4);

  return (
    <PageShell
      eyebrow="Блог"
      title="Інформаційні статті під комерційні та пояснювальні запити"
      description="Статті побудовані як пояснювальний контент для реальних запитів користувачів і внутрішньо пов’язані з послугами."
    >
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 border-[var(--foreground)] bg-[var(--foreground)] text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">Як використовувати блог</p>
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Спершу зрозуміти ситуацію, потім обрати формат допомоги</h2>
          <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Блог тут не для абстрактного трафіку. Кожен матеріал має пояснювати конкретний сценарій і вести або до релевантної
            послуги, або до короткого першого контакту.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/kontakty" variant="secondary">
              Поставити питання
            </Button>
            <Button href="/poslugy" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
              Перейти до послуг
            </Button>
          </div>
        </Card>
        <Card className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Навігація по темах</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-[var(--border)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            У фокусі матеріали під локальні та комерційні запити: сімейні, спадкові, цивільні, адміністративні питання,
            консультації та судова підготовка.
          </p>
        </Card>
      </section>

      {featuredArticle ? (
        <section className="grid gap-6 rounded-[32px] border border-[var(--border)] p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Рекомендована стаття</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight">{featuredArticle.title}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-foreground)]">{featuredArticle.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <span>{featuredArticle.category}</span>
              {featuredArticle.readingTime ? <span>{featuredArticle.readingTime} хв читання</span> : null}
            </div>
            <a href={`/blog/${featuredArticle.slug}`} className="mt-6 inline-block text-sm font-medium">
              Відкрити статтю
            </a>
          </div>
          <div className="space-y-3 border-t border-[var(--border)] pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Для чого читати</p>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Щоб зрозуміти правову логіку питання ще до консультації.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Щоб перейти до релевантної послуги без зайвого пошуку по сайту.
            </div>
            <div className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Щоб одразу бачити суміжні матеріали, якщо ситуація ширша за один запит.
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl tracking-tight">Останні матеріали</h2>
          <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
            Тексти зібрані як верхній шар довіри і пояснення, а не як відокремлений медіарозділ без практичного продовження.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {latestArticles.map((article) => (
            <article key={article.id} className="rounded-[28px] border border-[var(--border)] p-6">
              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                <span>{article.category}</span>
                <span>{article.readingTime ? `${article.readingTime} хв` : null}</span>
              </div>
              <h2 className="mt-4 font-serif text-3xl tracking-tight">{article.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{article.excerpt}</p>
              <a href={`/blog/${article.slug}`} className="mt-5 inline-block text-sm font-medium">
                Читати
              </a>
            </article>
          ))}
        </div>
      </section>

      {services.length ? (
        <section className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl tracking-tight">Послуги, пов’язані з матеріалами</h2>
            <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
              Пояснювальний контент має вести до релевантних практик, а не існувати окремо від комерційних сторінок.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {services.slice(0, 3).map((service) => (
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

      <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--muted)] p-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">Наступний крок</p>
          <h2 className="font-serif text-3xl tracking-tight">Якщо матеріал уже описує вашу ситуацію, далі краще перейти в діалог</h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            Короткий контакт корисніший, ніж нескінченне читання суміжних статей без перевірки документів і ризиків саме у
            вашому кейсі.
          </p>
        </div>
        <Button href="/kontakty">Обговорити запит</Button>
      </section>
    </PageShell>
  );
}
