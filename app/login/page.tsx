"use client";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  ClipboardList,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/shared/components/Logo";

/* ================= CONFIG ================= */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "financeiro", label: "Financeiro" },
  { id: "ia", label: "IA" },
];

const modules = [
  {
    icon: Building2,
    title: "Obras",
    description: "Controle projetos, status, orçamento, clientes e prazos.",
  },
  {
    icon: Wallet,
    title: "Financeiro",
    description: "Acompanhe receita, orçamento, margem e fluxo de caixa.",
  },
  {
    icon: ClipboardList,
    title: "Diário de Obras",
    description: "Registre evolução, ocorrências e histórico da execução.",
  },
  {
    icon: PackageCheck,
    title: "Compras e Estoque",
    description: "Organize materiais, compras, entradas e necessidades.",
  },
  {
    icon: BarChart3,
    title: "BI & Relatórios",
    description: "Indicadores executivos para tomada de decisão.",
  },
  {
    icon: Bot,
    title: "IA de Risco",
    description: "Previsão de atrasos, alertas e recomendações inteligentes.",
  },
];

const steps = [
  "Cadastre empresas, clientes e obras",
  "Acompanhe orçamento, prazo e risco",
  "Receba insights inteligentes da IA",
  "Tome decisões com BI executivo",
];

/* ================= PAGE ================= */

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const goToAccess = () => router.push("/auth/login");

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(37,99,235,0.28),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(124,58,237,0.22),transparent_34%),radial-gradient(circle_at_50%_95%,rgba(6,182,212,0.14),transparent_34%),#030712]" />
      <div className="fixed inset-0 -z-10 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />

      {/* GLOW */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="pointer-events-none fixed -left-24 top-40 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="pointer-events-none fixed -right-24 bottom-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
      />

      {/* HEADER */}
      <header className="flex flex-col items-center gap-6 py-8">
        <Logo variant="login" />

        <button
          onClick={goToAccess}
          className="group flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
        >
          Acessar EngenIA
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12 }}
          className="space-y-8"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm text-blue-200"
          >
            <Sparkles size={16} />
            Plataforma inteligente para construção civil
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl font-black sm:text-7xl"
          >
            Pare de reagir.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Comece a prever.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-zinc-400">
            Central inteligente para obras, financeiro, riscos e BI com IA.
          </motion.p>

          <motion.ol variants={fadeUp} className="space-y-2 text-sm text-zinc-500">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-300">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </motion.ol>

          <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-2">
            <Feature icon={Building2} title="Gestão de obras" />
            <Feature icon={Wallet} title="Financeiro" />
            <Feature icon={Bot} title="IA de risco" />
            <Feature icon={ShieldCheck} title="Decisão executiva" />
          </motion.div>
        </motion.div>

        {/* CARD */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl border border-white/10 p-6">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-xl py-2 text-xs ${
                    activeTab === tab.id ? "bg-blue-600" : "text-zinc-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <Insight
                icon={TrendingUp}
                title="Previsão"
                value="82%"
                description="Risco antecipado"
              />
              <Insight
                icon={BarChart3}
                title="Performance"
                value="Live"
                description="Tempo real"
              />
              <Insight
                icon={ShieldCheck}
                title="Controle"
                value="OK"
                description="Operação segura"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* MODULES */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-3">
          {modules.map((m) => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function Feature({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
      <Icon size={18} />
      {title}
    </div>
  );
}

function Insight({
  icon: Icon,
  title,
  description,
  value,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border border-white/10 p-3 rounded-xl">
      <div className="flex gap-2">
        <Icon size={18} />
        <div>
          <p>{title}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <span>{value}</span>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="border border-white/10 p-4 rounded-xl">
      <Icon size={20} />
      <h3>{title}</h3>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  );
}
