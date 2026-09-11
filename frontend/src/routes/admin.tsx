import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cameras as camerasIniciais, usuarios as usuariosIniciais } from "@/data/sentinel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Sentinel AI" },
      {
        name: "description",
        content:
          "Cadastro de câmeras, gestão de usuários por papel e controles de privacidade e retenção de vídeo do Sentinel AI.",
      },
      { property: "og:title", content: "Administração — Sentinel AI" },
      {
        property: "og:description",
        content: "Configure câmeras, permissões, reconhecimento facial e prazos de retenção.",
      },
    ],
  }),
  component: Administracao,
});


function Administracao() {
  const [cameras, setCameras] = useState(camerasIniciais);
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [facial, setFacial] = useState(false);
  const [retencao, setRetencao] = useState("30");
  const [form, setForm] = useState({ nome: "", local: "", stream: "", protocolo: "RTSP" as "RTSP" | "ONVIF" });

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div>
          <h1 className="font-display text-lg font-semibold">Administração</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configurações da instalação. As alterações valem apenas durante esta sessão do protótipo.
          </p>
        </div>

        <Tabs defaultValue="cameras">
          <TabsList>
            <TabsTrigger value="cameras">Câmeras</TabsTrigger>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="privacidade">Privacidade e retenção</TabsTrigger>
          </TabsList>

          <TabsContent value="cameras" className="mt-4 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.nome) return;
                const novo = {
                  id: `CAM-${String(cameras.length + 1).padStart(2, "0")}`,
                  nome: form.nome,
                  local: form.local || "Não informado",
                  status: "online" as const,
                  protocolo: form.protocolo,
                  stream: form.stream || "rtsp://—",
                  frame: cameras[0]!.frame,
                  x: 50,
                  y: 50,
                };
                setCameras([...cameras, novo]);
                setForm({ nome: "", local: "", stream: "", protocolo: "RTSP" });
                toast.success(`Câmera ${novo.id} cadastrada`);
              }}
              className="space-y-3 rounded-lg border border-border bg-card p-4"
            >
              <h2 className="font-display text-sm font-semibold">Cadastrar câmera</h2>
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="local">Localização</Label>
                <Input id="local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stream">Endereço do stream</Label>
                <Input
                  id="stream"
                  placeholder="rtsp://10.0.4.20:554/stream1"
                  value={form.stream}
                  onChange={(e) => setForm({ ...form, stream: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Protocolo</Label>
                <Select
                  value={form.protocolo}
                  onValueChange={(v) => setForm({ ...form, protocolo: v as "RTSP" | "ONVIF" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RTSP">RTSP</SelectItem>
                    <SelectItem value="ONVIF">ONVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="size-4" /> Adicionar câmera
              </Button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Protocolo</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cameras.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell>{c.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{c.local}</TableCell>
                      <TableCell>{c.protocolo}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === "online" ? "secondary" : "destructive"}>{c.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="usuarios" className="mt-4">
            <div className="overflow-x-auto rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead className="text-right">Conta ativa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.nome}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.papel}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={u.ativo}
                          aria-label={`Ativar ${u.nome}`}
                          onCheckedChange={(valor) => {
                            setUsuarios(usuarios.map((x) => (x.id === u.id ? { ...x, ativo: valor } : x)));
                            toast.info(`${u.nome}: conta ${valor ? "ativada" : "desativada"}`);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="privacidade" className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-4 rounded-lg border border-border bg-card p-4">
              <h2 className="font-display text-sm font-semibold">Módulos sensíveis</h2>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Reconhecimento facial</p>
                  <p className="text-xs text-muted-foreground">
                    Requer parecer jurídico e base legal registrada para a unidade.
                  </p>
                </div>
                <Switch
                  checked={facial}
                  onCheckedChange={(v) => {
                    setFacial(v);
                    toast.info(`Reconhecimento facial ${v ? "ativado" : "desativado"}`);
                  }}
                  aria-label="Reconhecimento facial"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Retenção de vídeo e metadados</Label>
                <Select value={retencao} onValueChange={setRetencao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="180">180 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="font-display text-sm font-semibold">Status de conformidade</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  "Trilha de auditoria ativa para todas as buscas e exportações",
                  `Retenção configurada em ${retencao} dias`,
                  facial
                    ? "Reconhecimento facial ativo — exige base legal documentada"
                    : "Reconhecimento facial desativado nesta unidade",
                  "Acesso a vídeo restrito por papel (RBAC)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
