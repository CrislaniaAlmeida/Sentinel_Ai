import camGaragem from "@/assets/cam-garagem.jpg";
import camCorredor from "@/assets/cam-corredor.jpg";
import camPortao from "@/assets/cam-portao.jpg";
import camDoca from "@/assets/cam-doca.jpg";

export type CameraStatus = "online" | "offline";

export type Camera = {
  id: string;
  nome: string;
  local: string;
  status: CameraStatus;
  protocolo: "RTSP" | "ONVIF";
  stream: string;
  frame: string;
  /** posição na planta, em porcentagem */
  x: number;
  y: number;
};

export const cameras: Camera[] = [
  {
    id: "CAM-01",
    nome: "Portão B — Entrada de veículos",
    local: "Perímetro leste",
    status: "online",
    protocolo: "RTSP",
    stream: "rtsp://10.0.4.11:554/stream1",
    frame: camPortao,
    x: 82,
    y: 26,
  },
  {
    id: "CAM-02",
    nome: "Garagem G1 — Setor B",
    local: "Subsolo 1",
    status: "online",
    protocolo: "ONVIF",
    stream: "rtsp://10.0.4.12:554/stream1",
    frame: camGaragem,
    x: 58,
    y: 52,
  },
  {
    id: "CAM-03",
    nome: "Corredor central — Piso L1",
    local: "Área comum",
    status: "online",
    protocolo: "ONVIF",
    stream: "rtsp://10.0.4.13:554/stream1",
    frame: camCorredor,
    x: 34,
    y: 44,
  },
  {
    id: "CAM-04",
    nome: "Doca de carga — Pátio",
    local: "Perímetro norte",
    status: "online",
    protocolo: "RTSP",
    stream: "rtsp://10.0.4.14:554/stream1",
    frame: camDoca,
    x: 20,
    y: 18,
  },
  {
    id: "CAM-05",
    nome: "Escada de serviço — L1",
    local: "Área restrita",
    status: "offline",
    protocolo: "RTSP",
    stream: "rtsp://10.0.4.15:554/stream1",
    frame: camCorredor,
    x: 46,
    y: 74,
  },
  {
    id: "CAM-06",
    nome: "Saída de pedestres — Portaria",
    local: "Perímetro sul",
    status: "online",
    protocolo: "ONVIF",
    stream: "rtsp://10.0.4.16:554/stream1",
    frame: camPortao,
    x: 72,
    y: 82,
  },
];

export type Evento = {
  id: string;
  cameraId: string;
  hora: string; // HH:MM:SS
  tipo: "pessoa" | "veiculo";
  titulo: string;
  atributos: string[];
  placa?: string;
  confianca: number; // 0..1
  alvoId?: string;
  restricao?: boolean;
};

export const eventos: Evento[] = [
  {
    id: "EV-1041",
    cameraId: "CAM-01",
    hora: "22:04:12",
    tipo: "veiculo",
    titulo: "Veículo prata entrando pelo Portão B",
    atributos: ["sedan", "prata", "portão B", "entrada", "noite"],
    placa: "RQK-7C21",
    confianca: 0.94,
    alvoId: "ALV-01",
  },
  {
    id: "EV-1042",
    cameraId: "CAM-02",
    hora: "22:06:48",
    tipo: "veiculo",
    titulo: "Veículo prata estacionando no Setor B",
    atributos: ["sedan", "prata", "garagem", "manobra"],
    placa: "RQK-7C21",
    confianca: 0.91,
    alvoId: "ALV-01",
  },
  {
    id: "EV-1043",
    cameraId: "CAM-02",
    hora: "22:08:03",
    tipo: "pessoa",
    titulo: "Homem de casaco azul deixando o veículo",
    atributos: ["homem", "casaco azul", "mochila", "garagem"],
    confianca: 0.88,
    alvoId: "ALV-02",
  },
  {
    id: "EV-1044",
    cameraId: "CAM-03",
    hora: "22:10:27",
    tipo: "pessoa",
    titulo: "Homem de casaco azul no corredor central",
    atributos: ["homem", "casaco azul", "mochila", "andando", "corredor"],
    confianca: 0.83,
    alvoId: "ALV-02",
  },
  {
    id: "EV-1045",
    cameraId: "CAM-04",
    hora: "22:14:55",
    tipo: "pessoa",
    titulo: "Pessoa correndo próximo à doca de carga",
    atributos: ["homem", "casaco azul", "correndo", "doca", "pátio"],
    confianca: 0.76,
    alvoId: "ALV-02",
  },
  {
    id: "EV-1046",
    cameraId: "CAM-04",
    hora: "22:16:31",
    tipo: "veiculo",
    titulo: "Utilitário branco parado na doca fora do horário",
    atributos: ["utilitário", "branco", "doca", "parado"],
    placa: "FDW-2H88",
    confianca: 0.79,
    restricao: true,
  },
  {
    id: "EV-1047",
    cameraId: "CAM-02",
    hora: "22:21:09",
    tipo: "pessoa",
    titulo: "Homem de casaco azul retornando à garagem",
    atributos: ["homem", "casaco azul", "garagem", "andando"],
    confianca: 0.81,
    alvoId: "ALV-02",
  },
  {
    id: "EV-1048",
    cameraId: "CAM-01",
    hora: "22:24:40",
    tipo: "veiculo",
    titulo: "Veículo prata saindo pelo Portão B",
    atributos: ["sedan", "prata", "portão B", "saída", "noite"],
    placa: "RQK-7C21",
    confianca: 0.96,
    alvoId: "ALV-01",
  },
  {
    id: "EV-1049",
    cameraId: "CAM-06",
    hora: "22:31:14",
    tipo: "pessoa",
    titulo: "Mulher de blusa vermelha na saída de pedestres",
    atributos: ["mulher", "blusa vermelha", "saída", "portaria"],
    confianca: 0.72,
  },
  {
    id: "EV-1050",
    cameraId: "CAM-03",
    hora: "22:38:02",
    tipo: "pessoa",
    titulo: "Dois homens de uniforme no corredor central",
    atributos: ["homem", "uniforme", "corredor", "ronda"],
    confianca: 0.69,
  },
  {
    id: "EV-1051",
    cameraId: "CAM-06",
    hora: "22:44:51",
    tipo: "veiculo",
    titulo: "Motocicleta preta cruzando a portaria",
    atributos: ["motocicleta", "preta", "portaria", "saída"],
    placa: "LTM-4B03",
    confianca: 0.74,
  },
];

export type Alvo = {
  id: string;
  rotulo: string;
  tipo: "pessoa" | "veiculo";
  descricao: string;
  /** sequência de câmeras que compõem o trajeto */
  trajeto: string[];
};

export const alvos: Alvo[] = [
  {
    id: "ALV-01",
    rotulo: "Sedan prata RQK-7C21",
    tipo: "veiculo",
    descricao: "Sedan prata, entrada e saída pelo Portão B, permanência de 20 min na garagem.",
    trajeto: ["CAM-01", "CAM-02", "CAM-01"],
  },
  {
    id: "ALV-02",
    rotulo: "Homem de casaco azul",
    tipo: "pessoa",
    descricao: "Homem adulto, casaco azul e mochila escura, trajeto garagem → corredor → doca.",
    trajeto: ["CAM-02", "CAM-03", "CAM-04", "CAM-02"],
  },
];

export type Alerta = {
  id: string;
  cameraId: string;
  hora: string;
  severidade: "alta" | "media" | "baixa";
  mensagem: string;
};

export const alertas: Alerta[] = [
  {
    id: "AL-01",
    cameraId: "CAM-04",
    hora: "22:16:31",
    severidade: "alta",
    mensagem: "Placa FDW-2H88 corresponde a base restritiva",
  },
  {
    id: "AL-02",
    cameraId: "CAM-04",
    hora: "22:14:55",
    severidade: "media",
    mensagem: "Pessoa correndo em área de doca fora do horário",
  },
  {
    id: "AL-03",
    cameraId: "CAM-05",
    hora: "22:12:08",
    severidade: "media",
    mensagem: "Câmera sem sinal há 12 minutos",
  },
  {
    id: "AL-04",
    cameraId: "CAM-02",
    hora: "22:08:03",
    severidade: "baixa",
    mensagem: "Permanência prolongada em vaga de visitante",
  },
  {
    id: "AL-05",
    cameraId: "CAM-01",
    hora: "22:24:40",
    severidade: "baixa",
    mensagem: "Saída de veículo com placa já sinalizada em investigação",
  },
];

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: "Administrador" | "Operador" | "Auditor";
  ativo: boolean;
};

export const usuarios: Usuario[] = [
  { id: "U-01", nome: "Ricardo Menezes", email: "ricardo@sentinel.ai", papel: "Administrador", ativo: true },
  { id: "U-02", nome: "Camila Duarte", email: "camila@sentinel.ai", papel: "Operador", ativo: true },
  { id: "U-03", nome: "Jonas Ferreira", email: "jonas@sentinel.ai", papel: "Operador", ativo: true },
  { id: "U-04", nome: "Auditoria Interna", email: "auditoria@sentinel.ai", papel: "Auditor", ativo: false },
];

export type RegistroAuditoria = {
  id: string;
  usuario: string;
  acao: string;
  recurso: string;
  dataHora: string;
  origem: string;
};

export const auditoria: RegistroAuditoria[] = [
  { id: "A-9001", usuario: "camila@sentinel.ai", acao: "Busca por descrição", recurso: "\"veículo prata portão B\"", dataHora: "09/09/2026 22:26:11", origem: "10.0.9.42" },
  { id: "A-9002", usuario: "camila@sentinel.ai", acao: "Visualização de vídeo", recurso: "CAM-01 / EV-1048", dataHora: "09/09/2026 22:27:03", origem: "10.0.9.42" },
  { id: "A-9003", usuario: "jonas@sentinel.ai", acao: "Consulta de placa (OCR)", recurso: "RQK-7C21", dataHora: "09/09/2026 22:29:47", origem: "10.0.9.51" },
  { id: "A-9004", usuario: "ricardo@sentinel.ai", acao: "Alteração de configuração", recurso: "Reconhecimento facial: desativado", dataHora: "09/09/2026 22:31:20", origem: "10.0.9.7" },
  { id: "A-9005", usuario: "camila@sentinel.ai", acao: "Exportação de relatório", recurso: "INC-2026-0912", dataHora: "09/09/2026 22:35:58", origem: "10.0.9.42" },
  { id: "A-9006", usuario: "auditoria@sentinel.ai", acao: "Consulta de trilha de auditoria", recurso: "Período 01/09–09/09", dataHora: "09/09/2026 23:02:14", origem: "10.0.9.88" },
  { id: "A-9007", usuario: "jonas@sentinel.ai", acao: "Rastreamento entre câmeras", recurso: "ALV-02", dataHora: "09/09/2026 23:10:05", origem: "10.0.9.51" },
  { id: "A-9008", usuario: "ricardo@sentinel.ai", acao: "Cadastro de câmera", recurso: "CAM-06", dataHora: "09/09/2026 23:22:41", origem: "10.0.9.7" },
];

export type Relatorio = {
  id: string;
  titulo: string;
  local: string;
  geradoEm: string;
  operador: string;
  alvoId: string;
  eventoIds: string[];
  resumo: string;
};

export const relatorios: Relatorio[] = [
  {
    id: "INC-2026-0912",
    titulo: "Permanência suspeita na doca de carga",
    local: "Unidade Shopping Norte — Perímetro norte",
    geradoEm: "09/09/2026 22:35",
    operador: "Camila Duarte",
    alvoId: "ALV-02",
    eventoIds: ["EV-1043", "EV-1044", "EV-1045", "EV-1047"],
    resumo:
      "Alvo identificado deixando veículo na garagem G1, deslocando-se pelo corredor central até a doca de carga, onde permaneceu por aproximadamente 90 segundos antes de retornar ao veículo.",
  },
  {
    id: "INC-2026-0913",
    titulo: "Veículo com placa em base restritiva",
    local: "Unidade Shopping Norte — Doca de carga",
    geradoEm: "09/09/2026 23:02",
    operador: "Jonas Ferreira",
    alvoId: "ALV-01",
    eventoIds: ["EV-1041", "EV-1046", "EV-1048"],
    resumo:
      "Utilitário branco de placa FDW-2H88 detectado na doca fora do horário autorizado, com correspondência em base restritiva. Sedan prata associado entrou e saiu pelo Portão B no mesmo intervalo.",
  },
];

/** Busca por descrição simulada: correspondência por palavras-chave. */
export function buscarEventos(consulta: string, eventosBase: Evento[] = eventos) {
  const termos = consulta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  if (termos.length === 0) {
    return eventosBase.map((evento) => ({ evento, score: evento.confianca }));
  }

  const normalizar = (texto: string) =>
    texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return eventosBase
    .map((evento) => {
      const alvo = normalizar(
        [evento.titulo, evento.atributos.join(" "), evento.placa ?? "", evento.tipo].join(" "),
      );
      const acertos = termos.filter((t) => alvo.includes(t)).length;
      const relevancia = acertos / termos.length;
      return { evento, score: relevancia === 0 ? 0 : Math.min(0.99, relevancia * 0.7 + evento.confianca * 0.3) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export const cameraPorId = (id: string) => cameras.find((c) => c.id === id);
export const eventoPorId = (id: string) => eventos.find((e) => e.id === id);
export const alvoPorId = (id: string) => alvos.find((a) => a.id === id);
