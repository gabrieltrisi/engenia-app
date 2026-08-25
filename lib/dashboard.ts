import prisma from "@/lib/prisma";
import { getAIAnalysis, type ProjectForAI } from "@/lib/ai";

type AlertType = "warning" | "danger" | "info";

type DashboardAlert = {
  type: AlertType;
  message: string;
};

type DashboardProject = ProjectForAI & {
  createdAt: Date;
  client: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
};

export async function getDashboardData() {
  const totalRevenue = await prisma.project.aggregate({
    _sum: {
      budget: true,
    },
  });

  const totalProjects = await prisma.project.count();

  const riskProjects = await prisma.project.count({
    where: {
      status: "RISK",
    },
  });

  const activeProjects = await prisma.project.count({
    where: {
      status: "ACTIVE",
    },
  });

  const doneProjects = await prisma.project.count({
    where: {
      status: "DONE",
    },
  });

  const projects = (await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      client: true,
      company: true,
    },
  })) as DashboardProject[];

  const chartData = [
    { name: "Ativos", value: activeProjects },
    { name: "Em risco", value: riskProjects },
    { name: "Concluídos", value: doneProjects },
  ];

  const revenueByProject = projects.map((project: DashboardProject) => ({
    name: project.name,
    value: Number(project.budget || 0),
  }));

  const averageBudget =
    projects.length > 0
      ? projects.reduce(
          (total: number, project: DashboardProject) =>
            total + Number(project.budget || 0),
          0,
        ) / projects.length
      : 0;

  const alerts: DashboardAlert[] = [];

  const riskRate =
    totalProjects > 0 ? Math.round((riskProjects / totalProjects) * 100) : 0;

  if (riskRate >= 30) {
    alerts.push({
      type: "danger",
      message: `🚨 ${riskRate}% das obras estão em risco. Recomenda-se revisar orçamento, cronograma e fornecedores com prioridade.`,
    });
  }

  projects.forEach((project: DashboardProject) => {
    const budget = Number(project.budget || 0);
    const isHighBudget = averageBudget > 0 && budget > averageBudget * 1.5;

    if (project.status === "RISK") {
      alerts.push({
        type: "danger",
        message: `🚨 Obra "${project.name}" está em risco. Sugestão: revisar custos executados, contratos e prazos imediatamente.`,
      });

      return;
    }

    if (isHighBudget) {
      alerts.push({
        type: "warning",
        message: `⚠️ Obra "${project.name}" está ${(
          budget / averageBudget
        ).toFixed(
          1,
        )}x acima do orçamento médio. Sugestão: acompanhar margem e fluxo de caixa de perto.`,
      });

      return;
    }

    if (project.status === "ACTIVE" && budget >= 500000) {
      alerts.push({
        type: "info",
        message: `💡 Obra "${project.name}" possui orçamento relevante. Sugestão: criar checkpoints semanais de custo e progresso.`,
      });
    }
  });

  if (alerts.length === 0 && projects.length > 0) {
    alerts.push({
      type: "info",
      message:
        "💡 Nenhum risco crítico detectado. Operação estável no momento.",
    });
  }

  const aiAnalysis = await getAIAnalysis(projects);

  return {
    revenue: totalRevenue._sum.budget || 0,
    projectsCount: totalProjects,
    riskProjects,
    activeProjects,
    doneProjects,
    chartData,
    revenueByProject,
    alerts: alerts.slice(0, 6),

    aiInsights: aiAnalysis.insights.slice(0, 6),
    aiSummary: aiAnalysis.summary,
    projectAnalyses: aiAnalysis.projectAnalyses,

    executiveSummary: aiAnalysis.executiveSummary,
    recommendedActions: aiAnalysis.recommendedActions ?? [],
    aiProvider: aiAnalysis.aiProvider ?? "local-fallback",

    projects,
  };
}
