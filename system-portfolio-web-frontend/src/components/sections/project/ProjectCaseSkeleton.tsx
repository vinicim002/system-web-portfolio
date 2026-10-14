import { Container } from "@/components/layout/Container";

// Esqueleto exibido enquanto o case carrega
export function ProjectCaseSkeleton() {
  return (
    <Container aria-hidden className="flex animate-pulse flex-col gap-8 pt-6 motion-reduce:animate-none lg:pt-10">
      <div className="h-4 w-40 rounded-full bg-muted" />
      <div className="h-6 w-56 rounded-full bg-muted" />
      <div className="h-24 w-full max-w-3xl rounded-2xl bg-muted lg:h-36" />
      <div className="h-6 w-full max-w-2xl rounded-full bg-muted" />
      <div className="mt-8 flex flex-col gap-3">
        <div className="h-4 w-full max-w-3xl rounded-full bg-muted" />
        <div className="h-4 w-full max-w-3xl rounded-full bg-muted" />
        <div className="h-4 w-2/3 max-w-3xl rounded-full bg-muted" />
      </div>
    </Container>
  );
}
