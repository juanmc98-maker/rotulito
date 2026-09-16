/* Consentimiento de cookies (analítica y publicidad). Versión 2026-09-16. */
(function () {
'use strict';
var ID = 'G-CF5DB927SM', PIXEL_ID = '1099906935714974', KEY = 'rt_privacy_v2', OLD = 'rt_consent';
var VERSION = '2026-09-16', MAX_AGE = 365 * 86400000;
var analyticsAllowed = false, adsAllowed = false, loaded = false, pixelLoaded = false, box, opener;
var LANG = location.pathname.indexOf('/ca/') === 0 ? 'ca' : (location.pathname.indexOf('/en/') === 0 ? 'en' : 'es');
var T = {
es: { aria: 'Preferencias de cookies', html: '<p><strong>Tú decides sobre las cookies.</strong> Con tu permiso, medimos las visitas con Google Analytics y, si lo aceptas, usamos cookies de publicidad para medir la eficacia de nuestros anuncios (Google Ads y Meta/Facebook). Puedes usar la web y los formularios aunque lo rechaces todo. Guardamos tu elección durante 12 meses. <a href="/cookies.html">Política de cookies</a>.</p><div class="choices"><button type="button" data-choice="reject">Rechazar todo</button><button type="button" data-choice="analytics">Solo analítica</button><button type="button" data-choice="all">Aceptar todo</button></div>' },
ca: { aria: 'Preferències de galetes', html: '<p><strong>Tu decideixes sobre les galetes.</strong> Amb el teu permís, mesurem les visites amb Google Analytics i, si ho acceptes, fem servir galetes de publicitat per mesurar l\'eficàcia dels nostres anuncis (Google Ads i Meta/Facebook). Pots utilitzar la web i els formularis encara que ho rebutgis tot. Guardem la teva elecció durant 12 mesos. <a href="/cookies.html">Política de galetes</a>.</p><div class="choices"><button type="button" data-choice="reject">Rebutjar-ho tot</button><button type="button" data-choice="analytics">Només analítica</button><button type="button" data-choice="all">Acceptar-ho tot</button></div>' },
en: { aria: 'Cookie preferences', html: '<p><strong>You decide about cookies.</strong> With your permission, we measure visits with Google Analytics and, if you accept, we use advertising cookies to measure the effectiveness of our ads (Google Ads and Meta/Facebook). You can use the website and forms even if you reject everything. We store your choice for 12 months. <a href="/cookies.html">Cookie policy</a>.</p><div class="choices"><button type="button" data-choice="reject">Reject all</button><button type="button" data-choice="analytics">Analytics only</button><button type="button" data-choice="all">Accept all</button></div>' }
};
window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('consent', 'default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
window['ga-disable-' + ID] = true;
function read() {
try {
var v = JSON.parse(localStorage.getItem(KEY));
if (v && v.version === VERSION && typeof v.analytics === 'boolean' && typeof v.ads === 'boolean' && typeof v.at === 'number' && v.at <= Date.now() && Date.now() - v.at < MAX_AGE) return v;
} catch (_) {}
return null;
}
function clearCookies() {
var host = location.hostname, domains = ['', host, '.' + host];
var parts = host.split('.');
while (parts.length > 2) { parts.shift(); domains.push('.' + parts.join('.')); }
var paths = ['/'], segments = location.pathname.split('/');
for (var i = 1; i < segments.length; i++) paths.push(segments.slice(0, i + 1).join('/'));
document.cookie.split(';').forEach(function (item) {
var name = item.split('=')[0].trim();
if (!/^(_ga(?:_|$)|_gid$|_gat|_gcl_|_fbp$|_fbc$|rt_consent$)/.test(name)) return;
domains.forEach(function (domain) { paths.forEach(function (path) {
document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax; Secure';
}); });
});
}
function loadPixel() {
if (pixelLoaded) return;
pixelLoaded = true;
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
window.fbq('init', PIXEL_ID);
window.fbq('track', 'PageView');
}
function applyConsent() {
window.gtag('consent', 'update', {
analytics_storage: analyticsAllowed ? 'granted' : 'denied',
ad_storage: adsAllowed ? 'granted' : 'denied',
ad_user_data: adsAllowed ? 'granted' : 'denied',
ad_personalization: adsAllowed ? 'granted' : 'denied'
});
window['ga-disable-' + ID] = !analyticsAllowed;
if (adsAllowed) loadPixel();
if (!analyticsAllowed || loaded) return;
loaded = true; window.__pmga = true;
var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; document.head.appendChild(s);
window.gtag('js', new Date());
// No query strings, fragment identifiers, form data or external link text in analytics.
window.gtag('config', ID, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:adsAllowed, cookie_expires:31536000, cookie_update:false, page_location:location.origin + location.pathname, page_referrer:'', ignore_referrer:true});
window.gtag('event', 'page_view', {page_location:location.origin + location.pathname, page_referrer:'', page_title:document.title});
}
function disableAll() {
analyticsAllowed = false; adsAllowed = false; window.__pmAnalyticsAllowed = false; window.__pmAdsAllowed = false;
window['ga-disable-' + ID] = true;
window.gtag('consent', 'update', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
if (pixelLoaded && window.fbq) window.fbq('consent', 'revoke');
clearCookies();
}
function hide() { if (box) box.hidden = true; if (opener && opener.isConnected) opener.focus(); }
function save(choice) {
var hadTracker = loaded;
var analytics = choice !== 'reject';
var ads = choice === 'all';
try { localStorage.setItem(KEY, JSON.stringify({version:VERSION, analytics:analytics, ads:ads, at:Date.now()})); localStorage.removeItem(OLD); } catch (_) {}
if (!analytics) {
disableAll();
} else {
analyticsAllowed = true; window.__pmAnalyticsAllowed = true;
adsAllowed = ads; window.__pmAdsAllowed = ads;
if (pixelLoaded && window.fbq && ads) window.fbq('consent', 'grant');
applyConsent();
}
hide();
// Unload the already running SDK after withdrawal; only the preference is retained.
if (!analytics && hadTracker) location.reload();
}
function show() {
opener = document.activeElement;
if (!box) {
var style = document.createElement('style');
style.textContent = '#privacy-choice[hidden]{display:none!important}#privacy-choice{position:fixed;bottom:16px;left:16px;right:16px;z-index:10000;max-width:620px;margin:auto;padding:20px;background:#fff;color:#171512;border:2px solid #171512;border-radius:8px;box-shadow:0 8px 35px #0003;font:15px/1.5 system-ui,sans-serif;max-height:85vh;overflow:auto}#privacy-choice p{margin:0 0 14px;color:#171512}#privacy-choice a{color:#171512;text-decoration:underline}#privacy-choice .choices{display:flex;gap:10px;flex-wrap:wrap}#privacy-choice button{flex:1;min-width:120px;background:#fff;color:#171512;border:2px solid #171512;border-radius:4px;padding:12px 14px;cursor:pointer;font:600 14px system-ui,sans-serif}#privacy-choice button:focus-visible{outline:3px solid #0067c0;outline-offset:3px}';
document.head.appendChild(style);
box = document.createElement('div'); box.id = 'privacy-choice'; box.setAttribute('role','dialog'); box.setAttribute('aria-label', T[LANG].aria);
box.innerHTML = T[LANG].html;
document.body.appendChild(box);
box.querySelectorAll('[data-choice]').forEach(function (btn) {
btn.addEventListener('click', function () { save(btn.dataset.choice); });
});
}
box.hidden = false;
box.querySelector('button').focus({preventScroll:true});
}
window.siteConsent = {open:show, reject:function () { save('reject'); }, analyticsAllowed:function () { return analyticsAllowed; }, adsAllowed:function () { return adsAllowed; }};
document.addEventListener('click', function (e) {
var el = e.target.closest('[data-cookie-settings],#reset-ck,#ck-open');
if (el) { e.preventDefault(); show(); }
});
window.addEventListener('storage', function (e) {
if (e.key !== KEY) return;
var v = read();
if (!v || !v.analytics) { var wasLoaded=loaded; disableAll(); if (wasLoaded) location.reload(); }
else { analyticsAllowed = true; window.__pmAnalyticsAllowed = true; adsAllowed = !!v.ads; window.__pmAdsAllowed = adsAllowed; applyConsent(); }
});
window.addEventListener('pageshow', function () { var v=read(); if ((!v || !v.analytics) && analyticsAllowed) { disableAll(); location.reload(); } });
var initial = read();
if (initial && initial.analytics) { analyticsAllowed = true; window.__pmAnalyticsAllowed = true; adsAllowed = !!initial.ads; window.__pmAdsAllowed = adsAllowed; applyConsent(); } else { disableAll(); }
function init() { if (!initial) show(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
