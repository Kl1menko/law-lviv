import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { formatAdminErrorKey, formatAdminSavedKey, formatContentStatus } from "@/lib/admin-copy";
import { saveServiceMain, saveServiceSeo } from "@/app/admin/services/[id]/actions";
import { getArticlesByIds, getServiceById } from "@/lib/content/repositories";

type AdminServiceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminServiceDetailPage({ params, searchParams }: AdminServiceDetailPageProps) {
  const { id } = await params;
  const service = await getServiceById(id);
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  if (!service) {
    notFound();
  }

  const relatedArticles = await getArticlesByIds(service.relatedArticleIds);

  return (
    <AdminShell
      eyebrow="Адмінка"
      title={service.title}
      description="Екран редагування послуги розкладений по вкладках: основне, SEO, FAQ і пов’язані статті."
    >
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
            <div>{`slug: ${service.slug} | статус: ${formatContentStatus(service.status)}`}</div>
            {saved ? <div>{formatAdminSavedKey(saved)}</div> : null}
            {error ? <div className="text-red-700">{formatAdminErrorKey(error)}</div> : null}
          </div>
          <div className="flex gap-3">
            <Dialog
              triggerLabel="Попередній перегляд"
              title="Попередній перегляд ще не підключений"
              description="На наступному кроці цей екран можна буде з’єднати з маршрутом попереднього перегляду або режимом чернетки."
            />
            <Dialog
              triggerLabel="Опублікувати"
              title="Дія публікації ще не підключена"
              description="Інтерфейс для підтвердження вже закладено. Збереження і публікація стануть наступним кроком."
            />
          </div>
        </div>
        <Tabs
          items={[
            {
              id: "main",
              label: "Основне",
              content: (
                <form action={saveServiceMain} className="grid gap-4">
                  <input type="hidden" name="id" value={service.id} />
                  <Input name="title" defaultValue={service.title} />
                  <Input name="slug" defaultValue={service.slug} />
                  <Input name="heroTitle" defaultValue={service.heroTitle} />
                  <Textarea name="heroDescription" defaultValue={service.heroDescription} />
                  <Textarea name="shortDescription" defaultValue={service.shortDescription} />
                  <Textarea name="intro" defaultValue={service.intro} />
                  <div>
                    <Button type="submit">Зберегти основне</Button>
                  </div>
                </form>
              ),
            },
            {
              id: "seo",
              label: "SEO",
              content: (
                <form action={saveServiceSeo} className="grid gap-4">
                  <input type="hidden" name="id" value={service.id} />
                  <Input name="seoTitle" defaultValue={service.seoTitle} />
                  <Textarea name="seoDescription" defaultValue={service.seoDescription} />
                  <Input name="seoKeywords" defaultValue={service.seoKeywords.join(", ")} />
                  <Input name="canonicalUrl" defaultValue={service.canonicalUrl ?? ""} />
                  <Input name="ogImage" defaultValue={service.ogImage ?? ""} />
                  <div>
                    <Button type="submit">Зберегти SEO</Button>
                  </div>
                </form>
              ),
            },
            {
              id: "faq",
              label: "FAQ",
              content: (
                <div className="grid gap-4">
                  {service.faqRelations.map((item) => (
                    <Card key={item.id}>
                      <h3 className="font-serif text-2xl tracking-tight">{item.question}</h3>
                      <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{item.answer}</p>
                    </Card>
                  ))}
                </div>
              ),
            },
            {
              id: "related",
              label: "Пов’язані статті",
              content: (
                <div className="grid gap-4">
                  {relatedArticles.map((article) => (
                    <Card key={article.id}>
                      <h3 className="font-serif text-2xl tracking-tight">{article.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{article.excerpt}</p>
                    </Card>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </AdminShell>
  );
}
