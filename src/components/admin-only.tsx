"use client";

import { useAuth } from "@/components/auth-provider";

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return null;
  return <>{children}</>;
}
