import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatAdminErrorKey } from "@/lib/admin-copy";
import { createNewArticle } from "@/app/admin/articles/new/actions";

type NewArticlePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
  const query = searchParams ? await searchParams : undefined;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Нова стаття"
      description="Створення нової статті з базовими полями. Після створення редагування продовжується на екрані редагування."
    >
      <Card className="space-y-6">
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
        <form action={createNewArticle} className="grid gap-4">
          <Input name="title" placeholder="Назва статті" />
          <Input name="slug" placeholder="slug" />
          <Input name="category" placeholder="Категорія" />
          <Input name="tags" placeholder="тег-1, тег-2" />
          <Textarea name="excerpt" placeholder="Короткий опис" />
          <Input name="seoTitle" placeholder="SEO-заголовок" />
          <Textarea name="seoDescription" placeholder="SEO-опис" />
          <Input name="seoKeywords" placeholder="ключ-1, ключ-2" />
          <Textarea name="contentMarkdown" placeholder="Початковий markdown контент" className="min-h-80 font-mono text-xs" />
          <div>
            <Button type="submit">Створити статтю</Button>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
