import { NextResponse } from "next/server";
import { z } from "zod";

import { createLead } from "@/lib/content/repositories";

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10),
  sourcePage: z.string().min(1),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Некоректні дані форми." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const lead = await createLead({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      message: parsed.data.message,
      sourcePage: parsed.data.sourcePage,
      sourceType: "contact_form",
    });

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
    });
  } catch {
    return NextResponse.json({ error: "Не вдалося зберегти звернення." }, { status: 500 });
  }
}
