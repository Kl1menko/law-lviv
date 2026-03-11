import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { formatAdminErrorKey, formatAdminSavedKey, formatContentStatus } from "@/lib/admin-copy";
import {
  saveArticleContent,
  saveArticleMain,
  saveArticleSeo,
} from "@/app/admin/articles/[id]/actions";
import { getArticleById } from "@/lib/content/repositories";

type AdminArticleDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminArticleDetailPage({ params, searchParams }: AdminArticleDetailPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  if (!article) {
    notFound();
  }

  return (
    <AdminShell
      eyebrow="Адмінка"
      title={article.title}
      description="Екран статті розкладений по вкладках: основне, SEO і markdown-контент."
    >
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1 text-sm text-[var(--muted-foreground)]">
            <div>{`slug: ${article.slug} | статус: ${formatContentStatus(article.status)}`}</div>
            {saved ? <div>{formatAdminSavedKey(saved)}</div> : null}
            {error ? <div className="text-red-700">{formatAdminErrorKey(error)}</div> : null}
          </div>
          <div className="flex gap-3">
            <Dialog
              triggerLabel="Попередній перегляд"
              title="Попередній перегляд ще не підключений"
              description="Далі цей екран можна зв’язати з режимом попереднього перегляду для markdown-статей."
            />
            <Dialog
              triggerLabel="Опублікувати"
              title="Дія публікації ще не підключена"
              description="Інтерфейс для підтвердження вже на місці. Збереження і сценарій публікації будуть наступним кроком."
            />
          </div>
        </div>
        <Tabs
          items={[
            {
              id: "main",
              label: "Основне",
              content: (
                <form action={saveArticleMain} className="grid gap-4">
                  <input type="hidden" name="id" value={article.id} />
                  <Input name="title" defaultValue={article.title} />
                  <Input name="slug" defaultValue={article.slug} />
                  <Input name="category" defaultValue={article.category} />
                  <Input name="tags" defaultValue={article.tags.join(", ")} />
                  <Textarea name="excerpt" defaultValue={article.excerpt} />
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
                <form action={saveArticleSeo} className="grid gap-4">
                  <input type="hidden" name="id" value={article.id} />
                  <Input name="seoTitle" defaultValue={article.seoTitle} />
                  <Textarea name="seoDescription" defaultValue={article.seoDescription} />
                  <Input name="seoKeywords" defaultValue={article.seoKeywords.join(", ")} />
                  <Input name="canonicalUrl" defaultValue={article.canonicalUrl ?? ""} />
                  <Input name="ogImage" defaultValue={article.ogImage ?? ""} />
                  <div>
                    <Button type="submit">Зберегти SEO</Button>
                  </div>
                </form>
              ),
            },
            {
              id: "content",
              label: "Контент",
              content: (
                <form action={saveArticleContent} className="grid gap-4">
                  <input type="hidden" name="id" value={article.id} />
                  <Textarea
                    name="contentMarkdown"
                    defaultValue={article.contentMarkdown}
                    className="min-h-80 font-mono text-xs"
                  />
                  <div>
                    <Button type="submit">Зберегти контент</Button>
                  </div>
                </form>
              ),
            },
          ]}
        />
      </Card>
    </AdminShell>
  );
}
