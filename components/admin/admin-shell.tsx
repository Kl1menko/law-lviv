import type { ReactNode } from "react";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type AdminShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminShell({ eyebrow, title, description, children }: AdminShellProps) {
  return (
    <section className="space-y-8">
      <Card className="rounded-[32px] p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <AdminLogoutButton />
        </div>
      </Card>
      {children}
    </section>
  );
}
