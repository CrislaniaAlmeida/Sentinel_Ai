import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { PlantaMapa } from "@/components/PlantaMapa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { alvoPorId, cameraPorId, eventoPorId, relatorios } from "@/data/sentinel";

export const Route = createFileRoute("/relatorios/$id")({
  loader: ({ params }) => {
    const relatorio = relatorios.find((r) => r.id === params.id);
    if (!relatorio) throw notFound();
    return { relatorio };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Relatório indisponível — Sentinel AI" }, { name: "robots", content: "noindex" }] };
    }
    const titulo = `${loaderData.relatorio.id} — ${loaderData.relatorio.titulo}`;
    return {
      meta: [
        { title: `${titulo} | Sentinel AI` },
        { name: "description", content: loaderData.relatorio.resumo.slice(0, 155) },
        { property: "og:title", content: titulo },
        { property: "og:description", content: loaderData.relatorio.resumo.slice(0, 155) },
      ],
    };
  },
  component: RelatorioIncidente,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="font-display text-lg font-semibold">Relatório não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">Este identificador de incidente não existe no protótipo.</p>
        <Button asChild className="mt-4">
          <Link to="/auditoria">Ver relatórios gerados</Link>
        </Button>
      </div>
    </AppShell>
  ),
});

function RelatorioIncidente() {
  const { relatorio } = Route.useLoaderData();
  const alvo = alvoPorId(relatorio.alvoId);
  const eventos = relatorio.eventoIds.map((id) => eventoPorId(id)).filter((e): e is NonNullable<typeof e> => Boolean(e));

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="size-4" /> Voltar à investigação
            </Link>
          </Button>
          <Button size="sm" className="ml-auto" onClick={() => window.print()}>
            <Printer className="size-4" /> Exportar em PDF
          </Button>
        </div>

        <header className="rounded-lg border border-border bg-card p-5">
          <Badge variant="outline" className="font-mono text-[10px]">
            {relatorio.id}
          </Badge>
          <h1 className="mt-2 font-display text-xl font-semibold">{relatorio.titulo}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{relatorio.local}</p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Gerado em</dt>
              <dd>{relatorio.geradoEm}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Operador</dt>
              <dd>{relatorio.operador}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground">Alvo</dt>
              <dd>{alvo?.rotulo ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed">{relatorio.resumo}</p>
        </header>

        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-display text-sm font-semibold">Trajeto reconstruído</h2>
          <PlantaMapa className="mt-3 aspect-[16/9]" trajeto={alvo?.trajeto ?? []} />
          <p className="mt-2 text-xs text-muted-foreground">
            Sequência de câmeras: {(alvo?.trajeto ?? []).join(" → ")}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-sm font-semibold">Evidências</h2>
          {eventos.map((e) => {
            const camera = cameraPorId(e.cameraId);
            return (
              <article key={e.id} className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-[220px_minmax(0,1fr)]">
                <img
                  src={camera?.frame}
                  alt={`Evidência da câmera ${camera?.nome} às ${e.hora}`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="aspect-video w-full rounded-md object-cover"
                />
                <div>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {e.cameraId} · {e.hora} · confiança {(e.confianca * 100).toFixed(0)}%
                  </p>
                  <p className="mt-1 font-medium">{e.titulo}</p>
                  <p className="text-xs text-muted-foreground">{camera?.nome}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {e.atributos.map((a) => (
                      <Badge key={a} variant="secondary" className="text-[10px] font-normal">
                        {a}
                      </Badge>
                    ))}
                    {e.placa && (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {e.placa}
                      </Badge>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
