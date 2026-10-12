// Plata Garage · web pública + panel de gestión (Netlify Functions + Netlify Blobs)
import { getStore as nfGetStore } from '@netlify/blobs';
import crypto from 'node:crypto';
import seed from './seed.mjs';
import * as V from './views.mjs';

export const config = {
  path: ['/platagarage', '/platagarage/*'],
  excludedPath: ['/platagarage/assets/*', '/platagarage/img/*'],
};

const BASE = '/platagarage';
const TZ = 'Europe/Madrid';
const env = (k) => (globalThis.Netlify?.env?.get?.(k)) ?? process.env[k];
const store = (name) => (globalThis.__pgGetStore || nfGetStore)({ name, consistency: 'strong' });
const db = () => store('platagarage');
const media = () => store('platagarage-media');

// ---------- datos ----------
const DEFAULTS = { cars: seed.cars, holders: seed.holders, schedule: seed.schedule, bookings: [], tasaciones: [], envios: [], mensajes: [], posts: [] };
async function load(key) {
  const v = await db().get(key, { type: 'json' });
  if (v == null) { const d = structuredClone(DEFAULTS[key]); await db().setJSON(key, d); return d; }
  return v;
}
const save = (key, v) => db().setJSON(key, v);
const uid = (p = '') => p + Date.now().toString(36) + crypto.randomBytes(3).toString('hex');

// ---------- utilidades ----------
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...headers } });
const html = (body, status = 200, extra = {}) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate', 'x-robots-tag': 'noindex, nofollow', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', ...extra } });
const redirect = (to, status = 301) => new Response(null, { status, headers: { location: to, 'cache-control': 'no-store' } });
export const slugify = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\+/g, ' plus ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const clip = (v, n) => String(v ?? '').trim().slice(0, n);
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

// ---------- sesión ----------
const secret = () => env('PG_SESSION_SECRET') || crypto.createHash('sha256').update('pg|' + (env('PG_ADMIN_PASSWORD') || '')).digest('hex');
function sign(v) { return crypto.createHmac('sha256', secret()).update(v).digest('base64url'); }
function makeToken() { const exp = Date.now() + 30 * 864e5; const p = `adm.${exp}`; return `${p}.${sign(p)}`; }
function authed(req) {
  if (!env('PG_ADMIN_PASSWORD')) return false;
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)pg_s=([^;]+)/);
  if (!m) return false;
  const [a, exp, sig] = m[1].split('.');
  if (a !== 'adm' || !sig || Number(exp) < Date.now()) return false;
  const good = sign(`${a}.${exp}`);
  return good.length === sig.length && crypto.timingSafeEqual(Buffer.from(good), Buffer.from(sig));
}
const cookie = (v, maxAge) => `pg_s=${v}; Path=${BASE}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
function passOk(p) {
  const real = env('PG_ADMIN_PASSWORD') || '';
  if (!real || !p) return false;
  const a = crypto.createHash('sha256').update(String(p)).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

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
function checkContact(f) {
  if (f.web) return { spam: true };                                        // honeypot
  const t = Number(f.t || 0); if (!t || Date.now() - t < 3000) return { spam: true };   // enviado demasiado rápido
  if (f.privacidad !== 'si' && f.privacidad !== true && f.privacidad !== 'on') return { error: 'Debes aceptar la política de privacidad.' };
  const nombre = clip(f.nombre, 80); if (!isName(nombre)) return { error: 'Escribe tu nombre.' };
  const telefono = normPhone(f.telefono); if (!telefono) return { error: 'Escribe un teléfono válido.' };
  const email = clip(f.email, 200).toLowerCase(); if (!isEmail(email)) return { error: 'El email no es válido.' };
  if (/https?:\/\/|<a\s|\[url/i.test(String(f.mensaje || '') + String(f.notas || ''))) return { error: 'No se admiten enlaces en el mensaje.' };
  return { data: { nombre, telefono, email } };
}

// ---------- horarios ----------
async function freeSlots(date) {
  const t = today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < t || date > addDays(t, 60)) return [];
  const sch = await load('schedule');
  const blk = (sch.blocks || []).filter((b) => b.date === date);
  if (blk.some((b) => b.allDay)) return [];
  const blockedH = new Set(blk.flatMap((b) => b.hours || []));
  const taken = new Set((await load('bookings')).filter((b) => b.fecha === date && b.status !== 'cancelada').map((b) => b.hora));
  let hrs = (sch.week[String(dow(date))] || []).filter((h) => !blockedH.has(h) && !taken.has(h));
  if (date === t) { const [H, M] = nowHM().split(':').map(Number); const lim = H * 60 + M + 60; hrs = hrs.filter((h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b >= lim; }); }
  return hrs.sort();
}

// ---------- coches ----------
const pubCars = (cars) => cars.filter((c) => !c.sold && !c.hidden);
function cleanCar(b, old = {}) {
  const c = { ...old };
  const S = (k, n = 120) => { if (k in b) c[k] = clip(b[k], n); };
  ['brand', 'model', 'version', 'fuel', 'trans', 'body', 'color', 'holder', 'status'].forEach((k) => S(k));
  if ('desc' in b) c.desc = clip(b.desc, 8000);
  ['year', 'km', 'price', 'cv', 'doors', 'seats', 'monthly', 'term', 'reserve'].forEach((k) => { if (k in b) c[k] = num(b[k]); });
  if ('features' in b) c.features = (Array.isArray(b.features) ? b.features : String(b.features).split('\n')).map((x) => clip(x, 120)).filter(Boolean).slice(0, 80);
  if ('images' in b) c.images = (b.images || []).filter((u) => typeof u === 'string' && u.startsWith(BASE + '/')).slice(0, 40);
  ['featured', 'sold', 'hidden'].forEach((k) => { if (k in b) c[k] = !!b[k]; });
  if (!['disponible', 'preparacion', 'reservado'].includes(c.status)) c.status = 'disponible';
  return c;
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

// ---------- router ----------
export default async (req, context) => {
  const url = new URL(req.url);
  let p = url.pathname.replace(/\/+$/, '') || '/';
  const M = req.method;
  const ip = context?.ip || req.headers.get('x-nf-client-connection-ip') || '';
  try {
    if (p === BASE && !url.pathname.endsWith('/')) return redirect(BASE + '/');
    const sub = p.slice(BASE.length) || '/';

    // ---- fotos subidas desde el panel ----
    if (sub.startsWith('/media/')) {
      const key = sub.slice(7);
      const r = await media().getWithMetadata(key, { type: 'arrayBuffer' });
      if (!r) return new Response('No encontrado', { status: 404 });
      return new Response(r.data, { headers: { 'content-type': r.metadata?.type || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
    }

    // ---- API ----
    if (sub.startsWith('/api/')) return await api(sub.slice(4), req, M, ip, url);

    // ---- panel ----
    if (sub === '/admin') return html(V.adminShell(), 200, { 'cache-control': 'no-store' });

    // ---- web pública ----
    const cars = await load('cars');
    if (sub === '/') return html(V.home({ cars: pubCars(cars), sched: await load('schedule') }));
    if (sub === '/vehiculos') return html(V.catalog({ cars: pubCars(cars), q: Object.fromEntries(url.searchParams) }));
    if (sub.startsWith('/vehiculos/')) {
      const slug = sub.slice(11).replace(/\.html$/, '');
      if (sub.endsWith('.html')) return redirect(`${BASE}/vehiculos/${slug}`);
      const car = cars.find((c) => c.slug === slug || (c.oldSlugs || []).includes(slug));
      if (!car || car.sold || car.hidden) return redirect(`${BASE}/vehiculos/`);
      if (car.slug !== slug) return redirect(`${BASE}/vehiculos/${car.slug}`);
      return html(V.ficha({ car, cars: pubCars(cars), holders: await load('holders') }));
    }
    if (sub === '/cita') return html(V.cita({ cars: pubCars(cars), coche: url.searchParams.get('coche') || '', motivo: url.searchParams.get('motivo') || '' }));
    if (sub === '/contacto') return html(V.contacto({ cars: pubCars(cars) }));
    if (sub === '/privacidad') return html(V.privacidad());
    if (sub === '/gracias') return html(V.gracias(url.searchParams.get('t') || ''));
    if (sub === '/blog') return html(V.blogList({ posts: (await load('posts')).filter((x) => x.published) }));
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

// ---------- API ----------
async function api(r, req, M, ip, url) {
  // Públicas
  if (r === '/slots' && M === 'GET') return json({ slots: await freeSlots(url.searchParams.get('fecha') || '') });

  if (['/cita', '/tasacion', '/envio', '/mensaje'].includes(r) && M === 'POST') {
    const f = await readForm(req);
    const chk = checkContact(f);
    if (chk.spam) return json({ ok: true }); // no damos pistas al bot
    if (chk.error) return json({ error: chk.error }, 400);
    if (await rateLimited(ip, 'form', 8)) return json({ error: 'Has enviado demasiadas solicitudes. Escríbenos por WhatsApp.' }, 429);
    const base = { id: uid(), ...chk.data, created: new Date().toISOString(), status: 'pendiente', notas: '' };
    const cars = await load('cars');
    const carRef = (slug) => { const c = cars.find((x) => x.slug === slug); return c ? { coche: c.slug, cocheNombre: `${c.brand} ${c.model} ${c.version || ''} (${c.year})`.replace(/\s+/g, ' ') } : {}; };
    if (r === '/cita') {
      const fecha = clip(f.fecha, 10), hora = clip(f.hora, 5);
      if (!(await freeSlots(fecha)).includes(hora)) return json({ error: 'Esa hora ya no está disponible. Elige otra.' }, 409);
      const motivo = clip(f.motivo, 60) || 'Ver un coche en concreto';
      const list = await load('bookings');
      list.unshift({ ...base, tipo: motivo === 'Reservar este coche' ? 'reserva' : 'cita', fecha, hora, motivo, mensaje: clip(f.mensaje, 1000), ...carRef(f.coche) });
      await save('bookings', list);
    } else if (r === '/tasacion') {
      const list = await load('tasaciones');
      list.unshift({ ...base, marca: clip(f.marca, 40), modelo: clip(f.modelo, 60), anio: num(f.anio), km: num(f.km), combustible: clip(f.combustible, 20), notas_cliente: clip(f.notas, 1500) });
      await save('tasaciones', list);
    } else if (r === '/envio') {
      const cp = clip(f.cp, 5); if (!/^\d{5}$/.test(cp)) return json({ error: 'Escribe un código postal de 5 cifras.' }, 400);
      const list = await load('envios');
      list.unshift({ ...base, cp, ...carRef(f.coche) });
      await save('envios', list);
    } else {
      const list = await load('mensajes');
      list.unshift({ ...base, asunto: clip(f.asunto, 120), mensaje: clip(f.mensaje, 3000), leido: false });
      await save('mensajes', list);
    }
    await notify(r.slice(1), base).catch(() => {});
    return json({ ok: true });
  }

  // Login
  if (r === '/login' && M === 'POST') {
    if (!env('PG_ADMIN_PASSWORD')) return json({ error: 'El panel aún no tiene contraseña configurada.' }, 503);
    if (await rateLimited(ip, 'login', 10)) return json({ error: 'Demasiados intentos. Espera una hora.' }, 429);
    const f = await readForm(req);
    if (!passOk(f.password)) { await new Promise((s) => setTimeout(s, 800)); return json({ error: 'Contraseña incorrecta.' }, 401); }
    return json({ ok: true }, 200, { 'set-cookie': cookie(makeToken(), 30 * 86400) });
  }
  if (r === '/logout') return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });

  // Privadas
  if (!r.startsWith('/admin/')) return json({ error: 'No encontrado' }, 404);
  if (!authed(req)) return json({ error: 'auth' }, 401);
  if (M !== 'GET' && (req.headers.get('x-pg') !== '1')) return json({ error: 'Petición no válida' }, 403); // CSRF
  return await adminApi(r.slice(6), req, M);
}

async function notify() { /* Fase 3: aviso por correo. Pendiente de elegir proveedor. */ }

const COLS = ['bookings', 'tasaciones', 'envios', 'mensajes'];
async function adminApi(r, req, M) {
  const body = M === 'GET' || M === 'DELETE' ? {} : await req.json().catch(() => ({}));
  const seg = r.split('/').filter(Boolean); // e.g. ['cars','c001']

  if (seg[0] === 'summary') {
    const [cars, b, t, e, m] = await Promise.all(['cars', 'bookings', 'tasaciones', 'envios', 'mensajes'].map(load));
    const td = today();
    return json({
      enStock: cars.filter((c) => !c.sold).length, vendidos: cars.filter((c) => c.sold).length,
      destacados: cars.filter((c) => c.featured && !c.sold).length,
      citasPendientes: b.filter((x) => x.status === 'pendiente').length,
      proximasCitas: b.filter((x) => x.fecha >= td && x.status !== 'cancelada').sort((a, z) => (a.fecha + a.hora).localeCompare(z.fecha + z.hora)).slice(0, 6),
      tasacionesNuevas: t.filter((x) => x.status === 'pendiente').length, ultimasTasaciones: t.slice(0, 5),
      enviosPendientes: e.filter((x) => x.status === 'pendiente').length, mensajesSinLeer: m.filter((x) => !x.leido).length,
      valorStock: cars.filter((c) => !c.sold).reduce((s, c) => s + (c.price || 0), 0),
    });
  }

  if (seg[0] === 'cars') {
    const cars = await load('cars');
    if (M === 'GET' && !seg[1]) return json(cars);
    if (M === 'GET') { const c = cars.find((x) => x.id === seg[1]); return c ? json(c) : json({ error: 'No existe' }, 404); }
    if (M === 'POST' && !seg[1]) {
      const c = cleanCar(body, { id: uid('c'), featured: false, sold: false, images: [], features: [], status: 'disponible', created: today() });
      const e = carErrors(c); if (e.length) return json({ error: 'Faltan datos: ' + e.join(', ') }, 400);
      c.slug = uniqueSlug(cars, c); c.updated = today(); cars.unshift(c); await save('cars', cars); return json(c);
    }
    const i = cars.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { const [old] = cars.splice(i, 1); await save('cars', cars); await dropMedia(old.images); return json({ ok: true }); }
    if (M === 'PUT') {
      const old = cars[i]; const c = cleanCar(body, old);
      const e = carErrors(c); if (e.length) return json({ error: 'Faltan datos: ' + e.join(', ') }, 400);
      const ns = uniqueSlug(cars, c);
      if (ns !== old.slug) { c.oldSlugs = [...new Set([...(old.oldSlugs || []), old.slug])].slice(-10); c.slug = ns; }
      if (c.sold && !old.sold) c.soldAt = today();
      c.updated = today(); cars[i] = c; await save('cars', cars);
      await dropMedia((old.images || []).filter((u) => !(c.images || []).includes(u)));
      return json(c);
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

  const map = { reservas: 'bookings', tasaciones: 'tasaciones', envios: 'envios', mensajes: 'mensajes' };
  if (map[seg[0]]) {
    const key = map[seg[0]]; const list = await load(key);
    if (M === 'GET') return json(list);
    const i = list.findIndex((x) => x.id === seg[1]); if (i < 0) return json({ error: 'No existe' }, 404);
    if (M === 'DELETE') { list.splice(i, 1); await save(key, list); return json({ ok: true }); }
    if (M === 'PUT') {
      const allowed = { bookings: ['pendiente', 'confirmada', 'cancelada', 'completada'], tasaciones: ['pendiente', 'contactado', 'ofertado', 'cerrada'], envios: ['pendiente', 'presupuesto enviado', 'aceptado', 'rechazado'], mensajes: ['pendiente', 'respondido'] }[key];
      if ('status' in body && allowed.includes(body.status)) list[i].status = body.status;
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
  for (const u of urls) if (u.startsWith(BASE + '/media/')) await media().delete(u.slice(BASE.length + 7)).catch(() => {});
}
