"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminSession } from "@/lib/admin-auth";
import { getGlobalSettings, updateGlobalSettings } from "@/lib/content/repositories";

const contactSettingsSchema = z.object({
  companyName: z.string().min(1),
  legalName: z.string().min(1),
  phonePrimary: z.string().min(1),
  phoneSecondary: z.string().optional(),
  emailPrimary: z.string().email(),
  workHours: z.string().min(1),
  city: z.string().min(1),
  region: z.string().min(1),
  address: z.string().min(1),
});

const seoSettingsSchema = z.object({
  defaultSeoTitle: z.string().min(1),
  defaultSeoDescription: z.string().min(1),
  defaultOgImage: z.string().optional(),
});

const linkSettingsSchema = z.object({
  googleMapsUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  whatsappUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

function cleanOptional(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

async function requireSettingsId() {
  const settings = await getGlobalSettings();

  if (!settings) {
    throw new Error("GlobalSettings record is missing.");
  }

  return settings.id;
}

export async function saveContactSettings(formData: FormData) {
  await requireAdminSession("/admin/settings");

  const parsed = contactSettingsSchema.safeParse({
    companyName: formData.get("companyName"),
    legalName: formData.get("legalName"),
    phonePrimary: formData.get("phonePrimary"),
    phoneSecondary: formData.get("phoneSecondary") ?? "",
    emailPrimary: formData.get("emailPrimary"),
    workHours: formData.get("workHours"),
    city: formData.get("city"),
    region: formData.get("region"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    redirect("/admin/settings?error=contact");
  }

  const id = await requireSettingsId();

  await updateGlobalSettings(id, {
    ...parsed.data,
    phoneSecondary: cleanOptional(formData.get("phoneSecondary")),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/kontakty");
  redirect("/admin/settings?saved=contact");
}

export async function saveSeoSettings(formData: FormData) {
  await requireAdminSession("/admin/settings");

  const parsed = seoSettingsSchema.safeParse({
    defaultSeoTitle: formData.get("defaultSeoTitle"),
    defaultSeoDescription: formData.get("defaultSeoDescription"),
    defaultOgImage: formData.get("defaultOgImage") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/settings?error=seo");
  }

  const id = await requireSettingsId();

  await updateGlobalSettings(id, {
    defaultSeoTitle: parsed.data.defaultSeoTitle,
    defaultSeoDescription: parsed.data.defaultSeoDescription,
    defaultOgImage: cleanOptional(formData.get("defaultOgImage")),
  });

  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=seo");
}

export async function saveLinkSettings(formData: FormData) {
  await requireAdminSession("/admin/settings");

  const parsed = linkSettingsSchema.safeParse({
    googleMapsUrl: formData.get("googleMapsUrl") ?? "",
    telegramUrl: formData.get("telegramUrl") ?? "",
    facebookUrl: formData.get("facebookUrl") ?? "",
    instagramUrl: formData.get("instagramUrl") ?? "",
    whatsappUrl: formData.get("whatsappUrl") ?? "",
    youtubeUrl: formData.get("youtubeUrl") ?? "",
  });

  if (!parsed.success) {
    redirect("/admin/settings?error=links");
  }

  const id = await requireSettingsId();

  await updateGlobalSettings(id, {
    googleMapsUrl: cleanOptional(formData.get("googleMapsUrl")),
    telegramUrl: cleanOptional(formData.get("telegramUrl")),
    facebookUrl: cleanOptional(formData.get("facebookUrl")),
    instagramUrl: cleanOptional(formData.get("instagramUrl")),
    whatsappUrl: cleanOptional(formData.get("whatsappUrl")),
    youtubeUrl: cleanOptional(formData.get("youtubeUrl")),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/kontakty");
  redirect("/admin/settings?saved=links");
}
