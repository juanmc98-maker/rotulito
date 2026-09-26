/* Rotulito · medición (GA4 + píxel de Meta). Solo envía datos si consent.js lo permite.
   Eventos (GA4 · Meta):
   - whatsapp_click → GA4 "whatsapp_click" {placement} · Meta "Contact" {method:'whatsapp', placement}
   - phone_click    → GA4 "phone_click" {placement}    · Meta personalizado "PhoneClick"
   - email_click    → GA4 "email_click" {placement}    · (Meta: nada)
   - view_demo(s)   → GA4 igual                          · Meta "ViewContent"
   - lead           → GA4 "generate_lead"                · Meta "Lead"   (solo tras {ok:true} del servidor, una vez por envío)
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
  var h = a.getAttribute('href') || '', place = a.getAttribute('data-wa') || a.getAttribute('data-place') || 'enlace';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h)) window.rtTrack('whatsapp_click', {placement: place});
  else if (h.indexOf('tel:') === 0) window.rtTrack('phone_click', {placement: place});
  else if (h.indexOf('mailto:') === 0) window.rtTrack('email_click', {placement: place});
}, true);

/* Portada: "view_demos" una vez cuando se ve la sección de ejemplos */
var ej = document.getElementById('ejemplos');
if (ej && 'IntersectionObserver' in window) {
  var seen = false, io = new IntersectionObserver(function (es) {
    if (!seen && es[0].isIntersecting) { seen = true; io.disconnect(); window.rtTrack('view_demos', {content_name: 'demos-490'}); }
  }, {threshold: 0.3});
  io.observe(ej);
}
})();
