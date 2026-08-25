"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Wallet } from "lucide-react";

type RevenueByProjectChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

const colors = ["#22c55e", "#84cc16", "#10b981", "#14b8a6", "#06b6d4"];

function formatCurrency(value: number) {
  return `R$ ${Number(value).toLocaleString("pt-BR")}`;
}

export function RevenueByProjectChart({ data }: RevenueByProjectChartProps) {
  const total = data.reduce((acc, item) => acc + Number(item.value), 0);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-green-950/10">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-xl bg-green-500/10 p-2 text-green-400">
              <Wallet size={18} />
            </div>

            <h2 className="text-lg font-bold text-white">Orçamento por Obra</h2>
          </div>

          <p className="text-sm text-zinc-500">
            Comparativo financeiro entre projetos cadastrados
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-right">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-lg font-bold text-green-300">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      <div className="h-80">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Nenhum dado disponível
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={64}>
              <CartesianGrid
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={8}
              />

              <YAxis
                stroke="#71717a"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={90}
                tickFormatter={(value) =>
                  `R$ ${Number(value).toLocaleString("pt-BR", {
                    notation: "compact",
                  })}`
                }
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "14px",
                  color: "#fff",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                }}
                labelStyle={{ color: "#e4e4e7", fontWeight: 700 }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  "Orçamento",
                ]}
              />

              <Bar dataKey="value" radius={[12, 12, 4, 4]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
