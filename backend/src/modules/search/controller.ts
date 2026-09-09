import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { asyncHandler } from "../../utils/asyncHandler";

export const globalSearch = asyncHandler(async (req: Request, res: Response) => {
  const term = (req.query.q as string | undefined)?.trim();
  if (!term || term.length < 2) {
    res.json({ clients: [], instruments: [] });
    return;
  }

  const insensitive = { contains: term, mode: "insensitive" as const };

  const [clients, instruments] = await Promise.all([
    prisma.client.findMany({
      where: { deletedAt: null, OR: [{ companyName: insensitive }, { tradeName: insensitive }, { cnpj: insensitive }] },
      select: { id: true, companyName: true, tradeName: true },
      take: 5,
    }),
    prisma.instrument.findMany({
      where: { deletedAt: null, OR: [{ tag: insensitive }, { model: insensitive }, { serialNumber: insensitive }] },
      select: { id: true, type: true, model: true, serialNumber: true },
      take: 5,
    }),
  ]);

  res.json({ clients, instruments });
});
