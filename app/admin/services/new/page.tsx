import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatAdminErrorKey } from "@/lib/admin-copy";
import { createNewService } from "@/app/admin/services/new/actions";

type NewServicePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function NewServicePage({ searchParams }: NewServicePageProps) {
  const query = searchParams ? await searchParams : undefined;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Нова послуга"
      description="Створення нової послуги з мінімальним набором полів. Деталізацію можна одразу доробити на екрані редагування."
    >
      <Card className="space-y-6">
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
        <form action={createNewService} className="grid gap-4">
          <Input name="title" placeholder="Назва послуги" />
          <Input name="slug" placeholder="slug" />
          <Input name="heroTitle" placeholder="Заголовок hero-блоку" />
          <Textarea name="heroDescription" placeholder="Опис hero-блоку" />
          <Textarea name="shortDescription" placeholder="Короткий опис" />
          <Textarea name="intro" placeholder="Вступний текст" />
          <Input name="seoTitle" placeholder="SEO-заголовок" />
          <Textarea name="seoDescription" placeholder="SEO-опис" />
          <Input name="seoKeywords" placeholder="ключ-1, ключ-2" />
          <div>
            <Button type="submit">Створити послугу</Button>
          </div>
        </form>
      </Card>
    </AdminShell>
  );
}
