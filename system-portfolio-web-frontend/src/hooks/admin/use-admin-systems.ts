"use client";

import { useQuery } from "@tanstack/react-query";
import { adminSystems } from "@/lib/api/admin/systems";

const systemKeys = {
  all: ["admin", "systems"] as const,
  item: (slug: string) => [...systemKeys.all, slug] as const,
};

export function useAdminSystems() {
  return useQuery({ queryKey: systemKeys.all, queryFn: () => adminSystems.list() });
}

export function useAdminSystem(slug: string) {
  return useQuery({ queryKey: systemKeys.item(slug), queryFn: () => adminSystems.get(slug) });
}
