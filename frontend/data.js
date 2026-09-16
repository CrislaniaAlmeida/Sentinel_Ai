/* ============================================================
   SENTINEL AI — mock dataset
   All data below is illustrative sample data for the demo, not
   live footage or real incidents.
   ============================================================ */

const SCENES = ['gate','parking','corridor','entrance','perimeter','loading'];

const CAMERAS = [
  { id:'CAM-01', name:'Portão Principal',      loc:'Acesso Norte',        x:120, y:250, status:'online',  scene:'gate',      ai:true  },
  { id:'CAM-02', name:'Portão B',               loc:'Acesso Leste',        x:640, y:90,  status:'online',  scene:'gate',      ai:true  },
  { id:'CAM-03', name:'Estacionamento A',       loc:'Pátio Sul',           x:210, y:400, status:'online',  scene:'parking',   ai:true  },
  { id:'CAM-04', name:'Estacionamento B',       loc:'Pátio Leste',         x:560, y:360, status:'online',  scene:'parking',   ai:true  },
  { id:'CAM-05', name:'Corredor Norte',         loc:'Bloco A · Piso 1',    x:340, y:150, status:'online',  scene:'corridor',  ai:false },
  { id:'CAM-06', name:'Recepção',               loc:'Bloco Central',       x:400, y:260, status:'online',  scene:'entrance',  ai:false },
  { id:'CAM-07', name:'Área Restrita',          loc:'Bloco C · Subsolo',   x:490, y:440, status:'alert',   scene:'perimeter', ai:true  },
  { id:'CAM-08', name:'Perímetro Oeste',        loc:'Muro Externo',        x:60,  y:120, status:'offline', scene:'perimeter', ai:false },
  { id:'CAM-09', name:'Doca de Carga',          loc:'Bloco D',             x:680, y:420, status:'online',  scene:'loading',   ai:false },
  { id:'CAM-10', name:'Saída de Veículos',      loc:'Acesso Sul',          x:300, y:470, status:'online',  scene:'gate',      ai:true  },
  { id:'CAM-11', name:'Hall de Elevadores',     loc:'Bloco A · Piso 1',    x:390, y:190, status:'online',  scene:'corridor',  ai:false },
  { id:'CAM-12', name:'Guarita',                loc:'Acesso Norte',        x:150, y:180, status:'maintenance', scene:'gate',  ai:false },
];

const RESULTS = [
  { id:'A1B2C3', type:'Veículo', scene:'gate', camera:'Portão B', loc:'Acesso Leste', ts:'2026-09-14T21:58:00', conf:0.92, desc:'Sedã prata, 4 portas, saindo em baixa velocidade.' },
  { id:'D4E5F6', type:'Veículo', scene:'parking', camera:'Estacionamento A', loc:'Pátio Sul', ts:'2026-09-14T21:52:14', conf:0.88, desc:'Correspondência de cor e formato compatível com o alvo.' },
  { id:'G7H8I9', type:'Pessoa', scene:'entrance', camera:'Recepção', loc:'Bloco Central', ts:'2026-09-14T21:47:03', conf:0.95, desc:'Casaco azul-escuro, mochila nas costas, caminhando.' },
  { id:'J1K2L3', type:'Veículo', scene:'gate', camera:'Portão Principal', loc:'Acesso Norte', ts:'2026-09-14T21:41:37', conf:0.79, desc:'Possível mesma placa parcial detectada por OCR.' },
  { id:'M4N5O6', type:'Pessoa', scene:'corridor', camera:'Corredor Norte', loc:'Bloco A · Piso 1', ts:'2026-09-14T21:38:52', conf:0.83, desc:'Indivíduo com boné escuro, passagem rápida.' },
  { id:'P7Q8R9', type:'Veículo', scene:'loading', camera:'Doca de Carga', loc:'Bloco D', ts:'2026-09-14T21:30:10', conf:0.71, desc:'Utilitário branco estacionado além do horário previsto.' },
];

const TIMELINE_EVENTS = [
  { camera:'CAM-04', label:'Estacionamento B', time:'09:41:12', icon:'car' },
  { camera:'CAM-05', label:'Corredor Norte',   time:'09:43:08', icon:'walk' },
  { camera:'CAM-07', label:'Área Restrita',    time:'09:44:51', icon:'alert' },
  { camera:'CAM-02', label:'Portão B',         time:'09:45:26', icon:'gate' },
  { camera:'CAM-03', label:'Estacionamento A', time:'09:46:02', icon:'car' },
  { camera:'CAM-10', label:'Saída',            time:'09:47:40', icon:'exit' },
];

const TRACK_PATH = [
  { camera:'CAM-04', time:'09:41:12', conf:0.94, note:'Primeira detecção' },
  { camera:'CAM-05', time:'09:43:08', conf:0.90, gap:'1m56s' },
  { camera:'CAM-07', time:'09:44:51', conf:0.86, gap:'1m43s' },
  { camera:'CAM-02', time:'09:45:26', conf:0.92, gap:'35s' },
  { camera:'CAM-03', time:'09:46:02', conf:0.89, gap:'36s' },
  { camera:'CAM-10', time:'09:47:40', conf:0.81, gap:'1m38s', current:true },
];

const AUDIT_LOGS = [
  { user:'m.lania',  action:'busca_evento',      resource:'Investigação #A1B2C3', ts:'2026-09-15T09:12:04', ip:'10.20.4.18' },
  { user:'r.matos',  action:'exportar_relatorio', resource:'Relatório #RL-0091',   ts:'2026-09-15T08:57:41', ip:'10.20.4.02' },
  { user:'m.lania',  action:'login',              resource:'Sessão iniciada',       ts:'2026-09-15T08:30:12', ip:'10.20.4.18' },
  { user:'admin',    action:'alterar_config',     resource:'Retenção de vídeo',      ts:'2026-09-14T19:02:55', ip:'10.20.1.01' },
  { user:'f.costa',  action:'visualizar_camera',  resource:'CAM-07 · Área Restrita', ts:'2026-09-14T18:44:09', ip:'10.20.4.44' },
  { user:'m.lania',  action:'busca_evento',       resource:'"veículo prata portão B"', ts:'2026-09-14T18:40:02', ip:'10.20.4.18' },
  { user:'admin',    action:'cadastrar_camera',   resource:'CAM-12 · Guarita',        ts:'2026-09-14T14:21:37', ip:'10.20.1.01' },
  { user:'r.matos',  action:'exportar_relatorio', resource:'Relatório #RL-0090',      ts:'2026-09-13T17:05:22', ip:'10.20.4.02' },
];

const REPORTS = [
  { id:'RL-0092', title:'Furto de veículo — Estacionamento A', ts:'2026-09-14T22:10:00', cameras:5, pages:8, status:'concluido' },
  { id:'RL-0091', title:'Acesso não autorizado — Área Restrita', ts:'2026-09-14T19:02:00', cameras:3, pages:5, status:'concluido' },
  { id:'RL-0090', title:'Rastreamento de indivíduo — Bloco A', ts:'2026-09-13T16:40:00', cameras:4, pages:6, status:'concluido' },
  { id:'RL-0089', title:'Movimentação suspeita — Doca de Carga', ts:'2026-09-12T11:15:00', cameras:2, pages:4, status:'rascunho' },
  { id:'RL-0088', title:'Verificação de placa restrita — Portão B', ts:'2026-09-11T20:33:00', cameras:1, pages:3, status:'concluido' },
];

const ALERTS = [
  { level:'critical', title:'Acesso não autorizado detectado', desc:'Pessoa não identificada na Área Restrita (Bloco C · Subsolo) fora do horário permitido.', camera:'CAM-07', ts:'2026-09-15T09:44:51', tag:'Segurança' },
  { level:'ai',       title:'Correspondência de alta confiança', desc:'Veículo compatível com busca ativa "sedã prata portão B" localizado.', camera:'CAM-02', ts:'2026-09-15T09:31:07', tag:'IA · Busca' },
  { level:'warn',     title:'Câmera em manutenção prolongada', desc:'CAM-12 (Guarita) está em modo de manutenção há mais de 4 horas.', camera:'CAM-12', ts:'2026-09-15T08:02:00', tag:'Sistema' },
  { level:'critical', title:'Câmera offline', desc:'Perda de sinal na CAM-08 (Perímetro Oeste). Verificar conectividade.', camera:'CAM-08', ts:'2026-09-15T07:48:19', tag:'Sistema' },
  { level:'info',     title:'Relatório gerado automaticamente', desc:'Relatório de incidente RL-0092 compilado e disponível para exportação.', camera:'—', ts:'2026-09-14T22:10:03', tag:'Relatório' },
  { level:'warn',     title:'Baixa confiança em leitura de placa', desc:'OCR retornou confiança de 61% para veículo na Doca de Carga.', camera:'CAM-09', ts:'2026-09-14T21:30:12', tag:'IA · OCR' },
];

const USERS = [
  { name:'Mariana Lania',  role:'Operadora de Segurança', status:'online',  initials:'ML' },
  { name:'Ricardo Matos',  role:'Gerente de Segurança',   status:'online',  initials:'RM' },
  { name:'Fernanda Costa', role:'Auditora',               status:'offline', initials:'FC' },
  { name:'Admin Sistema',  role:'Administrador',          status:'online',  initials:'AS' },
];

const CURRENT_USER = { name:'Mariana Lania', role:'Operadora de Segurança', initials:'ML' };
