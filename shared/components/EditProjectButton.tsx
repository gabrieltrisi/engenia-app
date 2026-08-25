import { Pencil } from "lucide-react";
import Link from "next/link";

type EditProjectButtonProps = {
  projectId: string;
};

export function EditProjectButton({ projectId }: EditProjectButtonProps) {
  return (
    <Link
      href={`/projects/${projectId}/edit`}
      className="inline-flex rounded-lg border border-blue-500/20 bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
      title="Editar projeto"
    >
      <Pencil size={16} />
    </Link>
  );
}
