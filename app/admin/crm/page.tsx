import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import {
  formatAdminErrorKey,
  formatAdminSavedKey,
  formatConsultationStatus,
  formatTemplateType,
} from "@/lib/admin-copy";
import type { AdminTemplateRecord, ConsultationRecord, LeadRecord } from "@/lib/content/types";
import {
  getAllAdminTemplates,
  getAllConsultations,
  getAllLeads,
} from "@/lib/content/repositories";
import {
  createNewConsultation,
  saveAdminTemplate,
  saveConsultation,
} from "@/app/admin/crm/actions";

type AdminCrmPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toDateTimeLocal(value: Date) {
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminCrmPage({ searchParams }: AdminCrmPageProps) {
  const [templates, consultations, leads, query] = await Promise.all([
    getAllAdminTemplates(),
    getAllConsultations(),
    getAllLeads(),
    searchParams ? searchParams : Promise.resolve(undefined),
  ]);

  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  const templatesByType = {
    intake: templates.filter((item: AdminTemplateRecord) => item.type === "intake_questionnaire"),
    messages: templates.filter((item: AdminTemplateRecord) => item.type === "message_template"),
    handoff: templates.filter((item: AdminTemplateRecord) => item.type === "handoff_rule"),
    brief: templates.filter((item: AdminTemplateRecord) => item.type === "case_brief"),
  };

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="CRM і операційні шаблони"
      description="Внутрішній operational layer: первинне опитування, шаблони відповідей, правила передачі ліда, консультації і брифи."
    >
      <Card className="space-y-2">
        {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
        {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
      </Card>

      <Tabs
        items={[
          {
            id: "templates-intake",
            label: "Опитування",
            content: (
              <div className="grid gap-5">
                {templatesByType.intake.map((template: AdminTemplateRecord) => (
                  <Card key={template.id} className="space-y-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {formatTemplateType(template.type)}
                    </div>
                    <form action={saveAdminTemplate} className="grid gap-4">
                      <input type="hidden" name="id" value={template.id} />
                      <Input name="title" defaultValue={template.title} />
                      <Input name="description" defaultValue={template.description ?? ""} />
                      <Textarea name="content" defaultValue={template.content} className="min-h-72" />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input name="sortOrder" type="number" defaultValue={template.sortOrder} />
                        <select
                          name="isActive"
                          defaultValue={template.isActive ? "true" : "false"}
                          className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                        >
                          <option value="true">Активний</option>
                          <option value="false">Вимкнений</option>
                        </select>
                      </div>
                      <div>
                        <Button type="submit">Зберегти шаблон</Button>
                      </div>
                    </form>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "templates-messages",
            label: "Повідомлення",
            content: (
              <div className="grid gap-5">
                {templatesByType.messages.map((template: AdminTemplateRecord) => (
                  <Card key={template.id} className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      <span>{formatTemplateType(template.type)}</span>
                      <span>{template.channel ?? "Канал не вказано"}</span>
                    </div>
                    <form action={saveAdminTemplate} className="grid gap-4">
                      <input type="hidden" name="id" value={template.id} />
                      <Input name="title" defaultValue={template.title} />
                      <Input name="channel" defaultValue={template.channel ?? ""} placeholder="Канал повідомлення" />
                      <Input name="description" defaultValue={template.description ?? ""} />
                      <Textarea name="content" defaultValue={template.content} className="min-h-72" />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input name="sortOrder" type="number" defaultValue={template.sortOrder} />
                        <select
                          name="isActive"
                          defaultValue={template.isActive ? "true" : "false"}
                          className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                        >
                          <option value="true">Активний</option>
                          <option value="false">Вимкнений</option>
                        </select>
                      </div>
                      <div>
                        <Button type="submit">Зберегти шаблон</Button>
                      </div>
                    </form>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "templates-handoff",
            label: "Передача ліда",
            content: (
              <div className="grid gap-5">
                {[...templatesByType.handoff, ...templatesByType.brief].map((template: AdminTemplateRecord) => (
                  <Card key={template.id} className="space-y-4">
                    <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      {formatTemplateType(template.type)}
                    </div>
                    <form action={saveAdminTemplate} className="grid gap-4">
                      <input type="hidden" name="id" value={template.id} />
                      <Input name="title" defaultValue={template.title} />
                      <Input name="description" defaultValue={template.description ?? ""} />
                      <Textarea name="content" defaultValue={template.content} className="min-h-72" />
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input name="sortOrder" type="number" defaultValue={template.sortOrder} />
                        <select
                          name="isActive"
                          defaultValue={template.isActive ? "true" : "false"}
                          className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                        >
                          <option value="true">Активний</option>
                          <option value="false">Вимкнений</option>
                        </select>
                      </div>
                      <div>
                        <Button type="submit">Зберегти шаблон</Button>
                      </div>
                    </form>
                  </Card>
                ))}
              </div>
            ),
          },
          {
            id: "consultations",
            label: "Консультації",
            content: (
              <div className="grid gap-6">
                <Card className="space-y-4">
                  <h2 className="font-serif text-2xl tracking-tight">Нова консультація</h2>
                  <form action={createNewConsultation} className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input name="clientName" placeholder="Ім'я клієнта" />
                      <Input name="phone" placeholder="Телефон" />
                      <Input name="email" type="email" placeholder="Email, якщо є" />
                      <Input name="format" placeholder="Формат: офіс, онлайн, дзвінок" />
                      <Input name="startsAt" type="datetime-local" />
                      <Input name="endsAt" type="datetime-local" />
                      <select
                        name="status"
                        defaultValue="scheduled"
                        className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                      >
                        <option value="scheduled">{formatConsultationStatus("scheduled")}</option>
                        <option value="completed">{formatConsultationStatus("completed")}</option>
                        <option value="canceled">{formatConsultationStatus("canceled")}</option>
                        <option value="no_show">{formatConsultationStatus("no_show")}</option>
                      </select>
                      <select
                        name="leadId"
                        defaultValue=""
                        className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                      >
                        <option value="">Без прив&#39;язки до звернення</option>
                        {leads.map((lead: LeadRecord) => (
                          <option key={lead.id} value={lead.id}>
                            {lead.name} | {lead.phone}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Textarea name="notes" placeholder="Примітки до консультації" />
                    <div>
                      <Button type="submit">Створити консультацію</Button>
                    </div>
                  </form>
                </Card>

                <div className="grid gap-5">
                  {consultations.map((consultation: ConsultationRecord & { lead: LeadRecord | null }) => (
                    <Card key={consultation.id} className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted-foreground)]">
                        <span>{consultation.clientName}</span>
                        <span>{formatConsultationStatus(consultation.status)}</span>
                      </div>
                      <form action={saveConsultation} className="grid gap-4">
                        <input type="hidden" name="id" value={consultation.id} />
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input name="clientName" defaultValue={consultation.clientName} />
                          <Input name="phone" defaultValue={consultation.phone} />
                          <Input name="email" type="email" defaultValue={consultation.email ?? ""} />
                          <Input name="format" defaultValue={consultation.format} />
                          <Input name="startsAt" type="datetime-local" defaultValue={toDateTimeLocal(consultation.startsAt)} />
                          <Input name="endsAt" type="datetime-local" defaultValue={toDateTimeLocal(consultation.endsAt)} />
                          <select
                            name="status"
                            defaultValue={consultation.status}
                            className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                          >
                            <option value="scheduled">{formatConsultationStatus("scheduled")}</option>
                            <option value="completed">{formatConsultationStatus("completed")}</option>
                            <option value="canceled">{formatConsultationStatus("canceled")}</option>
                            <option value="no_show">{formatConsultationStatus("no_show")}</option>
                          </select>
                          <select
                            name="leadId"
                            defaultValue={consultation.leadId ?? ""}
                            className="min-h-12 rounded-[18px] border border-[var(--border)] bg-white px-4 text-sm"
                          >
                            <option value="">Без прив&#39;язки до звернення</option>
                            {leads.map((lead: LeadRecord) => (
                              <option key={lead.id} value={lead.id}>
                                {lead.name} | {lead.phone}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Textarea name="notes" defaultValue={consultation.notes ?? ""} />
                        <div>
                          <Button type="submit" variant="secondary">
                            Зберегти консультацію
                          </Button>
                        </div>
                      </form>
                    </Card>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
