import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { formatAdminErrorKey, formatAdminSavedKey, formatLeadStatus } from "@/lib/admin-copy";
import { getAllLeads } from "@/lib/content/repositories";
import { saveLeadWorkflow } from "@/app/admin/leads/actions";

type AdminLeadsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  const leads = await getAllLeads();
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Звернення"
      description="Оперативна картка звернення: статус, відповідальний, підсумок опитування, внутрішні примітки і зв'язок з консультаціями."
    >
      <Card className="space-y-2">
        {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
      </Card>
      <div className="grid gap-5">
        {leads.map((lead) => (
          <Card key={lead.id} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl tracking-tight">{lead.name}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{lead.phone}</p>
              {lead.email ? <p className="text-sm text-[var(--muted-foreground)]">{lead.email}</p> : null}
            </div>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">{lead.message}</p>
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{lead.sourcePage}</div>
            <form action={saveLeadWorkflow} className="grid gap-4">
              <input type="hidden" name="id" value={lead.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                >
                  <option value="new">{formatLeadStatus("new")}</option>
                  <option value="in_progress">{formatLeadStatus("in_progress")}</option>
                  <option value="closed">{formatLeadStatus("closed")}</option>
                </select>
                <Input name="assignedTo" defaultValue={lead.assignedTo ?? ""} placeholder="Відповідальний адвокат або помічник" />
              </div>
              <Textarea
                name="intakeSummary"
                defaultValue={lead.intakeSummary ?? ""}
                placeholder="Короткий підсумок первинного опитування: суть питання, строки, документи, бажаний результат."
              />
              <Textarea
                name="internalNotes"
                defaultValue={lead.internalNotes ?? ""}
                placeholder="Внутрішні примітки: передача адвокату, терміновість, домовленості, наступний крок."
              />
              {lead.consultations.length ? (
                <div className="rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
                  {`Консультацій у журналі: ${lead.consultations.length}`}
                </div>
              ) : null}
              <Button type="submit" variant="secondary">
                Зберегти картку звернення
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
