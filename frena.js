/* "¿Qué te frena?": una pregunta de un toque en las páginas de precio. Responde con algo concreto y,
   si hay consentimiento de analítica, cuenta la respuesta (sin datos personales). */
(function () {
  'use strict';
  var p = location.pathname, lang = p.indexOf('/ca/') === 0 ? 'ca' : p.indexOf('/en/') === 0 ? 'en' : 'es';
  var WA = function (t) { return 'https://wa.me/34613272053?text=' + encodeURIComponent(t); };
  var T = {
    es: {h: '¿Qué te frena?', s: 'Un toque y te ayudo con eso.', o: [
      ['precio', 'El precio', 'Te explico qué incluye exactamente y cómo se paga.', 'Preguntar por WhatsApp', WA('Hola, quería saber qué incluye la web y cómo se paga.')],
      ['necesito', 'No sé si la necesito', 'Cuéntame tu negocio y te digo con sinceridad si te compensa.', 'Contármelo por WhatsApp', WA('Hola, no sé si me compensa tener web. Te cuento mi negocio:')],
      ['ejemplos', 'Quiero ver ejemplos', 'Aquí tienes webs que ya están funcionando.', 'Ver trabajos', 'EJ'],
      ['tiempo', 'No tengo tiempo para textos y fotos', 'Cuéntame qué tienes y vemos cómo hacerlo fácil.', 'Escribir por WhatsApp', WA('Hola, me interesa la web pero tengo poco tiempo para textos y fotos.')],
      ['dominio', 'Dominio, correo o Google', 'Te lo explico sin tecnicismos.', 'Preguntar por WhatsApp', WA('Hola, tengo dudas sobre el dominio, el correo o Google.')]]},
    ca: {h: 'Què et frena?', s: 'Un toc i t’hi ajudo.', o: [
      ['precio', 'El preu', 'T’explico què inclou exactament i com es paga.', 'Preguntar per WhatsApp', WA('Hola, volia saber què inclou la web i com es paga.')],
      ['necesito', 'No sé si la necessito', 'Explica’m el teu negoci i et dic sincerament si et compensa.', 'Explicar-ho per WhatsApp', WA('Hola, no sé si em compensa tenir web. T’explico el meu negoci:')],
      ['ejemplos', 'Vull veure exemples', 'Aquí tens webs que ja funcionen.', 'Veure treballs', 'EJ'],
      ['tiempo', 'No tinc temps per a textos i fotos', 'Explica’m què tens i veiem com fer-ho fàcil.', 'Escriure per WhatsApp', WA('Hola, m’interessa la web però tinc poc temps per a textos i fotos.')],
      ['dominio', 'Domini, correu o Google', 'T’ho explico sense tecnicismes.', 'Preguntar per WhatsApp', WA('Hola, tinc dubtes sobre el domini, el correu o Google.')]]},
    en: {h: 'What’s holding you back?', s: 'One tap and I’ll help you with it.', o: [
      ['precio', 'The price', 'I’ll explain exactly what’s included and how payment works.', 'Ask on WhatsApp', WA('Hi, I’d like to know what the website includes and how payment works.')],
      ['necesito', 'Not sure I need one', 'Tell me about your business and I’ll honestly tell you if it’s worth it.', 'Tell me on WhatsApp', WA('Hi, I’m not sure a website is worth it for me. Here’s my business:')],
      ['ejemplos', 'I want to see examples', 'Here are websites that are already live.', 'See our work', 'EJ'],
      ['tiempo', 'No time for texts and photos', 'Tell me what you have and we’ll find an easy way.', 'Message on WhatsApp', WA('Hi, I like the idea but I have little time for texts and photos.')],
      ['dominio', 'Domain, email or Google', 'I’ll explain it without jargon.', 'Ask on WhatsApp', WA('Hi, I have questions about the domain, email or Google.')]]}
  }[lang];
  function init() {
    var after = document.getElementById('precio') || document.querySelector('main section:last-of-type');
    if (!after || document.querySelector('.rt-fr')) return;
    var st = document.createElement('style');
    st.textContent = '.rt-fr{max-width:760px;margin:32px auto;padding:22px 20px;border:1px solid rgba(0,0,0,.12);border-radius:14px;background:#fff;color:#0E1116}.rt-fr h3{margin:0 0 4px}.rt-fr .ops{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}.rt-fr .ops button{font:600 14px inherit;padding:8px 12px;border-radius:999px;border:1px solid rgba(0,0,0,.2);background:#fff;color:#0E1116;cursor:pointer}.rt-fr .ops button[aria-pressed=true]{background:#D9382C;border-color:#D9382C;color:#fff}.rt-fr .r{margin:14px 0 0}.rt-fr .r a{display:inline-block;margin-top:8px;font-weight:700;color:#D9382C}';
    document.head.appendChild(st);
    var box = document.createElement('div');
    box.className = 'rt-fr';
    box.innerHTML = '<h3>' + T.h + '</h3><p>' + T.s + '</p><div class="ops">' + T.o.map(function (o) { return '<button type="button" aria-pressed="false" data-k="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div><div class="r" aria-live="polite"></div>';
    after.parentNode.insertBefore(box, after.nextSibling);
    var r = box.querySelector('.r');
    [].forEach.call(box.querySelectorAll('.ops button'), function (bt) {
      bt.addEventListener('click', function () {
        var o = T.o.filter(function (x) { return x[0] === bt.getAttribute('data-k'); })[0];
        [].forEach.call(box.querySelectorAll('.ops button'), function (x) { x.setAttribute('aria-pressed', String(x === bt)); });
        var href = o[4] === 'EJ' ? (document.getElementById('ejemplos') ? '#ejemplos' : document.getElementById('trabajos') ? '#trabajos' : '/demo/taller') : o[4];
        var ext = href.indexOf('http') === 0;
        r.innerHTML = o[2] + '<br><a href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + o[3] + ' →</a>';
        try { if (window.gtag) window.gtag('event', 'que_frena', {reason: o[0]}); } catch (e) {}
        try { if (window.clarity) window.clarity('event', 'frena-' + o[0]); } catch (e) {}
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
