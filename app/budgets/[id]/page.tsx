import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  PackageCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { analyzeBudget } from "@/lib/budget-ai";

export const dynamic = "force-dynamic";

type BudgetDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: number | null | undefined) {
  return `R$ ${Number(value || 0).toLocaleString("pt-BR")}`;
}

export default async function BudgetDetailPage({
  params,
}: BudgetDetailPageProps) {
  const { id } = await params;

  const budget = await prisma.budget.findUnique({
    where: { id },
    include: {
      project: true,
      items: true,
    },
  });

  if (!budget) {
    notFound();
  }

  const insights = analyzeBudget({
    totalCost: budget.totalCost,
    expectedRevenue: budget.expectedRevenue,
    marginPercent: budget.marginPercent,
    project: {
      budget: budget.project.budget,
    },
    items: budget.items.map((item) => ({
      name: item.name,
      category: item.category,
      totalCost: item.totalCost,
    })),
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Link
        href="/budgets"
        className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-blue-300"
      >
        <ArrowLeft size={16} />
        Voltar para orcamentos
      </Link>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <p className="text-sm font-medium text-blue-300">
          Orcamento inteligente
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">{budget.name}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {budget.description || "Sem descricao informada."}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Custo total"
          value={formatCurrency(budget.totalCost)}
          icon={Wallet}
        />
        <MetricCard
          title="Receita esperada"
          value={
            budget.expectedRevenue ? formatCurrency(budget.expectedRevenue) : "-"
          }
          icon={PackageCheck}
        />
        <MetricCard
          title="Margem"
          value={
            budget.marginPercent !== null
              ? `${Number(budget.marginPercent).toFixed(1)}%`
              : "-"
          }
          icon={Bot}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <h2 className="text-lg font-bold text-white">Itens</h2>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-zinc-400">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Qtd</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {budget.items.map((item) => (
                  <tr key={item.id} className="text-zinc-300">
                    <td className="px-4 py-3 font-medium text-white">
                      {item.name}
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(item.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
          <div className="mb-4 flex items-center gap-3 text-blue-300">
            <Bot size={20} />
            <h2 className="text-lg font-bold text-white">Insights da IA</h2>
          </div>

          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">{insight.title}</p>
                  {insight.value && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-blue-200">
                      {insight.value}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {insight.description}
                </p>
              </div>
            ))}
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
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-zinc-500">{title}</p>
        <Icon className="text-blue-400" size={20} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
