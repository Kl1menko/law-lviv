import bcrypt from "bcryptjs";
import { ContentStatus } from "@prisma/client";

import {
  seedAdminTemplates,
  seedArticles,
  seedFaqs,
  seedGlobalSettings,
  seedReviews,
  seedSeoLandingPages,
  seedServiceArticleLinks,
  seedServices,
  seedStaticPages,
} from "../lib/content/seed-data";
import { getPrismaClient } from "../lib/prisma";

const prisma = getPrismaClient();

async function seedAdminUser() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@klimenko.law";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.ADMIN_SEED_NAME ?? "Site Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      isActive: true,
      role: "admin",
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  return { adminEmail, adminPassword };
}

async function seedGlobalContent() {
  const existing = await prisma.globalSettings.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    await prisma.globalSettings.update({
      where: { id: existing.id },
      data: seedGlobalSettings,
    });

    return;
  }

  await prisma.globalSettings.create({
    data: seedGlobalSettings,
  });
}

async function seedServicesContent() {
  for (const service of seedServices) {
    const {
      title,
      slug,
      shortDescription,
      heroTitle,
      heroDescription,
      intro,
      audience,
      problemsSolved,
      processSteps,
      benefits,
      seoTitle,
      seoDescription,
      seoKeywords,
      sortOrder,
    } = service;

    await prisma.service.upsert({
      where: { slug },
      update: {
        title,
        slug,
        shortDescription,
        heroTitle,
        heroDescription,
        intro,
        audience,
        problemsSolved,
        processSteps,
        benefits,
        seoTitle,
        seoDescription,
        seoKeywords,
        sortOrder,
        faqItems: [],
        relatedArticleIds: [],
        canonicalUrl: `/poslugy/${slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
      create: {
        title,
        slug,
        shortDescription,
        heroTitle,
        heroDescription,
        intro,
        audience,
        problemsSolved,
        processSteps,
        benefits,
        seoTitle,
        seoDescription,
        seoKeywords,
        sortOrder,
        faqItems: [],
        relatedArticleIds: [],
        canonicalUrl: `/poslugy/${slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
    });
  }
}

async function seedAdminTemplatesContent() {
  for (const template of seedAdminTemplates) {
    await prisma.adminTemplate.upsert({
      where: { key: template.key },
      update: {
        type: template.type,
        title: template.title,
        description: template.description ?? null,
        channel: template.channel ?? null,
        content: template.content,
        sortOrder: template.sortOrder,
        isActive: true,
      },
      create: {
        key: template.key,
        type: template.type,
        title: template.title,
        description: template.description ?? null,
        channel: template.channel ?? null,
        content: template.content,
        sortOrder: template.sortOrder,
        isActive: true,
      },
    });
  }
}

async function seedArticlesContent() {
  for (const article of seedArticles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        ...article,
        authorName: "Klimenko & CO",
        readingTime: Math.max(3, Math.ceil(article.contentMarkdown.split(/\s+/).length / 180)),
        canonicalUrl: `/blog/${article.slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
      create: {
        ...article,
        authorName: "Klimenko & CO",
        readingTime: Math.max(3, Math.ceil(article.contentMarkdown.split(/\s+/).length / 180)),
        canonicalUrl: `/blog/${article.slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
    });
  }
}

async function linkServiceArticles() {
  for (const service of seedServices) {
    const relatedSlugs = seedServiceArticleLinks[service.slug] ?? [];
    const relatedArticleIds = await prisma.article.findMany({
      where: { slug: { in: relatedSlugs } },
      select: { id: true },
    });

    await prisma.service.update({
      where: { slug: service.slug },
      data: {
        relatedArticleIds: relatedArticleIds.map((item) => item.id),
      },
    });
  }
}

async function seedFaqContent() {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true },
  });

  const serviceIdBySlug = new Map(services.map((service) => [service.slug, service.id]));

  for (const faq of seedFaqs) {
    const faqData = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      relatedServiceId: faq.serviceSlug ? serviceIdBySlug.get(faq.serviceSlug) ?? null : null,
      sortOrder: faq.sortOrder,
      isFeatured: faq.isFeatured ?? false,
    };

    const existing = await prisma.faqItem.findFirst({
      where: { question: faq.question },
      select: { id: true },
    });

    if (existing) {
      await prisma.faqItem.update({
        where: { id: existing.id },
        data: faqData,
      });

      continue;
    }

    await prisma.faqItem.create({
      data: faqData,
    });
  }
}

async function seedReviewContent() {
  for (const review of seedReviews) {
    const existing = await prisma.review.findFirst({
      where: {
        clientName: review.clientName,
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.review.update({
        where: { id: existing.id },
        data: review,
      });

      continue;
    }

    await prisma.review.create({
      data: review,
    });
  }
}

async function seedSeoPagesContent() {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true },
  });
  const articles = await prisma.article.findMany({
    select: { id: true, slug: true },
  });

  const serviceIdBySlug = new Map(services.map((service) => [service.slug, service.id]));
  const articleIdBySlug = new Map(articles.map((article) => [article.slug, article.id]));

  for (const page of seedSeoLandingPages) {
    await prisma.seoLandingPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        heroTitle: page.heroTitle,
        heroDescription: page.heroDescription,
        intro: page.intro,
        contentSections: page.contentSections,
        faqItems: page.faqItems,
        relatedServiceIds: page.relatedServiceSlugs.flatMap((slug) => serviceIdBySlug.get(slug) ?? []),
        relatedArticleIds: page.relatedArticleSlugs.flatMap((slug) => articleIdBySlug.get(slug) ?? []),
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        seoKeywords: page.seoKeywords,
        canonicalUrl: `/lviv/${page.slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
      create: {
        title: page.title,
        slug: page.slug,
        heroTitle: page.heroTitle,
        heroDescription: page.heroDescription,
        intro: page.intro,
        contentSections: page.contentSections,
        faqItems: page.faqItems,
        relatedServiceIds: page.relatedServiceSlugs.flatMap((slug) => serviceIdBySlug.get(slug) ?? []),
        relatedArticleIds: page.relatedArticleSlugs.flatMap((slug) => articleIdBySlug.get(slug) ?? []),
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        seoKeywords: page.seoKeywords,
        canonicalUrl: `/lviv/${page.slug}`,
        ogImage: "/og/default-law-lviv.jpg",
        status: ContentStatus.published,
      },
    });
  }
}

async function seedStaticPagesContent() {
  for (const page of seedStaticPages) {
    const pageData = {
      title: page.title,
      intro: page.intro,
      bodySections: [...page.bodySections],
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoKeywords: [...page.seoKeywords],
      status: page.status,
    };

    await prisma.staticPage.upsert({
      where: { key: page.key },
      update: pageData,
      create: {
        key: page.key,
        ...pageData,
      },
    });
  }
}

async function main() {
  const { adminEmail, adminPassword } = await seedAdminUser();

  await seedGlobalContent();
  await seedServicesContent();
  await seedArticlesContent();
  await linkServiceArticles();
  await seedFaqContent();
  await seedReviewContent();
  await seedSeoPagesContent();
  await seedStaticPagesContent();
  await seedAdminTemplatesContent();

  console.log(`Seed completed. Admin email: ${adminEmail}`);
  console.log(`Seed completed. Admin password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
