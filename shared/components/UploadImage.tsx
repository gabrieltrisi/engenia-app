"use client";

import Image from "next/image";
import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { OrcamentoImagemResponse } from "@/services/ai/orcamento";

type UploadImageProps = {
  onResult?: (result: OrcamentoImagemResponse) => void;
};

function formatCurrency(value: number) {
  return `R$ ${Number(value || 0).toLocaleString("pt-BR")}`;
}

export function UploadImage({ onResult }: UploadImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<OrcamentoImagemResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const riskStyle = useMemo(() => {
    if (result?.risco === "alto") return "border-red-500/20 text-red-300";
    if (result?.risco === "medio") return "border-yellow-500/20 text-yellow-300";
    return "border-blue-500/20 text-blue-300";
  }, [result?.risco]);

  function handleFileChange(nextFile?: File) {
    if (!nextFile) return;

    if (!nextFile.type.startsWith("image/")) {
      toast.error("Envie uma imagem valida.");
      return;
    }

    setFile(nextFile);
    setResult(null);
    setPreview(URL.createObjectURL(nextFile));
  }

  async function generateBudget() {
    if (!file) {
      toast.error("Envie uma foto para gerar o orcamento.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/ai/orcamento", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao analisar a imagem.");
      }

      setResult(data);
      onResult?.(data);
      toast.success("Orcamento por imagem gerado.");
    } catch (error) {
      console.error("[UploadImage]", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel gerar o orcamento.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
      <div className="flex items-center gap-3 text-cyan-300">
        <ImagePlus size={20} />
        <div>
          <h2 className="text-lg font-bold text-white">
            Orcamento por imagem
          </h2>
          <p className="text-sm text-zinc-400">
            Envie uma foto da obra para estimar materiais, custo e risco.
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(event) => handleFileChange(event.target.files?.[0])}
        className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-cyan-500"
      />

      {preview && (
        <div className="relative h-72 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <Image
            src={preview}
            alt="Previa da imagem enviada"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <button
        type="button"
        onClick={generateBudget}
        disabled={loading}
        className="flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Sparkles size={18} />
        )}
        {loading ? "Gerando orcamento..." : "Gerar orcamento"}
      </button>

      {result && (
        <div className={`rounded-2xl border bg-black/20 p-4 ${riskStyle}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-wide">
              Risco {result.risco}
            </p>
            <p className="text-sm font-bold">
              {formatCurrency(result.custo_estimado)}
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {result.descricao}
          </p>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Materiais estimados
            </p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-300">
              {result.materiais.map((material) => (
                <li key={material}>- {material}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
