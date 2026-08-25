export type BudgetAIInsight = {
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  value?: string;
};

type BudgetForAnalysis = {
  totalCost: number | null;
  expectedRevenue: number | null;
  marginPercent: number | null;
  project: {
    budget: number | null;
  };
  items: {
    name: string;
    category: string;
    totalCost: number;
  }[];
};

function formatCurrency(value: number) {
  return `R$ ${Number(value || 0).toLocaleString("pt-BR")}`;
}

export function analyzeBudget(budget: BudgetForAnalysis): BudgetAIInsight[] {
  const insights: BudgetAIInsight[] = [];

  const totalItems = budget.items.reduce(
    (total, item) => total + Number(item.totalCost || 0),
    0,
  );

  const projectBudget = Number(budget.project?.budget || 0);
  const totalCost = Number(budget.totalCost || totalItems || 0);
  const expectedRevenue = Number(
    budget.expectedRevenue || projectBudget || totalCost || 0,
  );

  const marginValue = expectedRevenue - totalCost;

  const marginPercent =
    expectedRevenue > 0 ? (marginValue / expectedRevenue) * 100 : 0;

  const budgetUsage = projectBudget > 0 ? (totalCost / projectBudget) * 100 : 0;

  if (projectBudget > 0) {
    if (budgetUsage >= 100) {
      insights.push({
        type: "danger",
        title: "Orçamento acima do previsto",
        description:
          "Este orçamento ultrapassa o valor previsto da obra. Revise custos, margem e escopo antes de aprovar.",
        value: `${Math.round(budgetUsage)}%`,
      });
    } else if (budgetUsage >= 80) {
      insights.push({
        type: "warning",
        title: "Orçamento próximo do limite",
        description:
          "Este orçamento já consome uma parte alta do orçamento da obra. Recomenda-se revisar itens críticos.",
        value: `${Math.round(budgetUsage)}%`,
      });
    } else {
      insights.push({
        type: "info",
        title: "Orçamento dentro do previsto",
        description:
          "O orçamento ainda está dentro do limite financeiro previsto para a obra.",
        value: `${Math.round(budgetUsage)}%`,
      });
    }
  }

  if (expectedRevenue > 0) {
    if (marginPercent < 10) {
      insights.push({
        type: "danger",
        title: "Margem baixa",
        description:
          "A margem estimada está baixa. Avalie reajuste de preço, negociação com fornecedores ou redução de custos.",
        value: `${marginPercent.toFixed(1)}%`,
      });
    } else if (marginPercent < 20) {
      insights.push({
        type: "warning",
        title: "Margem em atenção",
        description:
          "A margem está aceitável, mas ainda merece acompanhamento para evitar perda durante a execução.",
        value: `${marginPercent.toFixed(1)}%`,
      });
    } else {
      insights.push({
        type: "info",
        title: "Margem saudável",
        description:
          "A margem estimada está saudável para acompanhamento inicial.",
        value: `${marginPercent.toFixed(1)}%`,
      });
    }
  }

  const expensiveItem = [...budget.items].sort(
    (a, b) => Number(b.totalCost || 0) - Number(a.totalCost || 0),
  )[0];

  if (expensiveItem) {
    insights.push({
      type: "warning",
      title: "Item de maior impacto",
      description: `"${expensiveItem.name}" é o item com maior peso no orçamento. Negocie fornecedor e valide quantidade.`,
      value: formatCurrency(Number(expensiveItem.totalCost || 0)),
    });
  }

  const categories = budget.items.reduce<Record<string, number>>(
    (acc, item) => {
      const category = item.category || "Sem categoria";
      acc[category] = (acc[category] || 0) + Number(item.totalCost || 0);
      return acc;
    },
    {},
  );

  const mainCategory = Object.entries(categories).sort(
    ([, a], [, b]) => b - a,
  )[0];

  if (mainCategory) {
    insights.push({
      type: "info",
      title: "Categoria dominante",
      description: `A categoria "${mainCategory[0]}" concentra o maior custo. Use isso para priorizar negociação.`,
      value: formatCurrency(mainCategory[1]),
    });
  }

  if (Math.abs(totalItems - totalCost) > totalCost * 0.05 && totalCost > 0) {
    insights.push({
      type: "warning",
      title: "Diferença entre itens e total",
      description:
        "A soma dos itens está diferente do custo total informado. Verifique se todos os custos foram lançados corretamente.",
      value: formatCurrency(totalItems),
    });
  }

  insights.push({
    type: "info",
    title: "Recomendação da IA",
    description:
      "Antes de aprovar, compare este orçamento com histórico de obras similares, valide fornecedores críticos e revise itens com maior peso financeiro.",
  });

  return insights.slice(0, 6);
}
