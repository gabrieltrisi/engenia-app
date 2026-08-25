"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
};

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch("/api/companies");
        const companies = await res.json();

        const selected = companies.find((c: Company) => c.id === params.id);

        if (!selected) return;

        setCompany(selected);
        setName(selected.name);
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
      }
    }

    loadCompany();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name) {
      alert("Nome da empresa é obrigatório.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/companies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.id,
          name,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar empresa");
      }

      router.push("/companies");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar empresa.");
    } finally {
      setLoading(false);
    }
  }

  if (!company) {
    return (
      <div className="p-6 text-white">
        <p>Carregando empresa...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">Editar Empresa</h1>
        <p className="text-sm text-zinc-500">Atualize os dados da empresa</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Nome da empresa</label>

          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/companies")}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
