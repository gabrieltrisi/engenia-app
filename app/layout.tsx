import "./globals.css";
import { Toaster } from "sonner";
import { AppShell } from "@/shared/components/AppShell";

export const metadata = {
  title: "EngenIA",
  description: "Sistema inteligente de gestao de obras",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#030712] text-white">
        <AppShell>{children}</AppShell>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
