"use client";

type ProjectFilterProps = {
  current: string;
  onChange: (value: string) => void;
};

export function ProjectFilter({ current, onChange }: ProjectFilterProps) {
  const filters = ["ALL", "ACTIVE", "RISK", "DONE"];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-lg px-3 py-1 text-sm transition ${
            current === filter
              ? "bg-blue-500 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
