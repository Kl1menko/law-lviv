"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { updateReview } from "@/lib/content/repositories";

const reviewSchema = z.object({
  id: z.string().min(1),
  clientName: z.string().min(1),
  source: z.string().optional(),
  text: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  sortOrder: z.coerce.number().int(),
  isFeatured: z.enum(["true", "false"]),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export async function saveReview(formData: FormData) {
  await requireAdminSession("/admin/reviews");

  const parsed = reviewSchema.safeParse({
    id: formData.get("id"),
    clientName: formData.get("clientName"),
    source: formData.get("source") ?? "",
    text: formData.get("text"),
    rating: formData.get("rating"),
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured"),
  });

  if (!parsed.success) {
    redirect("/admin/reviews?error=save");
  }

  await updateReview(parsed.data.id, {
    clientName: parsed.data.clientName,
    source: cleanOptional(formData.get("source")),
    text: parsed.data.text,
    rating: parsed.data.rating,
    sortOrder: parsed.data.sortOrder,
    isFeatured: parsed.data.isFeatured === "true",
  });

  revalidatePath("/admin/reviews");
  revalidatePath("/vidguky");
  revalidatePath("/");
  redirect("/admin/reviews?saved=item");
}
