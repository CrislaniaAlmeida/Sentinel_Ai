/* ============================================================
   SENTINEL AI — mock dataset
   All data below is illustrative sample data for the demo, not
   live footage or real incidents. Cenário: Shopping Metrópole (fictício).
   ============================================================ */

const SCENES = ['entrance','corridor','foodcourt','parking','service'];

/* img: quadro fixo gerado por IA (Shopping Metrópole, cenário fictício).
   Ficam em frontend/img/cameras/. Se uma câmera não tiver "img",
   o app volta a desenhar o gradiente antigo. */
const CAMERAS = [
  { id:'CAM-01', name:'Entrada Norte',              loc:'Piso L1 · Acesso Norte',  x:120, y:250, status:'online',      scene:'entrance',  ai:true,  img:'img/cameras/cam-01.jpg' },
  { id:'CAM-02', name:'Átrio Central',              loc:'Piso L1 · Centro',        x:640, y:90,  status:'online',      scene:'corridor',  ai:true,  img:'img/cameras/cam-02.jpg' },
  { id:'CAM-03', name:'Praça de Alimentação Norte', loc:'Piso L2 · Ala Norte',     x:210, y:400, status:'online',      scene:'foodcourt', ai:true,  img:'img/cameras/cam-03.jpg' },
  { id:'CAM-04', name:'Corredor Oeste',             loc:'Piso L1 · Ala Oeste',     x:560, y:360, status:'online',      scene:'corridor',  ai:true,  img:'img/cameras/cam-04.jpg' },
  { id:'CAM-05', name:'Escada Rolante',             loc:'Piso L1 → L2',            x:340, y:150, status:'online',      scene:'corridor',  ai:false, img:'img/cameras/cam-05.jpg' },
  { id:'CAM-06', name:'Foyer do Cinema',            loc:'Piso L3',                 x:400, y:260, status:'online',      scene:'entrance',  ai:false, img:'img/cameras/cam-06.jpg' },
  { id:'CAM-07', name:'Estacionamento G2 Sul',      loc:'Subsolo G2',              x:490, y:440, status:'online',      scene:'parking',   ai:true,  img:'img/cameras/cam-07.jpg' },
  { id:'CAM-08', name:'Corredor Norte',             loc:'Piso L2 · Ala Norte',     x:60,  y:120, status:'offline',     scene:'corridor',  ai:false, img:'img/cameras/cam-08.jpg' },
  { id:'CAM-09', name:'Acesso aos Sanitários',      loc:'Piso L1 · Ala Leste',     x:680, y:420, status:'maintenance', scene:'corridor',  ai:false, img:'img/cameras/cam-09.jpg' },
  { id:'CAM-10', name:'Entrada Principal Sul',      loc:'Piso L1 · Acesso Sul',    x:300, y:470, status:'online',      scene:'entrance',  ai:true,  img:'img/cameras/cam-10.jpg' },
  { id:'CAM-11', name:'Praça de Alimentação Sul',   loc:'Piso L2 · Ala Sul',       x:390, y:190, status:'online',      scene:'foodcourt', ai:false, img:'img/cameras/cam-11.jpg' },
  { id:'CAM-12', name:'Área de Serviço',            loc:'Elevador de Carga · L1',  x:150, y:180, status:'alert',       scene:'service',   ai:true,  img:'img/cameras/cam-12.jpg' },
];

const RESULTS = [
  { id:'A1B2C3', type:'Pessoa',  scene:'service',   camera:'Área de Serviço',            loc:'Elevador de Carga · L1', ts:'2026-09-14T21:58:00', conf:0.92, desc:'Camiseta vermelha, bolsa a tiracolo, acessando área restrita.' },
  { id:'D4E5F6', type:'Pessoa',  scene:'corridor',  camera:'Átrio Central',              loc:'Piso L1 · Centro',       ts:'2026-09-14T21:52:14', conf:0.88, desc:'Correspondência de vestimenta e porte compatível com o alvo.' },
  { id:'G7H8I9', type:'Pessoa',  scene:'entrance',  camera:'Entrada Principal Sul',      loc:'Piso L1 · Acesso Sul',   ts:'2026-09-14T21:47:03', conf:0.95, desc:'Camiseta vermelha, calça escura, entrando pelo acesso sul.' },
  { id:'J1K2L3', type:'Veículo', scene:'parking',   camera:'Estacionamento G2 Sul',      loc:'Subsolo G2',             ts:'2026-09-14T21:41:37', conf:0.79, desc:'Hatch branco associado ao alvo; placa parcial lida por OCR.' },
  { id:'M4N5O6', type:'Pessoa',  scene:'corridor',  camera:'Corredor Oeste',             loc:'Piso L1 · Ala Oeste',    ts:'2026-09-14T21:38:52', conf:0.83, desc:'Passagem rápida em frente às lojas, sentido elevadores.' },
  { id:'P7Q8R9', type:'Pessoa',  scene:'foodcourt', camera:'Praça de Alimentação Norte', loc:'Piso L2 · Ala Norte',    ts:'2026-09-14T21:30:10', conf:0.71, desc:'Possível alvo sentado próximo ao balcão; visão parcial.' },
];

const TIMELINE_EVENTS = [
  { camera:'CAM-07', label:'Estacionamento G2', time:'09:41:12', icon:'car' },
  { camera:'CAM-10', label:'Entrada Sul',       time:'09:43:08', icon:'walk' },
  { camera:'CAM-02', label:'Átrio Central',     time:'09:44:51', icon:'walk' },
  { camera:'CAM-05', label:'Escada Rolante',    time:'09:45:26', icon:'walk' },
  { camera:'CAM-04', label:'Corredor Oeste',    time:'09:46:02', icon:'walk' },
  { camera:'CAM-12', label:'Área de Serviço',   time:'09:47:40', icon:'alert' },
];

const TRACK_PATH = [
  { camera:'CAM-07', time:'09:41:12', conf:0.94, note:'Primeira detecção' },
  { camera:'CAM-10', time:'09:43:08', conf:0.90, gap:'1m56s' },
  { camera:'CAM-02', time:'09:44:51', conf:0.86, gap:'1m43s' },
  { camera:'CAM-05', time:'09:45:26', conf:0.92, gap:'35s' },
  { camera:'CAM-04', time:'09:46:02', conf:0.89, gap:'36s' },
  { camera:'CAM-12', time:'09:47:40', conf:0.81, gap:'1m38s', current:true },
];

const AUDIT_LOGS = [
  { user:'m.lania',  action:'busca_evento',       resource:'Investigação #A1B2C3',            ts:'2026-09-15T09:12:04', ip:'10.20.4.18' },
  { user:'r.matos',  action:'exportar_relatorio', resource:'Relatório #RL-0091',              ts:'2026-09-15T08:57:41', ip:'10.20.4.02' },
  { user:'m.lania',  action:'login',              resource:'Sessão iniciada',                 ts:'2026-09-15T08:30:12', ip:'10.20.4.18' },
  { user:'admin',    action:'alterar_config',     resource:'Retenção de vídeo',               ts:'2026-09-14T19:02:55', ip:'10.20.1.01' },
  { user:'f.costa',  action:'visualizar_camera',  resource:'CAM-12 · Área de Serviço',        ts:'2026-09-14T18:44:09', ip:'10.20.4.44' },
  { user:'m.lania',  action:'busca_evento',       resource:'"pessoa camiseta vermelha átrio"', ts:'2026-09-14T18:40:02', ip:'10.20.4.18' },
  { user:'admin',    action:'cadastrar_camera',   resource:'CAM-11 · Praça de Alimentação Sul', ts:'2026-09-14T14:21:37', ip:'10.20.1.01' },
  { user:'r.matos',  action:'exportar_relatorio', resource:'Relatório #RL-0090',              ts:'2026-09-13T17:05:22', ip:'10.20.4.02' },
];

const REPORTS = [
  { id:'RL-0092', title:'Furto em loja — Corredor Oeste',                ts:'2026-09-14T22:10:00', cameras:5, pages:8, status:'concluido' },
  { id:'RL-0091', title:'Acesso não autorizado — Área de Serviço',       ts:'2026-09-14T19:02:00', cameras:3, pages:5, status:'concluido' },
  { id:'RL-0090', title:'Criança perdida — Praça de Alimentação Norte',  ts:'2026-09-13T16:40:00', cameras:4, pages:6, status:'concluido' },
  { id:'RL-0089', title:'Dano a veículo — Estacionamento G2 Sul',        ts:'2026-09-12T11:15:00', cameras:2, pages:4, status:'rascunho' },
  { id:'RL-0088', title:'Objeto abandonado — Átrio Central',             ts:'2026-09-11T20:33:00', cameras:1, pages:3, status:'concluido' },
];

const ALERTS = [
  { level:'critical', title:'Acesso não autorizado detectado',   desc:'Pessoa sem crachá na Área de Serviço (elevador de carga), acesso restrito a funcionários.', camera:'CAM-12', ts:'2026-09-15T09:47:40', tag:'Segurança' },
  { level:'ai',       title:'Correspondência de alta confiança', desc:'Pessoa compatível com busca ativa "camiseta vermelha no átrio" localizada.',             camera:'CAM-02', ts:'2026-09-15T09:31:07', tag:'IA · Busca' },
  { level:'warn',     title:'Câmera em manutenção prolongada',   desc:'CAM-09 (Acesso aos Sanitários) está em modo de manutenção há mais de 4 horas.',           camera:'CAM-09', ts:'2026-09-15T08:02:00', tag:'Sistema' },
  { level:'critical', title:'Câmera offline',                    desc:'Perda de sinal na CAM-08 (Corredor Norte · Piso L2). Verificar conectividade.',          camera:'CAM-08', ts:'2026-09-15T07:48:19', tag:'Sistema' },
  { level:'info',     title:'Relatório gerado automaticamente',  desc:'Relatório de incidente RL-0092 compilado e disponível para exportação.',                 camera:'—',      ts:'2026-09-14T22:10:03', tag:'Relatório' },
  { level:'warn',     title:'Baixa confiança em leitura de placa', desc:'OCR retornou confiança de 61% para veículo no Estacionamento G2 Sul.',               camera:'CAM-07', ts:'2026-09-14T21:30:12', tag:'IA · OCR' },
];

const USERS = [
  { name:'Mariana Lania',  role:'Operadora de Segurança', status:'online',  initials:'ML' },
  { name:'Ricardo Matos',  role:'Gerente de Segurança',   status:'online',  initials:'RM' },
  { name:'Fernanda Costa', role:'Auditora',               status:'offline', initials:'FC' },
  { name:'Admin Sistema',  role:'Administrador',          status:'online',  initials:'AS' },
];

const CURRENT_USER = { name:'Mariana Lania', role:'Operadora de Segurança', initials:'ML' };
