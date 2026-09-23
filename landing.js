/* Landing /web-490: formulario corto, botón fijo de WhatsApp y medición de interés. */
(function () {
'use strict';
var L = window.RT_L || {}, t0 = Date.now();

/* Botón fijo: se oculta mientras se ve el CTA del hero, el formulario o el CTA final */
var st = document.getElementById('stwa');
if (st && 'IntersectionObserver' in window) {
  var vis = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); });
    st.classList.toggle('off', vis.size > 0);
  }, {threshold: 0.15});
  ['.cta-box', '#propuesta', '.final'].forEach(function (s) { var el = document.querySelector(s); if (el) io.observe(el); });
}

/* ViewContent: una vez, cuando se ven los ejemplos de 490 € */
var ej = document.getElementById('ejemplos');
if (ej && 'IntersectionObserver' in window) {
  var seen = false, io2 = new IntersectionObserver(function (es) {
    if (!seen && es[0].isIntersecting) { seen = true; io2.disconnect(); window.rtTrack && window.rtTrack('view_demos', {content_name: 'demos-490'}); }
  }, {threshold: 0.35});
  io2.observe(ej);
}

/* Formulario */
var f = document.getElementById('lf');
if (!f) return;
var tel = f.elements.telefono, telErr = document.getElementById('telerr'), ferr = document.getElementById('ferr');
function normTel(v) {
  var d = String(v || '').replace(/[\s().-]/g, '');
  d = d.replace(/^(\+34|0034)/, '');
  return /^[6789]\d{8}$/.test(d) ? d : null;
}
function looksRandom(s) {
  s = String(s || '').trim();
  if (s.length < 12 || /\s/.test(s)) return false;
  var up = (s.match(/[A-Z]/g) || []).length, lo = (s.match(/[a-z]/g) || []).length;
  var vw = (s.match(/[aeiouáéíóú]/gi) || []).length;
  return up >= 3 && lo >= 3 && vw / s.length < 0.25;
}
tel.addEventListener('input', function () { if (!telErr.hidden && normTel(tel.value)) { telErr.hidden = true; tel.setAttribute('aria-invalid', 'false'); } });

function showOk() {
  f.hidden = true;
  var ok = document.getElementById('lok'); ok.hidden = false;
  ok.scrollIntoView({behavior: 'smooth', block: 'center'}); ok.focus({preventScroll: true});
}

f.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  if (f.dataset.sending === 'true') return;
  ferr.hidden = true;
  var n = normTel(tel.value);
  if (!n) { telErr.hidden = false; tel.setAttribute('aria-invalid', 'true'); }
  if (!f.checkValidity() || !n) {
    var bad = !n ? tel : f.querySelector(':invalid');
    if (bad) { bad.focus(); if (bad !== tel && bad.reportValidity) bad.reportValidity(); }
    return;
  }
  // Antispam silencioso: honeypot, envío en menos de 3 s o texto aleatorio → no se envía nada
  if (f.elements._honey.value || Date.now() - t0 < 3000 || looksRandom(f.elements.negocio.value) || looksRandom(f.elements.sector.value)) { showOk(); return; }

  var b = f.querySelector('button[type=submit]'), label = b.textContent;
  f.dataset.sending = 'true'; b.disabled = true; b.textContent = L.f_sending || '…';
  try {
    var body = new URLSearchParams(new FormData(f));
    body.set('telefono', n);
    var web = (f.elements.webig.value || '').trim();
    body.set('mensaje', (web ? 'Web/Instagram: ' + web + ' · ' : '') + 'Origen: ' + location.pathname);
    body.set('privacy_v', '2026-09-12');
    await window.submitConfirmed(f.action, body);
    window.rtTrack && window.rtTrack('lead', {form: 'web-490'});
    showOk();
  } catch (_) {
    ferr.textContent = L.f_err || 'Error'; ferr.hidden = false;
  } finally {
    f.dataset.sending = 'false'; b.disabled = false; b.textContent = label;
  }
});
})();
