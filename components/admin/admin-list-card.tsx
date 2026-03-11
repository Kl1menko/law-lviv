import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

type AdminListCardProps = {
  title: string;
  children: ReactNode;
};

export function AdminListCard({ title, children }: AdminListCardProps) {
  return (
    <Card className="space-y-5">
      <h2 className="font-serif text-3xl tracking-tight">{title}</h2>
      {children}
    </Card>
  );
}
