import type { MaintenanceWorkOrder } from "../api/types";
import { rotuloDoTipo } from "./maintenanceLabels";
import { clientDisplayName, formatDateTime, formatCurrency } from "./format";

const PRIORITY_LABELS: Record<string, string> = { LOW: "Baixa", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Critica" };
const STATUS_LABELS: Record<string, string> = {
  OPEN: "Aberta",
  IN_TRIAGE: "Em triagem",
  PLANNED: "Planejada",
  PROGRAMMED: "Programada",
  RELEASED: "Liberada",
  IN_PROGRESS: "Em execucao",
  AWAITING_MATERIAL: "Aguardando material",
  AWAITING_RELEASE: "Aguardando liberacao",
  AWAITING_STOPPAGE: "Aguardando parada",
  COMPLETED: "Concluida",
  CANCELED: "Cancelada",
};
const RESULT_LABELS: Record<string, string> = { PENDING: "Pendente", OK: "OK", NOT_OK: "Nao OK", NA: "N/A" };
const HOUR_TYPE_LABELS: Record<string, string> = { NORMAL: "Normal", OVERTIME: "Extra", NIGHT: "Noturna" };

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function linha(rotulo: string, valor: string | null | undefined): string {
  if (!valor) return "";
  return `<div class="campo"><span class="rotulo">${rotulo}</span><span class="valor">${escapeHtml(valor)}</span></div>`;
}

/**
 * Abre a OS numa janela a parte, formatada pra impressao, e ja dispara o dialogo de
 * imprimir - o usuario escolhe uma impressora fisica ou "Salvar como PDF" no mesmo
 * dialogo do navegador, sem precisar de uma biblioteca de PDF no backend.
 */
export function imprimirOS(os: MaintenanceWorkOrder, logoUrl: string | null): void {
  const janela = window.open("", "_blank", "width=880,height=1000");
  if (!janela) return;

  const cliente = os.client ? clientDisplayName(os.client) : "";
  const ativo = os.instrument ? `${os.instrument.tag ?? os.instrument.type}${os.instrument.description ? ` - ${os.instrument.description}` : ""}` : "";

  const checklistHtml =
    os.checklist && os.checklist.length > 0
      ? `
    <h2>Checklist</h2>
    <table>
      <thead><tr><th>Item</th><th>Resultado</th><th>Observacoes</th></tr></thead>
      <tbody>
        ${os.checklist
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(
            (item) => `
          <tr>
            <td>${escapeHtml(item.description)}</td>
            <td>${RESULT_LABELS[item.result] ?? item.result}</td>
            <td>${item.notes ? escapeHtml(item.notes) : "-"}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
      : "";

  const pecasHtml =
    os.partsUsed && os.partsUsed.length > 0
      ? `
    <h2>Pecas utilizadas</h2>
    <table>
      <thead><tr><th>Peca</th><th>Quantidade</th><th>Custo unit.</th></tr></thead>
      <tbody>
        ${os.partsUsed
          .map(
            (p) => `
          <tr>
            <td>${escapeHtml(p.sparePart?.name ?? "-")}${p.sparePart?.code ? ` (${escapeHtml(p.sparePart.code)})` : ""}</td>
            <td>${p.quantity} ${p.sparePart?.unit ?? ""}</td>
            <td>${p.unitCost != null ? formatCurrency(p.unitCost) : "-"}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
      : "";

  const maoDeObraHtml =
    os.laborEntries && os.laborEntries.length > 0
      ? `
    <h2>Mao de obra</h2>
    <table>
      <thead><tr><th>Executante</th><th>Horas</th><th>Tipo</th></tr></thead>
      <tbody>
        ${os.laborEntries
          .map(
            (l) => `
          <tr>
            <td>${escapeHtml(l.laborResource?.name ?? "-")}</td>
            <td>${l.hours}h</td>
            <td>${l.hourType ? HOUR_TYPE_LABELS[l.hourType] ?? l.hourType : "-"}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
      : "";

  const tercerizadosHtml =
    os.thirdPartyServices && os.thirdPartyServices.length > 0
      ? `
    <h2>Servicos de terceiros</h2>
    <table>
      <thead><tr><th>Fornecedor</th><th>Descricao</th><th>Custo</th></tr></thead>
      <tbody>
        ${os.thirdPartyServices
          .map(
            (s) => `
          <tr>
            <td>${escapeHtml(s.supplierName)}</td>
            <td>${escapeHtml(s.description)}</td>
            <td>${formatCurrency(s.cost)}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>`
      : "";

  const observacoesHtml = [
    os.observations ? { titulo: "Observacoes", texto: os.observations } : null,
    os.executionNotes ? { titulo: "O que foi executado", texto: os.executionNotes } : null,
    os.closureNotes ? { titulo: "Encerramento", texto: os.closureNotes } : null,
  ]
    .filter((x): x is { titulo: string; texto: string } => !!x)
    .map((x) => `<h2>${x.titulo}</h2><p class="texto">${escapeHtml(x.texto)}</p>`)
    .join("");

  janela.document.write(`
    <html>
      <head>
        <title>OS ${escapeHtml(os.number)}</title>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #1a2332; padding: 32px; max-width: 780px; margin: 0 auto; }
          .cabecalho { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #0b1e3a; padding-bottom: 16px; margin-bottom: 20px; }
          .cabecalho img { max-height: 56px; max-width: 200px; object-fit: contain; }
          .titulo-os { text-align: right; }
          .titulo-os h1 { margin: 0; font-size: 20px; color: #0b1e3a; }
          .titulo-os p { margin: 2px 0 0; font-size: 12px; color: #6b7280; }
          .campos { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 20px; }
          .campo { display: flex; justify-content: space-between; border-bottom: 1px dotted #e5e7eb; padding: 4px 0; font-size: 13px; }
          .rotulo { color: #6b7280; font-weight: 500; }
          .valor { color: #1a2332; font-weight: 600; text-align: right; }
          h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.03em; color: #0b1e3a; border-bottom: 1px solid #0b1e3a; padding-bottom: 4px; margin: 22px 0 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
          th { text-align: left; background: #f3f4f6; padding: 6px 8px; font-weight: 600; }
          td { padding: 6px 8px; border-bottom: 1px solid #f0f0f0; }
          .texto { font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
          .assinaturas { display: flex; justify-content: space-between; margin-top: 60px; }
          .assinatura { width: 45%; text-align: center; }
          .assinatura .linha { border-top: 1px solid #1a2332; margin-bottom: 6px; }
          .assinatura span { font-size: 11px; color: #6b7280; }
          .rodape { margin-top: 40px; text-align: center; font-size: 10px; color: #9ca3af; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="cabecalho">
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" />` : `<div></div>`}
          <div class="titulo-os">
            <h1>Ordem de Manutencao</h1>
            <p>Numero ${escapeHtml(os.number)}</p>
          </div>
        </div>

        <div class="campos">
          ${linha("Cliente", cliente)}
          ${linha("Ativo", ativo)}
          ${linha("Tipo", rotuloDoTipo(os.type, os.correctiveType))}
          ${linha("Prioridade", PRIORITY_LABELS[os.priority] ?? os.priority)}
          ${linha("Status", STATUS_LABELS[os.status] ?? os.status)}
          ${linha("Tecnico responsavel", os.technician?.name)}
          ${linha("Agendada para", os.scheduledDate ? formatDateTime(os.scheduledDate) : null)}
          ${linha("Iniciada em", os.startedAt ? formatDateTime(os.startedAt) : null)}
          ${linha("Concluida em", os.completedAt ? formatDateTime(os.completedAt) : null)}
          ${linha("Centro de custo", os.costCenter?.name)}
        </div>

        <h2>Descricao do servico</h2>
        <p class="texto">${escapeHtml(os.title ? `${os.title}\n\n${os.description}` : os.description)}</p>

        ${checklistHtml}
        ${pecasHtml}
        ${maoDeObraHtml}
        ${tercerizadosHtml}
        ${observacoesHtml}

        <div class="assinaturas">
          <div class="assinatura">
            <div class="linha"></div>
            <span>Tecnico responsavel</span>
          </div>
          <div class="assinatura">
            <div class="linha"></div>
            <span>Cliente / Solicitante</span>
          </div>
        </div>

        <p class="rodape">Gerado pelo RLP Maintenance CMMS - ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>

        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  janela.document.close();
}
