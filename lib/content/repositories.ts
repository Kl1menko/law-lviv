import { ContentStatus, type Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";

const prisma = getPrismaClient();

export async function getGlobalSettings() {
  return prisma.globalSettings.findFirst({
    orderBy: { createdAt: "asc" },
  });
}

export async function updateGlobalSettings(
  id: string,
  data: Prisma.GlobalSettingsUncheckedUpdateInput,
) {
  return prisma.globalSettings.update({
    where: { id },
    data,
  });
}

export async function getStaticPageByKey(key: string, includeDraft = false) {
  return prisma.staticPage.findFirst({
    where: {
      key,
      ...(includeDraft ? {} : { status: ContentStatus.published }),
    },
  });
}

export async function getPublishedServices() {
  return prisma.service.findMany({
    where: { status: ContentStatus.published },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getAllServices() {
  return prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getServiceBySlug(slug: string, includeDraft = false) {
  return prisma.service.findFirst({
    where: {
      slug,
      ...(includeDraft ? {} : { status: ContentStatus.published }),
    },
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function updateService(
  id: string,
  data: Prisma.ServiceUncheckedUpdateInput,
) {
  return prisma.service.update({
    where: { id },
    data,
  });
}

export async function createService(
  data: Prisma.ServiceUncheckedCreateInput,
) {
  return prisma.service.create({
    data,
  });
}

export async function getPublishedArticles(args?: {
  category?: string;
  limit?: number;
  excludeId?: string;
}) {
  return prisma.article.findMany({
    where: {
      status: ContentStatus.published,
      ...(args?.category ? { category: args.category } : {}),
      ...(args?.excludeId ? { id: { not: args.excludeId } } : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    ...(args?.limit ? { take: args.limit } : {}),
  });
}

export async function getAllArticles() {
  return prisma.article.findMany({
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getArticleBySlug(slug: string, includeDraft = false) {
  return prisma.article.findFirst({
    where: {
      slug,
      ...(includeDraft ? {} : { status: ContentStatus.published }),
    },
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
  });
}

export async function updateArticle(
  id: string,
  data: Prisma.ArticleUncheckedUpdateInput,
) {
  return prisma.article.update({
    where: { id },
    data,
  });
}

export async function createArticle(
  data: Prisma.ArticleUncheckedCreateInput,
) {
  return prisma.article.create({
    data,
  });
}

export async function getArticlesByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const articles = await prisma.article.findMany({
    where: {
      id: { in: ids },
      status: ContentStatus.published,
    },
  });

  const order = new Map(ids.map((id, index) => [id, index]));

  return articles.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}

export async function getServicesByArticleId(articleId: string) {
  return prisma.service.findMany({
    where: {
      status: ContentStatus.published,
      relatedArticleIds: {
        has: articleId,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getFaqItems(args?: {
  category?: string;
  relatedServiceId?: string;
  featuredOnly?: boolean;
}) {
  return prisma.faqItem.findMany({
    where: {
      ...(args?.category ? { category: args.category } : {}),
      ...(args?.relatedServiceId ? { relatedServiceId: args.relatedServiceId } : {}),
      ...(args?.featuredOnly ? { isFeatured: true } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getAllFaqItems() {
  return prisma.faqItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function updateFaqItem(
  id: string,
  data: Prisma.FaqItemUncheckedUpdateInput,
) {
  return prisma.faqItem.update({
    where: { id },
    data,
  });
}

export async function getReviews(featuredOnly = false) {
  return prisma.review.findMany({
    where: featuredOnly ? { isFeatured: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function getAllReviews() {
  return prisma.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function updateReview(
  id: string,
  data: Prisma.ReviewUncheckedUpdateInput,
) {
  return prisma.review.update({
    where: { id },
    data,
  });
}

export async function getReviewCount() {
  return prisma.review.count();
}

export async function getSeoLandingPageBySlug(slug: string, includeDraft = false) {
  return prisma.seoLandingPage.findFirst({
    where: {
      slug,
      ...(includeDraft ? {} : { status: ContentStatus.published }),
    },
  });
}

export async function getPublishedSeoLandingPages() {
  return prisma.seoLandingPage.findMany({
    where: { status: ContentStatus.published },
    orderBy: [{ createdAt: "asc" }],
  });
}

export async function getAllSeoLandingPages() {
  return prisma.seoLandingPage.findMany({
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getSeoLandingPageCount() {
  return prisma.seoLandingPage.count();
}

export async function updateSeoLandingPage(
  id: string,
  data: Prisma.SeoLandingPageUncheckedUpdateInput,
) {
  return prisma.seoLandingPage.update({
    where: { id },
    data,
  });
}

export async function getServicesByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const services = await prisma.service.findMany({
    where: {
      id: { in: ids },
      status: ContentStatus.published,
    },
    include: {
      faqRelations: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const order = new Map(ids.map((id, index) => [id, index]));

  return services.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}

export async function createLead(data: Prisma.LeadUncheckedCreateInput) {
  return prisma.lead.create({
    data,
  });
}

export async function getRecentLeads(limit = 10) {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getLeadCount() {
  return prisma.lead.count();
}

export async function getAllLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      consultations: {
        orderBy: { startsAt: "asc" },
      },
    },
  });
}

export async function updateLead(
  id: string,
  data: Prisma.LeadUncheckedUpdateInput,
) {
  return prisma.lead.update({
    where: { id },
    data,
  });
}

export async function getAllAdminTemplates(type?: string) {
  return prisma.adminTemplate.findMany({
    where: type ? { type: type as never } : undefined,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function updateAdminTemplate(
  id: string,
  data: Prisma.AdminTemplateUncheckedUpdateInput,
) {
  return prisma.adminTemplate.update({
    where: { id },
    data,
  });
}

export async function getAllConsultations() {
  return prisma.consultation.findMany({
    orderBy: [{ startsAt: "asc" }, { createdAt: "desc" }],
    include: {
      lead: true,
    },
  });
}

export async function createConsultation(
  data: Prisma.ConsultationUncheckedCreateInput,
) {
  return prisma.consultation.create({
    data,
  });
}

export async function updateConsultation(
  id: string,
  data: Prisma.ConsultationUncheckedUpdateInput,
) {
  return prisma.consultation.update({
    where: { id },
    data,
  });
}

export async function getConsultationCount() {
  return prisma.consultation.count();
}
