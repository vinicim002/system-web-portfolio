type SectionHeaderProps = {
  id: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ id, title, subtitle }: SectionHeaderProps) {
  return (
    <header>
      <h2 id={id} className="text-3xl tracking-tight lg:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}
