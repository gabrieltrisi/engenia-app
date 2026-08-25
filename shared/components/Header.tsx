import { Bell, Building2, CalendarDays, ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#050b16]/95 px-8 py-5 backdrop-blur">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400">Visão geral da sua empresa</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/[0.06] md:flex">
          <CalendarDays size={18} />
          01/05/2024 - 31/05/2024
          <ChevronDown size={16} />
        </button>

        <button className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-zinc-200 transition hover:bg-white/[0.06]">
          <Bell size={18} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            4
          </span>
        </button>

        <button className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-200 transition hover:bg-white/[0.06]">
          <Building2 size={18} />
          Construtora Exemplo
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}
