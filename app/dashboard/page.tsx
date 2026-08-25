import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";

import { AIExecutivePanel } from "@/shared/components/AIExecutivePanel";
import { AIInsights } from "@/shared/components/AIInsights";
import { AIRiskOverview } from "@/shared/components/AIRiskOverview";
import { AlertsPanel } from "@/shared/components/AlertsPanel";
import { BudgetFilter } from "@/shared/components/BudgetFilter";
import { ClearFiltersButton } from "@/shared/components/ClearFiltersButton";
import { DeleteProjectButton } from "@/shared/components/DeleteProjectButton";
import { EditProjectButton } from "@/shared/components/EditProjectButton";
import { KpiCard } from "@/shared/components/KpiCard";
import { ProjectPagination } from "@/shared/components/ProjectPagination";
import { ProjectSearch } from "@/shared/components/ProjectSearch";
import { ProjectSort } from "@/shared/components/ProjectSort";
import { ProjectSummary } from "@/shared/components/ProjectSummary";
import { ProjectsChart } from "@/shared/components/ProjectsChart";
import { RevenueByProjectChart } from "@/shared/components/RevenueByProjectChart";
import { StatusBadge } from "@/shared/components/StatusBadge";

import { AlertTriangle, Building2, DollarSign, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  status?: string;
  search?: string;
  minBudget?: string;
  sort?: string;
  page?: string;
};

type DashboardPageProps = {
  searchParams?: Promise<DashboardSearchParams>;
};

type DashboardProject = {
  id: string;
  name: string;
  status: string;
  budget: number;
  createdAt: Date | string;
  client: {
    name: string;
  };
  company: {
    name: string;
  };
};

const filters = [
  { label: "Todos", value: "ALL" },
  { label: "Ativos", value: "ACTIVE" },
  { label: "Em risco", value: "RISK" },
  { label: "Concluídos", value: "DONE" },
];

const ITEMS_PER_PAGE = 5;

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const data = await getDashboardData();

  const params = (await searchParams) ?? {};

  const currentStatus = params.status ?? "ALL";
  const search = params.search?.toLowerCase() ?? "";
  const minBudget = Number(params.minBudget || 0);
  const sort = params.sort || "recent";
  const currentPage = Number(params.page || 1);

  let filteredProjects = data.projects as DashboardProject[];

  if (currentStatus !== "ALL") {
    filteredProjects = filteredProjects.filter(
      (project: DashboardProject) => project.status === currentStatus,
    );
  }

  if (search) {
    filteredProjects = filteredProjects.filter((project: DashboardProject) =>
      project.name.toLowerCase().includes(search),
    );
  }

  if (minBudget > 0) {
    filteredProjects = filteredProjects.filter(
      (project: DashboardProject) => Number(project.budget) >= minBudget,
    );
  }

  filteredProjects = [...filteredProjects].sort(
    (a: DashboardProject, b: DashboardProject) => {
      switch (sort) {
        case "budget_desc":
          return Number(b.budget) - Number(a.budget);
        case "budget_asc":
          return Number(a.budget) - Number(b.budget);
        case "name_asc":
          return a.name.localeCompare(b.name);
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    },
  );

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const baseParams = new URLSearchParams();

  if (currentStatus !== "ALL") baseParams.set("status", currentStatus);
  if (search) baseParams.set("search", search);
  if (minBudget > 0) baseParams.set("minBudget", String(minBudget));
  if (sort !== "recent") baseParams.set("sort", sort);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Receita Total"
          value={`R$ ${Number(data.revenue).toLocaleString("pt-BR")}`}
          description="Total do sistema"
          icon={DollarSign}
          variant="blue"
          change={12.4}
        />

        <KpiCard
          title="Projetos"
          value={String(data.projectsCount)}
          description="Total cadastrados"
          icon={Building2}
          variant="green"
          change={8.2}
        />

        <KpiCard
          title="Em Risco"
          value={String(data.riskProjects)}
          description="Projetos críticos"
          icon={AlertTriangle}
          variant="yellow"
          change={-3.1}
        />

        <KpiCard
          title="Crescimento"
          value="+12%"
          description="Simulado por enquanto"
          icon={TrendingUp}
          variant="purple"
          change={12}
        />
      </section>

      <ProjectSummary
        total={data.projectsCount}
        active={data.activeProjects}
        risk={data.riskProjects}
        done={data.doneProjects}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProjectsChart data={data.chartData} />
        <RevenueByProjectChart data={data.revenueByProject} />
      </div>

      <AIExecutivePanel
        executiveSummary={data.executiveSummary}
        recommendedActions={data.recommendedActions}
        aiProvider={data.aiProvider}
      />

      <AIInsights insights={data.aiInsights} />

      <AIRiskOverview
        summary={data.aiSummary}
        projectAnalyses={data.projectAnalyses}
      />

      <AlertsPanel alerts={data.alerts} />

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Projetos Recentes
            </h2>
            <p className="text-sm text-zinc-500">
              Obras cadastradas no banco de dados
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ProjectSearch />
            <BudgetFilter />
            <ProjectSort />
            <ClearFiltersButton />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Link
                key={filter.value}
                href={
                  filter.value === "ALL"
                    ? "/dashboard"
                    : `/dashboard?status=${filter.value}`
                }
                className={`rounded-lg px-3 py-1 text-sm transition ${
                  currentStatus === filter.value
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Orçamento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {paginatedProjects.map((project: DashboardProject) => (
                <tr key={project.id} className="text-zinc-300">
                  <td className="px-4 py-3 font-medium text-white">
                    {project.name}
                  </td>

                  <td className="px-4 py-3">{project.client.name}</td>

                  <td className="px-4 py-3">{project.company.name}</td>

                  <td className="px-4 py-3">
                    R$ {Number(project.budget).toLocaleString("pt-BR")}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={project.status} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <EditProjectButton projectId={project.id} />
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedProjects.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                  >
                    Nenhum projeto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ProjectPagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          baseParams={baseParams}
        />
      </section>
    </div>
  );
}
