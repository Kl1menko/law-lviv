"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { createConsultation, updateAdminTemplate, updateConsultation } from "@/lib/content/repositories";

const adminTemplateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  channel: z.string().optional(),
  content: z.string().min(1),
  sortOrder: z.coerce.number().int(),
  isActive: z.enum(["true", "false"]),
});

const consultationCreateSchema = z.object({
  clientName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  format: z.string().min(1),
  status: z.enum(["scheduled", "completed", "canceled", "no_show"]),
  notes: z.string().optional(),
  leadId: z.string().optional(),
});

const consultationUpdateSchema = consultationCreateSchema.extend({
  id: z.string().min(1),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

function parseDateTime(value: string) {
  return new Date(value);
}

export async function saveAdminTemplate(formData: FormData) {
  await requireAdminSession("/admin/crm");

  const parsed = adminTemplateSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    channel: formData.get("channel") ?? "",
    content: formData.get("content"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    redirect("/admin/crm?error=template" as Route);
  }

  await updateAdminTemplate(parsed.data.id, {
    title: parsed.data.title,
    description: cleanOptional(formData.get("description")),
    channel: cleanOptional(formData.get("channel")),
    content: parsed.data.content,
    sortOrder: parsed.data.sortOrder,
    isActive: parsed.data.isActive === "true",
  });

  revalidatePath("/admin/crm");
  redirect("/admin/crm?saved=template" as Route);
}

export async function createNewConsultation(formData: FormData) {
  await requireAdminSession("/admin/crm");

  const parsed = consultationCreateSchema.safeParse({
    clientName: formData.get("clientName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
    leadId: formData.get("leadId") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/crm?error=consultation" as Route);
  }

  await createConsultation({
    clientName: parsed.data.clientName,
    phone: parsed.data.phone,
    email: cleanOptional(formData.get("email")),
    startsAt: parseDateTime(parsed.data.startsAt),
    endsAt: parseDateTime(parsed.data.endsAt),
    format: parsed.data.format,
    status: parsed.data.status,
    notes: cleanOptional(formData.get("notes")),
    leadId: cleanOptional(formData.get("leadId")),
  });

  revalidatePath("/admin/crm");
  revalidatePath("/admin/leads");
  redirect("/admin/crm?saved=consultation" as Route);
}

export async function saveConsultation(formData: FormData) {
  await requireAdminSession("/admin/crm");

  const parsed = consultationUpdateSchema.safeParse({
    id: formData.get("id"),
    clientName: formData.get("clientName"),
    phone: formData.get("phone"),
    email: formData.get("email") ?? "",
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    format: formData.get("format"),
    status: formData.get("status"),
    notes: formData.get("notes") ?? "",
    leadId: formData.get("leadId") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/crm?error=consultation" as Route);
  }

  await updateConsultation(parsed.data.id, {
    clientName: parsed.data.clientName,
    phone: parsed.data.phone,
    email: cleanOptional(formData.get("email")),
    startsAt: parseDateTime(parsed.data.startsAt),
    endsAt: parseDateTime(parsed.data.endsAt),
    format: parsed.data.format,
    status: parsed.data.status,
    notes: cleanOptional(formData.get("notes")),
    leadId: cleanOptional(formData.get("leadId")),
  });

  revalidatePath("/admin/crm");
  revalidatePath("/admin/leads");
  redirect("/admin/crm?saved=consultation" as Route);
}
