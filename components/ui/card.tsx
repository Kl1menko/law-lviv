import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <article className={cn("rounded-[28px] border border-[var(--border)] bg-white p-6", className)}>{children}</article>;
}
