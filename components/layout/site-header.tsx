import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { getRuntimeSiteSettings } from "@/lib/runtime-site-config";
import { mainNav } from "@/lib/site-config";

export async function SiteHeader() {
  const settings = await getRuntimeSiteSettings();

  return (
    <header className="border-b border-[var(--border)]">
      <Container className="flex min-h-16 items-center justify-between gap-4 sm:min-h-20 sm:gap-6">
        <Link href="/" className="min-w-0 flex items-center gap-2.5 sm:gap-3">
          <Image
            src="/logo.svg"
            alt={settings.companyName}
            width={44}
            height={44}
            className="h-9 w-9 shrink-0 sm:h-11 sm:w-11"
            priority
          />
          <span className="flex flex-col">
            <span className="font-serif text-[1.15rem] leading-none tracking-tight text-[var(--foreground)] sm:text-2xl">
              Klimenko & CO
            </span>
            <span className="text-[10px] uppercase leading-[1.15] tracking-[0.06em] text-[var(--muted-foreground)] sm:text-xs sm:tracking-[0.08em]">
              Юридична допомога у Львові
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted-foreground)] lg:flex">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="lg:hidden">
            <Sheet triggerLabel="Меню" title="Навігація">
              <nav className="flex flex-col gap-3 text-sm">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[18px] border border-[var(--border)] px-4 py-3 text-[var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 space-y-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted-foreground)]">
                <a href={`tel:${settings.phonePrimary}`}>{settings.phonePrimary}</a>
                <a href={`mailto:${settings.emailPrimary}`} className="block">
                  {settings.emailPrimary}
                </a>
                <Button href="/kontakty" className="w-full">
                  Консультація
                </Button>
              </div>
            </Sheet>
          </div>
          <div className="hidden lg:block">
            <Button href="/kontakty" className="min-w-[11.5rem] text-white">
              Запис на консультацію
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
