import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import { DeleteProjectButton } from "@/shared/components/DeleteProjectButton";
import { EditProjectButton } from "@/shared/components/EditProjectButton";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  PlusCircle,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  client?: {
    name: string;
  } | null;
  company?: {
    name: string;
  } | null;
};

type DashboardData = {
  projects: Project[];
  projectsCount: number;
  activeProjects: number;
  riskProjects: number;
  revenue: number;
};

export default async function ProjectsPage() {
  const data = (await getDashboardData()) as DashboardData;

  const projects = data.projects ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">Gestão de obras</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Projetos</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Gerencie obras, orçamento, clientes e status operacional.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <PlusCircle size={18} />
          Novo Projeto
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard
          title="Total"
          value={data.projectsCount}
          icon={Building2}
        />

        <SummaryCard
          title="Ativos"
          value={data.activeProjects}
          icon={CheckCircle2}
        />

        <SummaryCard
          title="Em risco"
          value={data.riskProjects}
          icon={AlertTriangle}
          danger
        />

        <SummaryCard
          title="Receita"
          value={`R$ ${Number(data.revenue || 0).toLocaleString("pt-BR")}`}
          icon={Wallet}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Todas as obras</h2>
            <p className="text-sm text-zinc-500">
              Lista completa dos projetos cadastrados
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-zinc-400">
              <tr>
                <th className="px-4 py-4">Obra</th>
                <th className="px-4 py-4">Cliente</th>
                <th className="px-4 py-4">Empresa</th>
                <th className="px-4 py-4">Orçamento</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {projects.map((project: Project) => (
                <tr
                  key={project.id}
                  className="text-zinc-300 transition hover:bg-white/[0.035]"
                >
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{project.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      ID: {project.id.slice(0, 8)}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {project.client?.name ?? "Sem cliente"}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {project.company?.name ?? "Sem empresa"}
                  </td>

                  <td className="px-4 py-4 font-medium text-blue-300">
                    R$ {Number(project.budget || 0).toLocaleString("pt-BR")}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={project.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <EditProjectButton projectId={project.id} />
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Nenhum projeto cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  danger,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>

        <div
          className={`rounded-xl p-2 ${
            danger
              ? "bg-red-500/10 text-red-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>

      <p
        className={`text-2xl font-bold ${
          danger ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
