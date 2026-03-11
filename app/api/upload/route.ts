import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Media upload is scaffolded but not implemented in Phase 0.",
    },
    { status: 501 },
  );
}
