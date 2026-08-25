import { AlertTriangle, Bot, Info, Lightbulb } from "lucide-react";

type Insight = {
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  value?: string;
};

const styles = {
  danger: {
    icon: AlertTriangle,
    card: "border-red-500/20 bg-red-500/5",
    iconBox: "bg-red-500/10 text-red-400",
    badge: "bg-red-500/10 text-red-400",
  },
  warning: {
    icon: Lightbulb,
    card: "border-yellow-500/20 bg-yellow-500/5",
    iconBox: "bg-yellow-500/10 text-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-400",
  },
  info: {
    icon: Info,
    card: "border-blue-500/20 bg-blue-500/5",
    iconBox: "bg-blue-500/10 text-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
  },
};

export function AIInsights({ insights }: { insights: Insight[] }) {
  return (
    <section className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
          <Bot size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">Insights da IA</h2>
          <p className="text-sm text-zinc-400">
            Análise inteligente baseada nos projetos cadastrados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {insights.map((insight, index) => {
          const style = styles[insight.type];
          const Icon = style.icon;

          return (
            <div key={index} className={`rounded-2xl border p-4 ${style.card}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className={`rounded-xl p-2 ${style.iconBox}`}>
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      {insight.description}
                    </p>
                  </div>
                </div>

                {insight.value && (
                  <span
                    className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${style.badge}`}
                  >
                    {insight.value}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {insights.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nenhum insight disponível no momento.
          </p>
        )}
      </div>
    </section>
  );
}
