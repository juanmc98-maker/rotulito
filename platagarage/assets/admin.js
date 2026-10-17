/* Backoffice Plata Garage */
(() => {
const B = '', ST = '/platagarage', API = B + '/api';
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
  astilleros: svg('<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M12 5V2"/>'),
  cartera: svg('<path d="M2 20h20M4 17l2-9h12l2 9M9 8V5h6v3"/>'),
  trimestre: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'),
  docs: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>'),
  resumen: svg('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  coches: svg('<path d="M5 17h14M5 17a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 104 0 2 2 0 00-4 0zM3 17v-5l2-5h14l2 5v5"/>'),
  bancos: svg('<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M12 3l9 5H3z"/>'),
  reservas: svg('<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M9 16l2 2 4-4"/>'),
  horarios: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  valoraciones: svg('<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5"/>'),
  financiaciones: svg('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>'),
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
    $('#app').innerHTML = `<div class="login"><div class="card"><img src="${ST}/assets/logo.png" alt="Plata Garage"><h2>¿Quién eres?</h2><div class="who">${QUIEN.map(([u, n]) => `<button type="button" class="btn${u === last ? '' : ' g'}" data-u="${u}">${n}</button>`).join('')}</div><a href="#" class="mu sm" id="otro">Otro usuario</a></div></div>`;
    $('#app').querySelectorAll('[data-u]').forEach((b) => (b.onclick = () => form(b.dataset.u, b.textContent)));
    $('#otro').onclick = (e) => { e.preventDefault(); form('', ''); };
  };
  const form = (u, n) => {
    $('#app').innerHTML = `<div class="login"><form class="card" id="lf"><img src="${ST}/assets/logo.png" alt="Plata Garage"><h2>${n ? 'Hola, ' + esc(n) : 'Backoffice'}</h2>${u ? `<input type="hidden" name="user" value="${u}">` : '<label style="text-align:left">Usuario<input name="user" autocomplete="username" required autocapitalize="none"></label>'}<label style="text-align:left">Contraseña<input type="password" name="password" autocomplete="current-password" required></label><button class="btn" style="justify-content:center">Entrar</button><a href="#" class="mu sm" id="cw">No soy ${n ? esc(n) : 'yo'}</a><p class="mu sm" id="le"></p></form></div>`;
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
const NAV = [['leads', 'Leads'], ['resumen', 'Resumen'], ['analiticas', 'Analíticas'], ['clientes', 'Clientes'], ['coches', 'Coches'], ['trimestre', 'Trimestre'], ['bancos', 'Bancos'], ['reservas', 'Reservas'], ['financiaciones', 'Financiación'], ['horarios', 'Horarios'], ['valoraciones', 'Vendedores'], ['busquedas', 'Te lo buscamos'], ['alertas', 'Alertas'], ['envios', 'Envíos'], ['mensajes', 'Mensajes'], ['blog', 'Blog'], ['usuarios', 'Usuarios']];
let badges = {};
// Negocio activo: Plata Garage (panel completo), Plata Marine y Rotulito (embudo de clientes)
const NEGS = { garage: { n: 'Plata Garage', logo: ST + '/assets/logo.png', dark: true }, marine: { n: 'Plata Marine', logo: '/img/plata-marine-logo.png' }, rotulito: { n: 'Rotulito', logo: '/assets/rotulito-logo.svg' } };
let MIS = ['garage']; let ROL = ''; const ME_ADMIN = () => ROL === 'admin';
let QUIEN_YO = ''; // quién ha entrado (se muestra en el menú)
let PRIMERA = true; // primera carga de la app
let NEG = 'garage'; try { NEG = localStorage.getItem('pg_neg') || 'garage'; if (!NEGS[NEG]) NEG = 'garage'; } catch (e) { /* sin almacenamiento */ }
{ const qn = new URLSearchParams(location.search).get('neg'); if (qn && NEGS[qn]) { NEG = qn; try { localStorage.setItem('pg_neg', NEG); } catch (e) { /* */ } history.replaceState(null, '', location.pathname + location.hash); } }
// Cada negocio con sus colores (Plata Garage: oscuro y naranja; Plata Marine y Rotulito: los de su web)
const tema = () => { document.documentElement.dataset.neg = NEG; const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = NEG === 'garage' ? '#050505' : '#ffffff'; };
tema();
const NAV_OTRO = [['leads', 'Leads'], ['resumen', 'Resumen'], ['analiticas', 'Analíticas'], ['clientes', 'Clientes']];
IC.demandas = IC.busquedas; IC.visitas = IC.web;
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
    (NEG === 'garage' ? NAV : NEG === 'marine' ? [...NAV_OTRO.slice(0, 1), ['cartera', 'Cartera'], ['astilleros', 'Astilleros'], ['demandas', 'Demandas'], ...NAV_OTRO.slice(1), ['visitas', 'Visitas web'], ...(ME_ADMIN() ? [['trimestre', 'Trimestre']] : [])] : [...NAV_OTRO, ['visitas', 'Visitas web'], ...(ME_ADMIN() ? [['trimestre', 'Trimestre']] : [])]).map(([k, t]) => `<a href="#${k}" class="${active === k ? 'on' : ''}">${IC[k]}${t}${badges[k] ? `<span class="bd">${badges[k]}</span>` : ''}</a>`).join('') +
    `<div class="sp"></div><a href="${NEG === 'marine' ? 'https://www.platamarine.com/' : NEG === 'rotulito' ? 'https://www.rotulito.com/' : B + '/'}" target="_blank" rel="noopener">${IC.web}Ver web pública</a><small class="mu" style="display:block;font-size:12px;margin:10px 6px 2px">Has entrado como <b>${esc(QUIEN_YO)}</b></small><a href="#" id="pushon">${IC.alertas}<span id="pusht">Avisos en este móvil</span></a><a href="#" id="lo">${IC.out}Cambiar de persona</a>`;
  $('#sx').onclick = () => $('#sb').classList.remove('open');
  $('#sb').querySelectorAll('[data-neg]').forEach((b) => (b.onclick = () => { NEG = b.dataset.neg; try { localStorage.setItem('pg_neg', NEG); } catch (e) { /* */ } $('#sb').classList.remove('open'); goHome(); }));
  $('#slg').onclick = (e) => { e.preventDefault(); $('#sb').classList.remove('open'); goHome(); };
  $('#pushon').onclick = (e) => { e.preventDefault(); activarPush(); }; pushEstado();
  $('#lo').onclick = guard(async (e) => { e.preventDefault(); await fetch(API + '/logout'); history.replaceState(null, '', location.pathname); showLogin(); });
  $('#sb').classList.remove('open');
  return $('#mn');
}
const home = () => '#leads';
function goHome() { if (location.hash === home()) route(); else location.hash = home(); }
const top = (t, sub = '', right = '') => `<div class="top"><div><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${right}</div></div>`;
const badge = (s) => { const m = { pendiente: 'w', confirmada: 'b', completada: 'ok', cancelada: 'r', contactado: 'b', ofertado: 'o', cerrada: 'ok', visto: 'b', comprado: 'ok', gestion: 'o', vendido: 'ok', descartado: 'r', 'presupuesto enviado': 'b', aceptado: 'ok', rechazado: 'r', respondido: 'ok' }; return `<span class="bg ${m[s] || 'x'}">${esc(s[0].toUpperCase() + s.slice(1))}</span>`; };

// ---------- vistas ----------
const V = {};

const fechaLarga = (iso) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : '');
// Recordatorio de cita por WhatsApp: se abre el chat con el texto escrito y Cristina solo pulsa enviar
const recordatorio = (b) => { const [y, mo, d] = String(b.fecha || '').split('-');
  return waLink(b.telefono, `Tenemos una visita para ver el coche:\n\n📅 ${d}/${mo} a las ${b.hora}\n📍 Calle Tetuán 92, Sabadell\n\nQuedo pendiente de tu confirmación.\n\nSi te interesa asegurarlo antes de venir, podemos dejarlo reservado y así evitar que otro cliente se adelante. Si quieres, te indico cómo hacerlo.`); };
const KIC = { coches: IC.coches, 'coches/vendidos': IC.coches, reservas: IC.reservas, valoraciones: IC.valoraciones, envios: IC.envios, financiaciones: IC.financiaciones, mensajes: IC.mensajes, busquedas: IC.busquedas, alertas: IC.alertas, clientes: IC.clientes };
V.resumen = async (m) => {
  const s = await api('/admin/summary');
  badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, financiaciones: s.financiacionesPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes };
  m = shell('resumen');
  const k = (n, t, h) => `<a class="card" href="#${h}"><span>${t}</span><i>${KIC[h] || IC.resumen}</i><b>${n}</b></a>`;
  const fila = (b, right) => `<div class="li"><div><b>${esc(b.nombre)}</b><span>${esc(b.motivo || b.cocheNombre || '')} · ${esc(b.telefono)}</span></div><div class="r">${right}</div></div>`;
  m.innerHTML = top('Resumen', 'Estado general de la actividad reciente.', notifBtn()) +
    `<div class="kp">${k(s.enStock, 'Coches en stock', 'coches')}${k(s.vendidos, 'Coches vendidos', 'coches/vendidos')}${k(s.citasPendientes, 'Citas pendientes', 'reservas')}${k(s.tasacionesNuevas, 'Valoraciones nuevas', 'valoraciones')}${k(s.enviosPendientes, 'Envíos pendientes', 'envios')}${k(s.mensajesSinLeer, 'Mensajes sin leer', 'mensajes')}${k(s.busquedasPendientes || 0, 'Te lo buscamos (nuevas)', 'busquedas')}${k(s.alertasActivas || 0, 'Alertas de stock activas', 'alertas')}${k(s.destacados, 'Destacados activos', 'coches')}${k(eur(s.valorStock), 'Valor del stock', 'coches')}</div>
    ${s.porDueno?.length ? `<div class="kp">${s.porDueno.map((d) => `<a class="card" href="#coches/${d.o === 'Cristina' ? 'cristina' : d.o === 'Juan' ? 'juan' : 'stock'}"><span>Stock de ${esc(d.o)}</span><i>${IC.coches}</i><b>${d.n} · ${eur(d.v)}</b>${d.ng ? `<small class="mu" style="display:block;font-size:12px">${eur(d.v)} propio · ${d.ng} en gestión de venta (${eur(d.g)}, no es capital propio)</small>` : ''}</a>`).join('')}</div>` : ''}
    ${s.gestion?.n ? `<div class="kp"><a class="card" href="#coches"><span>En gestión de venta (no es capital propio)</span><i>${IC.coches}</i><b>${s.gestion.n} · ${eur(s.gestion.v)}</b><small class="mu" style="display:block;font-size:12px">Comisión prevista: ${eur(s.gestion.com)}${s.gestion.sinPrecio ? ` · ${s.gestion.sinPrecio} sin precio` : ''}</small></a></div>` : ''}
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
    badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, financiaciones: s.financiacionesPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes };
    if (lastSum) {
      const t = { citas: 'Nueva cita', tas: 'Nueva tasación', env: 'Nueva solicitud de envío', msg: 'Nuevo mensaje', bus: 'Nueva petición "Te lo buscamos"' };
      const h = { citas: 'reservas', tas: 'valoraciones', env: 'envios', msg: 'mensajes', bus: 'busquedas' };
      Object.keys(cur).forEach((k) => { if (cur[k] > lastSum[k]) { if ('Notification' in window && Notification.permission === 'granted') { const o = { body: 'Ábrela en el panel', icon: ST + '/assets/icon-192.png', tag: k }; if (swReg) swReg.showNotification(t[k] + ' · Plata Garage', o); else { const n = new Notification(t[k] + ' · Plata Garage', o); n.onclick = () => { window.focus(); location.hash = '#' + h[k]; }; } } toast(t[k]); } });
      const act = (location.hash.slice(1) || 'resumen').split('/')[0]; if ($('#sb') && !$('#sb').classList.contains('open')) shell(act);
    }
    lastSum = cur;
  } catch (e) { /* sin sesión */ }
}
// Rotación: días en stock, último cambio de precio y contactos de cada coche (objetivo: no pasar de 45 días)
const rot = (c, cl = []) => { const dias = diasDesde(c.llegada || c.created); const ph = c.priceHistory || []; const dp = diasDesde(ph.length > 1 ? ph[ph.length - 1].d : c.llegada || c.created);
  const nm = `${c.brand} ${c.model}`.toLowerCase(); const quien = cl.filter((x) => (x.leads || []).some((l) => l.coche === c.id || (l.cocheNombre || l.coche || '').toString().toLowerCase().includes(nm))); const leads = quien.length;
  const nivel = c.sold ? '' : dias >= 75 ? 'r' : dias >= 45 ? 'w' : ''; const siguiente = c.price > 1500 ? Math.floor((c.price - 1000 + 10) / 1000) * 1000 - 10 : 0;
  return { dias, dp, leads, quien, nivel, siguiente }; };
V.coches = async (m, arg) => {
  const [cars, cl] = await Promise.all([api('/admin/cars'), api('/admin/clientes').catch(() => [])]); m = shell('coches');
  const f = arg || 'stock';
  const list = cars.filter((c) => (f === 'stock' ? !c.sold : f === 'vendidos' ? c.sold : f === 'cristina' ? !c.sold && c.owner === 'Cristina' : f === 'juan' ? !c.sold && c.owner === 'Juan' : true));
  const st = (c) => (c.gestion ? '<span class="bg w" title="Gestión de venta: no es capital propio">Gestión</span> ' : '') + (c.sold ? '<span class="bg x">Vendido</span>' : c.status === 'reservado' ? '<span class="bg b">Reservado</span>' : c.status === 'preparacion' ? '<span class="bg w">En preparación</span>' : '<span class="bg ok">En stock</span>') + (c.featured && !c.sold ? '<span class="bg o">Destacado</span>' : '') + (c.hidden ? '<span class="bg r">Oculto</span>' : '');
  m.innerHTML = top('Coches', `${cars.filter((c) => !c.sold).length} en stock · ${cars.filter((c) => c.sold).length} vendidos`, `<a class="btn" href="#coche/nuevo">+ Nuevo coche</a>`) +
    `<div class="filt">${[['stock', 'En stock'], ['cristina', 'De Cristina'], ['juan', 'De Juan'], ['vendidos', 'Vendidos'], ['todos', 'Todos']].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <input id="cq" type="search" placeholder="Buscar coche: marca, modelo, matrícula, año…" autocomplete="off" style="width:100%;margin:0 0 14px">
    <div class="tw"><table class="ct"><thead><tr><th>Coche</th><th>Año</th><th class="hide-m">Km</th><th>Precio</th><th>Estado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${cars.map((c) => `<tr data-id="${c.id}" data-in="${list.includes(c) ? 1 : ''}" data-k="${esc([c.brand, c.model, c.version, c.matricula, c.year, c.price, c.owner, c.color].filter(Boolean).join(' ').toLowerCase())}"${list.includes(c) ? '' : ' style="display:none"'}><td><a class="cn" href="#coche/${c.id}" title="Editar"><img class="thumb" src="${esc(c.images?.[0] || '')}" alt="" loading="lazy"><div><b>${esc(c.brand)} ${esc(c.model)}</b><small>${esc(c.version || '')}${c.owner ? ' · ' + esc(c.owner) : ''}</small></div></a></td><td>${c.year}</td><td class="hide-m">${nf(c.km)}</td><td><b>${eur(c.price)}</b>${c.sold ? '' : (() => { const r = rot(c, cl); return `<small style="display:block;color:${r.nivel === 'r' ? 'var(--bad)' : r.nivel === 'w' ? '#e0b341' : 'var(--mu)'}">${r.dias} días · ${r.leads ? `<a href="#" data-q="${c.id}" style="color:inherit;text-decoration:underline">${r.leads} contacto${r.leads === 1 ? '' : 's'}</a>` : '0 contactos'}</small>`; })()}</td><td>${st(c)}</td>
    <td><div class="acts"><button class="ib ${c.featured ? 'on' : ''}" data-a="star" title="Destacar en la portada">${IC.star}</button><a class="ib" href="#coche/${c.id}" title="Editar">${IC.edit}</a><button class="ib" data-a="dup" title="Duplicar (para dar de alta uno parecido)">${IC.copy}</button><button class="btn g s" data-a="sold">${c.sold ? 'Volver a stock' : 'Vendido'}</button><button class="btn r s" data-a="del">Eliminar</button></div></td></tr>`).join('') || '<tr><td colspan="6" class="mu">No hay coches.</td></tr>'}</tbody></table></div>`;
  m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = '#coches/' + b.dataset.f)));
  // Quién ha preguntado por cada coche: lista para estudiar y repescar
  m.querySelectorAll('[data-q]').forEach((b) => (b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); const c = cars.find((x) => x.id === b.dataset.q); const r = rot(c, cl);
    const dm = modal(`<h3 style="margin-bottom:4px">${esc(c.brand)} ${esc(c.model)} · ${r.leads} contacto${r.leads === 1 ? '' : 's'}</h3><p class="mu sm" style="margin:0 0 12px">Toca uno para ver su ficha y decidir si repescarlo.</p>${r.quien.sort((a2, z) => (z.last || '').localeCompare(a2.last || '')).map((x) => `<a class="li" href="#cliente/${x.key}" style="text-decoration:none;color:var(--tx)"><div><b>${esc(x.nombre || 'Sin nombre')}</b><span>${esc(x.telefono || '')} · ${esc(x.etapa || '')}${x.last ? ' · último contacto ' + fdate(x.last) : ''}${x.motivo ? ' · ' + esc(x.motivo) : ''}</span></div><span class="mu">›</span></a>`).join('')}`);
    dm.querySelectorAll('a.li').forEach((a2) => a2.addEventListener('click', () => dm.remove())); }));
  // Buscador: con texto busca en todos los coches (también vendidos); vacío, vuelve al filtro elegido
  const cq = m.querySelector('#cq'); const nq = (x) => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  cq.oninput = () => { const ws = nq(cq.value).split(' ').filter(Boolean); m.querySelectorAll('tr[data-id]').forEach((tr) => { const k = nq(tr.dataset.k); const kk = k + ' ' + k.replace(/\s/g, ''); tr.style.display = (ws.length ? ws.every((w) => kk.includes(w)) : tr.dataset.in) ? '' : 'none'; }); };
  if (window.innerWidth > 800) cq.focus();
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
// ---------- Documentos privados de cada coche / barco (cifrados en el servidor) ----------
const TIPOS_DOC = { car: ['Factura de compra', 'Taller', 'ITV', 'Transporte', 'Recambios', 'Limpieza / estética', 'Gestoría', 'Otro gasto', 'Factura de venta', 'Contrato', 'Documentación', 'Foto'], boat: ['Hoja de encargo firmada', 'Documentación del barco', 'Fotos', 'DNI / CIF del vendedor', 'Contrato de compraventa', 'Factura', 'Otro'] };
// Clasifica cada archivo por su nombre al subir una carpeta entera (luego se puede corregir con "Editar")
function tipoAuto(sc, name, mime) {
  const n = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const R = sc === 'car'
    ? [[/fra.*venta|factura.*venta|venta.*fact/, 'Factura de venta'], [/taller|mecanic|revision|reparac|neumatic|aceite|distribuc/, 'Taller'], [/itv/, 'ITV'], [/transport|grua/, 'Transporte'], [/limpieza|pulido|estetic|lavado|rentat|neteja/, 'Limpieza / estética'], [/recambio|pieza/, 'Recambios'], [/gestor|transferencia|dgt|cambio de titular|tasa/, 'Gestoría'], [/contrato|reserva|senal/, 'Contrato'], [/compra|compraventa|adquisici/, 'Factura de compra'], [/fra|factura|invoice|ticket/, 'Otro gasto'], [/permiso|ficha|tecnica|circulacion|dni|nif|cif|seguro|informe|carfax|historial/, 'Documentación']]
    : [[/hoja|encargo/, 'Hoja de encargo firmada'], [/dni|nie|cif|nif/, 'DNI / CIF del vendedor'], [/contrato|compraventa/, 'Contrato de compraventa'], [/fra|factura/, 'Factura'], [/registro|matricula|certificado|navegabilidad|seguro|itb|rol|permiso/, 'Documentación del barco']];
  for (const [re, t] of R) if (re.test(n)) return t;
  return /^image\//.test(mime || '') ? (sc === 'car' ? 'Foto' : 'Fotos') : (sc === 'car' ? 'Documentación' : 'Otro');
}
const SIN_IMPORTE = ['Factura de venta', 'Contrato', 'Documentación', 'Foto'];
const fsize = (n) => (n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB');
const b64 = (file) => new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = () => ko(new Error('No se pudo leer ' + file.name)); r.readAsDataURL(file); });
// Lectura automática de facturas: saca total, fecha e IVA del PDF (o de la foto/escaneo con OCR) para contabilizar solo
const CDN_PDF = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/';
let _pdf, _ocr;
const pdfLib = async () => { if (!_pdf) { _pdf = await import(CDN_PDF + 'pdf.min.mjs'); _pdf.GlobalWorkerOptions.workerSrc = CDN_PDF + 'pdf.worker.min.mjs'; } return _pdf; };
const ocrLib = () => _ocr || (_ocr = new Promise((ok, ko) => { const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js'; sc.onload = () => ok(window.Tesseract); sc.onerror = () => ko(new Error('No se pudo cargar el lector')); document.head.appendChild(sc); }));
const conTiempo = (p, ms) => Promise.race([p, new Promise((_, ko) => setTimeout(() => ko(new Error('tiempo')), ms))]);
async function textoDoc(blob, mime) {
  let canvas = null;
  if (/pdf/.test(mime)) { const lib = await pdfLib(); const doc = await lib.getDocument({ data: await blob.arrayBuffer() }).promise; let t = '';
    for (let i = 1; i <= Math.min(doc.numPages, 4); i++) { const tc = await (await doc.getPage(i)).getTextContent(); t += tc.items.map((x) => x.str).join(' ') + '\n'; }
    if (t.replace(/\s/g, '').length > 60) return t;
    const pg = await doc.getPage(1); const vp = pg.getViewport({ scale: 2 }); canvas = document.createElement('canvas'); canvas.width = vp.width; canvas.height = vp.height; await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp, intent: 'print' }).promise;
  } else if (!/^image\//.test(mime)) return '';
  const T = await ocrLib(); const r = await T.recognize(canvas || blob, 'spa'); return r.data.text || '';
}
const numES = (x) => Number(String(x).replace(/\./g, '').replace(',', '.'));
function leerImportes(t) {
  const A = /(\d{1,3}(?:\.\d{3})+,\d{2}|\d+,\d{2})/; const R = {};
  const tot = [...t.matchAll(new RegExp('(?<!sub|s u b )t ?o ?t ?a ?l[^0-9\\n]{0,40}?' + A.source, 'gi'))].map((m) => numES(m[1])).filter((n) => n > 0);
  const all = [...t.matchAll(new RegExp(A.source, 'g'))].map((m) => numES(m[1])).filter((n) => n > 0 && n < 1e6);
  R.importe = tot.length ? Math.max(...tot) : all.length ? Math.max(...all) : 0;
  const f = t.match(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})\b/); if (f) R.fecha = `${f[3]}-${f[2].padStart(2, '0')}-${f[1].padStart(2, '0')}`;
  if (/bienes usados|\brebu\b|art[ií]culos? 13[5-9]/i.test(t)) R.iva = 0;
  else { // IVA: busca una base y su 21 % entre los importes de la factura
    let best = null; for (const a of all) for (const b of all) if (b < a && Math.abs(a * 0.21 - b) <= 0.02 && (!best || a > best[0])) best = [a, b];
    const b = t.match(/base\s*imponible[^0-9\n]{0,30}?(\d{1,3}(?:\.\d{3})+,\d{2}|\d+,\d{2})/i);
    R.iva = best ? best[1] : b && R.importe ? Math.max(0, Math.round((R.importe - numES(b[1])) * 100) / 100) : null;
    if (/r[ée]g(imen|\.)\s*(normal|general)/i.test(t)) R.general = true; }
  return R;
}
// IVA estimado si la factura no lo dice: los gastos con IVA al 21 % incluido; compras y tasas, sin IVA
const ivaDe = (f) => (typeof f.iva === 'number' ? f.iva : ['Factura de compra', 'Gestoría', 'Factura de venta', 'Contrato', 'Documentación', 'Foto'].includes(f.tipo) ? 0 : Math.round(f.importe * 21 / 121 * 100) / 100);
async function docsBox(el, sc, ref, o = {}) {
  let ent = await api(`/admin/docs/${sc}/${ref}`); const car = sc === 'car';
  const draw = () => {
    const F = ent.files; const compra = F.filter((f) => f.tipo === 'Factura de compra').reduce((a, f) => a + f.importe, 0);
    const gastos = F.filter((f) => f.tipo !== 'Factura de compra' && !SIN_IMPORTE.includes(f.tipo)).reduce((a, f) => a + f.importe, 0); const venta = ent.venta || o.venta || 0;
    el.innerHTML = `<div class="card sec"><h3 style="margin-bottom:4px">Documentos y ${car ? 'gastos' : 'archivos'}</h3><p class="mu sm" style="margin:0 0 12px">Privado: solo se ve con sesión iniciada y se guarda cifrado. Máx. 4 MB por archivo (las fotos se reducen solas). Puedes subir la carpeta entera del coche: cada archivo se clasifica solo por su nombre y luego lo corriges con Editar.</p>
      ${car ? `<div class="kp" style="margin-bottom:14px"><div class="card"><span>Compra</span><b>${eur(compra)}</b></div><div class="card"><span>Gastos</span><b>${eur(gastos)}</b></div><div class="card"><span>Venta</span><b>${eur(venta)}</b></div><div class="card"><span>Margen</span><b style="color:${venta - compra - gastos >= 0 ? 'var(--ok)' : 'var(--bad)'}">${venta ? eur(Math.round((venta - compra - gastos) * 100) / 100) : '—'}</b></div></div>
      ${(() => { if (!venta) return ''; const ivaG = F.filter((f) => f.tipo !== 'Factura de compra' && !SIN_IMPORTE.includes(f.tipo)).reduce((a2, f) => a2 + ivaDe(f), 0);
        const ivaC = F.filter((f) => f.tipo === 'Factura de compra').reduce((a2, f) => a2 + (f.iva || 0), 0); const gen = ivaC > 0;
        const mg = venta - compra; const ivaR = gen ? Math.max(0, venta * 21 / 121 - ivaC) : Math.max(0, mg) * 21 / 121; const rend = venta - ivaR - compra - (gastos - ivaG); const irpf = Math.max(0, rend) * 0.2; const neto = rend - irpf; const r2 = (n) => Math.round(n * 100) / 100;
        const L = (k, v, b) => `<div class="row" style="justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--line)${b ? ';font-weight:700' : ''}"><span>${k}</span><span>${v}</span></div>`;
        return `<div class="card" style="margin-bottom:14px"><h4 style="margin:0 0 8px">Beneficio después de impuestos</h4>${L('Venta', eur(r2(venta)))}${L('Compra del coche', '− ' + eur(r2(compra)))}${gen ? `${L('Régimen', 'General (la compra llevaba IVA)')}${L(`IVA de la venta (${eur(r2(venta * 21 / 121))}) − IVA de la compra (${eur(r2(ivaC))})`, '− ' + eur(r2(ivaR)))}` : `${L('Margen REBU (venta − compra)', eur(r2(mg)))}${L('IVA del margen (REBU 21 %)', '− ' + eur(r2(ivaR)))}`}${L(`Gastos sin IVA (IVA deducible ${eur(r2(ivaG))})`, '− ' + eur(r2(gastos - ivaG)))}${L('Beneficio antes de IRPF', eur(r2(rend)), 1)}${L('IRPF (pago a cuenta 20 %, Mod. 130)', '− ' + eur(r2(irpf)))}<div class="row" style="justify-content:space-between;padding:8px 0 2px;font-size:1.15em;font-weight:800"><span>Beneficio neto real</span><span style="color:${neto >= 0 ? 'var(--ok)' : 'var(--bad)'}">${eur(r2(neto))}</span></div><p class="mu sm" style="margin:8px 0 0">Orientativo. El IRPF final depende de tu renta anual; el 20 % es el pago a cuenta del Mod. 130. Confírmalo con la gestoría.</p></div>`; })()}
      <div class="nota" style="margin-bottom:14px"><div class="row" style="justify-content:space-between;align-items:center"><b>Resumen</b><span><button type="button" class="btn g s" id="lr" title="Lee los PDF y fotos ya subidos que no tienen importe">Leer importes</button> <button type="button" class="btn g s" id="ne">${ent.nota ? 'Editar' : 'Añadir resumen'}</button></span></div>${ent.nota ? `<div class="sm" style="white-space:pre-wrap;margin-top:8px;line-height:1.55">${esc(ent.nota)}</div>` : ''}</div>
      <form id="vf" class="row" style="margin-bottom:12px"><label style="flex:1;min-width:200px">Precio final de venta (si no es el de la web)<input name="venta" inputmode="decimal" value="${ent.venta || ''}" placeholder="${o.venta || ''}"></label><button class="btn g s" style="align-self:flex-end">Guardar</button></form>` : ''}
      <form id="df" class="fg" style="grid-template-columns:2fr 1fr 1fr 1fr auto;align-items:end"><label>Archivo(s) o carpeta<input type="file" name="f" multiple accept=".pdf,image/*,.doc,.docx"><a href="#" class="sm" id="dcar" style="color:var(--or)">o elegir una carpeta entera</a><input type="file" name="d" webkitdirectory multiple hidden></label><label>Tipo<select name="tipo"><option value="">Automático (según el nombre)</option>${TIPOS_DOC[sc].map((t) => `<option>${t}</option>`).join('')}</select></label><label>Importe (€)<input name="importe" inputmode="decimal" placeholder="Con IVA si lo lleva"></label><label>Fecha<input type="date" name="fecha" value="${new Date().toLocaleDateString('sv-SE')}"></label><button class="btn s">Subir</button></form>
      <div style="margin-top:14px">${F.length ? F.map((f) => `<div class="li"><div><a href="${API}/admin/docs/file/${f.id}" target="_blank" rel="noopener" style="color:var(--tx);text-decoration:none"><b>${esc(f.nombre)}</b></a><span>${esc(f.tipo)} · ${fdate(f.fecha)}${f.importe ? ' · ' + eur(f.importe) : ''} · ${fsize(f.size)} · subido por ${esc(f.by || '')}</span></div><div class="r"><button class="btn g s" data-de="${f.id}">Editar</button> <a class="btn g s" href="${API}/admin/docs/file/${f.id}?dl=1">Descargar</a> <button class="btn r s" data-dx="${f.id}">Borrar</button></div></div>`).join('') : '<p class="mu">Todavía no hay documentos.</p>'}</div></div>`;
    const lr = el.querySelector('#lr'); if (lr) lr.onclick = guard(async () => { const pend = ent.files.filter((f) => !f.importe && /pdf|image/.test(f.mime)); if (!pend.length) return toast('No hay documentos sin importe');
      let n = 0; for (const f of pend) { lr.textContent = `Leyendo ${++n}/${pend.length}…`; try { const blob = await fetch(`${API}/admin/docs/file/${f.id}`, { credentials: 'same-origin' }).then((r) => r.blob()); const tx = await conTiempo(textoDoc(blob, f.mime), 90000); const a2 = leerImportes(tx); if (!a2.importe) continue;
        let tipo = f.tipo; if (/Documentación|Foto/.test(tipo)) { const t2 = tipoAuto(sc, f.nombre + ' ' + tx.slice(0, 1500), 'application/pdf'); if (t2 !== 'Documentación') tipo = t2; }
        ent = await api(`/admin/docs/${sc}/${ref}/${f.id}`, { method: 'PATCH', body: { importe: a2.importe, iva: a2.iva ?? '', fecha: a2.fecha || f.fecha, tipo } }); } catch (er) { /* sigue con el siguiente */ } }
      toast('Importes leídos: revísalos'); draw(); });
    const ne = el.querySelector('#ne'); if (ne) ne.onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Resumen</h3><form class="fg" style="grid-template-columns:1fr"><textarea name="n" rows="12">${esc(ent.nota || '')}</textarea><button class="btn">Guardar</button></form>`); dm.querySelector('form').onsubmit = guard(async (e) => { e.preventDefault(); ent = await api(`/admin/docs/${sc}/${ref}`, { method: 'PUT', body: { nota: e.target.n.value } }); dm.remove(); toast('Guardado'); draw(); }); };
    const vf = el.querySelector('#vf'); if (vf) vf.onsubmit = guard(async (e) => { e.preventDefault(); ent = await api(`/admin/docs/${sc}/${ref}`, { method: 'PUT', body: { venta: e.target.venta.value } }); toast('Guardado'); draw(); });
    el.querySelector('#df').onsubmit = guard(async (e) => { e.preventDefault(); const fm = e.target; const files = [...fm.f.files, ...fm.d.files].filter((x) => !/^\./.test(x.name) && x.size); if (!files.length) return toast('Elige algún archivo o carpeta'); const btn = fm.querySelector('button'); btn.disabled = true; btn.textContent = 'Subiendo…';
      try { for (const file of files) { let data, mime = file.type || 'application/octet-stream', nombre = file.name;
          if (/^image\//.test(mime) && !/svg/.test(mime)) { const r = await shrink(file, 2000); data = r.data; mime = r.type; nombre = nombre.replace(/\.\w+$/, '') + (mime === 'image/webp' ? '.webp' : '.jpg'); } else data = await b64(file);
          let tipo = fm.tipo.value || tipoAuto(sc, file.name, file.type), auto = {};
          const manual = files.length === 1 && fm.importe.value;
          if (car && !manual && !SIN_IMPORTE.includes(tipo) && /pdf|image/.test(file.type)) { btn.textContent = 'Leyendo ' + file.name.slice(0, 18) + '…'; try { const tx = await conTiempo(textoDoc(file, file.type), 90000); auto = leerImportes(tx); if (!fm.tipo.value && /Documentación|Foto/.test(tipo)) { const t2 = tipoAuto(sc, tx.slice(0, 1500), 'application/pdf'); if (auto.importe && t2 !== 'Documentación') tipo = t2; } } catch (er) { auto = {}; } btn.textContent = 'Subiendo…'; }
          ent = await api(`/admin/docs/${sc}/${ref}`, { method: 'POST', body: { data, mime, nombre, tipo, importe: manual ? fm.importe.value : auto.importe || '', iva: auto.iva ?? '', fecha: auto.fecha || fm.fecha.value } }); }
        toast(files.length > 1 ? `${files.length} archivos subidos` : 'Subido'); } finally { draw(); } });
    const dc = el.querySelector('#dcar'); dc.onclick = (e) => { e.preventDefault(); el.querySelector('#df').d.click(); };
    el.querySelector('#df').d.onchange = (e) => { const n = e.target.files.length; dc.textContent = n ? `Carpeta elegida: ${n} archivos` : 'o elegir una carpeta entera'; };
    el.querySelectorAll('[data-de]').forEach((b) => (b.onclick = () => { const f = ent.files.find((x) => x.id === b.dataset.de);
      const dm = modal(`<h3 style="margin-bottom:12px">Editar documento</h3><form class="fg" style="grid-template-columns:1fr"><label>Nombre<input name="nombre" value="${esc(f.nombre)}"></label><label>Tipo<select name="tipo">${TIPOS_DOC[sc].map((t) => `<option${t === f.tipo ? ' selected' : ''}>${t}</option>`).join('')}</select></label><label>Importe (€)<input name="importe" inputmode="decimal" value="${f.importe || ''}" placeholder="Con IVA si lo lleva"></label><label>IVA incluido (€) <span class="mu sm">(vacío = se calcula solo)</span><input name="iva" inputmode="decimal" value="${typeof f.iva === 'number' ? f.iva : ''}"></label><label>Fecha<input type="date" name="fecha" value="${f.fecha}"></label><button class="btn">Guardar</button></form>`);
      dm.querySelector('form').onsubmit = guard(async (e) => { e.preventDefault(); const t = e.target; ent = await api(`/admin/docs/${sc}/${ref}/${f.id}`, { method: 'PATCH', body: { nombre: t.nombre.value, tipo: t.tipo.value, importe: t.importe.value, iva: t.iva.value, fecha: t.fecha.value } }); dm.remove(); toast('Guardado'); draw(); }); }));
    el.querySelectorAll('[data-dx]').forEach((b) => (b.onclick = guard(async () => { const f = ent.files.find((x) => x.id === b.dataset.dx); if (!confirm(`¿Borrar "${f.nombre}"? No se puede deshacer.`)) return; ent = await api(`/admin/docs/${sc}/${ref}/${f.id}`, { method: 'DELETE' }); toast('Borrado'); draw(); })));
  };
  draw();
}
const slug = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
// ZIP sin compresión hecho en el navegador (para mandar las facturas del trimestre a la gestoría)
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return (u) => { let c = 0xffffffff; for (let i = 0; i < u.length; i++) c = t[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }; })();
function zip(files) { // files: [{name, data: Uint8Array}]
  const enc = new TextEncoder(); const parts = []; const cen = []; let off = 0;
  const le = (n, b) => { const a = new Uint8Array(b); for (let i = 0; i < b; i++) a[i] = (n >>> (8 * i)) & 255; return a; };
  for (const f of files) { const nm = enc.encode(f.name); const crc = CRC(f.data); const sz = f.data.length;
    const h = [le(0x04034b50, 4), le(20, 2), le(0x0800, 2), le(0, 2), le(0, 2), le(0x21, 2), le(crc, 4), le(sz, 4), le(sz, 4), le(nm.length, 2), le(0, 2), nm];
    const hl = h.reduce((a, x) => a + x.length, 0); parts.push(...h, f.data);
    cen.push(le(0x02014b50, 4), le(20, 2), le(20, 2), le(0x0800, 2), le(0, 2), le(0, 2), le(0x21, 2), le(crc, 4), le(sz, 4), le(sz, 4), le(nm.length, 2), le(0, 2), le(0, 2), le(0, 2), le(0, 2), le(0, 4), le(off, 4), nm); off += hl + sz; }
  const cl = cen.reduce((a, x) => a + x.length, 0);
  return new Blob([...parts, ...cen, le(0x06054b50, 4), le(0, 2), le(0, 2), le(files.length, 2), le(files.length, 2), le(cl, 4), le(off, 4), le(0, 2)], { type: 'application/zip' });
}
V.trimestre = async (m, arg) => {
  const now = new Date(); const [y0, q0] = (arg || '').split('-').map(Number); const y = y0 || now.getFullYear(), q = q0 || Math.floor(now.getMonth() / 3) + 1;
  const d = await api(`/admin/trimestre?y=${y}&q=${q}`); m = shell('trimestre');
  const prev = q === 1 ? `${y - 1}-4` : `${y}-${q - 1}`, next = q === 4 ? `${y + 1}-1` : `${y}-${q + 1}`;
  const grupos = ['Cristina', 'Juan', ''].map((o) => [o, d.rows.filter((r) => (r.owner || '') === o)]).filter(([, l]) => l.length);
  const tot = (l, k) => l.reduce((a, r) => a + (r[k] || 0), 0);
  const falta = d.rows.filter((r) => !r.compra || !r.files.some((f) => f.tipo === 'Factura de venta'));
  m.innerHTML = top(`Trimestre ${q}T ${y}`, `Coches vendidos del ${fdate(d.ini)} al ${fdate(new Date(Date.parse(d.fin) - DIA).toISOString().slice(0, 10))}: compra, gastos, venta y margen (REBU). Para revisar y mandar a la gestoría.`, `<a class="btn g" href="#trimestre/${prev}">‹ Anterior</a><a class="btn g" href="#trimestre/${next}">Siguiente ›</a>`) +
    (falta.length ? `<div class="card sec hl"><b>Falta documentación:</b> ${falta.map((r) => `<a href="#coche/${r.id}" style="color:var(--or)">${esc(r.coche)}</a> (${[!r.compra && 'factura de compra', !r.files.some((f) => f.tipo === 'Factura de venta') && 'factura de venta'].filter(Boolean).join(' y ')})`).join(' · ')}</div>` : '') +
    (grupos.length ? grupos.map(([o, l]) => `<div class="card sec"><h3 style="margin-bottom:10px">${o ? 'Coches de ' + esc(o) : 'Sin dueño asignado'} · ${l.length}</h3><div class="tw"><table><thead><tr><th>Coche</th><th>Vendido</th><th style="text-align:right">Compra</th><th style="text-align:right">Gastos</th><th style="text-align:right">Venta</th><th style="text-align:right">Margen</th><th style="text-align:right">Docs</th></tr></thead><tbody>${l.map((r) => `<tr><td><a href="#coche/${r.id}" style="color:var(--tx)">${esc(r.coche)} ${r.year || ''}</a></td><td>${fdate(r.vendido)}</td><td style="text-align:right">${eur(r.compra)}</td><td style="text-align:right">${eur(r.gastos)}</td><td style="text-align:right">${eur(r.venta)}</td><td style="text-align:right"><b>${eur(r.margen)}</b></td><td style="text-align:right">${r.files.length}</td></tr>`).join('')}<tr><td colspan="2"><b>Total</b></td><td style="text-align:right"><b>${eur(tot(l, 'compra'))}</b></td><td style="text-align:right"><b>${eur(tot(l, 'gastos'))}</b></td><td style="text-align:right"><b>${eur(tot(l, 'venta'))}</b></td><td style="text-align:right"><b>${eur(Math.round(tot(l, 'margen') * 100) / 100)}</b></td><td></td></tr></tbody></table></div>
      <div class="row" style="margin-top:12px"><button class="btn s" data-zip="${esc(o)}">Descargar ZIP${o ? ' · coches de ' + esc(o) : ''}</button></div></div>`).join('') : '<div class="card mu">No hay coches vendidos en este trimestre.</div>') +
    `<p class="mu sm">El margen es venta − compra − gastos, a título orientativo: la gestoría lo revisa antes de presentar nada.</p>`;
  m.querySelectorAll('[data-zip]').forEach((b) => (b.onclick = guard(async () => {
    const o = b.dataset.zip; const l = d.rows.filter((r) => (r.owner || '') === o); b.disabled = true; b.textContent = 'Preparando…';
    try { const files = []; const enc = new TextEncoder();
      const csv = '﻿' + [['Coche', 'Año', 'Vendido', 'Compra', 'Gastos', 'Venta', 'Margen'], ...l.map((r) => [r.coche, r.year, r.vendido, r.compra, r.gastos, r.venta, r.margen])].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
      files.push({ name: `resumen-${q}T${y}.csv`, data: enc.encode(csv) });
      for (const r of l) for (const f of r.files) { const res = await fetch(`${API}/admin/docs/file/${f.id}`, { credentials: 'same-origin' }); if (!res.ok) continue; files.push({ name: `${slug(r.coche)}/${f.tipo} - ${f.nombre}`.replace(/[\\:*?"<>|]/g, ''), data: new Uint8Array(await res.arrayBuffer()) }); }
      const a = document.createElement('a'); a.href = URL.createObjectURL(zip(files)); a.download = `plata-garage-${q}T${y}${o ? '-' + slug(o) : ''}.zip`; a.click(); toast('ZIP listo');
    } finally { b.disabled = false; b.textContent = 'Descargar ZIP' + (o ? ' · coches de ' + o : ''); } })));
};
// ---------- Plata Marine: cartera de barcos con hoja de encargo firmada ----------
const camposBarco = (b = {}) => `<div class="fg"><label>Barco *<input name="barco" required value="${esc(b.barco || '')}" placeholder="Marca, modelo y año"></label><label>Estado<select name="estado">${['En venta', 'Reservado', 'Vendido', 'Retirado'].map((x) => `<option${x === (b.estado || 'En venta') ? ' selected' : ''}>${x}</option>`).join('')}</select></label>
  <label>Vendedor<input name="vendedor" value="${esc(b.vendedor || '')}"></label><label>Teléfono<input name="telefono" inputmode="tel" value="${esc(b.telefono || '')}"></label><label>Email<input name="email" type="email" value="${esc(b.email || '')}"></label><label>Zona<input name="zona" value="${esc(b.zona || '')}" placeholder="p. ej. Costa Brava"></label>
  <label>Precio de venta (€)<input name="precio" inputmode="decimal" value="${b.precio || ''}"></label><label>Honorarios pactados (€, sin IVA)<input name="comision" inputmode="decimal" value="${b.comision || ''}"></label><label>Fecha de firma<input type="date" name="firma" value="${esc(b.firma || '')}"></label><label>Fin del encargo<input type="date" name="fin" value="${esc(b.fin || '')}"></label>
  <label>Tipo (para el cruce)<select name="tipo"><option value="">— de la ficha web —</option>${Object.entries(TIPOS_B).map(([k, t]) => `<option value="${k}"${b.tipo === k ? ' selected' : ''}>${t}</option>`).join('')}</select></label><label>Eslora (m)<input name="eslora" inputmode="decimal" value="${b.eslora || ''}" placeholder="p. ej. 8,4"></label>
  <label>Titulación mínima<select name="titulo"><option value="">— de la ficha web —</option>${TITULOS_B.map((t, i) => `<option value="${i}"${b.titulo === i ? ' selected' : ''}>${t}</option>`).join('')}</select></label><label>Zona (para el cruce)<select name="zonaKey"><option value="">—</option>${Object.entries(ZONAS_BB).map(([k, t]) => `<option value="${k}"${b.zonaKey === k ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
  <label style="grid-column:1/-1">Ficha en la web<input name="web" value="${esc(b.web || '')}" placeholder="www.platamarine.com/barcos/…"></label><label style="grid-column:1/-1">Notas<textarea name="notas" rows="3">${esc(b.notas || '')}</textarea></label></div>`;
const linkWeb = (u) => (u ? `https://${String(u).replace(/^https?:\/\//, '')}` : '');
// En el móvil las tablas .cst se ven como fichas: cada dato lleva el nombre de su columna
function etiquetas(el) { el.querySelectorAll('table.cst').forEach((t) => { const h = [...t.querySelectorAll('tr:first-child th')].map((x) => x.textContent); t.querySelectorAll('tr').forEach((r) => [...r.children].forEach((c, i) => { if (c.tagName === 'TD') c.dataset.l = h[i] || ''; })); }); }
// Miniatura del barco: sale de la ficha de la web (www.platamarine.com/barcos/slug o slug.html)
const fotoBarco = (web) => { const sl = (String(web || '').match(/platamarine\.com\/(?:[a-z]{2}\/)?(?:barcos\/)?([a-z0-9-]+?)(?:\.html)?\/?(?:[?#].*)?$/) || [])[1]; return sl && !['barcos', 'index'].includes(sl) ? `https://www.platamarine.com/${sl}-1-t.jpg` : ''; };
V.cartera = async (m) => {
  const list = await api('/admin/cartera'); m = shell('cartera');
  const act = list.filter((b) => !['Vendido', 'Retirado'].includes(b.estado)); const com = act.reduce((a, b) => a + (+b.comision || 0), 0);
  const vence = (b) => b.fin && Date.parse(b.fin) - Date.now() < 15 * DIA;
  m.innerHTML = top('Cartera · Plata Marine', 'Barcos con hoja de encargo firmada: datos, ficha de la web y toda su documentación.', '<button class="btn" id="nb">+ Añadir barco</button>') +
    `<div class="kp"><div class="card"><span>En cartera</span><b>${act.length}</b></div><div class="card"><span>Honorarios en cartera (+IVA)</span><b>${eur(com)}</b></div><div class="card"><span>Vendidos</span><b>${list.filter((b) => b.estado === 'Vendido').length}</b></div><div class="card"><span>Encargos que vencen en 15 días</span><b>${act.filter(vence).length}</b></div></div>` +
    (list.length ? list.map((b) => `<a class="card sec ld cb" href="#barco/${b.id}" style="color:inherit;text-decoration:none"><div class="cbf">${fotoBarco(b.web) ? `<img src="${fotoBarco(b.web)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div><div class="cbt"><div class="hd"><div><b>${esc(b.barco)}</b><span>${[b.vendedor, b.telefono, b.zona].filter(Boolean).map(esc).join(' · ')}</span><span>${b.precio ? eur(b.precio) : 'Sin precio'}${b.comision ? ' · honorarios ' + eur(b.comision) + ' + IVA' : ''}</span></div>${badge(String(b.estado || 'En venta').toLowerCase())}</div>
      <p class="mu sm">${b.firma ? 'Firmado el ' + fdate(b.firma) : 'Sin fecha de firma'}${b.fin ? ` · encargo hasta el ${fdate(b.fin)}${vence(b) ? ' <b style="color:var(--or)">(vence pronto)</b>' : ''}` : ''}${b.web ? ' · ' + esc(String(b.web).replace(/^https?:\/\//, '')) : ''}</p></div></a>`).join('') : '<div class="card mu">Todavía no hay barcos en la cartera.</div>');
  $('#nb').onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Añadir barco a la cartera</h3><form id="bf">${camposBarco()}<div class="row" style="justify-content:flex-end;margin-top:12px"><button type="button" class="btn g" id="bc">Cancelar</button><button class="btn">Añadir</button></div></form>`);
    dm.querySelector('#bc').onclick = () => dm.remove();
    dm.querySelector('#bf').onsubmit = guard(async (e) => { e.preventDefault(); const b = await api('/admin/cartera', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); dm.remove(); location.hash = '#barco/' + b.id; }); };
};
V.barco = async (m, id) => {
  const b = await api('/admin/cartera/' + id); m = shell('cartera');
  m.innerHTML = top(esc(b.barco), `${esc(b.vendedor || '')}${b.telefono ? ' · ' + esc(b.telefono) : ''}${b.web ? ` · <a href="${esc(linkWeb(b.web))}" target="_blank" rel="noopener" style="color:var(--or)">${esc(String(b.web).replace(/^https?:\/\//, ''))}</a>` : ''}`, `<a class="btn g" href="#cartera">Volver</a>${b.telefono ? `<a class="btn g" target="_blank" rel="noopener" href="${waLink(b.telefono)}">${IC.wa}WhatsApp</a>` : ''}`) +
    `<form id="bf" class="card sec"><h3 style="margin-bottom:12px">Datos del encargo</h3>${camposBarco(b)}<div class="row" style="justify-content:space-between;margin-top:12px"><button type="button" class="btn r s" id="bd">Quitar de la cartera</button><button class="btn">Guardar</button></div></form><div id="docs"></div>`;
  $('#bf').onsubmit = guard(async (e) => { e.preventDefault(); await api('/admin/cartera/' + id, { method: 'PUT', body: Object.fromEntries(new FormData(e.target)) }); toast('Guardado'); route(); });
  $('#bd').onclick = guard(async () => { if (!confirm('¿Quitar este barco de la cartera? Sus documentos se quedan guardados.')) return; await api('/admin/cartera/' + id, { method: 'DELETE' }); location.hash = '#cartera'; });
  docsBox($('#docs'), 'boat', id, {});
  encajanBox(id);
};
// ---------- Astilleros (Plata Marine): fabricantes contactados para representarlos en España ----------
const AST_E = { firm: ['Firmado', 'ok'], resp: ['Respondió', 'o'], sent: ['Enviado', 'b'], pausa: ['En pausa', 'x'], pend: ['Por enviar', 'w'], desc: ['Descartado', 'r'], perd: ['Perdido', 'r'] };
const AST_P = { A: 'Alta', M: 'Media', B: 'Baja' }; const AST_R = { eu: 'Unión Europea', 'no-ue': 'Fuera de la UE', cn: 'China' };
const AST_F = { e: '', p: '', r: '', q: '' };
const astBadge = (s) => { const [t, c] = AST_E[s] || [s || '—', 'x']; return `<span class="bg ${c}">${esc(t)}</span>`; };
const estrellas = (n) => n ? `<span style="color:var(--or);letter-spacing:1px" title="Interés ${n} de 5">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>` : '';
V.astilleros = async (m) => {
  const list = await api('/admin/astilleros'); m = shell('astilleros');
  const ord = Object.keys(AST_E); const cnt = (s) => list.filter((a) => a.s === s).length;
  const draw = () => {
    const q = AST_F.q.trim().toLowerCase();
    const L = list.filter((a) => (!AST_F.e || a.s === AST_F.e) && (!AST_F.p || a.p === AST_F.p) && (!AST_F.r || a.r === AST_F.r) && (!q || [a.n, a.c, a.t, a.tt, a.ch, a.nota, a.es].filter(Boolean).join(' ').toLowerCase().includes(q)))
      .sort((a, b) => ord.indexOf(a.s) - ord.indexOf(b.s) || (b.int || 0) - (a.int || 0) || 'AMB'.indexOf(a.p) - 'AMB'.indexOf(b.p) || (a.orden || 0) - (b.orden || 0));
    m.innerHTML = top('Astilleros · Plata Marine', 'Fabricantes contactados para representarlos en España: en qué punto está cada uno, su interés y las notas de cada contacto.', '<button class="btn" id="na">+ Añadir astillero</button>') +
      `<div class="kp"><div class="card"><span>Contactados</span><b>${list.length - cnt('pend')}</b></div><div class="card"><span>Acuerdos firmados</span><b>${cnt('firm')}</b></div><div class="card"><span>Han respondido</span><b>${cnt('resp')}</b></div><div class="card"><span>Esperando respuesta</span><b>${cnt('sent')}</b></div></div>
      <div class="filt">${[['', 'Todos', list.length], ...ord.map((k) => [k, AST_E[k][0], cnt(k)])].filter((x) => x[2]).map(([k, t, n]) => `<button data-e="${k}" class="${AST_F.e === k ? 'on' : ''}">${t} · ${n}</button>`).join('')}</div>
      <div class="row" style="margin-bottom:14px;flex-wrap:wrap"><input id="aq" type="search" placeholder="Buscar astillero, país, tipo de barco o nota" value="${esc(AST_F.q)}" style="flex:1;min-width:200px"><select id="ap" style="width:auto"><option value="">Toda prioridad</option>${Object.entries(AST_P).map(([k, t]) => `<option value="${k}"${AST_F.p === k ? ' selected' : ''}>Prioridad ${t.toLowerCase()}</option>`).join('')}</select><select id="ar" style="width:auto"><option value="">Todas las zonas</option>${Object.entries(AST_R).map(([k, t]) => `<option value="${k}"${AST_F.r === k ? ' selected' : ''}>${t}</option>`).join('')}</select></div>
      <p class="mu sm" style="margin:0 0 10px">${L.length} astillero${L.length === 1 ? '' : 's'}</p>
      <div class="card">${L.length ? L.map((a) => `<a class="li" href="#astillero/${encodeURIComponent(a.id)}" style="text-decoration:none"><div style="min-width:0"><b>${esc(a.n)} ${estrellas(a.int)}</b><span>${[a.c, a.tt || a.t].filter(Boolean).map(esc).join(' · ')}</span>${a.nota ? `<span style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(a.nota)}</span>` : ''}</div><div class="r">${astBadge(a.s)}<br><span>${a.p ? 'Prioridad ' + AST_P[a.p].toLowerCase() : ''}${a.fecha ? ' · ' + esc(a.fecha) : ''}</span></div></a>`).join('') : '<p class="mu">Ningún astillero con estos filtros.</p>'}</div>`;
    m.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => { AST_F.e = b.dataset.e; draw(); }));
    $('#ap').onchange = (e) => { AST_F.p = e.target.value; draw(); }; $('#ar').onchange = (e) => { AST_F.r = e.target.value; draw(); };
    let tq; $('#aq').oninput = (e) => { clearTimeout(tq); tq = setTimeout(() => { AST_F.q = e.target.value; draw(); const i = $('#aq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); };
    $('#na').onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Añadir astillero</h3><form id="af">${camposAst()}<div class="row" style="justify-content:flex-end;margin-top:12px"><button type="button" class="btn g" id="ac">Cancelar</button><button class="btn">Añadir</button></div></form>`);
      dm.querySelector('#ac').onclick = () => dm.remove();
      dm.querySelector('#af').onsubmit = guard(async (e) => { e.preventDefault(); const a = await api('/admin/astilleros', { method: 'POST', body: astForm(e.target) }); dm.remove(); location.hash = '#astillero/' + encodeURIComponent(a.id); }); };
  };
  draw();
};
const camposAst = (a = {}) => { const sel = (n, o, v) => `<select name="${n}">${Object.entries(o).map(([k, t]) => `<option value="${k}"${k === v ? ' selected' : ''}>${t}</option>`).join('')}</select>`; const inp = (n, t, ph = '') => `<label>${t}<input name="${n}" value="${esc(a[n] ?? '')}" placeholder="${ph}"></label>`;
  return `<div class="fg"><label>Astillero *<input name="n" required value="${esc(a.n || '')}"></label>${inp('c', 'País')}<label>Estado${sel('s', Object.fromEntries(Object.entries(AST_E).map(([k, v]) => [k, v[0]])), a.s || 'pend')}</label><label>Prioridad${sel('p', AST_P, a.p || 'M')}</label><label>Interés que muestran${sel('int', { '': 'Sin valorar', 1: '★ 1', 2: '★★ 2', 3: '★★★ 3', 4: '★★★★ 4', 5: '★★★★★ 5' }, String(a.int || ''))}</label><label>Zona${sel('r', AST_R, a.r || 'eu')}</label>${inp('g', 'Gama', 'Media, alta…')}${inp('fecha', 'Último contacto', '16 oct')}${inp('tt', 'Tipo (corto)', 'Semirrígidas')}${inp('rec', 'Volver a contactar', 'p. ej. 2028')}
  <label style="grid-column:1/-1">Barcos que fabrica<input name="t" value="${esc(a.t || '')}"></label><label style="grid-column:1/-1">Canal de contacto<input name="ch" value="${esc(a.ch || '')}" placeholder="Email · idioma · dirección"></label><label style="grid-column:1/-1">Presencia en España<input name="es" value="${esc(a.es || '')}"></label><label style="grid-column:1/-1">Motivo si se pierde o descarta<input name="mot" value="${esc(a.mot || '')}"></label>
  <label style="grid-column:1/-1;flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="conv" value="1" style="width:auto"${a.conv ? ' checked' : ''}> Conversación abierta con ellos</label>
  <label style="grid-column:1/-1">Notas<textarea name="nota" rows="7">${esc(a.nota || '')}</textarea></label></div>`; };
const astForm = (f) => { const o = Object.fromEntries(new FormData(f)); o.conv = !!f.querySelector('[name=conv]').checked; return o; };
V.astillero = async (m, id) => {
  const a = await api('/admin/astilleros/' + encodeURIComponent(decodeURIComponent(id))); m = shell('astilleros');
  const web = (String(a.nota || '').match(/https?:\/\/[^\s)]+/) || [])[0]; const mail = (String(a.ch || '').match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [])[0];
  m.innerHTML = top(esc(a.n), `${astBadge(a.s)} ${[a.c, a.p ? 'prioridad ' + AST_P[a.p].toLowerCase() : ''].filter(Boolean).map(esc).join(' · ')} ${estrellas(a.int)}`, `<a class="btn g" href="#astilleros">Volver</a>${mail ? `<a class="btn g" href="mailto:${esc(mail)}">Escribir</a>` : ''}${web ? `<a class="btn g" target="_blank" rel="noopener" href="${esc(web)}">Web</a>` : ''}`) +
    `<form id="af" class="card sec"><h3 style="margin-bottom:12px">Ficha del astillero</h3>${camposAst(a)}<div class="row" style="justify-content:space-between;margin-top:12px"><button type="button" class="btn r s" id="ad">Eliminar</button><button class="btn">Guardar</button></div></form>`;
  $('#af').onsubmit = guard(async (e) => { e.preventDefault(); await api('/admin/astilleros/' + encodeURIComponent(a.id), { method: 'PUT', body: astForm(e.target) }); toast('Guardado'); route(); });
  $('#ad').onclick = guard(async () => { if (!confirm('¿Eliminar este astillero de la lista?')) return; await api('/admin/astilleros/' + encodeURIComponent(a.id), { method: 'DELETE' }); location.hash = '#astilleros'; });
};
async function encajanBox(id) { // compradores con demanda activa que encajan con este barco
  const box = document.createElement('div'); box.className = 'card sec'; box.innerHTML = '<h3 style="margin-bottom:4px">Compradores que encajan</h3><p class="mu sm">Buscando…</p>'; $('#mn').appendChild(box);
  try { const r = await api('/admin/demandas/barco/' + encodeURIComponent('c:' + id));
    box.innerHTML = `<h3 style="margin-bottom:4px">Compradores que encajan · ${r.demandas.length}</h3><p class="mu sm" style="margin-bottom:10px">Demandas activas que cuadran con este barco. Tú decides a quién se lo ofreces según su gusto.</p>` +
      (r.demandas.length ? r.demandas.map((d) => `<div class="li"><div><a href="#demanda/${d.id}" style="color:var(--tx)"><b>${esc(d.nombre)}</b></a><span class="mu sm"> · ${d.pct} %${d.propuesto ? ' · ya propuesto' : ''}</span><br><span class="sm">${[...d.si, ...d.ojo.map((x) => '⚠ ' + x)].map(esc).join(' · ')}</span></div><div class="r">${d.telefono ? `<a class="btn g s" target="_blank" rel="noopener" href="${waLink(d.telefono)}">${IC.wa}</a>` : ''}</div></div>`).join('') : '<p class="mu">Ninguna demanda activa encaja ahora mismo.</p>');
  } catch (e) { box.innerHTML = '<h3>Compradores que encajan</h3><p class="mu">' + esc(e.message) + '</p>'; }
}
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

// Listado de marcas y modelos: así todos los coches se escriben igual (la variante va en «Versión»)
const MARCAS = {"Abarth":["500","595","695","124 Spider"],"Alfa Romeo":["Giulietta","Giulia","Stelvio","Tonale","MiTo","147","156","159","Brera","Spider"],"Aston Martin":["DB9","DB11","Vantage","DBX"],"Audi":["A1","A3","A4","A5","A6","A7","A8","Q2","Q3","Q4 e-tron","Q5","Q7","Q8","TT","R8","e-tron"],"Bentley":["Continental GT","Flying Spur","Bentayga"],"BMW":["Serie 1","Serie 2","Serie 3","Serie 4","Serie 5","Serie 6","Serie 7","X1","X2","X3","X4","X5","X6","X7","Z3","Z4","i3","i4","iX","iX3","M2","M3","M4"],"BYD":["Atto 3","Dolphin","Seal","Seal U"],"Chevrolet":["Aveo","Captiva","Cruze","Spark","Camaro","Corvette"],"Chrysler":["300C","Grand Voyager","PT Cruiser"],"Citroën":["C1","C3","C3 Aircross","C4","C4 Picasso","C4 Cactus","C5","C5 Aircross","Berlingo","Xsara Picasso","DS3","DS4","Jumpy","Jumper","Saxo","Xsara"],"Cupra":["Formentor","León","Born","Ateca","Terramar"],"Dacia":["Sandero","Sandero Stepway","Duster","Logan","Lodgy","Dokker","Jogger","Spring"],"DS":["DS 3","DS 4","DS 7","DS 9"],"Ferrari":["California","458","488","F8","Portofino","Roma","812"],"Fiat":["500","500X","500L","Panda","Punto","Grande Punto","Tipo","Doblò","Ducato","Bravo","Stilo","Qubo"],"Ford":["Fiesta","Focus","Mondeo","Kuga","Puma","EcoSport","C-Max","S-Max","Galaxy","Ka","Fusion","Transit","Transit Connect","Transit Custom","Ranger","Mustang","Mustang Mach-E","Tourneo Connect","Tourneo Custom"],"Honda":["Civic","Jazz","CR-V","HR-V","Accord","ZR-V","e"],"Hyundai":["i10","i20","i30","i40","Kona","Tucson","Santa Fe","Ioniq","Ioniq 5","Bayon","ix20","ix35","Getz","Matrix"],"Infiniti":["Q30","Q50","QX30","QX70"],"Jaguar":["XE","XF","XJ","F-Pace","E-Pace","I-Pace","F-Type","X-Type","S-Type"],"Jeep":["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Avenger","Willys"],"Kia":["Picanto","Rio","Ceed","ProCeed","XCeed","Stonic","Niro","Sportage","Sorento","Soul","Venga","Carens","EV6","Stinger"],"Lamborghini":["Huracán","Urus","Aventador"],"Land Rover":["Range Rover","Range Rover Sport","Range Rover Evoque","Range Rover Velar","Discovery","Discovery Sport","Defender","Freelander"],"Lexus":["CT","IS","ES","GS","NX","RX","UX","LBX"],"Maserati":["Ghibli","Levante","Quattroporte","Grecale","GranTurismo"],"Mazda":["2","3","5","6","CX-3","CX-30","CX-5","CX-60","MX-5","MX-30","RX-8"],"Mercedes-Benz":["Clase A","Clase B","Clase C","Clase CLA","Clase CLS","Clase E","Clase G","Clase GLA","Clase GLB","Clase GLC","Clase GLE","Clase GLS","Clase S","Clase SL","Clase SLK","Clase SLC","Clase M","Clase V","Vito","Sprinter","Citan","EQA","EQC"],"MG":["ZS","HS","MG4","MG3","Marvel R"],"Mini":["Mini","Cooper","Cooper S","One","Countryman","Clubman","Paceman","Cabrio","Cabrio Cooper S","John Cooper Works"],"Mitsubishi":["ASX","Outlander","Eclipse Cross","Space Star","Colt","L200","Montero"],"Nissan":["Micra","Note","Juke","Qashqai","Qashqai+2","X-Trail","Leaf","Pulsar","Almera","Navara","Primera","Patrol","Terrano","350Z","370Z"],"Opel":["Corsa","Astra","Insignia","Mokka","Crossland","Grandland","Zafira","Meriva","Adam","Karl","Combo","Vectra","Vivaro"],"Peugeot":["107","108","206","207","208","2008","306","307","307 SW","308","3008","407","408","5008","508","Partner","Rifter","Expert","Boxer","RCZ","1007"],"Porsche":["911","Boxster","Cayman","Cayenne","Macan","Panamera","Taycan"],"Renault":["Clio","Mégane","Captur","Kadjar","Austral","Arkana","Scénic","Grand Scénic","Laguna","Twingo","Kangoo","Trafic","Master","Talisman","Koleos","Zoe","Modus","Gran Modus","Espace","Fluence"],"Seat":["Ibiza","León","Arona","Ateca","Tarraco","Altea","Altea XL","Toledo","Mii","Alhambra","Exeo","Córdoba"],"Skoda":["Fabia","Octavia","Superb","Kamiq","Karoq","Kodiaq","Scala","Rapid","Yeti","Roomster","Citigo","Enyaq"],"Smart":["ForTwo","ForFour","#1"],"SsangYong":["Tivoli","Korando","Rexton","Kyron","Actyon"],"Subaru":["Impreza","Forester","Outback","XV","Legacy","BRZ"],"Suzuki":["Swift","Vitara","Grand Vitara","S-Cross","Ignis","Jimny","Baleno","SX4"],"Tesla":["Model 3","Model Y","Model S","Model X"],"Toyota":["Aygo","Aygo X","Yaris","Yaris Cross","Auris","Corolla","C-HR","RAV4","Prius","Prius+","Land Cruiser","Hilux","Avensis","Verso","GT86","Proace","Camry"],"Volkswagen":["Polo","Golf","Golf Plus","Golf Sportsvan","Passat","Passat CC","Arteon","T-Cross","T-Roc","Tiguan","Tiguan Allspace","Touareg","Touran","Sharan","Up!","Scirocco","Beetle","Jetta","Caddy","Transporter","Multivan","California","Crafter","Amarok","ID.3","ID.4"],"Volvo":["V40","V60","V90","S60","S90","XC40","XC60","XC90","C30","V50","V70"]};
const canon = (v, list) => { const n = (x) => String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\s-]+/g, ''); const k = n(v); return list.find((x) => n(x) === k) || (k === 'mercedes' ? 'Mercedes-Benz' : ''); };
V.coche = async (m, id) => {
  const isNew = id === 'nuevo';
  const [c, holders, cl, als, bus] = await Promise.all([isNew ? Promise.resolve({ images: [], features: [], status: 'disponible', featured: true }) : api('/admin/cars/' + id), api('/admin/holders'), isNew ? [] : api('/admin/clientes').catch(() => []), isNew ? [] : api('/admin/alertas').catch(() => []), isNew ? [] : api('/admin/busquedas').catch(() => [])]);
  m = shell('coches');
  let imgs = [...(c.images || [])];
  const sel = (n, opts, v) => `<select name="${n}">${opts.map((o) => (Array.isArray(o) ? o : [o, o])).map(([val, t]) => `<option value="${esc(val)}"${String(v ?? '') === String(val) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  const inp = (n, l, t = 'text', extra = '') => `<label>${l}<input name="${n}" type="${t}" value="${esc(c[n] ?? '')}" ${extra}></label>`;
  m.innerHTML = top(isNew ? 'Nuevo coche' : `${esc(c.brand)} ${esc(c.model)}`, isNew ? 'Rellena los datos y añade las fotos.' : `Ficha pública: <a href="${B}/vehiculos/${c.slug}" target="_blank" style="color:var(--or)">${B}/vehiculos/${c.slug}</a> · <a href="${B}/vehiculos/${c.slug}/cartel" target="_blank" style="color:var(--or)">Imprimir cartel (PDF)</a>`, `<a class="btn g" href="#coches">Volver</a>`) +
  `<form id="cf">
  <div class="card sec"><h3>Identificación</h3><div class="fg">${inp('brand', 'Marca *', 'text', 'required')}${inp('model', 'Modelo *', 'text', 'required')}${inp('version', 'Versión')}${inp('matricula', 'Matrícula (interno, no sale en la web)', 'text', 'autocapitalize="characters" style="text-transform:uppercase" placeholder="1234ABC"')}${inp('bastidor', 'Bastidor (interno, para el documento de reserva)', 'text', 'autocapitalize="characters" style="text-transform:uppercase" maxlength="17"')}${inp('llegada', 'Entrada en stock (fecha de compra)', 'date')}<label>De quién es (interno, no sale en la web)${sel('owner', [['', '— Sin asignar —'], 'Cristina', 'Juan'], c.owner)}</label></div></div>
  <div class="card sec"><h3>Datos principales</h3><div class="fg">${inp('year', 'Año *', 'number', 'min="1950" max="2100" required')}${inp('km', 'Kilómetros *', 'number', 'min="0" required')}${inp('price', 'Precio (€) *', 'number', 'min="0" required')}
  <label>Combustible *${sel('fuel', ['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico', 'GLP'], c.fuel || 'Gasolina')}</label><label>Cambio *${sel('trans', ['Manual', 'Automático'], c.trans || 'Manual')}</label><label>Carrocería${sel('body', [['', '—'], 'Berlina', 'Compacto', 'Familiar', 'SUV', 'Coupé', 'Cabrio', 'Monovolumen', 'Furgoneta', 'Pickup'], c.body)}</label>
  ${inp('cv', 'Potencia (CV)', 'number')}<label>Etiqueta DGT${sel('etiqueta', [['', 'Según la descripción'], 'CERO', 'ECO', 'C', 'B', ['SIN', 'Sin etiqueta']], c.etiqueta)}</label>${inp('doors', 'Puertas', 'number')}${inp('seats', 'Plazas', 'number')}${inp('color', 'Color')}</div></div>
  <div class="card sec"><h3>Financiación (uso interno)</h3><div class="fg">${inp('monthly', 'Cuota desde (€/mes)', 'number')}${inp('term', 'Plazo (meses)', 'number')}</div><p class="mu sm">No se muestra en la web: para publicar una cuota hay que poner también TIN, TAE y un ejemplo representativo (Ley 16/2011).</p></div>
  <div class="card sec"><h3>Reserva</h3><div class="fg"><label>Titular de las cuentas para la reserva${sel('holder', [['', '— Sin reserva —'], ...holders.map((h) => [h.id, `${h.name} · ${h.accounts.length} cuenta${h.accounts.length === 1 ? '' : 's'}`])], c.holder)}</label>${inp('reserve', 'Importe de la señal (€)', 'number')}</div><p class="mu sm">Si pones importe, la ficha muestra "Reserva este coche" y el cliente pide la reserva. Las cuentas no salen en la web: se las pasáis al confirmar.</p></div>
  <div class="card sec"><h3>Descripción y equipamiento</h3><div class="fg"><label class="s3">Descripción *<textarea name="desc" required rows="8">${esc(c.desc || '')}</textarea></label><label class="s3">Cómo lo vemos (opcional: vuestra opinión del coche, sale en la ficha)<textarea name="comment" rows="4">${esc(c.comment || '')}</textarea></label><label class="s3">Equipamiento (uno por línea)<textarea name="features" rows="8">${esc((c.features || []).join('\n'))}</textarea></label></div></div>
  <div class="card sec"><h3>Imágenes</h3><p class="mu sm" style="margin:-6px 0 12px">La primera es la portada (★ para cambiarla). Para ordenarlas, arrástralas (en el móvil, mantén pulsada la foto y muévela). Se reducen solas antes de subir.</p><div class="imgs" id="ig"></div><input type="file" id="fi" accept="image/*" multiple hidden></div>
  <div class="card sec"><h3>Vídeo</h3><p class="mu sm" style="margin:-6px 0 12px">Un vídeo por coche: sale en la ficha, debajo de los datos. Máximo 80 MB (mejor de menos de 1 minuto y grabado en 720p).</p><div id="vbx"></div><input type="file" id="vfi" accept="video/mp4,video/quicktime,video/webm,video/*" hidden></div>
  <div class="card sec"><h3>Visibilidad</h3><div class="row" style="gap:22px"><label>Estado${sel('status', [['disponible', 'Disponible'], ['preparacion', 'En preparación (próximamente)'], ['reservado', 'Reservado']], c.status)}</label>
  <label class="chk"><input type="checkbox" name="featured" ${c.featured ? 'checked' : ''}>Destacado en la portada</label><label class="chk"><input type="checkbox" name="hidden" ${c.hidden ? 'checked' : ''}>Ocultar de la web</label><label class="chk"><input type="checkbox" name="sold" ${c.sold ? 'checked' : ''}>Marcar como vendido</label><label class="chk"><input type="checkbox" name="gestion" ${c.gestion ? 'checked' : ''}>Gestión de venta (el coche no es nuestro: solo cobramos comisión)</label>${inp('comision', 'Comisión prevista (€, interno)', 'number', 'min="0"')}</div>
  ${isNew ? '' : `<label style="margin-top:12px;max-width:420px">Comprador (para el embudo de clientes)<select name="buyer"><option value="">—</option>${cl.map((x) => `<option value="${x.key}"${c.buyer === x.key ? ' selected' : ''}>${esc(x.nombre)} · ${esc(x.telefono)}</option>`).join('')}</select></label>`}</div>
  <div class="row" style="justify-content:flex-end"><a class="btn g" href="#coches">Cancelar</a><button class="btn" type="submit">${isNew ? 'Crear coche' : 'Guardar cambios'}</button></div></form>${isNew ? '' : holdedCard(c) + rotCard(c, cl) + interesados(c, als, bus) + historial(c)}`;
  let onImgs = null, imgsKey = JSON.stringify(imgs);
  const drawImgs = () => {
    if (onImgs && JSON.stringify(imgs) !== imgsKey) { imgsKey = JSON.stringify(imgs); onImgs(); }
    $('#ig').innerHTML = imgs.map((u, i) => `<div class="im"><img src="${esc(u)}" alt="">${i === 0 ? '<span class="bg o p">Portada</span>' : ''}<div class="t"><span><button type="button" data-m="${i}" data-d="-1">←</button> <button type="button" data-m="${i}" data-d="1">→</button>${i ? ` <button type="button" data-c="${i}" title="Poner de portada">★</button>` : ''}</span><button type="button" data-x="${i}">✕</button></div></div>`).join('') + `<div class="drop" id="dz">+ Añadir fotos<br><span class="sm">o arrástralas aquí</span></div>`;
    $('#ig').querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { const i = +b.dataset.m, j = i + +b.dataset.d; if (j < 0 || j >= imgs.length) return; [imgs[i], imgs[j]] = [imgs[j], imgs[i]]; drawImgs(); }));
    $('#ig').querySelectorAll('[data-c]').forEach((b) => (b.onclick = () => { const [x] = imgs.splice(+b.dataset.c, 1); imgs.unshift(x); drawImgs(); }));
    $('#ig').querySelectorAll('.im').forEach((el, i) => { el.draggable = true; el.ondragstart = (e) => e.dataTransfer.setData('text/x-i', String(i)); el.ondragover = (e) => e.preventDefault(); el.ondrop = (e) => { const f = e.dataTransfer.getData('text/x-i'); if (f === '') return; e.preventDefault(); e.stopPropagation(); const [x] = imgs.splice(+f, 1); imgs.splice(i, 0, x); drawImgs(); }; });
    $('#ig').querySelectorAll('[data-x]').forEach((b) => (b.onclick = () => { imgs.splice(+b.dataset.x, 1); drawImgs(); }));
    // En el móvil: mantener pulsada una foto un momento y arrastrarla a su sitio
    $('#ig').querySelectorAll('.im').forEach((el, i) => { let tm = 0, on = false, x0 = 0, y0 = 0, tg = -1;
      const clr = () => $('#ig').querySelectorAll('.im.ov').forEach((z) => z.classList.remove('ov'));
      el.addEventListener('touchstart', (e) => { if (e.target.closest('button')) return; const t = e.touches[0]; x0 = t.clientX; y0 = t.clientY; tg = -1;
        tm = setTimeout(() => { on = true; el.classList.add('dg'); navigator.vibrate?.(15); }, 220); }, { passive: true });
      el.addEventListener('touchmove', (e) => { const t = e.touches[0];
        if (!on) { if (Math.abs(t.clientX - x0) + Math.abs(t.clientY - y0) > 10) clearTimeout(tm); return; }
        e.preventDefault(); el.style.transform = `translate(${t.clientX - x0}px,${t.clientY - y0}px) scale(1.06)`;
        el.style.pointerEvents = 'none'; const o = document.elementFromPoint(t.clientX, t.clientY)?.closest('#ig .im'); el.style.pointerEvents = '';
        clr(); tg = o ? [...$('#ig').querySelectorAll('.im')].indexOf(o) : -1; if (o && o !== el) o.classList.add('ov');
        const r = t.clientY; if (r < 70) scrollBy(0, -12); else if (r > innerHeight - 70) scrollBy(0, 12); }, { passive: false });
      const fin = () => { clearTimeout(tm); if (!on) return; on = false; el.classList.remove('dg'); el.style.transform = ''; clr();
        if (tg >= 0 && tg !== i) { const [x] = imgs.splice(i, 1); imgs.splice(tg, 0, x); drawImgs(); } };
      el.addEventListener('touchend', fin); el.addEventListener('touchcancel', fin); });
    const dz = $('#dz'); dz.onclick = () => $('#fi').click();
    dz.ondragover = (e) => { e.preventDefault(); dz.style.borderColor = 'var(--or)'; }; dz.ondragleave = () => (dz.style.borderColor = '');
    dz.ondrop = (e) => { e.preventDefault(); add([...e.dataTransfer.files]); };
  };
  const add = guard(async (files) => { const dz = $('#dz'); dz.textContent = 'Subiendo…'; await upload(files, (u) => { imgs.push(u); }); drawImgs(); toast('Fotos subidas'); });
  $('#fi').onchange = (e) => add([...e.target.files]);
  drawImgs();
  // Vídeo: se sube por trozos de 4 MB con barra de progreso
  let vid = c.video || null, onVid = null;
  const drawVid = () => {
    $('#vbx').innerHTML = vid ? `<video src="${esc(vid.url)}" controls playsinline preload="metadata" style="width:100%;max-width:420px;border-radius:12px;background:#000;display:block"></video><div class="row" style="gap:10px;margin-top:10px"><button type="button" class="btn g sm" id="vch">Cambiar vídeo</button><button type="button" class="btn g sm" id="vdel">Quitar vídeo</button></div>`
      : '<button type="button" class="btn sm" id="vup">Subir vídeo</button>';
    const pick = () => $('#vfi').click();
    if ($('#vup')) $('#vup').onclick = pick; if ($('#vch')) $('#vch').onclick = pick;
    if ($('#vdel')) $('#vdel').onclick = () => { if (!confirm('¿Quitar el vídeo de este coche?')) return; vid = null; drawVid(); onVid && onVid(); };
  };
  $('#vfi').onchange = guard(async (e) => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (file.size > 80e6) throw new Error('El vídeo pesa más de 80 MB: grábalo en 720p o recórtalo.');
    const type = file.type || (/\.mov$/i.test(file.name) ? 'video/quicktime' : 'video/mp4');
    const st = await api('/admin/video/start', { method: 'POST', body: { type, size: file.size } });
    const bx = $('#vbx'); bx.innerHTML = '<div class="mu" id="vpr">Subiendo vídeo… 0 %</div>';
    for (let i = 0; i < st.n; i++) {
      const blob = file.slice(i * st.chunk, (i + 1) * st.chunk); let ok = false;
      for (let t = 0; t < 3 && !ok; t++) { const r = await fetch(`${API}/admin/video/chunk?key=${st.key}&i=${i}`, { method: 'POST', headers: { 'content-type': 'application/octet-stream', 'x-pg': '1' }, body: blob, credentials: 'same-origin' }).catch(() => null); ok = !!(r && r.ok); }
      if (!ok) { drawVid(); throw new Error('Se cortó la subida del vídeo. Prueba otra vez con buena conexión.'); }
      const p = $('#vpr'); if (p) p.textContent = `Subiendo vídeo… ${Math.round(((i + 1) / st.n) * 100)} %`;
    }
    vid = await api('/admin/video/end', { method: 'POST', body: { key: st.key, type, size: file.size } });
    drawVid(); toast('Vídeo subido'); onVid && onVid();
  });
  drawVid();
  if (!isNew) { const dv = document.createElement('div'); m.appendChild(dv); docsBox(dv, 'car', c.id, { venta: c.price, owner: c.owner }); }
  // Marca y modelo desde el listado (se corrigen solos al formato correcto)
  const fm = $('#cf'); const dlm = document.createElement('datalist'); dlm.id = 'dl-mod'; const dlb = document.createElement('datalist'); dlb.id = 'dl-mar'; dlb.innerHTML = Object.keys(MARCAS).map((b) => `<option value="${esc(b)}">`).join(''); fm.append(dlb, dlm);
  fm.brand.setAttribute('list', 'dl-mar'); fm.model.setAttribute('list', 'dl-mod'); fm.brand.autocomplete = fm.model.autocomplete = 'off';
  const mods = () => { const b = canon(fm.brand.value, Object.keys(MARCAS)); dlm.innerHTML = (MARCAS[b] || []).map((x) => `<option value="${esc(x)}">`).join(''); return b; };
  fm.brand.onchange = () => { const b = mods(); if (b) fm.brand.value = b; else if (fm.brand.value.trim()) toast('Esa marca no está en el listado: revisa cómo se escribe'); };
  fm.model.onchange = () => { const b = mods(); const v = canon(fm.model.value, MARCAS[b] || []); if (v) fm.model.value = v; };
  fm.brand.oninput = mods; mods();
  // Guardado automático: cualquier cambio en un coche ya creado se guarda solo a los 1,5 s (lo de vendido se sigue marcando a mano)
  if (fm.matricula) fm.matricula.addEventListener('input', () => { const p = fm.matricula.selectionStart; fm.matricula.value = fm.matricula.value.toUpperCase(); fm.matricula.setSelectionRange(p, p); });
  let tAuto = 0, lastAuto = '';
  const autoSave = () => { if (isNew) return; clearTimeout(tAuto); tAuto = setTimeout(async () => { if (!fm.checkValidity()) return; const d = Object.fromEntries(new FormData(fm)); ['featured', 'hidden', 'gestion'].forEach((k) => { if (fm[k]) d[k] = fm[k].checked; }); delete d.sold; d.images = imgs; d.video = vid; const k = JSON.stringify(d); if (k === lastAuto) return;
    try { await api('/admin/cars/' + id, { method: 'PUT', body: d }); lastAuto = k; toast('Guardado'); } catch (er) { toast('No se pudo guardar: ' + er.message); } }, 1500); };
  fm.addEventListener('input', (e) => { if (e.target.name !== 'sold') autoSave(); }); fm.addEventListener('change', (e) => { if (e.target.name !== 'sold') autoSave(); });
  onImgs = autoSave; onVid = autoSave;
  const hdb = $('#hdb'); if (hdb) hdb.onclick = guard(async () => { if (!confirm('¿Crear la factura de venta en Holded como borrador?')) return; hdb.disabled = true; hdb.textContent = 'Creando…'; try { const r = await api('/admin/holded/factura', { method: 'POST', body: { car: id } }); toast(`Factura creada en Holded (borrador, ${r.regimen})`); route(); } finally { hdb.disabled = false; hdb.textContent = 'Crear factura en Holded'; } });
  $('#cf').onsubmit = guard(async (e) => {
    e.preventDefault(); const f = e.target, b = f.querySelector('button[type=submit]'); b.disabled = true;
    try {
      const d = Object.fromEntries(new FormData(f)); ['featured', 'hidden', 'sold', 'gestion'].forEach((k) => (d[k] = f[k].checked)); d.images = imgs; d.video = vid;
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
// Factura de venta en Holded (solo coches de Juan, vendidos y con comprador): se crea en BORRADOR y se emite desde Holded
function holdedCard(c) { if (c.owner !== 'Juan' || !c.sold) return '';
  return `<div class="card sec"><h3>Factura en Holded</h3>${c.holdedId ? '<p class="sm" style="margin:6px 0 0">Creada en tu Holded como <b>borrador</b>. Revisa NIF y dirección del cliente y emítela desde Holded → Ventas → Facturas.</p>' : `<p class="mu sm" style="margin:6px 0 10px">Crea la factura de venta en tu Holded como borrador (cliente, coche, matrícula y precio; REBU con IVA 0 % y la frase legal, o IVA 21 % si la compra llevaba IVA). No se emite ni se envía nada.</p><button type="button" class="btn s" id="hdb"${c.buyer ? '' : ' disabled title="Asigna antes el comprador"'}>Crear factura en Holded</button>`}</div>`; }
function rotCard(c, cl) { if (c.sold) return ''; const r = rot(c, cl);
  const msg = r.nivel === 'r' ? `Lleva ${r.dias} días: está parado. ${r.dp >= 21 && r.siguiente ? `El precio no se toca desde hace ${r.dp} días: plantéate bajarlo a <b>${eur(r.siguiente)}</b>.` : 'Revisa fotos y anuncio.'}` : r.nivel === 'w' ? `Pasa de 45 días. ${r.leads < 3 ? 'Con pocos contactos: ' : ''}${r.dp >= 21 && r.siguiente ? `si esta semana no se mueve, el siguiente escalón es <b>${eur(r.siguiente)}</b>.` : 'Vigílalo esta semana.'}` : 'Va bien de tiempo.';
  return `<div class="card sec"${r.nivel ? ' style="border-color:' + (r.nivel === 'r' ? 'var(--bad)' : '#e0b341') + '"' : ''}><h3>Rotación</h3><div class="kp" style="margin:8px 0 10px"><div class="card"><span>Días en stock</span><b>${r.dias}</b></div><div class="card"><span>Contactos</span><b>${r.leads}</b></div><div class="card"><span>Sin tocar precio</span><b>${r.dp} d</b></div></div><p class="sm" style="margin:0">${msg}</p>${r.quien.length ? `<div style="margin-top:12px">${r.quien.map((x) => `<a class="li" href="#cliente/${x.key}" style="text-decoration:none;color:var(--tx)"><div><b>${esc(x.nombre || 'Sin nombre')}</b><span>${esc(x.telefono || '')} · ${esc(x.etapa || '')}${x.last ? ' · último contacto ' + fdate(x.last) : ''}</span></div><span class="mu">›</span></a>`).join('')}</div>` : ''}</div>`; }
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
const okAs = (a) => !!a && a !== 'undefined' && a !== 'null';
const mailRe = (x, key) => { const n = String(x.nombre || '').trim().split(' ')[0]; const sub = key === 'mensajes' && okAs(x.asunto) ? 'Re: ' + x.asunto : key === 'reservas' ? 'Tu cita en Plata Garage' : 'Tu consulta en Plata Garage'; return `mailto:${esc(x.email)}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent((n ? 'Hola ' + n : 'Hola') + ',\n\n')}`; };
function inbox({ key, path, title, sub, states, body, labels = {} }) {
  return async (m, arg) => {
    const [list, holders, cars] = await Promise.all([api('/admin/' + path), key === 'reservas' ? api('/admin/holders') : [], key === 'reservas' ? api('/admin/cars') : []]);
    m = shell(key); const f = arg || 'todas';
    if (key === 'reservas' && f === 'semana') return agenda(m, list);
    const shown = list.filter((x) => (f === 'todas' ? true : f === 'activas' ? !['cancelada', 'completada', 'cerrada', 'rechazado', 'respondido', 'comprado', 'vendido', 'descartado', 'denegada'].includes(x.status) : x.status === f));
    m.innerHTML = top(title, sub(list)) + `<div class="filt">${[...(key === 'reservas' ? [['semana', 'Agenda semanal']] : []), ['todas', 'Todas'], ['activas', 'Abiertas'], ...states.map((s) => [s, labels[s] || s[0].toUpperCase() + s.slice(1)])].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>` +
      (shown.map((x) => `<div class="card it" data-id="${x.id}"><div class="hd"><div><b style="font-size:16px">${esc(x.nombre)}</b>${x.propuesta ? ' <span class="bd" style="position:static;background:var(--or);color:#fff;padding:2px 8px;border-radius:999px;font-size:12px">Hora propuesta · confirmar</span>' : ''}<div class="meta">${x.email ? esc(x.email) + ' · ' : ''}<a href="tel:${esc(x.telefono)}">${esc(x.telefono)}</a> · recibido ${fdt(x.created)}</div></div>${badge(x.status)}</div>
      <div class="row" style="margin:14px 0;align-items:stretch">${body(x, { holders, cars })}</div>
      <label>Notas internas<textarea data-n rows="2" style="min-height:60px">${esc(x.notas || '')}</textarea></label>
      <div class="row" style="margin-top:12px"><select data-s style="width:auto">${states.map((s) => `<option value="${s}"${s === x.status ? ' selected' : ''}>${esc(labels[s] || s)}</option>`).join('')}</select><button class="btn s" data-sv>Guardar</button><a class="btn g s" target="_blank" rel="noopener" href="${waLink(x.telefono, 'Hola ' + x.nombre.split(' ')[0] + ', te escribimos de Plata Garage. ')}">Responder por WhatsApp</a>${key === 'reservas' && x.fecha >= new Date().toISOString().slice(0, 10) && x.status !== 'cancelada' ? `<a class="btn g s" target="_blank" rel="noopener" href="${recordatorio(x)}">${IC.wa}Recordar cita</a>` : ''}<a class="btn g s" href="#cliente/${String(x.telefono).replace(/\D/g, '').slice(-9)}">Ficha del cliente</a>${x.email ? `<a class="btn g s" href="${mailRe(x, key)}">Email</a>` : ''}<span style="flex:1"></span><button class="btn r s" data-del>Borrar</button></div></div>`).join('') || '<div class="card mu">No hay nada aquí todavía.</div>');
    m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = `#${key}/${b.dataset.f}`)));
    m.querySelectorAll('.it').forEach((el) => {
      const id = el.dataset.id;
      el.querySelector('[data-sv]').onclick = guard(async () => { const extra = key === 'mensajes' ? { leido: true } : {}; await api(`/admin/${path}/${id}`, { method: 'PUT', body: { status: el.querySelector('[data-s]').value, notas: el.querySelector('[data-n]').value, ...(el.querySelector('[data-o]') ? { oferta: el.querySelector('[data-o]').value } : {}), ...extra } }); toast('Guardado'); route(); });
      el.querySelector('[data-del]').onclick = guard(async () => { if (!confirm('¿Borrar esta solicitud? No se puede deshacer.')) return; await api(`/admin/${path}/${id}`, { method: 'DELETE' }); toast('Borrado'); route(); });
    });
    if (key === 'mensajes') list.filter((x) => !x.leido).forEach((x) => api(`/admin/mensajes/${x.id}`, { method: 'PUT', body: { leido: true } }).catch(() => {}));
  };
}
// Agenda de 7 días a partir de hoy (o de la semana elegida)
function agenda(m, list, off = 0) {
  const d0 = new Date(); d0.setDate(d0.getDate() + off * 7); const days = [...Array(7)].map((_, i) => { const d = new Date(d0); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); });
  m.innerHTML = top('Reservas', 'Agenda de los próximos 7 días.', `<button class="btn g" id="ap">‹ Anterior</button><button class="btn g" id="an">Siguiente ›</button>`) + `<div class="filt"><button class="on">Agenda semanal</button><button data-mes>Mes</button><button data-f="todas">Lista</button></div>
  <div class="ag">${days.map((d) => { const bs = list.filter((b) => b.fecha === d && b.status !== 'cancelada').sort((a, z) => a.hora.localeCompare(z.hora)); return `<div class="card"><h4>${new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}</h4>${bs.map((b) => `<div class="ev ${b.status}"><b>${b.hora}</b> ${esc(b.nombre)}<span>${esc(b.cocheNombre || b.motivo || '')}</span><div class="row" style="margin-top:6px">${badge(b.status)}<a class="btn g s" target="_blank" rel="noopener" href="${recordatorio(b)}">${IC.wa}Recordar</a></div></div>`).join('') || '<p class="mu sm">Sin citas</p>'}</div>`; }).join('')}</div>`;
  $('#ap').onclick = () => agenda(m, list, off - 1); $('#an').onclick = () => agenda(m, list, off + 1);
  m.querySelector('[data-f]').onclick = () => (location.hash = '#reservas/todas');
  m.querySelector('[data-mes]').onclick = () => mes(m, list, 0);
}
// Mes completo: cuadrícula de lunes a domingo con las citas de cada día
function mes(m, list, off = 0) {
  const n = new Date(); const d0 = new Date(n.getFullYear(), n.getMonth() + off, 1); const y = d0.getFullYear(), mo = d0.getMonth();
  const pad = (d0.getDay() + 6) % 7, dias = new Date(y, mo + 1, 0).getDate(), hoy = new Date().toLocaleDateString('sv-SE');
  const iso = (d) => `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const act = list.filter((b) => b.status !== 'cancelada');
  const celdas = [...Array(pad).fill(''), ...[...Array(dias)].map((_, i) => i + 1)];
  const tit = d0.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const nMes = act.filter((b) => (b.fecha || '').startsWith(iso(1).slice(0, 7))).length;
  m.innerHTML = top('Reservas', `${tit[0].toUpperCase() + tit.slice(1)} · ${nMes} cita${nMes === 1 ? '' : 's'}`, `<button class="btn g" id="ap">‹ Anterior</button><button class="btn g" id="an">Siguiente ›</button>`) +
    `<div class="filt"><button data-sem>Agenda semanal</button><button class="on">Mes</button><button data-f="todas">Lista</button></div>
    <div class="mes">${['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((x) => `<div class="mh">${x}</div>`).join('')}${celdas.map((d) => { if (!d) return '<div class="md v"></div>'; const bs = act.filter((b) => b.fecha === iso(d)).sort((a, z) => a.hora.localeCompare(z.hora)); return `<div class="md${iso(d) === hoy ? ' hoy' : ''}"><b>${d}</b>${bs.map((b) => `<a class="mc ${b.status}" href="#reservas/todas" title="${esc(b.nombre)} · ${esc(b.cocheNombre || b.motivo || '')}">${b.hora} ${esc(String(b.nombre).split(' ')[0])}</a>`).join('')}</div>`; }).join('')}</div>`;
  $('#ap').onclick = () => mes(m, list, off - 1); $('#an').onclick = () => mes(m, list, off + 1);
  m.querySelector('[data-sem]').onclick = () => agenda(m, list, 0);
  m.querySelector('[data-f]').onclick = () => (location.hash = '#reservas/todas');
}
const bx = (k, v) => `<div class="box2" style="flex:1;min-width:150px"><small>${k}</small>${v}</div>`;
V.reservas = inbox({ key: 'reservas', path: 'reservas', title: 'Reservas', sub: (l) => `${l.length} citas registradas · ${l.filter((x) => x.status === 'pendiente').length} pendientes`, states: ['pendiente', 'confirmada', 'cancelada', 'completada'],
  body: (x, { holders, cars }) => { const car = cars.find((c) => c.slug === x.coche); const h = car && holders.find((y) => y.id === car.holder);
    if (x.tipo === 'reserva' && x.res) return bx('Reserva web', `<b>${esc(x.cocheNombre || '')}</b><br>Señal: <b>${eur(x.senal || car?.reserve || 0)}</b><br>${x.status === 'confirmada' ? '<span style="color:#4ade80">Confirmada y documento enviado</span>' : x.status === 'cancelada' ? '<span class="mu">Cancelada</span>' : x.pagoAvisado ? `<span style="color:var(--or)"><b>Dice que ha pagado</b> (${fdt(x.pagoAvisado)}): revisa el banco</span>` : '<span class="mu">Aún no ha avisado del pago</span>'}`) +
      bx('Datos del cliente', `DNI/NIE ${esc(x.res.dni)}<br>${esc(x.res.direccion)}, ${esc(x.res.cp)} ${esc(x.res.poblacion)}`) + (x.mensaje ? bx('Comentario', esc(x.mensaje)) : '') +
      `<div class="row" style="flex-basis:100%;gap:8px;margin-top:4px">${x.status !== 'confirmada' && x.status !== 'cancelada' ? `<select data-rm="${x.id}" style="width:auto"><option value="Bizum">Pagado por Bizum</option><option value="transferencia">Pagado por transferencia</option></select><button class="btn s" data-rc="${x.id}">Pago recibido: confirmar y enviar documento</button><button class="btn r s" data-rn="${x.id}">No disponible</button>` : ''}<a class="btn g s" target="_blank" href="${API}/admin/reservas/${x.id}/documento">Ver documento</a></div>`;
    return bx('Fecha', `<b>${fdate(x.fecha)} · ${x.hora}</b>`) + bx('Motivo', esc(x.motivo)) + bx('Coche', x.coche ? `<a href="${B}/vehiculos/${x.coche}" target="_blank">${esc(x.cocheNombre)}</a>` : '—') + (x.mensaje ? bx('Comentario', esc(x.mensaje)) : '') +
      (x.tipo === 'reserva' && car ? bx('Para la señal', `${car.reserve ? eur(car.reserve) + ' · ' : ''}Bizum 660 49 32 28${h?.accounts?.length ? '<br>' + h.accounts.map((a) => `${esc(a.bank)}: ${esc(a.iban)}`).join('<br>') : ''}`) : ''); } });
// Vendedores: quien quiere vender su coche (tasaciones), como embudo con avisos de los que llevan días parados
const PASOS_V = { pendiente: ['Nuevo', 1], contactado: ['Contactado', 3], ofertado: ['Tasado (oferta enviada)', 5], visto: ['Visto en persona', 3], comprado: ['Comprado', 0], gestion: ['Gestión de venta', 30], vendido: ['Vendido', 0], descartado: ['Descartado', 0], cerrada: ['Cerrada', 0] };
const diasV = (x) => Math.floor((Date.now() - Date.parse(x.desde || x.created)) / DIA);
const paradoV = (x) => PASOS_V[x.status || 'pendiente'] && PASOS_V[x.status || 'pendiente'][1] && diasV(x) > PASOS_V[x.status || 'pendiente'][1];
V.valoraciones = inbox({ key: 'valoraciones', path: 'tasaciones', title: 'Vendedores', labels: Object.fromEntries(Object.entries(PASOS_V).map(([k, v]) => [k, v[0]])),
  sub: (l) => { const ab = l.filter((x) => !['comprado', 'vendido', 'descartado', 'cerrada'].includes(x.status)); const pa = ab.filter(paradoV).length; return `${ab.length} vendedor${ab.length === 1 ? "" : "es"} en marcha de ${l.length} solicitudes de tasación${pa ? ` · <b style="color:var(--or)">${pa} parado${pa > 1 ? 's' : ''} más días de la cuenta</b>` : ''}.`; },
  states: ['pendiente', 'contactado', 'ofertado', 'visto', 'comprado', 'gestion', 'vendido', 'descartado'],
  body: (x) => bx('Vehículo', `<b>${esc(x.marca)} ${esc(x.modelo)}</b>`) + bx('Año', x.anio || '—') + bx('Km', nf(x.km)) + bx('Combustible', esc(x.combustible || '—')) + (x.estado ? bx('Estado', esc(x.estado)) : '') + (x.parteDePago ? bx('Parte de pago de', esc(x.cocheNombre || '')) : '') + (x.notas_cliente ? bx('Observaciones', esc(x.notas_cliente)) : '')
    + bx('En este paso', `<span style="${paradoV(x) ? 'color:var(--or);font-weight:700' : ''}">${diasV(x)} día${diasV(x) === 1 ? '' : 's'}${paradoV(x) ? ' · toca moverlo' : ''}</span>`)
    + `<label style="min-width:160px">Oferta (€)<input data-o inputmode="numeric" value="${x.oferta || ''}" placeholder="0"></label>` });
V.envios = inbox({ key: 'envios', path: 'envios', title: 'Solicitudes de envío', sub: (l) => `${l.length} solicitudes de presupuesto de envío.`, states: ['pendiente', 'presupuesto enviado', 'aceptado', 'rechazado'],
  body: (x) => bx('Código postal', `<b>${esc(x.cp)}</b>`) + bx('Coche', x.coche ? `<a href="${B}/vehiculos/${x.coche}" target="_blank">${esc(x.cocheNombre)}</a>` : '—') });
// Financiación: los datos que pide la financiera, con un botón para copiarlos y pegarlos en su portal
const finTxt = (x) => { const d = x.fin || {}; return [`Nombre: ${x.nombre}`, `DNI/NIE: ${d.dni}`, `Estado civil: ${d.civil}`, `Móvil: ${x.telefono}`, `Email: ${x.email}`, `Dirección: ${d.direccion}, ${d.cp} ${d.poblacion}`, `Antigüedad laboral: ${d.antiguedad}`, `Salario neto: ${d.salario} €/mes`, `Vivienda: ${d.vivienda}${d.vivienda !== 'Sin gasto' ? ` (${d.gastoVivienda} €/mes)` : ''}`, x.cocheNombre ? `Coche: ${x.cocheNombre}${x.precio ? ' · ' + x.precio + ' €' : ''}` : ''].filter(Boolean).join('\n'); };
V.financiaciones = inbox({ key: 'financiaciones', path: 'financiaciones', title: 'Financiación', labels: { pendiente: 'Nueva', enviada: 'Enviada a financiera', aprobada: 'Aprobada', denegada: 'Denegada', cerrada: 'Cerrada' },
  sub: (l) => `${l.length} solicitud${l.length === 1 ? '' : 'es'} · ${l.filter((x) => x.status === 'pendiente').length} sin enviar a la financiera`, states: ['pendiente', 'enviada', 'aprobada', 'denegada', 'cerrada'],
  body: (x) => { const d = x.fin || {}; return bx('Coche', x.coche ? `<a href="${B}/vehiculos/${x.coche}" target="_blank">${esc(x.cocheNombre)}</a>${x.precio ? `<br>${eur(x.precio)}` : ''}` : 'Aún no lo sabe') + bx('Datos personales', `DNI/NIE <b>${esc(d.dni)}</b><br>${esc(d.civil)}<br>${esc(d.direccion)}, ${esc(d.cp)} ${esc(d.poblacion)}`)
    + bx('Trabajo y vivienda', `Antigüedad: <b>${esc(d.antiguedad)}</b><br>Neto: <b>${eur(d.salario)}/mes</b><br>${esc(d.vivienda)}${d.vivienda !== 'Sin gasto' ? `: <b>${eur(d.gastoVivienda)}/mes</b>` : ''}`)
    + bx('Nómina', (d.docs || []).length ? d.docs.map((f, i) => `<a href="${API}/admin/financiaciones/${x.id}/doc/${f.id}" target="_blank" rel="noopener">${/pdf/.test(f.mime) ? 'PDF' : 'Foto'} ${i + 1}</a>`).join('<br>') : '<span class="mu">No la ha subido</span>')
    + `<div class="row" style="flex-basis:100%;margin-top:4px"><button class="btn g s" type="button" data-cp="${esc(finTxt(x))}">Copiar datos para la financiera</button></div>`; } });
document.addEventListener('click', (e) => { const b = e.target.closest('[data-cp]'); if (!b) return; navigator.clipboard.writeText(b.dataset.cp).then(() => toast('Datos copiados'), () => toast('No se han podido copiar')); });
V.mensajes = inbox({ key: 'mensajes', path: 'mensajes', title: 'Mensajes', sub: (l) => `${l.length} mensajes recibidos.`, states: ['pendiente', 'respondido'],
  body: (x) => (okAs(x.asunto) ? bx('Asunto', esc(x.asunto)) : '') + bx('Mensaje', `<span style="white-space:pre-line">${esc(x.mensaje)}</span>`) });

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

// Analíticas de las webs de Plata Marine y Rotulito (contador propio de sus webs, solo con consentimiento de analítica)
const analiticasWeb = async (m, arg) => {
  const dias = +arg || 30; const st = await api(`/admin/stats?neg=${NEG}&dias=${dias}`); m = shell('visitas');
  const sum = (g) => { const o = {}; st.forEach((d) => Object.entries(d[g] || {}).forEach(([k, v]) => (o[k] = (o[k] || 0) + v))); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const T = Object.fromEntries(sum('tot')); const max = Math.max(1, ...st.map((d) => (d.tot || {}).visitas || 0));
  const tbl = (rows, f = (x) => esc(x), n = 10) => `<table>${rows.slice(0, n).map(([k, v]) => `<tr><td>${f(k)}</td><td style="text-align:right"><b>${v}</b></td></tr>`).join('') || `<tr><td class="mu">Sin datos todavía.</td></tr>`}</table>`;
  const card = (t, d, rows, f) => `<div class="card"><h3 style="margin-bottom:4px">${t}</h3>${d ? `<p class="mu sm" style="margin-bottom:10px">${d}</p>` : ''}${tbl(rows, f)}</div>`;
  const evf = (k) => { const [t, mm] = k.split('|'); return `${{ contacto: 'Contacto', lead: 'Formulario', novedades: 'Novedades' }[t] || esc(t)} · ${esc(mm)}`; };
  const canal = (() => { const vis = Object.fromEntries(sum('src')), con = Object.fromEntries(sum('contactosrc')), le = Object.fromEntries(sum('leadsrc')); const ks = [...new Set([...Object.keys(vis), ...Object.keys(con), ...Object.keys(le)])].sort((a, b) => ((le[b] || 0) + (con[b] || 0)) - ((le[a] || 0) + (con[a] || 0)) || (vis[b] || 0) - (vis[a] || 0));
    return ks.length ? `<table><tr><td class="mu sm">Canal</td><td class="mu sm" style="text-align:right">Visitas</td><td class="mu sm" style="text-align:right">Contactos</td><td class="mu sm" style="text-align:right">Formularios</td></tr>${ks.slice(0, 12).map((k) => `<tr><td>${esc(k)}</td><td style="text-align:right">${vis[k] || 0}</td><td style="text-align:right">${con[k] || 0}</td><td style="text-align:right"><b>${le[k] || 0}</b></td></tr>`).join('')}</table>` : '<p class="mu">Sin datos todavía.</p>'; })();
  const marine = NEG === 'marine';
  m.innerHTML = top('Visitas web', `Visitas y contactos de ${marine ? 'www.platamarine.com' : 'www.rotulito.com'}, solo de quien acepta la analítica y sin datos personales.`, `<div class="filt" style="margin:0">${[7, 30, 90].map((d) => `<button data-d="${d}" class="${d === dias ? 'on' : ''}">${d} días</button>`).join('')}</div>`) +
  `<div class="kp"><div class="card"><span>Visitas (entradas a la web)</span><b>${nf(T.nuevas || 0)}</b></div><div class="card"><span>Páginas vistas</span><b>${nf(T.visitas || 0)}</b></div><div class="card"><span>Contactos (WhatsApp, teléfono, email)</span><b>${T.contacto || 0}</b></div><div class="card"><span>Formularios enviados</span><b>${T.lead || 0}</b></div>${marine ? `<div class="card"><span>Altas a novedades</span><b>${T.novedades || 0}</b></div>` : ''}</div>
  <div class="card sec"><h3 style="margin-bottom:14px">Páginas vistas por día</h3><div style="display:flex;align-items:flex-end;gap:3px;height:140px">${st.map((d) => { const v = (d.tot || {}).visitas || 0; return `<div title="${fdate(d.d)}: ${v}" style="flex:1;background:var(--or);opacity:${v ? 1 : .15};height:${Math.max(2, v / max * 100)}%;border-radius:3px 3px 0 0"></div>`; }).join('')}</div></div>
  <div class="two"><div class="card"><h3 style="margin-bottom:4px">Qué canal trae clientes</h3><p class="mu sm" style="margin-bottom:10px">Visitas, contactos y formularios por origen.</p>${canal}</div>${card('Contactos por tipo', '', sum('ev'), evf)}</div>
  ${marine ? `<div class="two" style="margin-top:16px">${card('Lo que buscan en los filtros', 'Combinaciones de filtros del catálogo de barcos.', sum('filtro'))}${card('Filtros sin ningún barco', 'Lo que piden y no tienes en cartera: pistas de qué barcos captar.', sum('filtro0'))}</div>
  <div class="two" style="margin-top:16px">${card('Lo que escriben en el buscador', '', sum('q'))}${card('Búsquedas sin resultado', '', sum('q0'))}</div>
  <div class="two" style="margin-top:16px">${card('Barcos más vistos', '', sum('boat'))}${card('¿Qué te falta para decidirte?', 'Respuestas de las fichas.', sum('falta'))}</div>`
  : `<div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Embudo de la web</h3><p class="mu sm" style="margin-bottom:12px">De la visita al formulario, los últimos ${dias} días.</p>${(() => { const E = Object.fromEntries(sum('embudo')); const pasos = [['Entradas a la web', T.nuevas || 0], ['Vieron el precio', E.precio || 0], ['Vieron los ejemplos', E.demos || 0], ['Empezaron el formulario', E.form_inicio || 0], ['Lo dejaron a medias', E.form_abandono || 0], ['Enviaron el formulario', T.lead || 0]]; const mx = Math.max(1, ...pasos.map((p) => p[1]));
    return pasos.map(([t, v]) => `<div style="margin:6px 0"><div class="row" style="justify-content:space-between"><span>${t}</span><b>${nf(v)}</b></div><div style="height:8px;border-radius:6px;background:var(--line);margin-top:4px"><div style="height:8px;border-radius:6px;background:var(--or);width:${Math.max(1, Math.round((v / mx) * 100))}%"></div></div></div>`).join(''); })()}</div>`}
  <div class="two" style="margin-top:16px">${card('Páginas más vistas', '', sum('pv'))}${card('Idioma', '', sum('lang'), (k) => ({ es: 'Castellano', ca: 'Catalán', en: 'Inglés', fr: 'Francés' }[k] || esc(k)))}</div>
  <div class="two" style="margin-top:16px">${card('Ciudades (aproximadas)', '', sum('city'))}${card('Dispositivos', '', sum('dev'))}</div>
  <p class="mu sm" style="margin-top:14px">Solo cuenta a quien acepta la analítica en el aviso de cookies, así que es menos que Google Analytics. No se guarda la IP ni nada que identifique a nadie; de lo que se escribe en el buscador se quitan los números largos.</p>`;
  m.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => (location.hash = '#visitas/' + b.dataset.d)));
};

V.analiticas = async (m, arg) => {
  const dias = +arg || 30; const [st, cars, cls] = await Promise.all([api('/admin/stats?dias=' + dias), api('/admin/cars'), api('/admin/clientes').catch(() => [])]); m = shell('analiticas');
  const sum = (g) => { const o = {}; st.forEach((d) => Object.entries(d[g] || {}).forEach(([k, v]) => (o[k] = (o[k] || 0) + v))); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const tot = st.reduce((a, d) => a + ((d.tot || {}).visitas || 0), 0); const ent = st.reduce((a, d) => a + ((d.tot || {}).nuevas || 0), 0); const ev = Object.fromEntries(sum('ev'));
  const forms = Object.entries(ev).filter(([k]) => k.startsWith('form-')).reduce((a, [, v]) => a + v, 0);
  const max = Math.max(1, ...st.map((d) => (d.tot || {}).visitas || 0));
  const nm = (slug) => { const c = cars.find((x) => x.slug === slug); return c ? `${c.brand} ${c.model} ${c.version || ''} (${c.year})` : slug; };
  const tbl = (rows, h1, h2, f = (x) => esc(x)) => `<table>${rows.slice(0, 10).map(([k, v]) => `<tr><td>${f(k)}</td><td style="text-align:right"><b>${v}</b></td></tr>`).join('') || `<tr><td class="mu">Sin datos todavía.</td></tr>`}</table>`;
  m.innerHTML = top('Analíticas', 'Visitas y contactos de la web, sin cookies ni datos personales.', `<div class="filt" style="margin:0">${[7, 30, 90].map((d) => `<button data-d="${d}" class="${d === dias ? 'on' : ''}">${d} días</button>`).join('')}${ROL === 'admin' ? '<button id="stReset" title="Borra todas las visitas contadas hasta hoy">Reiniciar</button>' : ''}</div>`) +
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
  ${(() => { // Prueba del comparador: ¿ayuda a vender o distrae?
    const t = Object.fromEntries(sum('tot')), n = t.comparaciones || 0, k = t.cmpcontacto || 0;
    const par = sum('cmppar').map(([p, v]) => [p.split('+').map(nm).join(' vs '), v]);
    return `<div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Comparador (prueba de un mes)</h3><p class="mu sm" style="margin-bottom:12px">Cuenta desde el cambio a www.platagarage.com. Comparaciones hechas desde Favoritos y cuántas acaban en "Pedir cita" o WhatsApp desde el propio comparador. Últimos ${dias} días.</p><div class="kp"><div class="card"><span>Comparaciones</span><b>${nf(n)}</b></div><div class="card"><span>Contactos desde el comparador</span><b>${nf(k)}</b></div><div class="card"><span>% que contacta</span><b>${n ? Math.round((k / n) * 1000) / 10 + ' %' : '—'}</b></div></div><div class="two" style="margin-top:12px"><div><h4 style="margin:0 0 8px">Qué coches comparan</h4>${tbl(par)}</div><div><h4 style="margin:0 0 8px">A qué coche piden cita</h4>${tbl(sum('cmpcar'), '', '', nm)}</div></div></div>`; })()}
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:4px">Contactos por página de entrada</h3><p class="mu sm" style="margin-bottom:10px">Formularios y avisos enviados desde cada página, y qué % de sus visitas acaba contactando.</p>${(() => { const pvs = Object.fromEntries(sum('pv')); const rows = sum('lp'); return rows.length ? `<table>${rows.slice(0, 12).map(([k, v]) => `<tr><td>${esc(k.replace(/^\/platagarage/, '') || '/')}</td><td style="text-align:right"><b>${v}</b></td><td style="text-align:right" class="mu">${pvs[k] ? Math.round((v / pvs[k]) * 1000) / 10 + ' %' : ''}</td></tr>`).join('')}</table>` : '<p class="mu">Sin contactos todavía.</p>'; })()}</div><div class="card"><h3 style="margin-bottom:4px">Contactos por canal</h3><p class="mu sm" style="margin-bottom:10px">De dónde venía quien nos dejó sus datos (Google, Instagram, directo…).</p>${tbl(sum('lsrc'))}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:10px">Páginas más vistas</h3>${tbl(sum('pv'))}</div><div class="card"><h3 style="margin-bottom:10px">Formularios por tipo</h3>${tbl(Object.entries(ev).filter(([k]) => k.startsWith('form-')).map(([k, v]) => [k.slice(5), v]))}</div></div>
  <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:10px">Ciudades (aproximadas)</h3>${tbl(sum('city'))}</div><div class="card"><h3 style="margin-bottom:10px">Dispositivos</h3>${tbl(sum('dev'))}</div></div>
  ${cwvHtml(sum('cwv'))}
  <p class="mu sm" style="margin-top:14px">Sin cookies ni datos personales: no se guarda la IP ni nada que identifique a nadie. Las ciudades salen de la conexión y son aproximadas.</p>`;
  m.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => (location.hash = '#analiticas/' + b.dataset.d)));
  const rs = m.querySelector('#stReset'); if (rs) rs.onclick = guard(async () => { if (!confirm('¿Borrar todas las analíticas de la web contadas hasta hoy? No se puede deshacer.')) return; await api('/admin/stats', { method: 'DELETE' }); toast('Analíticas reiniciadas'); route(); });
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
  const B = { date: '', hrs: new Set(), all: false, reason: '' };
  const abrir = (date) => { const bl = (s.blocks || []).filter((b) => b.date === date); B.date = date; B.all = bl.some((b) => b.allDay); B.hrs = new Set(bl.flatMap((b) => b.hours || [])); B.reason = (bl.find((b) => b.reason) || {}).reason || ''; draw(); $('#bk').scrollIntoView({ block: 'nearest' }); };
  const draw = () => {
    m.innerHTML = top('Horarios', 'Configura las horas disponibles para reservar cita y bloquea días u horas concretas cuando lo necesites.') +
    `<div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Horario semanal</h3><span class="mu sm">Click en una hora para eliminarla.</span></div><div class="days">${ORDER.map((d) => `<div class="card"><div class="row" style="justify-content:space-between"><b>${DAYS[d]}</b><span class="row"><select data-cp="${d}" style="width:auto;padding:5px 10px"><option value="">Copiar a…</option>${ORDER.filter((x) => x !== d).map((x) => `<option value="${x}">${DAYS[x]}</option>`).join('')}<option value="all">Todos los días laborables</option></select></span></div>
    <div class="hrs">${(s.week[d] || []).map((h) => `<button data-d="${d}" data-h="${h}" title="Quitar">${h}</button>`).join('') || '<span class="mu sm">Cerrado — sin horarios configurados.</span>'}</div><div class="row"><input type="time" data-in="${d}" step="900" style="flex:1"><button class="btn g s" data-ad="${d}">+ Añadir</button></div></div>`).join('')}</div>
    <div class="two" style="margin-top:16px"><div class="card" id="bk"><h3 style="margin-bottom:4px">Bloquear día u horas</h3><p class="mu sm" style="margin:0 0 12px">Elige el día y toca las horas que <b>no</b> quieres que salgan en la web. Las marcadas en rojo quedan bloqueadas.</p>
    <div class="dsel">${Array.from({ length: 21 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); const k = d.toLocaleDateString('sv-SE'); const n = (s.week[d.getDay()] || []).length; const bl = (s.blocks || []).filter((b) => b.date === k); return `<button type="button" data-dd="${k}" class="${B.date === k ? 'on' : ''}${!n ? ' off' : ''}${bl.length ? ' bl' : ''}"><small>${DAYS[d.getDay()].slice(0, 3)}</small><b>${d.getDate()}</b></button>`; }).join('')}</div>
    <label style="margin-top:10px">O elige otra fecha<input type="date" id="bd" value="${B.date}"></label>
    ${B.date ? (() => { const hrs = s.week[new Date(B.date + 'T12:00').getDay()] || []; return hrs.length ? `<div class="row" style="margin:12px 0 8px;flex-wrap:wrap"><b style="flex:1 1 100%">${new Date(B.date + 'T12:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase())}</b><button type="button" class="btn g s" data-bq="m">Toda la mañana</button><button type="button" class="btn g s" data-bq="t">Toda la tarde</button><button type="button" class="btn g s" data-bq="all">Todo el día</button><button type="button" class="btn g s" data-bq="0">Ninguna</button></div><div class="row" style="margin:0 0 8px;flex-wrap:wrap;align-items:center"><span class="sm mu">Bloquear de</span><input type="time" id="rd" step="900" value="10:00" style="width:auto"><span class="sm mu">a</span><input type="time" id="ra" step="900" value="14:00" style="width:auto"><button type="button" class="btn g s" id="rb">Marcar</button></div><div class="hrs hb">${hrs.map((h) => `<button type="button" data-bh="${h}" class="${B.all || B.hrs.has(h) ? 'x' : ''}">${h}</button>`).join('')}</div>` : `<p class="mu sm" style="margin:12px 0">${fdate(B.date)}: ese día ya está cerrado en el horario semanal.</p>`; })() + `<label style="margin-top:10px">Motivo (opcional)<input id="br" maxlength="120" value="${esc(B.reason)}"></label><button class="btn" id="bs" style="margin-top:12px;width:100%">Guardar este día</button>` : ''}</div>
    <div class="card"><h3 style="margin-bottom:12px">Próximos bloqueos</h3>${(s.blocks || []).sort((a, b) => a.date.localeCompare(b.date)).map((b, i) => `<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:8px 0"><span style="cursor:pointer" data-dd="${b.date}" title="Editar"><b>${fdate(b.date)}</b> · ${b.allDay ? 'todo el día' : b.hours.join(', ')}${b.reason ? ` <span class="mu">(${esc(b.reason)})</span>` : ''}</span><button class="btn r s" data-xb="${b.id}">Quitar</button></div>`).join('') || '<p class="mu">No hay días bloqueados próximamente.</p>'}</div></div>`;
    m.insertAdjacentHTML('beforeend', ic.url ? `<div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:6px">Ver las citas en tu móvil</h3><p class="mu" style="margin:0 0 12px">Suscribe tu calendario a este enlace y las citas de la web aparecerán solas en tu agenda (se actualiza cada poco). Es privado: no lo compartas.</p>
    <div class="row"><input id="icu" readonly value="${esc(ic.url)}" style="flex:1;min-width:240px"><button class="btn g" id="icc">${IC.copy}Copiar</button><a class="btn g" href="${esc(ic.url.replace(/^https?:/, 'webcal:'))}">Abrir en el calendario</a></div>
    <details style="margin-top:12px"><summary class="sm" style="cursor:pointer">Cómo hacerlo</summary><p class="sm mu"><b>iPhone:</b> pulsa "Abrir en el calendario" desde el iPhone y acepta "Suscribirse".<br><b>Google Calendar (Android o PC):</b> en calendar.google.com, en el ordenador: "Otros calendarios" → "+" → "Desde URL" → pega el enlace → "Añadir calendario". Google tarda unas horas en refrescar los cambios.</p></details></div>` : '');
    if ($('#icc')) $('#icc').onclick = () => { navigator.clipboard.writeText($('#icu').value).then(() => toast('Enlace copiado')); };
    m.querySelectorAll('.hrs:not(.hb) button').forEach((b) => (b.onclick = () => { s.week[b.dataset.d] = s.week[b.dataset.d].filter((h) => h !== b.dataset.h); save('Hora quitada'); }));
    m.querySelectorAll('[data-ad]').forEach((b) => (b.onclick = () => { const v = m.querySelector(`[data-in="${b.dataset.ad}"]`).value; if (!v) return; s.week[b.dataset.ad] = [...(s.week[b.dataset.ad] || []), v]; save('Hora añadida'); }));
    m.querySelectorAll('[data-cp]').forEach((sel) => (sel.onchange = () => { const from = sel.dataset.cp, to = sel.value; if (!to) return; (to === 'all' ? [1, 2, 3, 4, 5] : [to]).forEach((d) => { if (String(d) !== from) s.week[d] = [...s.week[from]]; }); save('Horario copiado'); }));
    m.querySelectorAll('[data-dd]').forEach((b) => (b.onclick = () => abrir(b.dataset.dd)));
    $('#bd').onchange = (e) => e.target.value && abrir(e.target.value);
    const hrsDia = () => s.week[new Date(B.date + 'T12:00').getDay()] || [];
    if ($('#br')) $('#br').oninput = (e) => (B.reason = e.target.value);
    m.querySelectorAll('[data-bh]').forEach((b) => (b.onclick = () => { const h = b.dataset.bh; if (B.all) { B.all = false; B.hrs = new Set(hrsDia()); } B.hrs.has(h) ? B.hrs.delete(h) : B.hrs.add(h); b.classList.toggle('x', B.hrs.has(h)); }));
    m.querySelectorAll('[data-bq]').forEach((b) => (b.onclick = () => { const q = b.dataset.bq, H = hrsDia(); B.all = q === 'all'; if (q === '0') B.hrs = new Set(); else if (q === 'm') H.filter((h) => h < '14:00').forEach((h) => B.hrs.add(h)); else if (q === 't') H.filter((h) => h >= '14:00').forEach((h) => B.hrs.add(h)); draw(); }));
    if ($('#rb')) $('#rb').onclick = () => { const d = $('#rd').value, h2 = $('#ra').value; if (!d || !h2 || h2 <= d) return toast('Pon una hora de inicio y otra de fin posterior', true); B.all = false; hrsDia().filter((h) => h >= d && h < h2).forEach((h) => B.hrs.add(h)); draw(); };
    if ($('#bs')) $('#bs').onclick = () => { const H = hrsDia(); const all = B.all || (H.length && H.every((h) => B.hrs.has(h))); const otros = (s.blocks || []).filter((x) => x.date !== B.date);
      s.blocks = all || B.hrs.size ? [...otros, { date: B.date, allDay: !!all, hours: all ? [] : [...B.hrs].sort(), reason: B.reason }] : otros; save(all ? 'Día cerrado' : B.hrs.size ? 'Horas bloqueadas' : 'Día sin bloqueos'); };
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

// ---------- embudos: lo común a los tres negocios ----------
const DIA = 864e5;
const diasDesde = (iso) => (iso ? Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / DIA)) : 0);
// Días máximos en cada paso: si se pasan, la tarjeta avisa
const MAXD = {
  garage: { nuevo: 1, contactado: 7, visitado: 3, financiera: 7, reserva: 7, vendido: 3, transferencia: 3, entregado: 15, permiso: 3, enviado: 10 },
  marine: { 'Nuevo': 1, 'Contactado': 5, 'Visita': 7, 'Oferta': 5, 'Señal': 10, 'Prueba de mar / peritaje': 15, 'Aceptación': 7, 'Pago y contrato': 10, 'Titularidad': 30, 'Entrega': 10, 'Documentación enviada': 15, 'Primer contacto': 2, 'Hoja y guía enviadas': 3, 'Hoja firmada': 7, 'Fotos recibidas': 3, 'Publicado': 30, 'Con interesados': 30 },
  rotulito: { 'Nuevo': 1, 'Contactado': 3, 'Presupuesto enviado': 5, 'Aceptado y señal': 7, 'Contenido recibido': 5, 'En desarrollo': 10, 'Revisión del cliente': 7, 'Publicada': 15 },
};
function avisos(c, neg, nombre = (e) => e) {
  const out = []; const f = c.fechas || {}; const max = MAXD[neg][c.etapa]; const d = diasDesde(c.desde);
  if (max && d > max) out.push(`${d} días en "${nombre(c.etapa)}" (máx. ${max})`);
  if (neg === 'garage') {
    if (f.transferencia && ['transferencia', 'entregado', 'permiso'].includes(c.etapa) && diasDesde(f.transferencia) > 15) out.push(`Permiso sin enviar: ${diasDesde(f.transferencia)} días desde la transferencia`);
    if (c.etapa === 'financiera' && c.finEstado === 'denegada') out.push('Financiación denegada: otro banco o márcalo como perdido');
  }
  if (neg === 'marine' && f['Pago y contrato'] && ['Pago y contrato', 'Titularidad'].includes(c.etapa)) { const x = diasDesde(f['Pago y contrato']); if (x > 75) out.push(x > 90 ? `Capitanía: plazo de 3 meses vencido (${x} días)` : `Capitanía: el plazo de 3 meses vence en ${90 - x} días`); }
  if (neg === 'rotulito' && f['Publicada'] && c.etapa !== 'Perdido') { const x = diasDesde(f['Publicada']); if (x >= 335 && x % 365 >= 335) out.push('Renovar el dominio: la web cumple un año'); }
  return out;
}
// Al pasar a "Perdido" el motivo es obligatorio
const pedirMotivo = (motivos) => new Promise((res) => {
  const dm = modal(`<h3 style="margin-bottom:6px">¿Por qué se ha perdido?</h3><p class="mu sm" style="margin:0 0 12px">Es obligatorio: con los motivos sabremos dónde se escapan las ventas.</p><form id="mf" class="fg" style="grid-template-columns:1fr"><div class="filt" style="margin:0">${motivos.map((x) => `<button type="button" data-m="${esc(x)}">${esc(x)}</button>`).join('')}</div><label>Detalle<input name="t" maxlength="200" placeholder="Opcional (obligatorio si eliges Otro)"></label><div class="row" style="justify-content:flex-end"><button type="button" class="btn g" id="mc">Cancelar</button><button class="btn" id="mok" disabled>Marcar como perdido</button></div></form>`);
  let sel = ''; const fin = (v) => { dm.remove(); res(v); };
  dm.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { sel = b.dataset.m; dm.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === b)); $('#mok', dm).disabled = false; }));
  $('#mc', dm).onclick = () => fin(null); dm.onclick = (e) => { if (e.target === dm) fin(null); };
  $('#mf', dm).onsubmit = (e) => { e.preventDefault(); const t = e.target.t.value.trim(); if (!sel) return; if (sel === 'Otro' && !t) { toast('Escribe el motivo en el detalle', true); return; } fin({ motivo: sel, motivoTxt: t }); };
});
// Número de certificado de Correos al enviar el permiso o la documentación
const pedirCertificado = (tit, actual = '') => new Promise((res) => {
  const dm = modal(`<h3 style="margin-bottom:6px">${esc(tit)}</h3><p class="mu sm" style="margin:0 0 12px">Apunta el número del certificado de Correos para poder seguir el envío.</p><form id="cf" class="fg" style="grid-template-columns:1fr"><label>Número de certificado<input name="n" maxlength="40" value="${esc(actual)}" placeholder="p. ej. CD012345678ES"></label><div class="row" style="justify-content:flex-end"><button type="button" class="btn g" id="cx">Cancelar</button><button class="btn">Guardar</button></div></form>`);
  const fin = (v) => { dm.remove(); res(v); };
  $('#cx', dm).onclick = () => fin(null); dm.onclick = (e) => { if (e.target === dm) fin(null); };
  $('#cf', dm).onsubmit = (e) => { e.preventDefault(); fin(e.target.n.value.trim()); };
});
// Tablero de columnas (arrastrar en ordenador, selector en el móvil)
function tablero(el, cols, items, o) {
  el.innerHTML = cols.map(([k, t]) => { const cs = items.filter((c) => o.col(c) === k); return `<div class="col" data-e="${esc(k)}"><h4>${esc(t)} <span>${cs.length}</span></h4>${cs.map((c) => { const av = o.avisos(c); return `<div class="kc${av.length ? ' at' : ''}" draggable="true" data-k="${esc(o.id(c))}"><a href="${o.href(c)}"><b>${esc(c.nombre)}</b><span>${esc(o.linea(c))}</span><small>${o.pie(c)}</small>${av.map((a) => `<em class="av">${esc(a)}</em>`).join('')}</a><select class="mv" data-k="${esc(o.id(c))}" aria-label="Mover a">${o.opciones(c)}</select></div>`; }).join('') || '<p class="mu sm" style="padding:6px">—</p>'}</div>`; }).join('');
  el.querySelectorAll('.kc').forEach((x) => (x.ondragstart = (e) => e.dataTransfer.setData('text/plain', x.dataset.k)));
  el.querySelectorAll('.mv').forEach((s) => (s.onchange = () => o.mover(s.dataset.k, s.value)));
  el.querySelectorAll('.col').forEach((col) => { col.ondragover = (e) => { e.preventDefault(); col.classList.add('ov'); }; col.ondragleave = () => col.classList.remove('ov'); col.ondrop = (e) => { e.preventDefault(); col.classList.remove('ov'); o.mover(e.dataTransfer.getData('text/plain'), col.dataset.e); }; });
}
const pestanas = (base, tabs, on) => `<div class="filt">${tabs.map(([k, t]) => `<a href="#${base}/${k}" class="tb${k === on ? ' on' : ''}">${t}</a>`).join('')}</div>`;
const avisosCard = (lista) => (lista.length ? `<div class="card sec hl"><h3 style="margin-bottom:6px">Avisos (${lista.length})</h3>${lista.slice(0, 30).map(([c, a, href]) => `<a class="li" href="${href}" style="text-decoration:none"><div><b>${esc(c.nombre)}</b><span>${a.map(esc).join(' · ')}</span></div><div class="r">›</div></a>`).join('')}</div>` : '');
// Barras simples para el análisis
const barras = (rows, tot) => (rows.length ? rows.map(([t, v, extra = '', href]) => { const tag = href ? 'a' : 'div'; return `<${tag} class="br${href ? ' brl' : ''}"${href ? ` href="${href}" title="Ver quiénes son"` : ''}><div class="bt"><span>${esc(t)}${href ? ' <small class="mu">›</small>' : ''}</span><b>${v}${extra}</b></div><div class="bb"><i style="width:${tot ? Math.max(2, Math.round(v / tot * 100)) : 0}%"></i></div></${tag}>`; }).join('') : '<p class="mu">Sin datos todavía.</p>');
const pct = (a, b) => (b ? Math.round(a / b * 100) + ' %' : '—');
const masIva = (n) => `${eur(n)} <span class="iva">+IVA</span>`;
const enPeriodo = (iso, dias) => iso && Date.now() - Date.parse(iso) <= dias * DIA;

// ---------- clientes de Plata Garage: venta y cierre ----------
const ET_PG = { nuevo: 'Nuevo', contactado: 'Contactado', cita: 'Con cita', visitado: 'Ha venido', financiera: 'Financiera', reserva: 'Reservado', vendido: 'Vendido', transferencia: 'Transferencia hecha', entregado: 'Entregado', permiso: 'Permiso recibido', enviado: 'Enviado por certificado', cerrado: 'Cerrado', perdido: 'Perdido' };
const ETAPAS = Object.entries(ET_PG);
const TAB_PG = [{ id: 'venta', n: 'Venta', e: ['nuevo', 'contactado', 'cita', 'visitado', 'financiera', 'reserva'] }, { id: 'cierre', n: 'Cierre', e: ['vendido', 'transferencia', 'entregado', 'permiso', 'enviado', 'cerrado'] }];
const POST_PG = TAB_PG[1].e;
const MOT_PG = ['Precio', 'Financiación denegada', 'Compró otro', 'No contesta', 'Pago en efectivo', 'Otro'];
// Cuotas mensuales de los portales (base sin IVA). Si cambian las tarifas, cambiarlas aquí.
const COSTES_PG = { 'Coches.net': 707, 'Wallapop': 245.11 };
const etq = (k) => ET_PG[k] || k;
const optsPG = (sel) => TAB_PG.map((t) => `<optgroup label="${t.n}">${t.e.map((k) => `<option value="${k}"${k === sel ? ' selected' : ''}>${ET_PG[k]}</option>`).join('')}</optgroup>`).join('') + `<option value="perdido"${sel === 'perdido' ? ' selected' : ''}>Perdido</option>`;
const TIPO = { cita: 'Cita', tasacion: 'Tasación', envio: 'Envío', financiacion: 'Financiación', mensaje: 'Mensaje', busqueda: 'Te lo buscamos', portal: 'Portal' };
const RUTA = { cita: 'reservas', tasacion: 'valoraciones', envio: 'envios', financiacion: 'financiaciones', mensajes: 'mensajes', mensaje: 'mensajes', busqueda: 'busquedas', portal: 'clientes' };
// Cambia la etapa pidiendo lo que haga falta (motivo de pérdida, número de certificado)
async function moverPG(c, e) {
  const body = { etapa: e };
  if (e === 'perdido') { const m = await pedirMotivo(MOT_PG); if (!m) return false; Object.assign(body, m); }
  if (e === 'enviado') { const n = await pedirCertificado('Permiso enviado por Correos certificado', c.certificado); if (n === null) return false; body.certificado = n; }
  await api('/admin/clientes/' + c.key, { method: 'PUT', body });
  const d = new Date().toISOString(); Object.assign(c, { etapa: e, manual: e, desde: d, fechas: { ...(c.fechas || {}), [e]: d } }, body.motivo ? { motivo: body.motivo, motivoTxt: body.motivoTxt } : {}, 'certificado' in body ? { certificado: body.certificado } : {});
  toast(`${c.nombre}: ${etq(e)}`); return true;
}
V.clientes = async (m, arg) => {
  const tab = ['venta', 'cierre', 'analisis'].includes(arg) ? arg : 'venta';
  const all = await api('/admin/clientes'); m = shell('clientes'); let q = '';
  const avs = (c) => avisos(c, 'garage', etq);
  const tabs = pestanas('clientes', [...TAB_PG.map((t) => [t.id, t.n]), ['analisis', 'Análisis']], tab);
  const csvBtn = `<button class="btn g" id="csv">Exportar a Excel (CSV)</button>`;
  if (tab === 'analisis') { m.innerHTML = top('Clientes', 'Análisis del embudo de Plata Garage.', csvBtn) + tabs + '<div id="an"></div>'; analisisPG($('#an'), all); }
  else {
    const T = TAB_PG.find((t) => t.id === tab); const cols = [...T.e.map((k) => [k, ET_PG[k]]), ...(tab === 'venta' ? [['perdido', 'Perdido']] : [])];
    const enTab = all.filter((c) => T.e.includes(c.etapa) || (tab === 'venta' && c.etapa === 'perdido'));
    const n = (k) => all.filter((c) => c.etapa === k).length; const vend = all.filter((c) => POST_PG.includes(c.etapa)).length, tot = all.length;
    const conAviso = enTab.filter((c) => c.etapa !== 'perdido').map((c) => [c, avs(c), '#cliente/' + c.key]).filter((x) => x[1].length);
    const kp = tab === 'venta'
      ? [['Nuevos sin atender', n('nuevo'), ['nuevo']], ['En marcha', ['contactado', 'cita', 'visitado', 'financiera', 'reserva'].reduce((a, k) => a + n(k), 0), ['contactado', 'cita', 'visitado', 'financiera', 'reserva']], ['Vendidos', vend, POST_PG], ['Conversión', pct(vend, tot)], ['Con aviso', conAviso.length, 'aviso']]
      : [['Pendientes de transferencia', n('vendido'), ['vendido']], ['Esperando el permiso', n('transferencia') + n('entregado'), ['transferencia', 'entregado']], ['Permiso por enviar', n('permiso'), ['permiso']], ['Enviados sin cerrar', n('enviado'), ['enviado']], ['Con aviso', conAviso.length, 'aviso']];
    let fk = null;
    m.innerHTML = top('Clientes', tab === 'venta' ? `${tot} personas han contactado. El estado avanza solo (cita, visita, reserva, venta); también puedes arrastrar la tarjeta.` : 'Lo que queda por hacer después de vender: transferencia, entrega y envío del permiso.', csvBtn) + tabs +
      `<div class="kp">${kp.map(([t, v, f], i) => `<div class="card"${f ? ` data-kf="${i}" style="cursor:pointer"` : ''}><span>${t}</span><b>${v}</b></div>`).join('')}</div>${avisosCard(conAviso)}
      <input id="qq" placeholder="Buscar por nombre, teléfono o email" style="max-width:420px;margin-bottom:14px"><div id="kl"></div><div class="kb" id="kb"></div>`;
    // Al pulsar una tarjeta de arriba: lista de esas personas (pulsar otra vez para volver al tablero)
    m.querySelectorAll('[data-kf]').forEach((el) => (el.onclick = () => {
      const i = Number(el.dataset.kf); fk = fk === i ? null : i; m.querySelectorAll('[data-kf]').forEach((x) => (x.style.borderColor = Number(x.dataset.kf) === fk ? 'var(--or)' : ''));
      const box = $('#kl'); if (fk === null) { box.innerHTML = ''; $('#kb').style.display = ''; return; }
      const f = kp[fk][2]; const avK = new Set(conAviso.map((x) => x[0].key));
      const L = all.filter((c) => (f === 'aviso' ? avK.has(c.key) : f.includes(c.etapa))).sort((a, z) => String(z.last).localeCompare(String(a.last)));
      $('#kb').style.display = 'none';
      box.innerHTML = `<div class="card sec"><div class="row" style="justify-content:space-between;margin-bottom:8px"><h3 style="margin:0">${kp[fk][0]} <span class="mu">${L.length}</span></h3><button class="btn g s" id="klx">Ver tablero</button></div>${L.map((c) => `<a class="li" href="#cliente/${c.key}" style="text-decoration:none"><div><b>${esc(c.nombre)}</b><span>${esc(c.compras[0]?.nombre || c.leads[0]?.resumen || '')}</span></div><div class="r">${etq(c.etapa)}<br>${fdate(c.last)}</div></a>`).join('') || '<p class="mu">Nadie.</p>'}</div>`;
      $('#klx').onclick = () => el.click(); box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    const draw = () => tablero($('#kb'), cols, enTab.filter((c) => !q || `${c.nombre} ${c.telefono} ${c.email}`.toLowerCase().includes(q)), {
      col: (c) => c.etapa, id: (c) => c.key, href: (c) => '#cliente/' + c.key, avisos: (c) => (c.etapa === 'perdido' ? [] : avs(c)),
      linea: (c) => (c.etapa === 'perdido' ? `Motivo: ${[c.motivo, c.motivoTxt].filter(Boolean).join(' · ') || '—'}` : c.compras[0]?.nombre || c.leads[0]?.resumen || ''),
      pie: (c) => `${fdate(c.last)} · ${esc(c.origen)}${c.certificado ? ' · cert. ' + esc(c.certificado) : ''}${c.manual ? '' : ' · auto'}`,
      opciones: (c) => optsPG(c.etapa),
      mover: guard(async (k, e) => { const c = all.find((x) => x.key === k); try { if (c && c.etapa !== e) await moverPG(c, e); } finally { route(); } }),
    });
    $('#qq').oninput = (e) => { q = e.target.value.toLowerCase().trim(); draw(); };
    draw();
  }
  $('#csv').onclick = () => { const rows = [['Nombre', 'Teléfono', 'Email', 'Estado', 'Origen', 'Última actividad', 'Solicitudes', 'Último interés', 'Motivo de pérdida', 'Banco', 'Financiación', 'Certificado', 'Notas'], ...all.map((c) => [c.nombre, c.telefono, c.email, etq(c.etapa), c.origen, (c.last || '').slice(0, 10), c.leads.length, c.leads[0]?.resumen || '', [c.motivo, c.motivoTxt].filter(Boolean).join(': '), c.banco, c.finEstado, c.certificado, c.notas || ''])];
    const csv = '﻿' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `clientes-plata-garage-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); };
};
// Análisis de Plata Garage: conversión paso a paso, motivos de pérdida, coste por origen y ventas
function analisisPG(el, all) {
  let dias = 90;
  const draw = () => {
    const L = all.filter((c) => enPeriodo(c.primero || c.last, dias)); const tot = L.length; const R = (k) => ETAPAS.findIndex((x) => x[0] === k);
    const pasos = ['nuevo', 'contactado', 'cita', 'visitado', 'reserva', 'vendido'].map((k) => [ET_PG[k], L.filter((c) => c.llego >= R(k)).length]);
    const fin = L.filter((c) => c.llego >= R('financiera') && (c.fechas?.financiera || c.banco || c.finEstado)).length;
    const per = L.filter((c) => c.etapa === 'perdido'); const mot = {}; per.forEach((c) => (mot[c.motivo || 'Sin motivo'] = (mot[c.motivo || 'Sin motivo'] || 0) + 1));
    const og = {}; L.forEach((c) => { const o = (og[c.origen] = og[c.origen] || { n: 0, v: 0 }); o.n++; if (c.llego >= R('vendido')) o.v++; });
    const ventas = all.filter((c) => POST_PG.includes(c.etapa) && enPeriodo(c.vendidoEl || c.fechas?.vendido, dias)); const fact = ventas.reduce((a, c) => a + (+c.importe || 0), 0);
    el.innerHTML = `<div class="filt">${[[30, '30 días'], [90, '90 días'], [365, '1 año']].map(([d, t]) => `<button data-d="${d}" class="${d === dias ? 'on' : ''}">${t}</button>`).join('')}</div>
      <div class="kp"><div class="card"><span>Interesados</span><b>${tot}</b></div><div class="card"><span>Ventas</span><b>${ventas.length}</b></div><div class="card"><span>Conversión</span><b>${pct(L.filter((c) => c.llego >= R('vendido')).length, tot)}</b></div><div class="card"><span>Vendido (precio de los coches)</span><b>${eur(fact)}</b></div></div>
      <div class="two"><div class="card"><h3 style="margin-bottom:4px">Conversión paso a paso</h3><p class="mu sm" style="margin:0 0 12px">De todos los que entraron en el periodo, cuántos llegaron a cada paso (aunque luego se perdieran). ${fin ? `${fin} pasaron por financiera.` : ''}</p>${barras(pasos.map(([t, v], i) => [t, v, ` · ${pct(v, tot)}${i ? ` (${pct(v, pasos[i - 1][1])} del paso anterior)` : ''}`]), tot)}</div>
      <div class="card"><h3 style="margin-bottom:4px">Motivos de pérdida</h3><p class="mu sm" style="margin:0 0 12px">${per.length} perdidos en el periodo.</p>${barras(Object.entries(mot).sort((a, b) => b[1] - a[1]), per.length)}</div></div>
      <div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Lo que cuesta cada interesado y cada venta</h3><p class="mu sm" style="margin:0 0 10px">Cuota de cada portal en el periodo (${dias} días) repartida entre sus interesados y sus ventas.</p>
      <table class="cst"><tr><th>Origen</th><th>Interesados</th><th>Ventas</th><th>Conversión</th><th>Cuota del periodo</th><th>Por interesado</th><th>Por venta</th></tr>${Object.entries(og).sort((a, b) => b[1].n - a[1].n).map(([o, x]) => { const cuota = COSTES_PG[o] ? COSTES_PG[o] * dias / 30 : 0; return `<tr><td>${esc(o)}</td><td>${x.n}</td><td>${x.v}</td><td>${pct(x.v, x.n)}</td><td>${cuota ? masIva(Math.round(cuota)) : '—'}</td><td>${cuota && x.n ? masIva(Math.round(cuota / x.n)) : '—'}</td><td>${cuota && x.v ? masIva(Math.round(cuota / x.v)) : cuota ? 'Sin ventas' : '—'}</td></tr>`; }).join('') || '<tr><td class="mu">Sin datos todavía.</td></tr>'}</table>
      <p class="mu sm" style="margin-top:8px">Cuotas: Coches.net ${eur(COSTES_PG['Coches.net'])}/mes y Wallapop ${eur(COSTES_PG.Wallapop)}/mes (base sin IVA). La web no tiene coste por cliente.</p></div>`;
    etiquetas(el); el.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => { dias = +b.dataset.d; draw(); }));
  };
  draw();
}
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
const nom1 = (n) => { const w = String(n || '').trim().split(/\s+/)[0] || ''; return /^(sin|cliente|\*+)$/i.test(w) || /[\d@*]/.test(w) || w.length < 2 ? '' : w[0].toUpperCase() + w.slice(1).toLowerCase(); };
const msgWa = (quien, car, nombre) => `${saludo()}${nom1(nombre) ? ' ' + nom1(nombre) : ''}, soy ${quien} de Plata Garage. He recibido un mensaje interesado en este vehículo${car ? `\n${WEB}/vehiculos/${car.slug}` : ''}`;
V.leads = async (m) => {
  const [all, cars] = await Promise.all([api('/admin/clientes'), api('/admin/cars')]); m = shell('leads');
  const nuevos = all.filter((c) => c.etapa === 'nuevo');
  const pend = all.filter((c) => c.etapa !== 'nuevo' && ![...POST_PG, 'perdido'].includes(c.etapa) && c.leads.some((l) => l.status === 'pendiente' && l.tipo !== 'portal'));
  const hoyAv = (c) => (c.etapa === 'perdido' ? [] : avisos(c, 'garage', etq));
  const hoy = all.filter((c) => c.etapa !== 'nuevo' && hoyAv(c).length).sort((a, b) => diasDesde(b.desde) - diasDesde(a.desde));
  const resto = all.filter((c) => !nuevos.includes(c) && !pend.includes(c) && !hoy.includes(c) && ![...POST_PG, 'perdido'].includes(c.etapa)).slice(0, 20);
  badges.leads = nuevos.length || ''; 
  const card = (c) => { const car = cocheDe(c, cars); const own = car?.owner || ''; const l = c.leads[0] || {};
    const bt = (q) => `<a class="btn s${own && own !== q ? ' g' : (!own && q !== 'Cristina' ? ' g' : '')}" target="_blank" rel="noopener" data-k="${c.key}" data-q="${q}" href="${waLink(c.telefono, msgWa(q, car, c.nombre))}">${IC.wa}Soy ${q}</a>`;
    return `<div class="card sec ld"><div class="hd"><div><b>${esc(c.nombre)}</b>${c.telefono ? ` <a href="tel:${esc(c.telefono)}" style="color:var(--mu);font-weight:500;margin-left:6px;text-decoration:none">${esc(c.telefono)}</a>` : ''}<span>${fdt(c.last)}</span></div>${badge(etq(c.etapa).toLowerCase())}</div>
      ${hoyAv(c).length ? `<p class="sm" style="color:var(--or);margin:4px 0"><b>Hoy te toca:</b> ${esc(hoyAv(c).join(' · '))}</p>` : ''}<p>${esc(l.resumen || '')}</p>${car ? `<p class="mu sm">Coche: <a href="${WEB}/vehiculos/${car.slug}" target="_blank" rel="noopener" style="color:var(--or)">${esc(car.brand)} ${esc(car.model)}</a> · ${car.year || '—'} · <b style="color:var(--tx)">${car.price ? eur(car.price) : '—'}</b>${own ? ' · de ' + esc(own) : ''}</p>` : ''}
      <div class="row">${!c.telefono ? (() => { const pt = /coches/i.test(l.fuente || '') ? ['Coches.net', 'https://pro.coches.net/'] : /wallapop/i.test(l.fuente || '') ? ['Wallapop', 'https://es.wallapop.com/app/chat'] : null; return pt ? `<a class="btn s" target="_blank" rel="noopener" data-rp="${c.key}" href="${pt[1]}">Responder en ${pt[0]}</a>` : ''; })() : own === 'Cristina' || own === 'Juan' ? bt(own) : bt('Cristina') + bt('Juan')}<a class="btn s g" href="#cliente/${c.key}">Ver ficha</a><select class="s" data-mv="${c.key}" style="width:auto;padding:6px 10px" title="Mover a otra etapa"><option value="">Mover a…</option>${optsPG('')}</select><button class="btn r s" data-del="${c.key}">Eliminar</button></div></div>`; };
  const sec = (t, l, vacio) => `<h3 class="lh">${t} <span>${l.length}</span></h3>${l.length ? l.map(card).join('') : `<p class="mu">${vacio}</p>`}`;
  m.innerHTML = top('Leads', 'Los nuevos arriba. Al pulsar "Soy Cristina" o "Soy Juan" se abre WhatsApp con el mensaje escrito y el lead pasa a contactado.', `<a class="btn g" href="#clientes">Embudo completo</a>`) +
    sec('Nuevos sin contestar', nuevos, 'No hay leads nuevos.') + sec('Hoy te toca seguimiento', hoy, 'Nada pendiente de seguimiento hoy.') + sec('Pendientes', pend, 'Nada pendiente.') + sec('En marcha', resto, 'Nada en marcha.');
  m.querySelectorAll('[data-mv]').forEach((el) => (el.onchange = guard(async () => { const c = all.find((x) => x.key === el.dataset.mv); if (!c || !el.value) return; if (!(await moverPG(c, el.value))) { el.value = ''; return; } route(); })));
  m.querySelectorAll('[data-del]').forEach((b) => (b.onclick = guard(async () => { const c = all.find((x) => x.key === b.dataset.del); if (!c || !confirm(`¿Quitar a ${c.nombre} de la lista? Si vuelve a escribir, aparecerá otra vez.`)) return; await api('/admin/clientes/' + c.key, { method: 'DELETE' }); toast(`${c.nombre}: eliminado`); route(); })));
  m.querySelectorAll('a[data-rp]').forEach((a) => (a.onclick = () => { const c = all.find((x) => x.key === a.dataset.rp); if (c && c.etapa === 'nuevo') api('/admin/clientes/' + c.key, { method: 'PUT', body: { etapa: 'contactado' } }).then(() => toast(`${c.nombre}: contactado`)).catch(() => {}); }));
  m.querySelectorAll('a[data-k]').forEach((a) => (a.onclick = () => { const c = all.find((x) => x.key === a.dataset.k); if (c) a.href = waLink(c.telefono, msgWa(a.dataset.q, cocheDe(c, cars), c.nombre)); if (c && c.etapa === 'nuevo') api('/admin/clientes/' + c.key, { method: 'PUT', body: { etapa: 'contactado' } }).then(() => toast(`${c.nombre}: contactado`)).catch(() => {}); }));
};
let CARS_C = [];
V.cliente = async (m, key) => {
  const [cl, cs] = await Promise.all([api('/admin/clientes'), api('/admin/cars').catch(() => [])]); CARS_C = cs; const c = cl.find((x) => x.key === key); m = shell('clientes');
  if (!c) { m.innerHTML = top('Cliente') + '<div class="card mu">No encontrado.</div>'; return; }
  const av = c.etapa === 'perdido' ? [] : avisos(c, 'garage', etq); const f = c.fechas || {};
  m.innerHTML = top(esc(c.nombre), `${esc(c.telefono)}${c.email ? ' · ' + esc(c.email) : ''} · ${esc(c.origen)} · última actividad ${fdt(c.last)}`, `<a class="btn g" href="#clientes/${POST_PG.includes(c.etapa) ? 'cierre' : 'venta'}">Volver</a>`) +
    (av.length ? `<div class="card sec hl">${av.map((a) => `<p style="margin:2px 0"><b>${esc(a)}</b></p>`).join('')}</div>` : '') +
    `<div class="two"><div class="card"><h3 style="margin-bottom:12px">Estado</h3><label>Etapa del embudo<select id="et"><option value="">Automático (ahora: ${etq(c.auto)})</option>${optsPG(c.manual)}</select></label>
    <p class="mu sm">En automático avanza solo con sus citas, su reserva o la venta. Sin movimiento en 45 días pasa a "Perdido" (salvo si ya está vendido).</p>
    ${c.etapa === 'perdido' ? `<p class="sm" style="margin:6px 0 10px">Motivo de pérdida: <b>${esc([c.motivo, c.motivoTxt].filter(Boolean).join(' · ') || 'sin indicar')}</b></p>` : ''}
    <div class="fg" style="grid-template-columns:1fr 1fr;margin-top:6px"><label>Financiera${(() => { const own = (cocheDe(c, CARS_C) || {}).owner; const ops = own === 'Juan' ? ['Confia'] : ['Confia', 'Lendrock']; if (c.banco && !ops.includes(c.banco)) ops.push(c.banco); return `<select id="bk"><option value="">No financia</option>${ops.map((o) => `<option${o === c.banco ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`; })()}</label><label>Estado de la financiación<select id="fe">${['', 'en estudio', 'aprobada', 'denegada'].map((x) => `<option value="${x}"${x === c.finEstado ? ' selected' : ''}>${x ? x[0].toUpperCase() + x.slice(1) : '—'}</option>`).join('')}</select></label>
    <label style="grid-column:1/-1">Nº de certificado de Correos (permiso)<input id="ce" value="${esc(c.certificado)}" placeholder="Al enviar el permiso definitivo"></label></div>
    <label style="margin-top:10px">Notas internas<textarea id="nt" rows="5">${esc(c.notas || '')}</textarea></label><div class="row" style="margin-top:12px"><button class="btn" id="sv">Guardar</button><a class="btn g" target="_blank" rel="noopener" href="${waLink(c.telefono, 'Hola ' + String(c.nombre).split(' ')[0] + ', te escribimos de Plata Garage. ')}">${IC.wa}WhatsApp</a><a class="btn g" href="tel:${esc(c.telefono)}">Llamar</a>${c.email ? `<a class="btn g" href="mailto:${esc(c.email)}">Email</a>` : ''}</div>
    ${Object.keys(f).length ? `<h3 style="margin:18px 0 8px">Fechas de cada paso</h3>${ETAPAS.filter(([k]) => f[k]).map(([k, t]) => `<div class="li"><div><b>${t}</b></div><div class="r">${fdt(f[k])}</div></div>`).join('')}` : ''}</div>
    <div class="card"><h3 style="margin-bottom:12px">Historial (${c.leads.length})</h3>${c.leads.map((l) => `<a class="li" href="#${RUTA[l.tipo]}" style="text-decoration:none"><div><b>${TIPO[l.tipo]}</b><span>${esc(l.resumen)}</span></div><div class="r">${fdate(l.created)}<br>${l.status ? badge(l.status) : ''}</div></a>`).join('')}
    ${c.compras.length ? `<h3 style="margin:18px 0 8px">Compras</h3>${c.compras.map((x) => `<div class="li"><div><b>${esc(x.nombre)}</b><span>${x.sold ? 'Vendido el ' + fdate(x.soldAt) : 'Reservado'}</span></div></div>`).join('')}` : ''}</div></div>`;
  const datos = () => ({ notas: $('#nt').value, banco: $('#bk').value, finEstado: $('#fe').value, certificado: $('#ce').value });
  $('#sv').onclick = guard(async () => { await api('/admin/clientes/' + key, { method: 'PUT', body: datos() }); toast('Guardado'); route(); });
  // La etapa se guarda sola al elegirla (en el móvil no hay que pulsar Guardar)
  $('#et').onchange = guard(async () => { const e = $('#et').value;
    try {
      if (!e) { await api('/admin/clientes/' + key, { method: 'PUT', body: { etapa: '', ...datos() } }); toast('Etapa en automático'); return; }
      await api('/admin/clientes/' + key, { method: 'PUT', body: datos() }); c.certificado = $('#ce').value;
      if (await moverPG(c, e)) return;
    } finally { route(); } });
};

// ---------- Plata Marine y Rotulito: embudos por tableros ----------
const nApi = (p = '', o) => api(`/admin/neg/${NEG}${p}`, o);
const IMPORTE = { marine: 'Comisión prevista', rotulito: 'Importe del proyecto' };
const CERT = { marine: 'Documentación enviada' };
// Tablero al que pertenece cada cliente (los perdidos, al tablero del que venían)
const tabDe = (d, c) => { const e = c.etapa === 'Perdido' ? c.antes : c.etapa; return (d.tableros.find((t) => t.e.includes(e)) || d.tableros[0]).id; };
const optsN = (d, sel) => d.tableros.map((t) => `<optgroup label="${esc(t.n)}">${t.e.map((x) => `<option${x === sel ? ' selected' : ''}>${esc(x)}</option>`).join('')}</optgroup>`).join('') + `<option${sel === 'Perdido' ? ' selected' : ''}>Perdido</option>`;
const avN = (c) => (c.etapa === 'Perdido' ? [] : avisos(c, NEG));
async function moverN(d, c, e) {
  const body = { etapa: e };
  if (e === 'Perdido') { const m = await pedirMotivo(d.motivos); if (!m) return false; Object.assign(body, m); }
  if (CERT[NEG] === e) { const n = await pedirCertificado('Documentación enviada por Correos certificado', c.certificado); if (n === null) return false; body.certificado = n; }
  Object.assign(c, await nApi('/' + c.id, { method: 'PUT', body })); toast(`${c.nombre}: ${e}`); return true;
}
// Hasta qué paso ha llegado cada cliente (por su historial), para la conversión
const alcanzadas = (c) => { const s = new Set([c.etapa, ...Object.keys(c.fechas || {})]); (c.historial || []).forEach((h) => { const x = /(?:Etapa|Embudo nuevo): (.+?) → (.+?)(?: \(|$)/.exec(h.t || ''); if (x) { s.add(x[1]); s.add(x[2]); } }); s.delete('Perdido'); if (c.etapa === 'Perdido' && c.antes) s.add(c.antes); return s; };
const ganado = (d, c) => { const s = alcanzadas(c); return NEG === 'marine' ? d.tableros[1].e.some((x) => s.has(x)) || s.has('Vendido') : ['Aceptado y señal', ...d.tableros[1].e].some((x) => s.has(x)); };
const dinero = (d) => {
  const L = d.leads; const fin = NEG === 'marine' ? 'Comisión cobrada' : 'Cobrada';
  const marcha = L.filter((c) => c.etapa !== 'Perdido' && c.etapa !== fin && (NEG === 'marine' ? ['Oferta', 'Señal', 'Prueba de mar / peritaje', 'Aceptación', ...d.tableros[1].e, 'Vendido'] : ['Aceptado y señal', ...d.tableros[1].e]).includes(c.etapa));
  return { marcha: marcha.reduce((a, c) => a + (+c.importe || 0), 0), nMarcha: marcha.length, fin, cobrado: (dias) => L.filter((c) => c.etapa === fin && enPeriodo(c.fechas?.[fin] || c.updated, dias)).reduce((a, c) => a + (+c.importe || 0), 0) };
};
V.nresumen = async (m) => {
  const d = await nApi(); m = shell('resumen'); const L = d.leads; const td = new Date().toISOString().slice(0, 10);
  const hoy = L.filter((x) => (x.updated || '').slice(0, 10) === td).length, sem = L.filter((x) => Date.now() - Date.parse(x.created) < 7 * DIA).length;
  const prim = L.filter((x) => x.etapa === d.etapas[0]); const av = L.map((c) => [c, avN(c), '#ncliente/' + c.id]).filter((x) => x[1].length); const $$ = dinero(d);
  m.innerHTML = top(`Resumen · ${NEGS[NEG].n}`, 'Lo que ha entrado y en qué punto está cada cliente.', `<a class="btn" href="#clientes">Ver embudo</a>`) +
    `<div class="kp">${[['Clientes en total', L.length, ''], ['Nuevos esta semana', sem, '/f:sem'], ['Con movimiento hoy', hoy, '/f:hoy'], [`Sin atender (${d.etapas[0]})`, prim.length, '/e:' + encodeURIComponent(d.etapas[0])]].map(([t, v, f]) => `<a class="card" href="#clientes${f}"><span>${t}</span><i>${IC.clientes}</i><b>${v}</b></a>`).join('')}
    <a class="card" href="#analiticas"><span>${NEG === 'marine' ? 'Comisiones en marcha' : 'Proyectos en marcha'}</span><i>${IC.analiticas}</i><b>${eur($$.marcha)}</b></a><a class="card" href="#analiticas"><span>Cobrado (30 días)</span><i>${IC.analiticas}</i><b>${eur($$.cobrado(30))}</b></a></div>
    ${avisosCard(av)}
    ${d.tableros.map((t) => `<div class="card sec"><div class="row" style="justify-content:space-between;margin-bottom:8px"><h3>${esc(t.n)}</h3><a href="#clientes/${t.id}" class="sm" style="color:var(--or)">Ver tablero</a></div>${t.e.map((e) => { const n = L.filter((x) => x.etapa === e).length; return `<a class="li" href="#clientes/e:${encodeURIComponent(e)}"><div><b>${esc(e)}</b></div><div class="r"><b class="o">${n} ›</b></div></a>`; }).join('')}</div>`).join('')}
    <div class="card sec"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3>Últimos contactos</h3><a href="#clientes" class="sm" style="color:var(--or)">Ver todos</a></div>${[...L].sort((a, b) => (b.updated || '').localeCompare(a.updated || '')).slice(0, 8).map((x) => `<a class="li" href="#ncliente/${x.id}" style="text-decoration:none"><div><b>${esc(x.nombre)}</b><span>${esc(x.historial?.[0]?.t || x.interes || '')}</span></div><div class="r">${fdate(x.updated)}<br><span class="mu">${esc(x.etapa)}</span></div></a>`).join('') || '<p class="mu">Todavía no ha entrado ningún contacto. Mira "Entrada de leads".</p>'}</div>`;
};
V.nclientes = async (m, arg) => {
  const d = await nApi(); m = shell('clientes'); let q = '';
  // Desde el Resumen: lista con el detalle de los clientes de una etapa (e:...) o de un filtro (f:sem, f:hoy)
  if (arg && /^[efrp]:/.test(arg)) {
    const td = new Date().toISOString().slice(0, 10); const [t, v] = [arg.slice(0, 2), decodeURIComponent(arg.slice(2))];
    const F = { 'f:sem': ['Nuevos esta semana', (x) => Date.now() - Date.parse(x.created) < 7 * DIA], 'f:hoy': ['Con movimiento hoy', (x) => (x.updated || '').slice(0, 10) === td] };
    let tit, fn;
    if (t === 'r:' || t === 'p:') { const k = v.indexOf(':'); const dd = Number(v.slice(0, k)) || 90, val = v.slice(k + 1);
      if (t === 'r:') { const T = d.tableros.find((x) => x.e.includes(val)) || d.tableros[0]; const i = T.e.indexOf(val); tit = `Llegaron a "${val}" (${dd} días)`; fn = (c) => enPeriodo(c.created, dd) && (() => { const s = alcanzadas(c); return T.e.some((y, j) => j >= i && s.has(y)); })(); }
      else { tit = `Perdidos: ${val} (${dd} días)`; fn = (c) => enPeriodo(c.created, dd) && c.etapa === 'Perdido' && (c.motivo || 'Sin motivo') === val; } }
    else [tit, fn] = t === 'e:' ? [v, (x) => x.etapa === v] : (F[arg] || ['Clientes', () => true]);
    const list = d.leads.filter(fn).sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
    m.innerHTML = top(`${esc(tit)} · ${list.length}`, NEGS[NEG].n, `<a class="btn g" href="${/^[rp]:/.test(arg) ? '#analiticas' : '#resumen'}">Volver</a><a class="btn g" href="#clientes">Embudo</a>`) +
      (list.length ? list.map((c) => `<div class="card sec"><div class="row" style="justify-content:space-between"><a href="#ncliente/${c.id}"><b>${esc(c.nombre)}</b></a><span class="mu sm">${esc(c.etapa)}${c.updated ? ' · ' + fdt(c.updated) : ''}</span></div>
        ${c.interes ? `<p style="margin-top:6px">${esc(c.interes)}</p>` : ''}${c.notas ? `<p class="mu sm" style="margin-top:6px;white-space:pre-line">${esc(c.notas)}</p>` : ''}
        <p class="mu sm" style="margin-top:6px">${[c.telefono, c.email, c.origen].filter(Boolean).map(esc).join(' · ')}</p>
        <div class="row" style="margin-top:10px"><a class="btn s" href="#ncliente/${c.id}">Abrir ficha</a>${c.telefono ? `<a class="btn g s" target="_blank" rel="noopener" href="${waLink(c.telefono)}">${IC.wa}WhatsApp</a>` : ''}</div></div>`).join('') : '<div class="card mu">No hay clientes aquí.</div>');
    return;
  }
  const T = d.tableros.find((t) => t.id === arg) || d.tableros[0];
  const enTab = d.leads.filter((c) => tabDe(d, c) === T.id); const cols = [...T.e.map((e) => [e, e]), ['Perdido', 'Perdido']];
  const av = enTab.map((c) => [c, avN(c), '#ncliente/' + c.id]).filter((x) => x[1].length);
  const activos = enTab.filter((c) => c.etapa !== 'Perdido'); const imp = activos.reduce((a, c) => a + (+c.importe || 0), 0);
  m.innerHTML = top(`Clientes · ${NEGS[NEG].n}`, `${d.leads.length} contactos. Arrastra la tarjeta o cambia la etapa en su selector.`, `<button class="btn" id="nn">+ Añadir a mano</button><button class="btn g" id="csv">Exportar (CSV)</button>`) +
    pestanas('clientes', [...d.tableros.map((t) => [t.id, t.n]), ['analisis', 'Análisis']], T.id) +
    `<div class="kp"><div class="card"><span>En este tablero</span><b>${activos.length}</b></div><div class="card"><span>Perdidos</span><b>${enTab.length - activos.length}</b></div><div class="card"><span>${IMPORTE[NEG]} (suma)</span><b>${eur(imp)}</b></div><div class="card"><span>Con aviso</span><b>${av.length}</b></div></div>${avisosCard(av)}
    <input id="qq" placeholder="Buscar por nombre, teléfono, email o interés" style="max-width:420px;margin-bottom:14px"><div class="kb" id="kb"></div>`;
  const draw = () => tablero($('#kb'), cols, enTab.filter((c) => !q || `${c.nombre} ${c.telefono} ${c.email} ${c.interes}`.toLowerCase().includes(q)), {
    col: (c) => c.etapa, id: (c) => c.id, href: (c) => '#ncliente/' + c.id, avisos: avN,
    linea: (c) => (c.etapa === 'Perdido' ? `Motivo: ${[c.motivo, c.motivoTxt].filter(Boolean).join(' · ') || '—'}` : c.interes || c.historial?.[0]?.t || ''),
    pie: (c) => `${fdate(c.updated)}${c.origen ? ' · ' + esc(c.origen) : ''}${c.importe ? ' · ' + eur(c.importe) : ''}${c.certificado ? ' · cert. ' + esc(c.certificado) : ''}`,
    opciones: (c) => optsN(d, c.etapa),
    mover: guard(async (id, e) => { const c = d.leads.find((x) => x.id === id); try { if (c && c.etapa !== e) await moverN(d, c, e); } finally { route(); } }),
  });
  $('#qq').oninput = (e) => { q = e.target.value.toLowerCase().trim(); draw(); };
  $('#nn').onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Añadir cliente a mano</h3><form id="nf" class="fg" style="grid-template-columns:1fr">${NEG === 'marine' ? `<label>Tipo<select name="tipo"><option>Comprador</option><option${T.id === 'vendedores' ? ' selected' : ''}>Vendedor</option></select></label>` : ''}<label>Nombre<input name="nombre" required></label><label>Teléfono<input name="telefono" inputmode="tel"></label><label>Email<input name="email" type="email"></label><label>Origen<input name="origen" placeholder="WhatsApp, Meta, llamada…"></label><label>Interés<input name="interes" placeholder="Qué busca o qué vende"></label><div class="row" style="justify-content:flex-end"><button type="button" class="btn g" id="nc">Cancelar</button><button class="btn">Añadir</button></div></form>`);
    $('#nc', dm).onclick = () => dm.remove(); $('#nf', dm).onsubmit = guard(async (e) => { e.preventDefault(); await nApi('', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); dm.remove(); toast('Añadido'); route(); }); };
  $('#csv').onclick = () => { const rows = [['Nombre', 'Teléfono', 'Email', 'Tablero', 'Etapa', 'Origen', 'Interés', IMPORTE[NEG], 'Motivo de pérdida', 'Certificado', 'Última actividad', 'Notas'], ...d.leads.map((c) => [c.nombre, c.telefono, c.email, (d.tableros.find((t) => t.id === tabDe(d, c)) || {}).n, c.etapa, c.origen, c.interes, c.importe || '', [c.motivo, c.motivoTxt].filter(Boolean).join(': '), c.certificado, (c.updated || '').slice(0, 10), c.notas])];
    const csv = '﻿' + rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `clientes-${NEG}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); };
  draw();
};
// Análisis de Plata Marine y Rotulito
V.nanalisis = async (m) => {
  const [d, gastos] = await Promise.all([nApi(), nApi('/gastos')]); m = shell('analiticas'); let dias = 90; const $$ = dinero(d);
  const draw = () => {
    const L = d.leads.filter((c) => enPeriodo(c.created, dias)); const per = L.filter((c) => c.etapa === 'Perdido');
    const mot = {}; per.forEach((c) => (mot[c.motivo || 'Sin motivo'] = (mot[c.motivo || 'Sin motivo'] || 0) + 1));
    const conv = d.tableros.map((t) => { const sel = L.filter((c) => { const s = alcanzadas(c); return t.e.some((x) => s.has(x)) || (c.etapa === 'Perdido' && t.e.includes(c.antes)); });
      const pasos = t.e.map((x, i) => [x, sel.filter((c) => { const s = alcanzadas(c); return t.e.some((y, j) => j >= i && s.has(y)); }).length]);
      return `<div class="card"><h3 style="margin-bottom:4px">${esc(t.n)}: paso a paso</h3><p class="mu sm" style="margin:0 0 12px">${sel.length} clientes en el periodo.</p>${barras(pasos.map(([x, v], i) => [x, v, ` · ${pct(v, sel.length)}${i ? ` (${pct(v, pasos[i - 1][1])} del anterior)` : ''}`, `#clientes/r:${dias}:${encodeURIComponent(x)}`]), sel.length)}</div>`; });
    const og = {}; L.forEach((c) => { const k = c.origen || 'Sin origen'; const o = (og[k] = og[k] || { n: 0, g: 0 }); o.n++; if (ganado(d, c)) o.g++; });
    const ganTxt = NEG === 'marine' ? 'Operaciones' : 'Clientes ganados';
    m.innerHTML = top(`Analíticas · ${NEGS[NEG].n}`, 'Conversión del embudo, motivos de pérdida, coste por origen y dinero.', `<a class="btn g" href="#clientes">Embudo</a>`) +
      `<div class="filt">${[[30, '30 días'], [90, '90 días'], [365, '1 año']].map(([x, t]) => `<button data-d="${x}" class="${x === dias ? 'on' : ''}">${t}</button>`).join('')}</div>
      <div class="kp"><div class="card"><span>Contactos nuevos</span><b>${L.length}</b></div><div class="card"><span>${ganTxt}</span><b>${L.filter((c) => ganado(d, c)).length}</b></div><div class="card"><span>${NEG === 'marine' ? 'Comisiones en marcha' : 'Proyectos en marcha'} (${$$.nMarcha})</span><b>${eur($$.marcha)}</b></div><div class="card"><span>Cobrado en el periodo</span><b>${eur($$.cobrado(dias))}</b></div></div>
      <div class="two">${conv.join('')}</div>
      <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:4px">Motivos de pérdida</h3><p class="mu sm" style="margin:0 0 12px">${per.length} perdidos en el periodo.</p>${barras(Object.entries(mot).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, '', `#clientes/p:${dias}:${encodeURIComponent(k)}`]), per.length)}</div>
      <div class="card"><h3 style="margin-bottom:4px">Gasto mensual por origen</h3><p class="mu sm" style="margin:0 0 10px">Lo que pagas al mes en cada canal (base sin IVA). Sirve para calcular lo que cuesta cada cliente.</p><form id="gf" class="fg" style="grid-template-columns:1fr 1fr">${[...new Set([...Object.keys(og), ...Object.keys(gastos), 'Meta Ads', 'Google Ads'])].filter((k) => !['Sin origen', 'Manual'].includes(k)).map((k) => `<label>${esc(k)}<input name="${esc(k)}" inputmode="decimal" value="${gastos[k] ?? ''}" placeholder="0"></label>`).join('')}<div class="row" style="grid-column:1/-1;justify-content:flex-end"><button class="btn s">Guardar gastos</button></div></form></div></div>
      <div class="card sec" style="margin-top:16px"><h3 style="margin-bottom:4px">Lo que cuesta cada contacto y cada ${NEG === 'marine' ? 'operación' : 'cliente'}</h3><p class="mu sm" style="margin:0 0 10px">Gasto del periodo (${dias} días) repartido entre los contactos de cada origen.</p>
      <table class="cst"><tr><th>Origen</th><th>Contactos</th><th>${ganTxt}</th><th>Conversión</th><th>Gasto del periodo</th><th>Por contacto</th><th>Por ${NEG === 'marine' ? 'operación' : 'cliente'}</th></tr>${Object.entries(og).sort((a, b) => b[1].n - a[1].n).map(([o, x]) => { const g = (+gastos[o] || 0) * dias / 30; return `<tr><td>${esc(o)}</td><td>${x.n}</td><td>${x.g}</td><td>${pct(x.g, x.n)}</td><td>${g ? masIva(Math.round(g)) : '—'}</td><td>${g && x.n ? masIva(Math.round(g / x.n)) : '—'}</td><td>${g && x.g ? masIva(Math.round(g / x.g)) : g ? 'Sin cerrar' : '—'}</td></tr>`; }).join('') || '<tr><td class="mu">Sin datos todavía.</td></tr>'}</table>
      <p class="mu sm" style="margin-top:8px">Pon a cada cliente su origen y su ${IMPORTE[NEG].toLowerCase()} en la ficha para que estas cifras sean fiables.</p></div>`;
    etiquetas(m); m.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => { dias = +b.dataset.d; draw(); }));
    $('#gf').onsubmit = guard(async (e) => { e.preventDefault(); const o = Object.fromEntries(new FormData(e.target)); Object.keys(o).forEach((k) => { o[k] = String(o[k]).replace(',', '.').trim(); if (o[k] === '') delete o[k]; }); Object.assign(gastos, await nApi('/gastos', { method: 'PUT', body: o })); toast('Gastos guardados'); draw(); });
  };
  draw();
};
// Leads de Plata Marine y Rotulito: los nuevos arriba, con teléfono, WhatsApp, mover de etapa y eliminar
V.nleads = async (m) => {
  const d = await nApi(); m = shell('leads');
  const primeras = d.tableros.map((t) => t.e[0]); const finales = d.tableros.map((t) => t.e[t.e.length - 1]);
  const ord = (a, b) => (b.updated || b.created || '').localeCompare(a.updated || a.created || '');
  const nuevos = d.leads.filter((c) => primeras.includes(c.etapa)).sort(ord);
  const hoy = d.leads.filter((c) => !primeras.includes(c.etapa) && avN(c).length).sort((a, b) => diasDesde(b.desde) - diasDesde(a.desde));
  const marcha = d.leads.filter((c) => !primeras.includes(c.etapa) && !hoy.includes(c) && c.etapa !== 'Perdido' && !finales.includes(c.etapa)).sort(ord).slice(0, 30);
  const card = (c) => `<div class="card sec ld"><div class="hd"><div><b>${esc(c.nombre)}</b>${c.telefono ? ` <a href="tel:${esc(c.telefono)}" style="color:var(--mu);font-weight:500;margin-left:6px;text-decoration:none">${esc(c.telefono)}</a>` : ''}<span>${fdt(c.updated || c.created)}${c.origen ? ' · ' + esc(c.origen) : ''}</span></div>${badge(String(c.etapa).toLowerCase())}</div>
    ${avN(c).length ? `<p class="sm" style="color:var(--or);margin:4px 0"><b>Hoy te toca:</b> ${esc(avN(c).join(' · '))}</p>` : ''}${c.interes ? `<p>${esc(c.interes)}</p>` : ''}${c.email ? `<p class="mu sm">${esc(c.email)}</p>` : ''}
    <div class="row">${c.telefono ? `<a class="btn s" target="_blank" rel="noopener" data-wa="${c.id}" href="${waLink(c.telefono)}">${IC.wa}WhatsApp</a>` : ''}<a class="btn s g" href="#ncliente/${c.id}">Ver ficha</a><select data-mv="${c.id}" style="width:auto;padding:6px 10px" title="Mover a otra etapa"><option value="">Mover a…</option>${optsN(d, '')}</select><button class="btn r s" data-del="${c.id}">Eliminar</button></div></div>`;
  const sec = (t, l, vacio) => `<h3 class="lh">${t} <span>${l.length}</span></h3>${l.length ? l.map(card).join('') : `<p class="mu">${vacio}</p>`}`;
  m.innerHTML = top(`Leads · ${NEGS[NEG].n}`, 'Los nuevos arriba. Al pulsar WhatsApp, un comprador nuevo pasa a contactado.', `<a class="btn g" href="#clientes">Embudo completo</a>`) +
    sec('Nuevos sin contestar', nuevos, 'No hay leads nuevos.') + sec('Hoy te toca seguimiento', hoy, 'Nada pendiente de seguimiento hoy.') + sec('En marcha', marcha, 'Nada en marcha.');
  m.querySelectorAll('[data-wa]').forEach((a) => (a.onclick = () => { const c = d.leads.find((x) => x.id === a.dataset.wa); if (c && c.etapa === 'Nuevo' && d.etapas.includes('Contactado')) nApi('/' + c.id, { method: 'PUT', body: { etapa: 'Contactado' } }).then(() => toast(`${c.nombre}: contactado`)).catch(() => {}); }));
  m.querySelectorAll('[data-mv]').forEach((el) => (el.onchange = guard(async () => { const c = d.leads.find((x) => x.id === el.dataset.mv); if (!c || !el.value) return; await moverN(d, c, el.value); route(); })));
  m.querySelectorAll('[data-del]').forEach((b) => (b.onclick = guard(async () => { const c = d.leads.find((x) => x.id === b.dataset.del); if (!c || !confirm(`¿Eliminar a ${c.nombre}? Se borra del embudo.`)) return; await nApi('/' + c.id, { method: 'DELETE' }); toast(`${c.nombre}: eliminado`); route(); })));
};
V.ncliente = async (m, id) => {
  const d = await nApi(); const c = d.leads.find((x) => x.id === id); m = shell('clientes');
  if (!c) { m.innerHTML = top('Cliente') + '<div class="card mu">No encontrado.</div>'; return; }
  const av = avN(c); const f = c.fechas || {};
  m.innerHTML = top(esc(c.nombre), `${esc(c.telefono || '')}${c.email ? ' · ' + esc(c.email) : ''}${c.origen ? ' · ' + esc(c.origen) : ''}`, `<a class="btn g" href="#clientes/${tabDe(d, c)}">Volver</a>`) +
    (av.length ? `<div class="card sec hl">${av.map((a) => `<p style="margin:2px 0"><b>${esc(a)}</b></p>`).join('')}</div>` : '') +
    `<div class="two"><div class="card"><h3 style="margin-bottom:12px">Estado</h3><label>Etapa<select id="et">${optsN(d, c.etapa)}</select></label>
    ${c.etapa === 'Perdido' ? `<p class="sm" style="margin:8px 0 0">Motivo de pérdida: <b>${esc([c.motivo, c.motivoTxt].filter(Boolean).join(' · ') || 'sin indicar')}</b></p>` : ''}
    <div class="fg" style="grid-template-columns:1fr 1fr;margin-top:10px"><label>${IMPORTE[NEG]} (€)<input id="im" inputmode="decimal" value="${c.importe || ''}" placeholder="0"></label><label>Origen<input id="og" value="${esc(c.origen || '')}" placeholder="Meta Ads, web, WhatsApp…"></label>
    ${NEG === 'marine' ? `<label style="grid-column:1/-1">Nº de certificado de Correos (documentación)<input id="ce" value="${esc(c.certificado || '')}"></label>` : ''}</div>
    <label style="margin-top:10px">Interés<input id="in" value="${esc(c.interes || '')}"></label><label style="margin-top:10px">Notas internas<textarea id="nt" rows="5">${esc(c.notas || '')}</textarea></label>
    <div class="row" style="margin-top:12px"><button class="btn" id="sv">Guardar</button>${c.telefono ? `<a class="btn g" target="_blank" rel="noopener" href="${waLink(c.telefono)}">${IC.wa}WhatsApp</a><a class="btn g" href="tel:${esc(c.telefono)}">Llamar</a>` : ''}${c.email ? `<a class="btn g" href="mailto:${esc(c.email)}">Email</a>` : ''}<span style="flex:1"></span><button class="btn r s" id="del">Borrar</button></div>
    ${Object.keys(f).length ? `<h3 style="margin:18px 0 8px">Fechas de cada paso</h3>${d.etapas.filter((e) => f[e]).map((e) => `<div class="li"><div><b>${esc(e)}</b></div><div class="r">${fdt(f[e])}</div></div>`).join('')}` : ''}</div>
    <div class="card"><h3 style="margin-bottom:12px">Historial</h3>${(c.historial || []).map((h) => `<div class="li"><div><span style="color:var(--tx)">${esc(h.t)}</span></div><div class="r">${fdt(h.d)}</div></div>`).join('') || '<p class="mu">Sin movimientos.</p>'}</div></div>`;
  const datos = () => ({ notas: $('#nt').value, interes: $('#in').value, importe: $('#im').value, origen: $('#og').value, ...($('#ce') ? { certificado: $('#ce').value } : {}) });
  $('#sv').onclick = guard(async () => { await nApi('/' + id, { method: 'PUT', body: datos() }); toast('Guardado'); route(); });
  $('#et').onchange = guard(async () => { try { Object.assign(c, await nApi('/' + id, { method: 'PUT', body: datos() })); await moverN(d, c, $('#et').value); } finally { route(); } });
  $('#del').onclick = guard(async () => { if (!confirm('¿Borrar este cliente del embudo?')) return; await nApi('/' + id, { method: 'DELETE' }); location.hash = '#clientes'; });
  if (NEG === 'marine') { // comprador que busca barco → su demanda, cruzada con la cartera
    const r = await api('/admin/demandas').catch(() => ({ demandas: [] })); const dm = r.demandas.find((x) => x.leadId === id || (c.telefono && x.telefono === c.telefono));
    const box = document.createElement('div'); box.className = 'card sec';
    box.innerHTML = dm ? `<h3 style="margin-bottom:4px">Busca barco</h3><p class="sm">${esc(resumenDem(dm.criterios))}</p><div class="row" style="margin-top:10px"><a class="btn s" href="#demanda/${dm.id}">Ver demanda · ${dm.cruces.length} encaja${dm.cruces.length === 1 ? '' : 'n'}</a></div>`
      : `<h3 style="margin-bottom:4px">¿Busca barco?</h3><p class="mu sm">Crea su demanda y la app la cruza con tu cartera y la web.</p><div class="row" style="margin-top:10px"><button class="btn s" id="cdm">Crear demanda</button></div>`;
    $('#mn').appendChild(box);
    if ($('#cdm')) $('#cdm').onclick = guard(async () => { const d2 = await api('/admin/demandas', { method: 'POST', body: { nombre: c.nombre, telefono: c.telefono, leadId: id, notas: c.interes || '', origen: c.origen || 'Lead' } }); location.hash = '#demanda/' + d2.id; });
  }
};
V.conexion = async (m) => {
  const c = await nApi('/conexion'); m = shell('conexion');
  m.innerHTML = top(`Entrada de leads · ${NEGS[NEG].n}`, 'Dirección privada a la que la web y los formularios mandan cada contacto nuevo.') +
    `<div class="card sec"><p class="mu" style="margin-top:0">Los formularios de la web y el script de Google la usan para meter cada contacto en el embudo al momento. No la compartas.</p><div class="row"><input id="cu" readonly value="${esc(c.url)}" style="flex:1;min-width:240px"><button class="btn g" id="cc">${IC.copy}Copiar</button></div>
    <p class="mu sm">Formato: POST con JSON {nombre, telefono, email, origen, interes, mensaje, ref}. Si el teléfono ya existe, se añade al historial de ese cliente en vez de duplicarlo.</p></div>`;
  $('#cc').onclick = () => navigator.clipboard.writeText($('#cu').value).then(() => toast('Copiado'));
};


// ---------- Plata Marine: demandas de compradores ("Te busco barco" + alertas) cruzadas con los barcos en venta ----------
const TIPOS_B = { velero: 'Velero', open: 'Open', sundeck: 'Sundeck / bowrider', walkaround: 'Walkaround', cabinado: 'Cabinado', pilothouse: 'Pilothouse', fly: 'Fly', rib: 'Semirrígida', 'moto-agua': 'Moto de agua' };
const TITULOS_B = ['Sin titulación', 'Licencia de Navegación', 'PNB', 'PER', 'Patrón o Capitán de Yate'];
const ZONAS_BB = { barcelona: 'Barcelona', maresme: 'Maresme', 'costa-brava': 'Costa Brava', garraf: 'Garraf y Tarragona', delta: 'Delta del Ebro', baleares: 'Baleares', valencia: 'C. Valenciana', galicia: 'Galicia' };
const resumenDem = (c = {}) => [c.tipo && TIPOS_B[c.tipo], (c.esloraMin || c.esloraMax) && `${c.esloraMin ? c.esloraMin + '–' : 'hasta '}${c.esloraMax || '…'} m`, (c.presuMin || c.presuMax) && `${c.presuMin ? eur(c.presuMin) + ' – ' : 'hasta '}${c.presuMax ? eur(c.presuMax) : '…'}`, c.zona && ZONAS_BB[c.zona], c.titulo !== undefined && TITULOS_B[c.titulo]].filter(Boolean).join(' · ') || 'Sin criterios todavía';
const formDem = (d = {}) => { const c = d.criterios || {}; const o = (obj, v, vacio) => `<option value="">${vacio}</option>` + Object.entries(obj).map(([k, t]) => `<option value="${k}"${String(v ?? '') === String(k) ? ' selected' : ''}>${t}</option>`).join('');
  return `<div class="fg"><label>Nombre *<input name="nombre" required value="${esc(d.nombre || '')}"></label><label>Teléfono<input name="telefono" inputmode="tel" value="${esc(d.telefono || '')}"></label>
  <label>Tipo de barco<select name="tipo">${o(TIPOS_B, c.tipo, 'Cualquiera')}</select></label><label>Zona<select name="zona">${o(ZONAS_BB, c.zona, 'Cualquiera')}</select></label>
  <label>Eslora mínima (m)<input name="esloraMin" inputmode="decimal" value="${c.esloraMin || ''}"></label><label>Eslora máxima (m)<input name="esloraMax" inputmode="decimal" value="${c.esloraMax || ''}"></label>
  <label>Presupuesto desde (€)<input name="presuMin" inputmode="numeric" value="${c.presuMin || ''}"></label><label>Presupuesto hasta (€)<input name="presuMax" inputmode="numeric" value="${c.presuMax || ''}"></label>
  <label>Su titulación<select name="titulo">${o(Object.fromEntries(TITULOS_B.map((t, i) => [i, t])), c.titulo, 'No lo sé')}</select></label><label>Estado<select name="estado">${['Activa', 'Pausada', 'Cerrada'].map((x) => `<option${x === (d.estado || 'Activa') ? ' selected' : ''}>${x}</option>`).join('')}</select></label>
  <label style="grid-column:1/-1">Gustos y lo que ya tiene (para filtrar tú)<textarea name="notas" rows="3" placeholder="p. ej. quiere mesa en popa, poco cabinado, nada llamativo">${esc(d.notas || '')}</textarea></label></div>`; };
const datosDem = (f) => { const v = Object.fromEntries(new FormData(f)); return { nombre: v.nombre, telefono: v.telefono, notas: v.notas, estado: v.estado, criterios: { tipo: v.tipo, zona: v.zona, esloraMin: v.esloraMin, esloraMax: v.esloraMax, presuMin: v.presuMin, presuMax: v.presuMax, titulo: v.titulo } }; };
V.demandas = async (m, arg) => {
  const r = await api('/admin/demandas'); m = shell('demandas'); const est = arg || 'Activa';
  const L = r.demandas.filter((d) => (d.estado || 'Activa') === est); const nCr = r.demandas.filter((d) => d.estado === 'Activa' && d.cruces.length).length;
  m.innerHTML = top('Demandas · Plata Marine', 'Lo que buscan tus compradores (Te busco barco y alertas de la web), cruzado al momento con los barcos en venta.', '<button class="btn" id="nd">+ Nueva demanda</button>') +
    `<div class="kp"><div class="card"><span>Activas</span><b>${r.demandas.filter((d) => d.estado === 'Activa').length}</b></div><div class="card"><span>Con barcos que encajan</span><b>${nCr}</b></div><div class="card"><span>Barcos en venta cruzados</span><b>${r.demandas[0] ? r.demandas[0].nBarcos : '—'}</b></div></div>
    <div class="filt">${['Activa', 'Pausada', 'Cerrada'].map((x) => `<button data-e="${x}" class="${x === est ? 'on' : ''}">${x}s</button>`).join('')}<button id="imp" class="g">Traer alertas de Leads</button></div>` +
    (L.length ? L.map((d) => `<a class="card sec ld" href="#demanda/${d.id}" style="display:block;color:inherit;text-decoration:none"><div class="hd"><div><b>${esc(d.nombre)}</b><span>${esc(resumenDem(d.criterios))}</span></div>${d.cruces.length ? `<span class="bd" style="position:static;background:var(--or);color:#fff;padding:4px 10px;border-radius:999px;white-space:nowrap">${d.cruces.length} encaja${d.cruces.length > 1 ? 'n' : ''}</span>` : ''}</div>
      <p class="mu sm" style="margin:6px 0 0">${esc(d.origen || '')}${(d.propuestos || []).length ? ` · ${d.propuestos.length} propuesto${d.propuestos.length > 1 ? 's' : ''}` : ''}${d.cruces[0] ? ` · mejor: ${esc(d.cruces[0].b.nombre)} (${d.cruces[0].pct} %)` : ''}</p></a>`).join('') : `<div class="card mu">No hay demandas ${est.toLowerCase()}s.</div>`);
  m.querySelectorAll('[data-e]').forEach((b) => (b.onclick = () => (location.hash = '#demandas/' + b.dataset.e)));
  $('#imp').onclick = guard(async () => { const x = await api('/admin/demandas/importar', { method: 'POST', body: {} }); toast(x.nuevas ? `${x.nuevas} demanda${x.nuevas > 1 ? 's' : ''} nueva${x.nuevas > 1 ? 's' : ''}` : 'No había alertas nuevas'); route(); });
  $('#nd').onclick = () => { const dm = modal(`<h3 style="margin-bottom:12px">Nueva demanda</h3><form id="df">${formDem()}<div class="row" style="justify-content:flex-end;margin-top:12px"><button type="button" class="btn g" id="dc">Cancelar</button><button class="btn">Guardar y cruzar</button></div></form>`);
    dm.querySelector('#dc').onclick = () => dm.remove();
    dm.querySelector('#df').onsubmit = guard(async (e) => { e.preventDefault(); const d = await api('/admin/demandas', { method: 'POST', body: datosDem(e.target) }); dm.remove(); location.hash = '#demanda/' + d.id; }); };
};
V.demanda = async (m, id) => {
  const d = await api('/admin/demandas/' + id); m = shell('demandas');
  const filaB = (b, extra) => `<div class="li" style="align-items:flex-start"><div style="min-width:0"><b>${esc(b.nombre)}</b>${b.reservado ? ' <span class="mu sm">(reservado)</span>' : ''}<br><span class="sm">${[b.precio && eur(b.precio), b.eslora && b.eslora + ' m', b.zonaTxt].filter(Boolean).map(esc).join(' · ')}${b.cartera ? '' : ' · <span class="mu">solo en la web</span>'}</span>${extra || ''}</div><div class="r" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${b.url ? `<a class="btn g s" target="_blank" rel="noopener" href="${esc(b.url)}">Ficha</a>` : ''}${b.cartera && b.id ? `<a class="btn g s" href="#barco/${b.id}">Cartera</a>` : ''}</div></div>`;
  m.innerHTML = top(esc(d.nombre), `${esc(resumenDem(d.criterios))}${d.origen ? ' · ' + esc(d.origen) : ''}`, `<a class="btn g" href="#demandas">Volver</a>${d.telefono ? `<a class="btn g" target="_blank" rel="noopener" href="${waLink(d.telefono)}">${IC.wa}WhatsApp</a>` : ''}`) +
    `<div class="card sec"><h3 style="margin-bottom:4px">Barcos que encajan · ${d.cruces.length}</h3><p class="mu sm" style="margin-bottom:10px">De tu cartera y de la web, ordenados por encaje. Marca "Propuesto" cuando se lo ofrezcas o "No le va" para que no vuelva a salir.</p>` +
    (d.cruces.length ? d.cruces.map((x) => filaB(x.b, `<br><span class="sm"><b style="color:var(--or)">${x.pct} %</b> ${[...x.si, ...x.ojo.map((o) => '⚠ ' + o)].map(esc).join(' · ')}</span><div class="row" style="margin-top:8px;gap:6px"><button class="btn s" data-p="${esc(x.b.key)}" data-n="${esc(x.b.nombre)}">Propuesto</button><button class="btn g s" data-x="${esc(x.b.key)}">No le va</button></div>`)).join('') : '<p class="mu">Ahora mismo no hay ningún barco en venta que encaje. Cuando entre uno en la cartera, te llegará un aviso al móvil.</p>') + '</div>' +
    ((d.propuestosB || []).length ? `<div class="card sec"><h3 style="margin-bottom:10px">Ya propuestos · ${d.propuestosB.length}</h3>${d.propuestosB.map((b) => filaB(b, `<div class="row" style="margin-top:8px"><button class="btn g s" data-r="${esc(b.key)}">Quitar</button></div>`)).join('')}</div>` : '') +
    `<form id="df" class="card sec"><h3 style="margin-bottom:12px">Qué busca</h3>${formDem(d)}<div class="row" style="justify-content:space-between;margin-top:12px"><button type="button" class="btn r s" id="dd">Borrar</button><button class="btn">Guardar y volver a cruzar</button></div></form>` +
    ((d.historial || []).length ? `<div class="card sec"><h3 style="margin-bottom:10px">Historial</h3>${d.historial.map((h) => `<div class="li"><div>${esc(h.t)}</div><div class="r">${fdt(h.d)}</div></div>`).join('')}</div>` : '') +
    ((d.descartados || []).length ? `<p class="mu sm">${d.descartados.length} barco${d.descartados.length > 1 ? 's' : ''} marcado${d.descartados.length > 1 ? 's' : ''} como "No le va". <a href="#" id="rec" style="color:var(--or)">Volver a mostrarlos</a></p>` : '');
  const put = (b) => api('/admin/demandas/' + id, { method: 'PUT', body: b });
  m.querySelectorAll('[data-p]').forEach((b) => (b.onclick = guard(async () => { await put({ proponer: b.dataset.p, nombreBarco: b.dataset.n }); toast('Marcado como propuesto'); route(); })));
  m.querySelectorAll('[data-x]').forEach((b) => (b.onclick = guard(async () => { await put({ descartar: b.dataset.x }); route(); })));
  m.querySelectorAll('[data-r]').forEach((b) => (b.onclick = guard(async () => { await put({ recuperar: b.dataset.r }); route(); })));
  if ($('#rec')) $('#rec').onclick = guard(async (e) => { e.preventDefault(); for (const k of d.descartados) await put({ recuperar: k }); route(); });
  $('#df').onsubmit = guard(async (e) => { e.preventDefault(); await put(datosDem(e.target)); toast('Guardado'); route(); });
  $('#dd').onclick = guard(async () => { if (!confirm('¿Borrar esta demanda?')) return; await api('/admin/demandas/' + id, { method: 'DELETE' }); location.hash = '#demandas'; });
};
// ---------- Trimestre de Plata Marine y Rotulito (facturas emitidas en Holded) ----------
V.ntrimestre = async (m, arg) => {
  const now = new Date(); const [y0, q0] = (arg || '').split('-').map(Number); const y = y0 || now.getFullYear(), q = q0 || Math.floor(now.getMonth() / 3) + 1;
  m = shell('trimestre'); m.innerHTML = top(`Trimestre ${q}T ${y} · ${NEGS[NEG].n}`, 'Leyendo tus facturas de Holded…');
  const d = await api(`/admin/ntrimestre/${NEG}?y=${y}&q=${q}`);
  const prev = q === 1 ? `${y - 1}-4` : `${y}-${q - 1}`, next = q === 4 ? `${y + 1}-1` : `${y}-${q + 1}`; const t = (k) => Math.round(d.rows.reduce((a, r) => a + (r[k] || 0), 0) * 100) / 100;
  const avisoRet = d.rows.filter((r) => r.empresa && !r.ret);
  const selNeg = (r) => `<select data-c="${esc(r.id)}" aria-label="Negocio de la factura ${esc(r.num)}"><option value="marine"${r.neg === 'marine' ? ' selected' : ''}>Plata Marine</option><option value="rotulito"${r.neg === 'rotulito' ? ' selected' : ''}>Rotulito</option><option value="garage"${r.neg === 'garage' ? ' selected' : ''}>Coches</option><option value=""${!r.neg ? ' selected' : ''}>Sin asignar</option></select>`;
  const tabla = (l) => l.map((r) => `<div class="li" style="display:block;padding:12px 0"><div class="row" style="justify-content:space-between;gap:8px;align-items:flex-start"><div style="min-width:0"><b>${esc(r.num)}</b>&nbsp; <span class="mu sm">${fdate(r.fecha)}</span><br>${esc(r.cliente)}${r.empresa ? ' <span class="mu sm">(empresa)</span>' : ''}${r.concepto ? `<br><span class="mu sm">${esc(r.concepto)}</span>` : ''}</div><b style="white-space:nowrap">${eur(r.total)}</b></div>
    <div class="row" style="justify-content:space-between;gap:8px;margin-top:8px;flex-wrap:wrap"><span class="sm">Base ${eur(r.base)} · IVA ${eur(r.iva)}${r.ret ? ' · Retención ' + eur(r.ret) : ''}</span>${selNeg(r)}</div></div>`).join('');
  m.innerHTML = top(`Trimestre ${q}T ${y} · ${NEGS[NEG].n}`, 'Facturas emitidas en Holded en el trimestre: base, IVA y retención. Para revisar y mandar a la gestoría.', `<a class="btn g" href="#trimestre/${prev}">‹ Anterior</a><a class="btn g" href="#trimestre/${next}">Siguiente ›</a>`) +
    (avisoRet.length ? `<div class="card sec hl"><b>Facturas a empresa sin retención:</b> ${avisoRet.map((r) => esc(r.num + ' · ' + r.cliente)).join(' · ')}. Consulta a Josep si debían llevar retención de IRPF antes de presentar el trimestre.</div>` : '') +
    `<div class="kp"><div class="card"><span>Facturas</span><b>${d.rows.length}</b></div><div class="card"><span>Base (para el 130)</span><b>${eur(t('base'))}</b></div><div class="card"><span>IVA repercutido (303)</span><b>${eur(t('iva'))}</b></div><div class="card"><span>Retenciones que te han hecho</span><b>${eur(t('ret'))}</b></div></div>` +
    `<div class="card sec"><h3 style="margin-bottom:10px">Facturas de ${esc(NEGS[NEG].n)}</h3>${d.rows.length ? tabla(d.rows) + `<div class="row" style="margin-top:12px"><button class="btn s" id="zp">Descargar ZIP para la gestoría</button></div>` : '<p class="mu">No hay facturas de este negocio en el trimestre.</p>'}</div>` +
    (d.otras.length ? `<div class="card sec"><h3 style="margin-bottom:4px">Sin asignar · ${d.otras.length}</h3><p class="mu sm" style="margin-bottom:10px">No sé de qué negocio son por el concepto. Elige el negocio y se queda guardado.</p>${tabla(d.otras)}</div>` : '') +
    `<p class="mu sm">Datos leídos de Holded, solo lectura: aquí no se crea ni se cambia ninguna factura. Los gastos y los modelos los revisa la gestoría, que tiene la última palabra.</p>`;
  m.querySelectorAll('[data-c]').forEach((s) => (s.onchange = guard(async () => { await api(`/admin/ntrimestre/${NEG}/clasificar`, { method: 'PUT', body: { id: s.dataset.c, neg: s.value } }); toast('Guardado'); route(); })));
  if ($('#zp')) $('#zp').onclick = guard(async () => { const b = $('#zp'); b.disabled = true; b.textContent = 'Preparando…';
    try { const files = []; const enc = new TextEncoder();
      const csv = '﻿' + [['Factura', 'Fecha', 'Cliente', 'Concepto', 'Base', 'IVA', 'Retención', 'Total'], ...d.rows.map((r) => [r.num, r.fecha, r.cliente, r.concepto, r.base, r.iva, r.ret, r.total])].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';')).join('\r\n');
      files.push({ name: `facturas-emitidas-${q}T${y}.csv`, data: enc.encode(csv) });
      for (const r of d.rows) { const res = await fetch(`${API}/admin/ntrimestre/${NEG}/pdf/${encodeURIComponent(r.id)}`, { credentials: 'same-origin' }); if (res.ok) files.push({ name: `${String(r.num).replace(/[\\/:*?"<>|]/g, '-')} - ${slug(r.cliente)}.pdf`, data: new Uint8Array(await res.arrayBuffer()) }); }
      const a = document.createElement('a'); a.href = URL.createObjectURL(zip(files)); a.download = `${slug(NEGS[NEG].n)}-${q}T${y}.zip`; a.click(); toast('ZIP listo');
    } finally { b.disabled = false; b.textContent = 'Descargar ZIP para la gestoría'; } });
};
// ---------- router ----------
// Deslizar hacia abajo desde arriba del todo para actualizar (como en otras apps)
(() => {
  let y0 = null, dy = 0, busy = false; const ind = document.createElement('div'); ind.id = 'ptr'; ind.textContent = '↓ Suelta para actualizar'; document.body.appendChild(ind);
  const tope = () => (window.scrollY || document.documentElement.scrollTop) <= 0;
  window.addEventListener('touchstart', (e) => { y0 = !busy && tope() && e.touches.length === 1 && $('#mn') ? e.touches[0].clientY : null; dy = 0; }, { passive: true });
  window.addEventListener('touchmove', (e) => { if (y0 === null) return; dy = e.touches[0].clientY - y0; if (dy <= 0 || !tope()) { ind.style.transform = ''; return; } const h = Math.min(dy * 0.5, 70); ind.style.transform = `translate(-50%, ${h}px)`; ind.style.opacity = Math.min(1, h / 50); ind.textContent = h >= 55 ? '↻ Suelta para actualizar' : '↓ Desliza para actualizar'; }, { passive: true });
  window.addEventListener('touchend', async () => { if (y0 === null) return; const ok = dy * 0.5 >= 55; y0 = null; if (!ok) { ind.style.transform = ''; ind.style.opacity = 0; return; } busy = true; ind.textContent = 'Actualizando…'; try { await route(); } finally { busy = false; ind.style.transform = ''; ind.style.opacity = 0; } });
})();
// Al volver a la app (móvil), recarga la pantalla de listas para ver lo último
let lastVis = Date.now();
document.addEventListener('visibilitychange', () => { if (document.visibilityState !== 'visible') { lastVis = Date.now(); return; } const k = (location.hash.slice(1) || '').split('/')[0]; if (Date.now() - lastVis > 5000 && $('#mn') && ['', 'leads', 'resumen', 'clientes', 'reservas'].includes(k)) route(); });
async function route() {
  const [k, arg] = (location.hash.slice(1) || home().slice(1)).split('/');
  const fn = NEG === 'garage' ? (V[k] || V.leads) : ({ leads: V.nleads, cartera: V.cartera, barco: V.barco, astilleros: NEG === 'marine' ? V.astilleros : null, astillero: NEG === 'marine' ? V.astillero : null, demandas: NEG === 'marine' ? V.demandas : null, demanda: NEG === 'marine' ? V.demanda : null, visitas: analiticasWeb, trimestre: V.ntrimestre, resumen: V.nresumen, analiticas: V.nanalisis, clientes: V.nclientes, ncliente: V.ncliente, conexion: V.conexion }[k] || V.nresumen);
  try { await fn($('#mn'), arg); window.scrollTo(0, 0); } catch (e) { if (e.message !== 'Sesión caducada') { shell(k).innerHTML = `<div class="card">No se ha podido cargar: ${esc(e.message)}</div>`; } }
}
let polling = null;
async function boot() {
  try { const me = await api('/admin/me'); MIS = me.negs || ['garage']; ROL = me.role || ''; QUIEN_YO = me.id === 'admin' ? 'Juan' : (me.name || me.id); if (!MIS.includes(NEG)) { NEG = MIS[0]; try { localStorage.setItem('pg_neg', NEG); } catch (e) { /* */ } } } catch (e) { return; }
  // La app instalada antigua abría en #resumen: en Plata Garage, la primera vez se va a Leads
  if (PRIMERA) { PRIMERA = false; if (location.hash === '#resumen' || !location.hash) history.replaceState(null, '', location.pathname + '#leads'); }
  if (NEG !== 'garage') { route(); return; }
  try { const s = await api('/admin/summary'); badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, financiaciones: s.financiacionesPendientes, mensajes: s.mensajesSinLeer, busquedas: s.busquedasPendientes }; route(); if (!polling) { poll(); polling = setInterval(poll, 60000); } } catch (e) { /* login ya mostrado */ }
}
let swReg = null;
// Avisos push: llegan al móvil aunque la app esté cerrada (en iPhone, con la app añadida a la pantalla de inicio)
const b64u = (t) => { const p = '='.repeat((4 - (t.length % 4)) % 4); const r = atob((t + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(r, (c) => c.charCodeAt(0)); };
async function pushEstado() {
  const el = $('#pusht'); if (!el) return;
  try { const r = swReg || (await navigator.serviceWorker.ready); const s = r && r.pushManager && (await r.pushManager.getSubscription()); el.textContent = s && Notification.permission === 'granted' ? 'Avisos activados ✓' : 'Activar avisos en este móvil'; } catch (e) { el.textContent = 'Activar avisos en este móvil'; }
}
async function activarPush() {
  const ios = /iPhone|iPad/.test(navigator.userAgent), inst = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return toast(ios && !inst ? 'En el iPhone: Compartir → "Añadir a pantalla de inicio" y abre la app desde ese icono' : 'Este navegador no admite avisos', true);
  try {
    if ((await Notification.requestPermission()) !== 'granted') return toast('Has bloqueado los avisos: actívalos en Ajustes → Notificaciones', true);
    const r = swReg || (await navigator.serviceWorker.ready);
    let s = await r.pushManager.getSubscription();
    if (!s) { const { key } = await api('/admin/push'); s = await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(key) }); }
    await api('/admin/push', { method: 'POST', body: { sub: s.toJSON() } });
    toast('Avisos activados. Te acaba de llegar uno de prueba'); pushEstado();
  } catch (e) { toast('No se han podido activar: ' + (e.message || e), true); }
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register(B + '/admin-sw.js', { scope: B + '/admin' }).then((r) => (swReg = r)).catch(() => {});

window.addEventListener('hashchange', () => $('.lay') && route());
boot();
})();

// Reservas web: confirmar el pago de la señal (envía el documento) o avisar de que no está disponible
document.addEventListener('click', async (e) => {
  const c = e.target.closest('[data-rc]'), n = e.target.closest('[data-rn]'); if (!c && !n) return;
  e.preventDefault(); const id = (c || n).dataset.rc || (c || n).dataset.rn;
  if (c && !confirm('¿Has comprobado en el banco que ha entrado la señal? Se enviará el documento de reserva al cliente y el coche pasará a Reservado.')) return;
  if (n && !confirm('¿Avisar al cliente de que el coche ya no está disponible?')) return;
  (c || n).disabled = true;
  try {
    const r = await api(`/admin/reservas/${id}/${c ? 'confirmar' : 'nodisponible'}`, { method: 'PUT', body: c ? { metodo: (document.querySelector(`[data-rm="${id}"]`) || {}).value || '' } : {} });
    toast(r.enviado ? (c ? 'Reserva confirmada y documento enviado' : 'Cliente avisado') : 'Hecho, pero el email no salió: escríbele por WhatsApp'); route();
  } catch (err) { toast(err.message || 'Error'); (c || n).disabled = false; }
});
