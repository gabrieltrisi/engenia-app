import { Bot, CheckCircle2, Sparkles } from "lucide-react";

type Props = {
  executiveSummary?: string;
  recommendedActions?: string[];
  aiProvider?: string;
};

export function AIExecutivePanel({
  executiveSummary,
  recommendedActions = [],
  aiProvider,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -bottom-20 left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
            <Bot size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">IA Executiva</h2>
            <p className="text-sm text-zinc-500">
              Análise estratégica automática da EngenIA
            </p>
          </div>
        </div>

        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
          {aiProvider === "gemini" ? "Gemini ativo" : "Fallback"}
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="mb-3 flex items-center gap-2 text-blue-300">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">Resumo executivo</span>
        </div>

        <p className="text-sm leading-7 text-zinc-300">
          {executiveSummary || "Sem análise disponível ainda."}
        </p>
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-sm font-semibold text-zinc-400">
          Ações recomendadas
        </h3>

        <div className="grid gap-3">
          {recommendedActions.length > 0 ? (
            recommendedActions.map((action, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <CheckCircle2 size={18} className="text-blue-300" />
                <p className="text-sm text-zinc-300">{action}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-500">
              Nenhuma recomendação disponível.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
