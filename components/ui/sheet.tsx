"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SheetProps = {
  triggerLabel: string;
  title: string;
  children: ReactNode;
  side?: "left" | "right";
  className?: string;
};

export function Sheet({ triggerLabel, title, children, side = "right", className }: SheetProps) {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/25" role="presentation">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "absolute top-0 h-full w-[min(92vw,380px)] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)]",
              side === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <h2 id={titleId} className="font-serif text-3xl tracking-tight">
                {title}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} aria-label="Close sheet">
                Закрити
              </Button>
            </div>
            <div className="pt-6">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
