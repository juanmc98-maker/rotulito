// Plantillas HTML de la web pública y del panel de Plata Garage
const B = '/platagarage';
const WA = '34660493228';
const TEL = '+34 660 49 32 28';
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => (n == null ? '' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n) + ' €');
const kms = (n) => (n == null ? '' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n) + ' km');
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
// Netlify Image CDN: convierte a WebP/AVIF y ajusta el tamaño al vuelo
export const im = (u, w) => (!u || !u.startsWith('/') || process.env.PG_NO_CDN ? u : `/.netlify/images?url=${encodeURIComponent(u)}&w=${w}&q=72`);
const carName = (c) => `${c.brand} ${c.model}${c.version ? ' ' + c.version : ''}`;
const fechaLarga = (iso) => (iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '');

const I = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ic = {
  tel: I('<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>'),
  arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  back: I('<path d="M19 12H5M11 18l-6-6 6-6"/>'),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
  cal: I('<path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>'),
  chat: I('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'),
  gauge: I('<path d="M12 14l4-4M3.3 17a10 10 0 1117.4 0"/>'),
  fuel: I('<path d="M4 22V5a2 2 0 012-2h6a2 2 0 012 2v17M3 22h12M14 10h2a2 2 0 012 2v3a2 2 0 004 0V8l-3-3M7 8h4"/>'),
  gear: I('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'),
  truck: I('<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>'),
  key: I('<circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>'),
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.89 6.99c0 5.45-4.44 9.89-9.89 9.89m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z"/></svg>',
};

const CSS = `@font-face{font-family:Inter;font-weight:100 900;font-display:swap;src:url(${B}/assets/inter-latin.woff2) format('woff2')}
@font-face{font-family:'Space Grotesk';font-weight:300 700;font-display:swap;src:url(${B}/assets/space-grotesk-latin.woff2) format('woff2')}
:root{--bg:#050505;--card:#141414;--line:rgba(255,255,255,.09);--tx:#f5f5f5;--mu:#a1a1a1;--or:#f76806;--wa:#25d366}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit}img{max-width:100%;display:block}
h1,h2,h3,.sg{font-family:'Space Grotesk',Inter,system-ui,sans-serif}
.w{max-width:1216px;margin:0 auto;padding:0 32px}
header{position:sticky;top:0;z-index:40;background:rgba(5,5,5,.86);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
header .w{display:flex;align-items:center;justify-content:space-between;height:80px;gap:16px;max-width:1280px}
header .lg img{height:40px;width:auto}
nav.m{display:flex;gap:4px}nav.m a{padding:8px 16px;border-radius:999px;color:var(--mu);text-decoration:none;font-size:14px;font-weight:500;position:relative}
nav.m a:hover,nav.m a.on{color:#fff}nav.m a.on:after{content:"";position:absolute;left:30%;right:30%;bottom:-6px;height:2px;background:linear-gradient(90deg,transparent,var(--or),transparent)}
.hr{display:flex;align-items:center;gap:22px}.tel{display:flex;gap:8px;align-items:center;color:var(--mu);text-decoration:none;font-size:15px}.tel svg{width:18px;height:18px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 26px;border-radius:999px;background:var(--or);color:#000;text-decoration:none;font-weight:600;border:1px solid var(--or);cursor:pointer;font-size:15px;font-family:Inter,sans-serif;transition:filter .15s}
.btn:hover{filter:brightness(1.08)}.btn.g{background:transparent;color:#fff;border-color:var(--line)}.btn.g:hover{border-color:#555}
.btn svg{width:16px;height:16px}.btn.sm{padding:10px 22px}.btn[disabled]{opacity:.5;cursor:wait}
a:focus-visible,button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible,.th img:focus-visible{outline:2px solid #fff;outline-offset:3px}
.pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);background:rgba(20,20,20,.8);border-radius:999px;padding:6px 14px;font-size:13px;font-weight:500;margin-bottom:18px}
.pill i{width:7px;height:7px;border-radius:50%;background:var(--or)}.pill svg{width:14px;height:14px;color:var(--or)}
.gr{background:linear-gradient(90deg,#fff 0%,#ffbf94 40%,var(--or) 85%);-webkit-background-clip:text;background-clip:text;color:transparent}
h1{font-size:clamp(38px,6vw,72px);font-weight:700;letter-spacing:-.02em;line-height:1.05;margin:0}
h2{font-size:clamp(30px,4vw,48px);font-weight:700;letter-spacing:-.02em;line-height:1.08;margin:0}
h1.s{font-size:clamp(32px,4.5vw,52px)}
.hero{position:relative;overflow:hidden;min-height:640px;display:flex;align-items:center}
.hero .bg{position:absolute;inset:0;background:url(${B}/assets/hero.jpg) center/cover}
.hero .bg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,5,5,.92) 0%,rgba(5,5,5,.7) 45%,rgba(5,5,5,.35) 100%),linear-gradient(0deg,#050505 0%,transparent 35%),radial-gradient(60% 60% at 0% 60%,rgba(247,104,6,.28),transparent 70%)}
.hero .w{width:100%;position:relative;padding-top:64px;padding-bottom:56px}.hero h1{max-width:760px}
.hero p.l{color:var(--mu);font-size:19px;max-width:560px;margin:22px 0 30px}
.row{display:flex;gap:12px;flex-wrap:wrap}
.tr{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-top:44px}
.tc{background:rgba(20,20,20,.72);border:1px solid var(--line);border-radius:18px;padding:18px;text-align:center;backdrop-filter:blur(6px)}
.tc svg{width:26px;height:26px;color:var(--or);margin:0 auto 8px}.tc b{display:block;font-size:15px}.tc span{color:var(--mu);font-size:13px}
section{padding:88px 0}.mu{color:var(--mu)}
.hd{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:40px}.hd a.v{color:var(--mu);text-decoration:none;font-size:15px}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.card{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;text-decoration:none;display:block;transition:border-color .2s,transform .2s}
.card:hover{border-color:rgba(247,104,6,.5);transform:translateY(-3px)}
.card .ph{aspect-ratio:4/3;background:#0d0d0d;overflow:hidden;position:relative}.card .ph img{width:100%;height:100%;object-fit:cover}
.card .pr{position:absolute;right:12px;bottom:12px;background:rgba(0,0,0,.72);backdrop-filter:blur(6px);border-radius:999px;padding:7px 14px;font-weight:700;font-size:15px}
.tag{position:absolute;left:12px;top:12px;background:var(--or);color:#000;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700}.tag.r{background:#fff}
.card .b{padding:20px 22px 22px}.card .br{color:var(--or);font-size:13px;letter-spacing:.08em;text-transform:uppercase;font-weight:500}
.card .md{font-family:'Space Grotesk',sans-serif;font-size:20px;margin:2px 0 14px}.md b{font-weight:700}.md span{font-weight:400;color:#9a9a9a}
.sp{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px;color:var(--mu);font-size:14px}.sp div{display:flex;gap:8px;align-items:center}.sp svg{width:16px;height:16px;color:var(--or);flex:none}
.filters{display:flex;gap:10px;flex-wrap:wrap;margin:26px 0 30px}
select,input,textarea{background:var(--card);color:var(--tx);border:1px solid var(--line);border-radius:999px;padding:11px 18px;font-size:15px;font-family:Inter,sans-serif;width:100%}
.filters select,.filters input{width:auto}textarea{border-radius:16px;min-height:110px;resize:vertical}
.two{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
.two .im{border-radius:22px;overflow:hidden;border:1px solid var(--line);aspect-ratio:4/5;background:#0d0d0d}.two .im img{width:100%;height:100%;object-fit:cover}
.lead{color:var(--mu);font-size:17px;margin:18px 0 28px}
.stp{display:grid;gap:14px}.stp div{display:flex;gap:16px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px}
.stp i{font-style:normal;flex:none;width:34px;height:34px;border-radius:50%;background:rgba(247,104,6,.14);color:var(--or);display:grid;place-items:center;font-weight:700;font-family:'Space Grotesk',sans-serif}.stp b{display:block}.stp span{color:var(--mu);font-size:14px}
.cta{background:radial-gradient(70% 120% at 50% 0%,rgba(247,104,6,.2),transparent 70%),var(--card);border:1px solid var(--line);border-radius:28px;padding:64px 32px;text-align:center}.cta .row{justify-content:center;margin-top:28px}
.crumb{padding:34px 0 0}.crumb a{display:inline-flex;gap:8px;align-items:center;color:var(--mu);text-decoration:none;font-size:15px}.crumb svg{width:16px;height:16px}
.fic{display:grid;grid-template-columns:1.45fr 1fr;gap:40px;padding:26px 0 24px;align-items:start}
.gal .main{aspect-ratio:4/3;background:#0d0d0d;border-radius:22px;overflow:hidden;border:1px solid var(--line)}.gal .main img{width:100%;height:100%;object-fit:cover}
.th{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:12px}.th img{height:auto;aspect-ratio:4/3;object-fit:cover;border-radius:12px;cursor:pointer;opacity:.6;border:2px solid transparent;width:100%}.th img.on,.th img:hover{opacity:1;border-color:var(--or)}
.price{font-family:'Space Grotesk',sans-serif;font-size:46px;font-weight:700;margin:10px 0 18px}
.box{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:22px;margin-bottom:18px}.box .btn{width:100%;margin-bottom:10px}.box .tx{display:block;text-align:center;color:var(--mu);text-decoration:none;padding:6px}
.box .tx svg{width:16px;height:16px;vertical-align:-3px}.box .btn svg{width:16px;height:16px}.box h3{font-size:18px;margin:0 0 12px;display:flex;gap:8px;align-items:center}.box h3 svg{width:18px;height:18px;color:var(--or)}
table{width:100%;border-collapse:collapse}td{padding:11px 0;border-bottom:1px solid var(--line);font-size:15px}tr:last-child td{border:0}td:first-child{color:var(--mu);width:46%}
ul.eq{columns:2;gap:28px;padding:0;margin:0;list-style:none}ul.eq li{margin-bottom:9px;break-inside:avoid;font-size:15px;padding-left:20px;position:relative}ul.eq li:before{content:"";position:absolute;left:0;top:9px;width:7px;height:7px;border-radius:50%;background:var(--or)}
.note{font-size:13px;color:var(--mu);margin-top:6px}.desc{white-space:pre-line;color:#d6d6d6}
form.f{display:grid;gap:14px}.f2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.f label{display:grid;gap:6px;font-size:13px;color:var(--mu);font-weight:500}
.chk{display:flex!important;gap:10px;align-items:flex-start;grid-template-columns:none}.chk input{width:18px;height:18px;margin-top:2px;flex:none;accent-color:var(--or)}
.hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;overflow:hidden}
.msg{font-size:14px;border-radius:12px;padding:10px 14px;display:none}.msg.err{display:block;background:rgba(220,38,38,.12);color:#fca5a5}.msg.ok{display:block;background:rgba(34,197,94,.12);color:#86efac}
.slots{display:flex;flex-wrap:wrap;gap:8px}.slots button{background:var(--bg);border:1px solid var(--line);color:#fff;border-radius:999px;padding:8px 14px;cursor:pointer;font:500 14px Inter,sans-serif}.slots button.on{background:var(--or);border-color:var(--or);color:#000}
.post{max-width:760px;margin:0 auto}.post h2{font-size:28px;margin:34px 0 10px}.post h3{font-size:21px;margin:26px 0 8px}.post p,.post li{color:#d6d6d6}.post a{color:var(--or)}.post img{border-radius:16px}
footer{border-top:1px solid var(--line);padding:44px 0 96px;color:var(--mu);font-size:14px}footer img{height:36px;margin-bottom:14px}footer a{color:var(--mu)}footer nav{display:flex;gap:18px;flex-wrap:wrap;margin:10px 0}
.wf{position:fixed;right:20px;bottom:20px;z-index:50;width:58px;height:58px;border-radius:50%;background:var(--wa);display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.5)}.wf svg{width:30px;height:30px;color:#fff;display:block}
@media(max-width:980px){.grid{grid-template-columns:repeat(2,1fr)}.two,.fic{grid-template-columns:1fr}.tel{display:none}}
@media(max-width:700px){.w{padding:0 18px}nav.m{display:none}.grid{grid-template-columns:1fr}.hero{min-height:560px}section{padding:56px 0}ul.eq{columns:1}.th{grid-template-columns:repeat(4,1fr)}.price{font-size:38px}header .w{height:68px}.f2{grid-template-columns:1fr}.hr .btn{padding:9px 16px}}
.cg{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}.ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}.ch>span{display:flex;gap:8px;align-items:center;font-weight:600}.ch svg{width:18px;height:18px;color:var(--or)}
.ch div{display:flex;gap:10px;align-items:center}.ch button{background:none;border:0;color:#fff;font-size:20px;cursor:pointer;width:32px;height:32px;border-radius:50%}.ch button:disabled{opacity:.25;cursor:default}.ch b{font-family:'Space Grotesk',sans-serif;min-width:130px;text-align:center}
.cw,.cd{display:grid;grid-template-columns:repeat(7,1fr);text-align:center}.cw span{font-size:11px;color:var(--mu);padding:6px 0}.cd button{aspect-ratio:1;border:0;background:none;color:#555;border-radius:50%;font:500 15px Inter,sans-serif;margin:2px}
.cd button.av{color:#fff;cursor:pointer}.cd button.av:hover{background:#222}.cd button.sel{background:var(--or);color:#000}.cd .ot{visibility:hidden}.ct{border-top:1px solid var(--line);margin-top:12px;padding-top:14px}
.ic3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:26px 0 28px}.ic3 div{display:flex;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px}.ic3 svg{width:20px;height:20px;color:var(--or);flex:none;margin-top:2px}.ic3 b{display:block;font-size:15px}.ic3 span{color:var(--mu);font-size:13px}
.v3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:20px;align-items:start}
.al{position:fixed;right:20px;bottom:92px;z-index:70;width:min(360px,calc(100vw - 32px));background:#111;border:1px solid var(--line);border-radius:20px;padding:20px;box-shadow:0 20px 50px rgba(0,0,0,.6);display:none}.al.on{display:block}
.al h3{margin:0 0 6px;font-size:18px}.al p{margin:0 0 12px;color:var(--mu);font-size:14px}.al .x{position:absolute;top:10px;right:12px;background:none;border:0;color:#aaa;font-size:22px;cursor:pointer}.al form{display:grid;gap:10px}.al input{padding:10px 14px;font-size:14px}.al .chk{font-size:12px;color:var(--mu)}
.wz{max-width:720px}.wz .stp2{display:flex;gap:6px;margin-bottom:22px}.wz .stp2 i{flex:1;height:4px;border-radius:4px;background:#2a2a2a}.wz .stp2 i.on{background:var(--or)}.wz fieldset{border:0;padding:0;margin:0;display:none}.wz fieldset.on{display:grid;gap:14px}.wz legend{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;margin-bottom:14px}
.ops{display:flex;flex-wrap:wrap;gap:8px}.ops label{display:block;cursor:pointer}.ops input{position:absolute;opacity:0;width:1px}.ops span{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:9px 16px;color:#ddd;font-size:14px}.ops input:checked+span{background:var(--or);border-color:var(--or);color:#000}.ops input:focus-visible+span{outline:2px solid #fff}
.legal h2{font-size:22px;margin:28px 0 8px}.legal p,.legal li{color:#d6d6d6}
@media(max-width:900px){.cg,.v3,.ic3{grid-template-columns:1fr}.al{bottom:84px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const LD_BIZ = { '@context': 'https://schema.org', '@type': ['AutoDealer', 'LocalBusiness'], '@id': '#negocio', name: 'Plata Garage', telephone: TEL, image: `${B}/assets/logo.png`, address: { '@type': 'PostalAddress', addressLocality: 'Sabadell', addressRegion: 'Barcelona', addressCountry: 'ES' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '19:30' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' }], description: 'Compraventa de vehículos de ocasión en Sabadell. Atención con cita previa.' };
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

function page({ title, desc, on = '', body, head = '', script = '', car = '', alert = false }) {
  const n = (h, t, k) => `<a href="${B}${h}"${on === k ? ' class="on" aria-current="page"' : ''}>${t}</a>`;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#050505"><link rel="icon" href="${B}/assets/logo.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${B}/assets/space-grotesk-latin.woff2"><style>${CSS}</style>${ld(LD_BIZ)}${head}</head><body${car ? ` data-car="${esc(car)}"` : ''}>
<header><div class="w"><a class="lg" href="${B}/"><img src="${B}/assets/logo.png" alt="Plata Garage" width="103" height="40"></a><nav class="m" aria-label="Principal">${n('/', 'Inicio', 'home')}${n('/vehiculos/', 'Vehículos', 'veh')}${n('/cita', 'Reservar cita', 'cita')}${n('/blog/', 'Blog', 'blog')}${n('/contacto', 'Contacto', 'con')}</nav>
<div class="hr"><a class="tel" href="tel:+34660493228">${ic.tel}${TEL}</a><a class="btn sm" href="${B}/cita">Reservar cita</a></div></div></header>
<main>${body}</main>
<footer><div class="w"><img src="${B}/assets/logo.png" alt="Plata Garage" width="92" height="36"><p>Plata Garage · Compraventa de vehículos de ocasión en Sabadell (Barcelona). Atendemos con cita previa.</p>
<nav><a href="${B}/vehiculos/">Vehículos</a><a href="${B}/cita">Reservar cita</a><a href="${B}/te-lo-buscamos">Te lo buscamos</a><a href="${B}/cuanto-vale-mi-coche">¿Cuánto vale mi coche?</a><a href="${B}/contacto">Contacto</a><a href="${B}/blog/">Blog</a><a href="${B}/aviso-legal">Aviso legal</a><a href="${B}/privacidad">Privacidad</a></nav>
<p>La información de esta web es orientativa y no vinculante. Puede contener errores: confirma los datos del vehículo antes de decidir.</p><p style="margin-top:18px;font-size:13px">Web por <a href="https://www.rotulito.com/" rel="noopener">rotulito.com</a></p></div></footer>
<a class="wf" href="${wa('Hola, quería información sobre un coche.')}" rel="noopener" aria-label="Escribir por WhatsApp">${ic.wa}</a>
${alert ? ALERT_HTML : ''}<script>${TRACK_JS}${alert ? ALERT_JS : ''}${script || ''}</script></body></html>`;
}

const cover = (c) => (c.images && c.images[0]) || `${B}/assets/logo.png`;
export function card(c) {
  const tag = c.status === 'reservado' ? '<span class="tag r">Reservado</span>' : c.status === 'preparacion' ? '<span class="tag">Próximamente</span>' : '';
  return `<a class="card" href="${B}/vehiculos/${c.slug}" data-p="${c.price}" data-f="${esc(c.fuel)}" data-t="${esc(c.trans)}" data-y="${c.year}" data-k="${c.km}" data-m="${esc(c.brand)}" data-c="${esc(c.body)}" data-s="${c.created || ''}">
<div class="ph"><img src="${esc(im(cover(c), 600))}" alt="${esc(carName(c) + ' ' + c.year)}" loading="lazy" width="400" height="300">${tag}<span class="pr">${eur(c.price)}</span></div>
<div class="b"><div class="br">${esc(c.brand)}</div><div class="md"><b>${esc(c.model)}</b> <span>${esc(c.version || '')}</span></div>
<div class="sp"><div>${ic.cal}${c.year}</div><div>${ic.gauge}${kms(c.km)}</div><div>${ic.fuel}${esc(c.fuel)}</div><div>${ic.gear}${esc(c.trans)}</div></div></div></a>`;
}

// Formularios comunes (antispam: honeypot + tiempo mínimo + validación en servidor)
const hp = () => `<label class="hp" aria-hidden="true">Web<input name="web" tabindex="-1" autocomplete="off"></label><input type="hidden" name="t" value="">`;
const priv = () => `<label class="chk"><input type="checkbox" name="privacidad" value="si" required><span>He leído y acepto la <a href="${B}/privacidad" target="_blank">política de privacidad</a>. Usaremos tus datos solo para responder a esta solicitud.</span></label>`;
const contactFields = (er = false) => `<div class="f2"><label>Nombre *<input name="nombre" required minlength="2" maxlength="80" autocomplete="name"></label><label>Teléfono *<input name="telefono" required type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="600 000 000"></label></div><label>Email${er ? ' *' : ''}<input name="email" type="email" maxlength="200" autocomplete="email"${er ? ' required' : ''}></label>`;
const FORM_JS = `document.querySelectorAll('input[name=t]').forEach(i=>i.value=Date.now());
document.querySelectorAll('form[data-api]').forEach(f=>f.addEventListener('submit',async e=>{e.preventDefault();const m=f.querySelector('.msg'),b=f.querySelector('button[type=submit]');m.className='msg';
const tel=f.telefono.value.replace(/[\\s().-]/g,'');if(!/^(\\+34|0034)?[6789]\\d{8}$/.test(tel)&&!/^\\+\\d{8,14}$/.test(tel)){m.textContent='Escribe un teléfono válido.';m.className='msg err';return}
if(f.fecha&&!f.fecha.value){m.textContent='Elige un día en el calendario.';m.className='msg err';return}
if(f.hora&&!f.hora.value){m.textContent='Elige una hora.';m.className='msg err';return}
if(f.email&&f.email.required&&!/^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i.test(f.email.value)){m.textContent='Escribe tu email.';m.className='msg err';return}
b.disabled=true;try{const r=await fetch(f.dataset.api,{method:'POST',body:new FormData(f)});const j=await r.json();if(!r.ok)throw new Error(j.error||'Error');location.href='${B}/gracias?t='+encodeURIComponent(f.dataset.t)}catch(err){m.textContent=err.message;m.className='msg err';b.disabled=false}}));`;
const SLOTS_JS = `(()=>{const cd=document.getElementById('cd');if(!cd)return;const cm=document.getElementById('cm'),fd=document.getElementById('fecha'),hh=document.getElementById('hora'),sl=document.getElementById('slots'),bp=document.querySelector('.ch .cp'),bn=document.querySelector('.ch .cn');
const MES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];const now=new Date();let y=now.getFullYear(),m=now.getMonth();const y0=y,m0=m;
async function slots(d){hh.value='';sl.innerHTML='<span class="note">Cargando horas…</span>';const j=await fetch('${B}/api/slots?fecha='+d).then(r=>r.json()).catch(()=>({slots:[]}));
sl.innerHTML=j.slots.length?'':'<span class="note">No quedan horas libres ese día.</span>';j.slots.forEach(h=>{const x=document.createElement('button');x.type='button';x.textContent=h;x.onclick=()=>{sl.querySelectorAll('button').forEach(z=>z.classList.remove('on'));x.classList.add('on');hh.value=h};sl.appendChild(x)})}
async function draw(){cm.textContent=MES[m]+' '+y;const mes=y+'-'+String(m+1).padStart(2,'0');bp.disabled=(y===y0&&m===m0);bn.disabled=((y-y0)*12+m-m0)>=2;cd.innerHTML='';
const j=await fetch('${B}/api/dias?mes='+mes).then(r=>r.json()).catch(()=>({dias:[]}));const av=new Set(j.dias);const first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
for(let i=0;i<first;i++){const e=document.createElement('button');e.type='button';e.className='ot';e.tabIndex=-1;cd.appendChild(e)}
for(let d=1;d<=n;d++){const iso=mes+'-'+String(d).padStart(2,'0');const e=document.createElement('button');e.type='button';e.textContent=d;if(av.has(iso)){e.className='av'+(fd.value===iso?' sel':'');e.setAttribute('aria-label','Elegir el '+d+' de '+MES[m]);e.onclick=()=>{fd.value=iso;cd.querySelectorAll('.sel').forEach(z=>z.classList.remove('sel'));e.classList.add('sel');slots(iso)}}else{e.disabled=true}cd.appendChild(e)}}
bp.onclick=()=>{m--;if(m<0){m=11;y--}draw()};bn.onclick=()=>{m++;if(m>11){m=0;y++}draw()};draw()})();`;

function citaForm({ cars, coche = '', motivo = '' }) {
  const mot = ['Ver un coche en concreto', 'Reservar este coche', 'Tasar mi coche', 'Información sobre financiación', 'Otro motivo'];
  return `<form class="f" data-api="${B}/api/cita" data-t="cita" novalidate>${hp()}<input type="hidden" name="fecha" id="fecha"><input type="hidden" name="hora" id="hora">
<div class="cg"><div class="box" style="padding:24px;margin:0"><div class="ch"><span>${ic.cal}Elige una fecha</span><div><button type="button" class="cp" aria-label="Mes anterior">‹</button><b id="cm"></b><button type="button" class="cn" aria-label="Mes siguiente">›</button></div></div>
<div class="cw"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="cd" id="cd"></div>
<div class="ct"><span class="note" style="display:block;margin-bottom:8px">Horas disponibles</span><div class="slots" id="slots"><span class="note">Elige primero un día.</span></div></div></div>
<div class="box" style="padding:24px;margin:0;display:grid;gap:14px"><h3 style="margin:0">Tus datos</h3>
<div class="f2"><label>Nombre completo *<input name="nombre" required minlength="2" maxlength="80" autocomplete="name" placeholder="Juan Pérez"></label><label>Teléfono *<input name="telefono" required type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="600 000 000"></label></div>
<label>Email *<input name="email" type="email" maxlength="200" autocomplete="email" required placeholder="tu@email.com"></label>
<label>Motivo de la visita *<select name="motivo">${mot.map((m) => `<option${m === motivo ? ' selected' : ''}>${m}</option>`).join('')}</select></label>
<label>¿Algún vehículo concreto? (opcional)<select name="coche"><option value="">— Ninguno en concreto —</option>${cars.map((c) => `<option value="${c.slug}"${c.slug === coche ? ' selected' : ''}>${esc(carName(c))} (${c.year})</option>`).join('')}</select></label>
<label>Notas adicionales<textarea name="mensaje" maxlength="1000" placeholder="Cuéntanos cualquier detalle que debamos saber…"></textarea></label>${priv()}
<div class="msg" role="alert"></div><button class="btn" type="submit">Confirmar reserva</button><p class="note" style="margin:0">Te confirmamos la cita por WhatsApp o por teléfono.</p></div></div></form>`;
}
const INFO3 = `<div class="ic3"><div>${I('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>')}<p style="margin:0"><b>30 min de atención personal</b><span>Sin esperas: tu hora es tuya.</span></p></div><div>${I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>')}<p style="margin:0"><b>Sin compromiso</b><span>Visita gratuita e informativa.</span></p></div><div>${I('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>')}<p style="margin:0"><b>En Sabadell</b><span>Con cita previa.</span></p></div></div>`;

// Medición propia (sin cookies ni datos personales)
const TRACK_JS = `(()=>{try{const u=new URL(location.href),r=document.referrer?new URL(document.referrer).hostname:'';let s=u.searchParams.get('utm_source')||(u.searchParams.get('fbclid')?'facebook':'')||(u.searchParams.get('gclid')?'google-ads':'');
if(!s&&r&&r!==location.hostname){s=/google/.test(r)?'google':/facebook|fb\\\\./.test(r)?'facebook':/instagram/.test(r)?'instagram':/bing/.test(r)?'bing':/wallapop/.test(r)?'wallapop':/coches\\\\.net/.test(r)?'coches.net':/milanuncios/.test(r)?'milanuncios':r.replace(/^www\\\\./,'')}
const c=document.body.dataset.car||'',snd=o=>navigator.sendBeacon&&navigator.sendBeacon('${B}/api/hit',new Blob([JSON.stringify(o)],{type:'application/json'}));
snd({e:'view',p:location.pathname,s,c});document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const h=a.getAttribute('href')||'';if(h.startsWith('https://wa.me'))snd({e:'wa',c});else if(h.startsWith('tel:'))snd({e:'tel',c});else if(a.id==='pdf')snd({e:'pdf',c})},true)}catch(x){}})();`;

// Aviso de stock (alertas): ventana discreta, una vez por sesión
const ALERT_HTML = `<div class="al" id="al" role="dialog" aria-label="Avisos de coches nuevos"><button class="x" aria-label="Cerrar">×</button><h3>¿No encuentras tu coche?</h3><p>Déjanos tu email y te avisamos cuando entre uno como el que buscas.</p>
<form id="alf" novalidate>${hp()}<input name="busca" maxlength="120" placeholder="Qué buscas (p. ej. SUV diésel automático)"><input name="max" inputmode="numeric" maxlength="6" placeholder="Presupuesto máximo (€)"><input name="email" type="email" required maxlength="200" placeholder="Tu email *">
<label class="chk"><input type="checkbox" name="consent" value="si"><span>Quiero recibir por email avisos de coches en stock que encajen con lo que busco. Me puedo dar de baja cuando quiera. <a href="${B}/privacidad" target="_blank">Privacidad</a></span></label><div class="msg" role="alert"></div><button class="btn sm" type="submit">Avisarme</button></form></div>`;
const ALERT_JS = `(()=>{const al=document.getElementById('al');if(!al)return;let seen=false;try{seen=sessionStorage.getItem('pg_al')==='1'}catch(x){}if(seen)return;
const open=()=>{if(seen)return;seen=true;try{sessionStorage.setItem('pg_al','1')}catch(x){}al.classList.add('on')};setTimeout(open,25000);addEventListener('scroll',()=>{if(scrollY>document.body.scrollHeight*.55)open()},{passive:true});
al.querySelector('.x').onclick=()=>al.classList.remove('on');const f=document.getElementById('alf');f.t.value=Date.now();
f.onsubmit=async e=>{e.preventDefault();const m=f.querySelector('.msg');m.className='msg';if(!f.consent.checked){m.textContent='Marca la casilla para que podamos avisarte.';m.className='msg err';return}
const fd=new FormData(f);fd.append('origen',location.pathname);const r=await fetch('${B}/api/alerta',{method:'POST',body:fd});const j=await r.json().catch(()=>({}));if(!r.ok){m.textContent=j.error||'Error';m.className='msg err';return}
f.innerHTML='<p class="msg ok" style="display:block">¡Hecho! Te avisaremos cuando entre un coche así.</p>'}})();`;

// ---------- páginas ----------
export function home({ cars }) {
  const dest = cars.filter((c) => c.featured).sort((a, b) => b.price - a.price).slice(0, 6);
  const body = `<section class="hero" style="padding:0"><div class="bg"></div><div class="w"><div class="pill"><i></i>Coches seleccionados</div><h1>Vehículos de ocasión<br>en Sabadell, <span class="gr">con trato<br>directo.</span></h1>
<p class="l">Garantía de 12 meses y atención con cita previa. Mira el stock y ven a verlo sin compromiso.</p>
<div class="row"><a class="btn" href="${B}/vehiculos/">Ver catálogo ${ic.arrow}</a><a class="btn g" href="${B}/te-lo-buscamos">Busco un coche concreto</a></div>
<div class="tr"><div class="tc">${ic.shield}<b>Garantía 12 meses</b><span>En todos los vehículos</span></div><div class="tc">${ic.cal}<b>Atención con cita</b><span>Lun–Vie y sábados</span></div><div class="tc">${ic.chat}<b>Respuesta por WhatsApp</b><span>Escríbenos sin compromiso</span></div></div></div></section>
<section><div class="w"><div class="hd"><div><div class="pill">${ic.shield}Selección destacada</div><h2>Vehículos seleccionados,<br>trato <span class="gr">personalizado</span></h2></div><a class="v" href="${B}/vehiculos/">Ver todo →</a></div>
<div class="grid">${dest.map(card).join('')}</div><p style="text-align:center;margin-top:36px"><a class="btn g" href="${B}/vehiculos/">Explorar catálogo completo (${cars.length}) ${ic.arrow}</a></p></div></section>
<section><div class="w two"><div><div class="pill">${ic.shield}Cómo trabajamos</div><h2>Más que vender coches,<br><span class="gr">cuidamos cada detalle.</span></h2><p class="lead">Te enseñamos el coche con calma, resolvemos tus dudas y te acompañamos hasta la entrega.</p>
<div class="stp"><div><i>1</i><p style="margin:0"><b>Elige</b><span>Mira el stock y pide cita para el coche que te interesa.</span></p></div><div><i>2</i><p style="margin:0"><b>Ven a verlo</b><span>Lo ves y lo pruebas sin prisa, el día y la hora que elijas.</span></p></div><div><i>3</i><p style="margin:0"><b>Te lo llevas</b><span>Con garantía de 12 meses. Si necesitas financiación, consúltanos.</span></p></div></div></div>
<div class="im"><img src="${im(B + '/img/1785836189166-dpvwhc.jpg', 900)}" alt="Cupra León en la exposición de Plata Garage" loading="lazy" width="640" height="800"></div></div></section>
<section id="cita"><div class="w"><div class="cta"><h2>¿Tienes un coche en mente?<br><span class="gr">Reserva una visita.</span></h2><p class="lead" style="max-width:520px;margin:18px auto 0">Atendemos con cita previa en Sabadell. Elige día y hora y te lo confirmamos.</p>
<div class="row"><a class="btn" href="${B}/cita">Reservar cita</a><a class="btn g" href="${B}/cuanto-vale-mi-coche">¿Cuánto vale mi coche?</a></div></div></div></section>`;
  return page({ title: 'Plata Garage · Coches de segunda mano en Sabadell', desc: 'Coches de segunda mano en Sabadell con garantía de 12 meses. Mira el stock y pide cita.', on: 'home', body, alert: true });
}

export function catalog({ cars, q = {} }) {
  const opts = (k) => [...new Set(cars.map((c) => c[k]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const sel = (id, label, list) => `<select id="${id}" aria-label="${label}"><option value="">${label}</option>${list.map((x) => `<option${q[id] === x ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill"><i></i>${cars.length} coches disponibles</div><h1 class="s">Coches de segunda mano <span class="gr">en Sabadell</span></h1>
<div class="filters">${sel('m', 'Marca', opts('brand'))}${sel('f', 'Combustible', opts('fuel'))}${sel('t', 'Cambio', opts('trans'))}${sel('c', 'Carrocería', opts('body'))}
<select id="p" aria-label="Precio máximo"><option value="">Precio máximo</option>${[4000, 6000, 8000, 10000, 15000, 20000, 30000].map((v) => `<option value="${v}">Hasta ${eur(v)}</option>`).join('')}</select>
<select id="o" aria-label="Ordenar"><option value="p-">Precio: mayor a menor</option><option value="p+">Precio: menor a mayor</option><option value="k+">Menos kilómetros</option><option value="y-">Más nuevos</option><option value="s-">Últimos en llegar</option></select></div>
<p class="note" id="n"></p><div class="grid" id="g">${cars.sort((a, b) => b.price - a.price).map(card).join('')}</div>
<p class="mu" id="z" style="display:none">No hay coches con esos filtros. <a href="${B}/te-lo-buscamos" style="color:var(--or)">Dinos qué buscas</a> y te ayudamos a encontrarlo.</p></div></section>`;
  const script = `const g=document.getElementById('g'),cs=[...g.children],v=id=>document.getElementById(id).value;
function run(){const m=v('m'),f=v('f'),t=v('t'),c=v('c'),p=+v('p')||1e9,o=v('o');let n=0;
const k=o[0]==='p'?'p':o[0]==='k'?'k':o[0]==='y'?'y':'s',dir=o[1]==='+'?1:-1;
cs.sort((a,b)=>{const x=a.dataset[k],y=b.dataset[k];return (k==='s'?x.localeCompare(y):(+x-+y))*dir}).forEach(e=>{const ok=(!m||e.dataset.m===m)&&(!f||e.dataset.f===f)&&(!t||e.dataset.t===t)&&(!c||e.dataset.c===c)&&+e.dataset.p<=p;e.style.display=ok?'':'none';if(ok)n++;g.appendChild(e)});
document.getElementById('n').textContent=n+' resultado'+(n===1?'':'s');document.getElementById('z').style.display=n?'none':''}
document.querySelectorAll('.filters select').forEach(s=>s.addEventListener('change',run));run();`;
  return page({ title: 'Coches de segunda mano en Sabadell | Plata Garage', desc: `${cars.length} coches de ocasión en Sabadell con garantía de 12 meses. Filtra por marca, precio y combustible y pide cita.`, on: 'veh', body, script, alert: true });
}

const FICHA_CSS = `
.fh{position:relative;min-height:min(82vh,760px);display:flex;align-items:flex-end;overflow:hidden;background:#0d0d0d}
.fh img.bgi{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.fh:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#050505 0%,rgba(5,5,5,.86) 26%,rgba(5,5,5,.25) 60%,rgba(5,5,5,.15) 100%),linear-gradient(90deg,rgba(5,5,5,.7),transparent 60%)}
.fh .w{position:relative;z-index:1;width:100%;padding-top:120px;padding-bottom:52px}
.fh .cr{font-size:13px;color:#cfcfcf;margin-bottom:16px}.fh .cr a{color:#cfcfcf;text-decoration:none}
.st{display:inline-block;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px}
.st.ok{background:#dcfce7;color:#14532d}.st.re{background:#fff;color:#000}.st.pr{background:var(--or);color:#000}
.fh h1{font-size:clamp(40px,6.4vw,84px)}.fh h1 span{display:block;font-size:.38em;font-weight:500;color:#cfcfcf;letter-spacing:0;margin-top:6px}
.chips{display:flex;flex-wrap:wrap;gap:8px 18px;margin:20px 0 6px;color:#e5e5e5;font-size:15px}.chips span{display:inline-flex;gap:7px;align-items:center}.chips svg{width:16px;height:16px;color:var(--or)}
.fh .pz{font-family:'Space Grotesk',sans-serif;font-size:clamp(40px,5vw,58px);font-weight:700;margin:14px 0 22px}
.fh .pdf{display:inline-block;margin-top:14px;color:#cfcfcf;font-size:14px}
.fl{display:grid;grid-template-columns:200px 1fr;gap:48px;align-items:start;padding-top:40px}
.idx{position:sticky;top:104px;display:grid;gap:2px;border-left:1px solid var(--line);padding-left:14px}
.idx a{color:var(--mu);text-decoration:none;font-size:14px;padding:6px 0;position:relative}.idx a.on{color:#fff}.idx a.on:before{content:"";position:absolute;left:-15px;top:6px;bottom:6px;width:2px;background:var(--or)}
.fs{padding:34px 0 56px;border-bottom:1px solid var(--line);scroll-margin-top:96px}.fs:last-child{border:0}
.ey{color:var(--or);font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin-bottom:8px}
.fs h2{font-size:clamp(28px,3.4vw,40px);margin-bottom:22px}
.alt{display:grid;grid-template-columns:1.1fr 1fr;gap:36px;align-items:center;margin-bottom:34px}.alt.r{grid-template-columns:1fr 1.1fr}.alt.r .ai{order:2}
.ai{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:#0d0d0d;border:1px solid var(--line);cursor:zoom-in}.ai img{width:100%;height:100%;object-fit:cover}
.hl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.hl div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px;display:flex;gap:10px;align-items:flex-start;font-size:15px}.hl svg{width:18px;height:18px;color:var(--or);flex:none;margin-top:3px}
.op{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--or);border-radius:16px;padding:22px 24px;color:#ddd;white-space:pre-line}
.band{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;background:radial-gradient(80% 140% at 0% 0%,rgba(247,104,6,.18),transparent 60%),var(--card);border:1px solid var(--line);border-radius:20px;padding:22px 26px;margin:6px 0 0}.band b{font-size:18px;font-family:'Space Grotesk',sans-serif}
.dk{background:#0b0b0b;border:1px solid var(--line);border-radius:24px;padding:28px}
.big{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}.big div{border:1px solid var(--line);border-radius:16px;padding:16px}.big b{display:block;font-family:'Space Grotesk',sans-serif;font-size:28px}.big span{color:var(--mu);font-size:13px}
.dt{display:grid;grid-template-columns:1fr 1fr;gap:0 32px}.dt div{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--line);font-size:15px}.dt dt{color:var(--mu)}.dt dd{margin:0;text-align:right}
.ph6{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.ph6 button{padding:0;border:0;border-radius:14px;overflow:hidden;aspect-ratio:4/3;background:#0d0d0d;cursor:zoom-in}.ph6 img{width:100%;height:100%;object-fit:cover;transition:transform .3s}.ph6 button:hover img{transform:scale(1.04)}
.vis{display:grid;grid-template-columns:1.2fr 1fr;gap:20px;align-items:start}
.lb{position:fixed;inset:0;z-index:90;background:rgba(0,0,0,.94);display:none;align-items:center;justify-content:center}.lb.on{display:flex}.lb img{max-width:94vw;max-height:86vh;border-radius:10px}
.lb button{position:absolute;background:rgba(255,255,255,.1);border:0;color:#fff;width:48px;height:48px;border-radius:50%;font-size:24px;cursor:pointer}.lb .x{top:18px;right:18px}.lb .p{left:18px;top:50%}.lb .n{right:18px;top:50%}.lb .c{position:absolute;bottom:18px;color:#bbb;font-size:14px}
.sb{position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(10,10,10,.96);backdrop-filter:blur(8px);border-top:1px solid var(--line);padding:10px 16px;display:none;align-items:center;gap:10px;transform:translateY(100%);transition:transform .2s}.sb.on{transform:none}
.sb b{font-family:'Space Grotesk',sans-serif;font-size:20px;flex:1}.sb .btn{padding:11px 18px}.sb a.wa{width:46px;height:46px;border-radius:50%;background:var(--wa);display:grid;place-items:center;flex:none}.sb a.wa svg{width:24px;height:24px;color:#fff}
.pn{display:none}
@media(max-width:980px){.fl{grid-template-columns:1fr;gap:0}.idx{position:sticky;top:68px;z-index:30;display:flex;overflow-x:auto;gap:6px;border:0;padding:10px 0;background:rgba(5,5,5,.94);margin:0 -18px;padding-left:18px}.idx a{white-space:nowrap;border:1px solid var(--line);border-radius:999px;padding:6px 14px}.idx a.on{border-color:var(--or)}.idx a.on:before{display:none}
.alt,.alt.r,.vis{grid-template-columns:1fr}.alt.r .ai{order:0}.hl{grid-template-columns:1fr 1fr}.big{grid-template-columns:1fr 1fr}.big b{font-size:21px;overflow-wrap:anywhere}.dt{grid-template-columns:1fr}.ph6{grid-template-columns:1fr 1fr}.sb{display:flex}.wf{display:none}.fh{min-height:76vh}}
@media(max-width:560px){.hl{grid-template-columns:1fr}}
@media print{.pn{display:flex!important}.al,header,footer,.wf,.sb,.idx,.lb,.ph6,.vis,.band,#similares,.fh .btn,.fh .pdf,form{display:none!important}body{background:#fff;color:#000}.fh{min-height:0;display:block}.fh:after{display:none}.fh img.bgi{position:static;height:300px;border-radius:12px}.fh .w{padding:16px 0}.fh h1,.fh .pz,.chips,.dt dd{color:#000}.fl{display:block}.dk,.hl div,.op{background:#fff;border-color:#ccc;color:#000}.big b{color:#000}.pn{display:block;margin-top:20px;font-size:13px}.fs{padding:16px 0;break-inside:avoid}}`;

const etiquetaDe = (c) => (c.etiqueta === 'SIN' ? 'Sin etiqueta' : c.etiqueta) || ((c.desc || '').match(/(?:pegatina|distintivo|etiqueta)(?: medioambiental| ambiental)?:?\s*(ECO|CERO|0|C|B)\b/i)?.[1] || '').toUpperCase().replace(/^0$/, 'CERO');

export function ficha({ car: c, cars, holders, qr = '', fichaUrl = '' }) {
  const name = carName(c);
  const imgs = c.images?.length ? c.images : [cover(c)];
  const etq = etiquetaDe(c);
  const big = [[c.year, 'Año'], [kms(c.km), 'Kilómetros'], [c.cv ? c.cv + ' CV' : '—', 'Potencia'], [c.trans, 'Cambio']];
  const rows = [['Marca', c.brand], ['Modelo', c.model], ['Versión', c.version], ['Año', c.year], ['Kilómetros', kms(c.km)], ['Combustible', c.fuel], ['Cambio', c.trans], ['Potencia', c.cv ? c.cv + ' CV' : ''], ['Carrocería', c.body], ['Puertas', c.doors], ['Plazas', c.seats], ['Color', c.color], ['Etiqueta DGT', etq], ['Garantía', '12 meses']].filter((r) => r[1] != null && r[1] !== '');
  const sim = cars.filter((x) => x.id !== c.id).sort((a, b) => (a.brand === c.brand ? -1 : 0) - (b.brand === c.brand ? -1 : 0) || Math.abs(a.price - c.price) - Math.abs(b.price - c.price)).slice(0, 3);
  const holder = holders.find((h) => h.id === c.holder);
  const feats = c.features || [];
  const paras = (c.desc || '').split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const okIc = I('<path d="M20 6L9 17l-5-5"/>');
  const stt = c.status === 'reservado' ? '<span class="st re">Reservado</span>' : c.status === 'preparacion' ? '<span class="st pr">Próximamente</span>' : '<span class="st ok">Disponible</span>';
  const secs = [['coche', 'El coche'], feats.length >= 3 ? ['destacado', 'Lo destacado'] : null, c.comment ? ['opinion', 'Cómo lo vemos'] : null, feats.length ? ['equipamiento', 'Equipamiento'] : null, ['ficha', 'Ficha técnica'], imgs.length > 1 ? ['fotos', 'Fotos'] : null, ['visita', 'Verlo en persona']].filter(Boolean);
  const title = (() => { const full = `${name} ${c.year} de segunda mano en Sabadell | Plata Garage`; if (full.length <= 70) return full; const s = `${c.brand} ${c.model} ${c.year} de segunda mano en Sabadell | Plata Garage`; return s.length <= 70 ? s : `${c.brand} ${c.model} ${c.year} en Sabadell | Plata Garage`; })();
  const desc = `${name} ${c.year}, ${kms(c.km)}, ${c.fuel.toLowerCase()}, ${c.trans.toLowerCase()}. ${eur(c.price)}. Garantía de 12 meses en Sabadell. Pide cita.`.slice(0, 158);
  const ldCar = { '@context': 'https://schema.org', '@type': ['Product', 'Car'], name: `${name} ${c.year}`, brand: { '@type': 'Brand', name: c.brand }, model: c.model, vehicleModelDate: String(c.year), mileageFromOdometer: { '@type': 'QuantitativeValue', value: c.km, unitCode: 'KMT' }, fuelType: c.fuel, vehicleTransmission: c.trans, color: c.color || undefined, bodyType: c.body || undefined, numberOfDoors: c.doors || undefined, vehicleSeatingCapacity: c.seats || undefined, vehicleEngine: c.cv ? { '@type': 'EngineSpecification', enginePower: { '@type': 'QuantitativeValue', value: c.cv, unitCode: 'BHP' } } : undefined, image: imgs, description: (c.desc || '').slice(0, 500), offers: { '@type': 'Offer', price: c.price, priceCurrency: 'EUR', availability: c.status === 'reservado' ? 'https://schema.org/LimitedAvailability' : c.status === 'preparacion' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock', itemCondition: 'https://schema.org/UsedCondition', seller: { '@id': '#negocio' } } };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: `${B}/` }, { '@type': 'ListItem', position: 2, name: 'Vehículos', item: `${B}/vehiculos/` }, { '@type': 'ListItem', position: 3, name }] };
  const ph = (i) => imgs[i] ? `<div class="ai" data-i="${i}"><img src="${esc(im(imgs[i], 900))}" alt="${esc(name)} ${c.year} – foto ${i + 1}" loading="lazy" width="800" height="600"></div>` : '';
  const waTxt = `Hola, me interesa el ${name} (${c.year}) de ${eur(c.price)}.`;
  const reservaBox = c.reserve > 0 && c.status === 'disponible' ? `<div class="box"><h3>${ic.key}Reserva este coche</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Señal de <b style="color:#fff">${eur(c.reserve)}</b> que se descuenta del precio. Primero te confirmamos que sigue disponible y te explicamos las condiciones; después puedes pagarla por Bizum${holder?.accounts?.length ? ' o transferencia' : ''}.</p><a class="btn g" href="${B}/cita?coche=${c.slug}&motivo=${encodeURIComponent('Reservar este coche')}">Solicitar reserva</a></div>` : '';

  const body = `<section class="fh" style="padding:0"><img class="bgi" src="${esc(im(imgs[0], 1600))}" alt="${esc(name)} ${c.year}" fetchpriority="high" width="1600" height="1200"><div class="w">
<div class="cr"><a href="${B}/">Inicio</a> · <a href="${B}/vehiculos/">Vehículos</a> · ${esc(c.brand)} ${esc(c.model)}</div>${stt}
<h1>${esc(c.brand)} ${esc(c.model)}${c.version ? `<span>${esc(c.version)}</span>` : ''}</h1>
<div class="chips"><span>${ic.cal}${c.year}</span><span>${ic.gauge}${kms(c.km)}</span><span>${ic.fuel}${esc(c.fuel)}</span><span>${ic.gear}${esc(c.trans)}</span>${c.cv ? `<span>${c.cv} CV</span>` : ''}${etq ? `<span>${etq.startsWith('Sin') ? esc(etq) : 'Etiqueta ' + esc(etq)}</span>` : ''}</div>
<div class="pz">${eur(c.price)}</div>
<div class="row"><a class="btn" href="#visita">${ic.cal}Pedir cita para verlo</a><a class="btn g" href="${wa(waTxt)}" rel="noopener">${ic.wa}WhatsApp</a><a class="btn g" href="#ficha">Ver los datos</a></div>
<a class="pdf" href="#" id="pdf">Descargar ficha (PDF)</a></div></section>
<div class="w fl"><nav class="idx" aria-label="En esta página">${secs.map(([id, t], i) => `<a href="#${id}"${i ? '' : ' class="on"'}>${t}</a>`).join('')}</nav><div>
<section class="fs" id="coche"><div class="ey">El coche</div><h2>${esc(name)}</h2>
<div class="alt">${ph(1) || ph(0)}<div class="desc" style="white-space:pre-line">${esc(paras[0] || '')}</div></div>
${paras.length > 1 ? `<div class="alt r">${ph(2) || ''}<div class="desc" style="white-space:pre-line">${esc(paras.slice(1).join('\n\n'))}</div></div>` : ''}
<div class="band"><div><b>¿Quieres verlo en persona?</b><div class="mu" style="font-size:14px">Elige día y hora y te lo tenemos preparado.</div></div><a class="btn" href="#visita">Pedir cita</a></div></section>
${feats.length >= 3 ? `<section class="fs" id="destacado"><div class="ey">Lo destacado</div><h2>Lo que más se agradece</h2><div class="hl">${feats.slice(0, 6).map((f) => `<div>${okIc}<span>${esc(f)}</span></div>`).join('')}</div>${imgs[3] ? `<div class="alt" style="margin:28px 0 0">${ph(3)}${ph(4) || ''}</div>` : ''}</section>` : ''}
${c.comment ? `<section class="fs" id="opinion"><div class="ey">Cómo lo vemos</div><h2>Nuestra opinión</h2><div class="op">${esc(c.comment)}</div></section>` : ''}
${feats.length ? `<section class="fs" id="equipamiento"><div class="ey">Equipamiento</div><h2>Todo lo que lleva</h2><ul class="eq">${feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></section>` : ''}
<section class="fs" id="ficha"><div class="ey">Ficha técnica</div><h2>Los datos</h2><div class="dk"><div class="big">${big.map(([v, k]) => `<div><b>${esc(v)}</b><span>${k}</span></div>`).join('')}</div>
<dl class="dt">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
<p class="note">Datos orientativos y no vinculantes; pueden contener errores. Confírmalos con nosotros antes de decidir.</p>
<div class="pn" style="display:none;gap:16px;align-items:center"><div style="width:96px">${qr}</div><div>Plata Garage · Sabadell · ${TEL}<br>Fotos, cita y más datos: ${esc(fichaUrl)}</div></div></section>
${imgs.length > 1 ? `<section class="fs" id="fotos"><div class="ey">Fotos</div><h2>Todas las fotos (${imgs.length})</h2><div class="ph6">${imgs.map((u, i) => `<button type="button" data-i="${i}" aria-label="Ver foto ${i + 1} en grande"><img src="${esc(im(u, 500))}" alt="${esc(name)} ${c.year} – foto ${i + 1}" loading="lazy" width="400" height="300"></button>`).join('')}</div></section>` : ''}
<section class="fs" id="visita"><div class="ey">Verlo en persona</div><h2>Reserva tu visita para este coche</h2>${citaForm({ cars, coche: c.slug })}
<div class="v3"><div class="box"><h3>${ic.chat}¿Prefieres preguntar?</h3><a class="btn" href="${wa(waTxt)}" rel="noopener">${ic.wa}Preguntar por WhatsApp</a><a class="tx" href="tel:+34660493228">${ic.tel} ${TEL}</a><p class="note">Garantía de 12 meses. Financiación: consúltanos condiciones.</p></div>${reservaBox}
<div class="box"><h3>${ic.truck}Te lo llevamos a casa</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Dinos tu código postal y te pasamos presupuesto del envío, sin compromiso.</p>
<form class="f" data-api="${B}/api/envio" data-t="envio" novalidate>${hp()}<input type="hidden" name="coche" value="${c.slug}"><label>Código postal *<input name="cp" required inputmode="numeric" pattern="\\d{5}" maxlength="5"></label>${contactFields()}${priv()}<div class="msg" role="alert"></div><button class="btn g" type="submit">Pedir presupuesto de envío</button></form></div></div></section></div></div>
${sim.length ? `<section id="similares" style="padding:40px 0 90px"><div class="w"><h2 style="font-size:32px;margin-bottom:28px">También te puede interesar</h2><div class="grid">${sim.map(card).join('')}</div></div></section>` : ''}
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Fotos"><button class="x" aria-label="Cerrar">×</button><button class="p" aria-label="Anterior">‹</button><img alt=""><button class="n" aria-label="Siguiente">›</button><span class="c"></span></div>
<div class="sb" id="sb"><b>${eur(c.price)}</b><a class="btn" href="#visita">Pedir cita</a><a class="wa" href="${wa(waTxt)}" rel="noopener" aria-label="WhatsApp">${ic.wa}</a></div>`;

  const script = `const IM=${JSON.stringify(imgs.map((u) => im(u, 1600)))},lb=document.getElementById('lb'),li=lb.querySelector('img'),lc=lb.querySelector('.c');let k=0;
const show=i=>{k=(i+IM.length)%IM.length;li.src=IM[k];li.alt='${esc(name).replace(/'/g, '')} – foto '+(k+1);lc.textContent=(k+1)+' / '+IM.length;lb.classList.add('on')};
document.querySelectorAll('[data-i]').forEach(e=>e.addEventListener('click',()=>show(+e.dataset.i)));
lb.querySelector('.x').onclick=()=>lb.classList.remove('on');lb.querySelector('.p').onclick=()=>show(k-1);lb.querySelector('.n').onclick=()=>show(k+1);
lb.onclick=e=>{if(e.target===lb)lb.classList.remove('on')};document.addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')show(k-1);if(e.key==='ArrowRight')show(k+1)});
let sx=0;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40)show(k+(d<0?1:-1))});
document.getElementById('pdf').onclick=e=>{e.preventDefault();window.print()};
const sb=document.getElementById('sb'),hero=document.querySelector('.fh');new IntersectionObserver(([e])=>sb.classList.toggle('on',!e.isIntersecting)).observe(hero);
const links=[...document.querySelectorAll('.idx a')];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
${FORM_JS}${SLOTS_JS}`;
  return page({ title, desc, on: 'veh', body, head: `<style>${FICHA_CSS}</style>` + ld(ldCar) + ld(crumbs) + `<meta property="og:image" content="${esc(imgs[0])}">`, script, car: c.slug, alert: true });
}

export function cita({ cars, coche, motivo }) {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${ic.cal}Agenda</div><h1 class="s">Reserva tu visita<br><span class="gr">en menos de un minuto.</span></h1>
<p class="lead" style="max-width:640px">Elige el día y la hora que mejor te vengan. Te recibimos en Sabadell, te enseñamos los coches que te interesen y resolvemos todas tus dudas.</p>${INFO3}${citaForm({ cars, coche, motivo })}</div></section>`;
  return page({ title: 'Reservar cita | Plata Garage', desc: 'Pide cita para ver un coche en Plata Garage (Sabadell). Elige día y hora.', on: 'cita', body, script: FORM_JS + SLOTS_JS });
}

export function contacto() {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${ic.chat}Contacto</div><h1 class="s">Hablemos <span class="gr">sin compromiso</span></h1>
<p class="lead">Atendemos con cita previa en Sabadell, de lunes a viernes de 9:30 a 19:30 y los sábados de 10:00 a 14:00. Lo más rápido es <a href="${wa('Hola, quería información.')}" style="color:var(--or)">WhatsApp</a> o el ${TEL}.</p>
<div class="two" style="align-items:start;gap:28px"><div class="box" style="padding:28px"><h3>Envíanos un mensaje</h3><form class="f" data-api="${B}/api/mensaje" data-t="mensaje" novalidate>${hp()}${contactFields()}<label>Asunto<input name="asunto" maxlength="120"></label><label>Mensaje *<textarea name="mensaje" required maxlength="3000"></textarea></label>${priv()}<div class="msg" role="alert"></div><button class="btn" type="submit">Enviar mensaje</button></form></div>
<div class="box" id="tasacion" style="padding:28px"><h3>Tasación de tu vehículo</h3><p class="mu" style="margin:0 0 14px;font-size:14px">Cuéntanos qué coche tienes y te damos una valoración orientativa.</p><form class="f" data-api="${B}/api/tasacion" data-t="tasacion" novalidate>${hp()}${contactFields()}
<div class="f2"><label>Marca *<input name="marca" required maxlength="40"></label><label>Modelo *<input name="modelo" required maxlength="60"></label></div>
<div class="f2"><label>Año<input name="anio" inputmode="numeric" maxlength="4"></label><label>Kilómetros<input name="km" inputmode="numeric" maxlength="7"></label></div>
<label>Combustible<select name="combustible"><option value="">—</option><option>Gasolina</option><option>Diésel</option><option>Híbrido</option><option>Eléctrico</option><option>GLP</option></select></label>
<label>Estado, extras, observaciones<textarea name="notas" maxlength="1500"></textarea></label>${priv()}<div class="msg" role="alert"></div><button class="btn" type="submit">Solicitar tasación</button></form></div></div></div></section>`;
  return page({ title: 'Contacto y tasación | Plata Garage', desc: 'Contacta con Plata Garage en Sabadell o pide la tasación de tu coche.', on: 'con', body, script: FORM_JS });
}

export function gracias(t) {
  const txt = { cita: 'Hemos recibido tu solicitud de cita. Te la confirmamos en breve por WhatsApp o por teléfono.', envio: 'Hemos recibido tu solicitud. Te pasamos el presupuesto del envío lo antes posible.', tasacion: 'Hemos recibido los datos de tu coche. Te enviamos una valoración orientativa en 24 horas laborables.', busqueda: 'Hemos recibido lo que buscas. Te escribimos en cuanto tengamos opciones que encajen.', mensaje: 'Hemos recibido tu mensaje. Te respondemos lo antes posible.' }[t] || 'Hemos recibido tu solicitud.';
  return page({ title: 'Gracias | Plata Garage', desc: 'Solicitud recibida', body: `<section><div class="w"><div class="cta"><h2>¡Gracias!</h2><p class="lead" style="max-width:560px;margin:18px auto 0">${txt}</p><div class="row"><a class="btn" href="${B}/vehiculos/">Ver más coches</a><a class="btn g" href="${wa('Hola, acabo de enviar una solicitud desde la web.')}">Escribir por WhatsApp</a></div></div></div></section>` });
}

const TITULARES = `<ul><li><b>Cristina Plata Galán</b> · NIF 48271238B · C/ Tetuán 92, 08203 Sabadell (Barcelona)</li><li><b>Juan Morante Cruz</b> · NIF 77123920K · C/ Tetuán 92, 08203 Sabadell (Barcelona)</li></ul>`;
export function privacidad() {
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Política de privacidad</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Responsables del tratamiento</h2><p>Los datos que nos facilitas en esta web los tratan, como corresponsables, los profesionales autónomos que operan bajo el nombre comercial «Plata Garage»:</p>${TITULARES}<p>Cada uno trata los datos de los clientes con los que contrata. Contacto para cualquier cuestión de privacidad: info@platagarage.com · ${TEL}.</p>
<h2>2. Qué datos tratamos y para qué</h2><ul><li><b>Citas, reservas, envíos, tasaciones, "Te lo buscamos" y mensajes:</b> nombre, teléfono, email y lo que nos cuentes en el formulario, para atender tu solicitud y contactarte por teléfono, WhatsApp o email sobre ella.</li>
<li><b>Avisos de coches nuevos:</b> tu email y lo que buscas, para enviarte avisos de coches en stock que encajen. Solo si marcas la casilla, y puedes darte de baja cuando quieras respondiendo a cualquier aviso o escribiendo a info@platagarage.com.</li>
<li><b>Medición de la web:</b> contamos visitas por página y de dónde llegan (por ejemplo, Google o Facebook) de forma agregada, sin cookies y sin guardar tu IP ni ningún dato que te identifique.</li></ul>
<h2>3. Base legal</h2><p>Tu consentimiento al enviar cada formulario o activar los avisos (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD). La medición agregada se basa en nuestro interés legítimo en saber qué funciona en la web (art. 6.1.f RGPD), sin datos personales.</p>
<h2>4. Conservación</h2><p>Mientras dure la gestión de tu solicitud y, después, durante los plazos legales aplicables. Si no llega a haber operación, borramos los datos como máximo a los 12 meses. Los avisos de coches nuevos, hasta que te des de baja.</p>
<h2>5. Destinatarios</h2><p>No cedemos tus datos a terceros salvo obligación legal. Usamos proveedores que actúan como encargados del tratamiento: Netlify (alojamiento de la web y de los datos, y envío de los avisos internos por correo) y Google (correo electrónico). Si nos escribes por WhatsApp, se aplican también las condiciones de WhatsApp (Meta).</p>
<h2>6. Tus derechos</h2><p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad, y retirar tu consentimiento en cualquier momento, escribiendo a info@platagarage.com. Si crees que no hemos atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
<h2>7. Cookies</h2><p>Esta web no instala cookies de publicidad ni de analítica. Solo el panel interno de gestión usa una cookie técnica de sesión, necesaria para entrar.</p></div></section>`;
  return page({ title: 'Política de privacidad | Plata Garage', desc: 'Política de privacidad de Plata Garage', body });
}

export function avisoLegal() {
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Aviso legal</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Titulares de la web</h2><p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que esta web es una plataforma de venta de vehículos de ocasión operada conjuntamente, bajo el nombre comercial «Plata Garage», por los siguientes profesionales autónomos, con actividad de compraventa de vehículos de ocasión:</p>${TITULARES}<p>Contacto común: info@platagarage.com · ${TEL}.</p>
<h2>2. Objeto y uso</h2><p>Este aviso regula el acceso y uso de la web. Al navegar por ella aceptas estas condiciones. Te comprometes a hacer un uso adecuado de la web y a no emplearla para fines ilícitos.</p>
<h2>3. Información de los vehículos</h2><p>Los datos, fotos y precios de los vehículos son orientativos y no vinculantes: pueden contener errores y cambiar sin previo aviso. Las condiciones de cada operación son las que figuren en el contrato de compraventa. Los vehículos tienen garantía de 12 meses.</p>
<h2>4. Propiedad intelectual</h2><p>Los textos, fotografías, logotipos y el diseño de esta web pertenecen a sus titulares o se usan con autorización. No se pueden reproducir sin permiso.</p>
<h2>5. Responsabilidad</h2><p>No nos hacemos responsables de los daños derivados de un uso indebido de la web ni de interrupciones del servicio por causas ajenas. Los enlaces a otras webs se ofrecen solo como referencia.</p>
<h2>6. Legislación aplicable</h2><p>Este aviso se rige por la legislación española. Para cualquier controversia, y salvo que la normativa de consumidores disponga otra cosa, serán competentes los juzgados y tribunales del domicilio del consumidor.</p></div></section>`;
  return page({ title: 'Aviso legal | Plata Garage', desc: 'Aviso legal de Plata Garage', body });
}

const opts = (name, list, type = 'radio') => `<div class="ops">${list.map((o) => `<label><input type="${type}" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div>`;

export function teLoBuscamos({ cars }) {
  const marcas = [...new Set(cars.map((c) => c.brand))].sort();
  const body = `<section style="padding-top:56px"><div class="w two" style="align-items:start;gap:40px"><div><div class="pill">${I('<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>')}Coche a la carta</div><h1 class="s">¿No lo ves en el stock?<br><span class="gr">Te lo buscamos.</span></h1>
<p class="lead">Dinos qué coche quieres y hasta cuánto quieres gastar. Lo buscamos por ti y, cuando tengamos opciones que encajen, te escribimos.</p>
<div class="stp"><div><i>1</i><p style="margin:0"><b>Nos cuentas qué buscas</b><span>Marca, presupuesto, kilómetros… lo que tengas claro.</span></p></div><div><i>2</i><p style="margin:0"><b>Lo buscamos</b><span>Te proponemos coches que encajen, revisados antes de vendértelos.</span></p></div><div><i>3</i><p style="margin:0"><b>Tú decides</b><span>Sin compromiso: si no te convence, no pasa nada.</span></p></div></div></div>
<div class="box" style="padding:28px"><form class="f" data-api="${B}/api/busqueda" data-t="busqueda" novalidate>${hp()}
<div class="f2"><label>Marca<input name="marca" maxlength="40" list="mk" placeholder="Cualquiera"><datalist id="mk">${marcas.map((m) => `<option value="${esc(m)}">`).join('')}</datalist></label><label>Modelo<input name="modelo" maxlength="60" placeholder="Opcional"></label></div>
<div class="f2"><label>Presupuesto máximo (€) *<input name="presupuesto" required inputmode="numeric" maxlength="7" placeholder="12000"></label><label>Kilómetros máximos<input name="km" inputmode="numeric" maxlength="7" placeholder="150000"></label></div>
<div class="f2"><label>Año desde<input name="anio" inputmode="numeric" maxlength="4" placeholder="2015"></label><label>Combustible<select name="combustible"><option value="">Me da igual</option><option>Gasolina</option><option>Diésel</option><option>Híbrido</option><option>Eléctrico</option><option>GLP</option></select></label></div>
<label>Cambio<select name="cambio"><option value="">Me da igual</option><option>Manual</option><option>Automático</option></select></label>
<label>Cuéntanos algo más<textarea name="mensaje" maxlength="1500" placeholder="Uso que le darás, plazas, maletero, color…"></textarea></label>
${contactFields()}${priv()}<div class="msg" role="alert"></div><button class="btn" type="submit">Que me lo busquen</button></form></div></div></section>`;
  return page({ title: 'Te buscamos coche en Sabadell | Plata Garage', desc: 'Dinos qué coche de segunda mano buscas y tu presupuesto y te lo buscamos. Sin compromiso.', body, script: FORM_JS });
}

export function cuantoVale() {
  const y = new Date().getFullYear();
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${I('<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5"/>')}Tasación gratuita</div><h1 class="s">¿Cuánto vale <span class="gr">mi coche?</span></h1>
<p class="lead" style="max-width:640px">Responde 4 preguntas rápidas y te damos una valoración orientativa, hecha por una persona y no por un algoritmo, en 24 horas laborables. Sin compromiso de venta.</p>
<div class="box wz" style="padding:28px"><div class="stp2"><i class="on"></i><i></i><i></i><i></i></div>
<form class="f" data-api="${B}/api/tasacion" data-t="tasacion" novalidate id="wz">${hp()}
<fieldset class="on"><legend>1. ¿Qué coche es?</legend><div class="f2"><label>Marca *<input name="marca" required maxlength="40" placeholder="Seat"></label><label>Modelo *<input name="modelo" required maxlength="60" placeholder="León 1.5 TSI"></label></div>
<div class="f2"><label>Año de matriculación *<input name="anio" required inputmode="numeric" maxlength="4" placeholder="${y - 8}"></label><label>Kilómetros *<input name="km" required inputmode="numeric" maxlength="7" placeholder="120000"></label></div></fieldset>
<fieldset><legend>2. Motor y cambio</legend><span class="note">Combustible</span>${opts('combustible', ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP'])}<span class="note">Cambio</span>${opts('cambio', ['Manual', 'Automático'])}</fieldset>
<fieldset><legend>3. ¿Cómo está?</legend><span class="note">Estado general</span>${opts('estado', ['Como nuevo', 'Bien, uso normal', 'Con detalles de chapa o interior', 'Necesita reparación'])}<span class="note">ITV</span>${opts('itv', ['En vigor', 'Caducada', 'No lo sé'])}
<label>¿Algo que debamos saber?<textarea name="notas" maxlength="1500" placeholder="Extras, golpes, mantenimiento, un solo propietario…"></textarea></label></fieldset>
<fieldset><legend>4. ¿Dónde te enviamos la valoración?</legend>${contactFields()}${priv()}<div class="msg" role="alert"></div></fieldset>
<div class="row" style="justify-content:space-between;margin-top:6px"><button class="btn g" type="button" id="wzb" style="visibility:hidden">Atrás</button><button class="btn" type="button" id="wzn">Siguiente</button><button class="btn" type="submit" id="wzs" style="display:none">Recibir mi valoración</button></div></form>
<p class="note">Valoración orientativa y no vinculante: el precio final depende de ver el coche en persona.</p></div></div></section>`;
  const script = `(()=>{const f=document.getElementById('wz'),fs=[...f.querySelectorAll('fieldset')],bar=[...document.querySelectorAll('.stp2 i')],b=document.getElementById('wzb'),n=document.getElementById('wzn'),sb=document.getElementById('wzs');let k=0;
const go=i=>{k=i;fs.forEach((x,j)=>x.classList.toggle('on',j===k));bar.forEach((x,j)=>x.classList.toggle('on',j<=k));b.style.visibility=k?'visible':'hidden';n.style.display=k<fs.length-1?'':'none';sb.style.display=k===fs.length-1?'':'none'};
n.onclick=()=>{const bad=[...fs[k].querySelectorAll('[required]')].find(x=>!x.value.trim());if(bad){bad.focus();bad.reportValidity&&bad.reportValidity();return}go(k+1)};b.onclick=()=>go(k-1)})();${FORM_JS}`;
  return page({ title: '¿Cuánto vale mi coche? Tasación gratis en Sabadell | Plata Garage', desc: 'Pide una valoración orientativa de tu coche, hecha por una persona, en 24 horas laborables. Gratis y sin compromiso.', body, script });
}

// Markdown sencillo y seguro (escapa todo el HTML)
export function md(src = '') {
  const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\((\/platagarage\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (m, t, u) => `<a href="${u}"${u.startsWith('/') ? '' : ' rel="noopener" target="_blank"'}>${t}</a>`);
  const out = []; let list = null, para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inl(para.join(' '))}</p>`); para = []; } if (list) { out.push(`<${list.t}>${list.i.map((x) => `<li>${inl(x)}</li>`).join('')}</${list.t}>`); list = null; } };
  for (const raw of src.replace(/\r/g, '').split('\n')) {
    const l = raw.trim(); let m;
    if (!l) { flush(); continue; }
    if ((m = l.match(/^(#{2,4})\s+(.+)/))) { flush(); const n = Math.min(m[1].length, 4); out.push(`<h${n}>${inl(m[2])}</h${n}>`); continue; }
    if ((m = l.match(/^#\s+(.+)/))) { flush(); out.push(`<h2>${inl(m[1])}</h2>`); continue; }
    if ((m = l.match(/^[-*•]\s+(.+)/))) { if (para.length) { const p = para; para = []; out.push(`<p>${inl(p.join(' '))}</p>`); } if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', i: [] }; } list.i.push(m[1]); continue; }
    if ((m = l.match(/^\d+[.)]\s+(.+)/))) { if (para.length) { const p = para; para = []; out.push(`<p>${inl(p.join(' '))}</p>`); } if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', i: [] }; } list.i.push(m[1]); continue; }
    if (list) flush(); para.push(l);
  }
  flush(); return out.join('\n');
}

export function blogList({ posts }) {
  posts = posts.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill"><i></i>Blog</div><h1 class="s">Consejos para <span class="gr">comprar bien tu coche</span></h1>
<div class="grid" style="margin-top:36px">${posts.map((p) => `<a class="card" href="${B}/blog/${p.slug}">${p.cover ? `<div class="ph"><img src="${esc(p.cover)}" alt="${esc(p.title)}" loading="lazy" width="400" height="300"></div>` : ''}<div class="b"><div class="br">${fechaLarga(p.publishedAt)}</div><div class="md"><b>${esc(p.title)}</b></div><p class="mu" style="margin:0;font-size:14px">${esc(p.excerpt)}</p></div></a>`).join('') || '<p class="mu">Pronto publicaremos los primeros artículos.</p>'}</div></div></section>`;
  return page({ title: 'Blog | Plata Garage', desc: 'Guías y consejos para comprar un coche de segunda mano en Sabadell.', on: 'blog', body });
}

export function blogPost({ post: p, cars }) {
  const ldA = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.publishedAt, dateModified: p.updated || p.publishedAt, image: p.cover || undefined, publisher: { '@id': '#negocio' } };
  const body = `<div class="w"><div class="crumb"><a href="${B}/blog/">${ic.back}Volver al blog</a></div><article class="post" style="padding:30px 0 60px"><p class="note">${fechaLarga(p.publishedAt)}${p.tags?.length ? ' · ' + p.tags.map(esc).join(' · ') : ''}</p><h1 class="s">${esc(p.title)}</h1>${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" style="margin:24px 0">` : ''}${md(p.body)}</article>
<section style="padding:0 0 80px"><h2 style="font-size:30px;margin-bottom:24px">Coches en stock</h2><div class="grid">${cars.slice(0, 3).map(card).join('')}</div></section></div>`;
  return page({ title: `${p.title} | Plata Garage`, desc: p.excerpt || p.title, on: 'blog', body, head: ld(ldA) });
}

export function notFound(msg = 'Esta página no existe o el coche ya no está disponible.') {
  return page({ title: 'Página no encontrada | Plata Garage', desc: msg, body: `<section><div class="w"><div class="cta"><h2>Vaya…</h2><p class="lead">${esc(msg)}</p><div class="row"><a class="btn" href="${B}/vehiculos/">Ver coches en stock</a></div></div></div></section>` });
}

export function adminShell() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Backoffice · Plata Garage</title><link rel="icon" href="${B}/assets/logo.png"><link rel="stylesheet" href="${B}/assets/admin.css?v=1"></head><body><div id="app"></div><script src="${B}/assets/admin.js?v=1"></script></body></html>`;
}
