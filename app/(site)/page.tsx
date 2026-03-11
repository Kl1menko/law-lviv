import { JsonLd } from "@/components/shared/json-ld";
import { HomeHero } from "@/components/shared/home-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/layout/container";
import {
  getFaqItems,
  getPublishedArticles,
  getPublishedServices,
  getReviews,
  getStaticPageByKey,
} from "@/lib/content/repositories";
import type { ContentSection } from "@/lib/content/types";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildRuntimeLegalServiceJsonLd, buildRuntimeMetadata } from "@/lib/runtime-seo";

export async function generateMetadata() {
  return buildRuntimeMetadata({
    pageTitle: "Адвокат у Львові",
    description:
      "Структурований сайт юридичної компанії у Львові з окремими практиками, блогом, FAQ і зручною заявкою.",
    path: "/",
  });
}

export default async function HomePage() {
  const [legalServiceJsonLd, services, articles, reviews, faqItems, aboutPage, settings] = await Promise.all([
    buildRuntimeLegalServiceJsonLd(),
    getPublishedServices(),
    getPublishedArticles({ limit: 3 }),
    getReviews(true),
    getFaqItems({ featuredOnly: true }),
    getStaticPageByKey("about"),
    getRuntimeSiteSettings(),
  ]);

  const featuredServices = services.slice(0, 3);
  const trustPoints = [
    `Львів і локальний фокус`,
    `${services.length}+ окремих практик`,
    `${articles.length}+ пояснювальних матеріалів`,
    `${reviews.length}+ публічних відгуків`,
  ];

  return (
    <>
      <JsonLd data={legalServiceJsonLd} />
      <HomeHero
        eyebrow="Klimenko & CO"
        title="Юридична допомога у Львові — зрозуміло, послідовно, по суті"
        description="Ведемо справи з опорою на чітку стратегію, процесуальну точність і спокійну, зрозумілу для клієнта комунікацію."
      />
      <div className="py-20 sm:py-24">
        <Container className="space-y-12">
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="space-y-6 border-[var(--foreground)] bg-[var(--foreground)] text-white">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Перший крок</p>
                <h2 className="max-w-3xl font-serif text-3xl tracking-tight sm:text-4xl">
                  Починаємо з короткого аналізу ситуації, а не з абстрактних обіцянок
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                  Якщо у вас вже є документи або зрозумілий конфлікт, достатньо короткого опису й контактів. Далі пояснюємо
                  маршрут: консультація, окремий документ або повний супровід.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/kontakty" variant="secondary">
                  Записатися на консультацію
                </Button>
                <Button href="/poslugy" variant="ghost" className="border border-white/20 text-white hover:bg-white/10">
                  Переглянути послуги
                </Button>
              </div>
            </Card>
            <Card className="space-y-5">
              <SectionHeading
                eyebrow="Швидка навігація"
                title="Коли сайт справді допомагає"
                description="Користувач має швидко зрозуміти, чи ми працюємо з його типом запиту і який наступний практичний крок."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-[var(--border)] px-4 py-4 text-sm text-[var(--muted-foreground)]"
                  >
                    {point}
                  </div>
                ))}
              </div>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Телефон для першого контакту: <span className="font-medium text-[var(--foreground)]">{settings.phonePrimary}</span>
              </p>
            </Card>
          </section>
          <section className="space-y-6">
            <SectionHeading
              eyebrow="Практики"
              title="Ключові напрями роботи"
              description="Окремі сторінки послуг побудовані під чіткі запити користувачів і пов’язані з релевантними статтями."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <Card key={service.id}>
                  <h2 className="font-serif text-2xl tracking-tight">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{service.shortDescription}</p>
                  <a href={`/poslugy/${service.slug}`} className="mt-5 inline-block text-sm font-medium">
                    Перейти до послуги
                  </a>
                </Card>
              ))}
            </div>
          </section>
          <section className="grid gap-5 lg:grid-cols-3">
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Чому обирають нас</p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Без зайвого драматизму</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                У юридичних питаннях цінні не гучні формулювання, а чіткі строки, документи і ясна логіка дій.
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Як працюємо</p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Спершу структура, потім процес</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Спочатку діагностуємо ситуацію, далі визначаємо маршрут і лише після цього запускаємо потрібний формат супроводу.
              </p>
            </Card>
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Локальний фокус</p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Працюємо у Львові</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Сайт і контент зібрані під локальні запити, щоб людина швидко знайшла релевантну послугу, статтю чи посадкову сторінку.
              </p>
            </Card>
          </section>
          {aboutPage ? (
            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <SectionHeading
                eyebrow="Про компанію"
                title={aboutPage.title}
                description={aboutPage.intro ?? aboutPage.seoDescription}
              />
              <div className="grid gap-5">
                {(aboutPage.bodySections as ContentSection[]).map((section) => (
                  <Card key={section.heading}>
                    <h2 className="font-serif text-2xl tracking-tight">{section.heading}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{section.body}</p>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
          {reviews.length ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Відгуки"
                title="Довіра без агресивної подачі"
                description="Короткі відгуки клієнтів як окремий trust layer без рекламного тону."
              />
              <div className="grid gap-5 lg:grid-cols-3">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <p className="text-sm leading-7 text-[var(--muted-foreground)]">“{review.text}”</p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="font-medium">{review.clientName}</span>
                      <span className="text-[var(--muted-foreground)]">{review.source ?? "Клієнт"}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
          {articles.length ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Блог"
                title="Останні статті"
                description="Пояснювальні матеріали для тих, хто хоче спершу зрозуміти ситуацію, а вже потім звертатися по супровід."
              />
              <div className="grid gap-5 lg:grid-cols-3">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{article.category}</p>
                    <h2 className="mt-3 font-serif text-2xl tracking-tight">{article.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{article.excerpt}</p>
                    <a href={`/blog/${article.slug}`} className="mt-5 inline-block text-sm font-medium">
                      Читати статтю
                    </a>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
          {faqItems.length ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="FAQ"
                title="Часті питання перед консультацією"
                description="Короткі відповіді на запити, з якими найчастіше приходять на перший контакт."
              />
              <div className="grid gap-5 lg:grid-cols-2">
                {faqItems.slice(0, 4).map((item) => (
                  <Card key={item.id}>
                    <h2 className="font-serif text-2xl tracking-tight">{item.question}</h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.answer}</p>
                  </Card>
                ))}
              </div>
            </section>
          ) : null}
          <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--muted)] p-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">CTA</p>
              <h2 className="font-serif text-3xl tracking-tight">Якщо питання вже дозріло, не варто відкладати первинний аналіз</h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                Один короткий контакт часто економить більше часу, ніж серія хаотичних пошуків і випадкових порад.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/kontakty">Надіслати запит</Button>
              <Button href="/blog" variant="secondary">
                Спершу почитати блог
              </Button>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
