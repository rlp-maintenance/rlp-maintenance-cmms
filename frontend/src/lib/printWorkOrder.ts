import type { MaintenanceWorkOrder } from "../api/types";
import { rotuloDoTipo } from "./maintenanceLabels";
import { clientDisplayName, formatDateTime, formatCurrency } from "./format";

const PRIORITY_LABELS: Record<string, string> = { LOW: "Baixa", MEDIUM: "Media", HIGH: "Alta", CRITICAL: "Critica" };
const PRIORITY_COLORS: Record<string, string> = { LOW: "#6b7280", MEDIUM: "#0b1e3a", HIGH: "#b45309", CRITICAL: "#b91c1c" };

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
const STATUS_COLORS: Record<string, string> = {
  OPEN: "#0b1e3a",
  IN_TRIAGE: "#b45309",
  PLANNED: "#0b1e3a",
  PROGRAMMED: "#0b1e3a",
  RELEASED: "#1d4ed8",
  IN_PROGRESS: "#b45309",
  AWAITING_MATERIAL: "#b45309",
  AWAITING_RELEASE: "#b45309",
  AWAITING_STOPPAGE: "#b45309",
  COMPLETED: "#15803d",
  CANCELED: "#6b7280",
};

const RESULT_LABELS: Record<string, string> = { PENDING: "Pendente", OK: "OK", NOT_OK: "Nao OK", NA: "N/A" };
const RESULT_COLORS: Record<string, string> = { PENDING: "#b45309", OK: "#15803d", NOT_OK: "#b91c1c", NA: "#6b7280" };
const HOUR_TYPE_LABELS: Record<string, string> = { NORMAL: "Normal", OVERTIME: "Extra", NIGHT: "Noturna" };

// Verde-limao da marca (mesmo tom do logo e do site) - usado como acento em vez de cor
// solida, pra nao competir com o navy do cabecalho.
const LIME = "#c8e600";
const NAVY = "#0b1e3a";

// Design "outline": linhas finas e texto colorido em vez de fundo solido - o mesmo visual
// moderno (cores da marca, cartoes, pilulas), mas sem chapar a folha de tinta em quem
// imprime fisicamente. Cor solida vira excecao (so a linha de destaque, bem fina), nunca
// area grande.
const ESTILO = `
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: -apple-system, "Segoe UI", system-ui, sans-serif; color: #1a2332; margin: 0; background: #f3f4f7; }
  .pagina { max-width: 820px; margin: 0 auto; padding: 28px; }
  .os { background: #fff; border: 1px solid #e2e5ec; border-radius: 12px; overflow: hidden; margin-bottom: 28px; }
  .os + .os { page-break-before: always; }

  .cabecalho { padding: 22px 28px 18px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 2px solid ${NAVY}; position: relative; }
  .cabecalho::after { content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 3px; background: ${LIME}; }
  .marca { display: flex; align-items: center; gap: 14px; }
  .marca .logo-caixa { border: 1px solid #e2e5ec; border-radius: 8px; padding: 5px; display: flex; align-items: center; justify-content: center; }
  .marca img { display: block; max-height: 40px; max-width: 150px; object-fit: contain; }
  .titulo-os { text-align: right; }
  .titulo-os .eyebrow { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #7a8296; }
  .titulo-os h1 { margin: 3px 0 4px; font-size: 21px; font-weight: 800; color: ${NAVY}; }
  .titulo-os p { margin: 0; font-size: 12px; color: #7a8296; }

  .faixa-status { display: flex; gap: 8px; padding: 13px 28px; border-bottom: 1px solid #eceff4; flex-wrap: wrap; }
  .pill { display: inline-flex; align-items: center; gap: 5px; border: 1.3px solid currentColor; border-radius: 999px; padding: 3px 11px; font-size: 11.5px; font-weight: 700; }
  .pill::before { content: ""; width: 6px; height: 6px; border-radius: 999px; background: currentColor; }

  .corpo { padding: 24px 28px 28px; }

  .grade-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
  .info-item { border: 1px solid #eceff4; border-left: 2.5px solid ${NAVY}; border-radius: 6px; padding: 9px 12px; }
  .info-item .rotulo { display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #8b95a7; margin-bottom: 3px; }
  .info-item .valor { display: block; font-size: 13.5px; font-weight: 600; color: #1a2332; }

  .secao { margin-bottom: 24px; }
  .secao-titulo { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: ${NAVY}; margin-bottom: 9px; }
  .secao-titulo::before { content: ""; width: 4px; height: 13px; background: ${LIME}; border-radius: 2px; }

  .descricao-caixa { border-left: 2.5px solid ${NAVY}; padding: 4px 0 4px 16px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #2c3646; }

  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  thead th { text-align: left; color: ${NAVY}; padding: 8px 10px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1.5px solid ${NAVY}; }
  tbody td { padding: 8px 10px; border-bottom: 1px solid #eceff4; }
  tbody tr:last-child td { border-bottom: none; }

  .texto { font-size: 13px; line-height: 1.6; white-space: pre-wrap; color: #2c3646; }

  .assinaturas { display: flex; justify-content: space-between; gap: 24px; margin-top: 40px; padding-top: 4px; }
  .assinatura { flex: 1; text-align: center; }
  .assinatura .linha { border-top: 1.5px solid #c7cedb; margin-bottom: 8px; }
  .assinatura span { font-size: 11px; font-weight: 600; color: #6b7280; }

  .rodape { text-align: center; padding: 16px 0 4px; font-size: 10px; color: #9aa3b4; }
  .rodape b { color: #6b7280; }

  @media print {
    body { background: #fff; }
    .pagina { padding: 0; }
    .os { border: none; border-radius: 0; margin-bottom: 0; }
    .os + .os { margin-top: 0; }
  }
`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pill(texto: string, cor: string): string {
  return `<span class="pill" style="color:${cor}">${escapeHtml(texto)}</span>`;
}

function infoItem(rotulo: string, valor: string | null | undefined): string {
  if (!valor) return "";
  return `<div class="info-item"><span class="rotulo">${rotulo}</span><span class="valor">${escapeHtml(valor)}</span></div>`;
}

/** O conteudo de UMA OS, sem o involucro <html> - reaproveitado tanto na impressao de uma
 * so quanto na de varias seguidas (uma por pagina). */
function renderOsBlock(os: MaintenanceWorkOrder, logoUrl: string | null): string {
  const cliente = os.client ? clientDisplayName(os.client) : "";
  const ativo = os.instrument ? `${os.instrument.tag ?? os.instrument.type}${os.instrument.description ? ` - ${os.instrument.description}` : ""}` : "";

  const checklistHtml =
    os.checklist && os.checklist.length > 0
      ? `
    <div class="secao">
      <div class="secao-titulo">Checklist</div>
      <table>
        <thead><tr><th>Item</th><th>Resultado</th><th>Observacoes</th></tr></thead>
        <tbody>
          ${os.checklist
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map(
              (item) => `
            <tr>
              <td>${escapeHtml(item.description)}</td>
              <td>${pill(RESULT_LABELS[item.result] ?? item.result, RESULT_COLORS[item.result] ?? "#6b7280")}</td>
              <td>${item.notes ? escapeHtml(item.notes) : "-"}</td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>`
      : "";

  const pecasHtml =
    os.partsUsed && os.partsUsed.length > 0
      ? `
    <div class="secao">
      <div class="secao-titulo">Pecas utilizadas</div>
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
      </table>
    </div>`
      : "";

  const maoDeObraHtml =
    os.laborEntries && os.laborEntries.length > 0
      ? `
    <div class="secao">
      <div class="secao-titulo">Mao de obra</div>
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
      </table>
    </div>`
      : "";

  const tercerizadosHtml =
    os.thirdPartyServices && os.thirdPartyServices.length > 0
      ? `
    <div class="secao">
      <div class="secao-titulo">Servicos de terceiros</div>
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
      </table>
    </div>`
      : "";

  const observacoesHtml = [
    os.observations ? { titulo: "Observacoes", texto: os.observations } : null,
    os.executionNotes ? { titulo: "O que foi executado", texto: os.executionNotes } : null,
    os.closureNotes ? { titulo: "Encerramento", texto: os.closureNotes } : null,
  ]
    .filter((x): x is { titulo: string; texto: string } => !!x)
    .map((x) => `<div class="secao"><div class="secao-titulo">${x.titulo}</div><p class="texto">${escapeHtml(x.texto)}</p></div>`)
    .join("");

  return `
    <div class="os">
      <div class="cabecalho">
        <div class="marca">
          ${logoUrl ? `<div class="logo-caixa"><img src="${logoUrl}" alt="Logo" /></div>` : ""}
        </div>
        <div class="titulo-os">
          <div class="eyebrow">RLP Maintenance CMMS</div>
          <h1>Ordem de Manutencao</h1>
          <p>Numero ${escapeHtml(os.number)}</p>
        </div>
      </div>

      <div class="faixa-status">
        ${pill(STATUS_LABELS[os.status] ?? os.status, STATUS_COLORS[os.status] ?? "#6b7280")}
        ${pill(rotuloDoTipo(os.type, os.correctiveType), NAVY)}
        ${pill(`Prioridade: ${PRIORITY_LABELS[os.priority] ?? os.priority}`, PRIORITY_COLORS[os.priority] ?? "#6b7280")}
      </div>

      <div class="corpo">
        <div class="grade-info">
          ${infoItem("Cliente", cliente)}
          ${infoItem("Ativo", ativo)}
          ${infoItem("Tecnico responsavel", os.technician?.name)}
          ${infoItem("Agendada para", os.scheduledDate ? formatDateTime(os.scheduledDate) : null)}
          ${infoItem("Iniciada em", os.startedAt ? formatDateTime(os.startedAt) : null)}
          ${infoItem("Concluida em", os.completedAt ? formatDateTime(os.completedAt) : null)}
          ${infoItem("Centro de custo", os.costCenter?.name)}
        </div>

        <div class="secao">
          <div class="secao-titulo">Descricao do servico</div>
          <div class="descricao-caixa">${escapeHtml(os.title ? `${os.title}\n\n${os.description}` : os.description)}</div>
        </div>

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
      </div>
    </div>`;
}

/**
 * Imprime SEM abrir janela nova nem aba nova - um iframe escondido, anexado a propria
 * pagina, recebe o documento e dispara o print() dele.
 *
 * A versao anterior usava window.open(): funciona em desktop, mas no Safari do iPhone
 * (e em vários Android) fica na mao do usuario ter "Bloquear pop-ups" desligado nas
 * configuracoes do navegador - e quando esta ligado (o padrao de fabrica), a janela nem
 * chega a abrir, sem erro nenhum, como se o botao nao tivesse feito nada. Um iframe nao e'
 * uma janela nova: nenhum bloqueador de pop-up entra em acao, e window.print() dentro dele
 * abre a mesma folha de impressao nativa (imprimir ou "Salvar em PDF").
 */
function imprimirDocumento(titulo: string, corpoHtml: string): void {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  function limpar() {
    window.removeEventListener("afterprint", limpar);
    if (iframe.parentNode) document.body.removeChild(iframe);
  }

  const doc = iframe.contentDocument;
  if (!doc) {
    limpar();
    return;
  }

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>${escapeHtml(titulo)}</title>
        <meta charset="utf-8" />
        <style>${ESTILO}</style>
      </head>
      <body>
        <div class="pagina">
          ${corpoHtml}
          <p class="rodape"><b>RLP Maintenance CMMS</b> - documento gerado em ${escapeHtml(formatDateTime(new Date().toISOString()))}</p>
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Rede de seguranca: se o afterprint nunca disparar (usuario cancela de um jeito que o
  // navegador nao avisa), o iframe some sozinho depois de um tempo, em vez de ficar preso
  // na pagina pra sempre.
  window.addEventListener("afterprint", limpar);
  setTimeout(limpar, 120_000);

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      limpar();
    }
  };
}

/**
 * Formata a OS pra impressao e dispara o dialogo nativo - o usuario escolhe uma impressora
 * fisica ou "Salvar como PDF" no mesmo dialogo, sem precisar de biblioteca de PDF no
 * backend nem de abrir janela/aba nova (ver imprimirDocumento).
 */
export function imprimirOS(os: MaintenanceWorkOrder, logoUrl: string | null): void {
  imprimirDocumento(`OS ${os.number}`, renderOsBlock(os, logoUrl));
}

/** Mesma coisa, para varias OS de uma vez - uma por pagina, um dialogo de impressao so. */
export function imprimirVariasOS(ordens: MaintenanceWorkOrder[], logoUrl: string | null): void {
  const corpo = ordens.map((os) => renderOsBlock(os, logoUrl)).join("");
  const titulo = ordens.length === 1 ? `OS ${ordens[0].number}` : `${ordens.length} ordens de manutencao`;
  imprimirDocumento(titulo, corpo);
}
