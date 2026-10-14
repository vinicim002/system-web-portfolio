import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type CtaBannerProps = {
  title: string;
  button: string;
};

// Chamada final para a página de contato
export function CtaBanner({ title, button }: CtaBannerProps) {
  return (
    <section className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center lg:p-12">
      <h2 className="text-2xl tracking-tight lg:text-4xl">{title}</h2>
      <Button asChild size="lg" className="h-11 px-5">
        <Link href="/contato">
          {button}
          <ArrowRight aria-hidden />
        </Link>
      </Button>
    </section>
  );
}
