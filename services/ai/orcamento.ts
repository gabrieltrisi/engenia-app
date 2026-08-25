export type OrcamentoRisco = "baixo" | "medio" | "alto";

export type OrcamentoImagemResponse = {
  descricao: string;
  materiais: string[];
  custo_estimado: number;
  risco: OrcamentoRisco;
};

type AnalyzeImageInput = {
  imageBase64: string;
  mimeType: string;
};

const fallbackResponse: OrcamentoImagemResponse = {
  descricao:
    "Analise inicial gerada em modo local. Configure OPENAI_API_KEY para usar a IA visual em producao.",
  materiais: [
    "Materiais basicos de obra",
    "Insumos de acabamento",
    "Mao de obra especializada",
  ],
  custo_estimado: 12500,
  risco: "medio",
};

function normalizeRisk(value: unknown): OrcamentoRisco {
  if (value === "baixo" || value === "medio" || value === "alto") {
    return value;
  }

  return "medio";
}

function normalizeResponse(value: unknown): OrcamentoImagemResponse {
  if (!value || typeof value !== "object") {
    return fallbackResponse;
  }

  const data = value as Partial<OrcamentoImagemResponse>;

  return {
    descricao:
      typeof data.descricao === "string" && data.descricao.trim()
        ? data.descricao.trim()
        : fallbackResponse.descricao,
    materiais: Array.isArray(data.materiais)
      ? data.materiais
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : fallbackResponse.materiais,
    custo_estimado: Number.isFinite(Number(data.custo_estimado))
      ? Number(data.custo_estimado)
      : fallbackResponse.custo_estimado,
    risco: normalizeRisk(data.risco),
  };
}

function extractOutputText(response: unknown): string {
  const data = response as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };

  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .find((text): text is string => typeof text === "string") ?? ""
  );
}

export async function analyzeBudgetImage({
  imageBase64,
  mimeType,
}: AnalyzeImageInput): Promise<OrcamentoImagemResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("[ai/orcamento] OPENAI_API_KEY ausente. Usando fallback local.");
    return fallbackResponse;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analise a imagem de uma obra e retorne apenas JSON valido no formato: {\"descricao\":\"string\",\"materiais\":[\"string\"],\"custo_estimado\":number,\"risco\":\"baixo|medio|alto\"}. Use valores estimados em BRL e seja conservador.",
            },
            {
              type: "input_image",
              image_url: `data:${mimeType};base64,${imageBase64}`,
              detail: "auto",
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[ai/orcamento] OpenAI error:", errorText);
    throw new Error("Nao foi possivel analisar a imagem com IA.");
  }

  const data = await response.json();
  const outputText = extractOutputText(data);

  try {
    return normalizeResponse(JSON.parse(outputText));
  } catch (error) {
    console.error("[ai/orcamento] JSON invalido:", outputText, error);
    throw new Error("A IA retornou uma resposta invalida.");
  }
}
