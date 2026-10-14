"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

// Calculado só no cliente para não divergir do HTML pré-renderizado
export function LocalTime({ timeZone }: { timeZone: string }) {
  const locale = useLocale();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [locale, timeZone]);

  return <time className="tabular-nums">{time ?? "--:--"}</time>;
}
