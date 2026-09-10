import { Link } from "react-router-dom";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  GitBranch,
  ShieldCheck,
  Radar,
  Droplets,
  ListChecks,
  Users,
  CheckCircle2,
  TimerReset,
  Activity,
  Gauge,
  Wrench,
  FileSpreadsheet,
  MessageCircle,
} from "lucide-react";
import { buildWhatsAppLink } from "../../lib/publicContact";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Árvore de ativos",
    description:
      "Cadastre plantas, áreas e máquinas com estrutura pai/filho - cada componente é um ativo completo, com ficha técnica própria por tipo (motor, redutor, extrusora...).",
  },
  {
    icon: ShieldCheck,
    title: "Planos preventivos",
    description:
      "Por tempo ou por leitura de medidor, atribuídos a um ou vários ativos de uma vez. As ordens de serviço nascem sozinhas quando o plano vence.",
  },
  {
    icon: ClipboardList,
    title: "Ordens de manutenção",
    description:
      "Kanban, quadro de programação e planejamento por prioridade e centro de custo. Checklist, anexos e apontamento de mão de obra em cada ordem.",
  },
  {
    icon: Radar,
    title: "Manutenção preditiva",
    description:
      "Medidores de condição com zonas de severidade disparam ordens automaticamente antes da quebra acontecer.",
  },
  {
    icon: Boxes,
    title: "Almoxarifado técnico",
    description:
      "Estoque de peças por empresa, lista de materiais por ativo (BOM), reserva automática e alerta de estoque baixo antes que falte peça na hora da OS.",
  },
  {
    icon: Droplets,
    title: "Lubrificação",
    description:
      "Pontos de lubrificação, rotas por área e previsão de consumo - do lubrificante certo, na quantidade certa, no ativo certo.",
  },
  {
    icon: ListChecks,
    title: "Falhas e causa raiz",
    description:
      "Códigos de falha padronizados, análise de Pareto e RCA para parar de resolver o mesmo problema todo mês.",
  },
  {
    icon: Users,
    title: "Portal do cliente",
    description:
      "Cada empresa acessa só o próprio parque, com perfis por função: administrador, planejador, técnico e solicitante.",
  },
];

const PASSOS = [
  {
    numero: "01",
    titulo: "Cadastre o parque",
    descricao: "Ativos, plantas, áreas e centros de custo - a estrutura real da sua fábrica, do jeito que ela já é organizada.",
  },
  {
    numero: "02",
    titulo: "Monte os planos",
    descricao: "Defina a periodicidade de cada plano preventivo e vincule aos ativos - um plano pode cobrir vários de uma vez.",
  },
  {
    numero: "03",
    titulo: "Deixe rodar sozinho",
    descricao: "O sistema gera a ordem de serviço na hora certa. Sua equipe só recebe o que precisa ser feito, quando precisa.",
  },
  {
    numero: "04",
    titulo: "Acompanhe os números",
    descricao: "MTTR, MTBF, disponibilidade e cumprimento do plano calculados automaticamente, sem planilha nenhuma.",
  },
];

const INDICADORES = [
  { icon: TimerReset, label: "MTTR", descricao: "Tempo médio para reparar uma falha" },
  { icon: Activity, label: "MTBF", descricao: "Tempo médio entre falhas do mesmo ativo" },
  { icon: Gauge, label: "Disponibilidade", descricao: "Quanto tempo o ativo ficou operando" },
  { icon: Wrench, label: "Cumprimento do plano", descricao: "Quantas ordens preventivas saíram no prazo" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,180,0,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(15,157,88,0.12),transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-safety-yellow/30 bg-safety-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-safety-yellow">
              Software de manutenção industrial
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Manutenção organizada, sem depender de planilha e WhatsApp
            </h1>
            <p className="mt-5 max-w-xl text-lg text-navy-200">
              O RLP Maintenance CMMS reúne ativos, planos preventivos, ordens de serviço e almoxarifado num só
              lugar - a ordem certa chega na mão certa, na hora certa, sem ninguém precisar lembrar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Falar com a equipe <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#funcionalidades" className="btn text-sm text-white ring-1 ring-inset ring-white/20 hover:bg-white/10">
                Ver funcionalidades
              </a>
            </div>
          </div>

          {/* Mockup ilustrativo do painel - representacao, nao print exato da tela */}
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-navy-900/80 p-5 shadow-2xl backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Painel do CMMS</p>
                <span className="rounded-full bg-safety-green/15 px-2 py-0.5 text-[10px] font-semibold text-safety-green">
                  ● Ao vivo
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {INDICADORES.map((k) => (
                  <div key={k.label} className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <k.icon className="h-4 w-4 text-safety-yellow" />
                    <p className="mt-2 text-lg font-bold text-white">
                      {k.label === "Disponibilidade" ? "96%" : k.label === "Cumprimento do plano" ? "91%" : k.label === "MTTR" ? "2,4h" : "312h"}
                    </p>
                    <p className="text-[11px] text-navy-300">{k.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-300">Ordens recentes</p>
                <ul className="space-y-2 text-xs text-navy-100">
                  <li className="flex items-center justify-between">
                    <span>OS-482 · Troca de rolamento</span>
                    <span className="rounded-full bg-safety-yellow/20 px-2 py-0.5 text-safety-yellow">Em execução</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>OS-481 · Inspeção mensal</span>
                    <span className="rounded-full bg-safety-green/20 px-2 py-0.5 text-safety-green">Concluída</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>OS-480 · Lubrificação de rota</span>
                    <span className="rounded-full bg-navy-500/30 px-2 py-0.5 text-navy-200">Programada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dor / proposta */}
      <section className="border-b border-gray-100 bg-graphite-50/60 py-10">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg font-medium text-graphite-700">
            Planilha desatualiza, WhatsApp perde histórico e ninguém sabe se a preventiva do mês saiu.
            <span className="text-navy-800"> O CMMS resolve isso automaticamente.</span>
          </p>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">Tudo que a sua manutenção precisa</h2>
          <p className="mt-4 text-graphite-500">
            Um sistema só, do cadastro do ativo até o relatório de indicador - sem planilha paralela.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50">
                <f.icon className="h-5 w-5 text-navy-700" />
              </div>
              <h3 className="mt-4 font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm text-graphite-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="bg-navy-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Como funciona</h2>
            <p className="mt-4 text-navy-300">Quatro passos para tirar a manutenção da planilha.</p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((p) => (
              <div key={p.numero}>
                <span className="text-4xl font-extrabold text-safety-yellow/40">{p.numero}</span>
                <h3 className="mt-2 font-semibold text-white">{p.titulo}</h3>
                <p className="mt-2 text-sm text-navy-300">{p.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Indicadores */}
      <section id="indicadores" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">Indicadores que a sua fábrica precisa</h2>
            <p className="mt-4 text-graphite-500">
              MTTR, MTBF, disponibilidade e cumprimento de plano são calculados sozinhos, a partir das ordens que a
              sua equipe já executa no dia a dia - sem planilha extra para alimentar.
            </p>
            <ul className="mt-6 space-y-3">
              {["Calculado automaticamente a cada ordem concluída", "Filtro por cliente, ativo e período", "Base para decidir onde investir manutenção"].map(
                (item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-graphite-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safety-green" /> {item}
                  </li>
                ),
              )}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {INDICADORES.map((k) => (
              <div key={k.label} className="card p-5">
                <k.icon className="h-5 w-5 text-navy-700" />
                <p className="mt-3 font-semibold text-navy-900">{k.label}</p>
                <p className="mt-1 text-xs text-graphite-500">{k.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Importacao de dados */}
      <section className="border-t border-gray-100 bg-graphite-50/60 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <FileSpreadsheet className="h-8 w-8 text-navy-700" />
          <h2 className="text-2xl font-bold text-navy-900">Já tem uma planilha de ativos? Importe em minutos.</h2>
          <p className="max-w-2xl text-graphite-500">
            Suba a planilha do seu parque atual e comece a usar o CMMS sem precisar recadastrar tudo do zero.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-navy-950 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Pronto para organizar a manutenção da sua fábrica?</h2>
          <p className="max-w-xl text-navy-300">
            Fale com a equipe da RLP Maintenance e veja o CMMS funcionando com o parque da sua empresa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={buildWhatsAppLink("Ola! Quero conhecer o RLP Maintenance CMMS.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
            </a>
            <Link to="/entrar" className="btn text-sm text-white ring-1 ring-inset ring-white/20 hover:bg-white/10">
              Já sou cliente - Entrar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
