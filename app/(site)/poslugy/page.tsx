import { PageShell } from "@/components/shared/page-shell";
import { getPublishedServices } from "@/lib/content/repositories";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: buildPageTitle("Послуги"),
  description: "Каталог юридичних послуг у Львові з окремими сторінками під кожну практику.",
  path: "/poslugy",
});

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <PageShell
      eyebrow="Послуги"
      title="Окремі посадкові сторінки під ключові юридичні практики"
      description="Кожна послуга має окремий змістовний фокус, SEO-структуру і зв’язок із релевантними статтями."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <article key={service.id} className="rounded-[28px] border border-[var(--border)] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Практика</p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{service.shortDescription}</p>
            <div className="mt-5 border-t border-[var(--border)] pt-5">
              <a href={`/poslugy/${service.slug}`} className="text-sm font-medium">
                Перейти до сторінки
              </a>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
