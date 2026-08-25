type StatusBadgeProps = {
  status: string;
};

const statusMap: Record<string, string> = {
  RISK: "bg-red-500/10 text-red-400 border-red-500/20",
  ACTIVE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DONE: "bg-green-500/10 text-green-400 border-green-500/20",
};

const labelMap: Record<string, string> = {
  RISK: "Em risco",
  ACTIVE: "Ativa",
  DONE: "Concluída",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    statusMap[status] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

  const label = labelMap[status] ?? status;

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}
