import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { mainNav } from "@/lib/site-config";

export async function SiteFooter() {
  const settings = await getRuntimeSiteSettings();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--muted)]">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <Card className="space-y-4 bg-transparent p-0 md:border-0">
          <p className="font-serif text-2xl">{settings.legalName}</p>
          <p className="max-w-md text-sm leading-6 text-[var(--muted-foreground)]">
            {settings.description}
          </p>
        </Card>

        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Навігація
          </p>
          <div className="flex flex-col gap-3 text-sm">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <p>
            {settings.city}, {settings.region}
          </p>
          <a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a>
          {settings.phoneSecondary ? <a href={`tel:${settings.phoneSecondary}`}>{settings.phoneSecondary}</a> : null}
          <a href={`mailto:${settings.emailPrimary}`}>{settings.emailPrimary}</a>
          <p className="text-[var(--muted-foreground)]">{settings.address}</p>
          <p className="text-[var(--muted-foreground)]">{settings.workHours}</p>
          <div className="flex flex-col gap-2 pt-2 text-[var(--muted-foreground)]">
            <Link href="/privacy-policy">Політика конфіденційності</Link>
            <Link href="/terms">Умови використання</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
