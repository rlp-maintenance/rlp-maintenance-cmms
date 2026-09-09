import { api } from "./client";
import type { MaintenanceWorkOrder, ClientRef } from "./types";

export interface AdminDashboard {
  kpis: {
    activeClients: number;
    totalInstruments: number;
    openWorkOrders: number;
  };
  lowStockSpareParts: { id: string; name: string; code: string | null; stockQty: number; minStock: number; client: ClientRef }[];
  recentWorkOrders: MaintenanceWorkOrder[];
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get<AdminDashboard>("/dashboard/admin");
  return data;
}

export interface ClientDashboard {
  openWorkOrders: number;
  planosVencendo: number;
  pontosPendentes: number;
  recentWorkOrders: MaintenanceWorkOrder[];
}

export async function getClientDashboard(): Promise<ClientDashboard> {
  const { data } = await api.get<ClientDashboard>("/dashboard/client");
  return data;
}

export interface PlatformDashboard {
  totalActiveClients: number;
  clientsWithoutPlan: number;
  plans: { id: string; name: string; active: boolean; clientCount: number }[];
  nearLimitClients: {
    clientId: string;
    name: string;
    planName: string;
    users: { current: number; limit: number | null; pct: number | null };
    instruments: { current: number; limit: number | null; pct: number | null };
    worstPct: number;
  }[];
}

export async function getPlatformDashboard(): Promise<PlatformDashboard> {
  const { data } = await api.get<PlatformDashboard>("/dashboard/platform");
  return data;
}
