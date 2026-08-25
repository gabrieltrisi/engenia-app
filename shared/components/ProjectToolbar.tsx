"use client";

import { BudgetFilter } from "./BudgetFilter";
import { ClearFiltersButton } from "./ClearFiltersButton";
import { ProjectSearch } from "./ProjectSearch";
import { ProjectSort } from "./ProjectSort";

export function ProjectToolbar() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectSearch />
          <BudgetFilter />
          <ProjectSort />
        </div>

        <ClearFiltersButton />
      </div>
    </div>
  );
}
