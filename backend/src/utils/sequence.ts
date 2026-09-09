import { prisma } from "../lib/prisma";

/**
 * Numeracao propria por cliente para as ordens de manutencao do CMMS ("OS-1", "OS-2"...) -
 * cada empresa comeca do 1, sem reiniciar por ano. Numeros podem se repetir entre clientes
 * diferentes (por isso a unicidade em MaintenanceWorkOrder e' [clientId, number], nao global);
 * o admin sempre ve o numero no contexto do cliente selecionado.
 */
export async function nextClientMaintenanceOrderNumber(clientId: string): Promise<string> {
  const counterKey = `maintenanceWorkOrder:${clientId}`;

  const counter = await prisma.counter.upsert({
    where: { key: counterKey },
    create: { key: counterKey, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `OS-${counter.value}`;
}

/** Mesmo padrao de numeracao por cliente da OS do CMMS, so que para Solicitacao de
 * Servico ("SS-1", "SS-2"...). */
export async function nextClientServiceRequestNumber(clientId: string): Promise<string> {
  const counterKey = `serviceRequest:${clientId}`;

  const counter = await prisma.counter.upsert({
    where: { key: counterKey },
    create: { key: counterKey, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `SS-${counter.value}`;
}

/** Codigo do plano de manutencao por cliente ("PM-0001", "PM-0002"...). Diferente da OS,
 * usa 4 digitos com zero a esquerda: plano e' cadastro estavel, aparece em documento e
 * fica mais legivel alinhado. */
export async function nextClientMaintenancePlanCode(clientId: string): Promise<string> {
  const counterKey = `maintenancePlan:${clientId}`;

  const counter = await prisma.counter.upsert({
    where: { key: counterKey },
    create: { key: counterKey, value: 1 },
    update: { value: { increment: 1 } },
  });

  return `PM-${String(counter.value).padStart(4, "0")}`;
}
