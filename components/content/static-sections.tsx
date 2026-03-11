import type { ContentSection } from "@/lib/content/types";

type StaticSectionsProps = {
  sections: ContentSection[];
};

export function StaticSections({ sections }: StaticSectionsProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {sections.map((section) => (
        <article key={section.heading} className="rounded-[28px] border border-[var(--border)] p-6 sm:p-8">
          <h2 className="font-serif text-3xl tracking-tight">{section.heading}</h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">{section.body}</p>
          {section.items?.length ? (
            <ul className="mt-5 space-y-3 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--foreground)]">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </section>
  );
}
