import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  Bot,
  Calculator,
  PlusCircle,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const dynamic = "force-dynamic";

type InsightType = "danger" | "warning" | "info";

type BudgetInsight = {
  type: InsightType;
  title: string;
  description: string;
  value?: string;
};

type BudgetWithData = {
  id: string;
  name: string;
  totalCost: number;
  expectedRevenue: number | null;
  marginPercent: number | null;
  project: {
    name: string;
    budget: number;
  };
  items: {
    name: string;
    totalCost: number;
  }[];
};

function formatCurrency(value: number | null | undefined) {
  return `R$ ${Number(value || 0).toLocaleString("pt-BR")}`;
}

function analyzeBudget(budget: BudgetWithData): BudgetInsight[] {
  const insights: BudgetInsight[] = [];

  const cost = Number(budget.totalCost || 0);
  const revenue = Number(budget.expectedRevenue || 0);
  const projectBudget = Number(budget.project?.budget || 0);
  const margin = revenue > 0 ? ((revenue - cost) / revenue) * 100 : 0;

  if (projectBudget > 0 && cost > projectBudget) {
    insights.push({
      type: "danger",
      title: "Estouro de orçamento",
      description:
        "O custo ultrapassa o orçamento da obra. Revise imediatamente.",
      value: formatCurrency(cost),
    });
  }

  if (margin < 10 && revenue > 0) {
    insights.push({
      type: "danger",
      title: "Margem muito baixa",
      description:
        "Esse orçamento pode gerar prejuízo. Ajuste preços ou reduza custos.",
      value: `${margin.toFixed(1)}%`,
    });
  } else if (margin < 20 && revenue > 0) {
    insights.push({
      type: "warning",
      title: "Margem em atenção",
      description: "A margem está apertada. Monitore execução e fornecedores.",
      value: `${margin.toFixed(1)}%`,
    });
  } else if (revenue > 0) {
    insights.push({
      type: "info",
      title: "Margem saudável",
      description: "Boa margem para execução.",
      value: `${margin.toFixed(1)}%`,
    });
  }

  if (budget.items.length > 0) {
    const topItem = [...budget.items].sort(
      (a, b) => Number(b.totalCost || 0) - Number(a.totalCost || 0),
    )[0];

    if (topItem) {
      insights.push({
        type: "warning",
        title: "Maior custo do orçamento",
        description: `"${topItem.name}" é o item mais caro. Negocie fornecedor.`,
        value: formatCurrency(topItem.totalCost),
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Orçamento em análise",
      description:
        "Informe receita esperada e itens para a IA calcular margem e riscos.",
    });
  }

  return insights;
}

export default async function BudgetsPage() {
  const budgets = await prisma.budget.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      items: true,
    },
  });

  const typedBudgets = budgets as BudgetWithData[];

  const totalBudgets = typedBudgets.length;

  const totalCost = typedBudgets.reduce(
    (total: number, budget: BudgetWithData) =>
      total + Number(budget.totalCost || 0),
    0,
  );

  const totalExpectedRevenue = typedBudgets.reduce(
    (total: number, budget: BudgetWithData) =>
      total + Number(budget.expectedRevenue || 0),
    0,
  );

  const averageMargin =
    totalBudgets > 0
      ? typedBudgets.reduce(
          (total: number, budget: BudgetWithData) =>
            total + Number(budget.marginPercent || 0),
          0,
        ) / totalBudgets
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300">
              Financeiro inteligente
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white">
              Orçamentos com IA
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Controle de custo, margem e recomendações inteligentes por obra.
            </p>
          </div>

          <Link
            href="/budgets/new"
            className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            <PlusCircle size={16} />
            Novo orçamento
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Orçamentos"
          value={String(totalBudgets)}
          description="Total cadastrado"
          icon={Calculator}
        />

        <MetricCard
          title="Custo total"
          value={formatCurrency(totalCost)}
          description="Soma dos custos"
          icon={Wallet}
        />

        <MetricCard
          title="Margem média"
          value={`${averageMargin.toFixed(1)}%`}
          description={
            totalExpectedRevenue > 0 ? "Com receita esperada" : "Sem receita"
          }
          icon={Bot}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {typedBudgets.map((budget: BudgetWithData) => {
          const insights = analyzeBudget(budget);
          const mainInsight = insights[0];

          return (
            <Link
              key={budget.id}
              href={`/budgets/${budget.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
            >
              <h2 className="text-lg font-bold text-white">{budget.name}</h2>

              <p className="mt-1 text-sm text-zinc-500">
                {budget.project.name}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <MiniMetric
                  label="Custo"
                  value={formatCurrency(budget.totalCost)}
                />

                <MiniMetric
                  label="Receita"
                  value={
                    budget.expectedRevenue
                      ? formatCurrency(budget.expectedRevenue)
                      : "-"
                  }
                />

                <MiniMetric
                  label="Margem"
                  value={
                    budget.marginPercent !== null
                      ? `${Number(budget.marginPercent).toFixed(1)}%`
                      : "-"
                  }
                />

                <MiniMetric label="Itens" value={String(budget.items.length)} />
              </div>

              {mainInsight && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                  <p className="text-sm font-semibold text-blue-300">
                    {mainInsight.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    {mainInsight.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}

        {typedBudgets.length === 0 && (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center">
            <h2 className="text-lg font-bold text-white">
              Nenhum orçamento cadastrado
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Crie seu primeiro orçamento inteligente para começar.
            </p>

            <Link
              href="/budgets/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              <PlusCircle size={16} />
              Criar orçamento
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="mt-1 text-xl font-bold text-white">{value}</p>
        </div>

        <Icon className="text-blue-400" size={22} />
      </div>

      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
