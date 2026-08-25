"use client";

import {
  AlertTriangle,
  Info,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadImage } from "@/shared/components/UploadImage";
import type { OrcamentoImagemResponse } from "@/services/ai/orcamento";

type ProjectOption = {
  id: string;
  name: string;
};

type BudgetItem = {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
};

const EMPTY_ITEM: BudgetItem = {
  name: "",
  category: "Material",
  quantity: 1,
  unit: "un",
  unitCost: 0,
};

function safeNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function buildItemsFromAI(result: OrcamentoImagemResponse): BudgetItem[] {
  if (!result.materiais.length) return [{ ...EMPTY_ITEM }];

  const unitCost = Math.max(
    0,
    Math.round(result.custo_estimado / result.materiais.length),
  );

  return result.materiais.map((material) => ({
    name: material,
    category: "Material",
    quantity: 1,
    unit: "un",
    unitCost,
  }));
}

export default function NewBudgetPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expectedRevenue, setExpectedRevenue] = useState("");
  const [items, setItems] = useState<BudgetItem[]>([{ ...EMPTY_ITEM }]);
  const [saving, setSaving] = useState(false);
  const [lastAIResult, setLastAIResult] =
    useState<OrcamentoImagemResponse | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects/options");

        if (!response.ok) {
          throw new Error("Resposta invalida do servidor.");
        }

        const data = await response.json();
        setProjects(Array.isArray(data.projects) ? data.projects : []);
      } catch (error) {
        console.error("[loadProjects]", error);
        toast.error("Nao foi possivel carregar as obras.");
      }
    }

    loadProjects();
  }, []);

  function applyImageBudget(result: OrcamentoImagemResponse) {
    setLastAIResult(result);
    setName("Orcamento gerado por imagem");
    setDescription(result.descricao);
    setExpectedRevenue(String(result.custo_estimado));
    setItems(buildItemsFromAI(result));
  }

  function addItem() {
    setItems((current) => [...current, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.length === 1
        ? [{ ...EMPTY_ITEM }]
        : current.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function updateItem(index: number, field: keyof BudgetItem, value: string) {
    setItems((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        if (field === "name" || field === "category" || field === "unit") {
          return { ...item, [field]: value };
        }

        return {
          ...item,
          [field]: safeNumber(value),
        };
      }),
    );
  }

  async function saveBudget() {
    if (!projectId) {
      toast.error("Selecione uma obra.");
      return;
    }

    if (!name.trim()) {
      toast.error("Informe o nome do orcamento.");
      return;
    }

    const validItems = items
      .map((item) => ({
        name: item.name.trim(),
        category: item.category.trim() || "Material",
        unit: item.unit.trim() || "un",
        quantity: safeNumber(item.quantity),
        unitCost: safeNumber(item.unitCost),
      }))
      .filter((item) => item.name && item.quantity > 0 && item.unitCost >= 0);

    if (validItems.length === 0) {
      toast.error("Adicione pelo menos um item valido.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          expectedRevenue: safeNumber(expectedRevenue),
          projectId,
          items: validItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar orcamento.");
      }

      toast.success("Orcamento salvo com sucesso.");
      router.push(`/budgets/${data.budget.id}`);
      router.refresh();
    } catch (error) {
      console.error("[saveBudget]", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o orcamento.",
      );
    } finally {
      setSaving(false);
    }
  }

  const revenue = safeNumber(expectedRevenue);
  const totalCost = items.reduce(
    (sum, item) => sum + safeNumber(item.quantity) * safeNumber(item.unitCost),
    0,
  );
  const margin = revenue - totalCost;
  const marginPercent = revenue > 0 ? (margin / revenue) * 100 : 0;

  const aiAlert =
    revenue <= 0
      ? {
          type: "warning" as const,
          text: "Informe a receita esperada para calcular a margem.",
        }
      : marginPercent < 10
        ? {
            type: "danger" as const,
            text: "Margem muito baixa. Alto risco financeiro.",
          }
        : marginPercent < 20
          ? {
              type: "warning" as const,
              text: "Margem moderada. Avalie custos e fornecedores.",
            }
          : {
              type: "info" as const,
              text: "Margem saudavel. Boa estrutura de orcamento.",
            };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <p className="text-sm font-medium text-blue-300">
          Novo orcamento inteligente
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Criar orcamento com IA
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Envie uma foto do local para estimar materiais, custo inicial e risco.
          Depois revise os itens antes de salvar.
        </p>
      </section>

      <UploadImage onResult={applyImageBudget} />

      {lastAIResult && (
        <section className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
          <div className="flex items-center gap-2 text-blue-300">
            <Sparkles size={16} />
            <p className="text-sm font-bold">Resultado aplicado ao formulario</p>
          </div>
          <p className="mt-2 text-sm text-zinc-300">
            Revise os valores sugeridos pela IA antes de salvar o orcamento.
          </p>
        </section>
      )}

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Obra</label>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="">Selecione uma obra</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Nome do orcamento"
          value={name}
          onChange={setName}
          placeholder="Ex: Orcamento inicial da obra"
        />

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Descricao</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Descreva o escopo estimado pela IA ou ajuste manualmente."
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
          />
        </div>

        <Input
          label="Receita esperada (R$)"
          type="number"
          value={expectedRevenue}
          onChange={setExpectedRevenue}
          placeholder="Ex: 150000"
        />
      </section>

      <section className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Itens do orcamento</h2>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:grid-cols-[1.2fr_140px_100px_100px_150px_50px]"
            >
              <Input
                label="Item"
                value={item.name}
                onChange={(value) => updateItem(index, "name", value)}
                placeholder="Ex: Cabo flexivel 2,5mm"
              />

              <Input
                label="Categoria"
                value={item.category}
                onChange={(value) => updateItem(index, "category", value)}
              />

              <Input
                label="Qtd"
                type="number"
                value={String(item.quantity)}
                onChange={(value) => updateItem(index, "quantity", value)}
              />

              <Input
                label="Un."
                value={item.unit}
                onChange={(value) => updateItem(index, "unit", value)}
              />

              <Input
                label="Custo unit. (R$)"
                type="number"
                value={String(item.unitCost)}
                onChange={(value) => updateItem(index, "unitCost", value)}
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-7 flex h-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                title="Remover item"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric
          label="Custo total"
          value={`R$ ${totalCost.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
        />

        <Metric
          label="Margem"
          value={`R$ ${margin.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`}
        />

        <Metric label="Margem %" value={`${marginPercent.toFixed(1)}%`} />
      </section>

      <section
        className={`rounded-3xl border p-5 ${
          aiAlert.type === "danger"
            ? "border-red-500/20 bg-red-500/10 text-red-300"
            : aiAlert.type === "warning"
              ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-300"
              : "border-blue-500/20 bg-blue-500/10 text-blue-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {aiAlert.type === "info" ? (
            <Info size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}

          <p className="text-sm font-bold">Analise de margem</p>
        </div>

        <p className="mt-2 text-sm">{aiAlert.text}</p>
      </section>

      <button
        type="button"
        onClick={saveBudget}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Save size={18} />
        )}

        {saving ? "Salvando orcamento..." : "Salvar orcamento"}
      </button>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-blue-500"
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-white">{value}</p>
    </div>
  );
}
