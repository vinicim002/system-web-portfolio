import { cn } from "@/lib/utils";

const BARS = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3];

// "Código de barras" decorativo usado no crachá e no Sobre
export function Barcode({ className, bars = 12 }: { className?: string; bars?: number }) {
  return (
    <span aria-hidden className={cn("flex h-5 shrink-0 items-end gap-px", className)}>
      {BARS.slice(0, bars).map((width, index) => (
        <span key={index} className="h-full bg-current" style={{ width }} />
      ))}
    </span>
  );
}
