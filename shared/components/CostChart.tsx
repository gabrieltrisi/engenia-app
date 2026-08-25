const data = [
  { month: "Jan", budget: 42, executed: 28 },
  { month: "Fev", budget: 55, executed: 38 },
  { month: "Mar", budget: 78, executed: 62 },
  { month: "Abr", budget: 92, executed: 75 },
  { month: "Mai", budget: 100, executed: 84 },
];

export function CostChart() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Custo vs Orçado</h2>
        <p className="text-sm text-zinc-500">
          Comparativo mensal entre orçamento previsto e custo executado
        </p>
      </div>

      <div className="flex h-64 items-end gap-5">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div className="flex h-48 items-end gap-2">
              <div
                className="w-5 rounded-t-lg bg-blue-500"
                style={{ height: `${item.budget}%` }}
              />
              <div
                className="w-5 rounded-t-lg bg-green-500"
                style={{ height: `${item.executed}%` }}
              />
            </div>

            <span className="text-xs text-zinc-500">{item.month}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-zinc-400">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Orçado
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Executado
        </span>
      </div>
    </div>
  );
}
