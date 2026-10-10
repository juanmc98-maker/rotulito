/* Consentimiento de cookies (analítica y publicidad). Versión 2026-09-16 · revisado 2026-09-28 (Configurar por finalidad; política de cookies en su idioma). */
(function () {
'use strict';
var ID = 'G-CF5DB927SM', PIXEL_ID = '1099906935714974', KEY = 'rt_privacy_v2', OLD = 'rt_consent';
var VERSION = '2026-09-16', MAX_AGE = 365 * 86400000;
var analyticsAllowed = false, adsAllowed = false, loaded = false, pixelLoaded = false, box, opener;
var LANG = location.pathname.indexOf('/ca/') === 0 ? 'ca' : (location.pathname.indexOf('/en/') === 0 ? 'en' : 'es');
var T = {
es: { aria: 'Preferencias de cookies', cfg: '<p><strong>Configurar cookies</strong></p><label class="opt"><input type="checkbox" data-opt="analytics"> <span><b>Analítica</b> (Google Analytics): cuántas visitas tiene la web y qué se lee.</span></label><label class="opt"><input type="checkbox" data-opt="ads"> <span><b>Publicidad</b> (Google Ads y Meta): medir si nuestros anuncios funcionan.</span></label><div class="choices"><button type="button" data-choice="back">Volver</button><button type="button" data-choice="save">Guardar mi elección</button></div>', html: '<p><strong>Tú decides sobre las cookies.</strong> Con tu permiso, medimos las visitas con Google Analytics y, si lo aceptas, usamos cookies de publicidad para medir la eficacia de nuestros anuncios (Google Ads y Meta/Facebook). Puedes usar la web y los formularios aunque lo rechaces todo. Guardamos tu elección durante 12 meses. <a href="/cookies.html">Política de cookies</a>.</p><div class="choices"><button type="button" data-choice="reject">Rechazar todo</button><button type="button" data-choice="config">Configurar</button><button type="button" data-choice="all">Aceptar todo</button></div>' },
ca: { aria: 'Preferències de galetes', cfg: '<p><strong>Configurar galetes</strong></p><label class="opt"><input type="checkbox" data-opt="analytics"> <span><b>Analítica</b> (Google Analytics): quantes visites té la web i què es llegeix.</span></label><label class="opt"><input type="checkbox" data-opt="ads"> <span><b>Publicitat</b> (Google Ads i Meta): mesurar si els nostres anuncis funcionen.</span></label><div class="choices"><button type="button" data-choice="back">Tornar</button><button type="button" data-choice="save">Desar la meva elecció</button></div>', html: '<p><strong>Tu decideixes sobre les galetes.</strong> Amb el teu permís, mesurem les visites amb Google Analytics i, si ho acceptes, fem servir galetes de publicitat per mesurar l\'eficàcia dels nostres anuncis (Google Ads i Meta/Facebook). Pots utilitzar la web i els formularis encara que ho rebutgis tot. Guardem la teva elecció durant 12 mesos. <a href="/ca/cookies.html">Política de galetes</a>.</p><div class="choices"><button type="button" data-choice="reject">Rebutjar-ho tot</button><button type="button" data-choice="config">Configurar</button><button type="button" data-choice="all">Acceptar-ho tot</button></div>' },
en: { aria: 'Cookie preferences', cfg: '<p><strong>Cookie settings</strong></p><label class="opt"><input type="checkbox" data-opt="analytics"> <span><b>Analytics</b> (Google Analytics): how many visits the site gets and what is read.</span></label><label class="opt"><input type="checkbox" data-opt="ads"> <span><b>Advertising</b> (Google Ads and Meta): measuring whether our ads work.</span></label><div class="choices"><button type="button" data-choice="back">Back</button><button type="button" data-choice="save">Save my choice</button></div>', html: '<p><strong>You decide about cookies.</strong> With your permission, we measure visits with Google Analytics and, if you accept, we use advertising cookies to measure the effectiveness of our ads (Google Ads and Meta/Facebook). You can use the website and forms even if you reject everything. We store your choice for 12 months. <a href="/en/cookies.html">Cookie policy</a>.</p><div class="choices"><button type="button" data-choice="reject">Reject all</button><button type="button" data-choice="config">Settings</button><button type="button" data-choice="all">Accept all</button></div>' }
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
function clearCookies(re) {
re = re || /^(_ga(?:_|$)|_gid$|_gat|_gcl_|_fbp$|_fbc$|rt_consent$)/;
var host = location.hostname, domains = ['', host, '.' + host];
var parts = host.split('.');
while (parts.length > 2) { parts.shift(); domains.push('.' + parts.join('.')); }
var paths = ['/'], segments = location.pathname.split('/');
for (var i = 1; i < segments.length; i++) paths.push(segments.slice(0, i + 1).join('/'));
document.cookie.split(';').forEach(function (item) {
var name = item.split('=')[0].trim();
if (!re.test(name)) return;
domains.forEach(function (domain) { paths.forEach(function (path) {
document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax; Secure';
}); });
});
}
var CAMPAIGN = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id'], AD_IDS = ['gclid','gbraid','wbraid'];
function pageLocation() {
var out = new URLSearchParams(), q;
try { q = new URLSearchParams(location.search); } catch (_) { return location.origin + location.pathname; }
CAMPAIGN.concat(adsAllowed ? AD_IDS : []).forEach(function (k) { var v = q.get(k); if (v && v.length <= 150 && !/@/.test(v)) out.set(k, v); });
var s = out.toString();
return location.origin + location.pathname + (s ? '?' + s : '');
}
function externalReferrer() {
try { var r = document.referrer && new URL(document.referrer); if (r && r.origin !== location.origin && /^https?:$/.test(r.protocol)) return r.origin + '/'; } catch (_) {}
return '';
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
// Solo parámetros de campaña (sin datos personales): utm_* siempre; gclid/gbraid/wbraid solo con consentimiento de publicidad.
// Sin fragmentos, datos de formularios ni el resto de la URL. Del referente externo solo se envía el origen (https://www.google.com/).
var loc = pageLocation(), ref = externalReferrer();
var cfg = {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:adsAllowed, cookie_expires:31536000, cookie_update:false, page_location:loc};
if (ref) cfg.page_referrer = ref;
window.gtag('config', ID, cfg);
var pv = {page_location:loc, page_title:document.title};
if (ref) pv.page_referrer = ref;
window.gtag('event', 'page_view', pv);
}
function disableAll() {
analyticsAllowed = false; adsAllowed = false; window.__pmAnalyticsAllowed = false; window.__pmAdsAllowed = false;
window['ga-disable-' + ID] = true;
window.gtag('consent', 'update', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
if (pixelLoaded && window.fbq) window.fbq('consent', 'revoke');
clearCookies();
}
function hide() { if (box) box.hidden = true; if (opener && opener.isConnected) opener.focus(); }
function revokeAds() {
adsAllowed = false; window.__pmAdsAllowed = false;
window.gtag('consent', 'update', {ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
if (pixelLoaded && window.fbq) window.fbq('consent', 'revoke');
clearCookies(/^(_gcl_|_fbp$|_fbc$)/);
}
function announce() { try { document.dispatchEvent(new CustomEvent('rt:consent', {detail:{analytics:analyticsAllowed, ads:adsAllowed}})); } catch (_) {} }
function save(choice, a, d) {
var hadTracker = loaded, hadPixel = pixelLoaded;
var analytics = choice === 'custom' ? !!a : choice !== 'reject';
var ads = choice === 'custom' ? !!d : choice === 'all';
try { localStorage.setItem(KEY, JSON.stringify({version:VERSION, analytics:analytics, ads:ads, at:Date.now()})); localStorage.removeItem(OLD); } catch (_) {}
if (!analytics && !ads) {
disableAll();
} else {
analyticsAllowed = analytics; window.__pmAnalyticsAllowed = analytics;
if (!analytics) { window['ga-disable-' + ID] = true; clearCookies(/^(_ga(?:_|$)|_gid$|_gat)/); }
if (!ads) revokeAds();
adsAllowed = ads; window.__pmAdsAllowed = ads;
if (pixelLoaded && window.fbq && ads) window.fbq('consent', 'grant');
applyConsent();
}
hide();
// Tras retirar un consentimiento se recarga para descargar el SDK que ya estaba en marcha; solo se guarda la preferencia.
if ((!analytics && hadTracker) || (!ads && hadPixel)) { location.reload(); return; }
announce();
}
function show() {
opener = document.activeElement;
if (!box) {
var style = document.createElement('style');
style.textContent = '#privacy-choice[hidden]{display:none!important}#privacy-choice{position:fixed;bottom:16px;left:16px;right:16px;z-index:10000;max-width:620px;margin:auto;padding:20px;background:#fff;color:#171512;border:2px solid #171512;border-radius:8px;box-shadow:0 8px 35px #0003;font:15px/1.5 system-ui,sans-serif;max-height:85vh;overflow:auto}#privacy-choice p{margin:0 0 14px;color:#171512}#privacy-choice a{color:#171512;text-decoration:underline}#privacy-choice .choices{display:flex;gap:10px;flex-wrap:wrap}#privacy-choice button{flex:1;min-width:120px;background:#fff;color:#171512;border:2px solid #171512;border-radius:4px;padding:12px 14px;cursor:pointer;font:600 14px system-ui,sans-serif}#privacy-choice button[data-choice=all],#privacy-choice button[data-choice=reject]{background:#c0312a;color:#fff;border-color:#c0312a}#privacy-choice button:focus-visible{outline:3px solid #0067c0;outline-offset:3px}#privacy-choice .opt{display:flex;gap:10px;align-items:flex-start;margin:0 0 12px;cursor:pointer}#privacy-choice .opt input{width:20px;height:20px;margin-top:2px;flex:none}';
document.head.appendChild(style);
box = document.createElement('div'); box.id = 'privacy-choice'; box.setAttribute('role','dialog'); box.setAttribute('aria-label', T[LANG].aria);
document.body.appendChild(box);
}
mainView();
box.hidden = false;
box.querySelector('button').focus({preventScroll:true});
}
function mainView() {
box.innerHTML = T[LANG].html;
box.querySelectorAll('[data-choice]').forEach(function (btn) {
btn.addEventListener('click', function () { if (btn.dataset.choice === 'config') cfgView(); else save(btn.dataset.choice); });
});
}
function cfgView() {
var cur = read();
box.innerHTML = T[LANG].cfg;
box.querySelector('[data-opt="analytics"]').checked = !!(cur && cur.analytics);
box.querySelector('[data-opt="ads"]').checked = !!(cur && cur.ads);
box.querySelector('[data-choice="back"]').onclick = function () { mainView(); box.querySelector('button').focus(); };
box.querySelector('[data-choice="save"]').onclick = function () { save('custom', box.querySelector('[data-opt="analytics"]').checked, box.querySelector('[data-opt="ads"]').checked); };
box.querySelector('input').focus();
}
window.siteConsent = {open:show, reject:function () { save('reject'); }, analyticsAllowed:function () { return analyticsAllowed; }, adsAllowed:function () { return adsAllowed; }};
document.addEventListener('click', function (e) {
var el = e.target.closest('[data-cookie-settings],#reset-ck,#ck-open');
if (el) { e.preventDefault(); show(); }
});
window.addEventListener('storage', function (e) {
if (e.key !== KEY) return;
var v = read();
if (!v || (!v.analytics && !v.ads)) { var wasLoaded=loaded||pixelLoaded; disableAll(); if (wasLoaded) location.reload(); }
else { var hadPixel = pixelLoaded; if (!v.analytics && loaded) { location.reload(); return; } analyticsAllowed = !!v.analytics; window.__pmAnalyticsAllowed = analyticsAllowed; if (!v.ads) revokeAds(); adsAllowed = !!v.ads; window.__pmAdsAllowed = adsAllowed; applyConsent(); if (!v.ads && hadPixel) location.reload(); }
});
window.addEventListener('pageshow', function () { var v=read(); if ((!v || !v.analytics) && analyticsAllowed) { disableAll(); location.reload(); } else if (v && !v.ads && pixelLoaded && adsAllowed) { revokeAds(); location.reload(); } });
var initial = read();
if (initial && (initial.analytics || initial.ads)) { analyticsAllowed = !!initial.analytics; window.__pmAnalyticsAllowed = analyticsAllowed; adsAllowed = !!initial.ads; window.__pmAdsAllowed = adsAllowed; applyConsent(); } else { disableAll(); }
function init() { if (!initial) show(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Menú de la cabecera en móvil (archivo aparte). */
(function(){if(document.querySelector('script[src^="/menu.js"]'))return;var s=document.createElement('script');s.src='/menu.js?v=20261011';s.defer=true;document.head.appendChild(s);})();

/* Pie de todas las páginas: "Comparte esta página" (WhatsApp, Facebook, X, Telegram, copiar enlace y menú del móvil) y "Síguenos" (Instagram y Facebook de Rotulito). Enlaces simples, sin widgets ni cookies de terceros. */
(function(){
function run(){
  var m=document.querySelector('footer a[href="mailto:hola@rotulito.com"]'),wrap=m&&m.closest('footer .wrap');
  if(!wrap||document.getElementById('rtShare'))return;
  var p=location.pathname,lg=p.indexOf('/ca/')===0?'ca':p.indexOf('/en/')===0?'en':'es';
  var T={es:{t:'Comparte esta página',f:'Síguenos',c:'Copiar enlace',ok:'Enlace copiado',m:'Compartir…',a:'Compartir en '},
    ca:{t:'Comparteix aquesta pàgina',f:'Segueix-nos',c:'Copia l’enllaç',ok:'Enllaç copiat',m:'Compartir…',a:'Compartir a '},
    en:{t:'Share this page',f:'Follow us',c:'Copy link',ok:'Link copied',m:'Share…',a:'Share on '}}[lg];
  var can=document.querySelector('link[rel="canonical"]'),url=(can&&can.href)||location.href.split('#')[0],title=document.title;
  var e=encodeURIComponent,eu=e(url);
  var I={wa:'<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.8.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.7-.5zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
    fb:'<svg viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z"/></svg>',
    x:'<svg viewBox="0 0 24 24"><path d="M17.8 3h3l-6.7 7.7L22 21h-6.2l-4.8-6.3L5.4 21h-3l7.2-8.2L2 3h6.3l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z"/></svg>',
    tg:'<svg viewBox="0 0 24 24"><path d="M21.9 4.6 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.8-3.6-2.3 2.3c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.4 13.2 1.7 11.7c-1-.3-1-1 .2-1.5L20.6 3c.9-.3 1.6.2 1.3 1.6z"/></svg>',
    cp:'<svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg>',
    sh:'<svg viewBox="0 0 24 24"><path d="M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7L16 7.2c.6.5 1.3.8 2.1.8a3 3 0 1 0-3-3c0 .2 0 .5.1.7L8.1 9.8A3 3 0 1 0 6 15c.8 0 1.5-.3 2.1-.8l7.1 4.2c-.1.2-.1.4-.1.6a2.9 2.9 0 1 0 2.9-2.9z"/></svg>',
    ig:'<svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM21.9 7.9c-.1-1.6-.4-3-1.6-4.2S17.7 2.2 16.1 2.1C14.5 2 9.5 2 7.9 2.1 6.3 2.2 4.9 2.5 3.7 3.7S2.2 6.3 2.1 7.9C2 9.5 2 14.5 2.1 16.1c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.6.1 8.2 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.6 0-8.2zm-2.1 10c-.3.9-1 1.5-1.9 1.9-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4c-.9-.3-1.5-1-1.9-1.9-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9c.3-.9 1-1.5 1.9-1.9C7.4 3.7 10.5 3.8 12 3.8s4.6-.1 5.9.4c.9.3 1.5 1 1.9 1.9.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z"/></svg>'};
  var st=document.createElement('style');
  st.textContent='.rt-sf{flex-basis:100%;padding-bottom:16px;margin-bottom:6px;border-bottom:1px solid rgba(128,128,128,.28)}.rt-sf p{font-size:11.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin:0 0 10px;opacity:.85}.rt-sf-row{display:flex;flex-wrap:wrap;gap:8px}.rt-sf-row a,.rt-sf-row button{display:inline-flex;align-items:center;justify-content:center;gap:8px;font:inherit;font-size:13.5px;font-weight:600;color:inherit;text-decoration:none!important;background:transparent;border:1px solid rgba(128,128,128,.45);border-radius:999px;cursor:pointer;line-height:1;transition:background .15s}.rt-sf-row a:hover,.rt-sf-row button:hover{background:rgba(128,128,128,.14)}.rt-sf-row svg{width:16px;height:16px;fill:currentColor;flex:none}.rt-sf-ic a,.rt-sf-ic button{width:42px;height:42px;padding:0}.rt-sf-ic span{display:none}.rt-sf-fw a{padding:9px 15px 9px 12px}.rt-sf-row .ok{background:#2a8f5a;border-color:#2a8f5a;color:#fff}';
  document.head.appendChild(st);
  var sh=[['wa','WhatsApp','https://api.whatsapp.com/send?text='+e(title+' '+url)],['fb','Facebook','https://www.facebook.com/sharer/sharer.php?u='+eu],['x','X','https://twitter.com/intent/tweet?url='+eu+'&text='+e(title)],['tg','Telegram','https://t.me/share/url?url='+eu+'&text='+e(title)]];
  var fw=[['ig','Instagram','https://www.instagram.com/rotulito.web/'],['fb','Facebook','https://www.facebook.com/profile.php?id=61594488930656']];
  var h='<div class="rt-sf" id="rtShare"><p>'+T.t+'</p><div class="rt-sf-row rt-sf-ic">';
  sh.forEach(function(l){h+='<a href="'+l[2]+'" target="_blank" rel="noopener" data-share data-net="'+l[0]+'" aria-label="'+T.a+l[1]+'">'+I[l[0]]+'<span>'+l[1]+'</span></a>';});
  h+='<button type="button" data-net="copy" aria-label="'+T.c+'">'+I.cp+'<span>'+T.c+'</span></button>';
  if(navigator.share)h+='<button type="button" data-net="native" aria-label="'+T.m+'">'+I.sh+'<span>'+T.m+'</span></button>';
  h+='</div></div><div class="rt-sf" id="rtFollow"><p>'+T.f+'</p><div class="rt-sf-row rt-sf-fw">';
  fw.forEach(function(l){h+='<a href="'+l[2]+'" target="_blank" rel="noopener" data-follow="'+l[0]+'">'+I[l[0]]+'<span>'+l[1]+'</span></a>';});
  h+='</div></div>';
  wrap.insertAdjacentHTML('afterbegin',h);
  var box=document.getElementById('rtShare');
  box.addEventListener('click',function(ev){
    var el=ev.target.closest('[data-net]');if(!el)return;var n=el.getAttribute('data-net');
    if(n==='copy'){ev.preventDefault();var done=function(){var s=el.querySelector('span'),o=s.textContent;s.textContent=T.ok;el.classList.add('ok');setTimeout(function(){s.textContent=o;el.classList.remove('ok');},1800);};
      if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(done,function(){prompt(T.c,url);});else prompt(T.c,url);}
    else if(n==='native'){ev.preventDefault();navigator.share({title:title,url:url}).catch(function(){});}
    if(window.rtTrack)window.rtTrack('share',{method:n});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
