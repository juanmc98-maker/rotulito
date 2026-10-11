/* Rotulito · formulario de contacto (ES/CA/EN) y botón flotante de WhatsApp.
   - Envía al Apps Script y solo da el envío por bueno si el servidor responde {ok:true} (submit-confirmed.js).
   - Tras la confirmación: evento "lead" (track.js, una sola vez) y paso a la página de gracias de su idioma.
   - Antispam: nombre y teléfono obligatorios y comprobados (nombre real: letras, sin números ni enlaces;
     teléfono español de 9 cifras), campo trampa invisible, espera mínima y marca "revisar=1" si algo parece aleatorio.
   - Plan: desplegable "¿Qué te interesa?" que se rellena solo al pulsar un enlace con data-plan. */
(function () {
'use strict';
var LANG = location.pathname.indexOf('/ca/') === 0 ? 'ca' : (location.pathname.indexOf('/en/') === 0 ? 'en' : 'es');
var T = {
  es: {sending: 'Enviando…', err: 'No hemos podido confirmar la recepción. Tus datos siguen en el formulario. Escríbenos por WhatsApp al 613 272 053 o a hola@rotulito.com antes de repetir el envío.', thanks: '/gracias.html', name: 'Tu nombre', nameErr: 'Escribe tu nombre (solo letras).', sum: 'Añadir un mensaje (opcional)', plan: '¿Qué te interesa?', plans: [['', 'Aún no lo sé'], ['una', 'Web de una página'], ['cuota', 'Plan cuota (web en alquiler)'], ['varias', 'Web de varias páginas'], ['medida', 'Desarrollo a medida'], ['seo', 'SEO y anuncios']]},
  ca: {sending: 'Enviant…', err: "No hem pogut confirmar la recepció. Les teves dades continuen al formulari. Escriu-nos per WhatsApp al 613 272 053 o a hola@rotulito.com abans de tornar a enviar-lo.", thanks: '/ca/gracias.html', name: 'El teu nom', nameErr: 'Escriu el teu nom (només lletres).', sum: 'Afegir un missatge (opcional)', plan: 'Què t\'interessa?', plans: [['', 'Encara no ho sé'], ['una', "Web d'una pàgina"], ['cuota', 'Pla quota (web de lloguer)'], ['varias', 'Web de diverses pàgines'], ['medida', 'Desenvolupament a mida'], ['seo', 'SEO i anuncis']]},
  en: {sending: 'Sending…', err: "We couldn't confirm that your message arrived. Your details are still in the form. Please message us on WhatsApp at +34 613 272 053 or email hola@rotulito.com before sending it again.", thanks: '/en/gracias.html', name: 'Your name', nameErr: 'Please enter your name (letters only).', sum: 'Add a message (optional)', plan: 'What are you interested in?', plans: [['', 'Not sure yet'], ['una', 'One-page website'], ['cuota', 'Monthly plan (website rental)'], ['varias', 'Multi-page website'], ['medida', 'Custom development'], ['seo', 'SEO and ads']]}
}[LANG];
var t0 = Date.now();

/* Botón flotante: se oculta mientras se ven el CTA principal o el formulario, para no tapar campos ni botones */
var fl = document.getElementById('wafloat');
if (fl && 'IntersectionObserver' in window) {
  var vis = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); });
    fl.classList.toggle('off', vis.size > 0);
  }, {threshold: 0.05});
  ['#hero-cta', '#contacto'].forEach(function (s) { var el = document.querySelector(s); if (el) io.observe(el); });
}

var f = document.getElementById('f');
if (!f) return;
var tel = f.elements.telefono, telErr = document.getElementById('telerr'), ferr = document.getElementById('ferr');

/* Nombre obligatorio: se saca del bloque opcional y se coloca tras los datos del negocio */
var nom = f.elements.nombre, nomErr = null, plan = null;
(function () {
  var st = document.createElement('style');
  st.textContent = '#f select{font:inherit;font-size:16px;padding:12px 14px;border:1.5px solid #cfd6df;border-radius:10px;background:#fff;color:var(--ink);width:100%;min-height:48px}#f select:focus{border-color:var(--ink);outline:none}';
  document.head.appendChild(st);
  var pref = f.querySelector('fieldset.pref');
  if (nom) {
    var lab = nom.closest('label'), sm = lab && lab.querySelector('small');
    if (sm) sm.remove();
    if (lab) {
      lab.firstChild.nodeValue = T.name;
      lab.removeAttribute('class');
      if (pref) pref.parentNode.insertBefore(lab, pref);
    }
    nom.required = true; nom.maxLength = 60; nom.setAttribute('autocomplete', 'name');
    nomErr = document.createElement('p'); nomErr.className = 'err'; nomErr.id = 'nomerr'; nomErr.hidden = true; nomErr.textContent = T.nameErr;
    nom.setAttribute('aria-describedby', 'nomerr');
    lab.parentNode.insertBefore(nomErr, lab.nextSibling);
    nom.addEventListener('input', function () { if (!nomErr.hidden && okName(nom.value)) markNom(true); });
  }
  var sum = f.querySelector('details.opt summary'); if (sum) sum.textContent = T.sum;
  /* Desplegable del plan */
  var pl = document.createElement('label'); pl.appendChild(document.createTextNode(T.plan));
  plan = document.createElement('select'); plan.name = 'plan'; plan.id = 'plan';
  T.plans.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; plan.appendChild(op); });
  pl.appendChild(plan);
  if (pref) pref.parentNode.insertBefore(pl, pref);
  if (/\/web-490\//.test(location.pathname)) setPlan('una');
  else if (/\/(seo-y-anuncios|seo-i-anuncis|seo-and-ads)\//.test(location.pathname)) setPlan('seo');
  try { var qp = new URLSearchParams(location.search).get('plan'); if (qp) setPlan(qp); } catch (_) {}
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-plan]'); if (a) setPlan(a.getAttribute('data-plan')); });
})();
function setPlan(v) { if (plan && [].some.call(plan.options, function (o) { return o.value === v; })) plan.value = v; }
function okName(v) {
  v = String(v || '').trim().replace(/\s+/g, ' ');
  if (v.length < 2 || v.length > 60) return false;
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'’. -]+$/.test(v)) return false;   /* sin números, @, enlaces ni símbolos */
  if (!/[aeiouáéíóúàèòïüAEIOUÁÉÍÓÚÀÈÒÏÜy]/.test(v)) return false;
  if (v.split(' ').length > 5 || /(.)\1\1\1/i.test(v) || looksRandom(v.replace(/ /g, ''))) return false;
  return true;
}
function markNom(ok) { if (!nomErr) return; nomErr.hidden = ok; nom.setAttribute('aria-invalid', ok ? 'false' : 'true'); }

function normTel(v) {
  var d = String(v || '').replace(/[\s().-]/g, '').replace(/^(\+34|0034)/, '');
  return /^[6789]\d{8}$/.test(d) ? d : null;
}
function looksRandom(s) {
  s = String(s || '').trim();
  if (s.length < 12 || /\s/.test(s)) return false;
  var up = (s.match(/[A-Z]/g) || []).length, lo = (s.match(/[a-z]/g) || []).length, vw = (s.match(/[aeiouáéíóú]/gi) || []).length;
  return up >= 3 && lo >= 3 && vw / s.length < 0.25;
}
function markTel(ok) { telErr.hidden = ok; tel.setAttribute('aria-invalid', ok ? 'false' : 'true'); }
tel.addEventListener('input', function () { if (!telErr.hidden && normTel(tel.value)) markTel(true); });
/* Preferencia de respuesta: WhatsApp o email. */
var em = f.elements.email, telWrap = document.getElementById('telwrap'), emWrap = document.getElementById('emailwrap');
function via() { var r = f.querySelector('input[name=via]:checked'); return r ? r.value : 'whatsapp'; }
/* El teléfono es obligatorio siempre (antispam); si prefiere email, se pide además el email. */
function syncVia() {
  var byMail = via() === 'email';
  if (telWrap) telWrap.hidden = false; tel.required = true;
  if (emWrap) emWrap.hidden = !byMail; if (em) em.required = byMail;
}
f.querySelectorAll('input[name=via]').forEach(function (r) { r.addEventListener('change', syncVia); });
syncVia();

f.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  if (f.dataset.sending === 'true') return;
  ferr.hidden = true;
  var byMail = via() === 'email';
  var n = normTel(tel.value), nameOk = !nom || okName(nom.value);
  markTel(!!n); markNom(nameOk);
  if (!f.checkValidity() || !n || !nameOk) {
    var bad = !nameOk ? nom : (!n ? tel : f.querySelector(':invalid'));
    if (bad) {
      var det = bad.closest('details'); if (det) det.open = true;
      bad.focus();
      if (bad !== tel && bad !== nom && bad.reportValidity) bad.reportValidity();
    }
    return;
  }
  if (f.elements._honey.value) { location.assign(T.thanks); return; }
  var b = f.querySelector('button[type=submit]'), label = b.textContent;
  f.dataset.sending = 'true'; b.disabled = true; b.textContent = T.sending;
  var wait = 3000 - (Date.now() - t0);
  if (wait > 0) await new Promise(function (r) { setTimeout(r, wait); });
  var urlRe = /(https?:|www\.|\.(com|ru|xyz|info|top)\b|@)/i;
  var sospecha = looksRandom(f.elements.negocio.value) || looksRandom(f.elements.sector.value) ||
    urlRe.test(f.elements.negocio.value + ' ' + f.elements.sector.value) || (f.elements.mensaje && /https?:|www\./i.test(f.elements.mensaje.value));
  try {
    var body = new URLSearchParams(new FormData(f));
    body.set('telefono', n || '');
    if (nom) body.set('nombre', nom.value.trim().replace(/\s+/g, ' '));
    body.set('via', byMail ? 'email' : 'whatsapp');
    body.set('privacy_v', '2026-09-27');
    var origen = location.pathname;
    try { var q = new URLSearchParams(location.search), u = []; ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = q.get(k); if (v) u.push(k.slice(4) + '=' + v.slice(0, 40)); }); if (u.length) origen += ' | ' + u.join(' '); } catch (_) {}
    try { var ent = sessionStorage.getItem('rt_entry'); if (ent && ent !== 'entrada=' + location.pathname.replace(/\.html$/, '')) origen += ' | ' + ent; } catch (_) {}
    if (plan && plan.value) origen = 'plan=' + plan.value + ' | ' + origen;
    body.set('origen', origen.slice(0, 200));
    if (sospecha) body.set('revisar', '1');
    body.set('_t', String(Math.round((Date.now() - t0) / 1000)));
    await window.submitConfirmed(f.action, body);
    if (window.rtTrack) window.rtTrack('lead', {form_id: 'contacto', lang: LANG});
    try { sessionStorage.setItem('rt_submission_confirmed', String(Date.now())); } catch (_) {}
    location.assign(T.thanks);
  } catch (_) {
    if (window.rtTrack) window.rtTrack('form_error', {form_id: 'contacto', lang: LANG});
    ferr.textContent = T.err; ferr.hidden = false;
    f.dataset.sending = 'false'; b.disabled = false; b.textContent = label;
  }
});
})();
