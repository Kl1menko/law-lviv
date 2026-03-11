"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { createArticle } from "@/lib/content/repositories";

const newArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  tags: z.string().optional(),
  excerpt: z.string().min(1),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
  seoKeywords: z.string().min(1),
  contentMarkdown: z.string().min(1),
});

function parseList(input: string) {
  return input
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createNewArticle(formData: FormData) {
  await requireAdminSession("/admin/articles/new");

  const parsed = newArticleSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    tags: formData.get("tags") ?? "",
    excerpt: formData.get("excerpt"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    seoKeywords: formData.get("seoKeywords"),
    contentMarkdown: formData.get("contentMarkdown"),
  });

  if (!parsed.success) {
    redirect("/admin/articles/new?error=create");
  }

  const article = await createArticle({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    category: parsed.data.category,
    tags: parseList(parsed.data.tags ?? ""),
    authorName: "Klimenko & CO",
    contentMarkdown: parsed.data.contentMarkdown,
    seoTitle: parsed.data.seoTitle,
    seoDescription: parsed.data.seoDescription,
    seoKeywords: parseList(parsed.data.seoKeywords),
    status: "draft",
  });

  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${article.id}?saved=create`);
}
