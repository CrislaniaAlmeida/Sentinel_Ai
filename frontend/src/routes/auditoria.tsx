import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { auditoria, relatorios } from "@/data/sentinel";

export const Route = createFileRoute("/auditoria")({
  head: () => ({
    meta: [
      { title: "Auditoria e Relatórios — Sentinel AI" },
      {
        name: "description",
        content:
          "Trilha de auditoria filtrável de buscas, visualizações e exportações, além dos relatórios de incidente gerados.",
      },
      { property: "og:title", content: "Auditoria e Relatórios — Sentinel AI" },
      {
        property: "og:description",
        content: "Consulte quem fez o quê, quando e de onde, e abra os relatórios de incidente gerados.",
      },
    ],
  }),
  component: Auditoria,
});

function Auditoria() {
  const [busca, setBusca] = useState("");
  const [usuario, setUsuario] = useState("todos");

  const usuarios = Array.from(new Set(auditoria.map((a) => a.usuario)));

  const registros = useMemo(
    () =>
      auditoria.filter((a) => {
        if (usuario !== "todos" && a.usuario !== usuario) return false;
        const texto = `${a.usuario} ${a.acao} ${a.recurso} ${a.origem}`.toLowerCase();
        return texto.includes(busca.toLowerCase());
      }),
    [busca, usuario],
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="font-display text-lg font-semibold">Auditoria e relatórios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Todas as ações sobre vídeo e dados sensíveis ficam registradas para fins de conformidade.
          </p>
        </div>

        <section className="space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Filtrar por ação, recurso ou origem"
              className="sm:max-w-xs"
            />
            <Select value={usuario} onValueChange={setUsuario}>
              <SelectTrigger className="sm:w-64" aria-label="Usuário">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os usuários</SelectItem>
                {usuarios.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="sm:ml-auto"
              onClick={() => toast.success(`${registros.length} registros exportados (simulado)`)}
            >
              <Download className="size-4" /> Exportar CSV
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Data e hora</TableHead>
                  <TableHead>Origem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-muted-foreground">{a.usuario}</TableCell>
                    <TableCell>{a.acao}</TableCell>
                    <TableCell className="font-mono text-xs">{a.recurso}</TableCell>
                    <TableCell className="whitespace-nowrap">{a.dataHora}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.origem}</TableCell>
                  </TableRow>
                ))}
                {registros.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Nenhum registro encontrado para este filtro.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-sm font-semibold">Relatórios de incidente gerados</h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {relatorios.map((r) => (
              <li key={r.id}>
                <Link
                  to="/relatorios/$id"
                  params={{ id: r.id }}
                  className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {r.id}
                    </Badge>
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  <span className="mt-2 block font-medium">{r.titulo}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {r.local} · gerado em {r.geradoEm} por {r.operador}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
