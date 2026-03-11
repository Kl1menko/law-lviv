"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { updateArticle } from "@/lib/content/repositories";

const articleMainSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  tags: z.string().optional(),
  excerpt: z.string().min(1),
});

const articleSeoSchema = z.object({
  id: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
  canonicalUrl: z.string().optional(),
  ogImage: z.string().optional(),
});

const articleContentSchema = z.object({
  id: z.string().min(1),
  contentMarkdown: z.string().min(1),
});

function parseList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export async function saveArticleMain(formData: FormData) {
  await requireAdminSession("/admin/articles");

  const parsed = articleMainSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    tags: formData.get("tags") ?? "",
    excerpt: formData.get("excerpt"),
  });

  if (!parsed.success) {
    redirect(`/admin/articles/${formData.get("id")}?error=main`);
  }

  await updateArticle(parsed.data.id, {
    title: parsed.data.title,
    slug: parsed.data.slug,
    category: parsed.data.category,
    tags: parseList(parsed.data.tags ?? ""),
    excerpt: parsed.data.excerpt,
  });

  revalidatePath(`/admin/articles/${parsed.data.id}`);
  revalidatePath("/admin/articles");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect(`/admin/articles/${parsed.data.id}?saved=main`);
}

export async function saveArticleSeo(formData: FormData) {
  await requireAdminSession("/admin/articles");

  const parsed = articleSeoSchema.safeParse({
    id: formData.get("id"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.get("seoKeywords"),
    canonicalUrl: formData.get("canonicalUrl") ?? "",
    ogImage: formData.get("ogImage") ?? "",
  });

  if (!parsed.success) {
    redirect(`/admin/articles/${formData.get("id")}?error=seo`);
  }

  await updateArticle(parsed.data.id, {
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    seoKeywords: parseList(parsed.data.seoKeywords),
    canonicalUrl: cleanOptional(formData.get("canonicalUrl")),
    ogImage: cleanOptional(formData.get("ogImage")),
  });

  revalidatePath(`/admin/articles/${parsed.data.id}`);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${parsed.data.id}?saved=seo`);
}

export async function saveArticleContent(formData: FormData) {
  await requireAdminSession("/admin/articles");

  const parsed = articleContentSchema.safeParse({
    id: formData.get("id"),
    contentMarkdown: formData.get("contentMarkdown"),
  });

  if (!parsed.success) {
    redirect(`/admin/articles/${formData.get("id")}?error=content`);
  }

  await updateArticle(parsed.data.id, {
    contentMarkdown: parsed.data.contentMarkdown,
  });

  revalidatePath(`/admin/articles/${parsed.data.id}`);
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${parsed.data.id}?saved=content`);
}
