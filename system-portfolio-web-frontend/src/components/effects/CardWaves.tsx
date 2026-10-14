"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Carregados só no navegador; a versão WebGPU nem é baixada sem suporte
const ShapeWaves = dynamic(() => import("./ShapeWaves"), { ssr: false });
const ShapeWavesGL = dynamic(() => import("./ShapeWavesGL"), { ssr: false });

type Renderer = "webgpu" | "webgl2" | "none";
type WaveColors = { background: string; dots: string; hover: string };

type NavigatorWithGpu = Navigator & {
  gpu?: { requestAdapter(options?: object): Promise<unknown | null> };
};

// Detecção feita uma vez e compartilhada pelos cards da página
let webGpuSupport: Promise<boolean> | null = null;

function detectWebGpu() {
  webGpuSupport ??= (async () => {
    try {
      const gpu = (navigator as NavigatorWithGpu).gpu;
      return Boolean(gpu && (await gpu.requestAdapter({ powerPreference: "low-power" })));
    } catch {
      return false;
    }
  })();
  return webGpuSupport;
}

function readToken(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

type CardWavesProps = {
  text?: string;
  // Token CSS da cor de fundo (cards usam --card; fundo de página usa --background)
  surface?: "--card" | "--background";
  // Esmaecimento nas bordas (0 = nenhum)
  fade?: number;
  // Só cria o efeito quando está perto da tela (economiza contextos WebGL)
  lazy?: boolean;
  className?: string;
};

// Fundo animado dos cards da home, com as cores dos tokens do tema atual.
// Usa WebGPU quando disponível, senão WebGL2; sem nenhum dos dois, o card
// fica só com o fundo normal.
export function CardWaves({ text = "", surface = "--card", fade = 0.25, lazy = false, className }: CardWavesProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<WaveColors | null>(null);
  const [renderer, setRenderer] = useState<Renderer | null>(null);
  const [nearViewport, setNearViewport] = useState(!lazy);

  useEffect(() => {
    if (!lazy || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => setNearViewport(entries.some((entry) => entry.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    let cancelled = false;
    detectWebGpu().then((supported) => {
      if (!cancelled) setRenderer(supported ? "webgpu" : "webgl2");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Lê depois da troca de classe do tema para pegar os valores atualizados
    const frame = requestAnimationFrame(() => {
      setColors({
        background: readToken(surface),
        dots: readToken("--border"),
        hover: readToken("--secondary"),
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [resolvedTheme, surface]);

  const active = colors && renderer && renderer !== "none" && nearViewport;

  const shared = colors
    ? {
        text,
        shapes: "mixed" as const,
        cellSize: 10,
        dotSize: 0.75,
        color: colors.dots,
        hoverColor: colors.hover,
        backgroundColor: colors.background,
        brightness: 0.4,
        fade,
        interactive: true,
        splashRadius: 40,
        splashStrength: 0.4,
        intro: true,
        introDuration: 1.6,
      }
    : null;

  // O contêiner existe sempre (para o observer); o efeito só quando ativo
  return (
    <div ref={containerRef} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      {active && shared ? (
        renderer === "webgpu" ? (
          <ShapeWaves {...shared} glow={0.35} onError={() => setRenderer("webgl2")} />
        ) : (
          <ShapeWavesGL {...shared} onError={() => setRenderer("none")} />
        )
      ) : null}
    </div>
  );
}
