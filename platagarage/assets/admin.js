/* Backoffice Plata Garage */
(() => {
const B = '/platagarage', API = B + '/api';
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => (n == null || n === '' ? '—' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n) + ' €');
const nf = (n) => (n == null || n === '' ? '—' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n));
const fdate = (iso) => (iso ? new Date(iso.length === 10 ? iso + 'T12:00:00' : iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '');
const fdt = (iso) => (iso ? new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '');
const waLink = (tel, txt = '') => `https://wa.me/${String(tel).replace(/\D/g, '').replace(/^(?!34)(\d{9})$/, '34$1')}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;
const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const ORDER = [1, 2, 3, 4, 5, 6, 0];
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC = {
  resumen: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  coches: svg('<path d="M5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 104 0 2 2 0 00-4 0zM3 17v-5l2-5h14l2 5v5"/>'),
  bancos: svg('<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M12 3l9 5H3z"/>'),
  reservas: svg('<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M9 16l2 2 4-4"/>'),
  horarios: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  valoraciones: svg('<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5"/>'),
  envios: svg('<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  mensajes: svg('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'),
  analiticas: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  busquedas: svg('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>'),
  alertas: svg('<path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>'),
  usuarios: svg('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>'),
  blog: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'),
  web: svg('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>'),
  out: svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>'),
  star: svg('<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'),
  edit: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>'),
  sold: svg('<path d="M20 6L9 17l-5-5"/>'),
  menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  x: svg('<path d="M18 6L6 18M6 6l12 12"/>'),
  conexion: svg('<path d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7"/>'),
  leads: svg('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.5-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.7 1.1z"/>'),
  clientes: svg('<path d="M3 4h18l-7 8v6l-4 2v-8z"/>'),
  copy: svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>'),
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 00-8.5 15l-1.5 5 5.2-1.4A9.9 9.9 0 1012.04 2zm5.8 14.1c-.25.7-1.45 1.33-2 1.4-.52.08-1.17.11-1.89-.12a17 17 0 01-1.7-.63c-3-1.3-4.95-4.32-5.1-4.52-.15-.2-1.22-1.62-1.22-3.09 0-1.46.77-2.18 1.04-2.48.27-.3.6-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.05.92 2.2.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.45.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.06 1.13 1.01 2.09 1.33 2.39 1.48.3.14.47.12.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.72-.18 1.41z"/></svg>',
};

async function api(path, opt = {}) {
  const r = await fetch(API + path, { method: opt.method || 'GET', headers: { 'content-type': 'application/json', 'x-pg': '1' }, body: opt.body ? JSON.stringify(opt.body) : undefined, credentials: 'same-origin' });
  const j = await r.json().catch(() => ({}));
  if (r.status === 401 && j.error === 'auth') { showLogin(); throw new Error('Sesión caducada'); }
  if (!r.ok) throw new Error(j.error || 'Error ' + r.status);
  return j;
}
function toast(msg, err) { const t = document.createElement('div'); t.className = 'toast' + (err ? ' e' : ''); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }
const guard = (fn) => async (...a) => { try { await fn(...a); } catch (e) { if (e.message !== 'Sesión caducada') toast(e.message, true); } };

// ---------- login ----------
// Al abrir la app: "¿Quién eres?" (Cristina / Juan) y después solo la contraseña
const QUIEN = [['cristina', 'Cristina'], ['juan', 'Juan']];
function showLogin() {
  let last = ''; try { last = localStorage.getItem('pg_who') || ''; } catch (e) { /* */ }
  const pick = () => {
    $('#app').innerHTML = `<div class="login"><div class="card"><img src="${B}/assets/logo.png" alt="Plata Garage"><h2>¿Quién eres?</h2><div class="who">${QUIEN.map(([u, n]) => `<button type="button" class="btn${u === last ? '' : ' g'}" data-u="${u}">${n}</button>`).join('')}</div><a href="#" class="mu sm" id="otro">Otro usuario</a></div></div>`;
    $('#app').querySelectorAll('[data-u]').forEach((b) => (b.onclick = () => form(b.dataset.u, b.textContent)));
    $('#otro').onclick = (e) => { e.preventDefault(); form('', ''); };
  };
  const form = (u, n) => {
    $('#app').innerHTML = `<div class="login"><form class="card" id="lf"><img src="${B}/assets/logo.png" alt="Plata Garage"><h2>${n ? 'Hola, ' + esc(n) : 'Backoffice'}</h2>${u ? `<input type="hidden" name="user" value="${u}">` : '<label style="text-align:left">Usuario<input name="user" autocomplete="username" required autocapitalize="none"></label>'}<label style="text-align:left">Contraseña<input type="password" name="password" autocomplete="current-password" required></label><button class="btn" style="justify-content:center">Entrar</button><a href="#" class="mu sm" id="cw">No soy ${n ? esc(n) : 'yo'}</a><p class="mu sm" id="le"></p></form></div>`;
    $('#cw').onclick = (e) => { e.preventDefault(); pick(); };
    $('#lf').password.focus();
    $('#lf').onsubmit = async (e) => {
      e.preventDefault(); const b = e.target.querySelector('button'); b.disabled = true;
      const user = e.target.user.value.trim();
      const r = await fetch(API + '/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ user, password: e.target.password.value }) });
      const j = await r.json().catch(() => ({})); b.disabled = false;
      if (r.ok) { try { if (u) localStorage.setItem('pg_who', u); } catch (er) { /* */ } location.hash = home(); boot(); } else $('#le').textContent = j.error || 'No se pudo entrar';
    };
  };
  pick();
}

// ---------- layout ----------
const NAV = [['leads', 'Leads'], ['resumen', 'Resumen'], ['analiticas', 'Analíticas'], ['clientes', 'Clientes'], ['coches', 'Coches'], ['bancos', 'Bancos'], ['reservas', 'Reservas'], ['horarios', 'Horarios'], ['valoraciones', 'Valoraciones'], ['busquedas', 'Te lo buscamos'], ['alertas', 'Alertas'], ['envios', 'Envíos'], ['mensajes', 'Mensajes'], ['blog', 'Blog'], ['usuarios', 'Usuarios']];
let badges = {};
// Negocio activo: Plata Garage (panel completo), Plata Marine y Rotulito (embudo de clientes)
const NEGS = { garage: { n: 'Plata Garage', logo: B + '/assets/logo.png', dark: true }, marine: { n: 'Plata Marine', logo: '/img/plata-marine-logo.png' }, rotulito: { n: 'Rotulito', logo: '/assets/rotulito-logo.svg' } };
let MIS = ['garage'];
let QUIEN_YO = ''; // quién ha entrado (se muestra en el menú)
let PRIMERA = true; // primera carga de la app
let NEG = 'garage'; try { NEG = localStorage.getItem('pg_neg') || 'garage'; if (!NEGS[NEG]) NEG = 'garage'; } catch (e) { /* sin almacenamiento */ }
// Cada negocio con sus colores (Plata Garage: oscuro y naranja; Plata Marine y Rotulito: los de su web)
const tema = () => { document.documentElement.dataset.neg = NEG; const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = NEG === 'garage' ? '#050505' : '#ffffff'; };
tema();
const NAV_OTRO = [['resumen', 'Resumen'], ['clientes', 'Clientes'], ['conexion', 'Entrada de leads']];
const logoTag = (n = NEG) => `<span class="nlg${NEGS[n].dark ? '' : ' w'}"><img src="${NEGS[n].logo}" alt="${NEGS[n].n}"></span>`;
function shell(active) {
  tema();
  if (!$('.lay')) {
    $('#app').innerHTML = `<div class="mob"><a href="#" id="mlg">${logoTag()}</a><button class="rb" id="mb" aria-label="Menú">${IC.menu}</button></div><div class="lay"><aside id="sb"></aside><main id="mn"></main></div>`;
    $('#mb').onclick = () => $('#sb').classList.add('open');
    $('#mlg').onclick = (e) => { e.preventDefault(); goHome(); };
  }
  const ml = $('#mlg'); if (ml) ml.innerHTML = logoTag();
  $('#sb').innerHTML = `<div class="sbh"><a class="lg" href="#" id="slg">${logoTag()}</a><button class="rb mo" id="sx" aria-label="Cerrar menú">${IC.x}</button></div>
    <div class="negs"${MIS.length < 2 ? ' style="display:none"' : ''}>${MIS.map((k) => `<button data-neg="${k}" class="${k === NEG ? 'on' : ''}" title="${NEGS[k].n}">${NEGS[k].n}</button>`).join('')}</div><small class="sbl">Backoffice</small>` +
    (NEG === 'garage' ? NAV : NAV_OTRO).map(([k, t]) => `<a href="#${k}" class="${active === k ? 'on' : ''}">${IC[k]}${t}${badges[k] ? `<span class="bd">${badges[k]}</span>` : ''}</a>`).join('') +
    `<div class="sp"></div><a href="${NEG === 'marine' ? 'https://www.platamarine.com/' : NEG === 'rotulito' ? 'https://www.rotulito.com/' : B + '/'}" target="_blank" rel="noopener">${IC.web}Ver web pública</a><small class="mu" style="display:block;font-size:12px;margin:10px 6px 2px">Has entrado como <b>${esc(QUIEN_YO)}</b></small><a href="#" id="lo">${IC.out}Cambiar de persona</a>`;
  $('#sx').onclick = () => $('#sb').classList.remove('open');
  $('#sb').querySelectorAll('[data-neg]').forEach((b) => (b.onclick = () => { NEG = b.dataset.neg; try { localStorage.setItem('pg_neg', NEG); } catch (e) { /* */ } $('#sb').classList.remove('open'); goHome(); }));
  $('#slg').onclick = (e) => { e.preventDefault(); $('#sb').classList.remove('open'); goHome(); };
  $('#lo').onclick = guard(async (e) => { e.preventDefault(); await fetch(API + '/logout'); history.replaceState(null, '', location.pathname); showLogin(); });
  $('#sb').classList.remove('open');
  return $('#mn');
}
const home = () => (NEG === 'garage' ? '#leads' : '#resumen');
function goHome() { if (location.hash === home()) route(); else location.hash = home(); }
const top = (t, sub = '', right = '') => `<div class="top"><div><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${right}</div></div>`;
const badge = (s) => { const m = { pendiente: 'w', confirmada: 'b', completada: 'ok', cancelada: 'r', contactado: 'b', ofertado: 'o', cerrada: 'ok', 'presupuesto enviado': 'b', aceptado: 'ok', rechazado: 'r', respondido: 'ok' }; return `<span class="bg ${m[s] || 'x'}">${esc(s[0].toUpperCase() + s.slice(1))}</span>`; };

// ---------- vistas ----------
const V = {};

const fechaLarga = (iso) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '');
// Recordatorio de cita por WhatsApp: se abre el chat con el texto escrito y Cristina solo pulsa enviar
const recordatorio = (b) => { const [y, mo, d] = String(b.fecha || '').split('-');
  return waLink(b.telefono, `Tenemos una visita para ver el coche:\n\n📅 ${d}/${mo} a las ${b.hora}\n📍 Calle Tetuán 92, Sabadell\n\nQuedo pendiente de tu confirmación.\n\nSi te interesa asegurarlo antes de venir, podemos dejarlo reservado y así evitar que otro cliente se adelante. Si quieres, te indico cómo hacerlo.`); };
const KIC = { coches: IC.coches, 'coches/vendidos': IC.coches, reservas: IC.reservas, valoraciones: IC.valoraciones, envios: IC.envios, mensajes: IC.mensajes, busquedas: IC.busquedas, alertas: IC.alertas, clientes: IC.clientes };
V.resumen = async (m) => {
  const s = await api('/admin/summary');
  badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes };
  m = shell('resumen');
  const k = (n, t, h) => `<a class="card" href="#${h}"><span>${t}</span><i>${KIC[h] || IC.resumen}</i><b>${n}</b></a>`;
  const fila = (b, right) => `<div class="li"><div><b>${esc(b.nombre)}</b><span>${esc(b.motivo || b.cocheNombre || '')} · ${esc(b.telefono)}</span></div><div class="r">${right}</div></div>`;
  m.innerHTML = top('Resumen', 'Estado general de la actividad reciente.', notifBtn()) +
    `<div class="kp">${k(s.enStock, 'Coches en stock', 'coches')}${k(s.vendidos, 'Coches vendidos', 'coches/vendidos')}${k(s.citasPendientes, 'Citas pendientes', 'reservas')}${k(s.tasacionesNuevas, 'Valoraciones nuevas', 'valoraciones')}${k(s.enviosPendientes, 'Envíos pendientes', 'envios')}${k(s.mensajesSinLeer, 'Mensajes sin leer', 'mensajes')}${k(s.busquedasPendientes || 0, 'Te lo buscamos (nuevas)', 'busquedas')}${k(s.alertasActivas || 0, 'Alertas de stock activas', 'alertas')}${k(s.destacados, 'Destacados activos', 'coches')}${k(eur(s.valorStock), 'Valor del stock', 'coches')}</div>
    ${s.porDueno?.length ? `<div class="kp">${s.porDueno.map((d) => `<a class="card" href="#coches/${d.o === 'Cristina' ? 'cristina' : d.o === 'Juan' ? 'juan' : 'stock'}"><span>Stock de ${esc(d.o)}</span><i>${IC.coches}</i><b>${d.n} · ${eur(d.v)}</b></a>`).join('')}</div>` : ''}
    <div id="int"></div>
    ${s.manana?.length ? `<div class="card sec hl"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3>Citas de mañana (${s.manana.length})</h3><span class="mu sm">Envía el recordatorio por WhatsApp con un clic</span></div>${s.manana.map((b) => fila(b, `<b class="o">${b.hora}</b> <a class="btn g s" target="_blank" rel="noopener" href="${recordatorio(b)}">${IC.wa}Recordar</a>`)).join('')}</div>` : ''}
    <div class="card sec"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3>Últimas reservas</h3><a href="#reservas" class="sm" style="color:var(--or)">Ver todas</a></div>${s.ultimasReservas?.length ? s.ultimasReservas.map((b) => fila(b, `${fdate(b.fecha)}<br><b class="o">${b.hora}</b>`)).join('') : '<p class="mu">Aún no hay reservas.</p>'}</div>
    <div class="two"><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Próximas citas</h3><a href="#reservas/semana" class="sm" style="color:var(--or)">Ver la semana</a></div>${s.proximasCitas.length ? `<table>${s.proximasCitas.map((b) => `<tr><td><b>${esc(b.nombre)}</b><br><span class="mu sm">${esc(b.cocheNombre || b.motivo)}</span></td><td>${fdate(b.fecha)} · ${b.hora}</td><td>${badge(b.status)}</td></tr>`).join('')}</table>` : '<p class="mu">No hay citas próximas.</p>'}</div>
    <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Últimas tasaciones</h3><a href="#valoraciones" class="sm" style="color:var(--or)">Ver todas</a></div>${s.ultimasTasaciones.length ? `<table>${s.ultimasTasaciones.map((t) => `<tr><td><b>${esc(t.marca)} ${esc(t.modelo)}</b><br><span class="mu sm">${esc(t.nombre)}</span></td><td>${fdate(t.created)}</td><td>${badge(t.status)}</td></tr>`).join('')}</table>` : '<p class="mu">Aún no hay tasaciones.</p>'}</div></div>`;
  bindNotif();
  // #44 coches del stock que encajan con alguien que pidió aviso o que nos encargó buscarle uno
  Promise.all([api('/admin/cars'), api('/admin/alertas'), api('/admin/busquedas')]).then(([cars, als, bus]) => {
    const rows = cars.filter((c) => !c.sold && !c.hidden).map((c) => ({ c, n: matches(c, als, bus).length })).filter((x) => x.n).sort((a, b) => b.n - a.n).slice(0, 6);
    if (rows.length && $('#int')) $('#int').innerHTML = `<div class="card sec hl"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3>Coches con interesados esperando</h3><span class="mu sm">Ábrelos y pulsa "Avisar a interesados"</span></div>${rows.map(({ c, n }) => `<a class="li" href="#coche/${c.id}" style="text-decoration:none"><div><b>${esc(c.brand)} ${esc(c.model)} ${esc(c.version || '')}</b><span>${eur(c.price)} · ${c.year}</span></div><div class="r"><b class="o">${n} interesado${n === 1 ? '' : 's'}</b></div></a>`).join('')}</div>`;
  }).catch(() => {});
};

// ---------- avisos en el móvil/ordenador (con el panel abierto o instalado como app) ----------
const notifBtn = () => ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') ? `<button class="btn g" id="nb">${IC.alertas}Activar avisos</button>` : '';
function bindNotif() { const b = $('#nb'); if (b) b.onclick = async () => { const r = await Notification.requestPermission(); toast(r === 'granted' ? 'Avisos activados en este dispositivo' : 'No se han activado los avisos', r !== 'granted'); b.remove(); }; }
let lastSum = null;
async function poll() {
  if (NEG !== 'garage') return;
  try {
    const s = await api('/admin/summary');
    const cur = { citas: s.citasPendientes, tas: s.tasacionesNuevas, env: s.enviosPendientes, msg: s.mensajesSinLeer, bus: s.busquedasPendientes };
    badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes };
    if (lastSum) {
      const t = { citas: 'Nueva cita', tas: 'Nueva tasación', env: 'Nueva solicitud de envío', msg: 'Nuevo mensaje', bus: 'Nueva petición "Te lo buscamos"' };
      const h = { citas: 'reservas', tas: 'valoraciones', env: 'envios', msg: 'mensajes', bus: 'busquedas' };
      Object.keys(cur).forEach((k) => { if (cur[k] > lastSum[k]) { if ('Notification' in window && Notification.permission === 'granted') { const o = { body: 'Ábrela en el panel', icon: B + '/assets/icon-192.png', tag: k }; if (swReg) swReg.showNotification(t[k] + ' · Plata Garage', o); else { const n = new Notification(t[k] + ' · Plata Garage', o); n.onclick = () => { window.focus(); location.hash = '#' + h[k]; }; } } toast(t[k]); } });
      const act = (location.hash.slice(1) || 'resumen').split('/')[0]; if ($('#sb') && !$('#sb').classList.contains('open')) shell(act);
    }
    lastSum = cur;
  } catch (e) { /* sin sesión */ }
}
V.coches = async (m, arg) => {
  const cars = await api('/admin/cars'); m = shell('coches');
  const f = arg || 'stock';
  const list = cars.filter((c) => (f === 'stock' ? !c.sold : f === 'vendidos' ? c.sold : f === 'cristina' ? !c.sold && c.owner === 'Cristina' : f === 'juan' ? !c.sold && c.owner === 'Juan' : true));
  const st = (c) => (c.sold ? '<span class="bg x">Vendido</span>' : c.status === 'reservado' ? '<span class="bg b">Reservado</span>' : c.status === 'preparacion' ? '<span class="bg w">En preparación</span>' : '<span class="bg ok">En stock</span>') + (c.featured && !c.sold ? '<span class="bg o">Destacado</span>' : '') + (c.hidden ? '<span class="bg r">Oculto</span>' : '');
  m.innerHTML = top('Coches', `${cars.filter((c) => !c.sold).length} en stock · ${cars.filter((c) => c.sold).length} vendidos`, `<a class="btn" href="#coche/nuevo">+ Nuevo coche</a>`) +
    `<div class="filt">${[['stock', 'En stock'], ['cristina', 'De Cristina'], ['juan', 'De Juan'], ['vendidos', 'Vendidos'], ['todos', 'Todos']].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div class="tw"><table class="ct"><thead><tr><th>Coche</th><th>Año</th><th class="hide-m">Km</th><th>Precio</th><th>Estado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${list.map((c) => `<tr data-id="${c.id}"><td><a class="cn" href="#coche/${c.id}" title="Editar"><img class="thumb" src="${esc(c.images?.[0] || '')}" alt="" loading="lazy"><div><b>${esc(c.brand)} ${esc(c.model)}</b><small>${esc(c.version || '')}${c.owner ? ' · ' + esc(c.owner) : ''}</small></div></a></td><td>${c.year}</td><td class="hide-m">${nf(c.km)}</td><td><b>${eur(c.price)}</b></td><td>${st(c)}</td>
    <td><div class="acts"><button class="ib ${c.featured ? 'on' : ''}" data-a="star" title="Destacar en la portada">${IC.star}</button><a class="ib" href="#coche/${c.id}" title="Editar">${IC.edit}</a><button class="ib" data-a="dup" title="Duplicar (para dar de alta uno parecido)">${IC.copy}</button><button class="btn g s" data-a="sold">${c.sold ? 'Volver a stock' : 'Vendido'}</button><button class="btn r s" data-a="del">Eliminar</button></div></td></tr>`).join('') || '<tr><td colspan="6" class="mu">No hay coches.</td></tr>'}</tbody></table></div>`;
  m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = '#coches/' + b.dataset.f)));
  m.querySelectorAll('[data-a]').forEach((b) => (b.onclick = guard(async () => {
    const id = b.closest('tr').dataset.id, c = cars.find((x) => x.id === id), a = b.dataset.a;
    if (a === 'del') { if (!confirm(`¿Eliminar definitivamente el ${c.brand} ${c.model}? Si se ha vendido, mejor márcalo como vendido.`)) return; await api('/admin/cars/' + id, { method: 'DELETE' }); toast('Coche eliminado'); }
    if (a === 'star') { await api('/admin/cars/' + id, { method: 'PUT', body: { featured: !c.featured } }); }
    if (a === 'dup') { const n = await api(`/admin/cars/${id}/duplicar`, { method: 'POST' }); toast('Copia creada (oculta): cambia los datos y las fotos'); location.hash = '#coche/' + n.id; return; }
    if (a === 'sold') {
      if (c.sold) { await api('/admin/cars/' + id, { method: 'PUT', body: { sold: false } }); toast('Vuelve a estar en stock'); }
      else { const buyer = await pickBuyer(c); if (buyer === null) return; await api('/admin/cars/' + id, { method: 'PUT', body: { sold: true, buyer } }); toast('Marcado como vendido'); }
    }
    route();
  })));
};

// Ventana para elegir quién lo ha comprado (opcional): así el embudo pasa solo a "Vendido"
function modal(html) { const d = document.createElement('div'); d.className = 'mdl'; d.innerHTML = `<div class="card">${html}</div>`; document.body.appendChild(d); d.onclick = (e) => { if (e.target === d) d.remove(); }; return d; }
async function pickBuyer(c) {
  const cl = await api('/admin/clientes').catch(() => []);
  return new Promise((ok) => {
    const d = modal(`<h3 style="margin-bottom:6px">Marcar como vendido</h3><p class="mu" style="margin:0 0 14px">${esc(c.brand)} ${esc(c.model)} dejará de verse en la web (su enlace lleva al catálogo).</p>
    <label>¿Quién lo ha comprado? (opcional)<select id="bu"><option value="">— No lo sé / no está en la lista —</option>${cl.map((x) => `<option value="${x.key}"${x.leads.some((l) => l.coche === c.slug) ? ' selected' : ''}>${esc(x.nombre)} · ${esc(x.telefono)}</option>`).join('')}</select></label>
    <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn g" id="bc">Cancelar</button><button class="btn" id="bo">Marcar vendido</button></div>`);
    $('#bc', d).onclick = () => { d.remove(); ok(null); }; $('#bo', d).onclick = () => { const v = $('#bu', d).value; d.remove(); ok(v); };
  });
}

// Reduce la foto en el navegador antes de subirla (máx. 1600 px, JPEG)
function shrink(file, max = 1600) {
  return new Promise((ok, ko) => {
    const img = new Image(); const u = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); const w = c.toDataURL('image/webp', 0.85); ok(w.startsWith('data:image/webp') ? { type: 'image/webp', data: w.split(',')[1] } : { type: 'image/jpeg', data: c.toDataURL('image/jpeg', 0.84).split(',')[1] }); };
    img.onerror = () => ko(new Error('No se pudo leer ' + file.name)); img.src = u;
  });
}
async function upload(files, onEach) {
  for (const f of files) { if (!/^image\//.test(f.type)) continue; const im = await shrink(f); const r = await api('/admin/upload', { method: 'POST', body: { name: f.name, type: im.type, data: im.data } }); onEach(r.url); }
}

V.coche = async (m, id) => {
  const isNew = id === 'nuevo';
  const [c, holders, cl, als, bus] = await Promise.all([isNew ? Promise.resolve({ images: [], features: [], status: 'disponible', featured: true }) : api('/admin/cars/' + id), api('/admin/holders'), isNew ? [] : api('/admin/clientes').catch(() => []), isNew ? [] : api('/admin/alertas').catch(() => []), isNew ? [] : api('/admin/busquedas').catch(() => [])]);
  m = shell('coches');
  let imgs = [...(c.images || [])];
  const sel = (n, opts, v) => `<select name="${n}">${opts.map((o) => (Array.isArray(o) ? o : [o, o])).map(([val, t]) => `<option value="${esc(val)}"${String(v ?? '') === String(val) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  const inp = (n, l, t = 'text', extra = '') => `<label>${l}<input name="${n}" type="${t}" value="${esc(c[n] ?? '')}" ${extra}></label>`;
  m.innerHTML = top(isNew ? 'Nuevo coche' : `${esc(c.brand)} ${esc(c.model)}`, isNew ? 'Rellena los datos y añade las fotos.' : `Ficha pública: <a href="${B}/vehiculos/${c.slug}" target="_blank" style="color:var(--or)">${B}/vehiculos/${c.slug}</a>`, `<a class="btn g" href="#coches">Volver</a>`) +
  `<form id="cf">
  <div class="card sec"><h3>Identificación</h3><div class="fg">${inp('brand', 'Marca *', 'text', 'required')}${inp('model', 'Modelo *', 'text', 'required')}${inp('version', 'Versión')}<label>De quién es (interno, no sale en la web)${sel('owner', [['', '— Sin asignar —'], 'Cristina', 'Juan'], c.owner)}</label></div></div>
  <div class="card sec"><h3>Datos principales</h3><div class="fg">${inp('year', 'Año *', 'number', 'min="1950" max="2100" required')}${inp('km', 'Kilómetros *', 'number', 'min="0" required')}${inp('price', 'Precio (€) *', 'number', 'min="0" required')}
  <label>Combustible *${sel('fuel', ['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico', 'GLP'], c.fuel || 'Gasolina')}</label><label>Cambio *${sel('trans', ['Manual', 'Automático'], c.trans || 'Manual')}</label><label>Carrocería${sel('body', [['', '—'], 'Berlina', 'Compacto', 'Familiar', 'SUV', 'Coupé', 'Cabrio', 'Monovolumen', 'Furgoneta', 'Pickup'], c.body)}</label>
  ${inp('cv', 'Potencia (CV)', 'number')}<label>Etiqueta DGT${sel('etiqueta', [['', 'Según la descripción'], 'CERO', 'ECO', 'C', 'B', ['SIN', 'Sin etiqueta']], c.etiqueta)}</label>${inp('doors', 'Puertas', 'number')}${inp('seats', 'Plazas', 'number')}${inp('color', 'Color')}</div></div>
  <div class="card sec"><h3>Financiación (uso interno)</h3><div class="fg">${inp('monthly', 'Cuota desde (€/mes)', 'number')}${inp('term', 'Plazo (meses)', 'number')}</div><p class="mu sm">No se muestra en la web: para publicar una cuota hay que poner también TIN, TAE y un ejemplo representativo (Ley 16/2011).</p></div>
  <div class="card sec"><h3>Reserva</h3><div class="fg"><label>Titular de las cuentas para la reserva${sel('holder', [['', '— Sin reserva —'], ...holders.map((h) => [h.id, `${h.name} · ${h.accounts.length} cuenta${h.accounts.length === 1 ? '' : 's'}`])], c.holder)}</label>${inp('reserve', 'Importe de la señal (€)', 'number')}</div><p class="mu sm">Si pones importe, la ficha muestra "Reserva este coche" y el cliente pide la reserva. Las cuentas no salen en la web: se las pasáis al confirmar.</p></div>
  <div class="card sec"><h3>Descripción y equipamiento</h3><div class="fg"><label class="s3">Descripción *<textarea name="desc" required rows="8">${esc(c.desc || '')}</textarea></label><label class="s3">Cómo lo vemos (opcional: vuestra opinión del coche, sale en la ficha)<textarea name="comment" rows="4">${esc(c.comment || '')}</textarea></label><label class="s3">Equipamiento (uno por línea)<textarea name="features" rows="8">${esc((c.features || []).join('\n'))}</textarea></label></div></div>
  <div class="card sec"><h3>Imágenes</h3><p class="mu sm" style="margin:-6px 0 12px">La primera es la portada (★ para cambiarla). Arrástralas o usa las flechas para ordenarlas. Se reducen solas antes de subir.</p><div class="imgs" id="ig"></div><input type="file" id="fi" accept="image/*" multiple hidden></div>
  <div class="card sec"><h3>Visibilidad</h3><div class="row" style="gap:22px"><label>Estado${sel('status', [['disponible', 'Disponible'], ['preparacion', 'En preparación (próximamente)'], ['reservado', 'Reservado']], c.status)}</label>
  <label class="chk"><input type="checkbox" name="featured" ${c.featured ? 'checked' : ''}>Destacado en la portada</label><label class="chk"><input type="checkbox" name="hidden" ${c.hidden ? 'checked' : ''}>Ocultar de la web</label><label class="chk"><input type="checkbox" name="sold" ${c.sold ? 'checked' : ''}>Marcar como vendido</label></div>
  ${isNew ? '' : `<label style="margin-top:12px;max-width:420px">Comprador (para el embudo de clientes)<select name="buyer"><option value="">—</option>${cl.map((x) => `<option value="${x.key}"${c.buyer === x.key ? ' selected' : ''}>${esc(x.nombre)} · ${esc(x.telefono)}</option>`).join('')}</select></label>`}</div>
  <div class="row" style="justify-content:flex-end"><a class="btn g" href="#coches">Cancelar</a><button class="btn" type="submit">${isNew ? 'Crear coche' : 'Guardar cambios'}</button></div></form>${isNew ? '' : interesados(c, als, bus) + historial(c)}`;
  const drawImgs = () => {
    $('#ig').innerHTML = imgs.map((u, i) => `<div class="im"><img src="${esc(u)}" alt="">${i === 0 ? '<span class="bg o p">Portada</span>' : ''}<div class="t"><span><button type="button" data-m="${i}" data-d="-1">←</button> <button type="button" data-m="${i}" data-d="1">→</button>${i ? ` <button type="button" data-c="${i}" title="Poner de portada">★</button>` : ''}</span><button type="button" data-x="${i}">✕</button></div></div>`).join('') + `<div class="drop" id="dz">+ Añadir fotos<br><span class="sm">o arrástralas aquí</span></div>`;
    $('#ig').querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { const i = +b.dataset.m, j = i + +b.dataset.d; if (j < 0 || j >= imgs.length) return; [imgs[i], imgs[j]] = [imgs[j], imgs[i]]; drawImgs(); }));
    $('#ig').querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { const [x] = imgs.splice(+b.dataset.c, 1); imgs.unshift(x); drawImgs(); }));
    $('#ig').querySelectorAll('.im').forEach((el, i) => { el.draggable = true; el.ondragstart = (e) => e.dataTransfer.setData('text/x-i', String(i)); el.ondragover = (e) => e.preventDefault(); el.ondrop = (e) => { const f = e.dataTransfer.getData('text/x-i'); if (f === '') return; e.preventDefault(); e.stopPropagation(); const [x] = imgs.splice(+f, 1); imgs.splice(i, 0, x); drawImgs(); }; });
    $('#ig').querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => { imgs.splice(+b.dataset.x, 1); drawImgs(); }));
    const dz = $('#dz'); dz.onclick = () => $('#fi').click();
    dz.ondragover = (e) => { e.preventDefault(); dz.style.borderColor = 'var(--or)'; }; dz.ondragleave = () => (dz.style.borderColor = '');
    dz.ondrop = (e) => { e.preventDefault(); add([...e.dataTransfer.files]); };
  };
  const add = guard(async (files) => { const dz = $('#dz'); dz.textContent = 'Subiendo…'; await upload(files, (u) => { imgs.push(u); }); drawImgs(); toast('Fotos subidas'); });
  $('#fi').onchange = (e) => add([...e.target.files]);
  drawImgs();
  $('#cf').onsubmit = guard(async (e) => {
    e.preventDefault(); const f = e.target, b = f.querySelector('button[type=submit]'); b.disabled = true;
    try {
      const d = Object.fromEntries(new FormData(f)); ['featured', 'hidden', 'sold'].forEach((k) => (d[k] = f[k].checked)); d.images = imgs;
      if (!imgs.length && !confirm('No has añadido fotos. ¿Guardar igualmente?')) return;
      const r = await api(isNew ? '/admin/cars' : '/admin/cars/' + id, { method: isNew ? 'POST' : 'PUT', body: d });
      toast(isNew ? 'Coche creado' : 'Cambios guardados'); location.hash = '#coche/' + r.id; if (!isNew) route();
    } finally { b.disabled = false; }
  });
};

// Personas que pidieron aviso o encargo y encajan con este coche (solo las que dieron su consentimiento para ello)
function matches(c, als, bus) {
  const N = (x) => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const txt = N([c.brand, c.model, c.version, c.fuel, c.trans, c.body].join(' '));
  const a = als.filter((x) => x.status === 'activa' && (x.coche ? x.coche === c.slug : (!x.max || c.price <= x.max * 1.05) && (!x.busca || N(x.busca).split(/[^a-z0-9]+/).filter((w) => w.length > 2).some((w) => txt.includes(w)))));
  const b = bus.filter((y) => y.status !== 'cerrada' && (!y.presupuesto || c.price <= y.presupuesto * 1.05) && (!y.marca || N(c.brand).includes(N(y.marca))) && (!y.modelo || txt.includes(N(y.modelo).split(' ')[0])) && (!y.combustible || N(c.fuel).startsWith(N(y.combustible).slice(0, 5))) && (!y.cambio || c.trans === y.cambio) && (!y.kmMax || c.km <= y.kmMax) && (!y.anioDesde || c.year >= y.anioDesde));
  return [...a, ...b];
}
function interesados(c, als, bus) {
  const N = (x) => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const txt = N([c.brand, c.model, c.version, c.fuel, c.trans, c.body].join(' '));
  const okA = als.filter((a) => a.status === 'activa' && (!a.max || c.price <= a.max * 1.05) && (!a.busca || N(a.busca).split(/[^a-z0-9]+/).filter((w) => w.length > 2).some((w) => txt.includes(w))));
  const okB = bus.filter((b) => !['cerrada'].includes(b.status) && (!b.presupuesto || c.price <= b.presupuesto * 1.05) && (!b.marca || N(c.brand).includes(N(b.marca))) && (!b.modelo || txt.includes(N(b.modelo).split(' ')[0])) && (!b.combustible || N(c.fuel).startsWith(N(b.combustible).slice(0, 5))) && (!b.cambio || c.trans === b.cambio) && (!b.kmMax || c.km <= b.kmMax) && (!b.anioDesde || c.year >= b.anioDesde));
  const url = location.origin + B + '/vehiculos/' + c.slug; const nm = `${c.brand} ${c.model}${c.version ? ' ' + c.version : ''} (${c.year})`;
  if (!okA.length && !okB.length) return `<div class="card sec"><h3>Avisar a interesados</h3><p class="mu" style="margin:6px 0 0">Ahora mismo nadie de "Alertas" ni de "Te lo buscamos" encaja con este coche.</p></div>`;
  return `<div class="card sec"><h3>Avisar a interesados (${okA.length + okB.length})</h3><p class="mu sm" style="margin:4px 0 12px">Encajan por presupuesto y por lo que buscaban. Cada botón abre el mensaje ya escrito; tú decides si lo envías.</p>
  ${okB.map((b) => `<div class="li"><div><b>${esc(b.nombre)}</b><span>Te lo buscamos: ${esc([b.marca, b.modelo].filter(Boolean).join(' ') || 'cualquiera')} · hasta ${eur(b.presupuesto)}</span></div><div class="r"><a class="btn g s" target="_blank" rel="noopener" href="${waLink(b.telefono, `Hola ${String(b.nombre).split(' ')[0]}, te escribimos de Plata Garage por el coche que nos pediste que te buscáramos. Nos ha entrado un ${nm} por ${eur(c.price)} que puede encajarte: ${url}`)}">${IC.wa}WhatsApp</a></div></div>`).join('')}
  ${okA.map((a) => `<div class="li"><div><b>${esc(a.email)}</b><span>Alerta: ${esc(a.busca || 'cualquier coche')}${a.max ? ' · hasta ' + eur(a.max) : ''}</span></div><div class="r"><a class="btn g s" href="mailto:${esc(a.email)}?subject=${encodeURIComponent('Ha entrado un coche que te puede interesar · Plata Garage')}&body=${encodeURIComponent(`Hola,

Nos pediste que te avisáramos cuando entrara un coche como el que buscas. Acaba de entrar este ${nm} por ${eur(c.price)}:
${url}

Si quieres verlo, puedes pedir cita en la web o escribirnos por WhatsApp al 660 49 32 28.

Un saludo,
Plata Garage

Si ya no quieres recibir estos avisos, responde a este correo con "baja".`)}">Email</a></div></div>`).join('')}</div>`;
}
function historial(c) {
  const ph = c.priceHistory || []; const lg = [...(c.log || [])].reverse();
  if (!ph.length && !lg.length) return '';
  return `<div class="card sec"><h3>Historial</h3>${ph.length > 1 ? `<p class="sm mu" style="margin:8px 0 4px">Precios: ${ph.map((x) => `${fdate(x.d)} <b style="color:var(--hi)">${eur(x.p)}</b>`).join(' → ')}. Precio más bajo de los últimos 30 días: <b style="color:var(--hi)">${eur(Math.min(...ph.filter((x) => (Date.now() - new Date(x.d)) / 864e5 <= 30).map((x) => x.p).concat(c.price)))}</b> (es el que habría que tachar si se anuncia una rebaja).</p>` : ''}
  ${lg.slice(0, 15).map((x) => `<div class="sm" style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="mu">${fdt(x.d)} · ${esc(x.by || '')}</span> — ${esc(x.t)}</div>`).join('')}</div>`;
}

V.bancos = async (m) => {
  let hs = await api('/admin/holders'); m = shell('bancos');
  const draw = () => {
    m.innerHTML = top('Bancos', 'Da de alta <b>titulares</b> y, dentro de cada uno, sus <b>números de cuenta</b>. Al crear un coche solo eliges el titular.') +
    `<div class="card sec"><b>Bizum de la empresa</b><p class="mu" style="margin:4px 0 0">Las reservas por Bizum usan el número <b style="color:var(--hi)">660 49 32 28</b>.</p></div>
    <div class="card sec"><div class="row"><label style="flex:1">Nombre del titular *<input id="hn" placeholder="Ej: Cristina Plata"></label><button class="btn" id="ha" style="align-self:flex-end">+ Añadir titular</button></div></div>
    <div class="two">${hs.map((h, i) => `<div class="card"><label>Titular<input data-h="${i}" value="${esc(h.name)}"></label><div style="margin:12px 0">${h.accounts.map((a, j) => `<div class="row" style="margin-bottom:8px"><input placeholder="Banco" data-b="${i}.${j}" value="${esc(a.bank)}" style="flex:1"><input placeholder="IBAN" data-i="${i}.${j}" value="${esc(a.iban)}" style="flex:2"><button class="ib" data-xa="${i}.${j}" title="Quitar cuenta">✕</button></div>`).join('')}
    <button class="btn g s" data-aa="${i}">+ Añadir cuenta</button></div><div class="row" style="justify-content:space-between"><button class="btn r s" data-xh="${i}">Eliminar titular</button><button class="btn s" data-sv>Guardar</button></div></div>`).join('')}</div>`;
    const sync = () => { m.querySelectorAll('[data-h]').forEach((x) => (hs[x.dataset.h].name = x.value)); m.querySelectorAll('[data-b]').forEach((x) => { const [i, j] = x.dataset.b.split('.'); hs[i].accounts[j].bank = x.value; }); m.querySelectorAll('[data-i]').forEach((x) => { const [i, j] = x.dataset.i.split('.'); hs[i].accounts[j].iban = x.value; }); };
    const saveAll = guard(async () => { sync(); hs = await api('/admin/holders', { method: 'PUT', body: hs }); toast('Guardado'); draw(); });
    $('#ha').onclick = () => { const n = $('#hn').value.trim(); if (!n) return; sync(); hs.push({ name: n, accounts: [] }); saveAll(); };
    m.querySelectorAll('[data-aa]').forEach((b) => (b.onclick = () => { sync(); hs[b.dataset.aa].accounts.push({ bank: '', iban: '' }); draw(); }));
    m.querySelectorAll('[data-xa]').forEach((b) => (b.onclick = () => { sync(); const [i, j] = b.dataset.xa.split('.'); hs[i].accounts.splice(j, 1); draw(); }));
    m.querySelectorAll('[data-xh]').forEach((b) => (b.onclick = () => { if (!confirm('¿Eliminar este titular y sus cuentas?')) return; sync(); hs.splice(b.dataset.xh, 1); saveAll(); }));
    m.querySelectorAll('[data-sv]').forEach((b) => (b.onclick = saveAll));
  };
  draw();
};

// Bandejas: reservas, valoraciones, envíos, mensajes
function inbox({ key, path, title, sub, states, body }) {
  return async (m, arg) => {
    const [list, holders, cars] = await Promise.all([api('/admin/' + path), key === 'reservas' ? api('/admin/holders') : [], key === 'reservas' ? api('/admin/cars') : []]);
    m = shell(key); const f = arg || 'todas';
    if (key === 'reservas' && f === 'semana') return agenda(m, list);
    const shown = list.filter((x) => (f === 'todas' ? true : f === 'activas' ? !['cancelada', 'completada', 'cerrada', 'rechazado', 'respondido'].includes(x.status) : x.status === f));
    m.innerHTML = top(title, sub(list)) + `<div class="filt">${[...(key === 'reservas' ? [['semana', 'Agenda semanal']] : []), ['todas', 'Todas'], ['activas', 'Abiertas'], ...states.map((s) => [s, s[0].toUpperCase() + s.slice(1)])].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>` +
      (shown.map((x) => `<div class="card it" data-id="${x.id}"><div class="hd"><div><b style="font-size:16px">${esc(x.nombre)}</b><div class="meta">${x.email ? esc(x.email) + ' · ' : ''}<a href="tel:${esc(x.telefono)}">${esc(x.telefono)}</a> · recibido ${fdt(x.created)}</div></div>${badge(x.status)}</div>
      <div class="row" style="margin:14px 0;align-items:stretch">${body(x, { holders, cars })}</div>
      <label>Notas internas<textarea data-n rows="2" style="min-height:60px">${esc(x.notas || '')}</textarea></label>
      <div class="row" style="margin-top:12px"><select data-s style="width:auto">${states.map((s) => `<option${s === x.status ? ' selected' : ''}>${s}</option>`).join('')}</select><button class="btn s" data-sv>Guardar</button><a class="btn g s" target="_blank" rel="noopener" href="${waLink(x.telefono, 'Hola ' + x.nombre.split(' ')[0] + ', te escribimos de Plata Garage. ')}">Responder por WhatsApp</a>${key === 'reservas' && x.fecha >= new Date().toISOString().slice(0, 10) && x.status !== 'cancelada' ? `<a class="btn g s" target="_blank" rel="noopener" href="${recordatorio(x)}">${IC.wa}Recordar cita</a>` : ''}<a class="btn g s" href="#cliente/${String(x.telefono).replace(/\D/g, '').slice(-9)}">Ficha del cliente</a>${x.email ? `<a class="btn g s" href="mailto:${esc(x.email)}">Email</a>` : ''}<span style="flex:1"></span><button class="btn r s" data-del>Borrar</button></div></div>`).join('') || '<div class="card mu">No hay nada aquí todavía.</div>');
    m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = `#${key}/${b.dataset.f}`)));
    m.querySelectorAll('.it').forEach((el) => {
      const id = el.dataset.id;
      el.querySelector('[data-sv]').onclick = guard(async () => { const extra = key === 'mensajes' ? { leido: true } : {}; await api(`/admin/${path}/${id}`, { method: 'PUT', body: { status: el.querySelector('[data-s]').value, notas: el.querySelector('[data-n]').value, ...extra } }); toast('Guardado'); route(); });
      el.querySelector('[data-del]').onclick = guard(async () => { if (!confirm('¿Borrar esta solicitud? No se puede deshacer.')) return; await api(`/admin/${path}/${id}`, { method: 'DELETE' }); toast('Borrado'); route(); });
    });
    if (key === 'mensajes') list.filter((x) => !x.leido).forEach((x) => api(`/admin/mensajes/${x.id}`, { method: 'PUT', body: { leido: true } }).catch(() => {}));
  };
}
// Agenda de 7 días a partir de hoy (o de la semana elegida)
function agenda(m, list, off = 0) {
  const d0 = new Date(); d0.setDate(d0.getDate() + off * 7); const days = [...Array(7)].map((_, i) => { const d = new Date(d0); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); });
  m.innerHTML = top('Reservas', 'Agenda de los próximos 7 días.', `<button class="btn g" id="ap">‹ Anterior</button><button class="btn g" id="an">Siguiente ›</button>`) + `<div class="filt"><button class="on">Agenda semanal</button><button data-f="todas">Lista</button></div>
  <div class="ag">${days.map((d) => { const bs = list.filter((b) => b.fecha === d && b.status !== 'cancelada').sort((a, z) => a.hora.localeCompare(z.hora)); return `<div class="card"><h4>${new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</h4>${bs.map((b) => `<div class="ev ${b.status}"><b>${b.hora}</b> ${esc(b.nombre)}<span>${esc(b.cocheNombre || b.motivo || '')}</span><div class="row" style="margin-top:6px">${badge(b.status)}<a class="btn g s" target="_blank" rel="noopener" href="${recordatorio(b)}">${IC.wa}Recordar</a></div></div>`).join('') || '<p class="mu sm">Sin citas</p>'}</div>`; }).join('')}</div>`;
  $('#ap').onclick = () => agenda(m, list, off - 1); $('#an').onclick = () => agenda(m, list, off + 1);
  m.querySelector('[data-f]').onclick = () => (location.hash = '#reservas/todas');
}
const bx = (k, v) => `<div class="box2" style="flex:1;min-width:150px"><small>${k}</small>${v}</div>`;
V.reservas = inbox({ key: 'reservas', path: 'reservas', title: 'Reservas', sub: (l) => `${l.length} citas registradas · ${l.filter((x) => x.status === 'pendiente').length} pendientes`, states: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  body: (x, { holders, cars }) => { const car = cars.find((c) => c.slug === x.coche); const h = car && holders.find((y) => y.id === car.holder);
    return bx('Fecha', `<b>${fdate(x.fecha)} · ${x.hora}</b>`) + bx('Motivo', esc(x.motivo)) + bx('Coche', x.coche ? `<a href="${B}/vehiculos/${x.coche}" target="_blank">${esc(x.cocheNombre)}</a>` : '—') + (x.mensaje ? bx('Comentario', esc(x.mensaje)) : '') +
      (x.tipo === 'reserva' && car ? bx('Para la señal', `${car.reserve ? eur(car.reserve) + ' · ' : ''}Bizum 660 49 32 28${h?.accounts?.length ? '<br>' + h.accounts.map((a) => `${esc(a.bank)}: ${esc(a.iban)}`).join('<br>') : ''}`) : ''); } });
V.valoraciones = inbox({ key: 'valoraciones', path: 'tasaciones', title: 'Valoraciones', sub: (l) => `${l.length} solicitudes de tasación.`, states: ['pendiente', 'contactado', 'ofertado', 'cerrada'],
  body: (x) => bx('Vehículo', `<b>${esc(x.marca)} ${esc(x.modelo)}</b>`) + bx('Año', x.anio || '—') + bx('Km', nf(x.km)) + bx('Combustible', esc(x.combustible || '—')) + (x.notas_cliente ? bx('Observaciones', esc(x.notas_cliente)) : '') });
V.envios = inbox({ key: 'envios', path: 'envios', title: 'Solicitudes de envío', sub: (l) => `${l.length} solicitudes de presupuesto de envío.`, states: ['pendiente', 'presupuesto enviado', 'aceptado', 'rechazado'],
  body: (x) => bx('Código postal', `<b>${esc(x.cp)}</b>`) + bx('Coche', x.coche ? `<a href="${B}/vehiculos/${x.coche}" target="_blank">${esc(x.cocheNombre)}</a>` : '—') });
V.mensajes = inbox({ key: 'mensajes', path: 'mensajes', title: 'Mensajes', sub: (l) => `${l.length} mensajes recibidos.`, states: ['pendiente', 'respondido'],
  body: (x) => bx('Asunto', esc(x.asunto || '—')) + bx('Mensaje', `<span style="white-space:pre-line">${esc(x.mensaje)}</span>`) });

V.busquedas = inbox({ key: 'busquedas', path: 'busquedas', title: 'Te lo buscamos', sub: (l) => `${l.length} peticiones de coche a la carta.`, states: ['pendiente', 'buscando', 'propuesto', 'cerrada'],
  body: (x) => bx('Busca', `<b>${esc([x.marca, x.modelo].filter(Boolean).join(' ') || 'Cualquiera')}</b>`) + bx('Presupuesto', `<b>${eur(x.presupuesto)}</b>`) + bx('Km máx.', nf(x.kmMax)) + bx('Año desde', x.anioDesde || '—') + bx('Combustible / cambio', esc([x.combustible, x.cambio].filter(Boolean).join(' · ') || '—')) + (x.comentario ? bx('Comentario', esc(x.comentario)) : '') });

V.alertas = async (m) => {
  const list = await api('/admin/alertas'); m = shell('alertas');
  m.innerHTML = top('Alertas de stock', `${list.filter((x) => x.status === 'activa').length} personas esperan aviso de coches nuevos.`) +
    `<div class="card sec mu sm">Cuando entre un coche que encaje, escríbeles por email (botón) y marca la alerta como "avisado". Si alguien pide la baja, márcala como "baja" o bórrala.</div>
    <div class="tw"><table><thead><tr><th>Email</th><th>Busca</th><th>Máx.</th><th class="hide-m">Desde</th><th>Estado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${list.map((a) => `<tr data-id="${a.id}"><td>${esc(a.email)}</td><td>${esc(a.busca || '—')}</td><td>${eur(a.max)}</td><td class="hide-m">${fdate(a.created)}</td>
    <td><select data-s style="width:auto;padding:5px 10px">${['activa', 'avisado', 'baja'].map((s) => `<option${s === a.status ? ' selected' : ''}>${s}</option>`).join('')}</select></td><td><div class="acts"><a class="btn g s" href="mailto:${esc(a.email)}?subject=${encodeURIComponent('Ha entrado un coche que te puede interesar · Plata Garage')}">Email</a><button class="btn r s" data-del>Borrar</button></div></td></tr>`).join('') || '<tr><td colspan="6" class="mu">Aún no hay alertas.</td></tr>'}</tbody></table></div>`;
  m.querySelectorAll('tr[data-id]').forEach((tr) => {
    tr.querySelector('[data-s]').onchange = guard(async (e) => { await api('/admin/alertas/' + tr.dataset.id, { method: 'PUT', body: { status: e.target.value } }); toast('Guardado'); });
    tr.querySelector('[data-del]').onclick = guard(async () => { if (!confirm('¿Borrar esta alerta?')) return; await api('/admin/alertas/' + tr.dataset.id, { method: 'DELETE' }); route(); });
  });
};

V.analiticas = async (m, arg) => {
  const dias = +arg || 30; const [st, cars, cls] = await Promise.all([api('/admin/stats?dias=' + dias), api('/admin/cars'), api('/admin/clientes').catch(() => [])]); m = shell('analiticas');
  const sum = (g) => { const o = {}; st.forEach((d) => Object.entries(d[g] || {}).forEach(([k, v]) => (o[k] = (o[k] || 0) + v))); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const tot = st.reduce((a, d) => a + ((d.tot || {}).visitas || 0), 0); const ent = st.reduce((a, d) => a + ((d.tot || {}).nuevas || 0), 0); const ev = Object.fromEntries(sum('ev'));
  const forms = Object.entries(ev).filter(([k]) => k.startsWith('form-')).reduce((a, [, v]) => a + v, 0);
  const max = Math.max(1, ...st.map((d) => (d.tot || {}).visitas || 0));
  const nm = (slug) => { const c = cars.find((x) => x.slug === slug); return c ? `${c.brand} ${c.model} ${c.version || ''} (${c.year})` : slug; };
  const tbl = (rows, h1, h2, f = (x) => esc(x)) => `<table>${rows.slice(0, 10).map(([k, v]) => `<tr><td>${f(k)}</td><td style="text-align:right"><b>${v}</b></td></tr>`).join('') || `<tr><td class="mu">Sin datos todavía.</td></tr>`}</table>`;
  m.innerHTML = top('Analíticas', 'Visitas y contactos de la web, sin cookies ni datos personales.', `<div class="filt" style="margin:0">${[7, 30, 90].map((d) => `<button data-d="${d}" class="${d === dias ? 'on' : ''}">${d} días</button>`).join('')}</div>`) +
  `<div class="kp"><div class="card"><span>Visitas (entradas a la web)</span><b>${nf(ent)}</b></div><div class="card"><span>Páginas vistas</span><b>${nf(tot)}</b></div><div class="card"><span>Clics a WhatsApp</span><b>${ev.wa || 0}</b></div><div class="card"><span>Clics a teléfono</span><b>${ev.tel || 0}</b></div><div class="card"><span>Formularios enviados</span><b>${forms}</b></div></div>
  <div class="card sec"><h3 style="margin-bottom:14px">Páginas vistas por día</h3><div style="display:flex;align-items:flex-end;gap:3px;height:140px">${st.map((d) => { const v = (d.tot || {}).visitas || 0; return `<div title="${fdate(d.d)}: ${v}" style="flex:1;background:var(--or);opacity:${v ? 1 : .15};height:${Math.max(2, v / max * 100)}%;border-radius:3px 3px 0 0"></div>`; }).join('')}</div></div>
  <div class="two"><div class="card"><h3 style="margin-bottom:10px">Coches más vistos</h3>${tbl(sum('car'), 'Coche', 'Visitas', nm)}</div><div class="card"><h3 style="margin-bottom:10px">De dónde llegan</h3>${tbl(sum('src'))}</div></div>
  ${(() => { // Embudo: de la visita a la venta (los pasos de clientes, con los que entraron en el periodo)
    const desde = Date.now() - dias * 864e5; const nuevos = cls.filter((c) => Math.min(...c.leads.map((l) => Date.parse(l.created) || Infinity)) >= desde);
    const idx = (e) => ETAPAS.findIndex(([k]) => k === e); const alMenos = (e) => nuevos.filter((c) => c.etapa !== 'perdido' ? idx(c.etapa) >= idx(e) : (c.leads || []).some((l) => l.status === 'completada') && idx(e) <= idx('visitado')).length;
    const vf = sum('car').reduce((a, [, v]) => a + v, 0), dir = (ev.wa || 0) + (ev.tel || 0);
    const pasos = [['Entradas a la web', ent], ['Vieron algún coche', vf], ['Contactaron (WhatsApp, llamada o formulario)', dir + forms], ['Clientes nuevos en el embudo', nuevos.length], ['Con cita', alMenos('cita')], ['Vinieron', alMenos('visitado')], ['Reservaron', alMenos('reserva')], ['Compraron', nuevos.filter((c) => c.etapa === 'vendido').length]];
    const mx = Math.max(1, pasos[0][1]);
    return `<div class="card sec"><h3 style="margin-bottom:4px">Embudo: de la visita a la venta</h3><p class="mu sm" style="margin-bottom:12px">Los últimos ${dias} días. Marca "Vendido" en Clientes para que la última fila sea fiable.</p>${pasos.map(([t, v], i) => `<div style="margin:6px 0"><div class="row" style="justify-content:space-between"><span>${t}</span><b>${nf(v)}${i ? `<span class="mu sm" style="font-weight:400"> · ${pasos[i - 1][1] ? Math.round((v / pasos[i - 1][1]) * 100) : 0} %</span>` : ''}</b></div><div style="height:8px;border-radius:6px;background:var(--line);margin-top:4px"><div style="height:8px;border-radius:6px;background:var(--or);width:${Math.max(1, Math.round((v / mx) * 100))}%"></div></div></div>`).join('')}</div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:4px">Qué canal trae clientes</h3><p class="mu sm" style="margin-bottom:10px">Visitas y contactos por origen, y % que contacta.</p>${(() => { const vis = Object.fromEntries(sum('src')), con = Object.fromEntries(sum('lsrc')); const ks = [...new Set([...Object.keys(vis), ...Object.keys(con)])].sort((a, b) => (con[b] || 0) - (con[a] || 0) || (vis[b] || 0) - (vis[a] || 0)); return ks.length ? `<table><tr><td class="mu sm">Canal</td><td class="mu sm" style="text-align:right">Visitas</td><td class="mu sm" style="text-align:right">Contactos</td><td class="mu sm" style="text-align:right">%</td></tr>${ks.slice(0, 10).map((k) => `<tr><td>${esc(k)}</td><td style="text-align:right">${vis[k] || 0}</td><td style="text-align:right"><b>${con[k] || 0}</b></td><td style="text-align:right" class="mu">${vis[k] ? Math.round(((con[k] || 0) / vis[k]) * 1000) / 10 + ' %' : ''}</td></tr>`).join('')}</table>` : '<p class="mu">Sin datos todavía.</p>'; })()}</div><div class="card"><h3 style="margin-bottom:4px">Qué les falta para decidirse</h3><p class="mu sm" style="margin-bottom:10px">Lo que contestan en la pregunta de las fichas.</p>${tbl(sum('falta'))}</div></div>
  <div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Ranking de coches (privado)</h3><p class="mu sm" style="margin-bottom:10px">Días en stock, visitas y contactos de cada coche en los últimos ${dias} días. En naranja, los que llevan más de 45 días con pocos contactos: revisar precio o fotos.</p>${(() => {
    const vis = Object.fromEntries(sum('car')), ce = {}; sum('carev').forEach(([k, v]) => { const [sl, e] = k.split('|'); if (e !== 'pdf') ce[sl] = (ce[sl] || 0) + v; });
    const fo = {}; cls.forEach((c) => (c.leads || []).forEach((l) => { if (l.coche && Date.parse(l.created) >= desde) fo[l.coche] = (fo[l.coche] || 0) + 1; }));
    const fa = {}; sum('faltacar').forEach(([k, v]) => { const [sl, r] = k.split('|'); (fa[sl] = fa[sl] || {})[r] = v; });
    const rows = cars.filter((c) => !c.sold && !c.hidden).map((c) => { const d = c.created ? Math.max(0, Math.round((Date.now() - Date.parse(c.created)) / 864e5)) : null; const v = vis[c.slug] || 0, k = (ce[c.slug] || 0) + (fo[c.slug] || 0); const top = Object.entries(fa[c.slug] || {}).sort((a, b) => b[1] - a[1])[0]; return { c, d, v, k, top, mal: d != null && d > 45 && k < 3 }; }).sort((a, b) => (b.mal - a.mal) || ((b.d || 0) - (a.d || 0)));
    return `<div class="tw"><table><thead><tr><th>Coche</th><th>Dueño</th><th style="text-align:right">Días</th><th style="text-align:right">Visitas</th><th style="text-align:right">Contactos</th><th style="text-align:right">%</th><th>Les falta</th></tr></thead><tbody>${rows.map((r) => `<tr${r.mal ? ' style="color:var(--or)"' : ''}><td><a href="#coche/${r.c.id}" style="color:inherit">${esc(r.c.brand)} ${esc(r.c.model)} (${r.c.year || ''})</a></td><td>${esc(r.c.owner || '')}</td><td style="text-align:right">${r.d ?? '—'}</td><td style="text-align:right">${r.v}</td><td style="text-align:right"><b>${r.k}</b></td><td style="text-align:right">${r.v ? Math.round((r.k / r.v) * 1000) / 10 + ' %' : ''}</td><td class="sm">${r.top ? esc(r.top[0]) + ' (' + r.top[1] + ')' : ''}</td></tr>`).join('')}</tbody></table></div>`; })()}</div>`; })()}
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:4px">Lo que busca la gente</h3><p class="mu sm" style="margin-bottom:10px">Lo que escriben en el buscador de la web.</p>${tbl(sum('q'))}</div><div class="card"><h3 style="margin-bottom:4px">Búsquedas sin coche exacto</h3><p class="mu sm" style="margin-bottom:10px">Lo que piden y no tenemos: pistas de qué coches comprar.</p>${tbl(sum('q0'))}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:4px">Contactos por página de entrada</h3><p class="mu sm" style="margin-bottom:10px">Formularios y avisos enviados desde cada página, y qué % de sus visitas acaba contactando.</p>${(() => { const pvs = Object.fromEntries(sum('pv')); const rows = sum('lp'); return rows.length ? `<table>${rows.slice(0, 12).map(([k, v]) => `<tr><td>${esc(k.replace(/^\/platagarage/, '') || '/')}</td><td style="text-align:right"><b>${v}</b></td><td style="text-align:right" class="mu">${pvs[k] ? Math.round((v / pvs[k]) * 1000) / 10 + ' %' : ''}</td></tr>`).join('')}</table>` : '<p class="mu">Sin contactos todavía.</p>'; })()}</div><div class="card"><h3 style="margin-bottom:4px">Contactos por canal</h3><p class="mu sm" style="margin-bottom:10px">De dónde venía quien nos dejó sus datos (Google, Instagram, directo…).</p>${tbl(sum('lsrc'))}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:10px">Páginas más vistas</h3>${tbl(sum('pv'))}</div><div class="card"><h3 style="margin-bottom:10px">Formularios por tipo</h3>${tbl(Object.entries(ev).filter(([k]) => k.startsWith('form-')).map(([k, v]) => [k.slice(5), v]))}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:10px">Ciudades (aproximadas)</h3>${tbl(sum('city'))}</div><div class="card"><h3 style="margin-bottom:10px">Dispositivos</h3>${tbl(sum('dev'))}</div></div>
  ${cwvHtml(sum('cwv'))}
  <p class="mu sm" style="margin-top:14px">Sin cookies ni datos personales: no se guarda la IP ni nada que identifique a nadie. Las ciudades salen de la conexión y son aproximadas.</p>`;
  m.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => (location.hash = '#analiticas/' + b.dataset.d)));
};

// Velocidad real de la web medida en los móviles y ordenadores de los visitantes (percentil 75, como Google)
function cwvHtml(rows) {
  const B = { lcp: [1000, 1500, 2000, 2500, 3000, 4000, 6000], inp: [100, 200, 300, 500, 800], cls: [0.05, 0.1, 0.15, 0.25, 0.4] };
  const L = { lcp: [2500, 4000], inp: [200, 500], cls: [0.1, 0.25] };
  const d = {}; rows.forEach(([k, v]) => { const [t, m, i] = k.split('|'); ((d[t] = d[t] || {})[m] = d[t][m] || []).push([+i, v]); });
  const tpls = Object.keys(d); if (!tpls.length) return '';
  const p75 = (m, arr) => { const tot = arr.reduce((s, [, v]) => s + v, 0); let acc = 0; for (const [i, v] of arr.sort((a, b) => a[0] - b[0])) { acc += v; if (acc >= tot * 0.75) return { v: i < B[m].length ? B[m][i] : B[m][B[m].length - 1] * 1.5, n: tot, mas: i >= B[m].length }; } return null; };
  const fmt = (m, x) => (m === 'cls' ? '≤ ' + x.v : (x.mas ? '> ' : '≤ ') + (m === 'lcp' ? (x.v / 1000).toFixed(1) + ' s' : x.v + ' ms'));
  const col = (m, x) => (x.v <= L[m][0] ? 'ok' : x.v <= L[m][1] ? 'w' : 'r');
  const nom = { home: 'Portada', catalogo: 'Catálogo', ficha: 'Fichas de coche', landing: 'Páginas de zona/tipo', cita: 'Cita', otra: 'Otras' };
  return `<div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Velocidad real de la web</h3><p class="mu sm" style="margin:0 0 10px">Medida en los dispositivos de los visitantes. Verde = bien para Google; amarillo = mejorable; rojo = lento.</p><table><tr><th>Página</th><th>Carga (LCP)</th><th>Respuesta (INP)</th><th>Estabilidad (CLS)</th><th>Medidas</th></tr>${tpls.map((t) => { const r = { lcp: d[t].lcp && p75('lcp', d[t].lcp), inp: d[t].inp && p75('inp', d[t].inp), cls: d[t].cls && p75('cls', d[t].cls) }; return `<tr><td>${nom[t] || t}</td>${['lcp', 'inp', 'cls'].map((m) => `<td>${r[m] ? `<span class="bg ${col(m, r[m])}">${fmt(m, r[m])}</span>` : '—'}</td>`).join('')}<td>${r.lcp?.n || 0}</td></tr>`; }).join('')}</table></div>`;
}

V.usuarios = async (m) => {
  let us; try { us = await api('/admin/users'); } catch (e) { m = shell('usuarios'); m.innerHTML = top('Usuarios') + `<div class="card mu">${esc(e.message)}</div>`; return; }
  m = shell('usuarios');
  m.innerHTML = top('Usuarios', 'Cada persona entra con su propio usuario y contraseña.') +
  `<div class="card sec"><h3 style="margin-bottom:12px">Nuevo usuario</h3><form id="uf" class="fg"><label>Nombre<input name="name" required placeholder="Cristina"></label><label>Usuario<input name="user" required placeholder="cristina" autocapitalize="none"></label><label>Rol<select name="role"><option value="editor">Editor (todo menos usuarios)</option><option value="admin">Administrador (todos los negocios)</option></select></label>
  <div class="s3"><span class="mu sm">Negocios a los que entra</span><div class="row" style="margin-top:6px"><label class="chk"><input type="checkbox" name="n_garage" checked>Plata Garage</label><label class="chk"><input type="checkbox" name="n_marine">Plata Marine</label><label class="chk"><input type="checkbox" name="n_rotulito">Rotulito</label></div></div>
  <label class="s2">Contraseña (mín. 12, con letras y números)<input name="password" type="password" required minlength="12" autocomplete="new-password"></label><div style="align-self:end"><button class="btn">Crear usuario</button></div></form></div>
  <div class="tw"><table><thead><tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${us.map((u) => `<tr data-id="${u.id}"><td><b>${esc(u.name)}</b></td><td>${esc(u.user)}</td><td>${u.role === 'admin' ? 'Administrador' : 'Editor'}<br><span class="mu sm">${(u.negs || []).map((n) => NEGS[n]?.n || n).join(', ')}</span></td><td>${u.disabled ? '<span class="bg r">Desactivado</span>' : '<span class="bg ok">Activo</span>'}</td>
  <td><div class="acts"><button class="btn g s" data-a="pw">Cambiar contraseña</button><button class="btn g s" data-a="ses">Cerrar sus sesiones</button><button class="btn g s" data-a="dis">${u.disabled ? 'Activar' : 'Desactivar'}</button><button class="btn r s" data-a="del">Borrar</button></div></td></tr>`).join('') || '<tr><td colspan="5" class="mu">Todavía no hay usuarios: crea uno para Cristina y otro para ti.</td></tr>'}</tbody></table></div>
  <p class="mu sm" style="margin-top:12px">Al cambiar la contraseña o desactivar a alguien, se cierran sus sesiones abiertas. La contraseña maestra de Netlify (usuario "admin") queda solo para emergencias.</p>
  <p class="sm" style="margin-top:8px">Las sesiones duran mientras se usen (se renuevan solas). Si se pierde un móvil: <button class="btn r s" id="cadm">Cerrar todas las sesiones de Juan (contraseña maestra)</button></p>`;
  $('#cadm').onclick = guard(async () => { if (!confirm('Se cerrarán todas las sesiones abiertas con la contraseña maestra, también la tuya. ¿Seguir?')) return; await api('/admin/users/admin-sesiones', { method: 'PUT' }); showLogin(); });
  $('#uf').onsubmit = guard(async (e) => { e.preventDefault(); const f = e.target; const b = Object.fromEntries(new FormData(f)); b.negs = ['garage', 'marine', 'rotulito'].filter((n) => f['n_' + n].checked); await api('/admin/users', { method: 'POST', body: b }); toast('Usuario creado'); route(); });
  m.querySelectorAll('[data-a]').forEach((b) => (b.onclick = guard(async () => {
    const id = b.closest('tr').dataset.id, u = us.find((x) => x.id === id), a = b.dataset.a;
    if (a === 'pw') { const pw = prompt('Nueva contraseña para ' + u.name + ' (mín. 12, con letras y números):'); if (!pw) return; await api('/admin/users/' + id, { method: 'PUT', body: { password: pw } }); toast('Contraseña cambiada'); }
    if (a === 'ses') { if (!confirm('¿Cerrar la sesión de ' + u.name + ' en todos sus dispositivos? Tendrá que volver a poner su contraseña.')) return; await api('/admin/users/' + id, { method: 'PUT', body: { cerrar: true } }); toast('Sesiones de ' + u.name + ' cerradas'); }
    if (a === 'dis') await api('/admin/users/' + id, { method: 'PUT', body: { disabled: !u.disabled } });
    if (a === 'del') { if (!confirm('¿Borrar el usuario ' + u.name + '?')) return; await api('/admin/users/' + id, { method: 'DELETE' }); }
    route();
  })));
};

V.horarios = async (m) => {
  const [s, ic] = await Promise.all([api('/admin/schedule'), api('/admin/ical').catch(() => ({}))]); m = shell('horarios');
  const save = guard(async (msg = 'Horario guardado') => { Object.assign(s, await api('/admin/schedule', { method: 'PUT', body: s })); toast(msg); draw(); });
  const draw = () => {
    m.innerHTML = top('Horarios', 'Configura las horas disponibles para reservar cita y bloquea días u horas concretas cuando lo necesites.') +
    `<div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Horario semanal</h3><span class="mu sm">Click en una hora para eliminarla.</span></div><div class="days">${ORDER.map((d) => `<div class="card"><div class="row" style="justify-content:space-between"><b>${DAYS[d]}</b><span class="row"><select data-cp="${d}" style="width:auto;padding:5px 10px"><option value="">Copiar a…</option>${ORDER.filter((x) => x !== d).map((x) => `<option value="${x}">${DAYS[x]}</option>`).join('')}<option value="all">Todos los días laborables</option></select></span></div>
    <div class="hrs">${(s.week[d] || []).map((h) => `<button data-d="${d}" data-h="${h}" title="Quitar">${h}</button>`).join('') || '<span class="mu sm">Cerrado — sin horarios configurados.</span>'}</div><div class="row"><input type="time" data-in="${d}" step="900" style="flex:1"><button class="btn g s" data-ad="${d}">+ Añadir</button></div></div>`).join('')}</div>
    <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:12px">Bloquear día u horas</h3><div style="display:grid;gap:12px"><label>Fecha<input type="date" id="bd"></label><label class="chk"><input type="checkbox" id="ba" checked>Cerrar todo el día</label><label>Bloquear horas concretas (separadas por comas)<input id="bh" placeholder="10:00, 10:30" disabled></label><label>Motivo (opcional)<input id="br" maxlength="120"></label><button class="btn" id="bs">Guardar bloqueo</button></div></div>
    <div class="card"><h3 style="margin-bottom:12px">Próximos bloqueos</h3>${(s.blocks || []).sort((a, b) => a.date.localeCompare(b.date)).map((b, i) => `<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:8px 0"><span><b>${fdate(b.date)}</b> · ${b.allDay ? 'todo el día' : b.hours.join(', ')}${b.reason ? ` <span class="mu">(${esc(b.reason)})</span>` : ''}</span><button class="btn r s" data-xb="${b.id}">Quitar</button></div>`).join('') || '<p class="mu">No hay días bloqueados próximamente.</p>'}</div></div>`;
    m.insertAdjacentHTML('beforeend', ic.url ? `<div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:6px">Ver las citas en tu móvil</h3><p class="mu" style="margin:0 0 12px">Suscribe tu calendario a este enlace y las citas de la web aparecerán solas en tu agenda (se actualiza cada poco). Es privado: no lo compartas.</p>
    <div class="row"><input id="icu" readonly value="${esc(ic.url)}" style="flex:1;min-width:240px"><button class="btn g" id="icc">${IC.copy}Copiar</button><a class="btn g" href="${esc(ic.url.replace(/^https?:/, 'webcal:'))}">Abrir en el calendario</a></div>
    <details style="margin-top:12px"><summary class="sm" style="cursor:pointer">Cómo hacerlo</summary><p class="sm mu"><b>iPhone:</b> pulsa "Abrir en el calendario" desde el iPhone y acepta "Suscribirse".<br><b>Google Calendar (Android o PC):</b> en calendar.google.com, en el ordenador: "Otros calendarios" → "+" → "Desde URL" → pega el enlace → "Añadir calendario". Google tarda unas horas en refrescar los cambios.</p></details></div>` : '');
    if ($('#icc')) $('#icc').onclick = () => { navigator.clipboard.writeText($('#icu').value).then(() => toast('Enlace copiado')); };
    m.querySelectorAll('.hrs button').forEach((b) => (b.onclick = () => { s.week[b.dataset.d] = s.week[b.dataset.d].filter((h) => h !== b.dataset.h); save('Hora quitada'); }));
    m.querySelectorAll('[data-ad]').forEach((b) => (b.onclick = () => { const v = m.querySelector(`[data-in="${b.dataset.ad}"]`).value; if (!v) return; s.week[b.dataset.ad] = [...(s.week[b.dataset.ad] || []), v]; save('Hora añadida'); }));
    m.querySelectorAll('[data-cp]').forEach((sel) => (sel.onchange = () => { const from = sel.dataset.cp, to = sel.value; if (!to) return; (to === 'all' ? [1, 2, 3, 4, 5] : [to]).forEach((d) => { if (String(d) !== from) s.week[d] = [...s.week[from]]; }); save('Horario copiado'); }));
    $('#ba').onchange = () => ($('#bh').disabled = $('#ba').checked);
    $('#bs').onclick = () => { const date = $('#bd').value; if (!date) return toast('Elige una fecha', true); const allDay = $('#ba').checked; const hours = allDay ? [] : $('#bh').value.split(',').map((x) => x.trim()).filter(Boolean); if (!allDay && !hours.length) return toast('Indica las horas', true); s.blocks = [...(s.blocks || []), { date, allDay, hours, reason: $('#br').value }]; save('Bloqueo guardado'); };
    m.querySelectorAll('[data-xb]').forEach((b) => (b.onclick = () => { s.blocks = s.blocks.filter((x) => x.id !== b.dataset.xb); save('Bloqueo quitado'); }));
  };
  draw();
};

V.blog = async (m) => {
  const posts = await api('/admin/posts'); m = shell('blog');
  m.innerHTML = top('Blog', `${posts.length} artículos.`, `<a class="btn" href="#post/nuevo">+ Nuevo artículo</a>`) +
    `<div class="tw"><table><thead><tr><th>Título</th><th>Estado</th><th class="hide-m">Publicado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${posts.map((p) => `<tr data-id="${p.id}"><td><b>${esc(p.title)}</b><br><span class="mu sm">${B}/blog/${p.slug}</span></td><td>${p.published ? '<span class="bg ok">Publicado</span>' : '<span class="bg w">Borrador</span>'}</td><td class="hide-m">${p.publishedAt ? fdate(p.publishedAt) : '—'}</td><td><div class="acts"><button class="btn g s" data-a="pub">${p.published ? 'Despublicar' : 'Publicar'}</button><a class="btn g s" href="#post/${p.id}">Editar</a><button class="btn r s" data-a="del">Borrar</button></div></td></tr>`).join('') || '<tr><td colspan="4" class="mu">Aún no hay artículos.</td></tr>'}</tbody></table></div>`;
  m.querySelectorAll('[data-a]').forEach((b) => (b.onclick = guard(async () => {
    const id = b.closest('tr').dataset.id, p = posts.find((x) => x.id === id);
    if (b.dataset.a === 'del') { if (!confirm('¿Borrar el artículo?')) return; await api('/admin/posts/' + id, { method: 'DELETE' }); }
    else await api('/admin/posts/' + id, { method: 'PUT', body: { ...p, tags: (p.tags || []).join(', '), published: !p.published } });
    route();
  })));
};

V.post = async (m, id) => {
  const isNew = id === 'nuevo'; const p = isNew ? { published: false } : (await api('/admin/posts')).find((x) => x.id === id);
  if (!p) { location.hash = '#blog'; return; }
  m = shell('blog'); let cover = p.cover || '';
  m.innerHTML = top(isNew ? 'Nuevo artículo' : 'Editar artículo', 'Para los apartados usa "## Título" y para listas "- elemento". **negrita**, [texto](enlace).', `<a class="btn g" href="#blog">Volver</a>`) +
  `<form id="pf" class="card"><div class="fg"><label class="s3">Título *<input name="title" required maxlength="160" value="${esc(p.title || '')}"></label><label class="s3">Resumen (sale en el listado y en Google)<input name="excerpt" maxlength="300" value="${esc(p.excerpt || '')}"></label>
  <label class="s2">Etiquetas (separadas por comas)<input name="tags" value="${esc((p.tags || []).join(', '))}"></label><div><span class="mu sm">Portada</span><div class="imgs" style="grid-template-columns:1fr;margin-top:6px" id="cv"></div><input type="file" id="cfi" accept="image/*" hidden></div>
  <label class="s3">Contenido *<textarea name="body" rows="18" required>${esc(p.body || '')}</textarea></label></div>
  <div class="row" style="justify-content:space-between;margin-top:14px"><label class="chk"><input type="checkbox" name="published" ${p.published ? 'checked' : ''}>Publicado</label><button class="btn" type="submit">Guardar</button></div></form>`;
  const dc = () => { $('#cv').innerHTML = cover ? `<div class="im"><img src="${esc(cover)}" alt=""><div class="t"><span></span><button type="button" id="cx">✕</button></div></div>` : `<div class="drop" id="cz">+ Subir portada</div>`; if (cover) $('#cx').onclick = () => { cover = ''; dc(); }; else $('#cz').onclick = () => $('#cfi').click(); };
  $('#cfi').onchange = guard(async (e) => { await upload([...e.target.files], (u) => (cover = u)); dc(); });
  dc();
  $('#pf').onsubmit = guard(async (e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); d.published = e.target.published.checked; d.cover = cover; const r = await api(isNew ? '/admin/posts' : '/admin/posts/' + id, { method: isNew ? 'POST' : 'PUT', body: d }); toast('Artículo guardado'); location.hash = '#post/' + r.id; });
};

// ---------- clientes: embudo de ventas ----------
const ETAPAS = [['nuevo', 'Nuevo'], ['contactado', 'Contactado'], ['cita', 'Con cita'], ['visitado', 'Ha venido'], ['reserva', 'Reserva'], ['vendido', 'Vendido'], ['perdido', 'Perdido']];
const etq = (k) => (ETAPAS.find((x) => x[0] === k) || [k, k])[1];
const TIPO = { cita: 'Cita', tasacion: 'Tasación', envio: 'Envío', mensaje: 'Mensaje', busqueda: 'Te lo buscamos', portal: 'Portal' };
const RUTA = { cita: 'reservas', tasacion: 'valoraciones', envio: 'envios', mensajes: 'mensajes', mensaje: 'mensajes', busqueda: 'busquedas', portal: 'clientes' };
V.clientes = async (m) => {
  const all = await api('/admin/clientes'); m = shell('clientes'); let q = '';
  const draw = () => {
    const list = all.filter((c) => !q || `${c.nombre} ${c.telefono} ${c.email}`.toLowerCase().includes(q));
    $('#kb').innerHTML = ETAPAS.map(([k, t]) => { const cs = list.filter((c) => c.etapa === k); return `<div class="col" data-e="${k}"><h4>${t} <span>${cs.length}</span></h4>${cs.map((c) => `<div class="kc" draggable="true" data-k="${c.key}"><a href="#cliente/${c.key}"><b>${esc(c.nombre)}</b><span>${esc(c.leads[0]?.resumen || '')}</span><small>${fdate(c.last)} · ${c.leads.length} solicitud${c.leads.length === 1 ? '' : 'es'}${c.manual ? '' : ' · auto'}</small></a><select class="mv" data-k="${c.key}" aria-label="Mover a">${ETAPAS.map(([k2, t2]) => `<option value="${k2}"${k2 === c.etapa ? ' selected' : ''}>${t2}</option>`).join('')}</select></div>`).join('') || '<p class="mu sm" style="padding:6px">—</p>'}</div>`; }).join('');
    $('#kb').querySelectorAll('.kc').forEach((el) => (el.ondragstart = (e) => e.dataTransfer.setData('text/plain', el.dataset.k)));
    // En el móvil no se puede arrastrar: cada tarjeta lleva su selector de etapa
    $('#kb').querySelectorAll('.mv').forEach((sel) => (sel.onchange = guard(async () => { const c = all.find((x) => x.key === sel.dataset.k); await api('/admin/clientes/' + c.key, { method: 'PUT', body: { etapa: sel.value } }); c.etapa = sel.value; c.manual = sel.value; draw(); toast(`${c.nombre}: ${etq(c.etapa)}`); })));
    $('#kb').querySelectorAll('.col').forEach((col) => { col.ondragover = (e) => { e.preventDefault(); col.classList.add('ov'); }; col.ondragleave = () => col.classList.remove('ov');
      col.ondrop = guard(async (e) => { e.preventDefault(); col.classList.remove('ov'); const k = e.dataTransfer.getData('text/plain'); const c = all.find((x) => x.key === k); if (!c || c.etapa === col.dataset.e) return; await api('/admin/clientes/' + k, { method: 'PUT', body: { etapa: col.dataset.e } }); c.etapa = col.dataset.e; c.manual = col.dataset.e; draw(); toast(`${c.nombre}: ${etq(c.etapa)}`); }); });
  };
  const n = (k) => all.filter((c) => c.etapa === k).length; const vend = n('vendido'), tot = all.length;
  m.innerHTML = top('Clientes', `${tot} personas han contactado por la web. El estado avanza solo (cita, visita, reserva, venta); también puedes arrastrar la tarjeta.`, `<button class="btn g" id="csv">Exportar a Excel (CSV)</button>`) +
    `<div class="kp">${[['Nuevos sin atender', n('nuevo')], ['En marcha', n('contactado') + n('cita') + n('visitado') + n('reserva')], ['Vendidos', vend], ['Conversión', tot ? Math.round(vend / tot * 100) + ' %' : '—']].map(([t, v]) => `<div class="card"><span>${t}</span><b>${v}</b></div>`).join('')}</div>
    <input id="qq" placeholder="Buscar por nombre, teléfono o email" style="max-width:420px;margin-bottom:14px"><div class="kb" id="kb"></div>`;
  $('#qq').oninput = (e) => { q = e.target.value.toLowerCase().trim(); draw(); };
  $('#csv').onclick = () => { const rows = [['Nombre', 'Teléfono', 'Email', 'Estado', 'Última actividad', 'Solicitudes', 'Último interés', 'Notas'], ...all.map((c) => [c.nombre, c.telefono, c.email, etq(c.etapa), (c.last || '').slice(0, 10), c.leads.length, c.leads[0]?.resumen || '', c.notas || ''])];
    const csv = '﻿' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `clientes-plata-garage-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); };
  draw();
};
// ---------- Leads: lo primero que se ve al entrar ----------
// Enlace a la ficha en la web propia (al migrar, cambiar solo WEB)
const WEB = 'https://www.platagarage.com';
const nrm = (x) => ' ' + String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
// Coche del lead: por la ficha si viene de la web; si viene de un portal, por marca/modelo/año del texto del aviso
function cocheDe(c, cars) {
  for (const l of c.leads) { const x = l.coche && cars.find((y) => y.slug === l.coche); if (x) return x; }
  for (const l of c.leads) {
    const n = nrm(l.cocheNombre); if (n.trim() === '') continue; let best = null, bs = 0;
    cars.filter((y) => !y.sold).forEach((y) => { let p = 0; if (n.includes(nrm(y.brand))) p += 2; if (n.includes(nrm(y.model))) p += 3; if (y.year && n.includes(` ${y.year} `)) p += 1; if (y.version && n.includes(nrm(y.version))) p += 1; if (p > bs) { bs = p; best = y; } });
    if (bs >= 3) return best;
  }
  return null;
}
// Respuesta rápida de WhatsApp de Cristina y Juan (la misma que tienen guardada en WhatsApp Business); el saludo va según la hora de Madrid (hasta las 12:30, buenos días)
const saludo = () => { const p = Object.fromEntries(new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Madrid' }).formatToParts(new Date()).map((x) => [x.type, Number(x.value)])); return p.hour * 60 + p.minute < 12 * 60 + 30 ? 'Buenos días' : 'Buenas tardes'; }; // corte a las 12:30
const msgWa = (quien, car) => `${saludo()}, Soy ${quien} de Plata Garage. He recibido un mensaje interesado en este vehículo${car ? `\n${WEB}/vehiculos/${car.slug}` : ''}`;
V.leads = async (m) => {
  const [all, cars] = await Promise.all([api('/admin/clientes'), api('/admin/cars')]); m = shell('leads');
  const nuevos = all.filter((c) => c.etapa === 'nuevo');
  const pend = all.filter((c) => c.etapa !== 'nuevo' && !['vendido', 'perdido'].includes(c.etapa) && c.leads.some((l) => l.status === 'pendiente'));
  const resto = all.filter((c) => !nuevos.includes(c) && !pend.includes(c) && !['vendido', 'perdido'].includes(c.etapa)).slice(0, 20);
  badges.leads = nuevos.length || ''; 
  const card = (c) => { const car = cocheDe(c, cars); const own = car?.owner || ''; const l = c.leads[0] || {};
    const bt = (q) => `<a class="btn s${own && own !== q ? ' g' : (!own && q !== 'Cristina' ? ' g' : '')}" target="_blank" rel="noopener" data-k="${c.key}" data-q="${q}" href="${waLink(c.telefono, msgWa(q, car))}">${IC.wa}Soy ${q}</a>`;
    return `<div class="card sec ld"><div class="hd"><div><b>${esc(c.nombre)}</b><span>${fdt(c.last)}</span></div>${badge(etq(c.etapa).toLowerCase())}</div>
      <p>${esc(l.resumen || '')}</p>${car ? `<p class="mu sm">Coche: <a href="${WEB}/vehiculos/${car.slug}" target="_blank" rel="noopener" style="color:var(--or)">${esc(car.brand)} ${esc(car.model)} (${car.year || ''})</a>${own ? ' · de ' + esc(own) : ''}</p>` : ''}
      <div class="row">${bt('Cristina')}${bt('Juan')}<a class="btn s g" href="#cliente/${c.key}">Ver ficha</a></div></div>`; };
  const sec = (t, l, vacio) => `<h3 class="lh">${t} <span>${l.length}</span></h3>${l.length ? l.map(card).join('') : `<p class="mu">${vacio}</p>`}`;
  m.innerHTML = top('Leads', 'Los nuevos arriba. Al pulsar "Soy Cristina" o "Soy Juan" se abre WhatsApp con el mensaje escrito y el lead pasa a contactado.', `<a class="btn g" href="#clientes">Embudo completo</a>`) +
    sec('Nuevos sin contestar', nuevos, 'No hay leads nuevos.') + sec('Pendientes', pend, 'Nada pendiente.') + sec('En marcha', resto, 'Nada en marcha.');
  m.querySelectorAll('a[data-k]').forEach((a) => (a.onclick = () => { const c = all.find((x) => x.key === a.dataset.k); if (c) a.href = waLink(c.telefono, msgWa(a.dataset.q, cocheDe(c, cars))); if (c && c.etapa === 'nuevo') api('/admin/clientes/' + c.key, { method: 'PUT', body: { etapa: 'contactado' } }).then(() => toast(`${c.nombre}: contactado`)).catch(() => {}); }));
};
V.cliente = async (m, key) => {
  const c = (await api('/admin/clientes')).find((x) => x.key === key); m = shell('clientes');
  if (!c) { m.innerHTML = top('Cliente') + '<div class="card mu">No encontrado.</div>'; return; }
  m.innerHTML = top(esc(c.nombre), `${esc(c.telefono)}${c.email ? ' · ' + esc(c.email) : ''} · última actividad ${fdt(c.last)}`, `<a class="btn g" href="#clientes">Volver</a>`) +
    `<div class="two"><div class="card"><h3 style="margin-bottom:12px">Estado</h3><label>Etapa del embudo<select id="et"><option value="">Automático (ahora: ${etq(c.auto)})</option>${ETAPAS.map(([k, t]) => `<option value="${k}"${c.manual === k ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
    <p class="mu sm">Si lo dejas en automático, avanza solo con sus citas, su reserva o la venta. Sin movimiento en 45 días pasa a "Perdido".</p>
    <label>Notas internas<textarea id="nt" rows="5">${esc(c.notas || '')}</textarea></label><div class="row" style="margin-top:12px"><button class="btn" id="sv">Guardar</button><a class="btn g" target="_blank" rel="noopener" href="${waLink(c.telefono, 'Hola ' + String(c.nombre).split(' ')[0] + ', te escribimos de Plata Garage. ')}">${IC.wa}WhatsApp</a><a class="btn g" href="tel:${esc(c.telefono)}">Llamar</a>${c.email ? `<a class="btn g" href="mailto:${esc(c.email)}">Email</a>` : ''}</div></div>
    <div class="card"><h3 style="margin-bottom:12px">Historial (${c.leads.length})</h3>${c.leads.map((l) => `<a class="li" href="#${RUTA[l.tipo]}" style="text-decoration:none"><div><b>${TIPO[l.tipo]}</b><span>${esc(l.resumen)}</span></div><div class="r">${fdate(l.created)}<br>${l.status ? badge(l.status) : ''}</div></a>`).join('')}
    ${c.compras.length ? `<h3 style="margin:18px 0 8px">Compras</h3>${c.compras.map((x) => `<div class="li"><div><b>${esc(x.nombre)}</b><span>${x.sold ? 'Vendido el ' + fdate(x.soldAt) : 'Reservado'}</span></div></div>`).join('')}` : ''}</div></div>`;
  const guardar = guard(async (msg = 'Guardado') => { await api('/admin/clientes/' + key, { method: 'PUT', body: { etapa: $('#et').value, notas: $('#nt').value } }); toast(msg); route(); });
  $('#sv').onclick = () => guardar();
  $('#et').onchange = () => guardar('Etapa cambiada'); // se guarda sola al elegirla (en el móvil no hay que pulsar Guardar)
};

// ---------- Plata Marine y Rotulito: embudo de clientes ----------
const nApi = (p = '', o) => api(`/admin/neg/${NEG}${p}`, o);
V.nresumen = async (m) => {
  const d = await nApi(); m = shell('resumen'); const L = d.leads; const td = new Date().toISOString().slice(0, 10);
  const hoy = L.filter((x) => (x.updated || '').slice(0, 10) === td).length, sem = L.filter((x) => Date.now() - Date.parse(x.created) < 7 * 864e5).length;
  const prim = L.filter((x) => x.etapa === d.etapas[0]);
  m.innerHTML = top(`Resumen · ${NEGS[NEG].n}`, 'Lo que ha entrado y en qué punto está cada cliente.', `<a class="btn" href="#clientes">Ver embudo</a>`) +
    `<div class="kp">${[['Clientes en total', L.length, ''], ['Nuevos esta semana', sem, '/f:sem'], ['Con movimiento hoy', hoy, '/f:hoy'], [`Sin atender (${d.etapas[0]})`, prim.length, '/e:' + encodeURIComponent(d.etapas[0])]].map(([t, v, f]) => `<a class="card" href="#clientes${f}"><span>${t}</span><i>${IC.clientes}</i><b>${v}</b></a>`).join('')}</div>
    <div class="card sec"><h3 style="margin-bottom:8px">Por etapa</h3>${d.etapas.map((e) => { const n = L.filter((x) => x.etapa === e).length; return `<a class="li" href="#clientes/e:${encodeURIComponent(e)}"><div><b>${esc(e)}</b></div><div class="r"><b class="o">${n} ›</b></div></a>`; }).join('')}</div>
    <div class="card sec"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3>Últimos contactos</h3><a href="#clientes" class="sm" style="color:var(--or)">Ver todos</a></div>${[...L].sort((a, b) => (b.updated || '').localeCompare(a.updated || '')).slice(0, 8).map((x) => `<a class="li" href="#ncliente/${x.id}" style="text-decoration:none"><div><b>${esc(x.nombre)}</b><span>${esc(x.historial?.[0]?.t || x.interes || '')}</span></div><div class="r">${fdate(x.updated)}<br><span class="mu">${esc(x.etapa)}</span></div></a>`).join('') || '<p class="mu">Todavía no ha entrado ningún contacto. Mira "Entrada de leads".</p>'}</div>`;
};
V.nclientes = async (m, arg) => {
  const d = await nApi(); m = shell('clientes'); let q = '';
  // Desde el Resumen: lista con el detalle de los clientes de una etapa (e:...) o de un filtro (f:sem, f:hoy)
  if (arg) {
    const td = new Date().toISOString().slice(0, 10); const [t, v] = [arg.slice(0, 2), decodeURIComponent(arg.slice(2))];
    const F = { 'f:sem': ['Nuevos esta semana', (x) => Date.now() - Date.parse(x.created) < 7 * 864e5], 'f:hoy': ['Con movimiento hoy', (x) => (x.updated || '').slice(0, 10) === td] };
    const [tit, fn] = t === 'e:' ? [v, (x) => x.etapa === v] : (F[arg] || ['Clientes', () => true]);
    const list = d.leads.filter(fn).sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
    m.innerHTML = top(`${esc(tit)} · ${list.length}`, NEGS[NEG].n, `<a class="btn g" href="#resumen">Volver</a><a class="btn g" href="#clientes">Embudo</a>`) +
      (list.length ? list.map((c) => `<div class="card sec"><div class="row" style="justify-content:space-between"><a href="#ncliente/${c.id}"><b>${esc(c.nombre)}</b></a><span class="mu sm">${esc(c.etapa)}${c.updated ? ' · ' + fdt(c.updated) : ''}</span></div>
        ${c.interes ? `<p style="margin-top:6px">${esc(c.interes)}</p>` : ''}${c.notas ? `<p class="mu sm" style="margin-top:6px;white-space:pre-line">${esc(c.notas)}</p>` : ''}
        <p class="mu sm" style="margin-top:6px">${[c.telefono, c.email, c.origen].filter(Boolean).map(esc).join(' · ')}</p>
        <div class="row" style="margin-top:10px"><a class="btn s" href="#ncliente/${c.id}">Abrir ficha</a>${c.telefono ? `<a class="btn g s" target="_blank" rel="noopener" href="${waLink(c.telefono)}">${IC.wa}WhatsApp</a>` : ''}</div></div>`).join('') : '<div class="card mu">No hay clientes aquí.</div>');
    return;
  }
  const draw = () => {
    const list = d.leads.filter((c) => !q || `${c.nombre} ${c.telefono} ${c.email} ${c.interes}`.toLowerCase().includes(q));
    $('#kb').innerHTML = d.etapas.map((e) => { const cs = list.filter((c) => c.etapa === e); return `<div class="col" data-e="${esc(e)}"><h4>${esc(e)} <span>${cs.length}</span></h4>${cs.map((c) => `<div class="kc" draggable="true" data-k="${c.id}"><a href="#ncliente/${c.id}"><b>${esc(c.nombre)}</b><span>${esc(c.interes || c.historial?.[0]?.t || '')}</span><small>${fdate(c.updated)}${c.origen ? ' · ' + esc(c.origen) : ''}</small></a><select class="mv" data-k="${c.id}" aria-label="Mover a">${d.etapas.map((x) => `<option${x === c.etapa ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select></div>`).join('') || '<p class="mu sm" style="padding:6px">—</p>'}</div>`; }).join('');
    const mover = guard(async (id, e) => { const c = d.leads.find((x) => x.id === id); if (!c || c.etapa === e) return; await nApi('/' + id, { method: 'PUT', body: { etapa: e } }); c.etapa = e; draw(); toast(`${c.nombre}: ${e}`); });
    $('#kb').querySelectorAll('.kc').forEach((el) => (el.ondragstart = (ev) => ev.dataTransfer.setData('text/plain', el.dataset.k)));
    $('#kb').querySelectorAll('.col').forEach((col) => { col.ondragover = (ev) => { ev.preventDefault(); col.classList.add('ov'); }; col.ondragleave = () => col.classList.remove('ov'); col.ondrop = (ev) => { ev.preventDefault(); col.classList.remove('ov'); mover(ev.dataTransfer.getData('text/plain'), col.dataset.e); }; });
    $('#kb').querySelectorAll('.mv').forEach((sel) => (sel.onchange = () => mover(sel.dataset.k, sel.value)));
  };
  m.innerHTML = top(`Clientes · ${NEGS[NEG].n}`, `${d.leads.length} contactos. Arrastra la tarjeta o cambia la etapa en su selector.`, `<button class="btn" id="nn">+ Añadir a mano</button><button class="btn g" id="csv">Exportar (CSV)</button>`) +
    `<input id="qq" placeholder="Buscar por nombre, teléfono, email o interés" style="max-width:420px;margin-bottom:14px"><div class="kb" id="kb"></div>`;
  $('#qq').oninput = (e) => { q = e.target.value.toLowerCase().trim(); draw(); };
  $('#nn').onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Añadir cliente a mano</h3><form id="nf" class="fg" style="grid-template-columns:1fr"><label>Nombre<input name="nombre" required></label><label>Teléfono<input name="telefono" inputmode="tel"></label><label>Email<input name="email" type="email"></label><label>Origen<input name="origen" placeholder="WhatsApp, Meta, llamada…"></label><label>Interés<input name="interes" placeholder="Qué busca o qué vende"></label><div class="row" style="justify-content:flex-end"><button type="button" class="btn g" id="nc">Cancelar</button><button class="btn">Añadir</button></div></form>`);
    $('#nc', dm).onclick = () => dm.remove(); $('#nf', dm).onsubmit = guard(async (e) => { e.preventDefault(); await nApi('', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); dm.remove(); toast('Añadido'); route(); }); };
  $('#csv').onclick = () => { const rows = [['Nombre', 'Teléfono', 'Email', 'Etapa', 'Origen', 'Interés', 'Última actividad', 'Notas'], ...d.leads.map((c) => [c.nombre, c.telefono, c.email, c.etapa, c.origen, c.interes, (c.updated || '').slice(0, 10), c.notas])];
    const csv = '﻿' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `clientes-${NEG}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); };
  draw();
};
V.ncliente = async (m, id) => {
  const d = await nApi(); const c = d.leads.find((x) => x.id === id); m = shell('clientes');
  if (!c) { m.innerHTML = top('Cliente') + '<div class="card mu">No encontrado.</div>'; return; }
  m.innerHTML = top(esc(c.nombre), `${esc(c.telefono || '')}${c.email ? ' · ' + esc(c.email) : ''}${c.origen ? ' · ' + esc(c.origen) : ''}`, `<a class="btn g" href="#clientes">Volver</a>`) +
    `<div class="two"><div class="card"><h3 style="margin-bottom:12px">Estado</h3><label>Etapa<select id="et">${d.etapas.map((e) => `<option${e === c.etapa ? ' selected' : ''}>${esc(e)}</option>`).join('')}</select></label>
    <label style="margin-top:10px">Interés<input id="in" value="${esc(c.interes || '')}"></label><label style="margin-top:10px">Notas internas<textarea id="nt" rows="5">${esc(c.notas || '')}</textarea></label>
    <div class="row" style="margin-top:12px"><button class="btn" id="sv">Guardar</button>${c.telefono ? `<a class="btn g" target="_blank" rel="noopener" href="${waLink(c.telefono)}">${IC.wa}WhatsApp</a><a class="btn g" href="tel:${esc(c.telefono)}">Llamar</a>` : ''}${c.email ? `<a class="btn g" href="mailto:${esc(c.email)}">Email</a>` : ''}<span style="flex:1"></span><button class="btn r s" id="del">Borrar</button></div></div>
    <div class="card"><h3 style="margin-bottom:12px">Historial</h3>${(c.historial || []).map((h) => `<div class="li"><div><span style="color:var(--tx)">${esc(h.t)}</span></div><div class="r">${fdt(h.d)}</div></div>`).join('') || '<p class="mu">Sin movimientos.</p>'}</div></div>`;
  const g = guard(async (msg = 'Guardado') => { await nApi('/' + id, { method: 'PUT', body: { etapa: $('#et').value, notas: $('#nt').value, interes: $('#in').value } }); toast(msg); route(); });
  $('#sv').onclick = () => g(); $('#et').onchange = () => g('Etapa cambiada');
  $('#del').onclick = guard(async () => { if (!confirm('¿Borrar este cliente del embudo?')) return; await nApi('/' + id, { method: 'DELETE' }); location.hash = '#clientes'; });
};
V.conexion = async (m) => {
  const c = await nApi('/conexion'); m = shell('conexion');
  m.innerHTML = top(`Entrada de leads · ${NEGS[NEG].n}`, 'Dirección privada a la que la web y los formularios mandan cada contacto nuevo.') +
    `<div class="card sec"><p class="mu" style="margin-top:0">Los formularios de la web y el script de Google la usan para meter cada contacto en el embudo al momento. No la compartas.</p><div class="row"><input id="cu" readonly value="${esc(c.url)}" style="flex:1;min-width:240px"><button class="btn g" id="cc">${IC.copy}Copiar</button></div>
    <p class="mu sm">Formato: POST con JSON {nombre, telefono, email, origen, interes, mensaje, ref}. Si el teléfono ya existe, se añade al historial de ese cliente en vez de duplicarlo.</p></div>`;
  $('#cc').onclick = () => navigator.clipboard.writeText($('#cu').value).then(() => toast('Copiado'));
};

// ---------- router ----------
async function route() {
  const [k, arg] = (location.hash.slice(1) || home().slice(1)).split('/');
  const fn = NEG === 'garage' ? (V[k] || V.leads) : ({ resumen: V.nresumen, clientes: V.nclientes, ncliente: V.ncliente, conexion: V.conexion }[k] || V.nresumen);
  try { await fn($('#mn'), arg); window.scrollTo(0, 0); } catch (e) { if (e.message !== 'Sesión caducada') { shell(k).innerHTML = `<div class="card">No se ha podido cargar: ${esc(e.message)}</div>`; } }
}
let polling = null;
async function boot() {
  try { const me = await api('/admin/me'); MIS = me.negs || ['garage']; QUIEN_YO = me.id === 'admin' ? 'Juan' : (me.name || me.id); if (!MIS.includes(NEG)) { NEG = MIS[0]; try { localStorage.setItem('pg_neg', NEG); } catch (e) { /* */ } } } catch (e) { return; }
  // La app instalada antigua abría en #resumen: en Plata Garage, la primera vez se va a Leads
  if (PRIMERA) { PRIMERA = false; if (NEG === 'garage' && (location.hash === '#resumen' || !location.hash)) history.replaceState(null, '', location.pathname + '#leads'); }
  if (NEG !== 'garage') { route(); return; }
  try { const s = await api('/admin/summary'); badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes }; route(); if (!polling) { poll(); polling = setInterval(poll, 60000); } } catch (e) { /* login ya mostrado */ }
}
let swReg = null;
if ('serviceWorker' in navigator) navigator.serviceWorker.register(B + '/admin-sw.js', { scope: B + '/admin' }).then((r) => (swReg = r)).catch(() => {});

window.addEventListener('hashchange', () => $('.lay') && route());
boot();
})();
