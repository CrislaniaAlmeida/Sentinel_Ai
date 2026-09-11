import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Radar, Settings2, ShieldCheck, Search, Video, ScrollText } from "lucide-react";
import type { ReactNode } from "react";

import { alertas } from "@/data/sentinel";
import { cn } from "@/lib/utils";

const navegacao = [
  { to: "/", rotulo: "Investigação", icone: Search },
  { to: "/monitoramento", rotulo: "Monitoramento", icone: Video },
  { to: "/admin", rotulo: "Administração", icone: Settings2 },
  { to: "/auditoria", rotulo: "Auditoria", icone: ScrollText },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Radar className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-base font-semibold tracking-tight">SENTINEL AI</span>
              <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
                Central de investigação
              </span>
            </span>
          </Link>

          <nav className="order-3 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto">
            {navegacao.map((item) => {
              const ativo = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    ativo
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icone className="size-4" />
                  {item.rotulo}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground sm:flex">
              <ShieldCheck className="size-3.5 text-success" />
              LGPD conforme
            </span>
            <button
              type="button"
              className="relative rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`${alertas.length} alertas ativos`}
            >
              <Bell className="size-4" />
              <span className="absolute -right-1.5 -top-1.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {alertas.length}
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                CD
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-medium">Camila Duarte</span>
                <span className="block text-[10px] text-muted-foreground">Operadora</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground md:px-6">
        Protótipo funcional de front-end · dados simulados, sem conexão com câmeras reais.
      </footer>
    </div>
  );
}
