import type { Request, Response } from "express";
import type { MaintenanceOrderStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../utils/asyncHandler";
import { ForbiddenError } from "../../utils/errors";

const ORDENS_ABERTAS: MaintenanceOrderStatus[] = [
  "OPEN",
  "IN_TRIAGE",
  "PLANNED",
  "PROGRAMMED",
  "RELEASED",
  "IN_PROGRESS",
  "AWAITING_MATERIAL",
  "AWAITING_RELEASE",
  "AWAITING_STOPPAGE",
];

/** Visao geral da equipe interna (ADMIN/TECHNICIAN/COMMERCIAL): indicadores do CMMS
 * entre todos os clientes. Detalhe por cliente fica na tela de Manutencao
 * (getMaintenanceDashboard), esta e' so o resumo que abre no login. */
export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [activeClients, totalInstruments, openWorkOrders, lowStockSpareParts, recentWorkOrders] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.instrument.count({ where: { deletedAt: null } }),
    prisma.maintenanceWorkOrder.count({ where: { deletedAt: null, status: { in: ORDENS_ABERTAS } } }),
    // Prisma nao compara duas colunas da mesma linha em "where"; com o volume tipico de
    // pecas por empresa, filtrar em memoria e' suficiente.
    prisma.sparePart
      .findMany({
        where: { deletedAt: null, active: true },
        select: { id: true, name: true, code: true, stockQty: true, minStock: true, client: { select: { companyName: true, tradeName: true } } },
        orderBy: { stockQty: "asc" },
      })
      .then((pecas) => pecas.filter((p) => p.stockQty <= p.minStock).slice(0, 10)),
    prisma.maintenanceWorkOrder.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        number: true,
        type: true,
        status: true,
        scheduledDate: true,
        client: { select: { companyName: true, tradeName: true } },
        instrument: { select: { tag: true, description: true } },
      },
    }),
  ]);

  res.json({
    kpis: {
      activeClients,
      totalInstruments,
      openWorkOrders,
    },
    lowStockSpareParts,
    recentWorkOrders,
  });
});

/** Visao "administracao da plataforma" (Super Admin): distribuicao de clientes por plano
 * e clientes perto do limite do proprio plano. Sem MRR/faturamento - isso era metrica
 * comercial da OptiProcess, o CMMS RLP nao vende por integracao de cobranca. */
export const getPlatformDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const [plans, clientsWithPlan, totalActiveClients, clientsWithoutPlan] = await Promise.all([
    prisma.plan.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { clients: true } } } }),
    prisma.client.findMany({
      where: { deletedAt: null, planId: { not: null } },
      select: { id: true, companyName: true, tradeName: true, status: true, plan: { select: { name: true, maxUsers: true, maxInstruments: true } } },
    }),
    prisma.client.count({ where: { deletedAt: null, status: "ACTIVE" } }),
    prisma.client.count({ where: { deletedAt: null, planId: null } }),
  ]);

  const pct = (current: number, limit: number | null) => (limit == null ? null : Math.round((current / limit) * 100));

  const usageEntries = await Promise.all(
    clientsWithPlan.map(async (c) => {
      const [users, instruments] = await Promise.all([
        prisma.user.count({ where: { clientId: c.id, deletedAt: null } }),
        prisma.instrument.count({ where: { clientId: c.id, deletedAt: null } }),
      ]);
      const usersPct = pct(users, c.plan!.maxUsers);
      const instrumentsPct = pct(instruments, c.plan!.maxInstruments);
      return {
        clientId: c.id,
        name: c.tradeName || c.companyName,
        planName: c.plan!.name,
        users: { current: users, limit: c.plan!.maxUsers, pct: usersPct },
        instruments: { current: instruments, limit: c.plan!.maxInstruments, pct: instrumentsPct },
        worstPct: Math.max(usersPct ?? 0, instrumentsPct ?? 0),
      };
    }),
  );

  const nearLimitClients = usageEntries
    .filter((e) => e.worstPct >= 80)
    .sort((a, b) => b.worstPct - a.worstPct)
    .slice(0, 20);

  res.json({
    totalActiveClients,
    clientsWithoutPlan,
    plans: plans.map((p) => ({ id: p.id, name: p.name, active: p.active, clientCount: p._count.clients })),
    nearLimitClients,
  });
});

export const getClientDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (req.user?.role !== "CLIENT" || !req.user.clientId) throw new ForbiddenError();
  const clientId = req.user.clientId;
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [openWorkOrders, planosVencendo, pontosPendentes, recentWorkOrders] = await Promise.all([
    prisma.maintenanceWorkOrder.count({ where: { clientId, deletedAt: null, status: { in: ORDENS_ABERTAS } } }),
    prisma.maintenancePlan.count({
      where: { clientId, deletedAt: null, active: true, nextDueDate: { lte: in7Days } },
    }),
    prisma.lubricationPoint.count({ where: { clientId, deletedAt: null, active: true, nextDueAt: { lte: in7Days } } }),
    prisma.maintenanceWorkOrder.findMany({
      where: { clientId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, number: true, type: true, status: true, scheduledDate: true, instrument: { select: { tag: true, description: true } } },
    }),
  ]);

  res.json({
    openWorkOrders,
    planosVencendo,
    pontosPendentes,
    recentWorkOrders,
  });
});
