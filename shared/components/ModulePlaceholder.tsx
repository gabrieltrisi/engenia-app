import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";

type ModulePlaceholderProps = {
  title: string;
  description: string;
};

export function ModulePlaceholder({
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-16 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              Em desenvolvimento
            </span>

            <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-blue-300 shadow-lg shadow-blue-950/20">
            <Construction size={34} />
          </div>
        </div>

        <div className="relative mt-8">
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-blue-500/40 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar para modulos
          </Link>
        </div>
      </section>
    </div>
  );
}
