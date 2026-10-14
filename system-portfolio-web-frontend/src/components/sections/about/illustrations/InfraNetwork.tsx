import {
  Cloud,
  Container,
  GitBranch,
  Globe,
  HardDrive,
  Lock,
  Network,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const rows = [
  [Terminal, Container, Network, Cloud, Server],
  [GitBranch, Globe, ShieldCheck, Lock, HardDrive],
];

// Nós conectados por linhas, com as pontas esmaecidas (estilo "App Integrations")
export function InfraNetwork() {
  return (
    <div
      aria-hidden
      className="relative flex min-h-40 flex-1 flex-col items-center justify-center gap-5 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]"
    >
      {rows.map((icons, rowIndex) => (
        <div key={rowIndex} className={cn("relative flex gap-6", rowIndex === 1 && "translate-x-9")}>
          <span className="absolute top-1/2 right-6 left-6 h-px bg-border" />
          {icons.map((Icon, index) => {
            const isEdge = index === 0 || index === icons.length - 1;
            return (
              <span
                key={index}
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors group-hover:border-secondary/50",
                  isEdge && "blur-[1.5px]",
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
