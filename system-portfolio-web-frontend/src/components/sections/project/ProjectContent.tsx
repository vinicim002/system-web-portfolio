import ReactMarkdown, { type Components } from "react-markdown";

// Estilos do markdown dos cases (conteúdo vem do banco/admin)
const components: Components = {
  h2: ({ children }) => <h2 className="mt-12 mb-4 text-2xl tracking-tight lg:text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl">{children}</h3>,
  p: ({ children }) => <p className="mb-5 leading-relaxed text-muted-foreground lg:text-lg">{children}</p>,
  ul: ({ children }) => <ul className="mb-5 flex flex-col gap-2">{children}</ul>,
  li: ({ children }) => (
    <li className="flex gap-3 leading-relaxed text-muted-foreground before:mt-2.5 before:size-1.5 before:shrink-0 before:rounded-full before:bg-secondary">
      <span>{children}</span>
    </li>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-accent-text underline underline-offset-4" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
};

export function ProjectContent({ content }: { content: string }) {
  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
}
