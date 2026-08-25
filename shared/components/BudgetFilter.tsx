"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function BudgetFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minBudget, setMinBudget] = useState(
    searchParams.get("minBudget") || "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (minBudget) {
      params.set("minBudget", minBudget);
    } else {
      params.delete("minBudget");
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="w-36 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-white"
        placeholder="Valor mín."
        value={minBudget}
        onChange={(e) => setMinBudget(e.target.value)}
      />

      <button className="rounded-lg bg-zinc-800 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-700">
        Filtrar
      </button>
    </form>
  );
}
