/* Rotulito · formulario de contacto (ES/CA/EN) y botón flotante de WhatsApp.
   - Envía al Apps Script y solo da el envío por bueno si el servidor responde {ok:true} (submit-confirmed.js).
   - Tras la confirmación: evento "lead" (track.js, una sola vez) y paso a la página de gracias de su idioma.
   - Antispam silencioso: campo trampa, envío en menos de 3 s o texto aleatorio → no se envía nada. */
(function () {
'use strict';
var LANG = location.pathname.indexOf('/ca/') === 0 ? 'ca' : (location.pathname.indexOf('/en/') === 0 ? 'en' : 'es');
var T = {
  es: {sending: 'Enviando…', err: 'No hemos podido confirmar la recepción. Tus datos siguen en el formulario. Escríbenos por WhatsApp al 613 272 053 o a hola@rotulito.com antes de repetir el envío.', thanks: '/gracias.html'},
  ca: {sending: 'Enviant…', err: "No hem pogut confirmar la recepció. Les teves dades continuen al formulari. Escriu-nos per WhatsApp al 613 272 053 o a hola@rotulito.com abans de tornar a enviar-lo.", thanks: '/ca/gracias.html'},
  en: {sending: 'Sending…', err: "We couldn't confirm that your message arrived. Your details are still in the form. Please message us on WhatsApp at +34 613 272 053 or email hola@rotulito.com before sending it again.", thanks: '/en/gracias.html'}
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

f.addEventListener('submit', async function (ev) {
  ev.preventDefault();
  if (f.dataset.sending === 'true') return;
  ferr.hidden = true;
  var n = normTel(tel.value);
  markTel(!!n);
  if (!f.checkValidity() || !n) {
    var bad = !n ? tel : f.querySelector(':invalid');
    if (bad) {
      var det = bad.closest('details'); if (det) det.open = true;
      bad.focus();
      if (bad !== tel && bad.reportValidity) bad.reportValidity();
    }
    return;
  }
  if (f.elements._honey.value || Date.now() - t0 < 3000 || looksRandom(f.elements.negocio.value) || looksRandom(f.elements.sector.value)) {
    location.assign(T.thanks);
    return;
  }
  var b = f.querySelector('button[type=submit]'), label = b.textContent;
  f.dataset.sending = 'true'; b.disabled = true; b.textContent = T.sending;
  try {
    var body = new URLSearchParams(new FormData(f));
    body.set('telefono', n);
    body.set('privacy_v', '2026-09-12');
    await window.submitConfirmed(f.action, body);
    if (window.rtTrack) window.rtTrack('lead', {form_id: 'contacto', lang: LANG});
    try { sessionStorage.setItem('rt_submission_confirmed', String(Date.now())); } catch (_) {}
    setTimeout(function () { location.assign(T.thanks); }, 350);
  } catch (_) {
    ferr.textContent = T.err; ferr.hidden = false;
    f.dataset.sending = 'false'; b.disabled = false; b.textContent = label;
  }
});
})();
