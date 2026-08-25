type ProjectSummaryProps = {
  total: number;
  risk: number;
  active: number;
  done: number;
};

export function ProjectSummary({
  total,
  risk,
  active,
  done,
}: ProjectSummaryProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-500">Total de projetos</p>
        <h3 className="mt-2 text-2xl font-bold text-white">{total}</h3>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-500">Projetos ativos</p>
        <h3 className="mt-2 text-2xl font-bold text-blue-400">{active}</h3>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-500">Projetos em risco</p>
        <h3 className="mt-2 text-2xl font-bold text-red-400">{risk}</h3>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm text-zinc-500">Projetos concluidos</p>
        <h3 className="mt-2 text-2xl font-bold text-cyan-300">{done}</h3>
      </div>
    </section>
  );
}
