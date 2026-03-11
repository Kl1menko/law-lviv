import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatContentStatus } from "@/lib/admin-copy";
import { getAllArticles } from "@/lib/content/repositories";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Статті"
      description="Список статей з категорією, статусом і швидким переходом до екрана markdown/SEO."
    >
      <div className="flex justify-end">
        <Button href="/admin/articles/new">Нова стаття</Button>
      </div>
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">{article.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{article.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                <span>{formatContentStatus(article.status)}</span>
                <span>{article.category}</span>
                <span>{article.slug}</span>
              </div>
            </div>
            <Link href={`/admin/articles/${article.id}`} className="text-sm font-medium">
              Редагувати
            </Link>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
