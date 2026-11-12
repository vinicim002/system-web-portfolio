import type { MonitoredSystem } from "@/types/admin";
import type { AdminSystemsService } from "./systems";

const DELAY_MS = 150;

// Horário fixo: os resumos abaixo são INVENTADOS e aparecem marcados como exemplo na tela
const SAMPLE_CHECKED_AT = "2026-11-11T12:00:00Z";

// Ordem fixa: RookHub, RookMTR, Fazendo Comuns, Zona Sul Urgente
const systems: MonitoredSystem[] = [
  {
    slug: "rookhub",
    name: "RookHub",
    url: "https://rookhub.com.br/",
    state: "live",
    sample: {
      status: "up",
      uptimePercent: 99.9,
      visitsLast7Days: 1240,
      blockedThreatsLast7Days: 37,
      checkedAt: SAMPLE_CHECKED_AT,
    },
  },
  {
    slug: "rookmtr",
    name: "RookMTR",
    url: "https://rookmtr.com.br/",
    state: "live",
    sample: {
      status: "degraded",
      uptimePercent: 98.7,
      visitsLast7Days: 860,
      blockedThreatsLast7Days: 12,
      checkedAt: SAMPLE_CHECKED_AT,
    },
  },
  {
    slug: "fazendo-comuns",
    name: "Fazendo Comuns",
    url: "https://www.fazendocomuns.com.br/",
    state: "live",
    sample: {
      status: "up",
      uptimePercent: 100,
      visitsLast7Days: 2310,
      blockedThreatsLast7Days: 5,
      checkedAt: SAMPLE_CHECKED_AT,
    },
  },
  {
    slug: "zona-sul-urgente",
    name: "Zona Sul Urgente",
    url: null,
    state: "soon",
    sample: null,
  },
];

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, DELAY_MS));

export const localAdminSystems: AdminSystemsService = {
  async list() {
    await wait();
    return structuredClone(systems);
  },

  async get(slug) {
    await wait();
    const system = systems.find((item) => item.slug === slug);
    return system ? structuredClone(system) : null;
  },
};
