<h1 align="center">🏗️ EngenIA</h1>

<p align="center"><strong>Sistema inteligente de gestão de obras</strong> — controle de projetos, dashboards de acompanhamento e uma camada de IA, em uma stack TypeScript de ponta a ponta.</p>

<p align="center">
  <a href="https://engenia-app.vercel.app"><img src="https://img.shields.io/badge/demo-ao%20vivo-2ea44f?style=for-the-badge&logo=vercel&logoColor=white" alt="Demo ao vivo" /></a>
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
</p>

🔗 **Ao vivo:** https://engenia-app.vercel.app

> ⚙️ Projeto em evolução — construção civil encontrando software e IA.

---

## ✨ O que é

**EngenIA** organiza a rotina de uma obra em um só lugar: cadastro e acompanhamento de projetos, visão de dados em **dashboards com gráficos** e uma camada de **IA** para apoiar decisões. A ideia é tirar o canteiro da planilha e colocar em um sistema que mostra o que importa em tempo real.

## 🧱 Stack

| Camada | Tecnologias |
|---|---|
| **Front-end** | Next.js 15 (App Router), React, TypeScript, Tailwind CSS |
| **UI / UX** | Framer Motion (animações), Recharts (gráficos), Lucide (ícones), Sonner (toasts) |
| **Back-end** | Route Handlers / Server Actions, Prisma ORM |
| **Dados** | PostgreSQL |
| **IA** | Camada de serviço dedicada (`ai-service`) |
| **Infra** | Vercel (CI/CD via GitHub) |

## 🎯 Destaques

- 📊 **Dashboards** de acompanhamento com gráficos (Recharts).
- 🗂️ **Gestão de projetos/obras** com dados persistidos em PostgreSQL via Prisma.
- 🤖 **Camada de IA** isolada em serviço próprio, pronta para evoluir.
- 🎨 **Interface fluida** com Framer Motion e feedback via toasts.
- 🧩 **Arquitetura organizada** por domínios (`app`, `services`, `shared`, `lib`).

## 🚀 Rodando localmente

```bash
npm install
cp .env.example .env.local   # configure DATABASE_URL (PostgreSQL) e chaves
npx prisma migrate dev
npm run dev                  # http://localhost:3000
```

---

<sub>Desenvolvido por <strong>Gabriel Trisi</strong> · Next.js · TypeScript · Prisma · PostgreSQL</sub>
