import Link from "next/link";
import prisma from "@/lib/prisma";
import { PlusCircle, Pencil } from "lucide-react";
import { DeleteClientButton } from "@/shared/components/DeleteClientButton";
import { ClientSearch } from "@/shared/components/ClientSearch";

export const dynamic = "force-dynamic";

// ✅ TIPAGEM CORRETA
type Client = {
  id: string;
  name: string;
  createdAt: Date;
  company?: {
    name: string;
  } | null;
};

type ClientsSearchParams = {
  search?: string;
};

type ClientsPageProps = {
  searchParams?: Promise<ClientsSearchParams>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const params = (await searchParams) ?? {};
  const search = params.search?.toLowerCase() ?? "";

  const clients: Client[] = await prisma.client.findMany({
    where: search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      company: true,
    },
  });

  return (
    <div className="space-y-6 p-6 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-zinc-500">
            Gerencie os clientes cadastrados
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ClientSearch />

          <Link
            href="/clients/new"
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <PlusCircle size={18} />
            Novo Cliente
          </Link>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Criado em</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800">
              {clients.map((client: Client) => (
                <tr
                  key={client.id}
                  className="text-zinc-300 transition hover:bg-zinc-900/40"
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {client.name}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {client.company?.name ?? "-"}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(client.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/clients/${client.id}/edit`}
                        className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                        title="Editar cliente"
                      >
                        <Pencil size={16} />
                      </Link>

                      <DeleteClientButton clientId={client.id} />
                    </div>
                  </td>
                </tr>
              ))}

              {clients.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-zinc-500"
                  >
                    Nenhum cliente encontrado.
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
