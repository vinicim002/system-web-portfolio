import { CardWaves } from "@/components/effects/CardWaves";
import { cn } from "@/lib/utils";

// Posições fixas das "estrelas" (determinísticas para não variar entre servidor e cliente)
const STARS = [
  { top: "12%", left: "18%" },
  { top: "22%", left: "72%" },
  { top: "38%", left: "8%" },
  { top: "64%", left: "88%" },
  { top: "78%", left: "34%" },
  { top: "48%", left: "56%" },
  { top: "8%", left: "46%" },
  { top: "86%", left: "64%" },
];

// glow: brilho + estrelas | waves: efeito de ondas | blue: azul da marca (#010066)
export type GlowCardVariant = "glow" | "waves" | "blue";

// Fundo usado por padrão nos cards do Sobre
export const GLOW_CARD_VARIANT: GlowCardVariant = "blue";

type GlowCardProps = React.ComponentProps<"div"> & {
  // Classes do brilho de fundo (posição/tamanho); null desliga
  glowClassName?: string | null;
  variant?: GlowCardVariant;
};

// Card escuro com brilho roxo e estrelas, base das seções do Sobre
export function GlowCard({
  className,
  glowClassName,
  variant = GLOW_CARD_VARIANT,
  children,
  ...props
}: GlowCardProps) {
  const showGlow = variant !== "waves" && glowClassName !== null;
  const showStars = variant !== "waves";

  return (
    <div
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 lg:p-8",
        // Azul: conteúdo sempre no estilo escuro para manter o contraste
        variant === "blue" && "dark border-white/10 bg-primary text-foreground",
        className,
      )}
      {...props}
    >
      {variant === "waves" ? <CardWaves lazy /> : null}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {showGlow ? (
          <div
            className={cn(
              "absolute rounded-full bg-secondary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-secondary/25",
              "opacity-70",
              glowClassName ?? "-bottom-24 left-1/2 h-48 w-3/4 -translate-x-1/2",
            )}
          />
        ) : null}
        {showStars && STARS.map((star, index) => (
          <span
            key={index}
            className="absolute size-px rounded-full bg-foreground/30 dark:bg-white/50"
            style={star}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

type GlowCardTextProps = {
  title: string;
  description: string;
  tag?: string;
  className?: string;
  as?: "h3" | "h2";
};

// Título com leve esmaecimento + descrição, como nos cards da referência
export function GlowCardText({ title, description, tag, className, as: Heading = "h3" }: GlowCardTextProps) {
  return (
    <div className={cn("relative flex flex-col gap-2", className)}>
      {tag ? <p className="text-xs font-medium text-accent-text">{tag}</p> : null}
      <Heading className="bg-gradient-to-r from-foreground from-40% to-foreground/45 bg-clip-text text-2xl tracking-tight text-transparent lg:text-3xl">
        {title}
      </Heading>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
