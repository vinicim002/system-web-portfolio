import type { MonitoredSystem } from "@/types/admin";
import { localAdminSystems } from "./systems.local";

// Contrato da central de sistemas (specs/001-admin-telas/contracts/servicos.md)
export interface AdminSystemsService {
  list(): Promise<MonitoredSystem[]>;
  get(slug: string): Promise<MonitoredSystem | null>;
}

// Nesta entrega: dados de exemplo locais; as fontes reais são a especificação 002
export const adminSystems: AdminSystemsService = localAdminSystems;
