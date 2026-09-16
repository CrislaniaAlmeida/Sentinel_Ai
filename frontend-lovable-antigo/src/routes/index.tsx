import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Camera as CameraIcon,
  CircleDot,
  FileText,
  Pause,
  Play,
  Search,
  SkipBack,
  SkipForward,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { PlantaMapa } from "@/components/PlantaMapa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { alvoPorId, buscarEventos, cameraPorId, cameras, eventos } from "@/data/sentinel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel de Investigação — Sentinel AI" },
      {
        name: "description",
        content:
          "Busque por descrição, reconstrua trajetos entre câmeras e gere relatórios de incidente no painel de investigação do Sentinel AI.",
      },
      { property: "og:title", content: "Painel de Investigação — Sentinel AI" },
      {
        property: "og:description",
        content: "Investigação por videomonitoramento com busca em linguagem natural e trajeto reconstruído.",
      },
    ],
  }),
  component: Investigacao,
});

function Investigacao() {
  const [consulta, setConsulta] = useState("veículo prata saindo pelo portão B");
  const [consultaAtiva, setConsultaAtiva] = useState("veículo prata saindo pelo portão B");
  const [tipo, setTipo] = useState<"todos" | "pessoa" | "veiculo">("todos");
  const [periodo, setPeriodo] = useState("22-23");
  const [cameraFiltro, setCameraFiltro] = useState("todas");
  const [eventoSelecionado, setEventoSelecionado] = useState("EV-1048");
  const [reproduzindo, setReproduzindo] = useState(false);

  const resultados = useMemo(() => {
    const base = eventos.filter((evento) => {
      if (tipo !== "todos" && evento.tipo !== tipo) return false;
      if (cameraFiltro !== "todas" && evento.cameraId !== cameraFiltro) return false;
      const hora = Number(evento.hora.slice(0, 2));
      if (periodo === "22-23" && (hora < 22 || hora > 23)) return false;
      if (periodo === "manha" && (hora < 6 || hora > 12)) return false;
      return true;
    });
    return buscarEventos(consultaAtiva, base);
  }, [consultaAtiva, tipo, cameraFiltro, periodo]);

  const evento = eventos.find((e) => e.id === eventoSelecionado) ?? eventos[0]!;
  const camera = cameraPorId(evento.cameraId);
  const alvo = evento.alvoId ? alvoPorId(evento.alvoId) : undefined;
  const trajeto = alvo?.trajeto ?? [evento.cameraId];

  const eventosLinhaTempo = eventos.filter((e) =>
    alvo ? e.alvoId === alvo.id : e.cameraId === evento.cameraId,
  );

  return (
    <AppShell>
      <div className="grid gap-4 p-4 md:p-6 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Câmeras */}
        <aside className="space-y-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Câmeras ({cameras.filter((c) => c.status === "online").length}/{cameras.length} online)
          </h2>
          <ul className="space-y-1.5">
            {cameras.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCameraFiltro(c.id)}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-left transition-colors",
                    cameraFiltro === c.id
                      ? "border-primary/60 bg-primary/10"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <CircleDot
                      className={cn("size-3.5", c.status === "online" ? "text-success" : "text-destructive")}
                    />
                    <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-snug">{c.nome}</span>
                  <span className="text-[11px] text-muted-foreground">{c.local}</span>
                </button>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setCameraFiltro("todas")}>
            Limpar seleção de câmera
          </Button>
        </aside>

        {/* Centro */}
        <section className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setConsultaAtiva(consulta);
            }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <label htmlFor="busca" className="font-display text-sm font-semibold">
              Busca por descrição
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              Descreva o alvo em linguagem natural, como faria para um colega.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                id="busca"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                placeholder="ex.: homem de casaco azul correndo perto da doca"
              />
              <Button type="submit" className="sm:w-36">
                <Search className="size-4" /> Buscar
              </Button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger aria-label="Período">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Qualquer horário</SelectItem>
                  <SelectItem value="22-23">Noite (22h–23h59)</SelectItem>
                  <SelectItem value="manha">Manhã (6h–12h)</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipo} onValueChange={(v) => setTipo(v as typeof tipo)}>
                <SelectTrigger aria-label="Tipo de alvo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Pessoas e veículos</SelectItem>
                  <SelectItem value="pessoa">Somente pessoas</SelectItem>
                  <SelectItem value="veiculo">Somente veículos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={cameraFiltro} onValueChange={setCameraFiltro}>
                <SelectTrigger aria-label="Câmera">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as câmeras</SelectItem>
                  {cameras.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.id} — {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          {/* Player */}
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-video bg-black">
              <img
                src={camera?.frame}
                alt={`Quadro simulado da câmera ${camera?.nome}`}
                width={1280}
                height={720}
                className={cn("size-full object-cover", reproduzindo && "animate-pulse")}
              />
              <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-primary">
                <CameraIcon className="size-3.5" /> {camera?.id} · {evento.hora}
              </div>
              <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-primary">
                confiança {(evento.confianca * 100).toFixed(0)}%
              </div>
              {evento.restricao && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded bg-destructive/90 px-2 py-1 text-[11px] font-medium text-destructive-foreground">
                  <TriangleAlert className="size-3.5" /> Placa em base restritiva
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2">
              <Button size="icon" variant="ghost" aria-label="Evento anterior">
                <SkipBack className="size-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setReproduzindo((r) => !r)} aria-label="Reproduzir">
                {reproduzindo ? <Pause className="size-4" /> : <Play className="size-4" />}
              </Button>
              <Button size="icon" variant="ghost" aria-label="Próximo evento">
                <SkipForward className="size-4" />
              </Button>
              <span className="ml-1 text-sm">{evento.titulo}</span>
              {evento.placa && (
                <Badge variant="outline" className="font-mono">
                  {evento.placa}
                </Badge>
              )}
              <Button asChild size="sm" className="ml-auto">
                <Link to="/relatorios/$id" params={{ id: "INC-2026-0912" }}>
                  <FileText className="size-4" /> Gerar relatório de incidente
                </Link>
              </Button>
            </div>
          </div>

          {/* Mapa */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">Mapa inteligente — trajeto reconstruído</h2>
              <span className="text-xs text-muted-foreground">{alvo ? alvo.rotulo : "Sem alvo associado"}</span>
            </div>
            <PlantaMapa
              className="mt-3 aspect-[16/9]"
              trajeto={trajeto}
              cameraSelecionada={evento.cameraId}
              onSelecionarCamera={setCameraFiltro}
            />
          </div>

          {/* Linha do tempo */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="font-display text-sm font-semibold">Linha do tempo</h2>
            <div className="relative mt-6 h-16">
              <div className="absolute inset-x-0 top-3 h-px bg-border" />
              {eventosLinhaTempo.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEventoSelecionado(e.id)}
                  style={{ left: `${(i / Math.max(eventosLinhaTempo.length - 1, 1)) * 92 + 4}%` }}
                  className="absolute top-0 -translate-x-1/2 text-center"
                >
                  <span
                    className={cn(
                      "mx-auto block size-3 rounded-full border-2",
                      e.id === evento.id ? "border-primary bg-primary" : "border-muted-foreground bg-card",
                    )}
                  />
                  <span className="mt-2 block font-mono text-[10px] text-muted-foreground">{e.hora.slice(0, 5)}</span>
                  <span className="mt-0.5 block max-w-24 text-[10px] leading-tight text-muted-foreground">
                    {cameraPorId(e.cameraId)?.id}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Resultados */}
        <aside className="space-y-3">
          <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Resultados ({resultados.length})
          </h2>
          {resultados.length === 0 && (
            <p className="rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
              Nenhum evento corresponde à descrição e aos filtros atuais.
            </p>
          )}
          <ul className="space-y-2">
            {resultados.map(({ evento: e, score }) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setEventoSelecionado(e.id)}
                  className={cn(
                    "w-full rounded-md border p-3 text-left transition-colors",
                    e.id === evento.id ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    <span>
                      {e.cameraId} · {e.hora}
                    </span>
                    <span className={cn(score > 0.8 ? "text-success" : score > 0.6 ? "text-warning" : "text-muted-foreground")}>
                      {(score * 100).toFixed(0)}%
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-snug">{e.titulo}</span>
                  <span className="mt-2 flex flex-wrap gap-1">
                    {e.atributos.slice(0, 3).map((a) => (
                      <Badge key={a} variant="secondary" className="text-[10px] font-normal">
                        {a}
                      </Badge>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AppShell>
  );
}
