import { MousePointer2, Navigation2, Plus } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

// Botão brilhante com cursor (estilo "Team Workflow")
export function FrontendCursor({ label }: { label: string }) {
  return (
    <div aria-hidden className="relative flex min-h-40 flex-1 items-center justify-center">
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-medium text-white shadow-[0_0_48px_-6px] shadow-secondary ring-1 ring-white/25">
          <Plus className="size-4" />
          {label}
        </span>

        <div className="absolute -right-10 -bottom-12 flex items-start gap-1 motion-safe:animate-float">
          <MousePointer2 className="size-5 -scale-x-100 fill-white text-white" />
          {siteConfig.avatarUrl ? (
            <span className="relative mt-3 size-9 overflow-hidden rounded-full ring-2 ring-secondary">
              <Image src={siteConfig.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
            </span>
          ) : null}
        </div>

        <Navigation2 className="absolute -right-20 -bottom-4 size-3.5 rotate-[135deg] fill-secondary/70 text-secondary/70" />
        <Navigation2 className="absolute -right-12 -bottom-20 size-3.5 rotate-[160deg] fill-secondary/60 text-secondary/60" />
        <Navigation2 className="absolute -right-24 -bottom-16 size-3 rotate-[120deg] fill-secondary/50 text-secondary/50" />
      </div>
    </div>
  );
}
