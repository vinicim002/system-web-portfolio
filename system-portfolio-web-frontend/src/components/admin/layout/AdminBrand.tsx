import { CodeXml } from "lucide-react";
import Link from "next/link";

// Marca do admin no mesmo estilo do header do site
export function AdminBrand({ label }: { label: string }) {
  return (
    <Link
      href="/admin"
      className="flex items-center gap-3 rounded-xl p-1 pr-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-accent-text text-white dark:text-primary">
        <CodeXml className="size-4" aria-hidden />
      </span>
      <span className="text-sm font-bold tracking-tight">
        {label}
        <span className="text-accent-text">.</span>
      </span>
    </Link>
  );
}
