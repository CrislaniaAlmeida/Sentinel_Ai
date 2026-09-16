import { createFileRoute } from "@tanstack/react-router";
import { CircleDot, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { alertas, cameras } from "@/data/sentinel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/monitoramento")({
  head: () => ({
    meta: [
      { title: "Central de Monitoramento — Sentinel AI" },
      {
        name: "description",
        content:
          "Grade de câmeras ao vivo com destaque automático das câmeras que acabaram de registrar eventos relevantes.",
      },
      { property: "og:title", content: "Central de Monitoramento — Sentinel AI" },
      {
        property: "og:description",
        content: "Acompanhe todas as câmeras em uma única grade, com alertas priorizados em tempo real.",
      },
    ],
  }),
  component: Monitoramento,
});

const severidadeEstilo = {
  alta: "border-destructive/60 bg-destructive/10 text-destructive",
  media: "border-warning/60 bg-warning/10 text-warning",
  baixa: "border-border bg-secondary/60 text-muted-foreground",
} as const;

function Monitoramento() {
  const online = cameras.filter((c) => c.status === "online");
  const [destaque, setDestaque] = useState(online[0]?.id ?? "");

  useEffect(() => {
    const timer = setInterval(() => {
      setDestaque(online[Math.floor(Math.random() * online.length)]?.id ?? "");
    }, 3500);
    return () => clearInterval(timer);
  }, [online]);

  return (
    <AppShell>
      <div className="grid gap-4 p-4 md:p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h1 className="font-display text-lg font-semibold">Central de monitoramento em tempo real</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Câmeras com evento recém-detectado ganham destaque automático, sem exigir navegação manual.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            {cameras.map((c) => {
              const ativo = destaque === c.id && c.status === "online";
              return (
                <article
                  key={c.id}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 bg-card transition-colors",
                    ativo ? "border-warning" : "border-border",
                  )}
                >
                  <div className="relative aspect-video bg-black">
                    {c.status === "online" ? (
                      <img
                        src={c.frame}
                        alt={`Imagem simulada da câmera ${c.nome}`}
                        width={1280}
                        height={720}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs uppercase tracking-widest text-muted-foreground">
                        sem sinal
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {c.id}
                    </span>
                    {ativo && (
                      <span className="absolute right-2 top-2 rounded bg-warning px-1.5 py-0.5 text-[10px] font-semibold text-warning-foreground">
                        evento agora
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <CircleDot
                      className={cn("size-3.5", c.status === "online" ? "text-success" : "text-destructive")}
                    />
                    <span className="truncate text-sm">{c.nome}</span>
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {c.protocolo}
                    </Badge>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside>
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Alertas ativos
          </h2>
          <ul className="mt-3 space-y-2">
            {alertas.map((a) => (
              <li key={a.id} className={cn("rounded-md border p-3", severidadeEstilo[a.severidade])}>
                <span className="flex items-center justify-between font-mono text-[11px]">
                  <span>
                    {a.cameraId} · {a.hora}
                  </span>
                  <span className="uppercase">{a.severidade}</span>
                </span>
                <span className="mt-1 flex items-start gap-1.5 text-sm text-foreground">
                  <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
                  {a.mensagem}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
