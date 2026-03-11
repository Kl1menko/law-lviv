import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { formatAdminErrorKey, formatAdminSavedKey, formatContentStatus } from "@/lib/admin-copy";
import {
  getAllArticles,
  getAllSeoLandingPages,
  getAllServices,
} from "@/lib/content/repositories";
import {
  saveSeoLandingMain,
  saveSeoLandingRelations,
  saveSeoLandingSeo,
} from "@/app/admin/seo-pages/actions";

type AdminSeoPagesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSeoPagesPage({ searchParams }: AdminSeoPagesPageProps) {
  const [pages, services, articles] = await Promise.all([
    getAllSeoLandingPages(),
    getAllServices(),
    getAllArticles(),
  ]);
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell eyebrow="Адмінка" title="SEO-сторінки" description="Керування локальними посадковими сторінками, SEO-полями та зв’язками з контентом.">
      <Card className="space-y-2">
        {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
      </Card>
      <div className="grid gap-5">
        {pages.map((page) => (
          <Card key={page.id} className="space-y-6">
            <div className="text-sm text-[var(--muted-foreground)]">{`${page.slug} | ${formatContentStatus(page.status)}`}</div>
            <Tabs
              items={[
                {
                  id: `main-${page.id}`,
                  label: "Основне",
                  content: (
                    <form action={saveSeoLandingMain} className="grid gap-4">
                      <input type="hidden" name="id" value={page.id} />
                      <Input name="title" defaultValue={page.title} />
                      <Input name="slug" defaultValue={page.slug} />
                      <Input name="location" defaultValue={page.location} />
                      <Input name="heroTitle" defaultValue={page.heroTitle} />
                      <Textarea name="heroDescription" defaultValue={page.heroDescription} />
                      <Textarea name="intro" defaultValue={page.intro} />
                      <select
                        name="status"
                        defaultValue={page.status}
                        className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                      >
                        <option value="draft">Чернетка</option>
                        <option value="published">Опубліковано</option>
                      </select>
                      <div>
                        <Button type="submit">Зберегти основне</Button>
                      </div>
                    </form>
                  ),
                },
                {
                  id: `seo-${page.id}`,
                  label: "SEO",
                  content: (
                    <form action={saveSeoLandingSeo} className="grid gap-4">
                      <input type="hidden" name="id" value={page.id} />
                      <Input name="seoTitle" defaultValue={page.seoTitle} />
                      <Textarea name="seoDescription" defaultValue={page.seoDescription} />
                      <Input name="seoKeywords" defaultValue={page.seoKeywords.join(", ")} />
                      <Input name="canonicalUrl" defaultValue={page.canonicalUrl ?? ""} />
                      <Input name="ogImage" defaultValue={page.ogImage ?? ""} />
                      <div>
                        <Button type="submit">Зберегти SEO</Button>
                      </div>
                    </form>
                  ),
                },
                {
                  id: `relations-${page.id}`,
                  label: "Зв’язки",
                  content: (
                    <form action={saveSeoLandingRelations} className="grid gap-4">
                      <input type="hidden" name="id" value={page.id} />
                      <Input
                        name="relatedServiceIds"
                        defaultValue={page.relatedServiceIds.join(", ")}
                        placeholder={services.map((service) => service.id).join(", ")}
                      />
                      <Input
                        name="relatedArticleIds"
                        defaultValue={page.relatedArticleIds.join(", ")}
                        placeholder={articles.map((article) => article.id).join(", ")}
                      />
                      <Textarea
                        name="contentSections"
                        defaultValue={JSON.stringify(page.contentSections, null, 2)}
                        className="min-h-64 font-mono text-xs"
                      />
                      <Textarea
                        name="faqItems"
                        defaultValue={JSON.stringify(page.faqItems, null, 2)}
                        className="min-h-64 font-mono text-xs"
                      />
                      <div>
                        <Button type="submit">Зберегти зв’язки і JSON</Button>
                      </div>
                    </form>
                  ),
                },
              ]}
            />
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
