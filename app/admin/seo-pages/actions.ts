"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { updateSeoLandingPage } from "@/lib/content/repositories";

const seoLandingMainSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  intro: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(["draft", "published"]),
});

const seoLandingSeoSchema = z.object({
  id: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

const seoLandingRelationsSchema = z.object({
  id: z.string().min(1),
  relatedServiceIds: z.string().optional(),
  relatedArticleIds: z.string().optional(),
  contentSections: z.string().min(1),
  faqItems: z.string().min(1),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

function parseList(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value : "";
  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function saveSeoLandingMain(formData: FormData) {
  await requireAdminSession("/admin/seo-pages");

  const parsed = seoLandingMainSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    intro: formData.get("intro"),
    location: formData.get("location"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    redirect("/admin/seo-pages?error=main");
  }

  await updateSeoLandingPage(parsed.data.id, {
    title: parsed.data.title,
    slug: parsed.data.slug,
    heroTitle: parsed.data.heroTitle,
    heroDescription: parsed.data.heroDescription,
    intro: parsed.data.intro,
    location: parsed.data.location,
    status: parsed.data.status,
  });

  revalidatePath("/admin/seo-pages");
  revalidatePath(`/lviv/${parsed.data.slug}`);
  redirect("/admin/seo-pages?saved=main");
}

export async function saveSeoLandingSeo(formData: FormData) {
  await requireAdminSession("/admin/seo-pages");

  const parsed = seoLandingSeoSchema.safeParse({
    id: formData.get("id"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.get("seoKeywords"),
    canonicalUrl: formData.get("canonicalUrl") ?? "",
    ogImage: formData.get("ogImage") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/seo-pages?error=seo");
  }

  await updateSeoLandingPage(parsed.data.id, {
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    seoKeywords: parseList(formData.get("seoKeywords")),
    canonicalUrl: cleanOptional(formData.get("canonicalUrl")),
    ogImage: cleanOptional(formData.get("ogImage")),
  });

  revalidatePath("/admin/seo-pages");
  redirect("/admin/seo-pages?saved=seo");
}

export async function saveSeoLandingRelations(formData: FormData) {
  await requireAdminSession("/admin/seo-pages");

  const parsed = seoLandingRelationsSchema.safeParse({
    id: formData.get("id"),
    relatedServiceIds: formData.get("relatedServiceIds") ?? "",
    relatedArticleIds: formData.get("relatedArticleIds") ?? "",
    contentSections: formData.get("contentSections"),
    faqItems: formData.get("faqItems"),
  });

  if (!parsed.success) {
    redirect("/admin/seo-pages?error=relations");
  }

  try {
    const contentSections = JSON.parse(parsed.data.contentSections) as Prisma.InputJsonValue;
    const faqItems = JSON.parse(parsed.data.faqItems) as Prisma.InputJsonValue;

    await updateSeoLandingPage(parsed.data.id, {
      relatedServiceIds: parseList(formData.get("relatedServiceIds")),
      relatedArticleIds: parseList(formData.get("relatedArticleIds")),
      contentSections,
      faqItems,
    });
  } catch {
    redirect("/admin/seo-pages?error=json");
  }

  revalidatePath("/admin/seo-pages");
  redirect("/admin/seo-pages?saved=relations");
}
