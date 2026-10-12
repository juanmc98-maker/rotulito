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
  blog: svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'),
  web: svg('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>'),
  out: svg('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>'),
  star: svg('<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>'),
  edit: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>'),
  sold: svg('<path d="M20 6L9 17l-5-5"/>'),
  menu: svg('<path d="M3 6h18M3 12h18M3 18h18"/>'),
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
function showLogin() {
  $('#app').innerHTML = `<div class="login"><form class="card" id="lf"><img src="${B}/assets/logo.png" alt="Plata Garage"><h2>Backoffice</h2><label style="text-align:left">Contraseña<input type="password" name="password" autocomplete="current-password" required autofocus></label><button class="btn" style="justify-content:center">Entrar</button><p class="mu sm" id="le"></p></form></div>`;
  $('#lf').onsubmit = async (e) => {
    e.preventDefault(); const b = e.target.querySelector('button'); b.disabled = true;
    const r = await fetch(API + '/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: e.target.password.value }) });
    const j = await r.json().catch(() => ({})); b.disabled = false;
    if (r.ok) { location.hash = '#resumen'; boot(); } else $('#le').textContent = j.error || 'No se pudo entrar';
  };
}

// ---------- layout ----------
const NAV = [['resumen', 'Resumen'], ['coches', 'Coches'], ['bancos', 'Bancos'], ['reservas', 'Reservas'], ['horarios', 'Horarios'], ['valoraciones', 'Valoraciones'], ['envios', 'Envíos'], ['mensajes', 'Mensajes'], ['blog', 'Blog']];
let badges = {};
function shell(active) {
  if (!$('.lay')) {
    $('#app').innerHTML = `<div class="mob"><button class="ib" id="mb">${IC.menu}</button><img src="${B}/assets/logo.png" alt=""></div><div class="lay"><aside id="sb"></aside><main id="mn"></main></div>`;
    $('#mb').onclick = () => $('#sb').classList.toggle('open');
  }
  $('#sb').innerHTML = `<a class="lg" href="#resumen" style="display:block;padding:0 6px"><img src="${B}/assets/logo.png" alt="Plata Garage"><small>Backoffice</small></a>` +
    NAV.map(([k, t]) => `<a href="#${k}" class="${active === k ? 'on' : ''}">${IC[k]}${t}${badges[k] ? `<span class="bd">${badges[k]}</span>` : ''}</a>`).join('') +
    `<div class="sp"></div><a href="${B}/" target="_blank">${IC.web}Ver web pública</a><a href="#" id="lo">${IC.out}Cerrar sesión</a>`;
  $('#lo').onclick = guard(async (e) => { e.preventDefault(); await fetch(API + '/logout'); showLogin(); });
  $('#sb').classList.remove('open');
  return $('#mn');
}
const top = (t, sub = '', right = '') => `<div class="top"><div><h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}</div><div class="row">${right}</div></div>`;
const badge = (s) => { const m = { pendiente: 'w', confirmada: 'b', completada: 'ok', cancelada: 'r', contactado: 'b', ofertado: 'o', cerrada: 'ok', 'presupuesto enviado': 'b', aceptado: 'ok', rechazado: 'r', respondido: 'ok' }; return `<span class="bg ${m[s] || 'x'}">${esc(s[0].toUpperCase() + s.slice(1))}</span>`; };

// ---------- vistas ----------
const V = {};

V.resumen = async (m) => {
  const s = await api('/admin/summary');
  badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, mensajes: s.mensajesSinLeer };
  m = shell('resumen');
  const k = (n, t, h) => `<a class="card" href="#${h}"><span>${t}</span><b>${n}</b></a>`;
  m.innerHTML = top('Resumen', 'Estado general de la actividad reciente.') +
    `<div class="kp">${k(s.enStock, 'Coches en stock', 'coches')}${k(s.vendidos, 'Coches vendidos', 'coches/vendidos')}${k(s.citasPendientes, 'Citas pendientes', 'reservas')}${k(s.tasacionesNuevas, 'Valoraciones nuevas', 'valoraciones')}${k(s.enviosPendientes, 'Envíos pendientes', 'envios')}${k(s.mensajesSinLeer, 'Mensajes sin leer', 'mensajes')}${k(s.destacados, 'Destacados activos', 'coches')}${k(eur(s.valorStock), 'Valor del stock', 'coches')}</div>
    <div class="two"><div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Próximas citas</h3><a href="#reservas" class="sm" style="color:var(--or)">Ver todas</a></div>${s.proximasCitas.length ? `<table>${s.proximasCitas.map((b) => `<tr><td><b>${esc(b.nombre)}</b><br><span class="mu sm">${esc(b.cocheNombre || b.motivo)}</span></td><td>${fdate(b.fecha)} · ${b.hora}</td><td>${badge(b.status)}</td></tr>`).join('')}</table>` : '<p class="mu">No hay citas próximas.</p>'}</div>
    <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Últimas tasaciones</h3><a href="#valoraciones" class="sm" style="color:var(--or)">Ver todas</a></div>${s.ultimasTasaciones.length ? `<table>${s.ultimasTasaciones.map((t) => `<tr><td><b>${esc(t.marca)} ${esc(t.modelo)}</b><br><span class="mu sm">${esc(t.nombre)}</span></td><td>${fdate(t.created)}</td><td>${badge(t.status)}</td></tr>`).join('')}</table>` : '<p class="mu">Aún no hay tasaciones.</p>'}</div></div>`;
};

V.coches = async (m, arg) => {
  const cars = await api('/admin/cars'); m = shell('coches');
  const f = arg || 'stock';
  const list = cars.filter((c) => (f === 'stock' ? !c.sold : f === 'vendidos' ? c.sold : true));
  const st = (c) => (c.sold ? '<span class="bg x">Vendido</span>' : c.status === 'reservado' ? '<span class="bg b">Reservado</span>' : c.status === 'preparacion' ? '<span class="bg w">En preparación</span>' : '<span class="bg ok">En stock</span>') + (c.featured && !c.sold ? '<span class="bg o">Destacado</span>' : '') + (c.hidden ? '<span class="bg r">Oculto</span>' : '');
  m.innerHTML = top('Coches', `${cars.filter((c) => !c.sold).length} en stock · ${cars.filter((c) => c.sold).length} vendidos`, `<a class="btn" href="#coche/nuevo">+ Nuevo coche</a>`) +
    `<div class="filt">${[['stock', 'En stock'], ['vendidos', 'Vendidos'], ['todos', 'Todos']].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>
    <div class="tw"><table><thead><tr><th>Coche</th><th>Año</th><th class="hide-m">Km</th><th>Precio</th><th>Estado</th><th style="text-align:right">Acciones</th></tr></thead><tbody>${list.map((c) => `<tr data-id="${c.id}"><td><div class="cn"><img class="thumb" src="${esc(c.images?.[0] || '')}" alt="" loading="lazy"><div><b>${esc(c.brand)} ${esc(c.model)}</b><small>${esc(c.version || '')}</small></div></div></td><td>${c.year}</td><td class="hide-m">${nf(c.km)}</td><td><b>${eur(c.price)}</b></td><td>${st(c)}</td>
    <td><div class="acts"><button class="ib ${c.featured ? 'on' : ''}" data-a="star" title="Destacar en la portada">${IC.star}</button><a class="ib" href="#coche/${c.id}" title="Editar">${IC.edit}</a><button class="btn g s" data-a="sold">${c.sold ? 'Volver a stock' : 'Vendido'}</button><button class="btn r s" data-a="del">Eliminar</button></div></td></tr>`).join('') || '<tr><td colspan="6" class="mu">No hay coches.</td></tr>'}</tbody></table></div>`;
  m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = '#coches/' + b.dataset.f)));
  m.querySelectorAll('[data-a]').forEach((b) => (b.onclick = guard(async () => {
    const id = b.closest('tr').dataset.id, c = cars.find((x) => x.id === id), a = b.dataset.a;
    if (a === 'del') { if (!confirm(`¿Eliminar definitivamente el ${c.brand} ${c.model}? Si se ha vendido, mejor márcalo como vendido.`)) return; await api('/admin/cars/' + id, { method: 'DELETE' }); toast('Coche eliminado'); }
    if (a === 'star') { await api('/admin/cars/' + id, { method: 'PUT', body: { featured: !c.featured } }); }
    if (a === 'sold') { if (!c.sold && !confirm(`¿Marcar el ${c.brand} ${c.model} como vendido? Dejará de verse en la web.`)) return; await api('/admin/cars/' + id, { method: 'PUT', body: { sold: !c.sold } }); toast(c.sold ? 'Vuelve a estar en stock' : 'Marcado como vendido'); }
    route();
  })));
};

// Reduce la foto en el navegador antes de subirla (máx. 1600 px, JPEG)
function shrink(file, max = 1600) {
  return new Promise((ok, ko) => {
    const img = new Image(); const u = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', 0.84).split(',')[1]); };
    img.onerror = () => ko(new Error('No se pudo leer ' + file.name)); img.src = u;
  });
}
async function upload(files, onEach) {
  for (const f of files) { if (!/^image\//.test(f.type)) continue; const data = await shrink(f); const r = await api('/admin/upload', { method: 'POST', body: { name: f.name, type: 'image/jpeg', data } }); onEach(r.url); }
}

V.coche = async (m, id) => {
  const isNew = id === 'nuevo';
  const [c, holders] = await Promise.all([isNew ? Promise.resolve({ images: [], features: [], status: 'disponible', featured: true }) : api('/admin/cars/' + id), api('/admin/holders')]);
  m = shell('coches');
  let imgs = [...(c.images || [])];
  const sel = (n, opts, v) => `<select name="${n}">${opts.map((o) => (Array.isArray(o) ? o : [o, o])).map(([val, t]) => `<option value="${esc(val)}"${String(v ?? '') === String(val) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  const inp = (n, l, t = 'text', extra = '') => `<label>${l}<input name="${n}" type="${t}" value="${esc(c[n] ?? '')}" ${extra}></label>`;
  m.innerHTML = top(isNew ? 'Nuevo coche' : `${esc(c.brand)} ${esc(c.model)}`, isNew ? 'Rellena los datos y añade las fotos.' : `Ficha pública: <a href="${B}/vehiculos/${c.slug}" target="_blank" style="color:var(--or)">${B}/vehiculos/${c.slug}</a>`, `<a class="btn g" href="#coches">Volver</a>`) +
  `<form id="cf">
  <div class="card sec"><h3>Identificación</h3><div class="fg">${inp('brand', 'Marca *', 'text', 'required')}${inp('model', 'Modelo *', 'text', 'required')}${inp('version', 'Versión')}</div></div>
  <div class="card sec"><h3>Datos principales</h3><div class="fg">${inp('year', 'Año *', 'number', 'min="1950" max="2100" required')}${inp('km', 'Kilómetros *', 'number', 'min="0" required')}${inp('price', 'Precio (€) *', 'number', 'min="0" required')}
  <label>Combustible *${sel('fuel', ['Gasolina', 'Diésel', 'Híbrido', 'Híbrido enchufable', 'Eléctrico', 'GLP'], c.fuel || 'Gasolina')}</label><label>Cambio *${sel('trans', ['Manual', 'Automático'], c.trans || 'Manual')}</label><label>Carrocería${sel('body', [['', '—'], 'Berlina', 'Compacto', 'Familiar', 'SUV', 'Coupé', 'Cabrio', 'Monovolumen', 'Furgoneta', 'Pickup'], c.body)}</label>
  ${inp('cv', 'Potencia (CV)', 'number')}${inp('doors', 'Puertas', 'number')}${inp('seats', 'Plazas', 'number')}${inp('color', 'Color')}</div></div>
  <div class="card sec"><h3>Financiación (uso interno)</h3><div class="fg">${inp('monthly', 'Cuota desde (€/mes)', 'number')}${inp('term', 'Plazo (meses)', 'number')}</div><p class="mu sm">No se muestra en la web: para publicar una cuota hay que poner también TIN, TAE y un ejemplo representativo (Ley 16/2011).</p></div>
  <div class="card sec"><h3>Reserva</h3><div class="fg"><label>Titular de las cuentas para la reserva${sel('holder', [['', '— Sin reserva —'], ...holders.map((h) => [h.id, `${h.name} · ${h.accounts.length} cuenta${h.accounts.length === 1 ? '' : 's'}`])], c.holder)}</label>${inp('reserve', 'Importe de la señal (€)', 'number')}</div><p class="mu sm">Si pones importe, la ficha muestra "Reserva este coche" y el cliente pide la reserva. Las cuentas no salen en la web: se las pasáis al confirmar.</p></div>
  <div class="card sec"><h3>Descripción y equipamiento</h3><div class="fg"><label class="s3">Descripción *<textarea name="desc" required rows="8">${esc(c.desc || '')}</textarea></label><label class="s3">Equipamiento (uno por línea)<textarea name="features" rows="8">${esc((c.features || []).join('\n'))}</textarea></label></div></div>
  <div class="card sec"><h3>Imágenes</h3><p class="mu sm" style="margin:-6px 0 12px">La primera es la portada. Usa las flechas para ordenarlas. Se reducen solas antes de subir.</p><div class="imgs" id="ig"></div><input type="file" id="fi" accept="image/*" multiple hidden></div>
  <div class="card sec"><h3>Visibilidad</h3><div class="row" style="gap:22px"><label>Estado${sel('status', [['disponible', 'Disponible'], ['preparacion', 'En preparación (próximamente)'], ['reservado', 'Reservado']], c.status)}</label>
  <label class="chk"><input type="checkbox" name="featured" ${c.featured ? 'checked' : ''}>Destacado en la portada</label><label class="chk"><input type="checkbox" name="hidden" ${c.hidden ? 'checked' : ''}>Ocultar de la web</label><label class="chk"><input type="checkbox" name="sold" ${c.sold ? 'checked' : ''}>Marcar como vendido</label></div></div>
  <div class="row" style="justify-content:flex-end"><a class="btn g" href="#coches">Cancelar</a><button class="btn" type="submit">${isNew ? 'Crear coche' : 'Guardar cambios'}</button></div></form>`;
  const drawImgs = () => {
    $('#ig').innerHTML = imgs.map((u, i) => `<div class="im"><img src="${esc(u)}" alt="">${i === 0 ? '<span class="bg o p">Portada</span>' : ''}<div class="t"><span><button type="button" data-m="${i}" data-d="-1">←</button> <button type="button" data-m="${i}" data-d="1">→</button></span><button type="button" data-x="${i}">✕</button></div></div>`).join('') + `<div class="drop" id="dz">+ Añadir fotos<br><span class="sm">o arrástralas aquí</span></div>`;
    $('#ig').querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => { const i = +b.dataset.m, j = i + +b.dataset.d; if (j < 0 || j >= imgs.length) return; [imgs[i], imgs[j]] = [imgs[j], imgs[i]]; drawImgs(); }));
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

V.bancos = async (m) => {
  let hs = await api('/admin/holders'); m = shell('bancos');
  const draw = () => {
    m.innerHTML = top('Bancos', 'Da de alta <b>titulares</b> y, dentro de cada uno, sus <b>números de cuenta</b>. Al crear un coche solo eliges el titular.') +
    `<div class="card sec"><b>Bizum de la empresa</b><p class="mu" style="margin:4px 0 0">Las reservas por Bizum usan el número <b style="color:#fff">660 49 32 28</b>.</p></div>
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
    const shown = list.filter((x) => (f === 'todas' ? true : f === 'activas' ? !['cancelada', 'completada', 'cerrada', 'rechazado', 'respondido'].includes(x.status) : x.status === f));
    m.innerHTML = top(title, sub(list)) + `<div class="filt">${[['todas', 'Todas'], ['activas', 'Abiertas'], ...states.map((s) => [s, s[0].toUpperCase() + s.slice(1)])].map(([k, t]) => `<button data-f="${k}" class="${f === k ? 'on' : ''}">${t}</button>`).join('')}</div>` +
      (shown.map((x) => `<div class="card it" data-id="${x.id}"><div class="hd"><div><b style="font-size:16px">${esc(x.nombre)}</b><div class="meta">${x.email ? esc(x.email) + ' · ' : ''}<a href="tel:${esc(x.telefono)}">${esc(x.telefono)}</a> · recibido ${fdt(x.created)}</div></div>${badge(x.status)}</div>
      <div class="row" style="margin:14px 0;align-items:stretch">${body(x, { holders, cars })}</div>
      <label>Notas internas<textarea data-n rows="2" style="min-height:60px">${esc(x.notas || '')}</textarea></label>
      <div class="row" style="margin-top:12px"><select data-s style="width:auto">${states.map((s) => `<option${s === x.status ? ' selected' : ''}>${s}</option>`).join('')}</select><button class="btn s" data-sv>Guardar</button><a class="btn g s" target="_blank" rel="noopener" href="${waLink(x.telefono, 'Hola ' + x.nombre.split(' ')[0] + ', te escribimos de Plata Garage. ')}">Responder por WhatsApp</a>${x.email ? `<a class="btn g s" href="mailto:${esc(x.email)}">Email</a>` : ''}<span style="flex:1"></span><button class="btn r s" data-del>Borrar</button></div></div>`).join('') || '<div class="card mu">No hay nada aquí todavía.</div>');
    m.querySelectorAll('.filt button').forEach((b) => (b.onclick = () => (location.hash = `#${key}/${b.dataset.f}`)));
    m.querySelectorAll('.it').forEach((el) => {
      const id = el.dataset.id;
      el.querySelector('[data-sv]').onclick = guard(async () => { const extra = key === 'mensajes' ? { leido: true } : {}; await api(`/admin/${path}/${id}`, { method: 'PUT', body: { status: el.querySelector('[data-s]').value, notas: el.querySelector('[data-n]').value, ...extra } }); toast('Guardado'); route(); });
      el.querySelector('[data-del]').onclick = guard(async () => { if (!confirm('¿Borrar esta solicitud? No se puede deshacer.')) return; await api(`/admin/${path}/${id}`, { method: 'DELETE' }); toast('Borrado'); route(); });
    });
    if (key === 'mensajes') list.filter((x) => !x.leido).forEach((x) => api(`/admin/mensajes/${x.id}`, { method: 'PUT', body: { leido: true } }).catch(() => {}));
  };
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

V.horarios = async (m) => {
  const s = await api('/admin/schedule'); m = shell('horarios');
  const save = guard(async (msg = 'Horario guardado') => { Object.assign(s, await api('/admin/schedule', { method: 'PUT', body: s })); toast(msg); draw(); });
  const draw = () => {
    m.innerHTML = top('Horarios', 'Configura las horas disponibles para reservar cita y bloquea días u horas concretas cuando lo necesites.') +
    `<div class="row" style="justify-content:space-between;margin-bottom:10px"><h3>Horario semanal</h3><span class="mu sm">Click en una hora para eliminarla.</span></div><div class="days">${ORDER.map((d) => `<div class="card"><div class="row" style="justify-content:space-between"><b>${DAYS[d]}</b><span class="row"><select data-cp="${d}" style="width:auto;padding:5px 10px"><option value="">Copiar a…</option>${ORDER.filter((x) => x !== d).map((x) => `<option value="${x}">${DAYS[x]}</option>`).join('')}<option value="all">Todos los días laborables</option></select></span></div>
    <div class="hrs">${(s.week[d] || []).map((h) => `<button data-d="${d}" data-h="${h}" title="Quitar">${h}</button>`).join('') || '<span class="mu sm">Cerrado — sin horarios configurados.</span>'}</div><div class="row"><input type="time" data-in="${d}" step="900" style="flex:1"><button class="btn g s" data-ad="${d}">+ Añadir</button></div></div>`).join('')}</div>
    <div class="two" style="margin-top:16px"><div class="card"><h3 style="margin-bottom:12px">Bloquear día u horas</h3><div style="display:grid;gap:12px"><label>Fecha<input type="date" id="bd"></label><label class="chk"><input type="checkbox" id="ba" checked>Cerrar todo el día</label><label>Bloquear horas concretas (separadas por comas)<input id="bh" placeholder="10:00, 10:30" disabled></label><label>Motivo (opcional)<input id="br" maxlength="120"></label><button class="btn" id="bs">Guardar bloqueo</button></div></div>
    <div class="card"><h3 style="margin-bottom:12px">Próximos bloqueos</h3>${(s.blocks || []).sort((a, b) => a.date.localeCompare(b.date)).map((b, i) => `<div class="row" style="justify-content:space-between;border-bottom:1px solid var(--line);padding:8px 0"><span><b>${fdate(b.date)}</b> · ${b.allDay ? 'todo el día' : b.hours.join(', ')}${b.reason ? ` <span class="mu">(${esc(b.reason)})</span>` : ''}</span><button class="btn r s" data-xb="${b.id}">Quitar</button></div>`).join('') || '<p class="mu">No hay días bloqueados próximamente.</p>'}</div></div>`;
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

// ---------- router ----------
async function route() {
  const [k, arg] = (location.hash.slice(1) || 'resumen').split('/');
  const fn = V[k] || V.resumen;
  try { await fn($('#mn'), arg); window.scrollTo(0, 0); } catch (e) { if (e.message !== 'Sesión caducada') { shell(k).innerHTML = `<div class="card">No se ha podido cargar: ${esc(e.message)}</div>`; } }
}
async function boot() {
  try { const s = await api('/admin/summary'); badges = { reservas: s.citasPendientes, valoraciones: s.tasacionesNuevas, envios: s.enviosPendientes, mensajes: s.mensajesSinLeer }; route(); } catch (e) { /* login ya mostrado */ }
}
window.addEventListener('hashchange', () => $('.lay') && route());
boot();
})();
