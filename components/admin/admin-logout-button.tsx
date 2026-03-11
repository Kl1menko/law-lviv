"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        void signOut({ callbackUrl: "/admin/login" });
      }}
    >
      Вийти
    </Button>
  );
}
