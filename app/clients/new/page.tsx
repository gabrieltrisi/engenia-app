"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
};

export default function NewClientPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      const response = await fetch("/api/companies");
      const data = await response.json();

      setCompanies(data);
    }

    loadCompanies();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!companyId) {
      alert("Selecione uma empresa.");
      return;
    }

    setLoading(true);

    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name,
        companyId,
      }),
    });

    router.push("/projects/new");
    router.refresh();
  }

  return (
    <div className="p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold">Novo Cliente</h1>

      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <input
          className="rounded border border-zinc-800 bg-zinc-900 p-2"
          placeholder="Nome do cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="rounded border border-zinc-800 bg-zinc-900 p-2"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        >
          <option value="">Selecione uma empresa</option>

          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="rounded bg-blue-500 p-2 font-semibold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Cliente"}
        </button>
      </form>
    </div>
  );
}
