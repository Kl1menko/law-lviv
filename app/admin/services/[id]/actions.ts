"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { updateService } from "@/lib/content/repositories";

const serviceMainSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  shortDescription: z.string().min(1),
  intro: z.string().min(1),
});

const serviceSeoSchema = z.object({
  id: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

function parseKeywords(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export async function saveServiceMain(formData: FormData) {
  await requireAdminSession("/admin/services");

  const parsed = serviceMainSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    shortDescription: formData.get("shortDescription"),
    intro: formData.get("intro"),
  });

  if (!parsed.success) {
    redirect(`/admin/services/${formData.get("id")}?error=main`);
  }

  await updateService(parsed.data.id, {
    title: parsed.data.title,
    slug: parsed.data.slug,
    heroTitle: parsed.data.heroTitle,
    heroDescription: parsed.data.heroDescription,
    shortDescription: parsed.data.shortDescription,
    intro: parsed.data.intro,
  });

  revalidatePath(`/admin/services/${parsed.data.id}`);
  revalidatePath("/admin/services");
  revalidatePath(`/poslugy/${parsed.data.slug}`);
  redirect(`/admin/services/${parsed.data.id}?saved=main`);
}

export async function saveServiceSeo(formData: FormData) {
  await requireAdminSession("/admin/services");

  const parsed = serviceSeoSchema.safeParse({
    id: formData.get("id"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.get("seoKeywords"),
    canonicalUrl: formData.get("canonicalUrl") ?? "",
    ogImage: formData.get("ogImage") ?? "",
  });

  if (!parsed.success) {
    redirect(`/admin/services/${formData.get("id")}?error=seo`);
  }

  await updateService(parsed.data.id, {
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    seoKeywords: parseKeywords(parsed.data.seoKeywords),
    canonicalUrl: cleanOptional(formData.get("canonicalUrl")),
    ogImage: cleanOptional(formData.get("ogImage")),
  });

  revalidatePath(`/admin/services/${parsed.data.id}`);
  revalidatePath("/admin/services");
  redirect(`/admin/services/${parsed.data.id}?saved=seo`);
}
