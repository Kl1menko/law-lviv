import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import { buildMetadata, buildPageTitle } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: buildPageTitle("Адмінка"),
    description: "Внутрішня панель керування контентом.",
    path: "/admin",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[var(--muted)] py-10">
      <Container>{children}</Container>
    </div>
  );
}
