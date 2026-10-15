// Plata Garage · web pública + panel de gestión (Netlify Functions + Netlify Blobs)
import { getStore as nfGetStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import seed from './seed.mjs';
import * as V from './views.mjs';
import QRCode from 'qrcode';
import * as SEO from './seo.mjs';
import * as I18N from './i18n.mjs';

export const config = {
  path: ['/*'],
  excludedPath: ['/platagarage/assets/*', '/platagarage/img/*', '/assets/*', '/img/*', '/.netlify/*', '/googledd8c57b3752e5141.html'],
};

const BASE = ''; // la web vive en la raíz del dominio
const ST = '/platagarage'; // archivos estáticos y direcciones antiguas
// Hasta la migración al dominio definitivo la web no se indexa (PG_INDEX=1 la abre a Google)
const INDEX = () => env('PG_INDEX') === '1';
const TZ = 'Europe/Madrid';
const env = (k) => (globalThis.Netlify?.env?.get?.(k)) ?? process.env[k];
const store = (name) => (globalThis.__pgGetStore || nfGetStore)({ name, consistency: 'strong' });
const db = () => store('platagarage');
const media = () => store('platagarage-media');

// ---------- datos ----------
const DEFAULTS = { cars: seed.cars, holders: seed.holders, schedule: seed.schedule, bookings: [], tasaciones: [], envios: [], mensajes: [], posts: [], alertas: [], busquedas: [], users: [], authver: { admin: 0 }, clientes: [], portales: [], 'leads-marine': [], 'leads-rotulito': [], 'gastos-marine': {}, 'gastos-rotulito': {}, pushsubs: [], vapid: {}, docs: {}, 'cartera-marine': [], 'demandas-marine': [], 'holded-neg': {} };
async function load(key) {
  const v = await db().get(key, { type: 'json' });
  if (v == null) { const d = structuredClone(DEFAULTS[key]); await db().setJSON(key, d); return d; }
  return v;
}
const save = (key, v) => db().setJSON(key, v);
// Clave de cifrado de los documentos: PG_DOCS_KEY si existe; si no, sale del secreto de sesión (no cambiar ese secreto sin fijar antes PG_DOCS_KEY)
const docKey = () => crypto.createHash('sha256').update('docs|' + (env('PG_DOCS_KEY') || secret())).digest();
const uid = (p = '') => p + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');

// ---------- utilidades ----------
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...headers } });
const html = (body, status = 200, extra = {}) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate', 'x-robots-tag': INDEX() ? 'index, follow' : 'noindex, nofollow', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', ...extra } });
const text = (body, type) => new Response(body, { headers: { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'public, max-age=300' } });
const redirect = (to, status = 301) => new Response(null, { status, headers: { location: to, 'cache-control': 'no-store' } });
export const slugify = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const clip = (v, n) => { const s = String(v ?? '').trim(); return (s === 'undefined' || s === 'null' ? '' : s).slice(0, n); };
const num = (v) => { if (v === '' || v == null) return null; const n = Number(String(v).replace(/[^\d.-]/g, '')); return Number.isFinite(n) ? n : null; };
const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(new Date());
const nowHM = () => new Intl.DateTimeFormat('es-ES', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dow = (iso) => new Date(iso + 'T12:00:00Z').getUTCDay();

export function normPhone(p) {
  const s = String(p || '').replace(/[\s().\-]/g, '');
  if (/^(\+34|0034)?[6789]\d{8}$/.test(s)) return s.replace(/^(0034)/, '+34');
  if (/^\+(?!34)\d{8,14}$/.test(s)) return s;
  return null;
}
const isEmail = (e) => !e || /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(e);
const isName = (n) => /^[\p{L}][\p{L} .'\-]{1,79}$/u.test(n);

// ---------- sesión y usuarios ----------
const secret = () => env('PG_SESSION_SECRET') || crypto.createHash('sha256').update('pg|' + (env('PG_ADMIN_PASSWORD') || '')).digest('hex');
function sign(v) { return crypto.createHmac('sha256', secret()).update(v).digest('base64url'); }
// El token incluye el usuario y su "versión": al cambiar la contraseña de un usuario se cierran sus sesiones
// La sesión dura 400 días (máximo que admiten los navegadores) y se renueva sola con el uso
const SES_DIAS = 400;
function makeToken(uidv, ver = 0) { const exp = Date.now() + SES_DIAS * 864e5; const p = `u.${uidv}.${ver}.${exp}`; return `${p}.${sign(p)}`; }
async function sessionUser(req) {
  if (!env('PG_ADMIN_PASSWORD')) return null;
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)pg_s=([^;]+)/);
  if (!m) return null;
  const parts = m[1].split('.'); if (parts.length !== 5 || parts[0] !== 'u') return null;
  const [, id, ver, exp, sig] = parts;
  if (Number(exp) < Date.now()) return null;
  const good = sign(`u.${id}.${ver}.${exp}`);
  if (good.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig))) return null;
  const ses = { exp: Number(exp), ver };
  if (id === 'admin') { const av = (await load('authver')).admin || 0; if (String(av) !== ver) return null; return { id: 'admin', name: 'Administrador', role: 'admin', negs: ['garage', 'marine', 'rotulito'], ses }; }
  const u = (await load('users')).find((x) => x.id === id);
  if (!u || String(u.ver || 0) !== ver || u.disabled) return null;
  // Negocios a los que puede entrar: el administrador a todos; el resto, a los que tenga marcados (por defecto solo Plata Garage)
  const negs = u.role === 'admin' ? ['garage', 'marine', 'rotulito'] : (u.negs && u.negs.length ? u.negs : ['garage']);
  return { id: u.id, name: u.name, role: u.role || 'editor', negs, ses };
}
const cookie = (v, maxAge) => `pg_s=${v}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
const eqHash = (a, b) => { const x = crypto.createHash('sha256').update(String(a)).digest(), y = crypto.createHash('sha256').update(String(b)).digest(); return crypto.timingSafeEqual(x, y); };
const hashPass = (pw, salt = crypto.randomBytes(16).toString('hex')) => ({ salt, hash: crypto.scryptSync(String(pw), salt, 64).toString('hex') });
const checkPass = (pw, u) => { const h = crypto.scryptSync(String(pw), u.salt, 64); const g = Buffer.from(u.hash, 'hex'); return h.length === g.length && crypto.timingSafeEqual(h, g); };
const strong = (pw) => typeof pw === 'string' && pw.length >= 12 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);

// ---------- antispam ----------
async function rateLimited(ip, kind, max) {
  const k = `rl/${kind}/${slugify(ip || 'x')}/${new Date().toISOString().slice(0, 13)}`;
  const n = (await db().get(k, { type: 'json' })) || 0;
  if (n >= max) return true;
  await db().setJSON(k, n + 1);
  return false;
}
async function readForm(req) {
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await req.json();
  const fd = await req.formData(); const o = {}; for (const [k, v] of fd) o[k] = typeof v === 'string' ? v : ''; return o;
}
// Devuelve {error} o {data} con nombre/teléfono/email validados
function checkContact(f, { emailReq = false } = {}) {
  if (f.web) return { spam: true };                                        // honeypot
  const t = Number(f.t || 0); if (!t || Date.now() - t < 3000) return { spam: true };   // enviado demasiado rápido
  if (f.privacidad !== 'si' && f.privacidad !== true && f.privacidad !== 'on') return { error: 'Debes aceptar la política de privacidad.' };
  const nombre = clip(f.nombre, 80); if (!isName(nombre)) return { error: 'Escribe tu nombre.' };
  const telefono = normPhone(f.telefono); if (!telefono) return { error: 'Escribe un teléfono válido.' };
  const email = clip(f.email, 200).toLowerCase(); if (!isEmail(email) || (emailReq && !email)) return { error: emailReq && !email ? 'Escribe tu email.' : 'El email no es válido.' };
  if (/https?:\/\/|<a\s|\[url/i.test(String(f.mensaje || '') + String(f.notas || ''))) return { error: 'No se admiten enlaces en el mensaje.' };
  return { data: { nombre, telefono, email, origen: clip(f.origen, 160), canal: clip(f.canal, 60) } };
}

// ---------- horarios ----------
async function freeSlots(date, pre) {
  const t = today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < t || date > addDays(t, 60)) return [];
  const sch = pre?.sch || await load('schedule');
  const blk = (sch.blocks || []).filter((b) => b.date === date);
  if (blk.some((b) => b.allDay)) return [];
  const blockedH = new Set(blk.flatMap((b) => b.hours || []));
  const taken = new Set((pre?.bk || await load('bookings')).filter((b) => b.fecha === date && b.status !== 'cancelada').map((b) => b.hora));
  let hrs = (sch.week[String(dow(date))] || []).filter((h) => !blockedH.has(h) && !taken.has(h));
  if (date === t) { const [H, M] = nowHM().split(':').map(Number); const lim = H * 60 + M + 60; hrs = hrs.filter((h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b >= lim; }); }
  return hrs.sort();
}

// ---------- coches ----------
const pubCars = (cars) => cars.filter((c) => !c.sold && !c.hidden);
function cleanCar(b, old = {}) {
  const c = { ...old };
  const S = (k, n = 120) => { if (k in b) c[k] = clip(b[k], n); };
  ['brand', 'model', 'version', 'fuel', 'trans', 'body', 'color', 'holder', 'status', 'etiqueta', 'owner'].forEach((k) => S(k));
  if ('matricula' in b) c.matricula = clip(String(b.matricula).toUpperCase().replace(/[\s-]/g, ''), 12);
  if ('desc' in b) c.desc = clip(b.desc, 8000);
  if ('comment' in b) c.comment = clip(b.comment, 3000);
  ['year', 'km', 'price', 'cv', 'doors', 'seats', 'monthly', 'term', 'reserve'].forEach((k) => { if (k in b) c[k] = num(b[k]); });
  if ('features' in b) c.features = (Array.isArray(b.features) ? b.features : String(b.features).split('\n')).map((x) => clip(x, 120)).filter(Boolean).slice(0, 80);
  if ('images' in b) c.images = (b.images || []).filter((u) => typeof u === 'string' && u.startsWith(BASE + '/')).slice(0, 40);
  ['featured', 'sold', 'hidden'].forEach((k) => { if (k in b) c[k] = !!b[k]; });
  if ('video' in b) c.video = b.video && typeof b.video.url === 'string' && b.video.url.startsWith(BASE + '/media/v-') ? { url: clip(b.video.url, 200), type: clip(b.video.type, 40) || 'video/mp4', size: num(b.video.size) || 0 } : undefined;
  if ('gestion' in b) c.gestion = !!b.gestion;
  if ('comision' in b) c.comision = num(b.comision);
  if ('llegada' in b) c.llegada = /^\d{4}-\d{2}-\d{2}$/.test(b.llegada || '') ? b.llegada : undefined;
  if (!['disponible', 'preparacion', 'reservado'].includes(c.status)) c.status = 'disponible';
  return c;
}
// Si el coche es de Cristina o de Juan y no tiene titular para la señal, se asigna el suyo
async function holderPorDueno(c) {
  if (c.holder || !c.owner) return;
  const N = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const h = (await load('holders')).find((x) => N(x.name).includes(N(c.owner))); if (h) c.holder = h.id;
}
function carErrors(c) {
  const e = [];
  if (!c.brand) e.push('marca'); if (!c.model) e.push('modelo');
  if (!c.year || c.year < 1950 || c.year > 2100) e.push('año');
  if (c.km == null || c.km < 0) e.push('kilómetros'); if (!c.price || c.price < 0) e.push('precio');
  if (!c.fuel) e.push('combustible'); if (!c.trans) e.push('cambio'); if (!c.desc) e.push('descripción');
  return e;
}
function uniqueSlug(cars, c) {
  const base = slugify([c.brand, c.model, c.version, c.year].filter(Boolean).join(' ')) || 'coche';
  let s = base, i = 2;
  while (cars.some((x) => x.slug === s && x.id !== c.id)) s = `${base}-${i++}`;
  return s;
}

// ---------- SEO: sitemap y llms.txt ----------
const xesc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function sitemap(site, cars, posts) {
  const u = (path, lastmod, img = []) => `<url><loc>${xesc(site + BASE + path)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${img.slice(0, 10).map((i) => `<image:image><image:loc>${xesc(i.startsWith('http') ? i : site + i)}</image:loc></image:image>`).join('')}</url>`;
  const newest = cars.map((c) => c.updated || c.created || '').sort().pop() || today();
  const rows = [u('/', newest), u('/vehiculos/', newest), u('/cita'), u('/te-lo-buscamos'), u('/cuanto-vale-mi-coche'), u('/preguntas-frecuentes'), u('/contacto'), u('/blog/'), u('/aviso-legal'), u('/privacidad'), u('/cookies'), u('/condiciones-de-contratacion')];
  cars.forEach((c) => rows.push(u(`/vehiculos/${c.slug}`, c.updated || c.created, c.images || [])));
  SEO.tiposConStock(cars).forEach((t) => rows.push(u(`/coches/${t.slug}`, newest)));
  SEO.marcas(cars).forEach((m) => rows.push(u(`/coches/${m.slug}`, newest)));
  SEO.ZONAS.forEach((z) => rows.push(u(`/coches-segunda-mano-${z.slug}`, newest)));
  SEO.ZONAS_VENTA.forEach((z) => rows.push(u(`/vender-mi-coche-${z.slug}`)));
  posts.forEach((p) => rows.push(u(`/blog/${p.slug}`, p.updated || p.publishedAt)));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${rows.join('\n')}\n</urlset>`;
}
function llms(site, cars) {
  const S = site + BASE;
  const eur = (n) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(n) + ' €';
  return `# Plata Garage

> Compraventa de coches de segunda mano en Sabadell (Barcelona, Vallès Occidental). Todos los coches tienen garantía de 12 meses. Atención con cita previa: lunes a viernes de 9:30 a 19:30 y sábados de 10:00 a 14:00. Teléfono y WhatsApp: +34 660 49 32 28.

Atendemos a clientes de Sabadell, Terrassa, Sant Cugat, Barberà del Vallès, Cerdanyola, Ripollet, Sant Quirze, Castellar, Rubí, Barcelona y el resto del Vallès. Si el cliente no puede venir, se presupuesta el envío del coche a domicilio.

## Páginas principales
- [Coches en stock](${S}/vehiculos/): catálogo actualizado con precio, kilómetros, año y fotos
- [Pedir cita](${S}/cita): elegir día y hora para ver un coche
- [Te lo buscamos](${S}/te-lo-buscamos): encargo de un coche concreto según presupuesto
- [¿Cuánto vale mi coche?](${S}/cuanto-vale-mi-coche): valoración orientativa gratuita en 24 h laborables
- [Preguntas frecuentes](${S}/preguntas-frecuentes)

## Coches en stock (${cars.length})
${cars.map((c) => `- [${c.brand} ${c.model}${c.version ? ' ' + c.version : ''} (${c.year})](${S}/vehiculos/${c.slug}): ${eur(c.price)}, ${new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(c.km)} km, ${c.fuel}, ${c.trans}`).join('\n')}

Los datos son orientativos y no vinculantes; confírmalos con Plata Garage antes de decidir.
`;
}

// ---------- clientes (embudo) ----------
// Agrupa todas las solicitudes por teléfono y calcula la etapa del embudo de forma automática
const ETAPAS = ['nuevo', 'contactado', 'cita', 'visitado', 'financiera', 'reserva', 'vendido', 'transferencia', 'entregado', 'permiso', 'enviado', 'cerrado', 'perdido'];
const POSTVENTA = ['vendido', 'transferencia', 'entregado', 'permiso', 'enviado', 'cerrado'];
const MOTIVOS = ['Precio', 'Financiación denegada', 'Compró otro', 'No contesta', 'Pago en efectivo', 'Otro'];
// Solo lo que escribió el cliente (sin plantilla, código ni enlaces del portal); si no se distingue, nada
const msgPortal = (m) => { let t = String(m || ''); if (/<[a-z!]/i.test(t) || /Hola Plata Garage|Tienes un nuevo contacto|Email de coches/i.test(t)) return ''; t = t.replace(/\{[^\n]*\}/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim(); return /[{}"<>]/.test(t) ? '' : t.slice(0, 90); };
const ORIGEN_PG = (leads) => { const p = leads.find((l) => l.tipo === 'portal'); if (!p) return 'Web'; const f = String(p.fuente || ''); return /coches/i.test(f) ? 'Coches.net' : /wallapop/i.test(f) ? 'Wallapop' : (f || 'Portal'); };
const pkey = (t) => String(t || '').replace(/\D/g, '').slice(-9);
async function buildClientes() {
  const [b, t, e, m, bu, al, cars, cl, po] = await Promise.all(['bookings', 'tasaciones', 'envios', 'mensajes', 'busquedas', 'alertas', 'cars', 'clientes', 'portales'].map(load));
  const map = new Map();
  const add = (x, tipo, resumen) => {
    // Sin teléfono (p. ej. Coches.net no lo da en el aviso): clave estable a partir del id, para que el lead no se pierda
    const k = pkey(x.telefono) || (x.id ? '0' + String([...String(x.id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7) % 1e8).padStart(8, '0') : ''); if (!k) return;
    if (!map.has(k)) map.set(k, { key: k, nombre: x.nombre, telefono: x.telefono, email: x.email || '', leads: [] });
    const c = map.get(k); if (x.email && !c.email) c.email = x.email; if (x.nombre && (!c.nombre || (x.created || '') > (c.last || ''))) c.nombre = x.nombre;
    c.leads.push({ tipo, id: x.id, created: x.created || '', status: x.status, fuente: x.fuente, resumen, fecha: x.fecha, hora: x.hora, coche: x.coche, cocheNombre: x.cocheNombre, motivo: x.motivo, btipo: x.tipo });
    if ((x.created || '') > (c.last || '')) c.last = x.created || '';
  };
  b.forEach((x) => add(x, 'cita', `${x.tipo === 'reserva' ? 'Reserva' : 'Cita'} ${x.fecha || ''} ${x.hora || ''} · ${x.cocheNombre || x.motivo || ''}`));
  t.forEach((x) => add(x, 'tasacion', `Tasación: ${x.marca || ''} ${x.modelo || ''} ${x.anio || ''}`));
  e.forEach((x) => add(x, 'envio', `Envío a ${x.cp || ''} · ${x.cocheNombre || ''}`));
  m.forEach((x) => add(x, 'mensaje', `Mensaje: ${(x.asunto || x.mensaje || '').slice(0, 80)}`));
  po.forEach((x) => { const t = msgPortal(x.mensaje); add(x, 'portal', `${x.fuente || 'Portal'}${x.tipoContacto && x.tipoContacto !== 'Mensaje' ? ' · ' + x.tipoContacto : ''}${t ? ': ' + t : ''}`); });
  bu.forEach((x) => add(x, 'busqueda', `Busca: ${[x.marca, x.modelo].filter(Boolean).join(' ') || 'cualquiera'} hasta ${x.presupuesto || '?'} €`));
  const td = today(); const r = (s) => ETAPAS.indexOf(s);
  const out = [...map.values()].map((c) => {
    c.leads.sort((a, z) => z.created.localeCompare(a.created));
    const st = cl.find((x) => x.key === c.key) || {};
    const bought = cars.filter((x) => x.buyer === c.key);
    const cit = c.leads.filter((l) => l.tipo === 'cita');
    let auto = 'nuevo';
    if (c.leads.some((l) => l.status && l.status !== 'pendiente')) auto = 'contactado';
    if (cit.some((l) => l.status !== 'cancelada' && l.fecha >= td)) auto = 'cita';
    if (cit.some((l) => l.status === 'completada')) auto = 'visitado';
    if (cit.some((l) => l.btipo === 'reserva' && l.status === 'confirmada')) auto = 'reserva';
    if (bought.some((x) => x.sold)) auto = 'vendido';
    else if (bought.some((x) => x.status === 'reservado')) auto = r(auto) < r('reserva') ? 'reserva' : auto;
    // La etapa puesta a mano manda, salvo que después pase algo que haga avanzar al cliente
    let etapa = auto;
    if (st.etapa) { const newer = (c.last || '') > (st.at || ''); etapa = st.etapa === 'perdido' ? (newer ? auto : 'perdido') : (r(auto) > r(st.etapa) && auto !== 'perdido' ? auto : st.etapa); }
    let motivo = etapa === 'perdido' ? (st.motivo || '') : '';
    // Sin movimiento en 45 días y sin venta → se archiva sola como perdido
    const lastAct = [c.last, st.at].filter(Boolean).sort().pop() || '';
    if (![...POSTVENTA, 'perdido'].includes(etapa) && !cit.some((l) => l.fecha >= td) && lastAct && addDays(td, -45) > lastAct.slice(0, 10)) { etapa = 'perdido'; motivo = 'Sin movimiento (45 días)'; }
    // Hasta dónde llegó en el embudo (para la conversión paso a paso, aunque luego se haya perdido)
    const llego = Math.max(auto === 'perdido' ? 0 : r(auto), st.etapa && st.etapa !== 'perdido' ? r(st.etapa) : 0, etapa === 'perdido' ? 0 : r(etapa), st.maxr || 0);
    const fechas = st.fechas || {};
    const venta = bought.find((x) => x.sold);
    const desde = fechas[etapa] || (etapa === st.etapa ? st.at : '') || (etapa === 'vendido' && venta?.soldAt) || c.last || '';
    return { ...c, etapa, auto, manual: st.etapa || '', notas: st.notas || '', motivo, motivoTxt: st.motivoTxt || '', llego, desde, fechas, origen: ORIGEN_PG(c.leads), primero: c.leads[c.leads.length - 1]?.created || '',
      banco: st.banco || '', finEstado: st.finEstado || '', certificado: st.certificado || '', vendidoEl: venta?.soldAt || fechas.vendido || '', importe: venta?.price || 0,
      compras: bought.map((x) => ({ id: x.id, slug: x.slug, nombre: `${x.brand} ${x.model} (${x.year})`, sold: x.sold, soldAt: x.soldAt })), alerta: al.some((a) => a.email && a.email === c.email && a.status === 'activa') };
  });
  // Los que se han quitado de la lista no salen, salvo que vuelvan a escribir después
  return out.filter((c) => { const st = cl.find((x) => x.key === c.key); return !(st && st.borrado && (c.last || '') <= st.borrado); }).sort((a, z) => (z.last || '').localeCompare(a.last || ''));
}

// ---------- calendario iCal (suscripción desde Google o Apple Calendar) ----------
const icalToken = () => sign('ical-v1').slice(0, 32);
const ingestToken = () => sign('portales-v1').slice(0, 32);
// Otros negocios en el mismo panel: Plata Marine y Rotulito (embudo propio para cada uno)
// Cada negocio con sus tableros (máx. 7 pasos cada uno) y una columna común "Perdido" con motivo obligatorio
const NEGS = {
  marine: { nombre: 'Plata Marine', tableros: [
    { id: 'compradores', n: 'Compradores', e: ['Nuevo', 'Contactado', 'Visita', 'Oferta', 'Señal', 'Prueba de mar / peritaje', 'Aceptación'] },
    { id: 'cierre', n: 'Cierre', e: ['Pago y contrato', 'Titularidad', 'Entrega', 'Documentación enviada', 'Comisión cobrada'] },
    { id: 'vendedores', n: 'Vendedores', e: ['Primer contacto', 'Hoja y guía enviadas', 'Hoja firmada', 'Fotos recibidas', 'Publicado', 'Con interesados', 'Vendido'] }],
    motivos: ['Precio', 'Financiación denegada', 'Compró otro', 'No contesta', 'Vendió por su cuenta', 'Retira el barco', 'Otro'] },
  rotulito: { nombre: 'Rotulito', tableros: [
    { id: 'venta', n: 'Venta', e: ['Nuevo', 'Contactado', 'Presupuesto enviado', 'Aceptado y señal'] },
    { id: 'proyecto', n: 'Proyecto', e: ['Contenido recibido', 'En desarrollo', 'Revisión del cliente', 'Publicada', 'Cobrada'] }],
    motivos: ['Precio', 'Sin presupuesto', 'Contrató a otro', 'No contesta', 'Otro'] },
};
Object.values(NEGS).forEach((n) => { n.etapas = [...n.tableros.flatMap((t) => t.e), 'Perdido']; });
const esVendedor = (x) => /vend|captac|hoja|encargo|propietari/i.test(`${x.tipo || ''} ${x.interes || ''} ${x.origen || ''}`) && !/compr|busc/i.test(`${x.tipo || ''}`);
const etapaInicial = (neg, x) => (neg === 'marine' && esVendedor(x) ? 'Primer contacto' : 'Nuevo');
// Las etapas antiguas se pasan una vez a las nuevas (queda anotado en el historial)
const VIEJAS = {
  marine: (x) => { const v = esVendedor(x); return { 'Sin respuesta': v ? 'Primer contacto' : 'Nuevo', 'Conversación': v ? 'Primer contacto' : 'Contactado', 'Cualificado': v ? 'Primer contacto' : 'Contactado', 'Valoración enviada': 'Primer contacto', 'Hoja enviada': 'Hoja y guía enviadas', 'Encargo firmado': 'Hoja firmada', 'Cerrado': v ? 'Vendido' : 'Comisión cobrada', 'Descartado': 'Perdido' }[x.etapa]; },
  rotulito: (x) => ({ 'Propuesta enviada': 'Presupuesto enviado', 'Cliente': 'Aceptado y señal' }[x.etapa]),
};
function migrar(neg, list) {
  let n = 0; const d = new Date().toISOString();
  list.forEach((x) => { if (NEGS[neg].etapas.includes(x.etapa)) return; const nv = (VIEJAS[neg] && VIEJAS[neg](x)) || NEGS[neg].etapas[0];
    if (nv === 'Perdido') { x.antes = x.antes || etapaInicial(neg, x); if (!x.motivo) { x.motivo = 'Otro'; x.motivoTxt = `Marcado como "${x.etapa}" antes del cambio`; } }
    x.historial = [{ d, t: `Embudo nuevo: ${x.etapa} → ${nv}` }, ...(x.historial || [])].slice(0, 100); x.etapa = nv; x.desde = d; n++; /* los avisos de días cuentan desde el cambio */ });
  return n;
}
const negToken = (n) => sign('lead-' + n + '-v1').slice(0, 32);
async function addNegLead(neg, x) {
  const key = 'leads-' + neg; const list = await load(key);
  const ref = clip(x.ref, 160); if (ref && list.some((y) => (y.refs || []).includes(ref))) return false;
  const tel = normPhone(x.telefono) || clip(x.telefono, 20); const k = pkey(tel); const email = clip(x.email, 200).toLowerCase();
  const d = x.fecha && !isNaN(Date.parse(x.fecha)) ? new Date(x.fecha).toISOString() : new Date().toISOString();
  const nota = [clip(x.origen, 40), clip(x.interes, 160), clip(x.mensaje, 1500)].filter(Boolean).join(' · ');
  let it = list.find((y) => (k && y.key === k) || (!k && email && y.email === email));
  if (it) { it.historial = [{ d, t: nota || 'Nuevo contacto' }, ...(it.historial || [])].slice(0, 100); it.updated = d; if (ref) it.refs = [...(it.refs || []), ref].slice(-50); if (!it.email && email) it.email = email; }
  else { it = { id: uid('l'), key: k, nombre: clip(x.nombre, 80) || 'Sin nombre', telefono: tel, email, origen: clip(x.origen, 40), tipo: clip(x.tipo, 30), interes: clip(x.interes, 160), etapa: etapaInicial(neg, x), desde: d, notas: '', created: d, updated: d, historial: [{ d, t: nota || 'Primer contacto' }], refs: ref ? [ref] : [] }; list.unshift(it); }
  await save(key, list.slice(0, 5000));
  if (neg === 'marine' && /alerta|que-barco|busco/i.test(`${x.origen || ''} ${x.tipo || ''}`)) await addDemanda(x, it.id).catch((e) => console.error('demanda', e.message));
  return true;
}
function ical(bookings) {
  const e = (s) => String(s || '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const dt = (d, h, add = 0) => { const [H, M] = h.split(':').map(Number); const t = H * 60 + M + add; return `${d.replace(/-/g, '')}T${String(Math.floor(t / 60)).padStart(2, '0')}${String(t % 60).padStart(2, '0')}00`; };
  const ev = bookings.filter((b) => b.fecha && b.hora && b.status !== 'cancelada').map((b) => ['BEGIN:VEVENT', `UID:${b.id}@platagarage`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;TZID=Europe/Madrid:${dt(b.fecha, b.hora)}`, `DTEND;TZID=Europe/Madrid:${dt(b.fecha, b.hora, 30)}`,
    `SUMMARY:${e(`${b.tipo === 'reserva' ? 'Reserva' : 'Cita'}: ${b.nombre}${b.cocheNombre ? ' · ' + b.cocheNombre : ''}`)}`, `DESCRIPTION:${e(`Tel. ${b.telefono}${b.email ? ' · ' + b.email : ''}\nMotivo: ${b.motivo || ''}${b.mensaje ? '\nNotas: ' + b.mensaje : ''}\nEstado: ${b.status}`)}`, `STATUS:${b.status === 'confirmada' || b.status === 'completada' ? 'CONFIRMED' : 'TENTATIVE'}`, 'END:VEVENT'].join('\r\n'));
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Plata Garage//Citas//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Citas Plata Garage', 'X-WR-TIMEZONE:Europe/Madrid', 'REFRESH-INTERVAL;VALUE=DURATION:PT15M', 'X-PUBLISHED-TTL:PT15M',
    'BEGIN:VTIMEZONE', 'TZID:Europe/Madrid', 'BEGIN:STANDARD', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'END:STANDARD', 'BEGIN:DAYLIGHT', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'END:DAYLIGHT', 'END:VTIMEZONE', ...ev, 'END:VCALENDAR'].join('\r\n');
}

const SW_JS = `// Panel instalable: siempre carga la versión más reciente (sin guardar datos de clientes en el móvil)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
self.addEventListener('push', (e) => { let d = {}; try { d = e.data.json(); } catch (x) { /* */ } e.waitUntil(self.registration.showNotification(d.title || 'Plata Garage', { body: d.body || '', icon: '/platagarage/assets/icon-192.png', tag: d.tag || undefined, data: { url: d.url || '/admin' } })); });
self.addEventListener('notificationclick', (e) => { e.notification.close(); const u = (e.notification.data && e.notification.data.url) || '/admin'; e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => { if (cs[0]) { cs[0].focus(); return cs[0].navigate ? cs[0].navigate(u).catch(() => {}) : null; } return self.clients.openWindow(u); })); });
`;

// Aviso de bajada de precio a quien lo pidió en la ficha (con su consentimiento y baja en un clic)
async function avisarBajada(c, origin) {
  if (!env('PG_SMTP_USER') || !env('PG_SMTP_PASS')) return;
  const list = await load('alertas'); const fichaUrl = `${origin}${BASE}/vehiculos/${c.slug}`; let n = 0;
  const eurf = (v) => new Intl.NumberFormat('es-ES', { useGrouping: 'always' }).format(v) + ' €';
  for (const a of list.filter((x) => x.coche === c.slug && x.status === 'activa' && (x.ultimoAviso || x.precio || Infinity) > c.price)) {
    const baja = `${origin}${BASE}/api/baja?id=${a.id}&k=${sign('baja|' + a.id).slice(0, 22)}`;
    const nm = `${c.brand} ${c.model}${c.version ? ' ' + c.version : ''} (${c.year})`;
    const ok = await sendMail({ to: a.email, subject: `Ha bajado de precio: ${nm} · Plata Garage`, text: `Hola,\n\nNos pediste que te avisáramos si bajaba de precio el ${nm}. Ahora está a ${eurf(c.price)}.\n\nFotos, datos y cita: ${fichaUrl}\n\nUn saludo,\nPlata Garage · 660 49 32 28\n\nSi no quieres más avisos: ${baja}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#111"><p>Hola,</p><p>Nos pediste que te avisáramos si bajaba de precio el <b>${hesc(nm)}</b>. Ahora está a <b>${eurf(c.price)}</b>.</p><p><a href="${fichaUrl}" style="display:inline-block;background:#f76806;color:#000;text-decoration:none;font-weight:bold;padding:11px 20px;border-radius:999px">Ver el coche</a></p><p>Un saludo,<br>Plata Garage · 660 49 32 28</p><p style="font-size:12px;color:#777">Recibes este correo porque lo pediste en www.platagarage.com. <a href="${baja}" style="color:#777">Darme de baja</a>.</p></div>` }).catch(() => false);
    if (ok) { a.ultimoAviso = c.price; a.avisadoEl = today(); n++; }
  }
  if (n) await save('alertas', list);
}

// ---------- router ----------
const inner = async (req, context) => {
  const url = new URL(req.url);
  let p = url.pathname.replace(/\/+$/, '') || '/';
  const M = req.method;
  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || '';
  try {
    let sub = p;
    if (p === ST || p.startsWith(ST + '/')) {
      const rest = p.slice(ST.length) || '/';
      if (rest.startsWith('/api/') || rest.startsWith('/media/') || rest === '/admin-sw.js') sub = rest;
      else return redirect(rest + url.search);
    }

    // ---- fotos subidas desde el panel ----
    if (sub.startsWith('/media/')) {
      const key = sub.slice(7);
      if (key.startsWith('v-')) return await serveVideo(key, req);
      const r = await media().getWithMetadata(key, { type: 'arrayBuffer' });
      if (!r) return new Response('No encontrado', { status: 404 });
      return new Response(r.data, { headers: { 'content-type': r.metadata?.type || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
    }

    // ---- API ----
    if (sub.startsWith('/api/')) return await api(sub.slice(4), req, M, ip, url, context);

    // ---- panel ----
    if (sub === '/admin') return html(V.adminShell(), 200, { 'cache-control': 'no-store' });
    if (sub === '/admin-sw.js') return new Response(SW_JS, { headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-cache' } });

    // ---- web pública ----
    const site = (env('PG_SITE_URL') || url.origin).replace(/\/+$/, '');
    V.setCtx({ site, index: INDEX(), gtag: clip(env('PG_GTAG_ID'), 20), pixel: clip(env('PG_META_PIXEL'), 20), clarity: clip(env('PG_CLARITY') || 'yx42pl2vd4', 20), gsv: clip(env('PG_GSV'), 80) });
    const cars = await load('cars');
    if (sub === '/robots.txt') return text(`User-agent: *\n${INDEX() ? `Allow: /\nDisallow: ${BASE}/admin\nDisallow: ${BASE}/api/\nDisallow: ${BASE}/gracias\n` : 'Disallow: /\n'}\nSitemap: ${site}${BASE}/sitemap.xml\n`, 'text/plain');
    if (sub === `/${INDEXNOW_KEY}.txt`) return text(INDEXNOW_KEY, 'text/plain');
    if (sub === '/sitemap.xml') return text(sitemap(site, pubCars(cars), (await load('posts')).filter((x) => x.published)), 'application/xml');
    if (sub === '/llms.txt') return text(llms(site, pubCars(cars)), 'text/plain');
    if (sub === '/') return html(V.home({ cars: pubCars(cars), sched: await load('schedule') }));
    if (sub === '/vehiculos') return html(V.catalog({ cars: pubCars(cars), q: Object.fromEntries(url.searchParams), vendido: url.searchParams.get('vendido') ? cars.find((c) => c.slug === url.searchParams.get('vendido') && c.sold) || null : null }));
    if (sub === '/preguntas-frecuentes') return html(V.faqPage({ cars: pubCars(cars) }));
    if (sub.startsWith('/coches-segunda-mano-')) {
      const z = SEO.ZONAS.find((x) => x.slug === sub.slice(21));
      if (!z) return redirect(`${BASE}/vehiculos/`);
      return html(V.zona({ z, cars: pubCars(cars) }));
    }
    if (sub.startsWith('/coches/')) {
      const l = SEO.landing(sub.slice(8), pubCars(cars));
      if (!l) return redirect(`${BASE}/vehiculos/`);
      return html(V.landingPage({ l, cars: pubCars(cars) }), 200, l.cars.length ? {} : { 'x-robots-tag': 'noindex, follow' });
    }
    if (sub.startsWith('/vehiculos/')) {
      const slug = sub.slice(11).replace(/\.html$/, '');
      if (sub.endsWith('.html')) return redirect(`${BASE}/vehiculos/${slug}`);
      const car = cars.find((c) => c.slug === slug || (c.oldSlugs || []).includes(slug));
      if (car && car.sold) return redirect(`${BASE}/vehiculos/?vendido=${encodeURIComponent(car.slug)}`); // vendido: 301 al stock, con la oferta de buscarle uno igual
      if (!car || car.hidden) return redirect(`${BASE}/vehiculos/`);
      if (car.slug !== slug) return redirect(`${BASE}/vehiculos/${car.slug}`);
      const fichaUrl = `${url.origin}${BASE}/vehiculos/${car.slug}`;
      const qr = await QRCode.toString(fichaUrl, { type: 'svg', margin: 0, width: 96 }).catch(() => '');
      return html(V.ficha({ car, cars: pubCars(cars), holders: await load('holders'), qr, fichaUrl }));
    }
    if (sub === '/cita') return html(V.cita({ cars: pubCars(cars), coche: url.searchParams.get('coche') || '', motivo: url.searchParams.get('motivo') || '' }));
    if (sub === '/contacto') return html(V.contacto({ cars: pubCars(cars) }));
    if (sub === '/privacidad') return html(V.privacidad());
    if (sub === '/aviso-legal') return html(V.avisoLegal());
    if (sub === '/condiciones-de-contratacion') return html(V.condiciones());
    if (sub === '/te-lo-buscamos') return html(V.teLoBuscamos({ cars: pubCars(cars) }));
    if (sub.startsWith('/vender-mi-coche-')) { const z = SEO.ZONAS_VENTA.find((x) => x.slug === sub.slice(17)); if (!z) return redirect(`${BASE}/cuanto-vale-mi-coche`); return html(V.cuantoVale({ z })); }
    if (sub === '/cuanto-vale-mi-coche') return html(V.cuantoVale({ car: pubCars(cars).find((c) => c.slug === url.searchParams.get('coche')) }));
    if (sub === '/favoritos') return html(V.favoritos({ cars: pubCars(cars) }), 200, { 'x-robots-tag': 'noindex' });
    if (sub === '/comparar') { const sl = (url.searchParams.get('c') || '').split(',').slice(0, 3); return html(V.comparar({ cars: sl.map((x) => pubCars(cars).find((c) => c.slug === x)).filter(Boolean) }), 200, { 'x-robots-tag': 'noindex' }); }
    if (sub === '/cookies') return html(V.cookies());
    if (sub === '/gracias') {
      const ref = clip(url.searchParams.get('r'), 40), k = clip(url.searchParams.get('k'), 16);
      let bk = null; if (ref && k.length === 16 && eqHash(k, sign('ref|' + ref).slice(0, 16))) bk = (await load('bookings')).find((x) => x.id === ref) || null;
      return html(V.gracias(url.searchParams.get('t') || '', { bk, car: bk?.coche ? cars.find((c) => c.slug === bk.coche) : null, cars: pubCars(cars) }), 200, { 'cache-control': 'no-store' });
    }
    if (sub === '/blog') return html(V.blogList({ posts: (await load('posts')).filter((x) => x.published) }));
    if (sub === '/blog/etiqueta-ambiental-dgt-que-coche-de-segunda-mano-puedes-comprar-en-barcelona-sin-restricciones-en-2026') return redirect(`${BASE}/vehiculos/`);
    if (sub.startsWith('/blog/')) {
      const post = (await load('posts')).find((x) => x.slug === sub.slice(6) && x.published);
      if (!post) return redirect(`${BASE}/blog/`);
      return html(V.blogPost({ post, cars: pubCars(cars) }));
    }
    return html(V.notFound(), 404);
  } catch (e) {
    console.error(e);
    return sub500(p);
  }
};
const sub500 = (p) => (p.includes('/api/') ? json({ error: 'Error interno. Inténtalo de nuevo.' }, 500) : html(V.notFound('Ha habido un error. Prueba de nuevo en un momento.'), 500));


// ---------- Plata Marine: demandas de compradores ("Te busco barco" y alertas de la web) y cruce con la cartera ----------
// Como las "demandas" de un CRM inmobiliario: criterios del comprador + cruce automático con los barcos en venta.
const TIPOS_B = ['velero', 'open', 'sundeck', 'walkaround', 'cabinado', 'pilothouse', 'fly', 'rib', 'moto-agua'];
const TIPO_TXT = { velero: 'Velero', open: 'Open', sundeck: 'Sundeck / bowrider', walkaround: 'Walkaround', cabinado: 'Cabinado', pilothouse: 'Pilothouse', fly: 'Fly', rib: 'Semirrígida', 'moto-agua': 'Moto de agua' };
const ZONAS_B = { barcelona: 'Barcelona', maresme: 'Maresme', 'costa-brava': 'Costa Brava', garraf: 'Garraf y Tarragona', delta: 'Delta del Ebro', baleares: 'Baleares', valencia: 'C. Valenciana', galicia: 'Galicia' };
const numB = (v) => { const n = Number(String(v ?? '').replace(/\s|€/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')); return isFinite(n) && n > 0 ? n : 0; };
function parseDemanda(txt) { // texto libre de la alerta de la web (ES/CA/EN/FR) → criterios
  const t = String(txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); const c = {};
  const T = [['velero', /velero|veler\b|sailboat|sailing|voilier/], ['rib', /semirrigid|semirigid|neumatic|pneumati|\brib\b/], ['fly', /flybridge|\bfly\b/], ['pilothouse', /pilothouse/], ['walkaround', /walk ?around/], ['sundeck', /sundeck|bowrider/], ['cabinado', /cabinad|cabinat|cruiser|cabin/], ['open', /\bopen\b|consola central|console centrale|centre console|center console/], ['moto-agua', /moto de agua|moto d'aigua|jet ?ski|scooter/]];
  const tp = T.find(([, r]) => r.test(t)); if (tp) c.tipo = tp[0];
  const m = t.match(/(eslora|length|longueur)[^|]*/); const e = m ? m[0] : '';
  if (e) { const ns = (e.match(/\d+(?:[.,]\d+)?/g) || []).map((x) => Number(x.replace(',', '.'))); if (/hasta|fins|up to|jusqu|menos|less/.test(e) && ns[0]) c.esloraMax = ns[0]; else if (/mas de|mes de|over|more|plus de/.test(e) && ns[0]) c.esloraMin = ns[0]; else if (ns.length >= 2) { c.esloraMin = ns[0]; c.esloraMax = ns[1]; } }
  const pm = t.match(/(presupuesto|pressupost|budget)[^|]*/); const pr = pm ? pm[0] : '';
  if (pr) { const ns = (pr.match(/\d{1,3}(?:[.,\s]\d{3})+|\d+/g) || []).map((x) => Number(x.replace(/[.,\s]/g, '')) * (/\d\s*k\b/.test(pr) ? 1000 : 1)); if (/menos|menys|less|under|moins/.test(pr) && ns[0]) c.presuMax = ns[0]; else if (/mas de|mes de|over|more|plus de/.test(pr) && ns[0]) c.presuMin = ns[0]; else if (ns.length >= 2) { c.presuMin = ns[0]; c.presuMax = ns[1]; } }
  const Z = [['barcelona', /barcelona/], ['maresme', /maresme/], ['costa-brava', /costa brava/], ['garraf', /garraf|tarragon/], ['delta', /delta|ebre|ebro/], ['baleares', /balear|baleares|mallorca|ibiza|menorca/]];
  const zm = t.match(/(zona|zone|area)[^|]*/); const zt = zm ? zm[0] : t; const z = Z.find(([, r]) => r.test(zt)); if (z) c.zona = z[0];
  return c;
}
const ZONA_DE = { cataluna: ['barcelona', 'maresme', 'costa-brava', 'garraf', 'delta'], baleares: ['baleares'], valencia: ['valencia'], galicia: ['galicia'] };
async function inventarioWeb() { // barcos publicados en www.platamarine.com (fuente: inventario.js), guardado 6 h
  const c = await db().get('inv-web', { type: 'json' }).catch(() => null); if (c && Date.now() - c.t < 6 * 36e5) return c.boats;
  try { const js = await (await fetch('https://www.platamarine.com/inventario.js', { signal: AbortSignal.timeout(6000) })).text();
    const a = js.indexOf('boats:'), b = js.indexOf('\n    ]', a); const arr = js.slice(js.indexOf('[', a), b + 6);
    const boats = JSON.parse(arr.replace(/\/\/[^\n]*/g, '').replace(/([{,]\s*)([a-zA-Z_]+)\s*:/g, '$1"$2":').replace(/'/g, '"').replace(/,\s*([\]}])/g, '$1'));
    await db().setJSON('inv-web', { t: Date.now(), boats }); return boats;
  } catch (e) { console.error('inventario', e.message); return (c && c.boats) || []; }
}
async function barcosEnVenta() {
  const [cart, web] = await Promise.all([load('cartera-marine'), inventarioWeb()]); const out = []; const vistos = new Set();
  for (const b of cart) { if (['Vendido', 'Retirado'].includes(b.estado)) continue; const sl = (String(b.web || '').match(/barcos\/([a-z0-9-]+)/) || [])[1]; const w = sl && web.find((x) => x.slug === sl); if (sl) vistos.add(sl);
    out.push({ key: 'c:' + b.id, id: b.id, nombre: b.barco, precio: b.precio || (w && w.price) || 0, eslora: b.eslora || (w && w.length) || 0, tipos: b.tipo ? [b.tipo] : (w ? (w.kind === 'vela' ? ['velero'] : w.kind === 'moto-agua' ? ['moto-agua'] : w.types || []) : []), titulo: b.titulo !== undefined && b.titulo !== '' ? Number(b.titulo) : (w ? w.title : null), zona: b.zonaKey || (w && (w.area || w.zone)) || '', zonaTxt: b.zona || '', url: w ? 'https://www.platamarine.com/barcos/' + w.slug : b.web || '', reservado: b.estado === 'Reservado' || (w && w.status === 'reserved'), cartera: true }); }
  for (const w of web) { if (vistos.has(w.slug) || w.status === 'sold') continue; out.push({ key: 'w:' + w.slug, nombre: w.name + (w.year ? ' (' + w.year + ')' : ''), precio: w.price || 0, eslora: w.length || 0, tipos: w.kind === 'vela' ? ['velero'] : w.kind === 'moto-agua' ? ['moto-agua'] : w.types || [], titulo: w.title, zona: w.area || w.zone || '', zonaTxt: (w.d && w.d.es || '').split(' · ').pop(), url: 'https://www.platamarine.com/barcos/' + w.slug, reservado: w.status === 'reserved', cartera: false }); }
  return out;
}
function cruce(d, b) { // % de encaje y por qué (los motivos que lo descartan del todo van en "no")
  const c = d.criterios || {}; let pts = 0, max = 0; const si = [], no = [], ojo = [];
  if (c.tipo) { max += 30; if (b.tipos.includes(c.tipo) || (c.tipo === 'cabinado' && b.tipos.some((x) => ['walkaround', 'pilothouse', 'fly'].includes(x)))) { pts += 30; si.push(TIPO_TXT[c.tipo]); } else if (!b.tipos.length) { pts += 12; ojo.push('tipo sin dato'); } else no.push('otro tipo'); }
  if (c.presuMax || c.presuMin) { max += 30; const p = b.precio; if (!p) { pts += 12; ojo.push('precio sin dato'); } else if (c.presuMax && p > c.presuMax * 1.15) no.push('se pasa de presupuesto'); else if (c.presuMin && p < c.presuMin * 0.7) { pts += 10; ojo.push('muy por debajo de su presupuesto'); } else if (c.presuMax && p > c.presuMax) { pts += 20; ojo.push('algo por encima (negociable)'); } else { pts += 30; si.push('dentro de presupuesto'); } }
  if (c.esloraMin || c.esloraMax) { max += 20; const e = b.eslora; if (!e) { pts += 8; ojo.push('eslora sin dato'); } else if ((c.esloraMin && e < c.esloraMin - 0.6) || (c.esloraMax && e > c.esloraMax + 0.6)) no.push('otra eslora'); else { pts += 20; si.push(e + ' m'); } }
  if (c.titulo !== undefined && c.titulo !== '' && c.titulo !== null) { max += 10; if (b.titulo == null) { pts += 5; ojo.push('titulación sin dato'); } else if (b.titulo <= Number(c.titulo)) { pts += 10; si.push('puede llevarlo'); } else no.push('necesita más titulación'); }
  if (c.zona) { max += 10; const ok = b.zona === c.zona || (ZONA_DE[b.zona] || []).includes(c.zona) || (c.zona === 'costa-brava' && b.zona === 'costa-brava'); if (ok) { pts += 10; si.push('en su zona'); } else { pts += 3; ojo.push('otra zona'); } }
  const pct = max ? Math.round(pts / max * 100) : 50; return { pct: no.length ? Math.min(pct, 40) : pct, si, no, ojo };
}
async function demandasCon(list) {
  const barcos = await barcosEnVenta();
  return list.map((d) => { const cr = barcos.map((b) => ({ b, ...cruce(d, b) })).filter((x) => !x.no.length && x.pct >= 60).sort((a, z) => z.pct - a.pct);
    const prop = new Set(d.propuestos || []), desc = new Set(d.descartados || []);
    return { ...d, cruces: cr.filter((x) => !prop.has(x.b.key) && !desc.has(x.b.key)), propuestosB: barcos.filter((b) => prop.has(b.key)), nBarcos: barcos.length }; });
}
async function addDemanda(x, leadId) { // desde una alerta de la web o desde un lead
  const list = await load('demandas-marine'); const tel = normPhone(x.telefono) || clip(x.telefono, 20); const crit = parseDemanda([x.interes, x.mensaje, x.detail].filter(Boolean).join(' | '));
  const it = list.find((d) => d.estado !== 'Cerrada' && ((leadId && d.leadId === leadId) || (tel && d.telefono === tel)));
  if (it) { it.criterios = { ...it.criterios, ...crit }; it.updated = new Date().toISOString(); } else list.unshift({ id: uid('d'), leadId: leadId || '', nombre: clip(x.nombre, 80) || 'Sin nombre', telefono: tel, origen: clip(x.origen, 40) || 'Web', estado: 'Activa', criterios: crit, notas: clip(x.mensaje, 1000), propuestos: [], descartados: [], created: new Date().toISOString() });
  await save('demandas-marine', list.slice(0, 2000)); return true;
}
async function avisarCruces(b) { // al entrar o cambiar un barco de la cartera: aviso al móvil con los compradores que encajan
  const ds = (await load('demandas-marine')).filter((d) => d.estado === 'Activa'); if (!ds.length) return;
  const barco = (await barcosEnVenta()).find((x) => x.key === 'c:' + b.id); if (!barco) return;
  const ok = ds.filter((d) => { const r = cruce(d, barco); return !r.no.length && r.pct >= 60 && !(d.descartados || []).includes(barco.key) && !(d.propuestos || []).includes(barco.key); });
  if (ok.length) await pushAll('marine', `${ok.length} comprador${ok.length > 1 ? 'es encajan' : ' encaja'} con ${clip(b.barco, 40)}`, ok.slice(0, 4).map((d) => String(d.nombre).split(' ')[0]).join(', ') + (ok.length > 4 ? '…' : ''), 'cruce-' + b.id).catch((e) => console.error('push', e.message));
}

// ---------- Trimestre de Plata Marine y Rotulito: facturas emitidas en Holded (API v1, solo lectura) ----------
const HV2 = async (path, raw) => { const r = await fetch('https://api.holded.com/api/v2' + path, { headers: { Authorization: 'Bearer ' + process.env.HOLDED_TOKEN, Accept: raw ? 'application/pdf' : 'application/json' }, signal: AbortSignal.timeout(15000) }); if (raw) return r; const t = await r.text(); let d; try { d = JSON.parse(t); } catch { d = t.slice(0, 300); } return { ok: r.ok, status: r.status, d }; };
const negFactura = (f) => { const t = [f.description, ...(f.tags || []), ...(f.lines || []).flatMap((p) => [p.name, p.description])].join(' ').toLowerCase();
  if (/matr[ií]cula|bastidor|\bkm\b|rebu|veh[ií]culo|coche|turismo/.test(t)) return 'garage';
  if (/barco|embarcaci|n[aá]utic|eslora|velero|lancha|semirr|yate|brok|intermediaci|comisi[oó]n|honorarios/.test(t)) return 'marine';
  if (/\bweb\b|p[aá]gina|dominio|hosting|mantenimiento|dise[nñ]o|landing|seo|rotulito/.test(t)) return 'rotulito'; return ''; };
const EMPRESA = /\b(s\.?\s?l\.?\s?u?\.?|s\.?\s?a\.?\s?u?\.?|sociedad|s\.?\s?coop|s\.?\s?l\.?\s?p\.?|ltd|gmbh|sarl|sas|c\.?\s?b\.?)\s*$/i;

// ---------- API ----------
async function api(r, req, M, ip, url, context) {
  // Públicas
  if (r === '/slots' && M === 'GET') return json({ slots: await freeSlots(url.searchParams.get('fecha') || '') });
  if (r === '/dias' && M === 'GET') {
    const mes = url.searchParams.get('mes') || ''; if (!/^\d{4}-\d{2}$/.test(mes)) return json({ dias: [] });
    const pre = { sch: await load('schedule'), bk: await load('bookings') }; const dias = [];
    const n = new Date(Date.UTC(+mes.slice(0, 4), +mes.slice(5, 7), 0)).getUTCDate();
    for (let d = 1; d <= n; d++) { const iso = `${mes}-${String(d).padStart(2, '0')}`; const sl = await freeSlots(iso, pre); if (sl.length) dias.push(iso); }
    return json({ dias });
  }
  if (r === '/hit' && M === 'POST') { await hit(req, context).catch(() => {}); return new Response(null, { status: 204 }); }
  if (r.startsWith('/w/') && M === 'POST') { await hitW(r.slice(3), req, context).catch(() => {}); return new Response(null, { status: 204 }); }
  if (r.startsWith('/ical/') && M === 'GET') {
    const tok = r.slice(6).replace(/\.ics$/, '');
    if (!env('PG_ADMIN_PASSWORD') || tok.length !== 32 || !eqHash(tok, icalToken())) return new Response('No encontrado', { status: 404 });
    return new Response(ical(await load('bookings')), { headers: { 'content-type': 'text/calendar; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
  }
  if (r.startsWith('/lead/') && M === 'POST') {
    const [, , neg, tok] = r.split('/'); if (!NEGS[neg] || !env('PG_ADMIN_PASSWORD') || (tok || '').length !== 32 || !eqHash(tok, negToken(neg))) return json({ error: 'No autorizado' }, 401);
    const b = await req.json().catch(() => ({})); let n = 0;
    const arr = (Array.isArray(b) ? b : [b]).slice(0, 50); for (const x of arr) if (await addNegLead(neg, x)) n++;
    if (n) await pushAll(neg, `${n > 1 ? n + ' leads nuevos' : 'Nuevo lead'} · ${NEGS[neg].nombre || neg}`, n > 1 ? '' : [clip(arr[0].nombre, 60), clip(arr[0].interes || arr[0].origen, 60)].filter(Boolean).join(' · '), 'lead-' + neg).catch((e) => console.error('push', e.message));
    return json({ ok: true, nuevos: n });
  }
  if (r.startsWith('/portal/') && M === 'POST') {
    const tok = r.slice(8); if (!env('PG_ADMIN_PASSWORD') || tok.length !== 32 || !eqHash(tok, ingestToken())) return json({ error: 'No autorizado' }, 401);
    const b = await req.json().catch(() => ({})); const items = Array.isArray(b) ? b : [b];
    const list = await load('portales'); let n = 0, fix = 0;
    for (const x of items.slice(0, 50)) {
      const ref = clip(x.ref, 120); if (!ref) continue;
      const old = list.find((y) => y.ref === ref);
      if (old) { if (x.repasar && old.status === 'pendiente' && !old.notas) { const t2 = normPhone(x.telefono) || clip(x.telefono, 20); Object.assign(old, { tipoContacto: clip(x.tipo, 40) || old.tipoContacto, nombre: clip(x.nombre, 80) || old.nombre, telefono: t2 || old.telefono, email: clip(x.email, 200).toLowerCase() || old.email, cocheNombre: clip(x.coche, 120) || old.cocheNombre, mensaje: clip(x.mensaje, 2000) }); fix++; } continue; }
      const tel = normPhone(x.telefono) || clip(x.telefono, 20);
      list.unshift({ id: uid('w'), ref, fuente: clip(x.fuente, 30), tipoContacto: clip(x.tipo, 40), nombre: clip(x.nombre, 80) || 'Sin nombre', telefono: tel, email: clip(x.email, 200).toLowerCase(), cocheNombre: clip(x.coche, 120), mensaje: clip(x.mensaje, 2000), created: x.fecha && !isNaN(Date.parse(x.fecha)) ? new Date(x.fecha).toISOString() : new Date().toISOString(), status: 'pendiente', notas: '' }); n++;
    }
    if (fix && !n) await save('portales', list.slice(0, 3000));
    if (n) { await save('portales', list.slice(0, 3000)); const x = list[0]; await pushAll('garage', n > 1 ? `${n} leads nuevos de portales` : `Nuevo lead de ${x.fuente || 'portal'}${x.tipoContacto ? ' (' + x.tipoContacto + ')' : ''}`, [x.nombre, x.cocheNombre].filter(Boolean).join(' · '), 'portal').catch((e) => console.error('push', e.message)); }
    return json({ ok: true, nuevos: n });
  }
  if (r === '/baja' && M === 'GET') {
    const id = clip(url.searchParams.get('id'), 40), k = clip(url.searchParams.get('k'), 64);
    const list = await load('alertas'); const a = list.find((x) => x.id === id);
    if (a && k.length === 22 && eqHash(k, sign('baja|' + id).slice(0, 22))) { list.filter((x) => x.email === a.email).forEach((x) => (x.status = 'baja')); await save('alertas', list); }
    return html(V.notFound('Listo: te hemos dado de baja y no te enviaremos más avisos.'), 200, { 'x-robots-tag': 'noindex' });
  }
  if (r === '/alerta' && M === 'POST') {
    const f = await readForm(req);
    if (f.web || !Number(f.t) || Date.now() - Number(f.t) < 2500) return json({ ok: true });
    const email = clip(f.email, 200).toLowerCase(); if (!email || !isEmail(email)) return json({ error: 'Escribe un email válido.' }, 400);
    if (f.consent !== 'si') return json({ error: 'Marca la casilla para que podamos avisarte.' }, 400);
    if (await rateLimited(ip, 'alerta', 5)) return json({ error: 'Demasiadas solicitudes. Prueba más tarde.' }, 429);
    const list = await load('alertas');
    const coche = clip(f.coche, 120); const car = coche ? (await load('cars')).find((x) => x.slug === coche && !x.sold) : null;
    const it = { canal: clip(f.canal, 60), id: uid('a'), email, busca: car ? `Bajada de precio: ${car.brand} ${car.model} (${car.year})` : clip(f.busca, 120), max: num(f.max), created: new Date().toISOString(), status: 'activa', origen: clip(f.origen, 120), ...(car ? { coche: car.slug, tipo: 'precio', precio: car.price } : {}) };
    const i = list.findIndex((x) => x.email === email && (x.coche || '') === (it.coche || '')); if (i >= 0) list[i] = { ...list[i], ...it, id: list[i].id }; else list.unshift(it);
    await save('alertas', list); await notify('alerta', it, url.origin).catch(() => {}); await bump('lp', (it.origen || '/').split('?')[0]).catch(() => {}); await bump('lsrc', it.canal || 'directo').catch(() => {}); return json({ ok: true });
  }

  if (['/cita', '/tasacion', '/envio', '/mensaje', '/busqueda'].includes(r) && M === 'POST') {
    const f = await readForm(req);
    const chk = checkContact(f, { emailReq: r === '/cita' });
    if (chk.spam) return json({ ok: true }); // no damos pistas al bot
    if (chk.error) return json({ error: chk.error }, 400);
    if (await rateLimited(ip, 'form', 8)) return json({ error: 'Has enviado demasiadas solicitudes. Escríbenos por WhatsApp.' }, 429);
    const base = { id: uid(), ...chk.data, created: new Date().toISOString(), status: 'pendiente', notas: '' }; const out = { ok: true };
    const cars = await load('cars');
    const carRef = (slug) => { const c = cars.find((x) => x.slug === slug); return c ? { coche: c.slug, cocheNombre: `${c.brand} ${c.model} ${c.version || ''} (${c.year})`.replace(/\s+/g, ' ') } : {}; };
    if (r === '/cita') {
      const fecha = clip(f.fecha, 10), hora = clip(f.hora, 5);
      const libres = await freeSlots(fecha); let propuesta = false;
      if (!libres.includes(hora)) { // hora propuesta por el cliente: queda pendiente de que la confirmemos
        const t0 = today(); if (f.flex !== '1' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha) || fecha < t0 || fecha > addDays(t0, 60) || !/^(09|1\d|20):(00|15|30|45)$/.test(hora) || hora > '20:00') return json({ error: 'Esa hora ya no está disponible. Elige otra.' }, 409);
        const ahora = new Intl.DateTimeFormat('es-ES', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); if (fecha === t0 && hora <= ahora) return json({ error: 'Esa hora ya ha pasado. Elige otra.' }, 409);
        propuesta = true; }
      const motivo = clip(f.motivo, 60) || 'Ver un coche en concreto';
      const list = await load('bookings');
      list.unshift({ ...base, tipo: motivo === 'Reservar este coche' ? 'reserva' : 'cita', fecha, hora, motivo, ...(propuesta ? { propuesta: true } : {}), mensaje: clip(f.mensaje, 1000), ...carRef(f.coche) });
      await save('bookings', list);
      out.ref = base.id; out.k = sign('ref|' + base.id).slice(0, 16);
    } else if (r === '/tasacion') {
      const list = await load('tasaciones');
      list.unshift({ ...base, ...(f.coche ? { parteDePago: true, ...carRef(f.coche) } : {}), marca: clip(f.marca, 40), modelo: clip(f.modelo, 60), anio: num(f.anio), km: num(f.km), combustible: clip(f.combustible, 20), cambio: clip(f.cambio, 20), estado: clip(f.estado, 40), itv: clip(f.itv, 20), notas_cliente: clip(f.notas, 1500) });
      await save('tasaciones', list);
    } else if (r === '/envio') {
      const cp = clip(f.cp, 5); if (!/^\d{5}$/.test(cp)) return json({ error: 'Escribe un código postal de 5 cifras.' }, 400);
      const list = await load('envios');
      list.unshift({ ...base, cp, ...carRef(f.coche) });
      await save('envios', list);
    } else if (r === '/busqueda') {
      const list = await load('busquedas');
      list.unshift({ ...base, marca: clip(f.marca, 40), modelo: clip(f.modelo, 60), anioDesde: num(f.anio), kmMax: num(f.km), presupuesto: num(f.presupuesto), combustible: clip(f.combustible, 20), cambio: clip(f.cambio, 20), comentario: clip(f.mensaje, 1500) });
      await save('busquedas', list);
      if (f.avisar === 'si' && base.email) { // consentimiento aparte para los avisos por email
        const al = await load('alertas'); const busca = [clip(f.marca, 40), clip(f.modelo, 60), clip(f.combustible, 20), clip(f.cambio, 20)].filter(Boolean).join(' ') || 'Cualquier coche';
        const it = { id: uid('a'), email: base.email, busca, max: num(f.presupuesto), created: base.created, status: 'activa', origen: base.origen, canal: base.canal };
        const i = al.findIndex((x) => x.email === it.email && !x.coche); if (i >= 0) al[i] = { ...al[i], ...it, id: al[i].id }; else al.unshift(it);
        await save('alertas', al);
      }
    } else {
      const list = await load('mensajes');
      list.unshift({ ...base, asunto: clip(f.asunto, 120), mensaje: clip(f.mensaje, 3000), leido: false });
      await save('mensajes', list);
    }
    await notify(r.slice(1), { ...base, ...f, ...carRef(f.coche || ''), ...(r === '/tasacion' && f.coche ? { motivo: 'Lo entregaría como parte de pago' } : {}), web: undefined, t: undefined, privacidad: undefined }, url.origin).catch(() => {});
    await bump('ev', 'form-' + r.slice(1)).catch(() => {});
    await bump('lp', base.origen || '/').catch(() => {}); await bump('lsrc', base.canal || 'directo').catch(() => {});
    return json(out);
  }

  // Login: usuarios del panel o, de emergencia, la contraseña maestra de Netlify (usuario "admin")
  if (r === '/login' && M === 'POST') {
    if (!env('PG_ADMIN_PASSWORD')) return json({ error: 'El panel aún no tiene contraseña configurada.' }, 503);
    if (await rateLimited(ip, 'login', 10)) return json({ error: 'Demasiados intentos. Espera una hora.' }, 429);
    const f = await readForm(req); const user = clip(f.user, 60).toLowerCase();
    let tok = null;
    const users = await load('users'); const u = users.find((x) => x.user === user && !x.disabled);
    if (u && checkPass(f.password, u)) tok = makeToken(u.id, u.ver || 0);
    // "Juan" entra con la contraseña maestra mientras no tenga usuario propio
    else if ((!user || user === 'admin' || (user === 'juan' && !users.some((x) => x.user === 'juan'))) && eqHash(f.password || '', env('PG_ADMIN_PASSWORD'))) tok = makeToken('admin', (await load('authver')).admin || 0);
    if (!tok) { await new Promise((z) => setTimeout(z, 800)); return json({ error: 'Usuario o contraseña incorrectos.' }, 401); }
    return json({ ok: true }, 200, { 'set-cookie': cookie(tok, SES_DIAS * 86400) });
  }
  if (r === '/logout') return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });

  // Privadas
  if (!r.startsWith('/admin/')) return json({ error: 'No encontrado' }, 404);
  const me = await sessionUser(req); if (!me) return json({ error: 'auth' }, 401);
  if (M !== 'GET' && (req.headers.get('x-pg') !== '1')) return json({ error: 'Petición no válida' }, 403); // CSRF
  const res = await adminApi(r.slice(6), req, M, me, url);
  // Renovación: si la sesión tiene más de un día, se alarga otros 400 días desde hoy
  if (me.ses && me.ses.exp - Date.now() < (SES_DIAS - 1) * 864e5) { try { res.headers.append('set-cookie', cookie(makeToken(me.id, me.ses.ver), SES_DIAS * 86400)); } catch (e) { /* cabeceras inmutables */ } }
  return res;
}

// Aviso por correo: se envía a Netlify Forms (formulario "avisos"), que manda el email a la dirección configurada
const TIT = { cita: 'Nueva cita', tasacion: 'Nueva tasación', envio: 'Nueva solicitud de envío', mensaje: 'Nuevo mensaje', busqueda: 'Nueva petición "Te lo buscamos"', alerta: 'Nueva alerta de stock' };
// Con PG_SMTP_USER y PG_SMTP_PASS (contraseña de aplicación de Gmail) el aviso sale directamente por correo; si no, por Netlify Forms
const LABEL = { nombre: 'Nombre', telefono: 'Teléfono', email: 'Email', fecha: 'Fecha', hora: 'Hora', motivo: 'Motivo', coche: 'Coche (enlace)', cocheNombre: 'Coche', mensaje: 'Mensaje', asunto: 'Asunto', marca: 'Marca', modelo: 'Modelo', anio: 'Año', km: 'Km', combustible: 'Combustible', cambio: 'Cambio', estado: 'Estado', itv: 'ITV', notas: 'Notas', cp: 'Código postal', presupuesto: 'Presupuesto', busca: 'Busca', max: 'Máximo', origen: 'Desde la página', created: 'Recibido' };
async function sendMail({ to, subject, html: body, text: txt, replyTo }) {
  const user = env('PG_SMTP_USER'), pass = env('PG_SMTP_PASS'); if (!user || !pass) return false;
  const { default: nm } = await import('nodemailer');
  const tr = nm.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
  await tr.sendMail({ from: `"Plata Garage" <${user}>`, to: to || env('PG_NOTIFY_TO') || user, subject, html: body, text: txt, replyTo });
  return true;
}
const hesc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// Avisos push al móvil (también con la app cerrada): solo a quien tenga acceso a ese negocio
async function webpushLib() { const { default: wp } = await import('web-push'); let v = await load('vapid'); if (!v || !v.pub) { const k = wp.generateVAPIDKeys(); v = { pub: k.publicKey, priv: k.privateKey }; await save('vapid', v); } wp.setVapidDetails('mailto:info@platagarage.com', v.pub, v.priv); return { wp, v }; }
const NEG_URL = { garage: '#leads', marine: '#leads', rotulito: '#leads' };
async function pushAll(neg, title, body, tag, only) {
  const subs = await load('pushsubs'); if (!subs.length) return;
  const users = await load('users');
  const can = (s) => { if (only) return s.sub.endpoint === only; if (s.uid === 'admin') return true; const u = users.find((x) => x.id === s.uid); if (!u || u.disabled) return false; const negs = u.role === 'admin' ? ['garage', 'marine', 'rotulito'] : (u.negs && u.negs.length ? u.negs : ['garage']); return negs.includes(neg); };
  const list = subs.filter(can); if (!list.length) return;
  const { wp } = await webpushLib(); const dead = [];
  const payload = JSON.stringify({ title: clip(title, 80), body: clip(body, 160), tag: tag || undefined, url: `${BASE}/admin?neg=${neg}${NEG_URL[neg] || ''}` });
  await Promise.all(list.map((s) => wp.sendNotification(s.sub, payload, { TTL: 86400, urgency: 'high' }).catch((e) => { if (e.statusCode === 404 || e.statusCode === 410) dead.push(s.sub.endpoint); else console.error('push', e.statusCode, e.message); })));
  if (dead.length) await save('pushsubs', subs.filter((s) => !dead.includes(s.sub.endpoint)));
}
async function notify(tipo, d, origin) {
  if (!origin) return;
  { const T = { cita: (d.tipo === 'reserva' || d.motivo === 'Reservar este coche' ? 'Nueva reserva' : 'Nueva cita') + (d.flex === '1' ? ' (hora propuesta, confirmar)' : ''), tasacion: 'Nueva tasación', envio: 'Nuevo envío', mensaje: 'Nuevo mensaje', busqueda: 'Te lo buscamos', alerta: 'Nueva alerta' }; await pushAll('garage', `${T[tipo] || 'Nuevo aviso'} · Plata Garage`, [d.nombre || d.email, d.cocheNombre].filter(Boolean).join(' · ') || 'Ábrelo en la app', tipo).catch((e) => console.error('push', e.message)); }
  // Mismo formato que el aviso del panel anterior: tarjeta oscura con logo, tabla de datos, notas y botón al backoffice
  const diaL = d.fecha ? new Date(d.fecha + 'T12:00:00Z').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
  const F = [['Cliente', d.nombre], ['Email', d.email], ['Teléfono', d.telefono], ['Día', diaL], ['Hora', d.hora ? d.hora + (d.flex === '1' ? ' (propuesta por el cliente: confirmar disponibilidad)' : '') : ''], ['Motivo', d.motivo], ['Coche de interés', d.cocheNombre], ['Código postal', d.cp], ['Asunto', d.asunto], ['Su coche', [d.marca, d.modelo, d.anio].filter(Boolean).join(' ')], ['Kilómetros', d.km], ['Combustible', d.combustible], ['Cambio', d.cambio], ['Estado', d.estado], ['ITV', d.itv], ['Presupuesto', d.presupuesto ? d.presupuesto + ' €' : ''], ['Busca', d.busca], ['Máximo', d.max ? d.max + ' €' : '']].filter(([, v]) => v != null && v !== '');
  const notas = d.mensaje || d.notas || '';
  const panel = `${origin}${BASE}/admin`;
  const H1 = { cita: d.tipo === 'reserva' || d.motivo === 'Reservar este coche' ? 'Nueva solicitud de reserva' : 'Nueva cita reservada', tasacion: 'Nueva solicitud de tasación', envio: 'Nueva solicitud de envío', mensaje: 'Nuevo mensaje', busqueda: 'Nueva petición "Te lo buscamos"', alerta: 'Nueva alerta de stock' }[tipo] || 'Nuevo aviso';
  const td = 'padding:8px 0;color:#6b6b6b;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:42%', tv = 'padding:8px 0;color:#f5f5f5;font-size:15px;font-weight:600';
  const mailHtml = `<div style="margin:0;padding:0;background:#050505;color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0d0d0d;border:1px solid #262626;border-radius:16px;overflow:hidden">
<tr><td style="padding:24px 32px;text-align:center;border-bottom:1px solid #262626"><img src="${origin}${ST}/assets/logo.png" alt="Plata Garage" height="36" style="height:36px;width:auto;display:inline-block"></td></tr>
<tr><td style="padding:32px;color:#f5f5f5;font-size:15px;line-height:1.55"><h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#f5f5f5;font-weight:700">${hesc(H1)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;border:1px solid #262626;border-radius:12px;background:#050505"><tr><td style="padding:18px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${F.map(([k, v]) => `<tr><td style="${td}">${k}</td><td style="${tv}">${k === 'Teléfono' ? `<a href="https://wa.me/${String(v).replace(/\D/g, '').replace(/^(\d{9})$/, '34$1')}" style="color:#f5f5f5;text-decoration:none">${hesc(v)}</a>` : hesc(v)}</td></tr>`).join('')}</table></td></tr></table>
${notas ? `<p style="margin:0 0 14px;color:#a1a1a1">Notas: ${hesc(notas)}</p>` : ''}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px"><tr><td><a href="${panel}" style="display:inline-block;background:#f76806;color:#000;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:9999px;font-size:14px">Gestionar en el backoffice</a></td></tr></table></td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #262626;background:#050505;text-align:center;font-size:12px;color:#6b6b6b"><p style="margin:0 0 6px">Plata Garage · Sabadell</p><p style="margin:0"><a href="tel:+34660493228" style="color:#a1a1a1;text-decoration:none">+34 660 49 32 28</a> &nbsp;·&nbsp; <a href="mailto:info@platagarage.com" style="color:#a1a1a1;text-decoration:none">info@platagarage.com</a></p></td></tr>
</table></td></tr></table></div>`;
  const txt = F.map(([k, v]) => `${k}: ${v}`).join('\n') + (notas ? `\nNotas: ${notas}` : '') + `\n\nGestionar en el backoffice: ${panel}`;
  const tit = { cita: H1.startsWith('Nueva solicitud de reserva') ? 'Nueva reserva' : 'Nueva cita', tasacion: 'Nueva tasación', envio: 'Nuevo envío', mensaje: 'Nuevo mensaje', busqueda: 'Te lo buscamos', alerta: 'Nueva alerta' }[tipo] || 'Aviso';
  const subject = `${tit} — ${d.nombre || d.email || ''}${diaL ? ` (${diaL} ${d.hora || ''})` : d.cocheNombre ? ` (${d.cocheNombre})` : ''}`.trim();
  if (await sendMail({ subject, html: mailHtml, text: txt, replyTo: d.email || undefined }).catch((e) => { console.error('smtp', e.message); return false; })) return;

  const lines = txt;
  const body = new URLSearchParams({ 'form-name': 'avisos', asunto: subject, tipo, nombre: d.nombre || d.email || '', telefono: d.telefono || '', detalle: lines, panel: `${origin}${BASE}/admin` });
  await fetch(`${origin}${ST}/assets/avisos.html`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
}
// Aviso diario al móvil: los seguimientos que tocan hoy en cada negocio (los que llevan más días de la cuenta en su paso)
const MAXD_S = {
  garage: { nuevo: 1, contactado: 7, visitado: 3, financiera: 7, reserva: 7, vendido: 3, transferencia: 3, entregado: 15, permiso: 3, enviado: 10 },
  marine: { 'Nuevo': 1, 'Contactado': 5, 'Visita': 7, 'Oferta': 5, 'Señal': 10, 'Prueba de mar / peritaje': 15, 'Aceptación': 7, 'Pago y contrato': 10, 'Titularidad': 30, 'Entrega': 10, 'Documentación enviada': 15, 'Primer contacto': 2, 'Hoja y guía enviadas': 3, 'Hoja firmada': 7, 'Fotos recibidas': 3, 'Publicado': 30, 'Con interesados': 30 },
  rotulito: { 'Nuevo': 1, 'Contactado': 3, 'Presupuesto enviado': 5, 'Aceptado y señal': 7, 'Contenido recibido': 5, 'En desarrollo': 10, 'Revisión del cliente': 7, 'Publicada': 15 },
};
const diasD = (iso) => (iso ? Math.floor((Date.now() - Date.parse(iso)) / 864e5) : 0);
export async function diario() {
  const toca = (neg, L) => L.filter((c) => c.etapa !== 'Perdido' && c.etapa !== 'perdido' && MAXD_S[neg][c.etapa] && diasD(c.desde || c.updated || c.created) > MAXD_S[neg][c.etapa]).sort((a, b) => diasD(b.desde || b.updated) - diasD(a.desde || a.updated));
  const res = { garage: toca('garage', await buildClientes()), marine: toca('marine', await load('leads-marine')), rotulito: toca('rotulito', await load('leads-rotulito')) };
  const nom = { garage: 'Plata Garage', marine: 'Plata Marine', rotulito: 'Rotulito' };
  for (const [neg, L] of Object.entries(res)) if (L.length) await pushAll(neg, `Hoy te toca: ${L.length} seguimiento${L.length > 1 ? 's' : ''} · ${nom[neg]}`, L.slice(0, 4).map((c) => String(c.nombre || '').split(' ')[0]).join(', ') + (L.length > 4 ? '…' : ''), 'hoy-' + neg).catch((e) => console.error('push', e.message));
  // Coches parados: más de 45 días en stock y 3 semanas sin tocar el precio
  const parados = (await load('cars')).filter((c) => !c.sold && !c.hidden && diasD(c.llegada || c.created) >= 45 && diasD((c.priceHistory || []).length > 1 ? c.priceHistory[c.priceHistory.length - 1].d : c.llegada || c.created) >= 21).sort((a, b) => diasD(b.llegada || b.created) - diasD(a.llegada || a.created));
  if (parados.length) await pushAll('garage', `Coches parados: ${parados.length} sin moverse`, parados.slice(0, 3).map((c) => `${c.brand} ${c.model} (${diasD(c.llegada || c.created)} d)`).join(', ') + (parados.length > 3 ? '…' : '') + ' · revisa precio', 'parados').catch((e) => console.error('push', e.message));
  // Vendedores (tasaciones) que llevan más días de la cuenta en su paso
  const MAXV = { pendiente: 1, contactado: 3, ofertado: 5, visto: 3, gestion: 30 };
  const vend = (await load('tasaciones')).filter((t) => MAXV[t.status || 'pendiente'] && diasD(t.desde || t.created) > MAXV[t.status || 'pendiente']);
  if (vend.length) await pushAll('garage', `Vendedores: ${vend.length} sin mover`, vend.slice(0, 3).map((t) => `${String(t.nombre || '').split(' ')[0]} (${t.marca || ''} ${t.modelo || ''})`.trim()).join(', ') + (vend.length > 3 ? '…' : ''), 'vendedores').catch((e) => console.error('push', e.message));
  return Object.fromEntries([...Object.entries(res).map(([k, v]) => [k, v.length]), ['parados', parados.length], ['vendedores', vend.length]]);
}
// Medición propia sin cookies ni datos personales: contadores por día
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom/i;
async function bump(group, key, n = 1) {
  const k = `stats/${today()}`; const st = (await db().get(k, { type: 'json' })) || {};
  st[group] = st[group] || {}; st[group][key] = (st[group][key] || 0) + n; await db().setJSON(k, st);
}
async function hit(req, context) {
  if (BOT.test(req.headers.get('user-agent') || '')) return;
  const b = await req.json().catch(() => ({}));
  const k = `stats/${today()}`; const st = (await db().get(k, { type: 'json' })) || {};
  const inc = (g, key) => { if (!key) return; st[g] = st[g] || {}; st[g][key] = (st[g][key] || 0) + 1; };
  if (b.e === 'view') {
    inc('pv', clip(b.p, 120)); inc('src', clip(b.s, 60) || 'directo'); if (b.c) inc('car', clip(b.c, 120)); inc('tot', 'visitas');
    const ua = req.headers.get('user-agent') || ''; inc('dev', /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'móvil' : 'ordenador');
    const g = context?.geo; if (g?.city) inc('city', clip(g.city, 60)); if (g?.country?.code) inc('pais', clip(g.country.code, 4));
    if (b.n) inc('tot', 'nuevas');
  }
  else if (b.e === 'falta') { const K = { precio: 'El precio', financiacion: 'La financiación', verlo: 'Verlo en persona', datos: 'Más fotos o datos', garantia: 'La garantía', entregar: 'Entregar su coche' }; if (K[b.k]) { inc('falta', K[b.k]); if (b.c) inc('faltacar', `${clip(b.c, 120)}|${K[b.k]}`); } }
  else if (b.e === 'q') { const q = clip(String(b.q || '').replace(/\d(?:[ .]?\d){6,}/g, ' ').replace(/[^a-z0-9ñ .,€-]/gi, ' ').replace(/\s+/g, ' ').trim(), 80); if (q) { inc('q', q); if (!Number(b.n)) inc('q0', q); } }
  else if (b.e === 'cwv') {
    const tpl = ['home', 'catalogo', 'ficha', 'landing', 'cita', 'otra'].includes(b.t) ? b.t : 'otra';
    const B = { lcp: [1000, 1500, 2000, 2500, 3000, 4000, 6000], inp: [100, 200, 300, 500, 800], cls: [0.05, 0.1, 0.15, 0.25, 0.4] };
    for (const m of ['lcp', 'inp', 'cls']) { const v = Number(b[m]); if (!Number.isFinite(v) || v < 0) continue; const i = B[m].findIndex((x) => v <= x); inc('cwv', `${tpl}|${m}|${i < 0 ? B[m].length : i}`); }
  }
  else if (b.e === 'cmp') { const par = String(b.c || '').split('+').map((x) => clip(x, 120)).filter(Boolean).slice(0, 3); if (par.length > 1) { inc('tot', 'comparaciones'); inc('cmppar', par.join('+')); } }
  else if (b.e === 'cmpc') { inc('tot', 'cmpcontacto'); inc('cmpk', b.k === 'wa' ? 'WhatsApp' : 'Pedir cita'); if (b.c) inc('cmpcar', clip(b.c, 120)); }
  else if (['wa', 'tel', 'pdf'].includes(b.e)) { inc('ev', b.e); if (b.c) inc('carev', `${clip(b.c, 120)}|${b.e}`); }
  await db().setJSON(k, st);
}

// Contador de las webs de Plata Marine y Rotulito (lo envían sus analytics.js / track.js solo con consentimiento de analítica):
// contadores por día, sin datos personales; lo escrito en buscadores se guarda sin números largos (teléfonos)
const WNEG = ['marine', 'rotulito'];
const sinNum = (v, n) => clip(String(v ?? '').replace(/\d(?:[ .]?\d){6,}/g, ' ').replace(/[^\p{L}0-9 .,€+|:\/-]/gu, ' ').replace(/\s+/g, ' '), n);
async function hitW(neg, req, context) {
  if (!WNEG.includes(neg) || BOT.test(req.headers.get('user-agent') || '')) return;
  const b = await req.json().catch(() => ({})); if (!b || typeof b !== 'object') return;
  const k = `wstats/${neg}/${today()}`; const st = (await db().get(k, { type: 'json' })) || {};
  const inc = (g, key) => { key = clip(key, 120); if (!key) return; st[g] = st[g] || {}; st[g][key] = (st[g][key] || 0) + 1; };
  const t = clip(b.t, 20), canal = clip(b.c, 40) || 'Directo';
  if (t === 'visita') {
    inc('pv', clip(b.p, 120)); inc('tot', 'visitas'); if (Number(b.e)) { inc('tot', 'nuevas'); inc('src', canal); }
    if (b.l) inc('lang', clip(b.l, 4)); if (b.b) inc('boat', clip(b.b, 80));
    const ua = req.headers.get('user-agent') || ''; inc('dev', /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'móvil' : 'ordenador');
    const g = context?.geo; if (g?.city) inc('city', clip(g.city, 60));
  } else if (t === 'contacto' || t === 'lead' || t === 'novedades') {
    inc('tot', t); inc('ev', `${t}|${clip(b.m, 30) || 'otro'}`); inc(t + 'src', canal); if (b.b) inc(t + 'boat', clip(b.b, 80));
  } else if (t === 'busqueda') { const q = sinNum(b.m, 80).toLowerCase(); if (q.length > 1) { inc('q', q); if (!Number(b.e)) inc('q0', q); } }
  else if (t === 'filtro') { const f = clip(String(b.m ?? '').replace(/[^\p{L}0-9 €|\/-]/gu, ' ').replace(/\s+/g, ' '), 120); if (f) { inc('filtro', f); if (!Number(b.e)) inc('filtro0', f); } }
  else if (t === 'falta') { const f = sinNum(b.m, 40); if (f) { inc('falta', f); if (b.b) inc('faltaboat', `${clip(b.b, 80)}|${f}`); } }
  else if (t === 'embudo') { const f = sinNum(b.m, 40); if (f) inc('embudo', f); }
  else return;
  await db().setJSON(k, st);
}

const COLS = ['bookings', 'tasaciones', 'envios', 'mensajes'];
async function adminApi(r, req, M, me, url) {
  const body = M === 'GET' || M === 'DELETE' || r.startsWith('/video/chunk') ? {} : await req.json().catch(() => ({}));
  const seg = r.split('/').filter(Boolean); // e.g. ['cars','c001']

  if (seg[0] === 'summary') {
    const [cars, b, t, e, m, al, bu] = await Promise.all(['cars', 'bookings', 'tasaciones', 'envios', 'mensajes', 'alertas', 'busquedas'].map(load));
    const td = today();
    return json({
      enStock: cars.filter((c) => !c.sold).length, vendidos: cars.filter((c) => c.sold).length,
      destacados: cars.filter((c) => c.featured && !c.sold).length,
      citasPendientes: b.filter((x) => x.status === 'pendiente').length,
      proximasCitas: b.filter((x) => x.fecha >= td && x.status !== 'cancelada').sort((a, z) => (a.fecha + a.hora).localeCompare(z.fecha + z.hora)).slice(0, 6),
      ultimasReservas: [...b].sort((a, z) => String(z.created || '').localeCompare(String(a.created || ''))).slice(0, 5),
      manana: b.filter((x) => x.fecha === addDays(td, 1) && x.status !== 'cancelada').sort((a, z) => a.hora.localeCompare(z.hora)),
      tasacionesNuevas: t.filter((x) => x.status === 'pendiente').length, ultimasTasaciones: t.slice(0, 5),
      enviosPendientes: e.filter((x) => x.status === 'pendiente').length, mensajesSinLeer: m.filter((x) => !x.leido).length, alertasActivas: al.filter((x) => x.status === 'activa').length, busquedasPendientes: bu.filter((x) => x.status === 'pendiente').length,
      valorStock: cars.filter((c) => !c.sold).reduce((s, c) => s + (c.price || 0), 0),
      porDueno: ['Cristina', 'Juan', ''].map((o) => { const l = cars.filter((c) => !c.sold && (c.owner || '') === o); return { o: o || 'Sin asignar', n: l.length, v: l.reduce((s, c) => s + (c.price || 0), 0) }; }).filter((x) => x.n),
    });
  }

  if (seg[0] === 'cars') {
    const cars = await load('cars');
    if (M === 'GET' && !seg[1]) return json(cars);
    if (M === 'GET') { const c = cars.find((x) => x.id === seg[1]); return c ? json(c) : json({ error: 'No existe' }, 404); }
    if (M === 'POST' && !seg[1]) {
      const c = cleanCar(body, { id: uid('c'), featured: false, sold: false, images: [], features: [], status: 'disponible', created: today(), llegada: today() });
      const e = carErrors(c); if (e.length) return json({ error: 'Faltan datos: ' + e.join(', ') }, 400);
      c.slug = uniqueSlug(cars, c); c.updated = today(); await holderPorDueno(c); cars.unshift(c); await save('cars', cars); if (!c.hidden) await indexNow(url.origin, [c.slug]); return json(c);
    }
    const i = cars.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { const [old] = cars.splice(i, 1); await save('cars', cars); await dropMedia(old.images); if (old.video?.url) await dropVideo(old.video.url); await indexNow(url.origin, [old.slug]); return json({ ok: true }); }
    if (M === 'POST' && seg[2] === 'duplicar') {
      const o = cars[i]; const c = { ...structuredClone(o), id: uid('c'), images: [], sold: false, soldAt: undefined, buyer: undefined, featured: false, hidden: true, status: 'preparacion', created: today(), updated: today(), oldSlugs: [], priceHistory: [], log: [{ d: new Date().toISOString(), by: me.name, t: `Creado como copia del ${o.brand} ${o.model}` }], srcId: undefined };
      c.slug = uniqueSlug(cars, c); cars.unshift(c); await save('cars', cars); return json(c);
    }
    if (M === 'PUT') {
      const old = cars[i]; const c = cleanCar(body, old);
      const e = carErrors(c); if (e.length) return json({ error: 'Faltan datos: ' + e.join(', ') }, 400);
      const ns = uniqueSlug(cars, c);
      if (ns !== old.slug) { c.oldSlugs = [...new Set([...(old.oldSlugs || []), old.slug])].slice(-10); c.slug = ns; }
      if (c.sold && !old.sold) c.soldAt = today();
      if ('buyer' in body) c.buyer = pkey(body.buyer) || undefined;
      await holderPorDueno(c);
      // Historial de precios (sirve para justificar cualquier rebaja) y registro de quién cambia qué
      if (old.price !== c.price && old.price) c.priceHistory = [...(old.priceHistory || [{ d: old.created || today(), p: old.price }]), { d: today(), p: c.price }].slice(-30);
      const chg = []; if (old.price !== c.price) chg.push(`precio ${old.price} → ${c.price} €`); if (!old.sold && c.sold) chg.push('vendido'); if (old.sold && !c.sold) chg.push('vuelve a stock'); if (old.status !== c.status) chg.push(`estado: ${c.status}`); if (old.km !== c.km) chg.push(`km ${old.km} → ${c.km}`); if (!!old.hidden !== !!c.hidden) chg.push(c.hidden ? 'oculto' : 'visible'); if ((old.images || []).join() !== (c.images || []).join()) chg.push('fotos'); if (old.desc !== c.desc) chg.push('descripción');
      if (chg.length) c.log = [...(old.log || []), { d: new Date().toISOString(), by: me.name, t: chg.join(', ') }].slice(-60);
      c.updated = today(); cars[i] = c; await save('cars', cars);
      if (!c.sold && !c.hidden && old.price && c.price < old.price) await avisarBajada(c, url.origin).catch((e) => console.error('bajada', e.message));
      await dropMedia((old.images || []).filter((u) => !(c.images || []).includes(u)));
      if (old.video?.url && old.video.url !== c.video?.url) await dropVideo(old.video.url);
      await indexNow(url.origin, [c.slug]);
      return json(c);
    }
  }


  if (seg[0] === 'import' && M === 'POST') {
    // Importación única de datos desde el panel anterior (idempotente por srcId)
    const out = {};
    const keyOf = { bookings: 'bookings', envios: 'envios', tasaciones: 'tasaciones', mensajes: 'mensajes' };
    for (const [k, store] of Object.entries(keyOf)) {
      if (!Array.isArray(body[k])) continue;
      const list = await load(store); let n = 0;
      for (const it of body[k]) { if (!it.srcId || list.some((x) => x.srcId === it.srcId)) continue; list.push({ id: uid(), notas: '', ...it }); n++; }
      list.sort((a, b) => String(b.created || '').localeCompare(String(a.created || '')));
      await save(store, list); out[k] = n;
    }
    if (Array.isArray(body.posts)) {
      const posts = await load('posts'); let n = 0;
      for (const p of body.posts) {
        if (!p.srcId || posts.some((x) => x.srcId === p.srcId)) continue;
        let s = slugify(p.slug || p.title), i = 2; while (posts.some((x) => x.slug === s)) s = `${slugify(p.slug || p.title)}-${i++}`;
        posts.push({ id: uid('p'), srcId: p.srcId, slug: s, title: clip(p.title, 160), excerpt: clip(p.excerpt, 300), cover: (p.cover || '').startsWith(BASE + '/') ? p.cover : '', tags: (p.tags || []).slice(0, 8), body: clip(p.body, 60000), published: !!p.published, publishedAt: p.publishedAt || '', created: p.created || today() }); n++;
      }
      await save('posts', posts); out.posts = n;
    }
    if (Array.isArray(body.cars)) {
      const cars = await load('cars'); let up = 0, cr = 0;
      for (const b of body.cars) {
        let i = cars.findIndex((x) => (b.srcId && x.srcId === b.srcId) || (b.slug && x.slug === b.slug));
        if (i >= 0) { cars[i] = { ...cleanCar(b, cars[i]), srcId: b.srcId || cars[i].srcId }; up++; }
        else { const c = cleanCar(b, { id: uid('c'), images: [], features: [], created: b.created || today() }); c.srcId = b.srcId; c.slug = b.slug && !cars.some((x) => x.slug === b.slug) ? b.slug : uniqueSlug(cars, c); if (c.sold && !c.soldAt) c.soldAt = b.soldAt || today(); cars.push(c); cr++; }
      }
      await save('cars', cars); out.cars = { actualizados: up, creados: cr };
    }
    return json(out);
  }
  // ---- Documentos privados (facturas, contratos, fotos, documentación) de coches y barcos ----
  // Se guardan cifrados (AES-256-GCM) y solo se pueden ver con sesión iniciada; coches = Plata Garage, barcos = Plata Marine
  if (seg[0] === 'docs') {
    const negDe = (sc) => (sc === 'car' ? 'garage' : sc === 'boat' ? 'marine' : '');
    if (seg[1] === 'file' && M === 'GET') {
      const all = await load('docs'); let meta = null, sc = '';
      for (const [k, v] of Object.entries(all)) { const f = (v.files || []).find((x) => x.id === seg[2]); if (f) { meta = f; sc = k.split(':')[0]; break; } }
      if (!meta || !(me.negs || []).includes(negDe(sc))) return json({ error: 'No encontrado' }, 404);
      const r = await media().get('doc/' + meta.id, { type: 'arrayBuffer' }); if (!r) return json({ error: 'No encontrado' }, 404);
      const buf = Buffer.from(r); const k = docKey(); const dec = crypto.createDecipheriv('aes-256-gcm', k, buf.subarray(0, 12)); dec.setAuthTag(buf.subarray(12, 28));
      const out = Buffer.concat([dec.update(buf.subarray(28)), dec.final()]);
      return new Response(out, { headers: { 'content-type': meta.mime || 'application/octet-stream', 'content-disposition': `${url.searchParams.get('dl') ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(meta.nombre)}`, 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' } });
    }
    const sc = seg[1], ref = clip(seg[2], 60); if (!negDe(sc) || !ref) return json({ error: 'No válido' }, 400);
    if (!(me.negs || []).includes(negDe(sc))) return json({ error: 'No tienes acceso.' }, 403);
    const all = await load('docs'); const k = `${sc}:${ref}`; const ent = (all[k] = all[k] || { files: [] });
    if (M === 'GET') return json(ent);
    if (M === 'PUT') { if ('venta' in body) { const n = Number(String(body.venta).replace(',', '.')); ent.venta = isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; } if ('nota' in body) ent.nota = clip(body.nota, 4000); await save('docs', all); return json(ent); }
    if (M === 'POST') {
      const buf = Buffer.from(String(body.data || ''), 'base64'); if (!buf.length || buf.length > 4.2e6) return json({ error: 'El archivo pesa demasiado (máx. 4 MB). Si es un PDF escaneado, redúcelo antes.' }, 400);
      const mime = /^(application\/pdf|image\/(jpeg|png|webp|heic)|application\/(msword|vnd\.openxmlformats-officedocument\.[\w.]+))$/.test(body.mime || '') ? body.mime : 'application/octet-stream';
      const id = 'd' + Date.now().toString(36) + crypto.randomBytes(4).toString('hex'); const iv = crypto.randomBytes(12); const c = crypto.createCipheriv('aes-256-gcm', docKey(), iv);
      const enc = Buffer.concat([c.update(buf), c.final()]); await media().set('doc/' + id, Buffer.concat([iv, c.getAuthTag(), enc]));
      const n = Number(String(body.importe ?? '').replace(',', '.'));
      ent.files.unshift({ id, nombre: clip(body.nombre, 120) || 'documento', tipo: clip(body.tipo, 40) || 'Otro', importe: isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0, fecha: /^\d{4}-\d{2}-\d{2}$/.test(body.fecha || '') ? body.fecha : today(), mime, size: buf.length, by: me.name, at: new Date().toISOString(), ...(String(body.iva ?? '') !== '' && isFinite(Number(body.iva)) ? { iva: Math.round(Number(body.iva) * 100) / 100 } : {}) });
      await save('docs', all); return json(ent);
    }
    if (M === 'PATCH' && seg[3]) { const f = ent.files.find((x) => x.id === seg[3]); if (!f) return json({ error: 'No existe' }, 404);
      if ('tipo' in body) f.tipo = clip(body.tipo, 40) || f.tipo; if ('nombre' in body) f.nombre = clip(body.nombre, 120) || f.nombre;
      if ('importe' in body) { const n = Number(String(body.importe ?? '').replace(',', '.')); f.importe = isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; }
      if ('iva' in body) { const v = String(body.iva ?? '').trim(); const n = Number(v.replace(',', '.')); if (v === '' || !isFinite(n) || n < 0) delete f.iva; else f.iva = Math.round(n * 100) / 100; }
      if (/^\d{4}-\d{2}-\d{2}$/.test(body.fecha || '')) f.fecha = body.fecha; await save('docs', all); return json(ent); }
    if (M === 'DELETE' && seg[3]) { const i = ent.files.findIndex((x) => x.id === seg[3]); if (i < 0) return json({ error: 'No existe' }, 404); ent.files.splice(i, 1); await save('docs', all); await media().delete('doc/' + seg[3]).catch(() => {}); return json(ent); }
  }
  // Trimestre para la gestoría: coches vendidos en el trimestre con compra, gastos, venta y margen (REBU), por dueño
  // ---- Holded (solo la cuenta de Juan): factura de venta en BORRADOR para sus coches; no emite nada ----
  if (seg[0] === 'holded') {
    if (me.role !== 'admin') return json({ error: 'Solo Juan puede usar Holded.' }, 403);
    const TOK = process.env.HOLDED_TOKEN; if (!TOK) return json({ error: 'Falta la clave de Holded en Netlify (HOLDED_TOKEN).' }, 400);
    const H = async (path, opt = {}) => { const r = await fetch('https://api.holded.com/api/v2' + path, { ...opt, headers: { Authorization: 'Bearer ' + TOK, Accept: 'application/json', 'Content-Type': 'application/json' } }); const t = await r.text(); let d; try { d = JSON.parse(t); } catch { d = t.slice(0, 300); } return { ok: r.ok, status: r.status, d }; };
    if (seg[1] === 'info' && M === 'GET') { const [c, t] = await Promise.all([H('/contacts?limit=1'), H('/taxes')]); return json({ contactos: c.status, impuestos: t.status, taxes: t.d }); }
    if (seg[1] === 'factura' && M === 'POST') {
      const cars = await load('cars'); const car = cars.find((x) => x.id === body.car); if (!car) return json({ error: 'Coche no encontrado' }, 404);
      if (car.owner !== 'Juan') return json({ error: 'Holded es solo para los coches de Juan.' }, 400);
      if (car.holdedId) return json({ error: 'Este coche ya tiene la factura en Holded.', id: car.holdedId }, 400);
      const cl = (await buildClientes()).find((x) => x.key === car.buyer); if (!cl) return json({ error: 'Asigna antes el comprador en la ficha del coche.' }, 400);
      const docs = (await load('docs'))['car:' + car.id] || { files: [] }; const gen = docs.files.some((f) => f.tipo === 'Factura de compra' && (f.iva || 0) > 0);
      const venta = Number(docs.venta || car.price || 0); if (!venta) return json({ error: 'Falta el precio de venta.' }, 400);
      let cid = null; const nm = clip(cl.nombre || 'Cliente', 80); const tel = String(cl.telefono || '').replace(/\D/g, '').slice(-9);
      const sr = await H('/contacts/search?name=' + encodeURIComponent(nm) + '&limit=25');
      if (sr.ok && sr.d && sr.d.items) { const hit = sr.d.items.find((x) => (tel && [x.mobile, x.phone].some((p) => p && String(p).replace(/\D/g, '').endsWith(tel))) || (cl.email && x.email === cl.email)); if (hit) cid = hit.id; }
      if (!cid) { const cr = await H('/contacts', { method: 'POST', body: JSON.stringify({ name: nm, is_person: true, type: 'client', mobile: cl.telefono || null, email: cl.email || null }) }); if (!cr.ok) return json({ error: 'Holded no creó el contacto (' + cr.status + ')', det: cr.d }, 502); cid = cr.d.id; }
      const desc = `${car.brand} ${car.model}${car.version ? ' ' + car.version : ''} · ${car.year}${car.matricula ? ' · matrícula ' + car.matricula : ''}${car.km ? ' · ' + car.km + ' km' : ''}`;
      const item = gen ? { name: desc, units: 1, price: Math.round(venta / 1.21 * 100) / 100, taxes: ['s_iva_21'] } : { name: desc, units: 1, price: venta, taxes: [process.env.HOLDED_TAX_REBU || 's_iva_0'] };
      const inv = { contact_id: cid, contact_name: nm, date: new Date().toISOString().slice(0, 10), language: 'es', currency: 'EUR', items: [item], body: gen ? null : 'Régimen especial de los bienes usados (arts. 135 a 139 de la Ley 37/1992 del IVA).', notes: 'Creada desde la app de Plata Garage. Revisa NIF y dirección del cliente antes de emitirla.' };
      const ir = await H('/invoices', { method: 'POST', body: JSON.stringify(inv) }); if (!ir.ok) return json({ error: 'Holded no creó la factura (' + ir.status + ')', det: ir.d }, 502);
      car.holdedId = ir.d.id; await save('cars', cars); return json({ ok: true, id: ir.d.id, regimen: gen ? 'general' : 'REBU' });
    }
  }
  if (seg[0] === 'trimestre' && M === 'GET') {
    const y = Number(url.searchParams.get('y')) || new Date().getFullYear(), q = Math.min(4, Math.max(1, Number(url.searchParams.get('q')) || 1));
    const ini = `${y}-${String((q - 1) * 3 + 1).padStart(2, '0')}-01`, fin = `${q === 4 ? y + 1 : y}-${String(q === 4 ? 1 : q * 3 + 1).padStart(2, '0')}-01`;
    const [cars, all] = await Promise.all([load('cars'), load('docs')]);
    const DESDE = '2026-10-13'; // las ventas anteriores a la app ya están declaradas: no entran
    const rows = cars.filter((c) => c.sold && c.soldAt && c.soldAt.slice(0, 10) >= DESDE && c.soldAt.slice(0, 10) >= ini && c.soldAt.slice(0, 10) < fin).map((c) => {
      const e = all['car:' + c.id] || { files: [] }; const compra = e.files.filter((f) => f.tipo === 'Factura de compra').reduce((a, f) => a + f.importe, 0);
      const gastos = e.files.filter((f) => !['Factura de compra', 'Factura de venta', 'Contrato', 'Documentación', 'Foto'].includes(f.tipo)).reduce((a, f) => a + f.importe, 0);
      const venta = e.venta || c.price || 0;
      return { id: c.id, coche: `${c.brand} ${c.model} ${c.version || ''}`.trim(), year: c.year, owner: c.owner || '', vendido: c.soldAt.slice(0, 10), compra, gastos, venta, margen: Math.round((venta - compra - gastos) * 100) / 100, files: e.files };
    });
    return json({ y, q, ini, fin, rows });
  }
  // Demandas de compradores de Plata Marine y su cruce con los barcos en venta
  if (seg[0] === 'demandas') {
    if (!(me.negs || []).includes('marine')) return json({ error: 'No tienes acceso.' }, 403);
    const list = await load('demandas-marine');
    if (M === 'GET' && !seg[1]) return json({ demandas: await demandasCon(list), tipos: TIPO_TXT, zonas: ZONAS_B });
    if (seg[1] === 'barco' && M === 'GET') { const b = (await barcosEnVenta()).find((x) => x.key === decodeURIComponent(seg[2] || '')); if (!b) return json({ barco: null, demandas: [] });
      return json({ barco: b, demandas: list.filter((d) => d.estado === 'Activa').map((d) => ({ id: d.id, nombre: d.nombre, telefono: d.telefono, ...cruce(d, b), propuesto: (d.propuestos || []).includes(b.key), descartado: (d.descartados || []).includes(b.key) })).filter((x) => !x.no.length && x.pct >= 60 && !x.descartado).sort((a, z) => z.pct - a.pct) }); }
    if (seg[1] === 'importar' && M === 'POST') { const leads = await load('leads-marine'); let n = 0;
      for (const l of leads) { if (!/alerta|que-barco|busco/i.test(`${l.origen || ''} ${l.tipo || ''}`) || l.etapa === 'Perdido' || list.some((d) => d.leadId === l.id)) continue;
        await addDemanda({ nombre: l.nombre, telefono: l.telefono, origen: l.origen, interes: l.interes, mensaje: (l.historial || []).map((h) => h.t).join(' | ') }, l.id); n++; }
      return json({ ok: true, nuevas: n }); }
    const campos = (d, b) => { if ('nombre' in b) d.nombre = clip(b.nombre, 80) || 'Sin nombre'; if ('telefono' in b) d.telefono = normPhone(b.telefono) || clip(b.telefono, 20); if ('notas' in b) d.notas = clip(b.notas, 2000);
      if ('estado' in b) d.estado = ['Activa', 'Pausada', 'Cerrada'].includes(b.estado) ? b.estado : 'Activa'; if ('leadId' in b) d.leadId = clip(b.leadId, 40);
      if (b.criterios) { const c = b.criterios, o = {}; if (TIPOS_B.includes(c.tipo)) o.tipo = c.tipo; ['presuMin', 'presuMax'].forEach((k) => { const n = numB(c[k]); if (n) o[k] = n; }); ['esloraMin', 'esloraMax'].forEach((k) => { const n = Number(String(c[k] || '').replace(',', '.')); if (isFinite(n) && n > 0 && n < 100) o[k] = n; }); if (['0', '1', '2', '3', '4'].includes(String(c.titulo))) o.titulo = Number(c.titulo); if (ZONAS_B[c.zona]) o.zona = c.zona; d.criterios = o; }
      const marca = (k, v, on) => { const s = new Set(d[k] || []); on ? s.add(v) : s.delete(v); d[k] = [...s].slice(-200); };
      if (b.proponer) { marca('propuestos', clip(b.proponer, 80), true); marca('descartados', clip(b.proponer, 80), false); d.historial = [{ d: new Date().toISOString(), t: 'Propuesto: ' + clip(b.nombreBarco, 80) }, ...(d.historial || [])].slice(0, 100); }
      if (b.descartar) { marca('descartados', clip(b.descartar, 80), true); marca('propuestos', clip(b.descartar, 80), false); }
      if (b.recuperar) { marca('descartados', clip(b.recuperar, 80), false); marca('propuestos', clip(b.recuperar, 80), false); } return d; };
    if (M === 'POST' && !seg[1]) { const d = campos({ id: uid('d'), estado: 'Activa', origen: clip(body.origen, 40) || 'Manual', propuestos: [], descartados: [], criterios: {}, created: new Date().toISOString() }, body); list.unshift(d); await save('demandas-marine', list); return json(d); }
    const i = list.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'GET') return json({ ...(await demandasCon([list[i]]))[0], tipos: TIPO_TXT, zonas: ZONAS_B });
    if (M === 'PUT') { campos(list[i], body); list[i].updated = new Date().toISOString(); await save('demandas-marine', list); return json(list[i]); }
    if (M === 'DELETE') { list.splice(i, 1); await save('demandas-marine', list); return json({ ok: true }); }
  }
  // Trimestre de Plata Marine y Rotulito: facturas emitidas en Holded (solo lectura; la gestoría tiene la última palabra)
  if (seg[0] === 'ntrimestre') {
    const neg = seg[1]; if (!['marine', 'rotulito'].includes(neg) || !(me.negs || []).includes(neg)) return json({ error: 'No tienes acceso.' }, 403);
    if (me.role !== 'admin') return json({ error: 'Solo Juan puede ver su facturación.' }, 403);
    if (!process.env.HOLDED_TOKEN) return json({ error: 'Falta la clave de Holded en Netlify (HOLDED_TOKEN).' }, 400);
    const map = await load('holded-neg');
    if (seg[2] === 'clasificar' && M === 'PUT') { const id = clip(body.id, 40); if (!id) return json({ error: 'Falta la factura' }, 400); map[id] = ['marine', 'rotulito', 'garage', ''].includes(body.neg) ? body.neg : ''; await save('holded-neg', map); return json({ ok: true }); }
    if (seg[2] === 'pdf' && M === 'GET') { const r = await HV2('/invoices/' + encodeURIComponent(seg[3] || '') + '/pdf', true); if (!r.ok) return json({ error: 'Holded no devolvió el PDF (' + r.status + ')' }, 502); return new Response(await r.arrayBuffer(), { headers: { 'Content-Type': 'application/pdf' } }); }
    const y = Number(url.searchParams.get('y')) || new Date().getFullYear(), q = Math.min(4, Math.max(1, Number(url.searchParams.get('q')) || 1));
    const pad = (n) => String(n).padStart(2, '0'); const ini = `${y}-${pad((q - 1) * 3 + 1)}-01`, fin = `${y}-${pad(q * 3)}-${q === 1 || q === 4 ? 31 : 30}`;
    const all = []; let cursor = '';
    for (let i = 0; i < 20; i++) { const r = await HV2(`/invoices?limit=200&approval_status=approved&start_date=${ini}&end_date=${fin}&sort=date${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
      if (!r.ok || !r.d || !Array.isArray(r.d.items)) return json({ error: r.status === 401 ? 'Holded no acepta la clave (401). Revisa HOLDED_TOKEN en Netlify.' : r.status === 403 ? 'La clave de Holded no tiene permiso para leer facturas (403).' : 'Holded no responde (' + r.status + ')', det: typeof r.d === 'string' ? r.d.slice(0, 200) : r.d && (r.d.message || r.d.error || r.d.info) }, 502);
      all.push(...r.d.items); if (!r.d.has_more || !r.d.cursor) break; cursor = r.d.cursor; }
    const n2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
    const rows = all.filter((f) => f.document_number && f.status !== 'cancelled').map((f) => { const iva = n2(f.tax), total = n2(f.total);
      const ret = n2((f.lines || []).reduce((a, p) => a + (Number(p.price) || 0) * (Number(p.units) || 1) * (1 - (Number(p.discount) || 0) / 100) * (Number(p.retention) || 0) / 100, 0));
      const base = n2(total - iva + ret); /* total = base + IVA − retención */
      const auto = negFactura(f), n = f.id in map ? map[f.id] : auto;
      return { id: f.id, num: f.document_number, fecha: f.date || '', cliente: f.contact_name || '', base: n2(base), iva, ret, total, neg: n, auto: !(f.id in map), empresa: EMPRESA.test(String(f.contact_name || '').trim()), concepto: clip((f.lines || []).map((p) => p.name).filter(Boolean).join(' · ') || f.description, 160) }; });
    return json({ y, q, rows: rows.filter((x) => x.neg === neg), otras: rows.filter((x) => x.neg === ''), total: rows.length });
  }
  // Cartera de barcos de Plata Marine (barcos con hoja de encargo firmada)
  if (seg[0] === 'cartera') {
    if (!(me.negs || []).includes('marine')) return json({ error: 'No tienes acceso.' }, 403);
    const list = await load('cartera-marine');
    if (M === 'GET' && !seg[1]) return json(list);
    const campos = (o, b) => { ['barco', 'vendedor', 'telefono', 'email', 'zona', 'web', 'notas'].forEach((f) => { if (f in b) o[f] = clip(b[f], f === 'notas' ? 3000 : 200); }); ['precio', 'comision'].forEach((f) => { if (f in b) { const n = Number(String(b[f]).replace(/\./g, '').replace(',', '.')); o[f] = isFinite(n) && n > 0 ? n : 0; } }); ['firma', 'fin'].forEach((f) => { if (f in b) o[f] = /^\d{4}-\d{2}-\d{2}$/.test(b[f] || '') ? b[f] : ''; }); if ('estado' in b) o.estado = ['En venta', 'Reservado', 'Vendido', 'Retirado'].includes(b.estado) ? b.estado : 'En venta'; if ('tipo' in b) o.tipo = TIPOS_B.includes(b.tipo) ? b.tipo : ''; if ('eslora' in b) { const n = Number(String(b.eslora).replace(',', '.')); o.eslora = isFinite(n) && n > 0 && n < 100 ? n : 0; } if ('titulo' in b) o.titulo = ['0', '1', '2', '3', '4'].includes(String(b.titulo)) ? Number(b.titulo) : ''; if ('zonaKey' in b) o.zonaKey = ZONAS_B[b.zonaKey] ? b.zonaKey : ''; return o; };
    if (M === 'POST' && !seg[1]) { if (!clip(body.barco, 200)) return json({ error: 'Pon el nombre del barco' }, 400); const o = campos({ id: uid('b'), estado: 'En venta', created: new Date().toISOString() }, body); list.unshift(o); await save('cartera-marine', list); await avisarCruces(o).catch(() => {}); return json(o); }
    const i = list.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'GET') return json(list[i]);
    if (M === 'PUT') { const antes = [list[i].precio, list[i].estado].join('|'); campos(list[i], body); list[i].updated = new Date().toISOString(); await save('cartera-marine', list); if (antes !== [list[i].precio, list[i].estado].join('|')) await avisarCruces(list[i]).catch(() => {}); return json(list[i]); }
    if (M === 'DELETE') { list.splice(i, 1); await save('cartera-marine', list); return json({ ok: true }); }
  }
  // ---- vídeo del coche: se sube por trozos (Netlify limita cada petición a 6 MB) y se sirve por rangos ----
  if (seg[0] === 'video' && M === 'POST') {
    if (seg[1] === 'start') {
      const type = String(body.type || ''); const size = Number(body.size) || 0;
      if (!/^video\/(mp4|quicktime|webm)$/.test(type)) return json({ error: 'Formato de vídeo no admitido (usa MP4 o MOV)' }, 400);
      if (!size || size > VID_MAX) return json({ error: `El vídeo pesa demasiado (máximo ${Math.round(VID_MAX / 1e6)} MB). Grábalo en 720p o recórtalo.` }, 400);
      const key = `v-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
      return json({ key, chunk: VID_CHUNK, n: Math.ceil(size / VID_CHUNK) });
    }
    if (seg[1] === 'chunk') {
      const key = String(url.searchParams.get('key') || ''); const i = Number(url.searchParams.get('i'));
      if (!/^v-\d+-[a-f0-9]{8}$/.test(key) || !Number.isInteger(i) || i < 0 || i > 40) return json({ error: 'Trozo no válido' }, 400);
      const buf = Buffer.from(await req.arrayBuffer());
      if (!buf.length || buf.length > VID_CHUNK) return json({ error: 'Trozo no válido' }, 400);
      await media().set(`${key}.${i}`, buf, { metadata: { type: 'application/octet-stream' } });
      return json({ ok: true });
    }
    if (seg[1] === 'end') {
      const key = String(body.key || ''); const type = String(body.type || 'video/mp4'); const size = Number(body.size) || 0; const n = Math.ceil(size / VID_CHUNK);
      if (!/^v-\d+-[a-f0-9]{8}$/.test(key) || !n || n > 40) return json({ error: 'Vídeo no válido' }, 400);
      for (let i = 0; i < n; i++) if (!(await media().getMetadata(`${key}.${i}`).catch(() => null))) return json({ error: 'Faltan trozos del vídeo, vuelve a subirlo' }, 400);
      await media().set(key, '', { metadata: { type: /quicktime/.test(type) ? 'video/mp4' : type, size, cs: VID_CHUNK, n } });
      return json({ url: `${BASE}/media/${key}`, type: /quicktime/.test(type) ? 'video/mp4' : type, size });
    }
  }
  if (seg[0] === 'upload' && M === 'POST') {
    const { name, type, data } = body; // data: base64 (ya reducida en el navegador)
    if (!/^image\/(jpeg|png|webp)$/.test(type || '')) return json({ error: 'Formato no admitido' }, 400);
    const buf = Buffer.from(String(data || ''), 'base64');
    if (!buf.length || buf.length > 4.5e6) return json({ error: 'Imagen demasiado grande' }, 400);
    const key = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${slugify(String(name || 'foto').replace(/\.\w+$/, '')).slice(0, 40) || 'foto'}.${type.split('/')[1].replace('jpeg', 'jpg')}`;
    await media().set(key, buf, { metadata: { type } });
    return json({ url: `${BASE}/media/${key}` });
  }

  if (seg[0] === 'holders') {
    let hs = await load('holders');
    if (M === 'GET') return json(hs);
    if (M === 'PUT') {
      hs = (Array.isArray(body) ? body : []).slice(0, 20).map((h) => ({ id: h.id || uid('h'), name: clip(h.name, 80), accounts: (h.accounts || []).slice(0, 10).map((a) => ({ bank: clip(a.bank, 60), iban: clip(a.iban, 40).toUpperCase().replace(/\s+/g, ' ') })).filter((a) => a.iban) })).filter((h) => h.name);
      await save('holders', hs); return json(hs);
    }
  }

  if (seg[0] === 'schedule') {
    if (M === 'GET') return json(await load('schedule'));
    if (M === 'PUT') {
      const okH = (h) => /^([01]\d|2[0-3]):[0-5]\d$/.test(h);
      const week = {}; for (let d = 0; d < 7; d++) week[d] = [...new Set((body.week?.[d] || []).filter(okH))].sort();
      const blocks = (body.blocks || []).filter((b) => /^\d{4}-\d{2}-\d{2}$/.test(b.date)).map((b) => ({ id: b.id || uid('b'), date: b.date, allDay: !!b.allDay, hours: (b.hours || []).filter(okH), reason: clip(b.reason, 120) })).filter((b) => b.date >= addDays(today(), -1));
      const s = { week, blocks }; await save('schedule', s); return json(s);
    }
  }

  if (seg[0] === 'me') return json(me);
  if (seg[0] === 'neg' && NEGS[seg[1]] && !(me.negs || []).includes(seg[1])) return json({ error: 'No tienes acceso a este negocio.' }, 403);
  if (seg[0] !== 'neg' && seg[0] !== 'me' && !(me.negs || ['garage']).includes('garage')) return json({ error: 'No tienes acceso a Plata Garage.' }, 403);
  if (seg[0] === 'neg' && NEGS[seg[1]]) {
    const neg = seg[1], key = 'leads-' + neg;
    if (seg[2] === 'conexion' && M === 'GET') return json({ url: `${url.origin}${BASE}/api/lead/${neg}/${negToken(neg)}`, etapas: NEGS[neg].etapas });
    if (seg[2] === 'gastos') { const g = await load('gastos-' + neg); if (M === 'PUT') { const o = {}; Object.entries(body || {}).slice(0, 30).forEach(([k, v]) => { const n = Number(v); if (clip(k, 40) && isFinite(n) && n >= 0) o[clip(k, 40)] = Math.round(n * 100) / 100; }); await save('gastos-' + neg, o); return json(o); } return json(Array.isArray(g) ? {} : g); }
    const list = await load(key);
    if (migrar(neg, list)) await save(key, list);
    if (M === 'GET' && !seg[2]) return json({ etapas: NEGS[neg].etapas, tableros: NEGS[neg].tableros, motivos: NEGS[neg].motivos, nombre: NEGS[neg].nombre, leads: list });
    if (M === 'POST' && !seg[2]) { if (!clip(body.nombre, 80) && !body.telefono) return json({ error: 'Pon al menos el nombre o el teléfono' }, 400); await addNegLead(neg, { ...body, origen: body.origen || 'Manual', fecha: new Date().toISOString() }); return json({ ok: true }); }
    const i = list.findIndex((x) => x.id === seg[2]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { list.splice(i, 1); await save(key, list); return json({ ok: true }); }
    if (M === 'PUT') {
      const it = list[i]; const prev = it.etapa;
      if ('motivo' in body) { it.motivo = NEGS[neg].motivos.includes(body.motivo) ? body.motivo : ''; it.motivoTxt = clip(body.motivoTxt, 200); }
      if ('etapa' in body && NEGS[neg].etapas.includes(body.etapa)) { if (body.etapa === 'Perdido' && !it.motivo) return json({ error: 'Indica el motivo por el que se ha perdido.' }, 400); it.etapa = body.etapa; }
      if ('importe' in body) { const n = Number(String(body.importe).replace(',', '.')); it.importe = isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0; }
      if ('certificado' in body) it.certificado = clip(body.certificado, 40);
      ['notas', 'accion'].forEach((k) => { if (k in body) it[k] = clip(body[k], 4000); });
      ['nombre', 'email', 'origen', 'tipo', 'interes'].forEach((k) => { if (k in body) it[k] = clip(body[k], 200); });
      if ('telefono' in body) { it.telefono = normPhone(body.telefono) || clip(body.telefono, 20); it.key = pkey(it.telefono); }
      if (prev !== it.etapa) { const d = new Date().toISOString(); it.desde = d; if (it.etapa === 'Perdido') it.antes = prev; it.fechas = { ...(it.fechas || {}), [it.etapa]: d }; if (it.etapa !== 'Perdido') { it.motivo = ''; it.motivoTxt = ''; } it.historial = [{ d, t: `Etapa: ${prev} → ${it.etapa}${it.etapa === 'Perdido' ? ' (' + [it.motivo, it.motivoTxt].filter(Boolean).join(': ') + ')' : ''} (${me.name})` }, ...(it.historial || [])].slice(0, 100); }
      it.updated = new Date().toISOString(); await save(key, list); return json(it);
    }
  }
  if (seg[0] === 'push') {
    if (M === 'GET') return json({ key: (await webpushLib()).v.pub });
    const sub = body.sub; if (!sub || typeof sub.endpoint !== 'string' || !/^https:\/\//.test(sub.endpoint) || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) return json({ error: 'Suscripción no válida' }, 400);
    let subs = (await load('pushsubs')).filter((s) => s.sub.endpoint !== sub.endpoint);
    if (M === 'DELETE' || body.off) { await save('pushsubs', subs); return json({ ok: true }); }
    subs.unshift({ uid: me.id, sub: { endpoint: clip(sub.endpoint, 600), keys: { p256dh: clip(sub.keys.p256dh, 200), auth: clip(sub.keys.auth, 100) } }, d: new Date().toISOString() });
    await save('pushsubs', subs.slice(0, 40));
    await pushAll('garage', 'Avisos activados', 'Te llegarán aquí los leads nuevos', 'test', sub.endpoint).catch(() => {});
    return json({ ok: true });
  }
  if (seg[0] === 'ical' && M === 'GET') return json({ url: `${url.origin}${BASE}/api/ical/${icalToken()}.ics`, portales: `${url.origin}${BASE}/api/portal/${ingestToken()}` });
  if (seg[0] === 'clientes') {
    if (M === 'GET') return json(await buildClientes());
    if (M === 'PUT' && seg[1]) {
      const cl = await load('clientes'); const k = pkey(seg[1]); if (!k) return json({ error: 'Cliente no válido' }, 400);
      let it = cl.find((x) => x.key === k); if (!it) { it = { key: k }; cl.push(it); }
      if ('motivo' in body) { it.motivo = MOTIVOS.includes(body.motivo) ? body.motivo : ''; it.motivoTxt = clip(body.motivoTxt, 200); }
      if ('etapa' in body) { if (body.etapa && !ETAPAS.includes(body.etapa)) return json({ error: 'Etapa no válida' }, 400);
        if (body.etapa === 'perdido' && !it.motivo) return json({ error: 'Indica el motivo por el que se ha perdido.' }, 400);
        if (body.etapa === 'cerrado') { // No se cierra el expediente sin la factura de venta subida en el coche
          const [cars, docs] = await Promise.all([load('cars'), load('docs')]); const car = cars.find((c) => c.buyer === k);
          if (!car) return json({ error: 'Para cerrar, asigna antes este cliente como comprador en la ficha del coche.' }, 400);
          if (!((docs['car:' + car.id] || {}).files || []).some((f) => f.tipo === 'Factura de venta')) return json({ error: `Falta la factura de venta del ${car.brand} ${car.model}: súbela en Documentos del coche para poder cerrar.` }, 400); }
        const d = new Date().toISOString(); it.etapa = body.etapa || ''; it.at = d; it.by = me.name;
        if (it.etapa) { it.fechas = { ...(it.fechas || {}), [it.etapa]: d }; if (it.etapa !== 'perdido') it.maxr = Math.max(it.maxr || 0, ETAPAS.indexOf(it.etapa)); }
        if (it.etapa !== 'perdido') { it.motivo = ''; it.motivoTxt = ''; } }
      if ('banco' in body) it.banco = clip(body.banco, 60);
      if ('finEstado' in body) it.finEstado = ['', 'en estudio', 'aprobada', 'denegada'].includes(body.finEstado) ? body.finEstado : '';
      if ('certificado' in body) it.certificado = clip(body.certificado, 40);
      if ('notas' in body) it.notas = clip(body.notas, 4000);
      await save('clientes', cl); return json({ ok: true });
    }
    if (M === 'DELETE' && seg[1]) {
      const cl = await load('clientes'); const k = pkey(seg[1]); if (!k) return json({ error: 'Cliente no válido' }, 400);
      let it = cl.find((x) => x.key === k); if (!it) { it = { key: k }; cl.push(it); }
      it.borrado = new Date().toISOString(); it.borradoPor = me.name; await save('clientes', cl); return json({ ok: true });
    }
  }
  if (seg[0] === 'stats' && M === 'DELETE') { // Reiniciar las analíticas de la web de Plata Garage (solo administrador)
    if (me.role !== 'admin') return json({ error: 'Solo un administrador puede reiniciar las analíticas.' }, 403);
    const { blobs } = await db().list({ prefix: 'stats/' }); for (const b of blobs) await db().delete(b.key);
    return json({ ok: true, borrados: blobs.length });
  }
  if (seg[0] === 'stats' && M === 'GET') {
    const dias = Math.min(Math.max(Number(url.searchParams.get('dias')) || 30, 1), 365); const out = [];
    const neg = url.searchParams.get('neg'); const pre = WNEG.includes(neg) ? `wstats/${neg}/` : 'stats/';
    if (WNEG.includes(neg) && !(me.negs || []).includes(neg)) return json({ error: 'No tienes acceso a este negocio.' }, 403);
    for (let i = dias - 1; i >= 0; i--) { const d = addDays(today(), -i); out.push({ d, ...((await db().get(`${pre}${d}`, { type: 'json' })) || {}) }); }
    return json(out);
  }
  if (seg[0] === 'users') {
    if (me.role !== 'admin') return json({ error: 'Solo un administrador puede gestionar usuarios.' }, 403);
    const users = await load('users');
    const NG = ['garage', 'marine', 'rotulito']; const negsDe = (b) => (Array.isArray(b.negs) ? b.negs.filter((x) => NG.includes(x)) : ['garage']);
    const pub = (u) => ({ id: u.id, name: u.name, user: u.user, role: u.role, negs: u.role === 'admin' ? NG : (u.negs || ['garage']), disabled: !!u.disabled, created: u.created });
    if (M === 'GET') return json(users.map(pub));
    if (M === 'POST' && !seg[1]) {
      const user = slugify(body.user || '').replace(/-/g, '.'); if (!user || users.some((x) => x.user === user) || user === 'admin') return json({ error: 'Usuario no válido o ya existe.' }, 400);
      if (!strong(body.password)) return json({ error: 'La contraseña debe tener al menos 12 caracteres, con letras y números.' }, 400);
      const u = { negs: negsDe(body), id: uid('u'), name: clip(body.name, 60) || user, user, role: body.role === 'admin' ? 'admin' : 'editor', ver: 0, created: today(), ...hashPass(body.password) };
      users.push(u); await save('users', users); return json(pub(u));
    }
    // Cerrar todas las sesiones abiertas con la contraseña maestra (Juan mientras no tenga usuario propio)
    if (seg[1] === 'admin-sesiones' && M === 'PUT') { const av = await load('authver'); av.admin = (av.admin || 0) + 1; await save('authver', av); return json({ ok: true }); }
    const i = users.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { users.splice(i, 1); await save('users', users); return json({ ok: true }); }
    if (M === 'PUT') {
      const u = users[i];
      if ('password' in body) { if (!strong(body.password)) return json({ error: 'La contraseña debe tener al menos 12 caracteres, con letras y números.' }, 400); Object.assign(u, hashPass(body.password)); u.ver = (u.ver || 0) + 1; }
      if ('name' in body) u.name = clip(body.name, 60);
      if ('role' in body) u.role = body.role === 'admin' ? 'admin' : 'editor';
      if ('negs' in body) u.negs = negsDe(body);
      if ('disabled' in body) { u.disabled = !!body.disabled; u.ver = (u.ver || 0) + 1; }
      if (body.cerrar) u.ver = (u.ver || 0) + 1; // cierra sus sesiones en todos los dispositivos
      await save('users', users); return json(pub(u));
    }
  }
  const map = { reservas: 'bookings', tasaciones: 'tasaciones', envios: 'envios', mensajes: 'mensajes', alertas: 'alertas', busquedas: 'busquedas', portales: 'portales' };
  if (map[seg[0]]) {
    const key = map[seg[0]]; const list = await load(key);
    if (M === 'GET') return json(list);
    const i = list.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { list.splice(i, 1); await save(key, list); return json({ ok: true }); }
    if (M === 'PUT') {
      const allowed = { bookings: ['pendiente', 'confirmada', 'cancelada', 'completada'], tasaciones: ['pendiente', 'contactado', 'ofertado', 'visto', 'comprado', 'gestion', 'vendido', 'descartado', 'cerrada'], envios: ['pendiente', 'presupuesto enviado', 'aceptado', 'rechazado'], mensajes: ['pendiente', 'respondido'], alertas: ['activa', 'avisado', 'baja'], busquedas: ['pendiente', 'buscando', 'propuesto', 'cerrada'], portales: ['pendiente', 'contactado', 'cita', 'descartado'] }[key];
      if ('status' in body && allowed.includes(body.status) && body.status !== list[i].status) { const d = new Date().toISOString(); list[i].historial = [{ d, t: `Paso: ${list[i].status || 'pendiente'} → ${body.status}` }, ...(list[i].historial || [])].slice(0, 50); list[i].status = body.status; list[i].desde = d; }
      if (key === 'tasaciones' && 'oferta' in body) { const n = Number(String(body.oferta).replace(/\./g, '').replace(',', '.')); list[i].oferta = isFinite(n) && n > 0 ? Math.round(n) : 0; }
      if (key === 'tasaciones' && 'motivo' in body) list[i].motivo = clip(body.motivo, 200);
      if ('notas' in body) list[i].notas = clip(body.notas, 2000);
      if ('leido' in body) list[i].leido = !!body.leido;
      if (key === 'bookings' && body.fecha && body.hora) { list[i].fecha = clip(body.fecha, 10); list[i].hora = clip(body.hora, 5); }
      await save(key, list); return json(list[i]);
    }
  }

  if (seg[0] === 'posts') {
    const posts = await load('posts');
    if (M === 'GET') return json(posts);
    const clean = (b, o) => ({ ...o, title: clip(b.title, 160), excerpt: clip(b.excerpt, 300), cover: (b.cover || '').startsWith(BASE + '/') ? b.cover : '', tags: String(b.tags || '').split(',').map((x) => clip(x, 30)).filter(Boolean).slice(0, 8), body: clip(b.body, 60000), published: !!b.published });
    if (M === 'POST' && !seg[1]) {
      const p = clean(body, { id: uid('p'), created: today() }); if (!p.title || !p.body) return json({ error: 'Faltan título o contenido' }, 400);
      let s = slugify(p.title), n = 2; while (posts.some((x) => x.slug === s)) s = `${slugify(p.title)}-${n++}`; p.slug = s;
      if (p.published) p.publishedAt = today(); posts.unshift(p); await save('posts', posts); return json(p);
    }
    const i = posts.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { posts.splice(i, 1); await save('posts', posts); return json({ ok: true }); }
    if (M === 'PUT') {
      const p = clean(body, posts[i]); if (!p.title || !p.body) return json({ error: 'Faltan título o contenido' }, 400);
      if (p.published && !posts[i].publishedAt) p.publishedAt = today(); p.updated = today(); posts[i] = p; await save('posts', posts); return json(p);
    }
  }
  return json({ error: 'No encontrado' }, 404);
}

async function dropMedia(urls = []) {
  for (const u of urls) { const k = u.startsWith('/media/') ? u.slice(7) : u.startsWith(ST + '/media/') ? u.slice(ST.length + 7) : ''; if (k) await media().delete(k).catch(() => {}); }
}

// ---------- vídeo ----------
const VID_CHUNK = 4 * 1024 * 1024, VID_MAX = 80 * 1000 * 1000;
async function serveVideo(key, req) {
  const meta = (await media().getMetadata(key).catch(() => null))?.metadata;
  if (!meta || !meta.n) return new Response('No encontrado', { status: 404 });
  const size = Number(meta.size), cs = Number(meta.cs) || VID_CHUNK;
  const m = (req.headers.get('range') || '').match(/bytes=(\d*)-(\d*)/);
  let start = 0, end = size - 1;
  if (m) { if (m[1] !== '') { start = +m[1]; if (m[2] !== '') end = Math.min(+m[2], size - 1); } else if (m[2] !== '') start = Math.max(0, size - +m[2]); }
  if (start >= size) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
  const ci = Math.floor(start / cs); end = Math.min(end, (ci + 1) * cs - 1); // como mucho un trozo por respuesta
  const part = await media().get(`${key}.${ci}`, { type: 'arrayBuffer' });
  if (!part) return new Response('No encontrado', { status: 404 });
  const out = new Uint8Array(part).slice(start - ci * cs, end - ci * cs + 1);
  return new Response(out, { status: 206, headers: { 'content-type': meta.type || 'video/mp4', 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(out.length), 'accept-ranges': 'bytes', 'cache-control': 'public, max-age=31536000, immutable' } });
}
async function dropVideo(u) {
  const key = String(u).split('/media/')[1] || ''; if (!/^v-/.test(key)) return;
  const meta = (await media().getMetadata(key).catch(() => null))?.metadata || {};
  for (let i = 0; i < (Number(meta.n) || 40); i++) await media().delete(`${key}.${i}`).catch(() => {});
  await media().delete(key).catch(() => {});
}

// ---------- IndexNow: avisa a Bing (y a otros buscadores) al momento de coches nuevos, cambiados o vendidos ----------
const INDEXNOW_KEY = '5f4b2bcc8d4c3a7d9201292845bbbc7a';
async function indexNow(origin, slugs) {
  if (!INDEX()) return;
  const site = (env('PG_SITE_URL') || origin).replace(/\/+$/, ''); const host = new URL(site).host;
  const urls = [];
  slugs.filter(Boolean).forEach((s) => ['', '/ca', '/en'].forEach((l) => urls.push(`${site}${l}/vehiculos/${s}`)));
  ['', '/ca', '/en'].forEach((l) => urls.push(`${site}${l}/vehiculos/`));
  await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${site}/${INDEXNOW_KEY}.txt`, urlList: urls }), signal: AbortSignal.timeout(4000) }).catch(() => {});
}

// Versiones en catalán (/ca/) e inglés (/en/)
export default I18N.wrap(inner, (u) => (env('PG_SITE_URL') || u.origin).replace(/\/+$/, ''), { store: () => db(), key: () => env('PG_TRANSLATE_KEY') });
