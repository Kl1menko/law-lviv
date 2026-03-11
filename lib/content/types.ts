import type { Prisma } from "@prisma/client";

export type ContentListItem = {
  title: string;
  description: string;
};

export type ContentSection = {
  heading: string;
  body: string;
  items?: string[];
};

export type ServiceRecord = Prisma.ServiceGetPayload<{
  include: {
    faqRelations: true;
  };
}>;

export type ArticleRecord = Prisma.ArticleGetPayload<Record<string, never>>;
export type FaqRecord = Prisma.FaqItemGetPayload<Record<string, never>>;
export type ReviewRecord = Prisma.ReviewGetPayload<Record<string, never>>;
export type LeadRecord = Prisma.LeadGetPayload<Record<string, never>>;
export type SeoLandingPageRecord = Prisma.SeoLandingPageGetPayload<Record<string, never>>;
export type GlobalSettingsRecord = Prisma.GlobalSettingsGetPayload<Record<string, never>>;
export type StaticPageRecord = Prisma.StaticPageGetPayload<Record<string, never>>;
export type AdminTemplateRecord = Prisma.AdminTemplateGetPayload<Record<string, never>>;
export type ConsultationRecord = Prisma.ConsultationGetPayload<Record<string, never>>;
