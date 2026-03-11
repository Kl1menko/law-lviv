import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { JsonLd } from "@/components/shared/json-ld";
import { buildRuntimeMetadata, buildRuntimeOrganizationJsonLd } from "@/lib/runtime-seo";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const serif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  return buildRuntimeMetadata({
    pageTitle: "Юридична компанія у Львові",
    description:
      "Швидкий, структурований сайт юридичної компанії у Львові з окремими сторінками послуг, FAQ та блогом.",
  });
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const organizationJsonLd = await buildRuntimeOrganizationJsonLd();

  return (
    <html lang="uk" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
