/* Rotulito · medición (GA4 + píxel de Meta). Solo envía datos si consent.js lo permite.
   Eventos (GA4 · Meta):
   - whatsapp_click → GA4 "whatsapp_click" {placement} · Meta "Contact" {method:'whatsapp', placement}
   - phone_click    → GA4 "phone_click" {placement}    · Meta personalizado "PhoneClick"
   - email_click    → GA4 "email_click" {placement}    · (Meta: nada)
   - view_demo(s)   → GA4 igual                          · Meta "ViewContent"
   - lead           → GA4 "generate_lead"                · Meta "Lead"   (solo tras {ok:true} del servidor, una vez por envío)
   - view_price     → GA4 "view_price" (se ve la sección de precio, una vez por página)
   - form_abandon   → GA4 "form_abandon" (empezó el formulario y se fue sin enviarlo; sin ningún dato de lo escrito)
   placement: cabecera | hero | flotante | contacto | footer | demo-<nombre> …
   Un clic en WhatsApp o en el teléfono NO es una conversación ni una venta: es intención de contacto.
   La página de gracias no envía conversión propia (solo page_view), así no se duplica el lead.
   Los clics hechos antes de decidir sobre las cookies se guardan en memoria y solo se envían si la
   persona acepta en esa misma visita (evento rt:consent de consent.js). */
(function () {
'use strict';
var queue = [], PAGE = location.pathname.replace(/\.html$/, '') || '/', leadSent = false;
function ga() { return !!(window.siteConsent && window.siteConsent.analyticsAllowed() && typeof window.gtag === 'function'); }
function meta() { return !!(window.siteConsent && window.siteConsent.adsAllowed() && typeof window.fbq === 'function'); }
function send(name, p) {
  p = p || {};
  var g = ga(), m = meta();
  if (g) {
    if (window.rtApp) window.rtApp(name, p);
    var gp = {};
    for (var k in p) gp[k] = p[k];
    window.gtag('event', name === 'lead' ? 'generate_lead' : name, gp);
  }
  if (m) {
    var mp = {page: PAGE};
    for (var j in p) mp[j] = p[j];
    if (name === 'whatsapp_click') { mp.method = 'whatsapp'; window.fbq('track', 'Contact', mp); }
    else if (name === 'phone_click') window.fbq('trackCustom', 'PhoneClick', mp);
    else if (name === 'view_demos' || name === 'view_demo') window.fbq('track', 'ViewContent', mp);
    else if (name === 'lead') window.fbq('track', 'Lead', mp);
  }
  return g || m;
}
function decided() { try { return !!localStorage.getItem('rt_privacy_v2'); } catch (_) { return true; } }
window.rtTrack = function (name, p) {
  if (name === 'lead') { if (leadSent) return; leadSent = true; }
  if (!send(name, p) && !decided() && queue.length < 10) queue.push([name, p]);
};
document.addEventListener('rt:consent', function () {
  var q = queue; queue = [];
  q.forEach(function (e) { send(e[0], e[1]); });
});
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  if (a.hasAttribute('data-share')) return; // compartir no es un contacto
  var h = a.getAttribute('href') || '', place = a.getAttribute('data-wa') || a.getAttribute('data-place') || 'enlace';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h)) window.rtTrack('whatsapp_click', {placement: place});
  else if (h.indexOf('tel:') === 0) window.rtTrack('phone_click', {placement: place});
  else if (h.indexOf('mailto:') === 0) window.rtTrack('email_click', {placement: place});
}, true);

/* Clic en una demo concreta (páginas de sector y /web-490/). Donde la página ya marca sus
   enlaces con data-ev, lo mide su propio script y aquí no se duplica. */
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href^="/demo/"]');
  if (!a || a.hasAttribute('data-ev')) return;
  var m = /^\/demo\/([a-z-]+)/.exec(a.getAttribute('href'));
  if (m) window.rtTrack('select_content', {content_type: 'demo', item_id: m[1]});
}, true);

/* Formulario: inicio (primera interacción). El error lo envía contact.js. Nunca se envían datos personales. */
var fm = document.getElementById('f');
if (fm) fm.addEventListener('focusin', function on() { fm.removeEventListener('focusin', on); window.rtTrack('form_start', {form_id: 'contacto'}); });

/* Página de entrada de la visita (ruta, UTM y web de procedencia), para atribuir el contacto aunque se
   envíe desde otra página. Solo con consentimiento de analítica y solo durante la sesión del navegador. */
function saveEntry() {
  try {
    if (!(window.siteConsent && window.siteConsent.analyticsAllowed()) || sessionStorage.getItem('rt_entry')) return;
    var q = new URLSearchParams(location.search), u = [];
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { var v = q.get(k); if (v) u.push(k.slice(4) + '=' + v.slice(0, 40)); });
    var ref = '';
    try { if (document.referrer) { var h = new URL(document.referrer).hostname; if (!/(^|\.)rotulito\.com$/.test(h)) ref = h; } } catch (_) {}
    var v = 'entrada=' + PAGE + (u.length ? ' ' + u.join(' ') : '') + (ref ? ' ref=' + ref : '');
    sessionStorage.setItem('rt_entry', v.slice(0, 160));
  } catch (_) {}
}
saveEntry();
document.addEventListener('rt:consent', saveEntry);

/* Contador propio en la app de gestión: visitas y contactos por canal. Solo con consentimiento de analítica,
   sin cookies propias ni datos personales (página, canal, idioma y tipo de contacto). */
var APP = 'https://platagarage-prueba.netlify.app/platagarage/api/w/rotulito', visitSent = false;
var LANG = PAGE.indexOf('/ca/') === 0 || PAGE === '/ca' ? 'ca' : PAGE.indexOf('/en/') === 0 || PAGE === '/en' ? 'en' : 'es';
var ENTRADA = (function () { try { return !document.referrer || !/(^|\.)rotulito\.com$/.test(new URL(document.referrer).hostname); } catch (_) { return true; } })();
function canalDe(s, md, r, click) {
  s = (s || '').toLowerCase(); md = (md || '').toLowerCase(); r = (r || '').toLowerCase();
  if (click === 'g' || (/google/.test(s) && /cpc|paid|ads/.test(md))) return 'Google Ads';
  if (/facebook|instagram|meta|ig|fb/.test(s) && /cpc|paid|ads/.test(md)) return 'Meta Ads';
  if (click === 'f' && !s) return /instagram/.test(r) ? 'Instagram' : 'Facebook';
  var t = s || r;
  if (!t) return 'Directo';
  if (/instagram/.test(t)) return 'Instagram';
  if (/facebook|fb\.me/.test(t)) return 'Facebook';
  if (/whatsapp|wa\.me/.test(t)) return 'WhatsApp';
  if (/cronoshare/.test(t)) return 'Cronoshare';
  if (/google|bing|duckduckgo|yahoo|ecosia|qwant/.test(t)) return 'Buscador';
  if (/chatgpt|openai|perplexity|gemini|copilot/.test(t)) return 'Asistentes IA';
  return t.replace(/^www\./, '').slice(0, 40);
}
function canal() {
  try {
    var e = sessionStorage.getItem('rt_entry') || '', g = function (k) { var m = new RegExp('(?:^| )' + k + '=([^ ]+)').exec(e); return m ? m[1] : ''; };
    if (e) return canalDe(g('source'), g('medium'), g('ref'), '');
  } catch (_) {}
  var q = new URLSearchParams(location.search), ref = '';
  try { if (ENTRADA && document.referrer) ref = new URL(document.referrer).hostname; } catch (_) {}
  return canalDe(q.get('utm_source'), q.get('utm_medium'), ref, q.get('gclid') ? 'g' : q.get('fbclid') ? 'f' : '');
}
function app(d) {
  if (!(window.siteConsent && window.siteConsent.analyticsAllowed())) return false;
  d.p = PAGE; d.l = LANG; d.c = canal();
  try { if (navigator.sendBeacon) navigator.sendBeacon(APP, new Blob([JSON.stringify(d)], {type: 'text/plain'})); } catch (_) {}
  return true;
}
window.rtApp = function (name, p) {
  var m = {whatsapp_click: 'whatsapp', phone_click: 'teléfono', email_click: 'email'}[name];
  var em = {view_price: 'precio', view_demos: 'demos', form_start: 'form_inicio', form_abandon: 'form_abandono'}[name];
  if (m) app({t: 'contacto', m: m}); else if (name === 'lead') app({t: 'lead', m: (p && p.form_id) || 'formulario'});
  else if (em) app({t: 'embudo', m: em});
};
function visit() { if (!visitSent && app({t: 'visita', e: ENTRADA ? 1 : 0})) visitSent = true; }
visit();
document.addEventListener('rt:consent', visit);

/* Portada: "view_demos" una vez cuando se ve la sección de ejemplos */
var ej = document.getElementById('ejemplos');
if (ej && 'IntersectionObserver' in window) {
  var seen = false, io = new IntersectionObserver(function (es) {
    if (!seen && es[0].isIntersecting) { seen = true; io.disconnect(); window.rtTrack('view_demos', {content_name: 'demos-490'}); }
  }, {threshold: 0.3});
  io.observe(ej);
}

/* Embudo: "ha visto el precio" y, en la portada (sin #ejemplos), "ha visto los trabajos". Una vez por página. */
function once(el, name, p) {
  if (!el || !('IntersectionObserver' in window)) return;
  var ob = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { ob.disconnect(); window.rtTrack(name, p); } }, {threshold: 0.3});
  ob.observe(el);
}
once(document.getElementById('pagas') || document.getElementById('precio'), 'view_price', {content_name: 'precio'});
if (!ej) once(document.getElementById('trabajos'), 'view_demos', {content_name: 'trabajos'});

/* Formulario empezado y no enviado: al salir de la página, una sola vez (no se envía nada de lo escrito) */
var fStarted = false, fAband = false;
if (fm) fm.addEventListener('focusin', function () { fStarted = true; });
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden' && fStarted && !leadSent && !fAband) { fAband = true; window.rtTrack('form_abandon', {form_id: 'contacto'}); }
});
})();

/* visor de fotos común */
(function(){if(document.querySelector('script[src^="/lightbox.js"]'))return;var s=document.createElement("script");s.src="/lightbox.js?v=20261024";s.defer=true;document.head.appendChild(s);})();
