"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { getServiceById, updateFaqItem } from "@/lib/content/repositories";

const faqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  relatedServiceId: z.string().optional(),
  sortOrder: z.coerce.number().int(),
  isFeatured: z.enum(["true", "false"]),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export async function saveFaqItem(formData: FormData) {
  await requireAdminSession("/admin/faq");

  const parsed = faqSchema.safeParse({
    id: formData.get("id"),
    question: formData.get("question"),
    answer: formData.get("answer"),
    category: formData.get("category"),
    relatedServiceId: formData.get("relatedServiceId") ?? "",
    sortOrder: formData.get("sortOrder"),
    isFeatured: formData.get("isFeatured"),
  });

  if (!parsed.success) {
    redirect("/admin/faq?error=save");
  }

  await updateFaqItem(parsed.data.id, {
    question: parsed.data.question,
    answer: parsed.data.answer,
    category: parsed.data.category,
    relatedServiceId: cleanOptional(formData.get("relatedServiceId")),
    sortOrder: parsed.data.sortOrder,
    isFeatured: parsed.data.isFeatured === "true",
  });

  revalidatePath("/admin/faq");
  revalidatePath("/faq");

  const relatedServiceId = cleanOptional(formData.get("relatedServiceId"));
  if (relatedServiceId) {
    const service = await getServiceById(relatedServiceId);
    if (service) {
      revalidatePath(`/poslugy/${service.slug}`);
    }
  }

  redirect("/admin/faq?saved=item");
}
