from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import json
import base64

load_dotenv()

app = FastAPI(title="EngenIA AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = (os.getenv("GEMINI_API_KEY") or "").strip().strip('"').strip("'")
GEMINI_MODEL = (os.getenv("GEMINI_MODEL") or "gemini-1.5-flash").strip()
GEMINI_VISION_MODEL = (os.getenv("GEMINI_VISION_MODEL") or "gemini-1.5-flash").strip()


class Project(BaseModel):
    id: str
    name: str
    status: str
    budget: float
    startDate: Optional[str] = None
    expectedEndDate: Optional[str] = None


class AnalyzeRequest(BaseModel):
    projects: List[Project]


class GenerateBudgetRequest(BaseModel):
    description: str


class GenerateBudgetFromImageRequest(BaseModel):
    description: str
    imageBase64: str
    mimeType: Optional[str] = "image/jpeg"


def parse_date(value: Optional[str]):
    if not value:
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return None


def format_currency(value: float):
    return f"R$ {value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")


def get_status_label(score: int):
    if score >= 70:
        return "Crítico"
    if score >= 40:
        return "Atenção"
    return "Saudável"


def get_insight_type(score: int):
    if score >= 70:
        return "danger"
    if score >= 40:
        return "warning"
    return "info"


def clean_json_response(text: str):
    raw_text = (text or "").strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()

    first_brace = raw_text.find("{")
    last_brace = raw_text.rfind("}")

    if first_brace != -1 and last_brace != -1:
        raw_text = raw_text[first_brace : last_brace + 1]

    return json.loads(raw_text)


def clean_base64_image(value: str):
    image = (value or "").strip()

    if "," in image and image.startswith("data:"):
        image = image.split(",", 1)[1]

    return image


def calculate_project_analysis(project: Project, average_budget: float, today: datetime):
    score = 0
    reasons = []
    recommendations = []

    start_date = parse_date(project.startDate)
    expected_end_date = parse_date(project.expectedEndDate)

    days_remaining = None
    days_overdue = 0
    planned_duration = None
    elapsed_days = None
    consumed_time_percent = None

    if project.status == "RISK":
        score += 35
        reasons.append("status marcado como risco")
        recommendations.append("revisar causas do risco com prioridade")

    if average_budget > 0 and project.budget > average_budget * 1.5:
        score += 20
        reasons.append("orçamento acima da média")
        recommendations.append("acompanhar margem, fluxo de caixa e fornecedores")

    if expected_end_date and project.status != "DONE":
        days_remaining = (expected_end_date - today).days

        if days_remaining < 0:
            days_overdue = abs(days_remaining)
            score += 35
            reasons.append("prazo vencido")
            recommendations.append("criar plano de recuperação de cronograma")
        elif days_remaining <= 7:
            score += 25
            reasons.append("prazo muito próximo")
            recommendations.append("validar avanço físico imediatamente")
        elif days_remaining <= 15:
            score += 15
            reasons.append("prazo próximo")
            recommendations.append("acompanhar execução semanalmente")

    if start_date and expected_end_date:
        planned_duration = (expected_end_date - start_date).days

        if planned_duration > 0:
            elapsed_days = max((today - start_date).days, 0)
            consumed_time_percent = min(
                max(round((elapsed_days / planned_duration) * 100), 0),
                100,
            )

            if project.status != "DONE" and consumed_time_percent >= 90:
                score += 20
                reasons.append("mais de 90% do prazo consumido")
                recommendations.append("comparar avanço físico com prazo consumido")
            elif project.status != "DONE" and consumed_time_percent >= 75:
                score += 10
                reasons.append("mais de 75% do prazo consumido")
                recommendations.append("monitorar produtividade da equipe")

            if planned_duration > 180:
                score += 5
                reasons.append("obra de longa duração")

    if project.status == "DONE":
        score = max(score - 40, 0)

    score = min(score, 100)

    return {
        "id": project.id,
        "name": project.name,
        "status": project.status,
        "budget": project.budget,
        "riskScore": score,
        "riskLabel": get_status_label(score),
        "type": get_insight_type(score),
        "reasons": reasons,
        "recommendations": recommendations,
        "daysRemaining": days_remaining,
        "daysOverdue": days_overdue,
        "plannedDuration": planned_duration,
        "elapsedDays": elapsed_days,
        "consumedTimePercent": consumed_time_percent,
    }


def get_local_executive_analysis(summary: dict, project_analyses: list):
    critical = [project for project in project_analyses if project["riskScore"] >= 70]
    warning = [
        project for project in project_analyses if 40 <= project["riskScore"] < 70
    ]

    if summary["averageRiskScore"] >= 70:
        tone = "A operação exige ação imediata."
    elif summary["averageRiskScore"] >= 40:
        tone = "A operação está em atenção e precisa de acompanhamento preventivo."
    else:
        tone = "A operação está saudável, mas deve manter checkpoints de controle."

    actions = [
        "Revisar semanalmente prazo, custo realizado e avanço físico das obras ativas.",
        "Priorizar obras com maior score de risco no acompanhamento executivo.",
        "Validar orçamento e fornecedores das obras com maior concentração financeira.",
    ]

    if critical:
        actions.insert(
            0,
            f'Criar plano de recuperação para a obra "{critical[0]["name"]}".',
        )

    if warning:
        actions.append(
            f'Acompanhar preventivamente a obra "{warning[0]["name"]}" antes que vire risco crítico.',
        )

    return {
        "executiveSummary": tone,
        "recommendedActions": actions[:5],
        "aiProvider": "local-fallback",
    }


def build_gemini_prompt(summary: dict, project_analyses: list):
    payload = {
        "summary": summary,
        "topRiskProjects": project_analyses[:5],
    }

    return f"""
Você é um consultor executivo especialista em gestão de obras, construção civil, orçamento, prazo e risco operacional.

Analise os dados abaixo da plataforma EngenIA e devolva APENAS um JSON válido, sem markdown, sem texto antes ou depois.

Formato obrigatório:
{{
  "executiveSummary": "resumo executivo curto, claro e profissional em português",
  "recommendedActions": [
    "ação prática 1",
    "ação prática 2",
    "ação prática 3"
  ]
}}

Regras:
- Seja direto e executivo.
- Não invente dados.
- Use linguagem profissional, mas simples.
- Foque em prazo, risco, orçamento, margem e priorização.
- Máximo 5 recomendações.
- Não use markdown.

Dados:
{json.dumps(payload, ensure_ascii=False)}
"""


def build_budget_generation_prompt(description: str):
    return f"""
Você é um engenheiro orçamentista especialista em construção civil brasileira e serviços elétricos.

A empresa usuária é a NEXO INSTALADORA, de Salvador/BA, com foco principal em instalação e manutenção elétrica.

Crie um orçamento inicial baseado na descrição abaixo e devolva APENAS um JSON válido, sem markdown, sem texto antes ou depois.

Formato obrigatório:
{{
  "name": "nome curto do orçamento",
  "description": "descrição resumida do escopo",
  "expectedRevenue": 0,
  "items": [
    {{
      "name": "nome do item",
      "category": "Material",
      "quantity": 1,
      "unit": "un",
      "unitCost": 0,
      "totalCost": 0
    }}
  ]
}}

Regras:
- Use valores numéricos realistas em reais.
- Categorias permitidas: Material, Mão de obra, Equipamentos, Acabamento, Serviços, Administração.
- Se o serviço envolver elétrica, inclua itens como cabos, eletrodutos, disjuntores, tomadas, interruptores, luminárias, quadro, conectores, identificação, testes e mão de obra.
- Gere entre 6 e 12 itens.
- totalCost deve ser quantity * unitCost.
- expectedRevenue deve considerar margem comercial aproximada entre 15% e 30%.
- Não use markdown.
- Não invente texto fora do JSON.

Descrição do orçamento:
{description}
"""


def build_image_budget_generation_prompt(description: str):
    return f"""
Você é um engenheiro orçamentista especialista em instalações elétricas, manutenção elétrica e pequenas obras no Brasil.

A empresa usuária é a NEXO INSTALADORA, localizada em Salvador/BA, especializada em instalação e manutenção elétrica.

Analise a imagem enviada junto com a descrição do usuário e gere um pré-orçamento técnico inicial.

Você deve observar na imagem:
- ambiente aparente;
- pontos elétricos visíveis;
- possíveis tomadas, interruptores, luminárias, quadros, conduítes, fiação aparente ou infraestrutura;
- necessidade provável de materiais;
- necessidade provável de mão de obra;
- riscos ou limitações visuais;
- o que NÃO dá para confirmar só pela imagem.

Devolva APENAS um JSON válido, sem markdown, sem texto antes ou depois.

Formato obrigatório:
{{
  "name": "nome curto do orçamento",
  "description": "resumo técnico do que foi identificado na imagem e no objetivo informado",
  "expectedRevenue": 0,
  "imageAnalysis": {{
    "detectedEnvironment": "ambiente identificado",
    "visibleElements": ["elemento visível 1", "elemento visível 2"],
    "assumptions": ["premissa 1", "premissa 2"],
    "risks": ["risco ou ponto de atenção 1"],
    "questions": ["pergunta necessária para orçamento definitivo"]
  }},
  "items": [
    {{
      "name": "nome do item",
      "category": "Material",
      "quantity": 1,
      "unit": "un",
      "unitCost": 0,
      "totalCost": 0
    }}
  ]
}}

Regras:
- O orçamento é estimativo e inicial.
- Não invente informações não visíveis como metragem exata; quando precisar, use premissas explícitas.
- Use valores realistas em reais para Salvador/BA.
- Categorias permitidas: Material, Mão de obra, Equipamentos, Acabamento, Serviços, Administração.
- Para elétrica, considere cabos, eletrodutos/canaletas, disjuntores, tomadas, interruptores, luminárias, quadro, conectores, identificação, testes e mão de obra.
- Gere entre 6 e 14 itens.
- totalCost deve ser quantity * unitCost.
- expectedRevenue deve considerar margem comercial aproximada entre 15% e 30%.
- Não use markdown.
- Não retorne texto fora do JSON.

Objetivo informado pelo usuário:
{description}
"""


def get_gemini_executive_analysis(summary: dict, project_analyses: list):
    if not GEMINI_API_KEY:
        return get_local_executive_analysis(summary, project_analyses)

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=build_gemini_prompt(summary, project_analyses),
        )

        parsed = clean_json_response(response.text)

        return {
            "executiveSummary": parsed.get("executiveSummary")
            or "Análise executiva gerada com sucesso.",
            "recommendedActions": parsed.get("recommendedActions") or [],
            "aiProvider": "gemini",
        }

    except Exception as error:
        print("Erro Gemini:", error)
        return get_local_executive_analysis(summary, project_analyses)


def get_local_generated_budget(description: str):
    items = [
        {
            "name": "Materiais elétricos principais",
            "category": "Material",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 8500,
            "totalCost": 8500,
        },
        {
            "name": "Cabos, conectores e identificação",
            "category": "Material",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 4200,
            "totalCost": 4200,
        },
        {
            "name": "Eletrodutos, canaletas e acessórios",
            "category": "Material",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 3800,
            "totalCost": 3800,
        },
        {
            "name": "Disjuntores, tomadas e interruptores",
            "category": "Material",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 5200,
            "totalCost": 5200,
        },
        {
            "name": "Mão de obra elétrica",
            "category": "Mão de obra",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 12500,
            "totalCost": 12500,
        },
        {
            "name": "Testes, acabamento e entrega técnica",
            "category": "Serviços",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 2800,
            "totalCost": 2800,
        },
        {
            "name": "Administração e imprevistos",
            "category": "Administração",
            "quantity": 1,
            "unit": "vb",
            "unitCost": 3500,
            "totalCost": 3500,
        },
    ]

    total_cost = sum(item["totalCost"] for item in items)
    expected_revenue = round(total_cost * 1.22, 2)

    return {
        "budget": {
            "name": "Pré-orçamento elétrico gerado pela IA",
            "description": description,
            "expectedRevenue": expected_revenue,
            "imageAnalysis": {
                "detectedEnvironment": "Não analisado por imagem",
                "visibleElements": [],
                "assumptions": [
                    "Estimativa local usada como fallback.",
                    "Orçamento definitivo depende de vistoria técnica.",
                ],
                "risks": [
                    "Pode haver variação conforme distância dos pontos, infraestrutura existente e padrão de acabamento.",
                ],
                "questions": [
                    "Qual a metragem aproximada do ambiente?",
                    "Quantos pontos elétricos serão instalados ou revisados?",
                ],
            },
            "items": items,
        },
        "aiProvider": "local-fallback",
    }


def normalize_generated_budget(data: dict, description: str):
    budget = data or {}
    items = budget.get("items") or []
    normalized_items = []

    for item in items:
        quantity = float(item.get("quantity") or 1)
        unit_cost = float(item.get("unitCost") or 0)
        total_cost = float(item.get("totalCost") or (quantity * unit_cost))

        normalized_items.append(
            {
                "name": str(item.get("name") or "Item do orçamento"),
                "category": str(item.get("category") or "Serviços"),
                "quantity": quantity,
                "unit": str(item.get("unit") or "un"),
                "unitCost": unit_cost,
                "totalCost": total_cost,
            }
        )

    if not normalized_items:
        return get_local_generated_budget(description)["budget"]

    total_cost = sum(item["totalCost"] for item in normalized_items)
    expected_revenue = float(
        budget.get("expectedRevenue") or round(total_cost * 1.22, 2)
    )

    image_analysis = budget.get("imageAnalysis") or {
        "detectedEnvironment": "",
        "visibleElements": [],
        "assumptions": [],
        "risks": [],
        "questions": [],
    }

    return {
        "name": str(budget.get("name") or "Orçamento gerado pela IA"),
        "description": str(budget.get("description") or description),
        "expectedRevenue": expected_revenue,
        "imageAnalysis": image_analysis,
        "items": normalized_items,
    }


@app.get("/")
def health_check():
    return {
        "service": "EngenIA AI Service",
        "status": "online",
        "gemini": "enabled" if GEMINI_API_KEY else "disabled",
        "model": GEMINI_MODEL,
        "visionModel": GEMINI_VISION_MODEL,
    }


@app.post("/generate-budget")
def generate_budget(payload: GenerateBudgetRequest):
    description = payload.description.strip()

    if not description:
        return {
            "error": "Descrição obrigatória",
            "budget": None,
            "aiProvider": "local-fallback",
        }

    if not GEMINI_API_KEY:
        return get_local_generated_budget(description)

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=build_budget_generation_prompt(description),
        )

        parsed = clean_json_response(response.text)
        budget = normalize_generated_budget(parsed, description)

        return {
            "budget": budget,
            "aiProvider": "gemini",
        }

    except Exception as error:
        print("Erro ao gerar orçamento com Gemini:", error)
        return get_local_generated_budget(description)


@app.post("/generate-budget-from-image")
def generate_budget_from_image(payload: GenerateBudgetFromImageRequest):
    description = payload.description.strip()
    image_base64 = clean_base64_image(payload.imageBase64)
    mime_type = payload.mimeType or "image/jpeg"

    if not description:
        return {
            "error": "Descrição obrigatória",
            "budget": None,
            "aiProvider": "local-fallback",
        }

    if not image_base64:
        return {
            "error": "Imagem obrigatória",
            "budget": None,
            "aiProvider": "local-fallback",
        }

    if not GEMINI_API_KEY:
        return get_local_generated_budget(description)

    try:
        image_bytes = base64.b64decode(image_base64)

        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model=GEMINI_VISION_MODEL,
            contents=[
                build_image_budget_generation_prompt(description),
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
            ],
        )

        parsed = clean_json_response(response.text)
        budget = normalize_generated_budget(parsed, description)

        return {
            "budget": budget,
            "aiProvider": "gemini-vision",
        }

    except Exception as error:
        print("Erro ao gerar orçamento por imagem:", error)
        return get_local_generated_budget(description)


@app.post("/analyze")
def analyze_projects(payload: AnalyzeRequest):
    if not payload.projects:
        return {
            "insights": [],
            "projectAnalyses": [],
            "summary": {
                "totalProjects": 0,
                "averageRiskScore": 0,
                "operationStatus": "Sem dados",
            },
            "executiveSummary": "Nenhum projeto disponível para análise.",
            "recommendedActions": [],
            "aiProvider": "local-fallback",
        }

    today = datetime.now(timezone.utc)

    total_projects = len(payload.projects)
    total_budget = sum(project.budget for project in payload.projects)
    average_budget = total_budget / total_projects if total_projects > 0 else 0

    risk_projects = [project for project in payload.projects if project.status == "RISK"]
    active_projects = [project for project in payload.projects if project.status == "ACTIVE"]
    done_projects = [project for project in payload.projects if project.status == "DONE"]

    project_analyses = [
        calculate_project_analysis(project, average_budget, today)
        for project in payload.projects
    ]

    project_analyses = sorted(
        project_analyses,
        key=lambda item: item["riskScore"],
        reverse=True,
    )

    average_risk_score = round(
        sum(item["riskScore"] for item in project_analyses) / total_projects
    )

    risk_rate = round((len(risk_projects) / total_projects) * 100)
    done_rate = round((len(done_projects) / total_projects) * 100)

    overdue_projects = [
        item for item in project_analyses if item["daysOverdue"] > 0
    ]

    close_deadline_projects = [
        item
        for item in project_analyses
        if item["daysRemaining"] is not None
        and item["daysRemaining"] >= 0
        and item["daysRemaining"] <= 15
        and item["status"] != "DONE"
    ]

    critical_projects = [
        item for item in project_analyses if item["riskScore"] >= 70
    ]

    warning_projects = [
        item for item in project_analyses if 40 <= item["riskScore"] < 70
    ]

    insights = []

    if average_risk_score >= 70:
        operation_status = "Crítica"
        insights.append({
            "type": "danger",
            "title": "Operação em estado crítico",
            "description": f"O score médio de risco está em {average_risk_score}/100. Priorize obras críticas, prazos vencidos e revisão financeira.",
            "value": f"{average_risk_score}/100",
        })
    elif average_risk_score >= 40:
        operation_status = "Atenção"
        insights.append({
            "type": "warning",
            "title": "Operação exige atenção",
            "description": f"O score médio de risco está em {average_risk_score}/100. Algumas obras precisam de acompanhamento preventivo.",
            "value": f"{average_risk_score}/100",
        })
    else:
        operation_status = "Saudável"
        insights.append({
            "type": "info",
            "title": "Operação saudável",
            "description": f"O score médio de risco está em {average_risk_score}/100. Continue acompanhando prazo, custo e execução semanalmente.",
            "value": f"{average_risk_score}/100",
        })

    if risk_rate >= 30:
        insights.append({
            "type": "danger",
            "title": "Alta taxa de obras em risco",
            "description": f"{risk_rate}% das obras estão marcadas como risco. Recomenda-se reunião executiva para priorização.",
            "value": f"{risk_rate}%",
        })

    if overdue_projects:
        worst = overdue_projects[0]
        insights.append({
            "type": "danger",
            "title": "Obra com prazo vencido",
            "description": f'A obra "{worst["name"]}" passou da previsão de término em {worst["daysOverdue"]} dias. Crie um plano de recuperação.',
            "value": f'{worst["daysOverdue"]} dias',
        })

    if close_deadline_projects:
        closest = sorted(
            close_deadline_projects,
            key=lambda item: item["daysRemaining"],
        )[0]

        insights.append({
            "type": "warning",
            "title": "Prazo próximo de vencer",
            "description": f'A obra "{closest["name"]}" vence em {closest["daysRemaining"]} dias. Valide avanço físico, equipe e fornecedores.',
            "value": f'{closest["daysRemaining"]} dias',
        })

    if critical_projects:
        project = critical_projects[0]
        reasons = ", ".join(project["reasons"]) or "múltiplos fatores"

        insights.append({
            "type": "danger",
            "title": "Obra mais crítica",
            "description": f'A obra "{project["name"]}" possui score {project["riskScore"]}/100 por: {reasons}.',
            "value": f'{project["riskScore"]}/100',
        })
    elif warning_projects:
        project = warning_projects[0]

        insights.append({
            "type": "warning",
            "title": "Obra em atenção preventiva",
            "description": f'A obra "{project["name"]}" ainda não é crítica, mas merece acompanhamento preventivo.',
            "value": f'{project["riskScore"]}/100',
        })

    highest_budget = max(payload.projects, key=lambda project: project.budget)

    if total_projects > 1 and highest_budget.budget > average_budget * 1.5:
        insights.append({
            "type": "warning",
            "title": "Concentração financeira",
            "description": f'A obra "{highest_budget.name}" está acima da média de orçamento. Acompanhe margem, caixa e compras.',
            "value": format_currency(highest_budget.budget),
        })
    else:
        insights.append({
            "type": "info",
            "title": "Maior orçamento cadastrado",
            "description": f'A obra "{highest_budget.name}" possui o maior orçamento registrado no momento.',
            "value": format_currency(highest_budget.budget),
        })

    if active_projects:
        insights.append({
            "type": "info",
            "title": "Recomendação executiva",
            "description": "Implante checkpoints semanais com avanço físico, custo realizado, prazo restante e fornecedores críticos.",
            "value": f"{len(active_projects)} ativa(s)",
        })

    summary = {
        "totalProjects": total_projects,
        "activeProjects": len(active_projects),
        "doneProjects": len(done_projects),
        "riskProjects": len(risk_projects),
        "riskRate": risk_rate,
        "doneRate": done_rate,
        "averageRiskScore": average_risk_score,
        "operationStatus": operation_status,
        "totalBudget": total_budget,
        "averageBudget": average_budget,
        "overdueProjects": len(overdue_projects),
        "closeDeadlineProjects": len(close_deadline_projects),
        "criticalProjects": len(critical_projects),
        "warningProjects": len(warning_projects),
    }

    executive_analysis = get_gemini_executive_analysis(summary, project_analyses)

    return {
        "insights": insights[:6],
        "projectAnalyses": project_analyses,
        "summary": summary,
        "executiveSummary": executive_analysis["executiveSummary"],
        "recommendedActions": executive_analysis["recommendedActions"],
        "aiProvider": executive_analysis["aiProvider"],
    }