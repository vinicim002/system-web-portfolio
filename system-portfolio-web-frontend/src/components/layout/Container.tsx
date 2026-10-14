import { cn } from "@/lib/utils";

// Largura e margens laterais padrão de todas as páginas
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}
