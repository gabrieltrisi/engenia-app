"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "@/shared/components/Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Topbar />

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.12),_transparent_32%),#030712] px-4 pb-8 pt-28 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}
