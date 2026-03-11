"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { createService } from "@/lib/content/repositories";

const newServiceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
  shortDescription: z.string().min(1),
  intro: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
});

function parseList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createNewService(formData: FormData) {
  await requireAdminSession("/admin/services/new");

  const parsed = newServiceSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    heroTitle: formData.get("heroTitle"),
    heroDescription: formData.get("heroDescription"),
    shortDescription: formData.get("shortDescription"),
    intro: formData.get("intro"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.get("seoKeywords"),
  });

  if (!parsed.success) {
    redirect("/admin/services/new?error=create");
  }

  const service = await createService({
    title: parsed.data.title,
    slug: parsed.data.slug,
    shortDescription: parsed.data.shortDescription,
    heroTitle: parsed.data.heroTitle,
    heroDescription: parsed.data.heroDescription,
    intro: parsed.data.intro,
    audience: [],
    problemsSolved: [],
    processSteps: [],
    benefits: [],
    faqItems: [],
    relatedArticleIds: [],
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    seoKeywords: parseList(parsed.data.seoKeywords),
    status: "draft",
    sortOrder: 0,
  });

  revalidatePath("/admin/services");
  redirect(`/admin/services/${service.id}?saved=create`);
}
