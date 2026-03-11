import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { path?: string } | null;
  const path = body?.path ?? "/";

  revalidatePath(path);

  return NextResponse.json({ revalidated: true, path });
}
