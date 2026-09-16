/* ============================================================
   SENTINEL AI — icon set (inline stroke icons, 24x24 grid)
   ============================================================ */
const ICON_PATHS = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.4"/><rect x="14" y="3" width="7" height="5" rx="1.4"/><rect x="14" y="12" width="7" height="9" rx="1.4"/><rect x="3" y="16" width="7" height="5" rx="1.4"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  camera: '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h3l1.3-2h6.4l1.3 2h3A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.4"/>',
  grid: '<rect x="3" y="3" width="8" height="8" rx="1.2"/><rect x="13" y="3" width="8" height="8" rx="1.2"/><rect x="3" y="13" width="8" height="8" rx="1.2"/><rect x="13" y="13" width="8" height="8" rx="1.2"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  file: '<path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 16.5h6"/>',
  shieldCheck: '<path d="M12 3l7 3v6c0 5-3 7.5-7 9-4-1.5-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z" fill="none"/>',
  chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
  chevronsLeft: '<path d="M17 5l-7 7 7 7M10 5l-7 7 7 7"/>',
  logout: '<path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"/><path d="M15 8l4 4-4 4M19 12H9"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  play: '<path d="M6 4.5v15l14-7.5z"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  skipBack: '<path d="M18 5v14L7 12z"/><rect x="4" y="5" width="2" height="14"/>',
  skipFwd: '<path d="M6 5v14l11-7z"/><rect x="18" y="5" width="2" height="14"/>',
  expand: '<path d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"/>',
  capture: '<path d="M4 16V9a2 2 0 0 1 2-2h2l1.5-2h5L16 7h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="12" r="3.2"/>',
  flag: '<path d="M6 3v18"/><path d="M6 4h11l-2.5 4L17 12H6"/>',
  zoomIn: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8M10.5 7.5v6M7.5 10.5h6"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  download: '<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  car: '<path d="M4 16v-3.5L6 8h12l2 4.5V16"/><path d="M4 16h16v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M10 22l1.5-6-2-2 .7-5.4L13 7l3 2 2 3.5"/><path d="M9 13l3-1 2.5 2.5L18 13"/>',
  gate: '<path d="M4 21V6l4-2 4 2 4-2 4 2v15"/><path d="M4 21h16M8 21V9M12 21V6M16 21V9"/>',
  exit: '<path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4"/><path d="M10 17l5-5-5-5M15 12H3"/>',
  alertTri: '<path d="M12 3l10 18H2z"/><path d="M12 10v4.5M12 17.2v.1"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
  sort: '<path d="M7 4v16M7 4l-3 3M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  route: '<circle cx="5" cy="6" r="2.4"/><circle cx="19" cy="18" r="2.4"/><path d="M5 8.4V13a4 4 0 0 0 4 4h6" stroke-dasharray="2.4 3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15.5 13a5.5 5.5 0 0 1 6 6.9"/>',
  shieldOff: '<path d="M12 3l7 3v6c0 5-3 7.5-7 9-4-1.5-7-4-7-9V6z" opacity=".45"/><path d="M3 3l18 18" opacity=".8"/>',
  wifiOff: '<path d="M3 3l18 18"/><path d="M8.5 12.5a6 6 0 0 1 5.6-1.5M4.8 8.8a12 12 0 0 1 4-2.3M19.2 8.8a12 12 0 0 1 .7.5"/><circle cx="12" cy="18" r="1.2"/>',
  cpu: '<rect x="7" y="7" width="10" height="10" rx="1.4"/><rect x="3" y="10" width="2" height="4"/><rect x="19" y="10" width="2" height="4"/><rect x="10" y="3" width="4" height="2"/><rect x="10" y="19" width="4" height="2"/>',
  sparkline: '<path d="M2 15l4-3 3 2 5-7 4 3 4-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h2M14 8h2M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  dot: '<circle cx="12" cy="12" r="5"/>',
};

function icon(name, cls){
  const inner = ICON_PATHS[name] || ICON_PATHS.dot;
  return `<svg class="ic ${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

/* Brand mark — original glyph: aperture/eye set inside a sentinel shield, crosshair ticks. */
function brandMark(){
  return `<svg viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0" stop-color="#17c3ff"/>
        <stop offset="1" stop-color="#b366ff"/>
      </linearGradient>
    </defs>
    <path d="M24 3 L43 12 V26 C43 36.5 35 42.5 24 45 C13 42.5 5 36.5 5 26 V12 Z" stroke="url(#sg)" stroke-width="2" fill="rgba(23,195,255,.05)"/>
    <circle cx="24" cy="23" r="8.2" stroke="#17c3ff" stroke-width="2"/>
    <circle cx="24" cy="23" r="2.6" fill="#17c3ff"/>
    <path d="M24 10.5v3.4M24 32.1v3.4M11.5 23h3.4M33.1 23h3.4" stroke="#17c3ff" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}
