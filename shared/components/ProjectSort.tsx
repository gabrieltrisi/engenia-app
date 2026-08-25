"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProjectSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "recent";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sort", value);

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-white"
    >
      <option value="recent">Mais recente</option>
      <option value="budget_desc">Maior orçamento</option>
      <option value="budget_asc">Menor orçamento</option>
      <option value="name_asc">Nome A-Z</option>
    </select>
  );
}
