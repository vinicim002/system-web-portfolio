"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { Barcode } from "@/components/sections/shared/Barcode";

type DevBadgeProps = {
  name: string;
  role: string;
  label: string;
  footer: string;
  avatarUrl: string | null;
};

const MAX_ANGLE = 24;
// Comprimento aproximado do pêndulo (px), usado para converter arraste em ângulo
const PENDULUM_LENGTH = 320;

// Crachá pendurado: cordão, presilha e crachá giram juntos a partir do topo
export function DevBadge({ name, role, label, footer, avatarUrl }: DevBadgeProps) {
  const reduceMotion = useReducedMotion();
  const angle = useMotionValue(reduceMotion ? 0 : 10);
  // Pouco amortecimento para o crachá voltar balançando
  const rotate = useSpring(angle, { stiffness: 110, damping: 6, mass: 0.9 });

  // Balanço de entrada
  useEffect(() => {
    angle.set(0);
  }, [angle]);

  return (
    <motion.div
      className="flex origin-top flex-col items-center will-change-transform"
      style={{ rotate }}
    >
      {/* Cordão */}
      <div
        aria-hidden
        className="h-24 w-6 border-x-[3px] border-dashed border-white/15 bg-primary sm:h-32 lg:h-[clamp(6rem,16vh,13rem)] dark:bg-secondary"
      />

      {/* Presilha */}
      <div
        aria-hidden
        className="relative z-10 -mt-1 flex h-7 w-12 items-center justify-center rounded-lg border-2 border-muted-foreground/40 bg-card"
      >
        <span className="h-1.5 w-6 rounded-full bg-muted-foreground/40" />
      </div>

      <motion.div
        className="relative -mt-3 w-60 cursor-grab [@media(min-height:900px)]:lg:w-72 touch-pan-y overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-primary/15 select-none active:cursor-grabbing dark:shadow-black/50"
        onPan={(_, info) => {
          const degrees = (Math.atan2(info.offset.x, PENDULUM_LENGTH) * 180) / Math.PI;
          angle.set(Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, degrees)));
        }}
        onPanEnd={() => angle.set(0)}
      >
        {/* Furo do crachá */}
        <div aria-hidden className="mx-auto mt-4 h-2 w-14 rounded-full border border-border bg-card" />

        <div className="relative mx-3 mt-4 aspect-square overflow-hidden rounded-2xl bg-primary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              fill
              priority
              sizes="264px"
              draggable={false}
              className="pointer-events-none object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-6xl font-bold text-white" aria-hidden>
              {name.charAt(0)}
            </span>
          )}
          <span className="absolute top-3 left-3 rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10px] tracking-widest text-white uppercase backdrop-blur-sm">
            {label}
          </span>
        </div>

        <div className="px-4 pt-3 pb-4">
          <p className="text-lg leading-tight font-bold">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-dashed border-border pt-3">
            <span className="truncate font-mono text-[10px] text-muted-foreground">{footer}</span>
            <Barcode className="text-foreground/70" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
