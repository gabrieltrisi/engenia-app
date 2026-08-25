"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCompanyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name) {
      alert("Digite o nome da empresa.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar empresa");
      }

      router.push("/home"); // pode mudar pra /companies depois
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar empresa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6 text-white">
      <div>
        <h1 className="text-2xl font-bold">Nova Empresa</h1>
        <p className="text-sm text-zinc-500">
          Cadastre uma nova empresa no sistema
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Nome da empresa</label>

          <input
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm outline-none focus:border-blue-500"
            placeholder="Ex: Construtora Silva LTDA"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 p-3 font-semibold transition hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Empresa"}
        </button>
      </form>
    </div>
  );
}
