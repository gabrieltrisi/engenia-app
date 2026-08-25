"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ProjectSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1 text-sm text-white"
        placeholder="Buscar obra..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="rounded-lg bg-blue-500 px-3 py-1 text-sm text-white">
        Buscar
      </button>
    </form>
  );
}
