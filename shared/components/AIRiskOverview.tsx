import { AlertTriangle, Bot, Clock, ShieldCheck } from "lucide-react";

type ProjectAnalysis = {
  id: string;
  name: string;
  riskScore: number;
  riskLabel: string;
  type: "danger" | "warning" | "info";
  reasons: string[];
  recommendations: string[];
  daysRemaining?: number | null;
  daysOverdue?: number;
  consumedTimePercent?: number | null;
};

type AISummary = {
  totalProjects: number;
  averageRiskScore: number;
  operationStatus: string;
  overdueProjects?: number;
  closeDeadlineProjects?: number;
  criticalProjects?: number;
  warningProjects?: number;
};

type AIRiskOverviewProps = {
  summary: AISummary;
  projectAnalyses: ProjectAnalysis[];
};

const styles = {
  danger: {
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
    bar: "bg-red-500",
  },
  warning: {
    badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    bar: "bg-yellow-500",
  },
  info: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bar: "bg-blue-500",
  },
};

export function AIRiskOverview({
  summary,
  projectAnalyses,
}: AIRiskOverviewProps) {
  const topRisks = projectAnalyses.slice(0, 5);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
            <Bot size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Inteligência de Risco da IA
            </h2>
            <p className="text-sm text-zinc-500">
              Análise preditiva da operação
            </p>
          </div>
        </div>

        <span
          className={`rounded-full border px-4 py-1 text-xs font-semibold ${
            summary.operationStatus === "Crítica"
              ? styles.danger.badge
              : summary.operationStatus === "Atenção"
                ? styles.warning.badge
                : styles.info.badge
          }`}
        >
          {summary.operationStatus}
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          title="Score médio"
          value={`${summary.averageRiskScore}/100`}
          icon={Bot}
          danger={summary.averageRiskScore >= 70}
          warning={
            summary.averageRiskScore >= 40 && summary.averageRiskScore < 70
          }
        />

        <MetricCard
          title="Atrasadas"
          value={summary.overdueProjects ?? 0}
          icon={AlertTriangle}
          danger={(summary.overdueProjects ?? 0) > 0}
        />

        <MetricCard
          title="Prazo próximo"
          value={summary.closeDeadlineProjects ?? 0}
          icon={Clock}
          warning={(summary.closeDeadlineProjects ?? 0) > 0}
        />

        <MetricCard
          title="Críticas"
          value={summary.criticalProjects ?? 0}
          icon={ShieldCheck}
          danger={(summary.criticalProjects ?? 0) > 0}
        />
      </div>

      {/* LISTA */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Top risco das obras
        </h3>

        <div className="space-y-3">
          {topRisks.map((project) => {
            const style = styles[project.type];

            return (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:border-white/20 transition"
              >
                {/* HEADER */}
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{project.name}</p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {project.reasons.length > 0
                        ? project.reasons.join(", ")
                        : "Sem fatores críticos"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    {project.riskScore}/100
                  </span>
                </div>

                {/* BARRA */}
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full ${style.bar} transition-all`}
                    style={{ width: `${project.riskScore}%` }}
                  />
                </div>

                {/* INFO EXTRA */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  {project.daysOverdue ? (
                    <span className="text-red-400">
                      {project.daysOverdue} dias atrasado
                    </span>
                  ) : null}

                  {project.daysRemaining !== null &&
                  project.daysRemaining !== undefined ? (
                    <span>{project.daysRemaining} dias restantes</span>
                  ) : null}

                  {project.consumedTimePercent ? (
                    <span>{project.consumedTimePercent}% prazo usado</span>
                  ) : null}
                </div>

                {/* RECOMENDAÇÃO */}
                {project.recommendations.length > 0 && (
                  <p className="mt-2 text-sm text-zinc-400">
                    💡 {project.recommendations[0]}
                  </p>
                )}
              </div>
            );
          })}

          {topRisks.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhuma análise disponível ainda.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  danger,
  warning,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  danger?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>

        <div
          className={`rounded-xl p-2 ${
            danger
              ? "bg-red-500/10 text-red-400"
              : warning
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-blue-500/10 text-blue-400"
          }`}
        >
          <Icon size={17} />
        </div>
      </div>

      <p
        className={`text-xl font-bold ${
          danger ? "text-red-400" : warning ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
