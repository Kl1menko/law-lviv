import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageShell } from "@/components/shared/page-shell";
import { getReviews } from "@/lib/content/repositories";
import { buildRuntimeMetadata } from "@/lib/runtime-seo";

export async function generateMetadata() {
  return buildRuntimeMetadata({
    pageTitle: "Відгуки",
    description: "Сторінка відгуків клієнтів як окремий trust layer для сайту юридичної компанії.",
    path: "/vidguky",
  });
}

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <PageShell
      eyebrow="Відгуки"
      title="Соціальний доказ без штучної подачі"
      description="Відгуки зібрані як окремий шар довіри: без шаблонної рекламної подачі і без перевантаження сторінки."
    >
      <section className="space-y-6">
        <SectionHeading
          eyebrow="Клієнтський досвід"
          title="Що відзначають після співпраці"
          description="Найчастіше цінують ясність комунікації, структурну роботу зі справою і відсутність зайвих обіцянок."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {reviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                <span>{review.source ?? "Клієнт"}</span>
                <span>{`${review.rating}/5`}</span>
              </div>
              <p className="mt-4 text-base leading-8 text-[var(--foreground)]">“{review.text}”</p>
              <p className="mt-5 text-sm font-medium">{review.clientName}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
