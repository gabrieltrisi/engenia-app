import { AlertTriangle } from "lucide-react";

type Alert = {
  type: "warning" | "danger" | "info";
  message: string;
};

type Props = {
  alerts: Alert[];
};

export function AlertsPanel({ alerts }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-4 flex items-center gap-2 text-yellow-400">
        <AlertTriangle size={18} />
        <h2 className="text-lg font-semibold">Alertas Inteligentes</h2>
      </div>

      <ul className="space-y-3 text-sm text-zinc-300">
        {alerts.map((alert, index) => {
          const styles = {
            warning: "bg-yellow-500/10 text-yellow-300",
            danger: "bg-red-500/10 text-red-400",
            info: "bg-blue-500/10 text-blue-400",
          };

          return (
            <li key={index} className={`rounded-lg p-3 ${styles[alert.type]}`}>
              {alert.message}
            </li>
          );
        })}

        {alerts.length === 0 && (
          <li className="text-zinc-500">Nenhum alerta no momento.</li>
        )}
      </ul>
    </div>
  );
}
