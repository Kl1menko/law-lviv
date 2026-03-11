import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export async function getAdminSession() {
  return getServerSession(authOptions);
}

export async function requireAdminSession(nextPath = "/admin") {
  const session = await getAdminSession();

  if (!session?.user?.id) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}
