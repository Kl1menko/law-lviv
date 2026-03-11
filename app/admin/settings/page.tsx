import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { formatAdminErrorKey, formatAdminSavedKey } from "@/lib/admin-copy";
import { getGlobalSettings } from "@/lib/content/repositories";
import { saveContactSettings, saveLinkSettings, saveSeoSettings } from "@/app/admin/settings/actions";

type AdminSettingsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const settings = await getGlobalSettings();
  const query = searchParams ? await searchParams : undefined;
  const saved = typeof query?.saved === "string" ? query.saved : null;
  const error = typeof query?.error === "string" ? query.error : null;

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Налаштування"
      description="Контакти, адреса, соціальні посилання і базове SEO в одному компактному екрані."
    >
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">Форми нижче зберігають зміни в загальних налаштуваннях сайту.</p>
          {saved ? <p className="text-sm text-[var(--muted-foreground)]">{formatAdminSavedKey(saved)}</p> : null}
          {error ? <p className="text-sm text-red-700">{formatAdminErrorKey(error)}</p> : null}
        </div>
        <Tabs
          items={[
            {
              id: "contact",
              label: "Контакти",
              content: (
                <form action={saveContactSettings} className="grid gap-4 md:grid-cols-2">
                  <Input name="companyName" defaultValue={settings?.companyName ?? ""} />
                  <Input name="legalName" defaultValue={settings?.legalName ?? ""} />
                  <Input name="phonePrimary" defaultValue={settings?.phonePrimary ?? ""} />
                  <Input name="phoneSecondary" defaultValue={settings?.phoneSecondary ?? ""} />
                  <Input name="emailPrimary" type="email" defaultValue={settings?.emailPrimary ?? ""} />
                  <Input name="workHours" defaultValue={settings?.workHours ?? ""} />
                  <Input name="city" defaultValue={settings?.city ?? ""} />
                  <Input name="region" defaultValue={settings?.region ?? ""} />
                  <Textarea name="address" defaultValue={settings?.address ?? ""} className="md:col-span-2" />
                  <div className="md:col-span-2">
                    <Button type="submit">Зберегти контакти</Button>
                  </div>
                </form>
              ),
            },
            {
              id: "seo",
              label: "SEO",
              content: (
                <form action={saveSeoSettings} className="grid gap-4">
                  <Input name="defaultSeoTitle" defaultValue={settings?.defaultSeoTitle ?? ""} />
                  <Textarea name="defaultSeoDescription" defaultValue={settings?.defaultSeoDescription ?? ""} />
                  <Input name="defaultOgImage" defaultValue={settings?.defaultOgImage ?? ""} />
                  <div>
                    <Button type="submit">Зберегти SEO</Button>
                  </div>
                </form>
              ),
            },
            {
              id: "links",
              label: "Посилання",
              content: (
                <form action={saveLinkSettings} className="grid gap-4 md:grid-cols-2">
                  <Input name="googleMapsUrl" defaultValue={settings?.googleMapsUrl ?? ""} />
                  <Input name="telegramUrl" defaultValue={settings?.telegramUrl ?? ""} />
                  <Input name="facebookUrl" defaultValue={settings?.facebookUrl ?? ""} />
                  <Input name="instagramUrl" defaultValue={settings?.instagramUrl ?? ""} />
                  <Input name="whatsappUrl" defaultValue={settings?.whatsappUrl ?? ""} />
                  <Input name="youtubeUrl" defaultValue={settings?.youtubeUrl ?? ""} />
                  <div className="md:col-span-2">
                    <Button type="submit">Зберегти посилання</Button>
                  </div>
                </form>
              ),
            },
          ]}
        />
      </Card>
    </AdminShell>
  );
}
