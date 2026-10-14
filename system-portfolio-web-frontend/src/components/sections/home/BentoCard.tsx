import { cn } from "@/lib/utils";

type BentoCardProps = React.ComponentProps<"section">;

// Superfície base de todos os blocos do bento grid
export function BentoCard({ className, ...props }: BentoCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card p-6",
        className,
      )}
      {...props}
    />
  );
}
