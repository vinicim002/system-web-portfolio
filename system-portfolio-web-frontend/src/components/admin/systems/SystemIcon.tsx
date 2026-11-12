import { cn } from "@/lib/utils";

type SystemIconProps = {
  name: string;
  muted?: boolean;
  className?: string;
};

// Inicial do nome sobre a cor da marca, até o autor enviar os logos
export function SystemIcon({ name, muted = false, className }: SystemIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold",
        muted ? "bg-muted text-muted-foreground" : "bg-accent-text text-white dark:text-primary",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
