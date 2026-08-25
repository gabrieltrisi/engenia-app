import Link from "next/link";
import prisma from "@/lib/prisma";
import { Building2, Eye, Pencil, PlusCircle } from "lucide-react";
import { DeleteCompanyButton } from "@/shared/components/DeleteCompanyButton";

export const dynamic = "force-dynamic";

// ✅ TIPAGEM DA COMPANY (resolve erro do map)
type Company = {
  id: string;
  name: string;
  createdAt: Date;
  clients: { id: string }[];
  projects: { id: string }[];
};

export default async function CompaniesPage() {
  const companies: Company[] = await prisma.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      clients: true,
      projects: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-300">Gestão comercial</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Empresas</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Gerencie as empresas vinculadas aos clientes e projetos.
          </p>
        </div>

        <Link
          href="/companies/new"
          className="flex w-fit items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <PlusCircle size={18} />
          Nova Empresa
        </Link>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Empresas cadastradas</h2>
          <p className="text-sm text-zinc-500">
            Clique em uma empresa para abrir o dashboard individual.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-zinc-400">
              <tr>
                <th className="px-4 py-4">Empresa</th>
                <th className="px-4 py-4">Clientes</th>
                <th className="px-4 py-4">Projetos</th>
                <th className="px-4 py-4">Criada em</th>
                <th className="px-4 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {companies.map((company: Company) => (
                <tr
                  key={company.id}
                  className="text-zinc-300 transition hover:bg-white/[0.035]"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/companies/${company.id}`}
                      className="flex items-center gap-3 rounded-xl transition hover:text-blue-300"
                    >
                      <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
                        <Building2 size={18} />
                      </div>

                      <div>
                        <p className="font-semibold text-white">
                          {company.name}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          ID: {company.id.slice(0, 8)}
                        </p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {company.clients.length}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {company.projects.length}
                  </td>

                  <td className="px-4 py-4 text-zinc-400">
                    {new Date(company.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/companies/${company.id}`}
                        className="rounded-lg bg-violet-500/10 p-2 text-violet-400 transition hover:bg-violet-500/20"
                        title="Abrir dashboard da empresa"
                      >
                        <Eye size={16} />
                      </Link>

                      <Link
                        href={`/companies/${company.id}/edit`}
                        className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                        title="Editar empresa"
                      >
                        <Pencil size={16} />
                      </Link>

                      <DeleteCompanyButton companyId={company.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {companies.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Nenhuma empresa cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
