import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { LightPillarBackground } from "@/components/shared/light-pillar-background";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
  backgroundVariant?: "none" | "light-pillar";
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  backgroundVariant = "none",
}: PageShellProps) {
  return (
    <div className="py-20 sm:py-24">
      <Container className="space-y-12">
        <section className="relative isolate overflow-hidden rounded-[36px] border border-[rgba(17,17,17,0.08)] bg-white px-6 py-8 shadow-[0_1px_0_rgba(17,17,17,0.03)] sm:px-8 sm:py-10">
          {backgroundVariant === "light-pillar" ? <LightPillarBackground className="absolute inset-0" /> : null}
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              {eyebrow ? (
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">{eyebrow}</p>
              ) : null}
              <h1 className="max-w-4xl font-serif text-5xl leading-none tracking-tight sm:text-6xl">{title}</h1>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">{description}</p>
          </div>
        </section>
        {children}
      </Container>
    </div>
  );
}
