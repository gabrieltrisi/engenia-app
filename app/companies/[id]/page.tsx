import Link from "next/link";
import prisma from "@/lib/prisma";
import { getAIInsights } from "@/lib/ai";
import { AIInsights } from "@/shared/components/AIInsights";
import { StatusBadge } from "@/shared/components/StatusBadge";
import {
  ArrowLeft,
  Building2,
  FolderKanban,
  Pencil,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type CompanyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CompanyClient = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

type CompanyProject = {
  id: string;
  name: string;
  status: string;
  budget: number;
  client: {
    name: string;
  };
};

export default async function CompanyDetailsPage({
  params,
}: CompanyDetailsPageProps) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      clients: true,
      projects: {
        include: {
          client: true,
          company: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <p className="text-zinc-400">Empresa não encontrada.</p>

        <Link href="/companies" className="text-sm text-blue-400">
          Voltar para empresas
        </Link>
      </div>
    );
  }

  const clients = company.clients as CompanyClient[];
  const projects = company.projects as CompanyProject[];

  const totalRevenue = projects.reduce(
    (total: number, project: CompanyProject) =>
      total + Number(project.budget || 0),
    0,
  );

  const riskProjects = projects.filter(
    (project: CompanyProject) => project.status === "RISK",
  ).length;

  const aiInsights = await getAIInsights(company.projects);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/companies"
            className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <Link
            href={`/companies/${company.id}/edit`}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Pencil size={16} />
            Editar empresa
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-500/10 p-4 text-blue-400">
            <Building2 size={28} />
          </div>

          <div>
            <p className="text-sm font-medium text-blue-300">
              Dashboard da empresa
            </p>

            <h1 className="mt-1 text-3xl font-bold text-white">
              {company.name}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              ID: {company.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard title="Clientes" value={clients.length} icon={Users} />

        <MetricCard
          title="Projetos"
          value={projects.length}
          icon={FolderKanban}
        />

        <MetricCard
          title="Receita"
          value={`R$ ${totalRevenue.toLocaleString("pt-BR")}`}
          icon={Wallet}
        />

        <MetricCard
          title="Em risco"
          value={riskProjects}
          icon={Building2}
          danger
        />
      </section>

      <AIInsights insights={aiInsights} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-bold text-white">Clientes vinculados</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Clientes cadastrados nessa empresa
          </p>

          <div className="mt-5 space-y-3">
            {clients.map((client: CompanyClient) => (
              <div
                key={client.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-semibold text-white">{client.name}</p>

                <p className="mt-1 text-sm text-zinc-500">
                  {client.email || "Sem email"} •{" "}
                  {client.phone || "Sem telefone"}
                </p>
              </div>
            ))}

            {clients.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhum cliente vinculado.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-bold text-white">Obras vinculadas</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Projetos cadastrados nessa empresa
          </p>

          <div className="mt-5 space-y-3">
            {projects.map((project: CompanyProject) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{project.name}</p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Cliente: {project.client.name}
                    </p>
                  </div>

                  <StatusBadge status={project.status} />
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-300">
                  R$ {Number(project.budget || 0).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}

            {projects.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma obra vinculada.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
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
