import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  BarChart3,
  BookOpenText,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  FileText,
  Landmark,
  PackageSearch,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";

const moduleGroups = [
  {
    title: "Operacao",
    description: "Controle da execucao das obras no dia a dia",
    modules: [
      {
        title: "Obras",
        description: "Gerencie obras, status, clientes e orcamento.",
        href: "/projects",
        icon: Building2,
        accent: "blue",
      },
      {
        title: "Diario de Obras",
        description: "Registre atividades, equipes, fotos e ocorrencias.",
        href: "/daily-reports",
        icon: BookOpenText,
        accent: "cyan",
        soon: true,
      },
      {
        title: "Medicao de Obras",
        description: "Acompanhe avanco fisico e medicoes executadas.",
        href: "/measurements",
        icon: ClipboardCheck,
        accent: "violet",
        soon: true,
      },
      {
        title: "Medicao de Contratos",
        description: "Controle medicoes vinculadas a contratos.",
        href: "/contract-measurements",
        icon: FileText,
        accent: "blue",
        soon: true,
      },
    ],
  },
  {
    title: "Financeiro",
    description: "Orcamentos, compras, estoque e fluxo financeiro",
    modules: [
      {
        title: "Financeiro",
        description: "Acompanhe receitas, custos, margem e caixa.",
        href: "/financial",
        icon: Landmark,
        accent: "cyan",
        soon: true,
      },
      {
        title: "Compras",
        description: "Solicitacoes, cotacoes, pedidos e fornecedores.",
        href: "/purchases",
        icon: ShoppingCart,
        accent: "violet",
        soon: true,
      },
      {
        title: "Estoque",
        description: "Controle materiais, entradas, saidas e saldos.",
        href: "/stock",
        icon: Boxes,
        accent: "blue",
        soon: true,
      },
      {
        title: "Orcamentos",
        description: "Monte e acompanhe orcamentos por obra.",
        href: "/budgets",
        icon: ClipboardList,
        accent: "cyan",
        soon: true,
      },
    ],
  },
  {
    title: "Gestao",
    description: "Organizacao comercial, clientes e relacionamento",
    modules: [
      {
        title: "Empresas",
        description: "Gerencie empresas e dashboards individuais.",
        href: "/companies",
        icon: BriefcaseBusiness,
        accent: "blue",
      },
      {
        title: "Clientes",
        description: "Cadastre e acompanhe clientes vinculados.",
        href: "/clients",
        icon: Users,
        accent: "violet",
      },
      {
        title: "Portal do Cliente",
        description: "Area do cliente para acompanhar evolucao da obra.",
        href: "/client-portal",
        icon: AppWindow,
        accent: "cyan",
        soon: true,
      },
      {
        title: "Aplicativo",
        description: "Operacao mobile para equipe de campo.",
        href: "/app",
        icon: PackageSearch,
        accent: "blue",
        soon: true,
      },
    ],
  },
  {
    title: "Inteligencia",
    description: "Decisao executiva, relatorios, BI e IA",
    modules: [
      {
        title: "Dashboard",
        description: "Visao geral da operacao com indicadores.",
        href: "/dashboard",
        icon: BarChart3,
        accent: "blue",
      },
      {
        title: "Relatorios",
        description: "Relatorios gerenciais e operacionais.",
        href: "/reports",
        icon: FileBarChart,
        accent: "violet",
        soon: true,
      },
      {
        title: "BI & Analise de Dados",
        description: "Analises avancadas, previsoes e insights da IA.",
        href: "/dashboard",
        icon: Sparkles,
        accent: "cyan",
      },
    ],
  },
];

const accentClasses = {
  blue: "from-blue-500 to-blue-700 text-blue-100 shadow-blue-600/20",
  cyan: "from-cyan-500 to-blue-700 text-cyan-100 shadow-cyan-600/20",
  violet: "from-violet-500 to-blue-700 text-violet-100 shadow-violet-600/20",
};

export default function ModulesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">
              Bem-vindo à central EngenIA
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Olá, Gabriel Trisi 👋
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              Escolha um módulo para iniciar sua operação ou acesse o dashboard
              para visualizar indicadores, riscos, orçamento e insights da IA.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="group flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Ir para Dashboard
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <MiniCard label="Obras monitoradas" value="24" />
          <MiniCard label="Módulos disponíveis" value="15+" />
          <MiniCard label="IA & BI" value="Ativo" />
        </div>
      </section>

      {moduleGroups.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{group.title}</h2>
            <p className="text-sm text-zinc-500">{group.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {group.modules.map((module) => {
              const Icon = module.icon;
              const accent =
                accentClasses[module.accent as keyof typeof accentClasses];

              return (
                <Link
                  key={module.title}
                  href={module.href}
                  className="group relative min-h-56 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.06]"
                >
                  <div
                    className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-0 blur-2xl transition group-hover:opacity-30`}
                  />

                  <div
                    className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>

                  <div className="relative flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-white group-hover:text-blue-300">
                      {module.title}
                    </h3>

                    {module.soon && (
                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400">
                        Em breve
                      </span>
                    )}
                  </div>

                  <p className="relative mt-2 text-sm leading-6 text-zinc-500">
                    {module.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
