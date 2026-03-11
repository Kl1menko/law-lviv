import { FaqList } from "@/components/content/faq-list";
import { JsonLd } from "@/components/shared/json-ld";
import { PageShell } from "@/components/shared/page-shell";
import { getFaqItems } from "@/lib/content/repositories";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import { buildFaqJsonLd } from "@/lib/structured-data";

export const metadata = buildMetadata({
  title: buildPageTitle("FAQ"),
  description: "Часті питання за категоріями з окремим SEO і підготовкою до FAQ structured data.",
  path: "/faq",
});

export default async function FaqPage() {
  const faqItems = await getFaqItems({ featuredOnly: true });

  return (
    <>
      {faqItems.length ? <JsonLd data={buildFaqJsonLd(faqItems)} /> : null}
      <PageShell
        eyebrow="FAQ"
        title="Питання, які користувачі ставлять перед консультацією"
        description="Короткі, структуровані відповіді перед першим зверненням: сімейні, спадкові, судові та консультаційні питання."
      >
        <FaqList items={faqItems} />
      </PageShell>
    </>
  );
}
