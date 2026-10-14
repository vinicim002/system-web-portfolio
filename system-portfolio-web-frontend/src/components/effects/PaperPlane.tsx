"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, MotionPathPlugin, DrawSVGPlugin);

// Trajetória: sobe por trás do título, faz um looping e sai por cima
const FLIGHT_PATH =
  "M -40 270 C 80 250, 160 180, 250 160 C 350 138, 460 165, 500 230 C 540 295, 480 345, 430 305 C 380 265, 430 175, 520 130 C 585 98, 615 60, 640 10";

const FLIGHT_DURATION = 3.4;
const REPEAT_DELAY = 7;
// Ponto onde o avião fica parado quando o usuário prefere menos movimento
const REST_PROGRESS = 0.52;

// Avião de papel voando com rastro (inspirado no ScrollSmoother do GSAP)
export function PaperPlane({ className }: { className?: string }) {
  const scope = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Janela do rastro: a cabeça acompanha o avião e a cauda vem atrás
        const trail = { head: 0, tail: 0 };
        const drawTrail = () =>
          gsap.set(".plane-trail", { drawSVG: `${trail.tail * 100}% ${trail.head * 100}%` });
        drawTrail();

        const motionPath = {
          path: "#flight-path",
          align: "#flight-path",
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        };
        const ease = "power1.inOut";

        gsap
          .timeline({
            repeat: -1,
            repeatDelay: REPEAT_DELAY,
            delay: 0.6,
            onUpdate: drawTrail,
            onRepeat: () => {
              trail.head = 0;
              trail.tail = 0;
            },
          })
          .set(".plane", { autoAlpha: 1 })
          .fromTo(
            ".plane",
            { motionPath: { ...motionPath, start: 0, end: 0 } },
            { motionPath: { ...motionPath, start: 0, end: 1 }, duration: FLIGHT_DURATION, ease },
            0,
          )
          .fromTo(trail, { head: 0 }, { head: 1, duration: FLIGHT_DURATION, ease }, 0)
          .fromTo(trail, { tail: 0 }, { tail: 1, duration: FLIGHT_DURATION * 0.85, ease: "power1.in" }, FLIGHT_DURATION * 0.45)
          // Some ao chegar no fim do caminho, na altura do título
          .to(".plane", { autoAlpha: 0, duration: 0.35 }, FLIGHT_DURATION - 0.35);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".plane-trail", { drawSVG: "0% 0%" });
        gsap.set(".plane", {
          autoAlpha: 1,
          motionPath: {
            path: "#flight-path",
            align: "#flight-path",
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
            start: REST_PROGRESS,
            end: REST_PROGRESS,
          },
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <svg
      ref={scope}
      aria-hidden
      viewBox="0 0 700 460"
      preserveAspectRatio="xMidYMid meet"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      <defs>
        <linearGradient id="plane-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "color-mix(in oklab, var(--accent-text) 35%, white)" }} />
          <stop offset="100%" stopColor="var(--accent-text)" />
        </linearGradient>
        <linearGradient id="plane-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--secondary)" />
          <stop offset="100%" stopColor="var(--primary)" />
        </linearGradient>
      </defs>

      {/* Caminho guia (invisível) e rastros */}
      <path id="flight-path" d={FLIGHT_PATH} fill="none" stroke="none" />
      <path
        className="plane-trail"
        d={FLIGHT_PATH}
        fill="none"
        stroke="var(--accent-text)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        className="plane-trail"
        d={FLIGHT_PATH}
        transform="translate(-5 6)"
        fill="none"
        stroke="var(--accent-text)"
        strokeOpacity="0.45"
        strokeWidth="0.75"
        strokeLinecap="round"
      />

      {/* Avião apontando para +x (o autoRotate segue a tangente do caminho) */}
      <g className="plane" style={{ visibility: "hidden" }}>
        <polygon points="34,0 -28,-22 -10,1" fill="url(#plane-light)" />
        <polygon points="34,0 -10,1 -20,13" fill="url(#plane-dark)" />
        <polygon points="34,0 -10,1 -32,7" fill="url(#plane-light)" opacity="0.6" />
      </g>
    </svg>
  );
}
