"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Company = {
  id: string;
  name: string;
};

type Client = {
  id: string;
  name: string;
  companyId: string;
};

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [companyId, setCompanyId] = useState("");
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedEndDate, setExpectedEndDate] = useState("");

  const [companies, setCompanies] = useState<Company[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredClients = clients.filter(
    (client) => client.companyId === companyId,
  );

  useEffect(() => {
    async function loadData() {
      const [companiesResponse, clientsResponse] = await Promise.all([
        fetch("/api/companies"),
        fetch("/api/clients"),
      ]);

      const companiesData = await companiesResponse.json();
      const clientsData = await clientsResponse.json();

      setCompanies(companiesData);
      setClients(clientsData);
    }

    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !budget || !companyId || !clientId) {
      toast.error("Preencha nome, orçamento, empresa e cliente.");
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
        method: "POST",
        body: JSON.stringify({
          name,
          budget,
          status,
          companyId,
          clientId,
          startDate,
          expectedEndDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar projeto");
      }

      toast.success("Projeto criado com sucesso");

      router.push("/projects");
      router.refresh();
    } catch {
      toast.error("Erro ao criar projeto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <p className="text-sm font-medium text-blue-300">Cadastro de obra</p>
        <h1 className="mt-1 text-3xl font-bold text-white">Novo Projeto</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Cadastre uma nova obra com cliente, empresa, orçamento e previsão de
          cronograma.
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
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50"
              placeholder="Ex: Residencial Aurora"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Orçamento
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500/50"
              placeholder="Ex: 250000"
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
            <label className="mb-2 block text-sm text-zinc-400">Empresa</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setClientId("");
              }}
            >
              <option value="">Selecione uma empresa</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">Cliente</label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-50 focus:border-blue-500/50"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              disabled={!companyId}
            >
              <option value="">Selecione um cliente</option>

              {filteredClients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
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

        <div className="mt-6 flex justify-end">
          <button
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Projeto"}
          </button>
        </div>
      </form>
    </div>
  );
}
