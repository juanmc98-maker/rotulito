/* Rotulito · medición de conversiones (GA4 + Meta Pixel). Solo envía datos si consent.js lo permite.
   Eventos:
   - whatsapp_click → GA4 "whatsapp_click" · Meta "Contact" (method: whatsapp) + personalizado "WhatsAppClick"
   - phone_click / email_click → GA4 igual · Meta "Contact" (method: phone / email)
   - view_demos / view_demo → GA4 igual · Meta "ViewContent"
   - lead (solo tras confirmar el servidor el envío del formulario) → GA4 "generate_lead" · Meta "Lead"
   Los clics hechos antes de decidir sobre las cookies se guardan en memoria (no se envía nada)
   y solo se envían si la persona acepta en esa misma visita. */
(function () {
'use strict';
var queue = [], PAGE = location.pathname.replace(/\.html$/, '') || '/';
function ga() { return window.siteConsent && window.siteConsent.analyticsAllowed() && typeof window.gtag === 'function'; }
function meta() { return window.siteConsent && window.siteConsent.adsAllowed() && typeof window.fbq === 'function'; }
function send(name, p) {
  p = p || {};
  if (ga()) {
    var gaName = name === 'lead' ? 'generate_lead' : name;
    var gp = {page_location: location.origin + location.pathname};
    for (var k in p) gp[k] = p[k];
    window.gtag('event', gaName, gp);
  }
  if (meta()) {
    var mp = {content_category: 'web-490', page: PAGE};
    for (var j in p) mp[j] = p[j];
    if (name === 'whatsapp_click') { mp.method = 'whatsapp'; window.fbq('track', 'Contact', mp); window.fbq('trackCustom', 'WhatsAppClick', mp); }
    else if (name === 'phone_click') { mp.method = 'phone'; window.fbq('track', 'Contact', mp); }
    else if (name === 'email_click') { mp.method = 'email'; window.fbq('track', 'Contact', mp); }
    else if (name === 'view_demos' || name === 'view_demo') window.fbq('track', 'ViewContent', mp);
    else if (name === 'lead') window.fbq('track', 'Lead', mp);
  }
  return ga() || meta();
}
function decided() { try { return !!localStorage.getItem('rt_privacy_v2'); } catch (_) { return true; } }
window.rtTrack = function (name, p) {
  if (!send(name, p) && !decided() && queue.length < 10) queue.push([name, p]);
};
document.addEventListener('rt:consent', function () {
  var q = queue; queue = [];
  q.forEach(function (e) { send(e[0], e[1]); });
});
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  var h = a.getAttribute('href') || '', place = a.getAttribute('data-wa') || a.getAttribute('data-place') || 'link';
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h)) window.rtTrack('whatsapp_click', {placement: place});
  else if (h.indexOf('tel:') === 0) window.rtTrack('phone_click', {placement: place});
  else if (h.indexOf('mailto:') === 0) window.rtTrack('email_click', {placement: place});
}, true);
})();
