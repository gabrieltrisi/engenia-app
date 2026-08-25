import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

type KpiVariant = "blue" | "green" | "purple" | "yellow" | "red";

type KpiCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: KpiVariant;
  change?: number; // 🔥 NOVO
};

const variants = {
  blue: {
    border: "hover:border-blue-500/30",
    glow: "from-blue-600/10",
    icon: "bg-blue-600/10 text-blue-400 shadow-blue-500/20",
  },
  green: {
    border: "hover:border-green-500/30",
    glow: "from-green-600/10",
    icon: "bg-green-600/10 text-green-400 shadow-green-500/20",
  },
  purple: {
    border: "hover:border-purple-500/30",
    glow: "from-purple-600/10",
    icon: "bg-purple-600/10 text-purple-400 shadow-purple-500/20",
  },
  yellow: {
    border: "hover:border-yellow-500/30",
    glow: "from-yellow-600/10",
    icon: "bg-yellow-600/10 text-yellow-400 shadow-yellow-500/20",
  },
  red: {
    border: "hover:border-red-500/30",
    glow: "from-red-600/10",
    icon: "bg-red-600/10 text-red-400 shadow-red-500/20",
  },
};

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "blue",
  change,
}: KpiCardProps) {
  const color = variants[variant];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-300 hover:bg-white/[0.05] ${color.border}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {title}
          </p>

          <div className={`rounded-xl p-2 shadow-md ${color.icon}`}>
            <Icon size={20} />
          </div>
        </div>

        {/* Value */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{value}</h2>

          {change !== undefined && (
            <div
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${
                isPositive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
