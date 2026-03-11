"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { updateLead } from "@/lib/content/repositories";

const leadSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "in_progress", "closed"]),
  assignedTo: z.string().optional(),
  internalNotes: z.string().optional(),
  intakeSummary: z.string().optional(),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

export async function saveLeadWorkflow(formData: FormData) {
  await requireAdminSession("/admin/leads");

  const parsed = leadSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
    assignedTo: formData.get("assignedTo") ?? "",
    internalNotes: formData.get("internalNotes") ?? "",
    intakeSummary: formData.get("intakeSummary") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/leads?error=status");
  }

  await updateLead(parsed.data.id, {
    status: parsed.data.status,
    assignedTo: cleanOptional(formData.get("assignedTo")),
    internalNotes: cleanOptional(formData.get("internalNotes")),
    intakeSummary: cleanOptional(formData.get("intakeSummary")),
  });

  revalidatePath("/admin/leads");
  redirect("/admin/leads?saved=status");
}
