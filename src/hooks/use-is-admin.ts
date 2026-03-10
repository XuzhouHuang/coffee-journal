"use client";

import { useSession } from "next-auth/react";

export function useIsAdmin() {
  const { data: session, status } = useSession();
  return status !== "loading" && !!session;
}
