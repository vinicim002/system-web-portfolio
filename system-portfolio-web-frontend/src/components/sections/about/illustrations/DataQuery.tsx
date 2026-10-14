"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Consultas exibidas na "barra de busca" (PostgreSQL + TimescaleDB)
const QUERIES = [
  "SELECT * FROM vehicles WHERE branch_id = $1",
  "SELECT time_bucket('5 min', ts), avg(speed) FROM telemetry",
  "CREATE INDEX ON trips (vehicle_id, started_at)",
];

// Barra de busca digitando consultas (estilo "All-in-One Search")
export function DataQuery() {
  const reduceMotion = useReducedMotion();
  const [queryIndex, setQueryIndex] = useState(0);
  const [length, setLength] = useState(0);

  const query = QUERIES[queryIndex];

  useEffect(() => {
    if (reduceMotion) return;
    const done = length >= query.length;
    const timeout = setTimeout(
      () => {
        if (done) {
          setQueryIndex((index) => (index + 1) % QUERIES.length);
          setLength(0);
        } else {
          setLength((value) => value + 1);
        }
      },
      done ? 2200 : 45,
    );
    return () => clearTimeout(timeout);
  }, [length, query, reduceMotion]);

  const text = reduceMotion ? query : query.slice(0, length);

  return (
    <div aria-hidden className="relative flex min-h-40 flex-1 items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="flex h-14 items-center gap-3 rounded-2xl border border-border bg-background/50 px-5 backdrop-blur-sm">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground">
            {text}
            <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-accent-text motion-safe:animate-caret" />
          </span>
          <span className="flex gap-1">
            <kbd className="flex size-7 items-center justify-center rounded-md border border-border font-sans text-xs text-muted-foreground">
              ⌘
            </kbd>
            <kbd className="flex size-7 items-center justify-center rounded-md border border-border font-sans text-xs text-muted-foreground">
              K
            </kbd>
          </span>
        </div>
        {/* Linha de brilho sob a barra */}
        <div className="absolute -bottom-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />
        <div className="absolute -bottom-3 left-1/2 h-6 w-1/2 -translate-x-1/2 rounded-full bg-secondary/40 blur-xl" />
      </div>
    </div>
  );
}
