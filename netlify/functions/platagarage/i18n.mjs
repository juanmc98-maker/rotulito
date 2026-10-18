// Plata Garage · versiones en catalán (/ca/) y en inglés (/en/)
// La web se genera en castellano y aquí se traduce con el diccionario (i18n-dict.mjs).
// Lo que no está en el diccionario se queda en castellano.
import DICT from './i18n-dict.mjs';

export const LANGS = ['ca', 'en'];
const IDX = { ca: 0, en: 1 };
const INLINE = new Set(['a', 'b', 'strong', 'em', 'i', 'u', 'small', 'br', 'sup', 'sub', 'code', 'mark', 'abbr', 'time', 'bdi']);
const TOK = /<!--[\s\S]*?-->|<![^>]*>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<svg\b[\s\S]*?<\/svg>|<\/?[a-zA-Z][^>]*>|[^<]+|</g;
const NUM = /\d+(?:[.,]\d+)*/g;
const LETTER = /[A-Za-zÀ-ÿ]/;

const tagName = (t) => (t.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/) || [])[1]?.toLowerCase() || '';
const isInline = (t) => t[0] === '<' && t.length > 1 && t[1] !== '!' && INLINE.has(tagName(t)) && !/^<(script|style|svg)/i.test(t);

// Clave de una tira de texto con etiquetas en línea: sin atributos y con los números como {0}, {1}…
export function keyOf(parts) {
  const nums = [], tags = [];
  let k = '';
  for (const p of parts) {
    if (p[0] === '<') { const n = tagName(p); if (p[1] === '/') k += `</${n}>`; else { tags.push(p); k += `<${n}>`; } }
    else k += p.replace(NUM, (m) => { nums.push(m); return `{${nums.length - 1}}`; });
  }
  return { key: k.replace(/\s+/g, ' ').trim(), nums, tags };
}
const fill = (tr, nums, tags) => {
  const used = {};
  return tr.replace(/\{(\d+)\}/g, (m, i) => nums[+i] ?? m).replace(/<([a-zA-Z][a-zA-Z0-9]*)>/g, (m, n) => {
    const list = tags.filter((t) => tagName(t) === n.toLowerCase()); const j = used[n] || 0; used[n] = j + 1; return list[j] || m;
  });
};
// Frases que dependen de cada coche: así los coches nuevos salen traducidos sin tocar el diccionario
const FUEL = { gasolina: ['gasolina', 'petrol'], 'diésel': ['dièsel', 'diesel'], 'híbrido': ['híbrid', 'hybrid'], 'eléctrico': ['elèctric', 'electric'], glp: ['GLP', 'LPG'] };
const TRANS = { manual: ['manual', 'manual'], 'automático': ['automàtic', 'automatic'] };
const RULES = [
  [/^Financiar (.+) \| Plata Garage$/, (m) => [`Finançar ${m[1]} | Plata Garage`, `Finance the ${m[1]} | Plata Garage`]],
  [/^Financia el (.+)<br>$/, (m) => [`Finança el ${m[1]}<br>`, `Finance the ${m[1]}<br>`]],
  [/^¿Puedo ver el (.+)\?$/, (m) => [`Puc veure el ${m[1]}?`, `Can I see the ${m[1]}?`]],
  [/^Más (.+) de segunda mano$/, (m) => [`Més ${m[1]} de segona mà`, `More used ${m[1]}`]],
  [/^(.+) de (\{\d+\}) km en Sabadell \| Plata Garage$/, (m) => [`${m[1]} de ${m[2]} km a Sabadell | Plata Garage`, `Used ${m[1]}, ${m[2]} km, in Sabadell | Plata Garage`]],
  [/^(.+) de segunda mano en Sabadell \| Plata Garage$/, (m) => [`${m[1]} de segona mà a Sabadell | Plata Garage`, `Used ${m[1]} in Sabadell | Plata Garage`]],
  [/^(.+) en Sabadell \| Plata Garage$/, (m) => [`${m[1]} a Sabadell | Plata Garage`, `${m[1]} in Sabadell | Plata Garage`]],
  [/^(.+), (\{\d+\}) km, (gasolina|diésel|híbrido|eléctrico|glp), (manual|automático)\. (\{\d+\}) €\. Garantía de (\{\d+\}) meses en Sabadell\. Pide cita\.$/, (m) => { const f = FUEL[m[3]], t = TRANS[m[4]]; return [`${m[1]}, ${m[2]} km, ${f[0]}, ${t[0]}. ${m[5]} €. Garantia de ${m[6]} mesos a Sabadell. Demana cita.`, `${m[1]}, ${m[2]} km, ${f[1]}, ${t[1]}. ${m[5]} €. ${m[6]}-month warranty in Sabadell. Book a visit.`]; }],
  [/^<a>Inicio<\/a> · <a>Vehículos<\/a> · (.+)$/, (m) => [`<a>Inici</a> · <a>Vehicles</a> · ${m[1]}`, `<a>Home</a> · <a>Cars</a> · ${m[1]}`]],
  [/^(.+) – foto (\{\d+\})$/, (m) => [`${m[1]} – foto ${m[2]}`, `${m[1]} – photo ${m[2]}`]],
  [/^¿Puedo ver y probar el (.+)\?$/, (m) => [`Puc veure i provar el ${m[1]}?`, `Can I see and test-drive the ${m[1]}?`]],
  [/^¿El (.+) tiene garantía\?$/, (m) => [`El ${m[1]} té garantia?`, `Does the ${m[1]} come with a warranty?`]],
  [/^Te lo valoramos sin compromiso y te decimos cuánto te quedaría por pagar por el (.+)\.$/, (m) => [`Te'l valorem sense compromís i et diem quant et quedaria per pagar pel ${m[1]}.`, `We'll value it with no obligation and tell you how much you'd have left to pay for the ${m[1]}.`]],
  [/^Plata Garage · Sabadell · (.+)<br>Fotos, cita y más datos: (.+)$/, (m) => [`Plata Garage · Sabadell · ${m[1]}<br>Fotos, cita i més dades: ${m[2]}`, `Plata Garage · Sabadell · ${m[1]}<br>Photos, booking and more details: ${m[2]}`]],
  [/^Etiqueta (ECO|CERO|B|C)$/, (m) => [`Etiqueta ${m[1] === 'CERO' ? 'ZERO' : m[1]}`, `${m[1] === 'CERO' ? 'ZERO' : m[1]} sticker`]],
  [/^Vídeo$/, () => ['Vídeo', 'Video']],
  [/^El coche en vídeo$/, () => ['El cotxe en vídeo', 'The car on video']],
  [/^Pronto publicaremos los primeros artículos\.$/, () => ['Aviat publicarem els primers articles.', "We'll be publishing our first articles soon."]],
];
let EXTRA = null; // traducciones automáticas de esta petición (Google), si hay clave
export const look = (key, lang) => {
  const v = DICT[key]; if (v) return v[IDX[lang]];
  if (EXTRA && EXTRA[key]) return EXTRA[key];
  for (const [re, f] of RULES) { const m = key.match(re); if (m) return f(m)[IDX[lang]]; }
  // Tiras de enlaces o negritas seguidas (menús, botones): se traduce cada trozo por separado
  if (/<\/?[a-z]+>/.test(key)) {
    const parts = key.split(/(<\/?[a-z]+>)/); let ok = true;
    const out = parts.map((p) => {
      if (!ok || p[0] === '<' || !LETTER.test(p)) return p;
      const t = p.trim(), idx = []; const k = t.replace(/\{(\d+)\}/g, (m, n) => { idx.push(n); return `{${idx.length - 1}}`; });
      let v = DICT[k], suf = '';
      // «Texto ({n})»: se traduce el texto y se conserva el número; las marcas sueltas (Audi, BMW…) se quedan igual
      if (!v && k !== key) { const mm = k.match(/^(.*) \((\{\d+\})\)$/); const base = mm ? mm[1] : k; if (mm && DICT[base]) { v = DICT[base]; suf = ` (${mm[2]})`; } else if (/^[A-Z0-9][A-Za-z0-9-]*$/.test(base)) { v = [k, k]; } }
      if (!v || k === key) { ok = false; return p; }
      return p.match(/^\s*/)[0] + (v[IDX[lang]] + suf).replace(/\{(\d+)\}/g, (m, n) => `{${idx[+n]}}`) + p.match(/\s*$/)[0];
    });
    if (ok) return out.join('');
  }
  return null;
};

// Recorre el HTML y devuelve las tiras de texto (para sacar el diccionario) o el HTML traducido
export function segment(html, onRun, onAttr) {
  const toks = html.match(TOK) || [];
  const out = []; let run = [];
  const flush = () => {
    if (!run.length) return;
    const txt = run.filter((p) => p[0] !== '<').join('');
    if (LETTER.test(txt)) {
      const lead = (run[0][0] !== '<' ? run[0].match(/^\s*/)[0] : ''), last = run[run.length - 1], trail = (last[0] !== '<' ? last.match(/\s*$/)[0] : '');
      const r = onRun(run);
      out.push(r == null ? run.join('') : lead + r + trail);
    } else out.push(run.join(''));
    run = [];
  };
  for (const t of toks) {
    if (t[0] !== '<' || isInline(t)) { run.push(t); continue; }
    flush();
    out.push(t[0] === '<' && t[1] !== '!' && !/^<(script|style|svg)/i.test(t) && onAttr ? onAttr(t) : t);
  }
  flush();
  return out.join('');
}
const ATTR = /\s(alt|title|placeholder|aria-label|content|value)="([^"]*)"/g;
const metaOk = (t) => /^<meta\b/i.test(t) ? /(name|property)="(description|og:title|og:description|twitter:title|twitter:description)"/.test(t) : true;
const valOk = (t) => !/\svalue="/.test(t) || /^<input\b[^>]*type="(submit|button)"/i.test(t);

export function attrKeys(t, cb) {
  if (!metaOk(t)) return t;
  return t.replace(ATTR, (m, a, v) => {
    if ((a === 'content' && !/^<meta\b/i.test(t)) || (a === 'value' && !valOk(t)) || !LETTER.test(v)) return m;
    const nums = []; const k = v.replace(NUM, (x) => { nums.push(x); return `{${nums.length - 1}}`; }).replace(/\s+/g, ' ').trim();
    const r = cb(k, nums); return r == null ? m : ` ${a}="${r}"`;
  });
}

const SKIP = /^\/(platagarage\/|api\/|\.netlify\/|admin|ca\/|en\/|ca$|en$)|\.[a-z0-9]{2,5}($|[?#])/i;
function localize(t, lang, site) {
  return t.replace(/\s(href|action)="([^"]*)"/g, (m, a, v) => {
    if (v.startsWith(site + '/')) { const p = v.slice(site.length); return SKIP.test(p) ? m : ` ${a}="${site}/${lang}${p}"`; }
    if (v.startsWith('/') && !v.startsWith('//') && !SKIP.test(v)) return ` ${a}="/${lang}${v === '/' ? '/' : v}"`;
    return m;
  });
}


// Textos de los scripts (mensajes de los formularios, botones que cambian…)
const SCRIPT = [
  ['Marca la casilla para que podamos avisarte.', 'Marca la casella perquè et puguem avisar.', 'Tick the box so we can let you know.'],
  ['Elige un día en el calendario.', 'Tria un dia al calendari.', 'Choose a day on the calendar.'],
  ['Elige una hora.', 'Tria una hora.', 'Choose a time.'],
  ['Escribe tu email.', 'Escriu el teu correu.', 'Enter your email.'],
  ['Buscó en el stock: ', "Ha cercat a l'estoc: ", 'Searched the stock for: '],
  ['Proponer otra hora', 'Proposar una altra hora', 'Suggest another time'],
  ['Elegir el ', 'Triar el ', 'Choose '],
  ['Dinos hasta cuánto quieres gastar y te buscamos alternativas en ese precio.', 'Digues-nos fins a quant vols gastar i et busquem alternatives en aquest preu.', 'Tell us how much you want to spend and we will find alternatives at that price.'],
  ['Que me busquen uno', "Que me'n busquin un", 'Find me one'],
  ['Te calculamos la cuota sin compromiso: escríbenos y te decimos plazo y entrada.', "Et calculem la quota sense compromís: escriu-nos i et diem termini i entrada.", "We'll work out the monthly payment with no obligation: message us and we'll tell you the term and deposit."],
  ['Calcular mi cuota', 'Calcular la meva quota', 'Work out my payment'],
  ['Elige día y hora y te lo tenemos preparado para verlo y probarlo.', "Tria dia i hora i te'l tindrem preparat per veure'l i provar-lo.", "Choose a day and time and we'll have it ready for you to see and test-drive."],
  ['Pedir cita', 'Demanar cita', 'Book a visit'],
  ['Pregúntanos lo que quieras saber del coche y te contestamos.', 'Pregunta’ns el que vulguis saber del cotxe i et responem.', "Ask us anything about the car and we'll answer."],
  ['Preguntar por WhatsApp', 'Preguntar per WhatsApp', 'Ask on WhatsApp'],
  ['Todos llevan garantía de 12 meses. Tienes los detalles en las dudas de abajo.', 'Tots porten garantia de 12 mesos. Tens els detalls als dubtes de més avall.', 'They all come with a 12-month warranty. See the details in the questions below.'],
  ['Ver las dudas', 'Veure els dubtes', 'See the questions'],
  ['Te damos una valoración orientativa de tu coche como parte de pago.', 'Et donem una valoració orientativa del teu cotxe com a part del pagament.', "We'll give you an approximate part-exchange valuation of your car."],
  ['Valorar mi coche', 'Valorar el meu cotxe', 'Value my car'],
  ['Comparar seleccionados (', 'Comparar els seleccionats (', 'Compare selected ('],
  [' (solo analítica), ', ' (només analítica), ', ' (analytics only), '],
];
function scriptTr(t, L) {
  if (/^<script\b[^>]*ld\+json/i.test(t) || !/^<script/i.test(t)) return t;
  const j = IDX[L] + 1;
  for (const r of SCRIPT) for (const q of ["'", '"']) t = t.split(q + r[0] + q).join(q + r[j].replace(new RegExp(q, 'g'), q === "'" ? '’' : '”') + q);
  t = t.replace(/(['"`])\/gracias/g, `$1/${L}/gracias`);
  return t.replace(/ – foto '/g, L === 'en' ? " – photo '" : " – foto '").replace(/'Buscando: '/g, L === 'en' ? "'Searching: '" : "'Cercant: '");
}

// Banderas (SVG propias, sin imágenes externas)
const FLAG = {
  es: '<svg viewBox="0 0 30 20" width="24" height="16" aria-hidden="true"><rect width="30" height="20" fill="#c60b1e"/><rect y="5" width="30" height="10" fill="#ffc400"/></svg>',
  ca: '<svg viewBox="0 0 30 20" width="24" height="16" aria-hidden="true"><rect width="30" height="20" fill="#fcdd09"/><g fill="#da121a"><rect y="2.2" width="30" height="2.2"/><rect y="6.7" width="30" height="2.2"/><rect y="11.1" width="30" height="2.2"/><rect y="15.6" width="30" height="2.2"/></g></svg>',
  en: '<svg viewBox="0 0 60 40" width="24" height="16" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#c8102e" stroke-width="4"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></svg>',
};
const NAME = { es: 'Español', ca: 'Català', en: 'English' };
const LEGAL = { ca: 'Traducció orientativa. En cas de dubte o discrepància, preval la versió en castellà.', en: 'Courtesy translation. In case of doubt or discrepancy, the Spanish version prevails.' };

// Añade banderas, hreflang y (si toca) traduce la página
export function decorate(html, lang, path, site) {
  const cur = lang || 'es';
  const urlOf = (l) => `${site}${l === 'es' ? '' : '/' + l}${path === '/' ? (l === 'es' ? '/' : '/') : path}`;
  const flags = `<div class="lng" aria-label="Idioma">${['es', 'ca', 'en'].filter((l) => l !== cur).map((l) => `<a href="${urlOf(l).slice(site.length)}" hreflang="${l}" lang="${l}" title="${NAME[l]}" aria-label="${NAME[l]}">${FLAG[l]}</a>`).join('')}</div>`;
  const css = '<style>.lng{display:flex;gap:8px;align-items:center;margin-right:6px}.lng a{display:flex;line-height:0;border-radius:3px;overflow:hidden;opacity:.9}.lng a:hover{opacity:1}.lng svg{display:block}</style>';
  const indexable = /<link rel="canonical"/.test(html);
  const alt = indexable ? ['es', 'ca', 'en'].map((l) => `<link rel="alternate" hreflang="${l}" href="${urlOf(l)}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${urlOf('es')}">` : '';
  let out = html;
  if (lang) {
    const L = lang;
    out = segment(out, (run) => {
      const { key, nums, tags } = keyOf(run); const tr = look(key, L); return tr == null ? null : fill(tr, nums, tags);
    }, null);
    out = (out.match(TOK) || []).map((t) => (t[0] === '<' && t[1] !== '!' && t[1] !== '/' && t.length > 1 && !/^<(script|style|svg)/i.test(t))
      ? localize(attrKeys(t, (k, nums) => { const tr = look(k, L); return tr == null ? null : fill(tr, nums, []); }), L, site) : t).join('');
    out = out.replace(/<script\b[\s\S]*?<\/script>/g, (t) => scriptTr(t, L));
    out = out.replace('<html lang="es"', `<html lang="${L}"`).replace('content="es_ES"', `content="${L === 'ca' ? 'ca_ES' : 'en_GB'}"`)
      .replace(/(<link rel="canonical" href=")([^"]*)(")/, (m, a, v, b) => a + urlOf(L) + b)
      .replace(/(<meta property="og:url" content=")([^"]*)(")/, (m, a, v, b) => a + urlOf(L) + b);
  }
  out = out.replace('</head>', `${alt}${css}</head>`).replace('<div class="hr">', `<div class="hr">${flags}`);
  if (!lang) return out;
  const L = lang;
  if (/^\/(aviso-legal|privacidad|cookies|condiciones-de-contratacion)$/.test(path)) out = out.replace('<main>', `<main><div class="w" style="padding-top:18px"><p style="font-size:13px;opacity:.75">${LEGAL[L]}</p></div>`);
  return out;
}

// Sitemap: cada dirección también en catalán e inglés
export function sitemapLangs(xml, site) {
  const extra = [];
  xml.replace(/<url><loc>([^<]*)<\/loc>(<lastmod>[^<]*<\/lastmod>)?/g, (m, loc, lm) => {
    if (!loc.startsWith(site)) return m; const p = loc.slice(site.length) || '/';
    LANGS.forEach((l) => extra.push(`<url><loc>${site}/${l}${p}</loc>${lm || ''}</url>`)); return m;
  });
  return xml.replace('</urlset>', `${extra.join('\n')}\n</urlset>`);
}

// Envoltorio del manejador: /ca/… y /en/… sirven la misma web traducida
// Traducción automática (Google Cloud Translation) de lo que no está en el diccionario: descripciones de coches nuevos, artículos…
// Solo si existe la clave PG_TRANSLATE_KEY. Cada frase se traduce una vez y se guarda; las siguientes visitas no gastan nada.
let CACHE = null, CACHE_T = 0;
const isLong = (k) => k.length >= 12 && /[a-záéíóúñ]{3,} [a-záéíóúñ]{2,}/i.test(k) && !/^https?:/.test(k);
async function autoTr(html, lang, opts) {
  const apiKey = opts?.key?.(); if (!apiKey || !opts.store) return null;
  const miss = new Set();
  segment(html, (run) => { const k = keyOf(run).key; if (!look(k, lang) && isLong(k)) miss.add(k); return null; }, null);
  if (!miss.size) return null;
  const st = opts.store();
  if (!CACHE || Date.now() - CACHE_T > 300000) { CACHE = (await st.get('i18n-auto', { type: 'json' }).catch(() => null)) || { ca: {}, en: {} }; CACHE_T = Date.now(); }
  const C = CACHE[lang] || (CACHE[lang] = {});
  const todo = [...miss].filter((k) => !(k in C)).slice(0, 60);
  if (todo.length) {
    try {
      const q = todo.map((k) => k.replace(/\{(\d+)\}/g, '<span translate="no">{$1}</span>'));
      const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q, source: 'es', target: lang, format: 'html' }), signal: AbortSignal.timeout(6000) });
      const j = await r.json();
      const ph = (x) => (x.match(/\{\d+\}|<\/?[a-z]+>/g) || []).sort().join();
      (j?.data?.translations || []).forEach((t, i) => {
        const v = String(t.translatedText || '').replace(/<span translate="no">\s*(\{\d+\})\s*<\/span>/g, '$1');
        C[todo[i]] = v && ph(v) === ph(todo[i]) ? v : '';
      });
      await st.setJSON('i18n-auto', CACHE).catch(() => {});
    } catch (e) { /* sin traducción automática: se queda en castellano */ }
  }
  const out = {}; miss.forEach((k) => { if (C[k]) out[k] = C[k]; }); return out;
}

export function wrap(inner, siteOf, opts = {}) {
  return async (req, context) => {
    const url = new URL(req.url);
    const m = url.pathname.match(/^\/(ca|en)(\/.*)?$/);
    const lang = m ? m[1] : '';
    let r2 = req;
    if (lang) {
      if (!m[2]) return new Response(null, { status: 301, headers: { location: `/${lang}/` } });
      const u = new URL(req.url); u.pathname = m[2];
      if (/^\/(api|admin|platagarage)\b/.test(m[2]) || m[2] === '/sitemap.xml' || m[2] === '/robots.txt') return new Response(null, { status: 301, headers: { location: m[2] + url.search } });
      r2 = new Request(u, req);
    }
    const res = await inner(r2, context);
    const site = siteOf(url);
    const loc = res.headers.get('location');
    if (lang && loc && loc.startsWith('/') && !SKIP.test(loc)) { const h = new Headers(res.headers); h.set('location', `/${lang}${loc}`); return new Response(res.body, { status: res.status, headers: h }); }
    const ct = res.headers.get('content-type') || '';
    const path = (lang ? m[2] : url.pathname).replace(/\/+$/, '') || '/';
    if (!lang && path === '/sitemap.xml' && ct.includes('xml')) { const x = await res.text(); return new Response(sitemapLangs(x, site), { status: res.status, headers: res.headers }); }
    if (!ct.includes('text/html') || /^\/admin/.test(path)) return res;
    const body = await res.text();
    const p = (path === '/vehiculos' || path === '/blog') ? path + '/' : path;
    const extra = lang && /^\/(vehiculos|blog)\/./.test(p) ? await autoTr(body, lang, opts) : null;
    EXTRA = extra; let out; try { out = decorate(body, lang, p, site); } finally { EXTRA = null; }
    return new Response(out, { status: res.status, headers: res.headers });
  };
}
