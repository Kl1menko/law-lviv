import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatAdminErrorKey, formatAdminSavedKey } from "@/lib/admin-copy";
import { getAllReviews } from "@/lib/content/repositories";
import { saveReview } from "@/app/admin/reviews/actions";

type AdminReviewsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const reviews = await getAllReviews();
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell eyebrow="Адмінка" title="Відгуки" description="Керування позначкою рекомендованих відгуків, рейтингом і порядком відображення.">
      <Card className="space-y-2">
        {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
      </Card>
      <div className="grid gap-5">
        {reviews.map((review) => (
          <Card key={review.id}>
            <form action={saveReview} className="grid gap-4">
              <input type="hidden" name="id" value={review.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <Input name="clientName" defaultValue={review.clientName} />
                <Input name="source" defaultValue={review.source ?? ""} />
                <Input name="rating" type="number" min={1} max={5} defaultValue={review.rating} />
                <Input name="sortOrder" type="number" defaultValue={review.sortOrder} />
                <select
                  name="isFeatured"
                  defaultValue={review.isFeatured ? "true" : "false"}
                  className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                >
                  <option value="true">Рекомендований</option>
                  <option value="false">Звичайний</option>
                </select>
              </div>
              <Textarea name="text" defaultValue={review.text} />
              <div>
                <Button type="submit">Зберегти відгук</Button>
              </div>
            </form>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
