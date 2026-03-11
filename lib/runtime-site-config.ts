import { getGlobalSettings } from "@/lib/content/repositories";
import { siteConfig } from "@/lib/site-config";

export type RuntimeSiteSettings = {
  companyName: string;
  legalName: string;
  description: string;
  city: string;
  region: string;
  phonePrimary: string;
  phoneSecondary: string | null;
  emailPrimary: string;
  address: string;
  workHours: string;
  googleMapsUrl: string | null;
};

export async function getRuntimeSiteSettings(): Promise<RuntimeSiteSettings> {
  const settings = await getGlobalSettings();

  if (!settings) {
    return {
      companyName: siteConfig.name,
      legalName: siteConfig.legalName,
      description: siteConfig.description,
      city: siteConfig.city,
      region: "Львівська область",
      phonePrimary: siteConfig.phone,
      phoneSecondary: null,
      emailPrimary: siteConfig.email,
      address: "Львів",
      workHours: "Пн-Пт 09:00-18:00",
      googleMapsUrl: null,
    };
  }

  return {
    companyName: settings.companyName,
    legalName: settings.legalName,
    description: siteConfig.description,
    city: settings.city,
    region: settings.region,
    phonePrimary: settings.phonePrimary,
    phoneSecondary: settings.phoneSecondary,
    emailPrimary: settings.emailPrimary,
    address: settings.address,
    workHours: settings.workHours,
    googleMapsUrl: settings.googleMapsUrl,
  };
}
