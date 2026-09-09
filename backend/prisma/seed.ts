/* eslint-disable no-console */
import { PrismaClient, Role, ClientStatus, ServiceCategory, InstrumentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateTemporaryPassword } from "../src/lib/password";
import { env } from "../src/config/env";

const prisma = new PrismaClient();

// Em producao nunca cria contas de demonstracao com senha fixa e previsivel
// (o codigo deste projeto e publico). Cada conta de demo ganha uma senha
// aleatoria, impressa uma unica vez ao final do seed.
const demoCredentials: { email: string; password: string }[] = [];

async function demoPasswordHashFor(email: string): Promise<string> {
  const password = env.isProduction ? generateTemporaryPassword() : "Demo@12345";
  if (env.isProduction) demoCredentials.push({ email, password });
  return bcrypt.hash(password, 12);
}

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function seedRolesAndPermissions() {
  const permissionDefs = [
    { key: "clients.manage", label: "Gerenciar clientes", module: "Clientes" },
    { key: "clients.view", label: "Visualizar clientes", module: "Clientes" },
    { key: "instruments.manage", label: "Gerenciar ativos", module: "Ativos" },
    { key: "maintenance.manage", label: "Gerenciar planos e ordens de manutencao", module: "Manutencao" },
    { key: "users.manage", label: "Gerenciar usuarios e permissoes", module: "Administracao" },
    { key: "audit.view", label: "Visualizar trilha de auditoria", module: "Administracao" },
    { key: "portal.own_data", label: "Acessar apenas os proprios dados", module: "Portal do cliente" },
  ];

  for (const p of permissionDefs) {
    await prisma.permission.upsert({ where: { key: p.key }, create: p, update: p });
  }

  const roleDefs: { key: Role; label: string; description: string; permissionKeys: string[] }[] = [
    {
      key: "ADMIN",
      label: "Administrador",
      description: "Acesso completo ao sistema: usuarios, configuracoes, clientes, ativos e manutencao.",
      permissionKeys: permissionDefs.map((p) => p.key),
    },
    {
      key: "TECHNICIAN",
      label: "Tecnico",
      description: "Cadastra e atualiza ativos e manutencao. Sem acesso a usuarios ou configuracoes.",
      permissionKeys: ["clients.view", "instruments.manage", "maintenance.manage"],
    },
    {
      key: "COMMERCIAL",
      label: "Comercial",
      description: "Gerencia o cadastro de clientes.",
      permissionKeys: ["clients.manage"],
    },
    {
      key: "CLIENT",
      label: "Cliente",
      description: "Acessa apenas a propria empresa: ativos, planos e ordens de manutencao, almoxarifado e lubrificacao.",
      permissionKeys: ["portal.own_data"],
    },
  ];

  for (const r of roleDefs) {
    const role = await prisma.roleDefinition.upsert({
      where: { key: r.key },
      create: { key: r.key, label: r.label, description: r.description },
      update: { label: r.label, description: r.description },
    });
    for (const permKey of r.permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }
}

async function seedUsers() {
  const admin = await prisma.user.upsert({
    where: { email: process.env.INITIAL_ADMIN_EMAIL?.toLowerCase() ?? "admin@optiprocess.com.br" },
    create: {
      name: process.env.INITIAL_ADMIN_NAME ?? "Administrador OptiProcess",
      email: (process.env.INITIAL_ADMIN_EMAIL ?? "admin@optiprocess.com.br").toLowerCase(),
      passwordHash: process.env.INITIAL_ADMIN_PASSWORD
        ? await bcrypt.hash(process.env.INITIAL_ADMIN_PASSWORD, 12)
        : await demoPasswordHashFor("admin@optiprocess.com.br"),
      role: "ADMIN",
    },
    update: {},
  });

  return { admin };
}

interface SeedClientDef {
  companyName: string;
  tradeName: string | undefined;
  cnpj: string;
  stateRegistration: string | undefined;
  addressStreet: string | undefined;
  addressNumber: string | undefined;
  addressDistrict: string | undefined;
  addressCity: string | undefined;
  addressState: string | undefined;
  addressZip: string | undefined;
  phone: string | undefined;
  whatsapp: string | undefined;
  email: string | undefined;
  technicalContactName: string | undefined;
  commercialContactName: string | undefined;
  status: ClientStatus;
  contractedServices: ServiceCategory[];
  loginEmail: string | undefined;
}

async function seedClients() {
  const clientsData: SeedClientDef[] = [
    {
      companyName: "Metalurgica Vale do Sorocaba Ltda",
      tradeName: "Metalvale",
      cnpj: "12.345.678/0001-90",
      stateRegistration: "123.456.789.112",
      addressStreet: "Av. Independencia",
      addressNumber: "1500",
      addressDistrict: "Jardim Santa Rosalia",
      addressCity: "Sorocaba",
      addressState: "SP",
      addressZip: "18087-120",
      phone: "(15) 3222-1010",
      whatsapp: "5515988887777",
      email: "manutencao@metalvale.com.br",
      technicalContactName: "Eng. Paulo Henrique",
      commercialContactName: "Fernanda Lima",
      status: ClientStatus.ACTIVE,
      contractedServices: [ServiceCategory.CMMS_MAINTENANCE],
      loginEmail: "portal@metalvale.com.br",
    },
    {
      companyName: "Laticinios Campo Verde S.A.",
      tradeName: "Campo Verde",
      cnpj: "23.456.789/0001-01",
      stateRegistration: "234.567.891.113",
      addressStreet: "Rod. Raposo Tavares, km 98",
      addressNumber: "s/n",
      addressDistrict: "Distrito Industrial",
      addressCity: "Votorantim",
      addressState: "SP",
      addressZip: "18110-000",
      phone: "(15) 3344-2020",
      whatsapp: "5515988886666",
      email: "engenharia@campoverde.com.br",
      technicalContactName: "Eng. Camila Rocha",
      commercialContactName: "Bruno Alves",
      status: ClientStatus.ACTIVE,
      contractedServices: [ServiceCategory.CMMS_MAINTENANCE],
      loginEmail: "portal@campoverde.com.br",
    },
    {
      companyName: "Plasticos Sorocaba Industrial Ltda",
      tradeName: "Plastisoc",
      cnpj: "34.567.891/0001-12",
      stateRegistration: "345.678.912.114",
      addressStreet: "Rua das Industrias",
      addressNumber: "780",
      addressDistrict: "Eden",
      addressCity: "Sorocaba",
      addressState: "SP",
      addressZip: "18103-330",
      phone: "(15) 3255-3030",
      whatsapp: "5515988885555",
      email: "manutencao@plastisoc.com.br",
      technicalContactName: "Ricardo Nogueira",
      commercialContactName: "Juliana Prado",
      status: ClientStatus.ACTIVE,
      contractedServices: [ServiceCategory.CMMS_MAINTENANCE],
      loginEmail: "portal@plastisoc.com.br",
    },
    {
      companyName: "AutoPecas Rodovia SP Comercio Ltda",
      tradeName: "AutoPecas Rodovia",
      cnpj: "45.678.912/0001-23",
      stateRegistration: undefined,
      addressStreet: undefined,
      addressNumber: undefined,
      addressDistrict: undefined,
      addressCity: "Itu",
      addressState: "SP",
      addressZip: undefined,
      phone: "(11) 4022-4040",
      whatsapp: undefined,
      email: "contato@autopecasrodovia.com.br",
      technicalContactName: undefined,
      commercialContactName: undefined,
      status: ClientStatus.PROSPECT,
      contractedServices: [ServiceCategory.CMMS_MAINTENANCE],
      loginEmail: undefined,
    },
    {
      companyName: "Textil Itavema Confeccoes Ltda",
      tradeName: "Itavema Textil",
      cnpj: "56.789.123/0001-34",
      stateRegistration: undefined,
      addressStreet: undefined,
      addressNumber: undefined,
      addressDistrict: undefined,
      addressCity: "Sorocaba",
      addressState: "SP",
      addressZip: undefined,
      phone: "(15) 3266-5050",
      whatsapp: undefined,
      email: "financeiro@itavematextil.com.br",
      technicalContactName: undefined,
      commercialContactName: undefined,
      status: ClientStatus.INACTIVE,
      contractedServices: [],
      loginEmail: undefined,
    },
  ];

  const clients = [];
  for (const c of clientsData) {
    const { loginEmail, ...clientFields } = c;
    const client = await prisma.client.upsert({
      where: { cnpj: c.cnpj },
      create: clientFields,
      update: {},
    });
    clients.push(client);

    if (loginEmail) {
      await prisma.user.upsert({
        where: { email: loginEmail },
        create: {
          name: c.commercialContactName ?? c.tradeName ?? c.companyName,
          email: loginEmail,
          passwordHash: await demoPasswordHashFor(loginEmail),
          role: "CLIENT",
          clientId: client.id,
        },
        update: { clientId: client.id },
      });
    }

    const existingContact = await prisma.clientContact.findFirst({ where: { clientId: client.id, isPrimary: true } });
    if (!existingContact) {
      await prisma.clientContact.create({
        data: {
          clientId: client.id,
          name: c.technicalContactName ?? c.commercialContactName ?? "Contato principal",
          role: c.technicalContactName ? "Responsavel tecnico" : "Responsavel comercial",
          email: c.email,
          phone: c.phone,
          isPrimary: true,
        },
      });
    }
  }

  return clients;
}

async function seedInstruments(clients: Awaited<ReturnType<typeof seedClients>>) {
  const instrumentDefs = [
    { client: clients[0], type: "Termometro industrial", tag: "TI-001", manufacturer: "Gefran", model: "600", serialNumber: "GF60012345", unit: "°C", months: 12, lastCal: -60 },
    { client: clients[0], type: "Transmissor de pressao", tag: "PT-014", manufacturer: "Gefran", model: "KX1", serialNumber: "GFKX198877", unit: "bar", months: 12, lastCal: -340 },
    { client: clients[1], type: "Termometro de processo", tag: "TE-102", manufacturer: "WEG", model: "TH200", serialNumber: "WEG20211", unit: "°C", months: 6, lastCal: -170 },
    { client: clients[1], type: "Cronometro industrial", tag: "CR-007", manufacturer: "Extech", model: "CT30", serialNumber: "EXT300099", unit: "s", months: 12, lastCal: -20 },
    { client: clients[2], type: "Manometro digital", tag: "MN-055", manufacturer: "Gefran", model: "MD30", serialNumber: "GFMD305566", unit: "bar", months: 12, lastCal: -370 },
    { client: clients[2], type: "Termopar tipo K", tag: "TP-009", manufacturer: "Siemens", model: "TK-9", serialNumber: "SIE900123", unit: "°C", months: 12, lastCal: -10 },
  ];

  const instruments = [];
  for (const def of instrumentDefs) {
    const lastCalibrationDate = daysFromNow(def.lastCal);
    const nextDueDate = new Date(lastCalibrationDate);
    nextDueDate.setMonth(nextDueDate.getMonth() + def.months);

    const status: InstrumentStatus =
      nextDueDate < new Date() ? "EXPIRED" : nextDueDate < daysFromNow(30) ? "DUE_SOON" : "VALID";

    const instrument = await prisma.instrument.create({
      data: {
        clientId: def.client.id,
        type: def.type,
        tag: def.tag,
        manufacturer: def.manufacturer,
        model: def.model,
        serialNumber: def.serialNumber,
        unit: def.unit,
        calibrationFrequencyMonths: def.months,
        lastCalibrationDate,
        nextDueDate,
        status,
      },
    });
    instruments.push(instrument);
  }
  return instruments;
}

async function main() {
  console.log("Iniciando seed...");
  await seedRolesAndPermissions();
  await seedUsers();
  const clients = await seedClients();
  await seedInstruments(clients);
  console.log("Seed concluido com sucesso.");

  if (demoCredentials.length > 0) {
    console.log("\nSenhas de demonstracao geradas (producao) - anote agora, nao serao mostradas de novo:");
    for (const cred of demoCredentials) {
      console.log(`  ${cred.email}  ->  ${cred.password}`);
    }
    console.log("");
  }
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
