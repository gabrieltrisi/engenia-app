"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bot, Building2, Grid3X3, PlusCircle } from "lucide-react";
import { Logo } from "@/shared/components/Logo";

const mainMenu = [
  { label: "Modulos", href: "/modules", icon: Grid3X3 },
  { label: "BI & IA", href: "/dashboard", icon: Bot },
];

export function Topbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#050b16]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/modules" className="flex min-w-0 items-center gap-3">
          <Logo variant="navbar" />
        </Link>

        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/[0.03] p-1">
          {mainMenu.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm transition sm:px-4 ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/projects/new"
            className="hidden items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 lg:flex"
          >
            <PlusCircle size={14} />
            Nova Obra
          </Link>

          <Link
            href="/companies/new"
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white xl:flex"
          >
            <Building2 size={14} />
            Empresa
          </Link>

          <button
            className="relative rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            aria-label="Notificacoes"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-blue-500" />
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5 sm:px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              G
            </div>

            <span className="hidden text-sm text-white md:block">Gabriel</span>
          </div>
        </div>
      </div>

      <div className="hidden items-center border-t border-white/5 px-6 py-2 text-xs text-zinc-500 sm:flex">
        <span>Central de modulos da EngenIA</span>
        <span className="ml-auto">Ultima atualizacao: agora</span>
      </div>
    </header>
  );
}
