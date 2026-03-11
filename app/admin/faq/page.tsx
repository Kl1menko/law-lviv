import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatAdminErrorKey, formatAdminSavedKey } from "@/lib/admin-copy";
import { getAllFaqItems, getAllServices } from "@/lib/content/repositories";
import { saveFaqItem } from "@/app/admin/faq/actions";

type AdminFaqPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminFaqPage({ searchParams }: AdminFaqPageProps) {
  const [faqItems, services] = await Promise.all([getAllFaqItems(), getAllServices()]);
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell eyebrow="Адмінка" title="Питання та відповіді" description="Керування питаннями, категоріями, позначкою рекомендованих і прив’язкою до послуг.">
      <Card className="space-y-2">
        {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
      </Card>
      <div className="grid gap-5">
        {faqItems.map((item) => (
          <Card key={item.id}>
            <form action={saveFaqItem} className="grid gap-4">
              <input type="hidden" name="id" value={item.id} />
              <Input name="question" defaultValue={item.question} />
              <Textarea name="answer" defaultValue={item.answer} />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="category" defaultValue={item.category} />
                <Input name="sortOrder" type="number" defaultValue={item.sortOrder} />
                <select
                  name="relatedServiceId"
                  defaultValue={item.relatedServiceId ?? ""}
                  className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                >
                  <option value="">Без прив’язки</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
                <select
                  name="isFeatured"
                  defaultValue={item.isFeatured ? "true" : "false"}
                  className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                >
                  <option value="true">Рекомендоване</option>
                  <option value="false">Звичайне</option>
                </select>
              </div>
              <div>
                <Button type="submit">Зберегти запис</Button>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
