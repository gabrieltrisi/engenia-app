"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type DeleteProjectButtonProps = {
  projectId: string;
};

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      const response = await fetch("/api/projects", {
        method: "DELETE",
        body: JSON.stringify({
          id: projectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir projeto");
      }

      toast.success("Projeto excluído com sucesso");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro ao excluir projeto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* BOTÃO */}
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20"
        title="Excluir projeto"
      >
        <Trash2 size={16} />
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
            <h2 className="text-lg font-bold">Excluir projeto</h2>

            <p className="mt-2 text-sm text-zinc-400">
              Tem certeza que deseja excluir este projeto? Essa ação não pode
              ser desfeita.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
