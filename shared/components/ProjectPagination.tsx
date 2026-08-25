import Link from "next/link";

type ProjectPaginationProps = {
  currentPage: number;
  totalPages: number;
  baseParams: URLSearchParams;
};

export function ProjectPagination({
  currentPage,
  totalPages,
  baseParams,
}: ProjectPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  function createPageUrl(page: number) {
    const params = new URLSearchParams(baseParams.toString());

    params.set("page", String(page));

    return `/dashboard?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <p className="text-zinc-500">
        Página {currentPage} de {totalPages}
      </p>

      <div className="flex gap-2">
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="rounded-lg bg-zinc-800 px-3 py-1 text-zinc-200 hover:bg-zinc-700"
          >
            Anterior
          </Link>
        )}

        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="rounded-lg bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
          >
            Próxima
          </Link>
        )}
      </div>
    </div>
  );
}
