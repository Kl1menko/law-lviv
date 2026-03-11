import { PageShell } from "@/components/shared/page-shell";
import { ContactForm } from "@/app/(site)/kontakty/contact-form";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getFaqItems } from "@/lib/content/repositories";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { buildRuntimeLegalServiceJsonLd, buildRuntimeMetadata } from "@/lib/runtime-seo";

export async function generateMetadata() {
  return buildRuntimeMetadata({
    pageTitle: "Контакти",
    description: "Контакти юридичної компанії у Львові з адресою, графіком роботи, картою і формою звернення.",
    path: "/kontakty",
  });
}

export default async function ContactsPage() {
  const [settings, legalServiceJsonLd, featuredFaq] = await Promise.all([
    getRuntimeSiteSettings(),
    buildRuntimeLegalServiceJsonLd(),
    getFaqItems({ featuredOnly: true }),
  ]);

  return (
    <>
      <JsonLd data={legalServiceJsonLd} />
      <PageShell
        eyebrow="Контакти"
        title="Зв’язок, адреса та точка входу в консультацію"
        description="Перший контакт має бути коротким і зрозумілим: кілька фактів по ситуації, зручний спосіб зв’язку і ясне очікування по наступному кроку."
      >
        <section className="grid gap-5 lg:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Телефон</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight">{settings.phonePrimary}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Найшвидший формат, якщо питання термінове або вже є документи на руках.
            </p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Email</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight break-all">{settings.emailPrimary}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Підійде, якщо зручно одразу коротко описати ситуацію і надіслати деталі письмово.
            </p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Графік</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight">{settings.workHours}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Консультації проходять за попереднім записом, щоб розмова була вже по суті.
            </p>
          </Card>
        </section>
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="space-y-5">
            <SectionHeading
              eyebrow="Контактні дані"
              title="Львів, консультації за записом"
              description="Перший контакт має бути простим: короткий опис ситуації, телефон і зручний спосіб зворотного зв’язку."
            />
            <div className="space-y-3 text-sm leading-6 text-[var(--muted-foreground)]">
              <p>Телефон: {settings.phonePrimary}</p>
              {settings.phoneSecondary ? <p>Додатковий телефон: {settings.phoneSecondary}</p> : null}
              <p>Email: {settings.emailPrimary}</p>
              <p>
                Адреса: {settings.address}, {settings.city}
              </p>
              <p>Графік: {settings.workHours}</p>
              {settings.googleMapsUrl ? (
                <p>
                  <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                    Відкрити на мапі
                  </a>
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href={`tel:${settings.phonePrimary.replace(/\s+/g, "")}`} variant="secondary">
                Подзвонити
              </Button>
              <Button href={`mailto:${settings.emailPrimary}`} variant="ghost">
                Написати email
              </Button>
            </div>
          </Card>
          <Card className="space-y-4">
            <SectionHeading
              eyebrow="Форма звернення"
              title="Коротко опишіть запит"
              description="Ми не просимо зайвого. На старті достатньо контактів і кількох речень по суті."
            />
            <ContactForm />
          </Card>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card className="space-y-4">
            <SectionHeading
              eyebrow="Що буде далі"
              title="Після звернення процес має залишатися простим"
              description="Контактна форма не повинна створювати зайве навантаження. Вона лише відкриває робочий діалог."
            />
            <div className="grid gap-3 text-sm leading-7 text-[var(--muted-foreground)]">
              <p>1. Ми читаємо суть запиту і дивимося, чи достатньо даних для першої оцінки.</p>
              <p>2. Повертаємось із наступним кроком: консультація, аналіз документів або інший релевантний формат.</p>
              <p>3. Якщо питання термінове, краще одразу телефонувати, а не чекати письмової відповіді.</p>
            </div>
          </Card>
          {featuredFaq[0] ? (
            <Card className="space-y-4">
              <SectionHeading
                eyebrow="Мікро FAQ"
                title={featuredFaq[0].question}
                description="Одне з частих уточнень перед першим контактом."
              />
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">{featuredFaq[0].answer}</p>
              <Button href="/faq" variant="secondary">
                Перейти до FAQ
              </Button>
            </Card>
          ) : null}
        </section>
      </PageShell>
    </>
  );
}
