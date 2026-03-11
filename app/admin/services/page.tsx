import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatContentStatus } from "@/lib/admin-copy";
import { getAllServices } from "@/lib/content/repositories";

export default async function AdminServicesPage() {
  const services = await getAllServices();

  return (
    <AdminShell
      eyebrow="Адмінка"
      title="Послуги"
      description="Список послуг із видимими slug, статусом і швидким переходом до екрана редагування."
    >
      <div className="flex justify-end">
        <Button href="/admin/services/new">Нова послуга</Button>
      </div>
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl tracking-tight">{service.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{service.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                <span>{formatContentStatus(service.status)}</span>
                <span>{service.slug}</span>
                <span>{`порядок: ${service.sortOrder}`}</span>
              </div>
            </div>
            <Link href={`/admin/services/${service.id}`} className="text-sm font-medium">
              Редагувати
            </Link>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
