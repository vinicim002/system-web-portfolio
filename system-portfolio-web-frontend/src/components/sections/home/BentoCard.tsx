import { CardWaves } from "@/components/effects/CardWaves";
import { cn } from "@/lib/utils";

type BentoCardProps = React.ComponentProps<"section"> & {
  // Fundo animado em WebGPU; string = texto recortado no padrão
  waves?: boolean | string;
};

// Superfície base de todos os blocos do bento grid
export function BentoCard({ className, waves = false, children, ...props }: BentoCardProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-border bg-card p-6",
        className,
      )}
      {...props}
    >
      {waves ? <CardWaves text={typeof waves === "string" ? waves : ""} /> : null}
      {children}
    </section>
  );
}
