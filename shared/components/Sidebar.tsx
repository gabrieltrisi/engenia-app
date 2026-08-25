"use client";

import {
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const menu: MenuItem[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/projects", label: "Obras", icon: Building2 },
  { href: "/projects/new", label: "Novo Projeto", icon: PlusCircle },
  { href: "#", label: "Orcamentos", icon: ClipboardList },
  { href: "#", label: "Propostas", icon: FileText },
  { href: "#", label: "Financeiro", icon: Wallet },
  { href: "#", label: "Relatorios", icon: BarChart3 },
  { href: "#", label: "Documentos", icon: FolderOpen },
  { href: "#", label: "IA Insights", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return href !== "#" && pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-blue-500/10 bg-[#050b16] p-5 text-white">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <Home size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            Engen<span className="text-blue-400">IA</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Inteligencia para Construir Lucro
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menu.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-blue-600/20 text-blue-300 shadow-inner shadow-blue-500/10"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-6">
        <p className="mb-3 px-4 text-xs uppercase tracking-wider text-zinc-500">
          Configuracoes
        </p>

        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />
          Configuracoes
        </Link>
      </div>

      <div className="mt-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-zinc-500">Administrador</p>
          <p className="font-semibold text-white">Gabriel Trisi</p>
        </div>
      </div>
    </aside>
  );
}
