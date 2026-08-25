import Link from "next/link";

export function ClearFiltersButton() {
  return (
    <Link
      href="/dashboard"
      className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-zinc-300 transition hover:bg-zinc-800"
    >
      Limpar filtros
    </Link>
  );
}
