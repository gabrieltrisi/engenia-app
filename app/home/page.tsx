import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  ClipboardList,
  FileText,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

type HomeProject = {
  id: string;
  name: string;
  budget: number;
  client?: {
    name: string;
  } | null;
  company?: {
    name: string;
  } | null;
};

type HomeAlert = {
  message: string;
};

type HomeInsight = {
  title: string;
  description: string;
  value?: string;
};

type HomeDashboardData = {
  projects: HomeProject[];
  aiInsights: HomeInsight[];
  alerts: HomeAlert[];
  projectsCount: number;
  activeProjects: number;
  riskProjects: number;
  revenue: number;
};

const actions = [
  {
    title: "Projetos",
    subtitle: "Gerenciar obras",
    href: "/projects",
    icon: Building2,
    color: "from-blue-500 to-blue-700",
  },
  {
    title: "Clientes",
    subtitle: "Gerenciar clientes",
    href: "/clients",
    icon: Users,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Novo Projeto",
    subtitle: "Criar obra",
    href: "/projects/new",
    icon: PlusCircle,
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    title: "Novo Cliente",
    subtitle: "Cadastrar",
    href: "/clients/new",
    icon: PlusCircle,
    color: "from-orange-500 to-amber-600",
  },
  {
    title: "Alertas",
    subtitle: "Riscos críticos",
    href: "/dashboard",
    icon: AlertTriangle,
    color: "from-red-500 to-rose-600",
  },
  {
    title: "IA Insights",
    subtitle: "Análise inteligente",
    href: "/dashboard",
    icon: Bot,
    color: "from-violet-500 to-purple-700",
  },
  {
    title: "Orçamentos",
    subtitle: "Gerenciar custos",
    href: "/budgets",
    icon: ClipboardList,
    color: "from-yellow-500 to-orange-600",
  },
  {
    title: "Propostas",
    subtitle: "Em breve",
    href: "#",
    icon: FileText,
    color: "from-pink-500 to-rose-600",
  },
];

export default async function HomePage() {
  let data: HomeDashboardData = {
    projects: [],
    aiInsights: [],
    alerts: [],
    projectsCount: 0,
    activeProjects: 0,
    riskProjects: 0,
    revenue: 0,
  };

  try {
    data = (await getDashboardData()) as HomeDashboardData;
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }

  const mainInsight = data.aiInsights?.[0] ?? null;
  const recentProjects = (data.projects ?? []).slice(0, 3);
  const recentAlerts = (data.alerts ?? []).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#07111f] p-8 shadow-2xl shadow-blue-950/20">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              <Sparkles size={14} />
              EngenIA OS
            </div>

            <h1 className="text-4xl font-bold text-white">Olá, Gabriel 👋</h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Controle obras, clientes, riscos e orçamentos em uma central
              executiva inteligente.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Abrir Dashboard
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniCard title="Projetos" value={data.projectsCount} />
        <MiniCard title="Ativos" value={data.activeProjects} />
        <MiniCard title="Em risco" value={data.riskProjects} danger />
        <MiniCard
          title="Receita"
          value={`R$ ${Number(data.revenue).toLocaleString("pt-BR")}`}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Acesso rápido</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {actions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-blue-500/40"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                >
                  <Icon size={20} className="text-white" />
                </div>

                <h3 className="font-semibold text-white group-hover:text-blue-300">
                  {item.title}
                </h3>

                <p className="text-sm text-zinc-500">{item.subtitle}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-white">Obras recentes</h2>

          <div className="space-y-3">
            {recentProjects.map((project: HomeProject) => (
              <div
                key={project.id}
                className="flex justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div>
                  <p className="font-medium text-white">{project.name}</p>

                  <p className="text-sm text-zinc-500">
                    {project.client?.name ?? "Sem cliente"} •{" "}
                    {project.company?.name ?? "Sem empresa"}
                  </p>
                </div>

                <p className="font-semibold text-blue-300">
                  R$ {Number(project.budget || 0).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma obra cadastrada.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">IA EngenIA</h2>

          {mainInsight ? (
            <div className="rounded-xl bg-black/20 p-4">
              <p className="font-semibold text-white">{mainInsight.title}</p>

              <p className="mt-2 text-sm text-zinc-400">
                {mainInsight.description}
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Nenhum insight disponível.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <h2 className="mb-4 text-lg font-bold text-white">Alertas recentes</h2>

        <div className="grid gap-3 md:grid-cols-3">
          {recentAlerts.map((alert: HomeAlert, index: number) => (
            <div
              key={index}
              className="rounded-xl bg-black/20 p-4 text-sm text-zinc-300"
            >
              {alert.message}
            </div>
          ))}

          {recentAlerts.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhum alerta no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function MiniCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: number | string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm text-zinc-500">{title}</p>

      <p
        className={`mt-2 text-2xl font-bold ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
