import Link from "next/link";
import type { Route } from "next";

import { AdminListCard } from "@/components/admin/admin-list-card";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { formatLeadStatus } from "@/lib/admin-copy";
import {
  getAllArticles,
  getAllServices,
  getConsultationCount,
  getGlobalSettings,
  getLeadCount,
  getRecentLeads,
  getReviewCount,
  getSeoLandingPageCount,
} from "@/lib/content/repositories";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: buildPageTitle("Панель керування"),
  description: "Оглядова сторінка адмінки для керування контентом.",
  path: "/admin",
});

export default async function AdminDashboardPage() {
  const [articles, services, recentLeads, leadCount, settings, reviewCount, seoPageCount, consultationCount] = await Promise.all([
    getAllArticles(),
    getAllServices(),
    getRecentLeads(5),
    getLeadCount(),
    getGlobalSettings(),
    getReviewCount(),
    getSeoLandingPageCount(),
    getConsultationCount(),
  ]);
  const draftArticles = articles.filter((article: (typeof articles)[number]) => article.status === "draft").length;

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Панель керування"
      description="Швидкий огляд контенту, звернень і конфігурації сайту без зайвого CMS-шуму."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Послуги" value={services.length} note="Усі записи послуг" />
        <AdminStatCard label="Чернетки статей" value={draftArticles} note="Неопубліковані матеріали" />
        <AdminStatCard label="Заявки" value={leadCount} note="Усі ліди з форми" />
        <AdminStatCard label="SEO сторінки" value={seoPageCount} note={`Відгуки: ${reviewCount}`} />
        <AdminStatCard label="Консультації" value={consultationCount} note="У журналі консультацій" />
      </section>
      <section className="grid gap-5 xl:grid-cols-2">
        <AdminListCard title="Останні заявки">
          <div className="space-y-3">
            {recentLeads.map((lead: (typeof recentLeads)[number]) => (
              <div key={lead.id} className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium">{lead.name}</p>
                  <span className="text-[var(--muted-foreground)]">{formatLeadStatus(lead.status)}</span>
                </div>
                <p className="mt-2 text-[var(--muted-foreground)]">{lead.phone}</p>
                <p className="mt-2 text-[var(--muted-foreground)]">{lead.sourcePage}</p>
              </div>
            ))}
          </div>
        </AdminListCard>
        <AdminListCard title="Швидкі переходи">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/admin/settings" className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
              Загальні налаштування
            </Link>
            <Link href="/admin/services" className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
              Послуги
            </Link>
            <Link href="/admin/articles" className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
              Статті
            </Link>
            <Link href="/admin/leads" className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
              Звернення
            </Link>
            <Link href={"/admin/crm" as Route} className="rounded-[20px] border border-[var(--border)] p-4 text-sm">
              CRM і шаблони
            </Link>
          </div>
          <div className="rounded-[20px] border border-[var(--border)] p-4 text-sm text-[var(--muted-foreground)]">
            {settings
              ? `Активні контакти: ${settings.phonePrimary}, ${settings.emailPrimary}`
              : "Запис із загальними налаштуваннями ще не знайдено в базі."}
          </div>
        </AdminListCard>
      </section>
    </AdminShell>
  );
}
