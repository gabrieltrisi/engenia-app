export type AIInsight = {
  type: "danger" | "warning" | "info";
  title: string;
  description: string;
  value?: string;
};

export type ProjectAnalysis = {
  id: string;
  name: string;
  status: string;
  budget: number;
  riskScore: number;
  riskLabel: string;
  type: "danger" | "warning" | "info";
  reasons: string[];
  recommendations: string[];
  daysRemaining?: number | null;
  daysOverdue?: number;
  plannedDuration?: number | null;
  elapsedDays?: number | null;
  consumedTimePercent?: number | null;
};

export type AISummary = {
  totalProjects: number;
  activeProjects?: number;
  doneProjects?: number;
  riskProjects?: number;
  riskRate?: number;
  doneRate?: number;
  averageRiskScore: number;
  operationStatus: string;
  totalBudget?: number;
  averageBudget?: number;
  overdueProjects?: number;
  closeDeadlineProjects?: number;
  criticalProjects?: number;
  warningProjects?: number;
};

export type AIAnalysisResponse = {
  insights: AIInsight[];
  projectAnalyses: ProjectAnalysis[];
  summary: AISummary;
  executiveSummary: string;
  recommendedActions: string[];
  aiProvider: string;
};

export type ProjectForAI = {
  id: string;
  name: string;
  status: string;
  budget: number | string | null;
  startDate?: Date | string | null;
  expectedEndDate?: Date | string | null;
};

function formatDateForAI(value?: Date | string | null) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

function getFallbackSummary(projects: ProjectForAI[]): AISummary {
  const totalProjects = projects.length;

  const riskProjects = projects.filter(
    (project: ProjectForAI) => project.status === "RISK",
  );

  const activeProjects = projects.filter(
    (project: ProjectForAI) => project.status === "ACTIVE",
  );

  const doneProjects = projects.filter(
    (project: ProjectForAI) => project.status === "DONE",
  );

  const totalBudget = projects.reduce(
    (sum: number, project: ProjectForAI) => sum + Number(project.budget || 0),
    0,
  );

  const riskRate =
    totalProjects > 0
      ? Math.round((riskProjects.length / totalProjects) * 100)
      : 0;

  const doneRate =
    totalProjects > 0
      ? Math.round((doneProjects.length / totalProjects) * 100)
      : 0;

  return {
    totalProjects,
    activeProjects: activeProjects.length,
    doneProjects: doneProjects.length,
    riskProjects: riskProjects.length,
    riskRate,
    doneRate,
    averageRiskScore: riskRate,
    operationStatus:
      totalProjects === 0
        ? "Sem dados"
        : riskRate >= 30
          ? "Atenção"
          : "Saudável",
    totalBudget,
    averageBudget: totalProjects > 0 ? totalBudget / totalProjects : 0,
    overdueProjects: 0,
    closeDeadlineProjects: 0,
    criticalProjects: riskProjects.length,
    warningProjects: 0,
  };
}

export function generateAIInsights(projects: ProjectForAI[]): AIInsight[] {
  if (!projects.length) return [];

  const insights: AIInsight[] = [];

  const totalBudget = projects.reduce(
    (sum: number, project: ProjectForAI) => sum + Number(project.budget || 0),
    0,
  );

  const averageBudget = totalBudget / projects.length;

  const riskProjects = projects.filter(
    (project: ProjectForAI) => project.status === "RISK",
  );

  const riskRate = (riskProjects.length / projects.length) * 100;

  if (riskRate >= 30) {
    insights.push({
      type: "danger",
      title: "Alta taxa de risco",
      description: `${Math.round(
        riskRate,
      )}% das obras estão em risco. Recomenda-se revisar orçamento, cronograma e fornecedores.`,
      value: `${Math.round(riskRate)}%`,
    });
  }

  const highBudget = projects.find(
    (project: ProjectForAI) =>
      Number(project.budget || 0) > averageBudget * 1.5,
  );

  if (highBudget && projects.length > 1) {
    insights.push({
      type: "warning",
      title: "Orçamento acima da média",
      description: `A obra "${highBudget.name}" está acima da média financeira da operação.`,
      value: `R$ ${Number(highBudget.budget || 0).toLocaleString("pt-BR")}`,
    });
  }

  if (riskRate < 10) {
    insights.push({
      type: "info",
      title: "Operação saudável",
      description: "Baixo índice de risco nos projetos cadastrados.",
      value: `${Math.round(riskRate)}%`,
    });
  }

  insights.push({
    type: "info",
    title: "Sugestão da IA",
    description:
      "Crie checkpoints semanais de custo, prazo, fornecedores e avanço físico para reduzir riscos operacionais.",
  });

  return insights.slice(0, 6);
}

function generateFallbackAnalysis(
  projects: ProjectForAI[],
): AIAnalysisResponse {
  const insights = generateAIInsights(projects);
  const summary = getFallbackSummary(projects);

  return {
    insights,
    projectAnalyses: [],
    summary,
    executiveSummary:
      projects.length > 0
        ? "A IA externa está indisponível no momento. A análise local recomenda manter acompanhamento semanal de prazo, custo, avanço físico e fornecedores críticos."
        : "Nenhum projeto disponível para análise.",
    recommendedActions:
      projects.length > 0
        ? [
            "Revisar semanalmente prazo, custo realizado e avanço físico das obras ativas.",
            "Priorizar obras marcadas como risco no acompanhamento executivo.",
            "Validar orçamento e fornecedores das obras com maior valor cadastrado.",
          ]
        : [],
    aiProvider: "local-fallback",
  };
}

export async function getAIAnalysis(
  projects: ProjectForAI[],
): Promise<AIAnalysisResponse> {
  const fallback = generateFallbackAnalysis(projects);

  try {
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projects: projects.map((project: ProjectForAI) => ({
          id: project.id,
          name: project.name,
          status: project.status,
          budget: Number(project.budget || 0),
          startDate: formatDateForAI(project.startDate),
          expectedEndDate: formatDateForAI(project.expectedEndDate),
        })),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("IA indisponível");
    }

    const data = await response.json();

    return {
      insights: data.insights ?? fallback.insights,
      projectAnalyses: data.projectAnalyses ?? fallback.projectAnalyses,
      summary: data.summary ?? fallback.summary,
      executiveSummary: data.executiveSummary ?? fallback.executiveSummary,
      recommendedActions:
        data.recommendedActions ?? fallback.recommendedActions,
      aiProvider: data.aiProvider ?? fallback.aiProvider,
    };
  } catch (error) {
    console.error("Fallback IA local:", error);
    return fallback;
  }
}

export async function getAIInsights(projects: ProjectForAI[]) {
  const analysis = await getAIAnalysis(projects);
  return analysis.insights;
}
