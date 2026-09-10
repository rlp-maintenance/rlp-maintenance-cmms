import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Wrench, Gauge, ClipboardList, ClipboardPlus, ShieldCheck, Activity, TimerReset, Boxes, GitBranch, Radar, HardHat, Kanban, BarChart3, Search, CalendarDays, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getMaintenanceDashboard, getMaintenanceBacklog } from "../../../api/maintenanceWorkOrders";
import type { BacklogGroupBy } from "../../../api/types";
import { EmptyState } from "../../../components/EmptyState";
import { PageHeader } from "../../../components/PageHeader";
import { listClients, getOwnClient } from "../../../api/clients";

import { StatCard, MiniStat } from "../../../components/StatCard";
import { FullPageSpinner } from "../../../components/Spinner";
import { clientDisplayName, formatKpi } from "../../../lib/format";
import { useCmms } from "../../../lib/cmms";

/** Um item da navegacao interna do hub - mesmo componente para as rotas do dia a dia
 * e as de analise, so muda o peso visual (`primary`). Antes eram 3 fileiras com 3
 * estilos diferentes (botao outline, botao outline de novo, link de texto solto) para
 * a mesma coisa: navegar para outra tela deste modulo. */
function NavPill({ to, icon: Icon, label, primary }: { to: string; icon: LucideIcon; label: string; primary?: boolean }) {
  return (
    <Link
      to={to}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-md border border-navy-200 bg-white px-3 py-2 text-sm font-medium text-navy-800 shadow-sm transition-colors hover:bg-navy-50"
          : "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-graphite-600 transition-colors hover:bg-gray-100 hover:text-navy-800"
      }
    >
      <Icon className={primary ? "h-4 w-4" : "h-3.5 w-3.5"} /> {label}
    </Link>
  );
}

/** Como o backlog aparece na tela para cada agrupamento. */
const ROTULO_AGRUPAMENTO: Record<BacklogGroupBy, string> = {
  plant: "Planta",
  area: "Area",
  instrument: "Ativo",
  costCenter: "Centro de custo",
};

export default function MaintenanceDashboard() {
  const [agrupamento, setAgrupamento] = useState<BacklogGroupBy>("plant");
  const { isClient, base, assetsBase, partsBase, laborBase } = useCmms();
  const [clientId, setClientId] = useState("");

  const { data: clients } = useQuery({
    queryKey: ["clients-picker-cmms"],
    queryFn: () => listClients({ pageSize: 200, service: "CMMS_MAINTENANCE" }),
    enabled: !isClient,
  });
  // Marca do topo do painel: a da propria empresa, quando ela tem uma cadastrada - o logo
  // pequeno da barra lateral do portal continua sendo sempre o do produto, so este aqui
  // (o grande, de boas-vindas) e' que vira a marca do cliente.
  const { data: ownClient } = useQuery({
    queryKey: ["own-client"],
    queryFn: getOwnClient,
    enabled: isClient,
    staleTime: 300_000,
  });
  const logoDoCliente = isClient ? ownClient?.logoUrl : (clients?.items ?? []).find((c) => c.id === clientId)?.logoUrl;
  const { data, isLoading } = useQuery({
    queryKey: ["maintenance-dashboard", clientId],
    queryFn: () => getMaintenanceDashboard({ clientId: clientId || undefined }),
  });

  const { data: backlog } = useQuery({
    queryKey: ["manutencao-backlog", clientId, agrupamento],
    queryFn: () => getMaintenanceBacklog({ clientId: clientId || undefined, groupBy: agrupamento }),
  });

  return (
    <div>
      <PageHeader
        title="Manutencao"
        description="Ciclo completo de manutencao - planos preventivos, ordens, pecas e indicadores (ultimos 90 dias)"
        actions={
          logoDoCliente && (
            <img src={logoDoCliente} alt="Logo da empresa" className="h-10 w-auto max-w-[9rem] object-contain" />
          )
        }
      />

      {!isClient && (
        <div className="mb-4">
          <select className="input sm:w-72" value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Todos os clientes</option>
            {(clients?.items ?? []).map((c) => (
              <option key={c.id} value={c.id}>{clientDisplayName(c)}</option>
            ))}
          </select>
        </div>
      )}

      {/* Navegacao do modulo, num unico peso visual - antes eram tres fileiras com tres
          estilos diferentes (botao, botao de novo, link solto) pra mesma coisa: trocar de
          tela dentro do CMMS. Operacional primeiro (o que se usa toda hora), analise depois. */}
      <div className="mb-6 space-y-2 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <NavPill primary to={`${base}/solicitacoes${clientId ? `?clientId=${clientId}` : ""}`} icon={ClipboardPlus} label="Solicitacoes" />
          <NavPill primary to={`${base}/ordens${clientId ? `?clientId=${clientId}` : ""}`} icon={ClipboardList} label="Ordens" />
          <NavPill primary to={`${base}/programacao`} icon={CalendarDays} label="Programacao" />
          <NavPill primary to={`${base}/kanban${clientId ? `?clientId=${clientId}` : ""}`} icon={Kanban} label="Kanban" />
          <NavPill primary to={`${base}/planos${clientId ? `?clientId=${clientId}` : ""}`} icon={ShieldCheck} label="Planos preventivos" />
          <NavPill primary to={`${assetsBase}?scope=cmms${clientId ? `&clientId=${clientId}` : ""}`} icon={Gauge} label="Ativos" />
          <NavPill primary to={`${partsBase}${!isClient && clientId ? `?clientId=${clientId}` : ""}`} icon={Boxes} label="Almoxarifado" />
          <NavPill primary to={`${assetsBase}/cadastros`} icon={SlidersHorizontal} label="Cadastros" />
        </div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 border-t border-gray-200 pt-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-graphite-400">Analises</span>
          <NavPill to={`${base}/pareto${clientId ? `?clientId=${clientId}` : ""}`} icon={BarChart3} label="Pareto de falhas" />
          <NavPill to={`${base}/rca${clientId ? `?clientId=${clientId}` : ""}`} icon={Search} label="RCA / 5 Porques" />
          <NavPill to={`${base}/arvore${clientId ? `?clientId=${clientId}` : ""}`} icon={GitBranch} label="Arvore de ativos" />
          <NavPill to={`${base}/preditiva${clientId ? `?clientId=${clientId}` : ""}`} icon={Radar} label="Manutencao preditiva" />
          <NavPill to={`${laborBase}${!isClient && clientId ? `?clientId=${clientId}` : ""}`} icon={HardHat} label="Mao de obra" />
        </div>
      </div>

      {isLoading || !data ? (
        <FullPageSpinner />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="MTTR (horas)" value={formatKpi(data.kpis.mttrHours)} icon={TimerReset} tone="navy" />
            <StatCard label="MTBF (horas)" value={formatKpi(data.kpis.mtbfHours)} icon={Activity} tone="navy" />
            <StatCard label="Disponibilidade" value={formatKpi(data.kpis.availabilityPct, "%")} icon={Gauge} tone="green" />
            <StatCard label="Cumprimento do plano" value={formatKpi(data.kpis.planComplianceRatePct, "%")} icon={Wrench} tone="yellow" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MiniStat label="Ordens abertas" value={data.totals.open} />
            <MiniStat label="Em andamento" value={data.totals.inProgress} />
            <MiniStat label="Concluidas (periodo)" value={data.totals.completed} />
            <MiniStat label="Preventivas (periodo)" value={data.totals.preventive} />
            <MiniStat label="Corretivas (periodo)" value={data.totals.corrective} />
            <MiniStat
              label="Preditivas (periodo)"
              value={data.totals.predictive}
              hint={data.totals.predictive > 0 ? `${data.totals.predictiveAutoOpened} abertas sozinhas por medidor` : undefined}
            />
            <MiniStat label="Total de OS (periodo)" value={data.totals.workOrders} />
          </div>

          <h2 className="mb-3 mt-8 font-semibold text-navy-900">PCM - planejamento e controle</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat
              label="Backlog"
              value={`${data.pcm.backlogHours}h`}
              hint={data.pcm.openWithoutEstimate > 0 ? `${data.pcm.openWithoutEstimate} OS em aberto sem HH prevista (fora da conta)` : undefined}
            />
            <MiniStat label="Atrasadas" value={data.pcm.overdue} tone={data.pcm.overdue > 0 ? "red" : "default"} />
            <MiniStat label="Emergenciais (criticas, em aberto)" value={data.pcm.emergency} tone={data.pcm.emergency > 0 ? "red" : "default"} />
            <MiniStat
              label="Aderencia a programacao"
              value={data.pcm.scheduleAdherencePct != null ? `${data.pcm.scheduleAdherencePct}%` : "Dados insuficientes"}
              hint={data.pcm.scheduleAdherencePct != null ? `${data.pcm.scheduledCompletedCount} OS programadas concluidas no periodo` : undefined}
            />
            <MiniStat label="Aguardando material" value={data.pcm.awaitingMaterial} />
            <MiniStat label="Aguardando liberacao" value={data.pcm.awaitingRelease} />
            <MiniStat label="Aguardando parada" value={data.pcm.awaitingStoppage} />
            <MiniStat label="HH prevista x realizada (concluidas)" value={`${data.pcm.plannedHoursCompleted}h / ${data.pcm.actualHoursCompleted}h`} />
          </div>

          {/* Backlog aberto: o total sozinho nao diz onde esta a fila. Aqui da pra ver que
              a HH pendente esta concentrada numa area (ou num ativo) so. */}
          <div className="mt-8">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-navy-900">Backlog por {ROTULO_AGRUPAMENTO[agrupamento].toLowerCase()}</h2>
                <p className="text-xs text-graphite-500">HH pendente das OS em aberto, do maior para o menor.</p>
              </div>
              <select
                className="input w-auto"
                value={agrupamento}
                onChange={(e) => setAgrupamento(e.target.value as BacklogGroupBy)}
              >
                <option value="plant">Geral da planta</option>
                <option value="area">Por area</option>
                <option value="instrument">Por ativo</option>
                <option value="costCenter">Por centro de custo</option>
              </select>
            </div>

            {!backlog || backlog.itens.length === 0 ? (
              <EmptyState title="Nenhuma OS em aberto" description="Sem fila pendente, nao ha backlog a distribuir." />
            ) : (
              <>
                {backlog.totais.coberturaPct != null && backlog.totais.coberturaPct < 100 && (
                  <p className="mb-2 text-xs text-safety-yellow-dark">
                    {backlog.totais.semEstimativa} das {backlog.totais.ordens} OS em aberto estao sem HH prevista
                    ({backlog.totais.coberturaPct}% da fila entra na conta de horas) - o backlog real e' maior que o numero abaixo.
                  </p>
                )}
                <div className="card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-graphite-500">
                      <tr>
                        <th className="px-4 py-2.5">{ROTULO_AGRUPAMENTO[agrupamento]}</th>
                        <th className="px-4 py-2.5 text-right">Backlog (h)</th>
                        <th className="px-4 py-2.5 text-right">OS abertas</th>
                        <th className="px-4 py-2.5 text-right">Sem HH</th>
                        <th className="px-4 py-2.5 text-right">Atrasadas</th>
                        <th className="px-4 py-2.5 text-right">Emergenciais</th>
                        <th className="px-4 py-2.5">Corretiva / Preventiva</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {backlog.itens.map((i) => {
                        const maior = backlog.itens[0].horas || 1;
                        return (
                          <tr key={i.id}>
                            <td className="px-4 py-2.5">
                              <p className="font-medium text-navy-900">{i.nome}</p>
                              <div className="mt-1 h-1.5 w-32 rounded-full bg-gray-100">
                                <div className="h-1.5 rounded-full bg-navy-600" style={{ width: `${Math.max(3, (i.horas / maior) * 100)}%` }} />
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-right font-semibold text-navy-900">{i.horas}h</td>
                            <td className="px-4 py-2.5 text-right text-graphite-700">{i.ordens}</td>
                            <td className="px-4 py-2.5 text-right">
                              {i.semEstimativa > 0 ? <span className="text-safety-yellow-dark">{i.semEstimativa}</span> : <span className="text-graphite-400">-</span>}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              {i.atrasadas > 0 ? <span className="font-medium text-safety-red">{i.atrasadas}</span> : <span className="text-graphite-400">-</span>}
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              {i.emergenciais > 0 ? <span className="font-medium text-safety-red">{i.emergenciais}</span> : <span className="text-graphite-400">-</span>}
                            </td>
                            <td className="px-4 py-2.5 text-graphite-600">{i.corretivas} / {i.preventivas}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
