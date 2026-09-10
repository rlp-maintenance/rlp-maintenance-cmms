import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "navy" | "yellow" | "green" | "red";
  to?: string;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["tone"]>, string> = {
  navy: "bg-navy-50 text-navy-700",
  yellow: "bg-amber-50 text-safety-yellow-dark",
  green: "bg-green-50 text-safety-green-dark",
  red: "bg-red-50 text-safety-red",
};

export function StatCard({ label, value, icon: Icon, tone = "navy", to }: StatCardProps) {
  const content = (
    <div className="card flex items-center gap-4 p-5 transition-shadow hover:shadow-md">
      <div className={`rounded-lg p-3 ${TONE_CLASSES[tone]}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-900">{value}</p>
        <p className="text-sm text-graphite-500">{label}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

interface MiniStatProps {
  label: string;
  value: string | number;
  hint?: string;
  /** "red" destaca (atrasada, emergencial) - mesma cor em toda a familia de cards. */
  tone?: "default" | "red";
}

/** Irma pequena do StatCard: mesma tipografia e espacamento, sem icone obrigatorio -
 * usada em paineis com muitos indicadores (PCM, totais do periodo) onde um icone por
 * card so acrescentaria ruido. Existe para as duas nao parecerem duas familias
 * diferentes de card na mesma tela. */
export function MiniStat({ label, value, hint, tone = "default" }: MiniStatProps) {
  return (
    <div className={`card p-5 transition-shadow hover:shadow-md ${tone === "red" ? "border-safety-red/30 bg-red-50/40" : ""}`}>
      <p className="text-xs uppercase tracking-wide text-graphite-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone === "red" ? "text-safety-red" : "text-navy-900"}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-graphite-400">{hint}</p>}
    </div>
  );
}
