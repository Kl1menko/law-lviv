import type { Route } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata = buildMetadata({
  title: buildPageTitle("Вхід до адмінки"),
  description: "Вхід до внутрішньої адмінки.",
  path: "/admin/login",
});

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const [session, params] = await Promise.all([getAdminSession(), searchParams]);
  const nextPath = typeof params.next === "string" && params.next.startsWith("/admin") ? params.next : "/admin";

  if (session?.user?.id) {
    redirect(nextPath as Route);
  }

  return (
    <section className="mx-auto max-w-xl rounded-[32px] border border-[var(--border)] bg-white p-8">
      <h1 className="font-serif text-4xl tracking-tight">Вхід до адмінки</h1>
      <p className="mt-4 text-[var(--muted-foreground)]">
        Увійдіть через дані адміністратора, створені під час `db:seed`, щоб перейти до панелі керування і редагування контенту.
      </p>
      <div className="mt-8">
        <AdminLoginForm nextPath={nextPath} />
      </div>
    </section>
  );
}
