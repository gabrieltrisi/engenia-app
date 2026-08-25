"use client";

import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/shared/components/Logo";

export default function AuthLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha email e senha.");
      return;
    }

    toast.success("Login realizado com sucesso");
    router.push("/modules");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.26),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.2),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(6,182,212,0.12),transparent_32%),#030712]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:80px_80px]" />

      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
      />

      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
      />

      <motion.section
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#050b16]/90 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur-xl"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

        <button
          onClick={() => router.push("/login")}
          className="relative mb-6 flex items-center gap-2 text-sm text-zinc-500 transition hover:text-blue-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="relative mb-8 flex justify-center">
          <Logo variant="login" />
        </div>

        <div className="relative mb-6 text-center">
          <p className="text-sm font-semibold text-blue-300">Acessar EngenIA</p>

          <h1 className="mt-2 text-3xl font-black text-white">
            Entre na sua conta
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Acesse sua central de módulos, BI e inteligência operacional.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          <Input
            label="Email"
            icon={Mail}
            value={email}
            onChange={setEmail}
            placeholder="voce@empresa.com"
          />

          <PasswordInput
            label="Senha"
            value={password}
            onChange={setPassword}
            placeholder="Digite sua senha"
            showPassword={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-zinc-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-black/30 accent-blue-600"
              />
              Lembrar acesso
            </label>

            <button
              type="button"
              className="font-medium text-blue-300 transition hover:text-blue-200"
            >
              Esqueci minha senha
            </button>
          </div>

          <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:-translate-y-0.5">
            <LogIn size={18} />
            Entrar na EngenIA
          </button>
        </form>

        <div className="relative mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-300">
              <LockKeyhole size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Ambiente seguro
              </p>
              <p className="text-xs text-zinc-500">
                Acesso protegido para gestão de obras e dados executivos.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">{label}</label>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-blue-500">
        <Icon size={17} className="text-zinc-600" />

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
  showPassword,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">{label}</label>

      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 transition focus-within:border-blue-500">
        <LockKeyhole size={17} className="text-zinc-600" />

        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />

        <button
          type="button"
          onClick={onToggle}
          className="text-zinc-600 transition hover:text-zinc-300"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
