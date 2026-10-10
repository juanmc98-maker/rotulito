/* Menú para móvil: botón que despliega los enlaces de la cabecera en pantallas pequeñas. */
(function () {
'use strict';
var header = document.querySelector('header');
var nav = header && header.querySelector('nav');
var right = header && header.querySelector('.hd-right');
if (!nav || !right || header.querySelector('.hd-menu')) return;

var lang = location.pathname.indexOf('/ca/') === 0 ? 'ca' : (location.pathname.indexOf('/en/') === 0 ? 'en' : 'es');
var T = {
  es: { open: 'Abrir menú', close: 'Cerrar menú' },
  ca: { open: 'Obrir menú', close: 'Tancar menú' },
  en: { open: 'Open menu', close: 'Close menu' }
}[lang];

var css = '' +
  '.hd-menu{display:none;align-items:center;justify-content:center;width:42px;height:42px;padding:0;border:1px solid var(--line,#e3e8ef);border-radius:10px;background:#fff;color:var(--ink,#0e1116);cursor:pointer}' +
  '.hd-menu svg{display:block}.hd-menu .x{display:none}' +
  'header.menu-open .hd-menu .x{display:block}header.menu-open .hd-menu .b{display:none}' +
  'header.has-burger .hd-menu{display:inline-flex}' +
  'header.has-burger .wrap{position:relative;gap:12px}' +
  'header.has-burger.menu-open nav{display:flex;flex-direction:column;gap:0;position:absolute;top:100%;left:0;right:0;margin:0;padding:8px 24px 16px;background:#fff;border-bottom:1px solid var(--line,#e3e8ef);box-shadow:0 12px 24px rgba(14,17,22,.08)}' +
  'header.has-burger.menu-open nav a{padding:14px 0;border-bottom:1px solid var(--line,#e3e8ef);color:var(--ink,#0e1116);font-size:1.02rem}' +
  'header.has-burger.menu-open nav a:last-child{border-bottom:0}' +
  '@media(max-width:380px){.brand-logo{height:32px}.langsw a{padding:6px 5px}}';
var st = document.createElement('style');
st.textContent = css;
document.head.appendChild(st);

if (!nav.id) nav.id = 'menu-principal';
var btn = document.createElement('button');
btn.type = 'button';
btn.className = 'hd-menu';
btn.setAttribute('aria-controls', nav.id);
btn.setAttribute('aria-expanded', 'false');
btn.setAttribute('aria-label', T.open);
btn.innerHTML = '<svg class="b" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
  '<svg class="x" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
right.appendChild(btn);

function set(open) {
  header.classList.toggle('menu-open', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.setAttribute('aria-label', open ? T.close : T.open);
}
btn.addEventListener('click', function (e) {
  e.stopPropagation();
  set(!header.classList.contains('menu-open'));
});
nav.addEventListener('click', function (e) {
  if (e.target.closest('a')) set(false);
});
document.addEventListener('click', function (e) {
  if (header.classList.contains('menu-open') && !header.contains(e.target)) set(false);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && header.classList.contains('menu-open')) { set(false); btn.focus(); }
});
/* Cada página oculta su menú en un ancho distinto (960 px, 1.020 px...):
   el botón aparece siempre que la cabecera tenga el menú oculto. */
function check() {
  set(false);
  header.classList.remove('has-burger');
  if (getComputedStyle(nav).display === 'none') header.classList.add('has-burger');
}
check();
var rt;
window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(check, 120); });
})();
