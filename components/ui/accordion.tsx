"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

type AccordionItemData = {
  id?: string;
  title: string;
  content: string;
};

type AccordionProps = {
  items: AccordionItemData[];
};

export function Accordion({ items }: AccordionProps) {
  const baseId = useId();
  const [openItem, setOpenItem] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const itemId = item.id ?? `${baseId}-${index}`;
        const panelId = `${itemId}-panel`;
        const isOpen = openItem === itemId;

        return (
          <article key={itemId} className="rounded-[24px] border border-[var(--border)] bg-[var(--muted)]/40">
            <button
              type="button"
              id={itemId}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenItem(isOpen ? null : itemId)}
            >
              <span className="font-serif text-2xl tracking-tight">{item.title}</span>
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {isOpen ? "Close" : "Open"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={itemId}
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[var(--border)] px-6 py-5 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
                  {item.content}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
