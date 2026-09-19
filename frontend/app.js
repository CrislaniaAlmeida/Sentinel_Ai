/* ============================================================
   SENTINEL AI — application logic
   Static front-end demo. All camera feeds are generative
   placeholders (gradients + silhouettes), not real video.
   ============================================================ */

/* ---------------- helpers ---------------- */
function hash(str){ let h=0; for(let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; } return Math.abs(h); }
function seededPct(seed, salt){ return (hash(seed+':'+salt) % 1000) / 1000; }
function pad2(n){ return String(n).padStart(2,'0'); }
function fmtTime(ts){ const d=new Date(ts); return pad2(d.getHours())+':'+pad2(d.getMinutes()); }
function fmtDate(ts){ const d=new Date(ts); return pad2(d.getDate())+'/'+pad2(d.getMonth()+1)+'/'+d.getFullYear(); }
function fmtDateTime(ts){ return fmtDate(ts)+' · '+fmtTime(ts); }
function confClass(c){ return c>=0.85 ? 'high' : 'mid'; }
function confNote(c){ return c>=0.9 ? 'Alta correspondência visual' : c>=0.8 ? 'Correspondência provável' : 'Correspondência parcial — revisão recomendada'; }
function esc(s){ return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

const SCENE_GRADIENT = {
  gate:      'linear-gradient(160deg,#0d1e2c,#050a10 75%)',
  parking:   'linear-gradient(160deg,#12161f,#050608 75%)',
  corridor:  'linear-gradient(160deg,#1b1710,#07060a 75%)',
  entrance:  'linear-gradient(160deg,#0d1f1c,#06090c 75%)',
  perimeter: 'linear-gradient(160deg,#0e1c14,#06090a 75%)',
  loading:   'linear-gradient(160deg,#1e1710,#08090c 75%)',
};
const SCENE_ICON = { gate:'car', parking:'car', corridor:'walk', entrance:'walk', perimeter:'walk', loading:'car' };
const SCENE_CLASS_LABEL = { gate:'VEÍCULO', parking:'VEÍCULO', corridor:'PESSOA', entrance:'PESSOA', perimeter:'PESSOA', loading:'VEÍCULO' };

function sceneFeedHTML(cam, seed){
  const grad = SCENE_GRADIENT[cam.scene] || SCENE_GRADIENT.corridor;
  const left = 18 + seededPct(seed,'l')*54;
  const top  = 30 + seededPct(seed,'t')*38;
  const ic = SCENE_ICON[cam.scene] || 'walk';
  const size = 30 + seededPct(seed,'s')*22;
  return `<div class="scene" style="background:${grad}">
    <div class="silhouette" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px;color:#3a4d5e">${icon(ic)}</div>
  </div>`;
}

function camTileHTML(cam, opts){
  opts = opts || {};
  const aiActive = !!opts.aiActive;
  const offline = cam.status === 'offline' || cam.status === 'maintenance';
  const cls = ['cam-tile'];
  if(offline) cls.push('offline');
  if(cam.status==='alert') cls.push('alert');
  else if(aiActive && !offline) cls.push('ai-hit');
  const label = SCENE_CLASS_LABEL[cam.scene] || 'ALVO';
  const confPct = 82 + Math.round(seededPct(cam.id,'conf')*15);
  const bx = 30 + seededPct(cam.id,'bx')*30, by = 26 + seededPct(cam.id,'by')*28;
  const bw = 16 + seededPct(cam.id,'bw')*10, bh = 22 + seededPct(cam.id,'bh')*14;
  return `<div class="${cls.join(' ')}" data-cam="${cam.id}" role="button" tabindex="0" aria-label="${esc(cam.name)}">
    <div class="cam-feed">
      ${offline ? '' : sceneFeedHTML(cam, cam.id)}
      ${offline ? '' : '<div class="cam-noise"></div>'}
    </div>
    ${offline ? `<div class="cam-offline-msg">${icon('wifiOff')}<span>${cam.status==='maintenance'?'EM MANUTENÇÃO':'SEM SINAL'}</span></div>` : ''}
    <div class="cam-overlay-top">
      <span class="cam-id">${cam.id}</span>
      <span class="cam-rec">${offline?'':'<span class="dot pulse" style="width:5px;height:5px"></span>'} ${offline?'OFF':'REC · <span class="live-clock-mini">--:--</span>'}</span>
    </div>
    ${(!offline && aiActive) ? `<div class="ai-tag" style="left:${bx}%;top:${by}%;width:${bw}%;height:${bh}%"><span class="ai-tag-label">${label} ${confPct}%</span></div>` : ''}
    <div class="cam-overlay-bottom">
      <span class="cam-loc">${esc(cam.name)}</span>
      <span class="cam-status-badge ${offline?'offline':'online'}">${cam.status==='maintenance'?'manut.':cam.status}</span>
    </div>
  </div>`;
}

/* ---------------- operational map ---------------- */
const ZONES = [
  { x:20, y:60, w:220, h:180, label:'ESTACIONAMENTO A' },
  { x:470, y:280, w:250, h:200, label:'ESTACIONAMENTO B' },
  { x:260, y:80, w:190, h:150, label:'BLOCO A · CORREDORES' },
  { x:400, y:340, w:180, h:150, label:'ÁREA RESTRITA · BLOCO C' },
  { x:600, y:340, w:150, h:140, label:'DOCA DE CARGA' },
];

function statusColorVar(status){
  if(status==='online') return 'var(--sig-online)';
  if(status==='alert') return 'var(--sig-critical)';
  if(status==='maintenance') return 'var(--sig-warn)';
  return 'var(--sig-inactive)';
}

function buildOperationalMap(opts){
  opts = opts || {};
  const activeIdx = typeof opts.activeIndex === 'number' ? opts.activeIndex : null;
  const pathCams = TRACK_PATH.map(t => CAMERAS.find(c=>c.id===t.camera)).filter(Boolean);
  const pathD = pathCams.map((c,i)=> (i===0?'M':'L') + c.x + ' ' + c.y).join(' ');

  const zonesSvg = ZONES.map(z => `
    <rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="10" fill="rgba(23,195,255,0.035)" stroke="var(--border-strong)" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="${z.x+10}" y="${z.y+18}" fill="var(--text-faint)" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1">${z.label}</text>
  `).join('');

  const camsSvg = CAMERAS.map(c => {
    const col = statusColorVar(c.status);
    const pulse = c.status==='online' ? `<circle cx="${c.x}" cy="${c.y}" r="9" fill="none" stroke="${col}" stroke-width="1.4" opacity=".55" class="map-pulse"/>` : '';
    return `<g class="map-cam-node" data-cam="${c.id}" style="cursor:pointer">
      ${pulse}
      <circle cx="${c.x}" cy="${c.y}" r="6" fill="${col}" stroke="#04070a" stroke-width="1.5"/>
      <text x="${c.x}" y="${c.y-12}" fill="var(--text-md)" font-family="JetBrains Mono, monospace" font-size="8.5" text-anchor="middle">${c.id}</text>
    </g>`;
  }).join('');

  const activeCam = activeIdx!=null ? pathCams[activeIdx] : null;

  return `<svg viewBox="0 0 760 520" preserveAspectRatio="xMidYMid meet">
    <rect x="1" y="1" width="758" height="518" rx="16" fill="none" stroke="var(--border)" stroke-width="1"/>
    ${zonesSvg}
    <path d="${pathD}" fill="none" stroke="var(--sig-ai)" stroke-width="2" stroke-dasharray="7 6" opacity=".8" class="track-path-anim"/>
    ${activeCam ? `<circle cx="${activeCam.x}" cy="${activeCam.y}" r="13" fill="none" stroke="var(--sig-warn)" stroke-width="2"><animate attributeName="r" values="11;16;11" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.3;1" dur="1.6s" repeatCount="indefinite"/></circle>` : ''}
    <circle r="5" fill="var(--sig-warn)" stroke="#04070a" stroke-width="1.3">
      <animateMotion dur="9s" repeatCount="indefinite" path="${pathD}"/>
    </circle>
    ${camsSvg}
  </svg>`;
}

/* ---------------- application state ---------------- */
const state = {
  view: 'dashboard',
  sidebarCollapsed: false,
  searchQuery: '',
  activeFilters: { periodo:'24h', tipo:'todos', camera:'todas', confMin:60 },
  results: RESULTS,
  timelineIndex: 5,
  settingsTab: 'privacidade',
  tickers: {},
};

function clearTickers(){ Object.values(state.tickers).forEach(clearInterval); state.tickers = {}; }

function navigate(view, params){
  state.view = view;
  if(params) Object.assign(state, params);
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  clearTickers();
  render();
  document.getElementById('view-root').scrollTop = 0;
}

/* ---------------- view: DASHBOARD ---------------- */
function viewDashboard(){
  const onlineCams = CAMERAS.filter(c=>c.status==='online').length;
  const offlineCams = CAMERAS.filter(c=>c.status!=='online').length;
  const wallCams = CAMERAS.filter(c=>c.status!=='offline').slice(0,6);

  return `
  <div class="view">
    <div class="view-head">
      <div>
        <h2>Central Operacional</h2>
        <div class="view-sub">Condomínio Vista Real · visão consolidada de câmeras, eventos e investigações ativas</div>
      </div>
      <div class="view-head-actions">
        <button class="btn ghost" data-action="nav" data-view="relatorios">${icon('file')} Relatórios</button>
        <button class="btn accent" data-action="nav" data-view="investigacoes">${icon('search')} Nova Busca</button>
      </div>
    </div>

    <div class="kpi-strip">
      <div class="kpi" style="--kpi-c:var(--sig-online)">
        <div class="k-top"><span class="k-lbl">Câmeras Online</span>${icon('camera','k-ico')}</div>
        <div class="k-val">${onlineCams}<small>/ ${CAMERAS.length}</small></div>
        <div class="k-row"><span class="k-delta up">${icon('sparkline')} estável</span></div>
      </div>
      <div class="kpi" style="--kpi-c:var(--sig-inactive)">
        <div class="k-top"><span class="k-lbl">Câmeras Offline</span>${icon('wifiOff','k-ico')}</div>
        <div class="k-val">${offlineCams}</div>
        <div class="k-row"><span class="k-delta down">1 manutenção</span></div>
      </div>
      <div class="kpi" style="--kpi-c:var(--sig-intel)">
        <div class="k-top"><span class="k-lbl">Eventos Hoje</span>${icon('grid','k-ico')}</div>
        <div class="k-val">248</div>
        <div class="k-row"><span class="k-delta up">↑ 12% vs. ontem</span></div>
      </div>
      <div class="kpi" style="--kpi-c:var(--sig-ai)">
        <div class="k-top"><span class="k-lbl">Investigações Ativas</span>${icon('target','k-ico')}</div>
        <div class="k-val">3</div>
        <div class="k-row"><span class="k-delta up">2 com trajeto completo</span></div>
      </div>
      <div class="kpi" style="--kpi-c:var(--sig-critical)">
        <div class="k-top"><span class="k-lbl">Alertas Críticos</span>${icon('alertTri','k-ico')}</div>
        <div class="k-val">2</div>
        <div class="k-row"><span class="k-delta down">requer atenção</span></div>
      </div>
      <div class="kpi" style="--kpi-c:var(--sig-ai)">
        <div class="k-top"><span class="k-lbl">Processamento IA</span>${icon('cpu','k-ico')}</div>
        <div class="k-val">312<small>ms</small></div>
        <div class="k-row"><span class="k-delta up">dentro da meta</span></div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>${icon('layers')} Mapa Operacional</h3>
          <span class="p-meta"><span>${onlineCams} ativas</span><span>1 rastreamento em curso</span></span>
        </div>
        <div class="panel-body tight">
          <div class="map-wrap" id="dash-map-wrap">
            ${buildOperationalMap({activeIndex: state._dashMapIdx || 0})}
            <div class="map-toolbar">
              <button title="Zoom">${icon('zoomIn')}</button>
              <button title="Camadas">${icon('layers')}</button>
              <button title="Expandir">${icon('expand')}</button>
            </div>
            <div class="map-legend">
              <span class="lg-item"><span class="lg-dot" style="background:var(--sig-online)"></span>Online</span>
              <span class="lg-item"><span class="lg-dot" style="background:var(--sig-critical)"></span>Crítico</span>
              <span class="lg-item"><span class="lg-dot" style="background:var(--sig-warn)"></span>Manutenção</span>
              <span class="lg-item"><span class="lg-dot" style="background:var(--sig-inactive)"></span>Offline</span>
              <span class="lg-item"><span class="lg-dot" style="background:var(--sig-ai)"></span>Trajeto de alvo</span>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h3>${icon('camera')} Câmeras ao Vivo</h3>
          <span class="p-meta"><span>${wallCams.filter(c=>c.ai).length} com IA ativa</span></span>
        </div>
        <div class="panel-body tight">
          <div class="cam-wall grid-2">
            ${wallCams.map(c => camTileHTML(c, {aiActive: c.status==='alert' || (c.ai && seededPct(c.id,'d')>0.5)})).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>${icon('search')} Busca Inteligente</h3>
        <span class="p-meta">linguagem natural</span>
      </div>
      <div class="panel-body">
        <div class="search-box" style="max-width:none">
          ${icon('search','search-ic')}
          <input id="dash-search-input" type="text" placeholder="O que você está procurando? Ex.: veículo prata saindo pelo portão B após as 22h" />
          <button class="mic-btn" title="Pesquisar por voz">${icon('mic')}</button>
          <button class="btn accent sm" data-action="run-dash-search">Buscar</button>
        </div>
        <div class="search-examples">
          <span class="example-chip" data-action="fill-search">homem de casaco azul próximo ao estacionamento</span>
          <span class="example-chip" data-action="fill-search">veículo branco entrando pela portaria principal</span>
          <span class="example-chip" data-action="fill-search">pessoa detectada próxima à área restrita</span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- view: INVESTIGAÇÕES (search + results) ---------------- */
function viewInvestigacoes(){
  const q = state.searchQuery;
  const results = state.results;
  return `
  <div class="view">
    <div class="search-hero">
      <div class="eyebrow">${icon('target')} Busca Inteligente · Investigação</div>
      <h2>O que você está procurando?</h2>
      <p>Descreva o alvo em linguagem natural — sem precisar conhecer filtros técnicos.</p>
      <div class="search-box">
        ${icon('search','search-ic')}
        <input id="main-search-input" type="text" value="${esc(q)}" placeholder="Ex.: veículo prata saindo pelo portão B após as 22h" />
        <button class="mic-btn" id="mic-toggle" title="Pesquisar por voz">${icon('mic')}</button>
        <button class="btn accent" data-action="run-search">${icon('search')} Buscar</button>
      </div>
      <div class="search-examples">
        <span class="example-chip" data-action="fill-search">homem de casaco azul correndo perto do estacionamento</span>
        <span class="example-chip" data-action="fill-search">veículo branco entrando pela portaria principal</span>
        <span class="example-chip" data-action="fill-search">pessoa detectada próxima à área restrita</span>
      </div>
    </div>

    <div class="filters-bar">
      <div class="filter-field">
        <label>Período</label>
        <select id="f-periodo">
          <option ${state.activeFilters.periodo==='6h'?'selected':''}>6h</option>
          <option ${state.activeFilters.periodo==='24h'?'selected':''} value="24h">24h</option>
          <option ${state.activeFilters.periodo==='7d'?'selected':''} value="7d">7 dias</option>
          <option ${state.activeFilters.periodo==='30d'?'selected':''} value="30d">30 dias</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>
      <div class="filter-field">
        <label>Câmeras</label>
        <select><option>Todas as câmeras</option>${CAMERAS.map(c=>`<option>${c.name}</option>`).join('')}</select>
      </div>
      <div class="filter-field">
        <label>Tipo de Alvo</label>
        <select><option>Todos</option><option>Pessoa</option><option>Veículo</option></select>
      </div>
      <div class="filter-field range">
        <label>Confiança mínima <span class="range-val" id="conf-range-val">${state.activeFilters.confMin}%</span></label>
        <input type="range" min="0" max="100" value="${state.activeFilters.confMin}" id="conf-range" />
      </div>
      <div class="filters-spacer"></div>
      <button class="btn ghost sm">${icon('filter')} Filtros Avançados</button>
    </div>

    <div class="results-meta">
      <div class="r-count"><b>${results.length}</b> resultados correspondentes${q?` para "<span style="color:var(--text-hi)">${esc(q)}</span>"`:''}</div>
      <select class="sort-select"><option>Ordenar por relevância</option><option>Mais recentes</option><option>Maior confiança</option></select>
    </div>

    <div class="results-grid">
      ${results.map(r => resultCardHTML(r)).join('')}
    </div>
  </div>`;
}

function resultCardHTML(r){
  const cam = CAMERAS.find(c=>c.name===r.camera) || CAMERAS[0];
  return `<div class="result-card">
    <div class="result-thumb">
      ${sceneFeedHTML(cam, r.id)}
      <span class="evt-id mono">#${r.id}</span>
      <span class="conf-badge ${confClass(r.conf)}">${Math.round(r.conf*100)}%</span>
      <span class="type-tag">${r.type}</span>
    </div>
    <div class="result-body">
      <div class="result-title">Evento #${r.id}</div>
      <div class="result-meta-row">${icon('camera')} ${esc(r.camera)} · ${esc(r.loc)}</div>
      <div class="result-meta-row">${icon('clock')} ${fmtDateTime(r.ts)}</div>
      <div class="result-meta-row" style="color:var(--text-lo)">${esc(r.desc)}</div>
      <div class="confidence-note">${Math.round(r.conf*100)}% de confiança — "${confNote(r.conf)}"</div>
      <div class="result-actions">
        <button class="btn sm" data-action="open-investigation" data-id="${r.id}">${icon('target')} Investigar</button>
        <button class="btn sm" data-action="open-investigation" data-id="${r.id}">${icon('route')} Rastrear</button>
        <button class="btn sm accent" data-action="open-investigation" data-id="${r.id}">${icon('play')} Vídeo</button>
      </div>
    </div>
  </div>`;
}

/* ---------------- view: INVESTIGATION DETAIL ---------------- */
function viewInvestigationDetail(){
  const idx = state.timelineIndex;
  const evt = TIMELINE_EVENTS[idx];
  const track = TRACK_PATH[idx];
  const cam = CAMERAS.find(c=>c.id===evt.camera) || CAMERAS[0];
  const progressPct = ((idx+1)/TIMELINE_EVENTS.length)*100;

  return `
  <div class="view">
    <div class="inv-header">
      <button class="back-btn" data-action="nav" data-view="investigacoes">${icon('chevronLeft')}</button>
      <div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="inv-title">Investigação — Veículo Prata, Portão B</span>
          <span class="status-pill active">Em Andamento</span>
        </div>
        <div class="inv-id">EVENTO #A1B2C3 · aberta por Mariana Lania · ${fmtDateTime('2026-09-15T09:41:12')}</div>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button class="btn ghost sm">${icon('capture')} Capturar</button>
        <button class="btn ghost sm">${icon('flag')} Marcar Evidência</button>
        <button class="btn accent sm" data-action="nav" data-view="relatorios">${icon('file')} Gerar Relatório</button>
      </div>
    </div>

    <div class="inv-grid">
      <div class="inv-left">
        <div class="panel">
          <div class="panel-head">
            <h3>${icon('play')} Player Forense — <span class="mono" style="color:var(--sig-intel);font-size:11px;margin-left:4px">${cam.id} · ${esc(cam.name)}</span></h3>
            <span class="p-meta"><span>Track ID #TK-4471</span></span>
          </div>
          <div class="player">
            ${sceneFeedHTML(cam, cam.id+idx)}
            <div class="player-top-tags">
              <span class="player-badge rec"><span class="dot pulse" style="width:5px;height:5px"></span> REC</span>
              <span class="player-badge">${fmtDateTime(('2026-09-15T'+track.time))}</span>
            </div>
            <div class="player-bbox" style="left:38%;top:28%;width:22%;height:44%">
              <span class="pb-label">${SCENE_CLASS_LABEL[cam.scene]||'ALVO'} · TK-4471 · ${Math.round(track.conf*100)}%</span>
            </div>
            <div class="player-controls">
              <div class="scrub">
                <div class="scrub-fill" style="width:${progressPct}%"></div>
                ${TIMELINE_EVENTS.map((e,i)=>`<div class="scrub-evt" style="left:${((i+1)/TIMELINE_EVENTS.length)*100}%"></div>`).join('')}
                <div class="scrub-handle" style="left:${progressPct}%"></div>
              </div>
              <div class="player-row">
                <button class="p-btn">${icon('skipBack')}</button>
                <button class="p-btn play" id="play-toggle">${icon('pause')}</button>
                <button class="p-btn">${icon('skipFwd')}</button>
                <span class="player-time">${track.time} / 09:52:00</span>
                <div class="p-spacer"></div>
                <select class="speed-select"><option>0.5x</option><option selected>1x</option><option>2x</option><option>4x</option></select>
                <button class="p-btn">${icon('capture')}</button>
                <button class="p-btn">${icon('expand')}</button>
              </div>
            </div>
          </div>
          <div class="evidence-strip">
            ${TIMELINE_EVENTS.map((e,i)=>{
              const ecam = CAMERAS.find(c=>c.id===e.camera)||CAMERAS[0];
              return `<div class="evidence-thumb ${i===idx?'active':''}" data-action="set-timeline" data-idx="${i}">${sceneFeedHTML(ecam, ecam.id+'ev'+i)}<span class="et-time">${e.time}</span></div>`;
            }).join('')}
          </div>
        </div>

        <div class="panel timeline-panel">
          <div class="panel-head">
            <h3>${icon('route')} Linha do Tempo Forense</h3>
            <span class="p-meta"><span>Reconstrução automática</span></span>
          </div>
          <div class="timeline-scroll">
            <div class="timeline-track" style="min-width:${TIMELINE_EVENTS.length*150}px">
              <div class="timeline-line"><div class="tl-progress" style="width:${progressPct}%"></div></div>
              ${TIMELINE_EVENTS.map((e,i)=>{
                const leftPct = (i/(TIMELINE_EVENTS.length-1))*100;
                return `<div class="tl-node ${i===idx?'active':''}" style="left:${leftPct}%" data-action="set-timeline" data-idx="${i}">${icon(e.icon==='car'?'car':e.icon==='walk'?'walk':e.icon==='gate'?'gate':e.icon==='exit'?'exit':'alertTri')}</div>
                <div class="tl-label" style="left:${leftPct}%"><div class="tl-cam">${esc(e.label)}</div><div class="tl-time mono">${e.time}</div></div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>${icon('layers')} Mapa da Investigação</h3></div>
          <div class="panel-body tight">
            <div class="map-wrap" style="border-radius:0 0 14px 14px">
              ${buildOperationalMap({activeIndex: idx})}
            </div>
          </div>
        </div>
      </div>

      <div class="inv-right">
        <div class="panel">
          <div class="panel-head"><h3>${icon('target')} Perfil do Alvo</h3><span class="p-meta">TARGET PROFILE</span></div>
          <div class="panel-body">
            <div class="profile-photo">${sceneFeedHTML(cam, 'profile'+idx)}</div>
            <div class="profile-fields">
              <div class="pf-item"><label>Tipo</label><div class="pf-val">Veículo</div></div>
              <div class="pf-item"><label>Cor</label><div class="pf-val">Prata</div></div>
              <div class="pf-item"><label>Categoria</label><div class="pf-val">Sedã, 4 portas</div></div>
              <div class="pf-item"><label>Confiança OCR</label><div class="pf-val" style="color:var(--sig-online)">94%</div></div>
              <div class="pf-item span2"><label>Placa (OCR)</label><div class="pf-plate">ABC1D23</div></div>
              <div class="pf-item span2"><label>Primeira Detecção</label><div class="pf-val">${TRACK_PATH[0].camera} · ${TRACK_PATH[0].time}</div></div>
              <div class="pf-item span2"><label>Última Detecção</label><div class="pf-val">${TRACK_PATH[TRACK_PATH.length-1].camera} · ${TRACK_PATH[TRACK_PATH.length-1].time}</div></div>
            </div>
            <div class="conf-bar-wrap">
              <div class="cb-row"><span>Confiança de rastreamento</span><span class="mono" style="color:var(--sig-online)">${Math.round(track.conf*100)}%</span></div>
              <div class="conf-bar"><div class="cb-fill" style="width:${Math.round(track.conf*100)}%"></div></div>
              <div class="confidence-note" style="margin-top:6px">Resultado de IA — não constitui identificação categórica. Revisão humana recomendada.</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h3>${icon('route')} Rastreamento Multi-Câmera</h3><span class="p-meta">6 detecções</span></div>
          <div class="panel-body">
            <div class="track-list">
              ${TRACK_PATH.map((t,i)=>`
                <div class="track-item ${i===idx?'current':''}" data-action="set-timeline" data-idx="${i}" style="cursor:pointer">
                  <div class="track-dot">${i+1}</div>
                  <div class="track-body">
                    <div class="tk-cam">${t.camera} · ${(CAMERAS.find(c=>c.id===t.camera)||{}).name || ''}</div>
                    <div class="tk-meta">
                      <span>${t.time}</span>
                      ${t.gap?`<span>+${t.gap}</span>`:''}
                      <span class="tk-conf">${Math.round(t.conf*100)}% conf.</span>
                      ${t.current?'<span style="color:var(--sig-online)">● ATUAL</span>':''}
                    </div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- view: CÂMERAS ---------------- */
function viewCameras(){
  return `
  <div class="view">
    <div class="view-head">
      <div><h2>Gestão de Câmeras</h2><div class="view-sub">${CAMERAS.length} câmeras cadastradas · protocolos ONVIF/RTSP</div></div>
      <div class="view-head-actions"><button class="btn accent">${icon('plus')} Nova Câmera</button></div>
    </div>
    <div class="cam-manage-grid">
      ${CAMERAS.map(c => `
        <div class="cam-card">
          ${camTileHTML(c, {aiActive: c.ai && c.status==='online' && seededPct(c.id,'m')>0.6})}
          <div class="cam-card-body">
            <div class="cam-card-title"><h4>${esc(c.name)}</h4><span class="badge ${c.status==='online'?'online':c.status==='alert'?'critical':c.status==='maintenance'?'warn':'offline'}">${c.status}</span></div>
            <div class="cam-card-meta"><span>${c.id}</span><span>${esc(c.loc)}</span></div>
            <div class="cam-card-meta"><span>RTSP/ONVIF</span><span>${c.ai?'IA ativa':'IA inativa'}</span></div>
            <div class="cam-card-actions">
              <button class="btn sm" style="flex:1;justify-content:center" data-action="nav" data-view="monitoramento">${icon('eye')} Ver Ao Vivo</button>
              <button class="btn sm ghost" style="justify-content:center">${icon('gear')}</button>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- view: MONITORAMENTO ---------------- */
function viewMonitoramento(){
  return `
  <div class="view">
    <div class="view-head">
      <div><h2>Central de Monitoramento</h2><div class="view-sub">Grade ao vivo · destaque automático em eventos detectados pela IA</div></div>
      <div class="view-head-actions">
        <button class="btn ghost sm">${icon('grid')} Grade 4x3</button>
        <button class="btn ghost sm">${icon('expand')} Tela Cheia</button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body tight">
        <div class="cam-wall grid-4" id="monitor-wall">
          ${CAMERAS.map(c => camTileHTML(c, {aiActive: c.status==='alert'})).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

/* ---------------- view: ALERTAS ---------------- */
function viewAlertas(){
  return `
  <div class="view">
    <div class="view-head">
      <div><h2>Alertas</h2><div class="view-sub">${ALERTS.length} eventos que exigem atenção do operador</div></div>
      <div class="view-head-actions"><button class="btn ghost sm">${icon('filter')} Filtrar</button><button class="btn ghost sm">Marcar todos como lidos</button></div>
    </div>
    <div class="alert-feed">
      ${ALERTS.map(a => `
        <div class="alert-row ${a.level}">
          <div class="alert-ico">${icon(a.level==='critical'?'alertTri':a.level==='ai'?'target':a.level==='info'?'info':'wifiOff')}</div>
          <div class="alert-content">
            <div class="a-title">${esc(a.title)}</div>
            <div class="a-desc">${esc(a.desc)}</div>
            <div class="a-meta"><span>${esc(a.tag)}</span><span>${a.camera}</span><span>${fmtDateTime(a.ts)}</span></div>
          </div>
          <div class="alert-actions">
            <button class="btn sm" data-action="nav" data-view="investigacoes">${icon('search')} Investigar</button>
            <button class="btn sm ghost">${icon('close')}</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- view: RELATÓRIOS ---------------- */
function viewRelatorios(){
  return `
  <div class="view">
    <div class="view-head">
      <div><h2>Relatórios de Incidente</h2><div class="view-sub">Documentos gerados automaticamente, prontos para exportação</div></div>
      <div class="view-head-actions"><button class="btn accent">${icon('plus')} Gerar Novo Relatório</button></div>
    </div>
    <div class="report-grid">
      ${REPORTS.map(r => `
        <div class="report-card">
          <div class="report-icon">${icon('file')}</div>
          <div class="report-title">${esc(r.title)}</div>
          <div class="report-meta">
            <span class="mono">#${r.id}</span>
            <span>${fmtDateTime(r.ts)}</span>
            <span>${r.cameras} câmeras · ${r.pages} páginas</span>
          </div>
          <span class="badge ${r.status==='concluido'?'online':'warn'}" style="width:fit-content">${r.status==='concluido'?'Concluído':'Rascunho'}</span>
          <div class="report-foot">
            <button class="btn sm">${icon('eye')} Visualizar</button>
            <button class="btn sm accent">${icon('download')} PDF</button>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

/* ---------------- view: AUDITORIA ---------------- */
function viewAuditoria(){
  return `
  <div class="view">
    <div class="view-head">
      <div><h2>Trilha de Auditoria</h2><div class="view-sub">Registro append-only de toda ação sensível do sistema</div></div>
      <div class="view-head-actions"><button class="btn ghost sm">${icon('download')} Exportar CSV</button></div>
    </div>
    <div class="panel">
      <div class="table-toolbar">
        <div class="filter-field"><label>Usuário</label><select><option>Todos</option>${USERS.map(u=>`<option>${u.name}</option>`).join('')}</select></div>
        <div class="filter-field"><label>Ação</label><select><option>Todas</option><option>busca_evento</option><option>exportar_relatorio</option><option>login</option><option>alterar_config</option></select></div>
        <div class="filter-field"><label>Período</label><select><option>7 dias</option><option>30 dias</option></select></div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Usuário</th><th>Ação</th><th>Recurso</th><th>Data/Hora</th><th>IP de Origem</th></tr></thead>
          <tbody>
            ${AUDIT_LOGS.map(l => `<tr>
              <td class="hi">${esc(l.user)}</td>
              <td><span class="badge intel">${esc(l.action)}</span></td>
              <td>${esc(l.resource)}</td>
              <td class="mono">${fmtDateTime(l.ts)}</td>
              <td class="mono">${l.ip}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

/* ---------------- view: CONFIGURAÇÕES ---------------- */
function viewConfiguracoes(){
  const tabs = [
    {id:'privacidade', label:'Privacidade & Retenção'},
    {id:'usuarios', label:'Usuários & Permissões'},
    {id:'cameras', label:'Câmeras & Integrações'},
    {id:'sistema', label:'Sistema'},
  ];
  return `
  <div class="view">
    <div class="view-head"><div><h2>Configurações</h2><div class="view-sub">Controles administrativos e conformidade LGPD</div></div></div>
    <div class="settings-grid">
      <div class="settings-nav">
        ${tabs.map(t=>`<button class="${state.settingsTab===t.id?'active':''}" data-action="set-settings-tab" data-tab="${t.id}">${esc(t.label)}</button>`).join('')}
      </div>
      <div class="panel settings-panel">
        ${settingsTabBody(state.settingsTab)}
      </div>
    </div>
  </div>`;
}

function settingsTabBody(tab){
  if(tab==='privacidade'){
    return `
      <div class="settings-section">
        <h4>Reconhecimento Facial</h4>
        <div class="s-desc">Módulo opcional, desabilitado por padrão. Quando ativo, todo resultado exibe índice de confiança — nunca identificação categórica.</div>
        <div class="setting-row"><div><div class="sr-label">Ativar reconhecimento facial</div><div class="sr-desc">Requer autorização contratual e jurídica desta instalação.</div></div><div class="toggle" data-action="toggle"></div></div>
        <div class="setting-row"><div><div class="sr-label">Exigir dupla aprovação para consultas</div><div class="sr-desc">Consultas de reconhecimento facial precisam de aprovação de um segundo administrador.</div></div><div class="toggle on" data-action="toggle"></div></div>
      </div>
      <div class="settings-section">
        <h4>Retenção de Dados</h4>
        <div class="s-desc">Prazos de retenção de vídeo bruto e metadados estruturados, conforme política LGPD.</div>
        <div class="setting-row"><div><div class="sr-label">Vídeo bruto</div><div class="sr-desc">Armazenamento de alta performance para acesso recente.</div></div><select class="retention-select"><option>15 dias</option><option selected>30 dias</option><option>60 dias</option><option>90 dias</option></select></div>
        <div class="setting-row"><div><div class="sr-label">Metadados e eventos indexados</div><div class="sr-desc">Utilizados para busca e reconstrução de trajeto.</div></div><select class="retention-select"><option>90 dias</option><option selected>180 dias</option><option>365 dias</option></select></div>
        <div class="setting-row"><div><div class="sr-label">Trilha de auditoria</div><div class="sr-desc">Registros append-only, sem permissão de exclusão.</div></div><select class="retention-select"><option>1 ano</option><option selected>5 anos</option><option>Indeterminado</option></select></div>
      </div>
      <div class="settings-section">
        <h4>Status de Conformidade</h4>
        <div class="setting-row"><div class="sr-label">Adesão LGPD</div><span class="badge online">${icon('shieldCheck')} Conforme</span></div>
        <div class="setting-row"><div class="sr-label">Criptografia em trânsito e repouso</div><span class="badge online">${icon('shieldCheck')} Ativa</span></div>
        <div class="setting-row"><div class="sr-label">Última auditoria de conformidade</div><span class="mono" style="color:var(--text-md)">12/08/2026</span></div>
      </div>`;
  }
  if(tab==='usuarios'){
    return `
      <div class="settings-section">
        <h4>Usuários da Instalação</h4>
        <div class="s-desc">Controle de acesso baseado em papéis (RBAC).</div>
        ${USERS.map(u=>`
          <div class="user-row">
            <div class="avatar">${u.initials}</div>
            <div class="u-info"><div class="u-name">${esc(u.name)}</div><div class="u-role">${esc(u.role)}</div></div>
            <span class="badge ${u.status==='online'?'online':'offline'}">${u.status}</span>
            <span class="role-badge">${esc(u.role)}</span>
            <button class="btn sm ghost">${icon('gear')}</button>
          </div>`).join('')}
      </div>`;
  }
  if(tab==='cameras'){
    return `
      <div class="settings-section">
        <h4>Cadastro de Câmera</h4>
        <div class="s-desc">Conexão via protocolos abertos ONVIF/RTSP, sem necessidade de troca de hardware.</div>
        <div class="filter-field" style="margin-bottom:10px"><label>Nome</label><input type="text" placeholder="Ex.: Portão Principal" style="background:var(--void);border:1px solid var(--border-strong);border-radius:6px;padding:9px;color:var(--text-hi);font-family:var(--f-mono);width:100%"></div>
        <div class="filter-field" style="margin-bottom:10px"><label>URL RTSP</label><input type="text" placeholder="rtsp://192.168.0.10:554/stream1" style="background:var(--void);border:1px solid var(--border-strong);border-radius:6px;padding:9px;color:var(--text-hi);font-family:var(--f-mono);width:100%"></div>
        <button class="btn accent sm">${icon('plus')} Adicionar Câmera</button>
      </div>
      <div class="settings-section">
        <h4>Integrações Externas</h4>
        <div class="setting-row"><div><div class="sr-label">Base de veículos com restrição</div><div class="sr-desc">Verificação de placas via API, mediante autorização contratual.</div></div><div class="toggle" data-action="toggle"></div></div>
        <div class="setting-row"><div><div class="sr-label">Notificações por webhook</div><div class="sr-desc">Envio de alertas para central de monitoramento do cliente.</div></div><div class="toggle on" data-action="toggle"></div></div>
      </div>`;
  }
  return `
    <div class="settings-section">
      <h4>Status do Sistema</h4>
      <div class="setting-row"><div class="sr-label">Disponibilidade (30 dias)</div><span class="mono" style="color:var(--sig-online)">99.6%</span></div>
      <div class="setting-row"><div class="sr-label">Latência média de detecção</div><span class="mono">312ms</span></div>
      <div class="setting-row"><div class="sr-label">Versão do motor de IA</div><span class="mono">v2.3.1</span></div>
    </div>`;
}

/* ---------------- render dispatch ---------------- */
function render(){
  const root = document.getElementById('view-root');
  const fns = {
    dashboard: viewDashboard,
    investigacoes: viewInvestigacoes,
    'investigacao-detalhe': viewInvestigationDetail,
    cameras: viewCameras,
    monitoramento: viewMonitoramento,
    alertas: viewAlertas,
    relatorios: viewRelatorios,
    auditoria: viewAuditoria,
    configuracoes: viewConfiguracoes,
  };
  root.innerHTML = (fns[state.view] || viewDashboard)();
  wireDynamicHandlers();
  startTickers();
}

/* ---------------- interaction wiring ---------------- */
function wireDynamicHandlers(){
  document.querySelectorAll('[data-action="nav"]').forEach(el=>{
    el.addEventListener('click', ()=> navigate(el.dataset.view));
  });
  document.querySelectorAll('[data-action="open-investigation"]').forEach(el=>{
    el.addEventListener('click', ()=> navigate('investigacao-detalhe', {timelineIndex: TIMELINE_EVENTS.length-1}));
  });
  document.querySelectorAll('[data-action="set-timeline"]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.timelineIndex = parseInt(el.dataset.idx,10); render(); });
  });
  document.querySelectorAll('[data-action="fill-search"]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const input = document.getElementById('main-search-input') || document.getElementById('dash-search-input');
      if(input){ input.value = el.textContent; input.focus(); }
    });
  });
  const runSearch = ()=>{
    const input = document.getElementById('main-search-input');
    state.searchQuery = input ? input.value : state.searchQuery;
    navigate('investigacoes');
  };
  const el1 = document.querySelector('[data-action="run-search"]'); if(el1) el1.addEventListener('click', runSearch);
  const dashRun = document.querySelector('[data-action="run-dash-search"]');
  if(dashRun) dashRun.addEventListener('click', ()=>{
    const input = document.getElementById('dash-search-input');
    state.searchQuery = input ? input.value : '';
    navigate('investigacoes');
  });
  document.querySelectorAll('.search-box input').forEach(inp=>{
    inp.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); state.searchQuery = inp.value; navigate('investigacoes'); } });
  });
  const confRange = document.getElementById('conf-range');
  if(confRange) confRange.addEventListener('input', ()=>{ document.getElementById('conf-range-val').textContent = confRange.value+'%'; });

  document.querySelectorAll('[data-action="toggle"]').forEach(el=>{
    el.addEventListener('click', ()=> el.classList.toggle('on'));
  });
  document.querySelectorAll('[data-action="set-settings-tab"]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.settingsTab = el.dataset.tab; render(); });
  });
  document.querySelectorAll('.map-cam-node').forEach(el=>{
    el.addEventListener('click', ()=>{
      const camId = el.dataset.cam;
      const idx = TRACK_PATH.findIndex(t=>t.camera===camId);
      if(idx>=0 && state.view==='investigacao-detalhe'){ state.timelineIndex = idx; render(); }
    });
  });
  document.querySelectorAll('.cam-tile[data-cam]').forEach(el=>{
    el.addEventListener('click', ()=>{
      if(state.view!=='investigacao-detalhe') navigate('monitoramento');
    });
  });
  const playToggle = document.getElementById('play-toggle');
  if(playToggle){
    let playing = true;
    playToggle.addEventListener('click', ()=>{ playing=!playing; playToggle.innerHTML = playing?icon('pause'):icon('play'); });
  }
}

/* ---------------- live tickers (clock, ambient map, monitor highlight) ---------------- */
function updateClocks(){
  const now = new Date();
  const t = pad2(now.getHours())+':'+pad2(now.getMinutes())+':'+pad2(now.getSeconds());
  const d = ['DOM','SEG','TER','QUA','QUI','SEX','SÁB'][now.getDay()]+' '+pad2(now.getDate())+'/'+pad2(now.getMonth()+1)+'/'+now.getFullYear();
  const ct = document.getElementById('topbar-clock-time'); if(ct) ct.textContent = t;
  const cd = document.getElementById('topbar-clock-date'); if(cd) cd.textContent = d;
  document.querySelectorAll('.live-clock-mini').forEach(el=> el.textContent = t.slice(0,5));
}

function startTickers(){
  if(state.view==='dashboard'){
    state._dashMapIdx = state._dashMapIdx || 0;
    state.tickers.dashMap = setInterval(()=>{
      state._dashMapIdx = (state._dashMapIdx+1) % TRACK_PATH.length;
      const wrap = document.getElementById('dash-map-wrap');
      if(wrap){
        const toolbar = wrap.querySelector('.map-toolbar').outerHTML;
        const legend = wrap.querySelector('.map-legend').outerHTML;
        wrap.innerHTML = buildOperationalMap({activeIndex: state._dashMapIdx}) + toolbar + legend;
      }
    }, 2600);
  }
  if(state.view==='monitoramento'){
    state.tickers.monWall = setInterval(()=>{
      const aiCams = CAMERAS.filter(c=>c.ai && c.status!=='offline');
      const pick = aiCams[Math.floor(Math.random()*aiCams.length)];
      document.querySelectorAll('#monitor-wall .cam-tile').forEach(t=> t.classList.remove('ai-hit'));
      if(pick){
        const el = document.querySelector(`#monitor-wall .cam-tile[data-cam="${pick.id}"]`);
        if(el && !el.classList.contains('offline')) el.classList.add('ai-hit');
      }
    }, 4200);
  }
}

/* ---------------- boot ---------------- */
function initSidebar(){
  document.querySelectorAll('.nav-item').forEach(el=>{
    el.addEventListener('click', ()=> navigate(el.dataset.view));
  });
  const toggle = document.getElementById('sidebar-toggle-btn');
  const expandBtn = document.getElementById('collapsed-expand-btn');
  const applyCollapsed = ()=>{
    document.getElementById('app-shell').classList.toggle('collapsed', state.sidebarCollapsed);
    expandBtn.style.display = state.sidebarCollapsed ? 'flex' : 'none';
  };
  toggle.addEventListener('click', ()=>{ state.sidebarCollapsed = true; applyCollapsed(); });
  expandBtn.addEventListener('click', ()=>{ state.sidebarCollapsed = false; applyCollapsed(); });
  document.getElementById('logout-btn').addEventListener('click', ()=>{
    clearTickers();
    document.getElementById('app-shell').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
  });
}

const API_URL = 'https://sentinelai-production-edf2.up.railway.app';
let authToken = null;

async function fazerLogin(email, senha){
  const resposta = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  if (!resposta.ok) {
    throw new Error('Credenciais inválidas');
  }
  const dados = await resposta.json();
  return dados.access_token;
}

async function buscarUsuarioLogado(token){
  const resposta = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resposta.ok) return null;
  return resposta.json();
}

function iniciais(nome){
  return nome.split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
}

function atualizarInterfaceUsuario(usuario){
  const nome = usuario ? usuario.nome : 'Mariana Lania';
  const papel = usuario ? usuario.papel : 'Operadora de Segurança';
  const sigla = iniciais(nome);

  document.getElementById('sidebar-username').textContent = nome;
  document.getElementById('sidebar-role').textContent = papel;
  document.getElementById('sidebar-avatar').textContent = sigla;
  document.getElementById('topbar-avatar').textContent = sigla;
  document.getElementById('topbar-avatar').title = nome;
}

function initLogin(){
  const form = document.getElementById('login-form');
  const botao = document.getElementById('demo-enter-btn');

  const entrar = ()=>{
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display = 'flex';
    render();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-user').value.trim();
    const senha = document.getElementById('login-pass').value.trim();
    const textoOriginal = botao.textContent;
    botao.textContent = 'Verificando...';
    botao.disabled = true;

    try {
      const token = await fazerLogin(email, senha);
      authToken = token;
      const usuario = await buscarUsuarioLogado(token);
      atualizarInterfaceUsuario(usuario);
      entrar();
    } catch (erro) {
      alert('E-mail ou senha inválidos.');
    } finally {
      botao.textContent = textoOriginal;
      botao.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('brand-mark-login').innerHTML = brandMark();
  document.getElementById('brand-mark-sidebar').innerHTML = brandMark();
  initLogin();
  initSidebar();
  updateClocks();
  setInterval(updateClocks, 1000);
});