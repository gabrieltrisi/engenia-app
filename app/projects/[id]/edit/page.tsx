"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Project = {
  id: string;
  name: string;
  budget: number;
  status: string;
  startDate?: string | null;
  expectedEndDate?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [startDate, setStartDate] = useState("");
  const [expectedEndDate, setExpectedEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProject() {
      const response = await fetch("/api/projects");
      const projects: Project[] = await response.json();

      const selectedProject = projects.find((item) => item.id === params.id);

      if (!selectedProject) {
        toast.error("Projeto não encontrado");
        return;
      }

      setProject(selectedProject);
      setName(selectedProject.name);
      setBudget(String(selectedProject.budget));
      setStatus(selectedProject.status);
      setStartDate(formatDate(selectedProject.startDate));
      setExpectedEndDate(formatDate(selectedProject.expectedEndDate));
    }

    loadProject();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !budget) {
      toast.error("Preencha nome e orçamento.");
      return;
    }

    if (startDate && expectedEndDate && startDate > expectedEndDate) {
      toast.error(
        "A data de início não pode ser maior que a previsão de término.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/projects", {
        method: "PATCH",
        body: JSON.stringify({
          id: params.id,
          name,
          budget,
          status,
          startDate,
          expectedEndDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar projeto");
      }

      toast.success("Projeto atualizado com sucesso");

      router.push("/projects");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar projeto");
    } finally {
      setLoading(false);
    }
  }

  if (!project) {
    return <div className="p-6 text-white">Carregando projeto...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <p className="text-sm font-medium text-blue-300">Edição de obra</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Editar Projeto</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Atualize dados financeiros, status e previsão de término da obra.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-zinc-400">
              Nome do projeto
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Orçamento
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Status</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">Ativa</option>
              <option value="RISK">Em risco</option>
              <option value="DONE">Concluída</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Data de início
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Previsão de término
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={expectedEndDate}
              onChange={(e) => setExpectedEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05]"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
