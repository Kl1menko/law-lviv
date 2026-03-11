"use client";

import { useEffect, useId, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export function Dialog({ triggerLabel, title, description, children, className }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
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
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={cn("w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.12)]", className)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="font-serif text-3xl tracking-tight">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} aria-label="Close dialog">
                Закрити
              </Button>
            </div>
            {children ? <div className="mt-6">{children}</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
