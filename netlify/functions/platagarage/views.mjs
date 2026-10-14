// Plantillas HTML de la web pública y del panel de Plata Garage
import { ZONAS, ZONAS_VENTA, TIPOS, FAQ, marcas, tiposConStock, slugBrand } from './seo.mjs';
const B = ''; // páginas en la raíz del dominio
const ST = '/platagarage'; // archivos estáticos (logo, fotos, css)
// Contexto por petición: dominio público (para enlaces absolutos) y si la web se deja indexar
let CTX = { site: '', index: false };
export const setCtx = (c) => { CTX = { ...CTX, ...c }; };
const abs = (u) => (!u ? '' : u.startsWith('http') ? u : CTX.site + u);
const WA = '34660493228';
const TEL = '+34 660 49 32 28';
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => (n == null ? '' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n) + ' €');
const kms = (n) => (n == null ? '' : new Intl.NumberFormat('es-ES',{useGrouping:'always'}).format(n) + ' km');
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
// Netlify Image CDN: convierte a WebP/AVIF y ajusta el tamaño al vuelo
export const srcset = (u, ws) => (!u || !u.startsWith('/') || process.env.PG_NO_CDN ? '' : ws.map((w) => `${im(u, w)} ${w}w`).join(', '));
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

const CSS = `@font-face{font-family:Inter;font-weight:100 900;font-display:swap;src:url(${ST}/assets/inter-latin.woff2) format('woff2')}
@font-face{font-family:'Space Grotesk';font-weight:300 700;font-display:swap;src:url(${ST}/assets/space-grotesk-latin.woff2) format('woff2')}
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
.hero .bg{position:absolute;inset:0}.hero .bg img{width:100%;height:100%;object-fit:cover;display:block}
.hero .bg:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(5,5,5,.85) 0%,rgba(5,5,5,.45) 45%,rgba(5,5,5,.08) 100%),linear-gradient(0deg,#050505 0%,rgba(5,5,5,.55) 30%,transparent 60%),radial-gradient(55% 55% at 0% 60%,rgba(247,104,6,.18),transparent 70%)}
@media(max-width:700px){section.hero{align-items:flex-start}section.hero .bg{bottom:auto;height:100svh;max-height:900px}section.hero .bg img{object-position:50% 50%}section.hero .bg:after{background:linear-gradient(0deg,#050505 0%,rgba(5,5,5,.7) 50%,rgba(5,5,5,.2) 100%),linear-gradient(90deg,rgba(5,5,5,.8) 0%,rgba(5,5,5,0) 50%)}}
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
.slots{display:flex;flex-wrap:wrap;gap:8px}.slots button{background:var(--bg);border:1px solid var(--line);color:#fff;border-radius:999px;padding:8px 14px;cursor:pointer;font:500 14px Inter,sans-serif}.slots button.on{background:var(--or);border-color:var(--or);color:#000}.slots button.otra{border-style:dashed;color:#cfcfcf}.slots button.otra.on{color:#000}#hfx select{width:100%;max-width:240px}
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
.pkr{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}.pkv{display:flex;gap:12px;align-items:center}.pkv img{width:96px;height:72px;object-fit:cover;border-radius:10px}.pkv b{display:block}.pkv span{color:var(--mu);font-size:13px}@media(max-width:700px){.pkr{grid-template-columns:1fr}}
.legal h2{font-size:22px;margin:28px 0 8px}.legal p,.legal li{color:#d6d6d6}
@media(max-width:900px){.cg,.v3,.ic3{grid-template-columns:1fr}.al{bottom:84px}}
.fl2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:22px 0}.fl2 div{display:flex;flex-wrap:wrap;gap:6px 14px;align-content:flex-start}.fl2 b{width:100%;color:#ddd;font-weight:600;margin-bottom:2px}.fl2 a{font-size:13px;text-decoration:none}.fl2 a:hover{color:#fff}
.faq{max-width:860px}.faq h2{font-size:clamp(26px,3vw,36px);margin-bottom:18px}.faq details{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:0 20px;margin-bottom:10px}.faq summary{cursor:pointer;padding:16px 0;font-weight:600;list-style:none;display:flex;justify-content:space-between;gap:12px}.faq summary:after{content:"+";color:var(--or);font-size:20px;line-height:1}.faq details[open] summary:after{content:"–"}.faq summary::-webkit-details-marker{display:none}.faq p{margin:0 0 16px;color:#d6d6d6}
.qs{display:flex;gap:10px;margin:22px 0 0;max-width:760px}.qs input{flex:1;padding:14px 20px;font-size:16px}.chipl{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 0}.chipl a.on{background:var(--or);color:#050505;border-color:var(--or)}.chipl a{border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-size:13px;color:#ddd;text-decoration:none}.chipl a:hover{border-color:var(--or);color:#fff}
.lh p.lead{max-width:760px}
@media(max-width:700px){.fl2{grid-template-columns:1fr}.qs{flex-direction:column}}
.tag.rb{background:#ef4444;color:#fff}.tag.nw{background:#22c55e;color:#04210f}.card .pr s,.pz s{color:#bbb;font-weight:500;font-size:.6em;margin-right:12px}
.fv{position:absolute;right:12px;top:12px;width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,.55);display:grid;place-items:center;cursor:pointer;color:#fff;backdrop-filter:blur(6px)}.fv svg{width:18px;height:18px}.fv.on{color:#ef4444}.fv.on svg{fill:#ef4444}
.hf{position:relative;display:grid;place-items:center;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);color:#fff;text-decoration:none}.hf svg{width:18px;height:18px}.hf b{position:absolute;top:-4px;right:-4px;background:var(--or);color:#000;border-radius:999px;font-size:11px;min-width:18px;height:18px;display:none;place-items:center;padding:0 4px}.hf b.on{display:grid}
.cmp{overflow-x:auto}.cmp table td,.cmp table th{padding:12px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;font-size:15px}.cmp th{color:var(--mu);font-weight:500;width:170px}.cmp img{border-radius:12px;aspect-ratio:4/3;object-fit:cover;width:100%;max-width:260px}
.cb{position:fixed;left:16px;right:16px;bottom:16px;z-index:95;max-width:640px;margin:0 auto;background:#111;border:1px solid var(--line);border-radius:18px;padding:18px 20px;box-shadow:0 20px 50px rgba(0,0,0,.6);display:none}.cb.on{display:block}.cb p{margin:0 0 12px;font-size:14px;color:#ddd}.cb .row .btn{flex:1;padding:11px 16px}.cb a{color:var(--or)}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}`;

const LD_BIZ = { '@context': 'https://schema.org', '@type': ['AutoDealer', 'LocalBusiness'], '@id': '#negocio', name: 'Plata Garage', telephone: TEL, image: `${ST}/assets/logo.png`, address: { '@type': 'PostalAddress', addressLocality: 'Sabadell', addressRegion: 'Barcelona', addressCountry: 'ES' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:30', closes: '19:30' }, { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '10:00', closes: '14:00' }], description: 'Compraventa de vehículos de ocasión en Sabadell. Atención con cita previa.' };
const ldBiz = () => ({ ...LD_BIZ, '@id': `${CTX.site}${B}/#negocio`, url: `${CTX.site}${B}/`, image: abs(`${ST}/assets/logo.png`), logo: abs(`${ST}/assets/logo.png`), areaServed: ZONAS.map((z) => ({ '@type': 'City', name: z.name })), sameAs: ['https://www.instagram.com/platagarage/'], hasMap: undefined, contactPoint: { '@type': 'ContactPoint', telephone: TEL, contactType: 'sales', availableLanguage: ['es', 'ca'] } });
const ldWeb = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${CTX.site}${B}/#web`, url: `${CTX.site}${B}/`, name: 'Plata Garage', inLanguage: 'es', publisher: { '@id': `${CTX.site}${B}/#negocio` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${CTX.site}${B}/vehiculos/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } });
const ldFaq = (list) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const faqLink = (l) => !l ? '' : `<p><a class="btn g sm" href="${esc(l[1].startsWith('wa:') ? wa(l[1].slice(3)) : B + l[1])}"${l[1].startsWith('wa:') ? ' rel="noopener"' : ''}>${esc(l[0])}</a></p>`;
const faqHtml = (list, title = 'Preguntas frecuentes') => `<div class="faq">${title ? `<h2>${title}</h2>` : ''}${list.map(([q, a, l]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p>${faqLink(l)}</details>`).join('')}</div>`;
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

function page({ title, desc, on = '', body, head = '', script = '', car = '', alert = false, path = '', image = '', noindex = false }) {
  const canon = path ? `${CTX.site}${B}${path}` : '';
  const ads = !!(CTX.gtag || CTX.pixel || CTX.clarity);
  const ogImg = abs(image || `${ST}/assets/hero.jpg`);
  const meta = `<meta name="robots" content="${CTX.index && !noindex ? 'index,follow,max-image-preview:large' : 'noindex,nofollow'}">${canon ? `<link rel="canonical" href="${esc(canon)}">` : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="Plata Garage"><meta property="og:locale" content="es_ES"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">${canon ? `<meta property="og:url" content="${esc(canon)}">` : ''}<meta property="og:image" content="${esc(ogImg)}"><meta name="twitter:card" content="summary_large_image">`;
  const n = (h, t, k) => `<a href="${B}${h}"${on === k ? ' class="on" aria-current="page"' : ''}>${t}</a>`;
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${meta}<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#050505"><link rel="icon" href="${ST}/assets/logo.png"><link rel="preload" as="font" type="font/woff2" crossorigin href="${ST}/assets/space-grotesk-latin.woff2"><style>${CSS}</style>${ld(ldBiz())}${head}</head><body${car ? ` data-car="${esc(car)}"` : ''}>
<header><div class="w"><a class="lg" href="${B}/"><img src="${im(ST + '/assets/logo.png', 220)}" alt="Plata Garage" width="103" height="40"></a><nav class="m" aria-label="Principal">${n('/', 'Inicio', 'home')}${n('/vehiculos/', 'Vehículos', 'veh')}${n('/cita', 'Reservar cita', 'cita')}${n('/blog/', 'Blog', 'blog')}${n('/contacto', 'Contacto', 'con')}</nav>
<div class="hr"><a class="hf" href="${B}/favoritos" aria-label="Mis favoritos" title="Mis favoritos">${heart}<b id="fvn"></b></a><a class="tel" href="tel:+34660493228">${ic.tel}${TEL}</a><a class="btn sm" href="${B}/cita">Reservar cita</a></div></div></header>
<main>${body}</main>
<footer><div class="w"><img src="${im(ST + '/assets/logo.png', 220)}" alt="Plata Garage" width="92" height="36"><p>Plata Garage · Compraventa de vehículos de ocasión en Sabadell (Barcelona). Atendemos con cita previa.</p>
<nav><a href="${B}/vehiculos/">Vehículos</a><a href="${B}/cita">Reservar cita</a><a href="${B}/te-lo-buscamos">Te lo buscamos</a><a href="${B}/cuanto-vale-mi-coche">¿Cuánto vale mi coche?</a><a href="${B}/contacto">Contacto</a><a href="${B}/blog/">Blog</a><a href="${B}/aviso-legal">Aviso legal</a><a href="${B}/privacidad">Privacidad</a><a href="${B}/cookies">Cookies</a><a href="${B}/condiciones-de-contratacion">Condiciones de contratación</a>${ads ? '<a href="#" id="ckc">Configurar cookies</a>' : ''}</nav>
<div class="fl2"><div><b>Coches por zona</b>${ZONAS.map((z) => `<a href="${B}/coches-segunda-mano-${z.slug}">${esc(z.name)}</a>`).join('')}</div><div><b>Por tipo</b>${FOOT_TIPOS.map(([sl, t]) => `<a href="${B}/coches/${sl}">${t}</a>`).join('')}<a href="${B}/preguntas-frecuentes">Preguntas frecuentes</a></div></div>
<p>La información de esta web es orientativa y no vinculante. Puede contener errores: confirma los datos del vehículo antes de decidir.</p></div><div style="display:flex;justify-content:center;padding:22px 16px 96px;border-top:1px solid rgba(255,255,255,.1);margin-top:22px"><a href="https://www.rotulito.com/" target="_blank" rel="noopener" aria-label="Web hecha por Rotulito" style="display:inline-flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-size:15px;opacity:.92"><span>Web hecha por</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3140 1020" aria-hidden="true" focusable="false" style="height:30px;width:auto;display:block"><path fill="currentColor" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M502 942 c-18 -1 -64 -8 -81 -11 -3 -1 -7 -1 -8 -2 -15 -2 -52 -11 -61 -14 -1 0 -5 -1 -7 -2 -2 -1 -5 -2 -6 -2 -1 -1 -3 -1 -3 -1 -1 0 -26 -7 -29 -9 -2 0 -4 -1 -6 -2 -3 -1 -5 -2 -6 -2 -2 0 -5 -2 -9 -3 -4 -1 -7 -3 -8 -3 -2 0 -5 -2 -8 -3 -4 -1 -7 -3 -8 -3 -2 0 -7 -2 -12 -4 -10 -4 -12 -5 -20 -9 -3 -1 -5 -2 -5 -2 -1 0 -3 -1 -6 -2 -2 -1 -5 -3 -6 -3 -2 0 -8 -3 -14 -6 -6 -3 -15 -8 -20 -10 -5 -2 -12 -6 -17 -9 -5 -2 -11 -6 -14 -7 -3 -2 -7 -4 -10 -6 -2 -2 -4 -3 -5 -3 0 0 -14 -8 -18 -12 -34 -26 -44 -35 -50 -48 -6 -12 -7 -29 -2 -41 16 -39 30 -44 66 -26 13 7 15 8 33 18 5 3 16 9 24 13 7 4 14 8 15 8 0 1 1 1 2 1 0 -1 -7 -34 -11 -49 -3 -10 -5 -21 -13 -56 -4 -19 -15 -72 -19 -89 -1 -5 -4 -19 -6 -31 -5 -22 -15 -74 -18 -92 -1 -12 -7 -47 -8 -55 0 -4 -1 -8 -1 -9 -1 -1 -2 -10 -3 -20 -1 -10 -3 -23 -4 -29 0 -7 -1 -17 -2 -22 -1 -6 -1 -12 -1 -13 -3 -26 -3 -71 -1 -85 6 -26 27 -48 52 -54 2 -1 6 -2 7 -2 5 -2 19 -1 27 2 10 5 19 16 22 29 3 10 5 21 8 33 1 7 2 14 3 16 3 12 5 23 16 85 1 8 3 17 3 19 1 8 3 16 4 24 1 3 1 9 2 12 1 3 2 9 2 13 1 4 2 10 2 13 0 3 1 9 2 13 1 9 2 16 4 25 1 4 3 13 4 21 1 8 3 16 3 19 1 2 1 5 1 7 0 9 7 13 13 9 3 -2 10 -11 13 -16 1 -2 4 -7 6 -10 6 -10 12 -21 24 -45 8 -14 12 -22 18 -31 2 -4 6 -12 9 -18 6 -12 12 -21 23 -38 15 -23 22 -32 31 -44 4 -5 11 -13 16 -20 5 -6 11 -13 14 -17 3 -3 8 -9 11 -13 10 -12 37 -40 49 -50 6 -6 13 -12 15 -13 6 -6 12 -11 18 -15 3 -2 6 -4 6 -4 0 0 3 -2 6 -4 2 -2 5 -4 7 -5 9 -9 53 -31 75 -37 24 -8 54 -9 75 -3 2 1 6 2 8 3 2 1 5 2 6 2 0 0 3 2 7 3 28 10 47 30 43 44 -3 10 -8 14 -21 17 -12 3 -27 7 -29 8 -2 0 -5 2 -8 3 -15 5 -32 15 -47 25 -23 16 -29 20 -45 35 -30 27 -46 46 -75 85 -7 8 -14 18 -16 20 -7 10 -17 25 -63 94 -31 47 -42 62 -58 78 l-7 8 17 8 c9 5 19 10 23 11 10 5 33 16 40 21 4 2 13 7 21 11 20 11 17 9 44 27 2 1 7 4 9 5 6 4 26 19 31 23 2 2 4 4 6 5 11 8 47 42 55 53 3 3 7 8 10 12 31 37 50 85 50 126 0 44 -28 87 -67 107 -15 8 -17 9 -41 15 -18 5 -71 8 -98 5z m80 -94 c8 -2 12 -6 14 -10 2 -10 -13 -34 -39 -63 -10 -11 -37 -36 -49 -46 -4 -3 -12 -10 -20 -16 -7 -6 -16 -13 -21 -16 -4 -4 -11 -9 -15 -12 -4 -4 -11 -9 -15 -11 -3 -3 -9 -7 -12 -10 -8 -6 -22 -16 -24 -18 -16 -11 -36 -24 -40 -27 -3 -3 -6 -5 -7 -5 -4 -3 -40 -28 -47 -33 -11 -7 -11 -7 -8 8 1 7 6 38 7 43 1 2 1 8 2 12 0 3 2 10 2 14 1 3 2 10 3 15 1 7 2 13 4 18 0 1 1 5 1 8 1 8 7 37 8 42 3 15 -2 28 -16 38 -5 4 -5 4 2 7 4 1 10 4 14 6 6 3 16 6 38 15 3 0 8 2 12 3 3 2 11 4 17 6 12 5 48 15 61 18 10 2 14 3 20 5 2 1 5 1 6 1 1 0 4 1 7 1 5 2 29 6 43 7 6 1 12 1 12 2 1 1 33 -1 40 -2z"/><path fill="currentColor" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M1717 938 c-4 0 -6 -1 -12 -4 -11 -5 -18 -16 -23 -33 -2 -5 -5 -15 -8 -23 -2 -8 -5 -18 -6 -21 -1 -4 -3 -11 -4 -15 -3 -12 -4 -13 -9 -33 -3 -11 -5 -22 -6 -25 -1 -4 -2 -9 -3 -11 -2 -9 -18 -77 -20 -88 -2 -10 -6 -33 -9 -49 -2 -10 -3 -19 -4 -22 -1 -2 -1 -5 -1 -7 0 -1 -1 -7 -2 -12 -1 -5 -2 -14 -3 -18 -1 -5 -2 -12 -2 -14 -1 -3 -1 -9 -2 -14 -2 -20 -3 -25 -4 -30 -2 -9 -9 -97 -9 -106 0 -9 -18 -50 -37 -82 -2 -5 -5 -10 -6 -11 -1 -2 -4 -7 -7 -11 -2 -4 -8 -12 -12 -18 -8 -12 -27 -32 -30 -32 -7 2 -6 76 2 113 1 2 2 7 2 10 2 16 3 20 4 24 0 2 1 8 2 13 1 5 2 12 2 16 4 16 11 47 12 55 0 1 1 6 2 11 1 4 3 11 3 15 1 3 3 11 4 16 1 5 3 12 3 15 0 3 2 10 3 16 3 21 -4 34 -23 44 -14 6 -17 7 -33 7 -26 0 -31 -5 -44 -41 -2 -4 -4 -12 -7 -17 -2 -6 -4 -12 -5 -14 -2 -9 -23 -58 -31 -76 -1 -3 -4 -9 -6 -14 -8 -17 -28 -59 -38 -76 -3 -4 -5 -8 -5 -10 -15 -28 -54 -79 -59 -77 -2 1 -2 3 -4 17 0 6 3 41 5 54 0 2 1 8 2 12 1 10 5 32 6 39 1 3 2 14 4 24 2 11 4 22 5 26 1 8 5 32 7 45 1 4 2 11 2 13 3 9 2 30 -1 35 -10 20 -43 36 -69 34 -17 -1 -23 -8 -29 -32 -6 -21 -7 -26 -9 -36 -2 -6 -4 -17 -5 -24 -2 -7 -5 -23 -7 -34 -2 -12 -4 -24 -4 -26 -4 -33 -4 -33 -19 -61 -8 -16 -17 -32 -24 -42 -2 -3 -5 -9 -9 -13 -18 -29 -55 -67 -61 -63 -7 4 -6 65 1 116 1 4 1 9 1 12 1 2 1 6 1 8 1 1 1 6 2 10 1 3 1 9 2 12 1 4 6 32 7 43 1 1 1 4 2 7 2 7 3 12 4 18 1 4 2 10 3 15 1 5 3 13 4 20 3 13 10 41 14 54 1 5 3 14 5 21 5 18 13 44 14 45 0 1 7 3 16 5 8 2 17 5 21 5 3 1 9 3 13 4 4 1 17 5 28 8 11 3 22 6 25 7 15 4 24 7 42 16 16 7 24 17 26 29 1 10 -3 17 -12 20 -7 3 -42 2 -64 -1 -4 -1 -11 -1 -16 -2 -6 0 -20 -2 -31 -4 -11 -2 -21 -3 -21 -3 0 1 4 14 10 27 7 20 8 22 9 31 0 8 0 9 -2 14 -9 19 -41 38 -66 39 -20 1 -26 -3 -32 -20 -2 -6 -5 -13 -7 -17 -4 -10 -8 -22 -10 -28 -1 -4 -8 -21 -12 -31 0 -2 -1 -4 -2 -6 -1 -2 -2 -5 -2 -6 -2 -3 -2 -5 -5 -12 -6 -18 -6 -18 -9 -19 -1 0 -5 -1 -9 -2 -4 -1 -8 -2 -10 -3 -2 -1 -8 -2 -13 -4 -6 -2 -12 -4 -14 -4 -2 -1 -4 -2 -5 -2 -2 0 -9 -3 -16 -5 -7 -2 -17 -5 -21 -7 -5 -2 -20 -7 -33 -11 -26 -9 -29 -10 -31 -16 -2 -3 -2 -14 0 -18 0 -1 2 -4 3 -6 12 -25 32 -30 80 -17 2 0 8 2 15 4 6 1 14 3 18 4 10 3 11 3 11 0 -2 -6 -4 -13 -6 -18 -3 -15 -5 -22 -7 -29 -1 -4 -3 -10 -3 -12 -1 -2 -2 -6 -2 -8 -2 -9 -3 -13 -8 -36 l-5 -25 -6 -9 c-13 -22 -45 -58 -51 -58 0 0 -1 4 0 18 1 49 -10 87 -34 111 -11 12 -17 16 -39 26 -3 2 -8 5 -10 7 -20 17 -39 24 -60 21 -9 -1 -21 -4 -25 -6 -38 -16 -63 -37 -91 -72 -10 -13 -29 -46 -34 -58 0 -2 -2 -7 -4 -10 -21 -58 -23 -121 -4 -162 20 -44 61 -75 112 -85 69 -14 144 48 174 146 4 11 4 11 15 19 10 6 26 17 29 19 0 1 3 4 7 7 3 2 6 5 7 6 2 3 4 3 4 0 -1 -3 -3 -64 -3 -73 4 -64 14 -94 38 -118 29 -29 62 -37 89 -23 13 7 35 25 46 41 9 11 22 30 25 36 2 3 5 9 7 13 3 3 7 12 10 18 6 14 6 14 8 7 5 -20 12 -40 19 -49 24 -38 65 -54 100 -41 27 11 53 38 76 80 4 8 7 14 8 14 0 0 1 -4 1 -9 1 -18 5 -36 10 -48 11 -28 27 -45 52 -55 34 -14 71 -1 96 33 19 24 35 54 40 69 2 5 4 5 4 1 0 -2 1 -12 3 -22 13 -75 42 -120 85 -129 11 -2 28 -1 37 2 33 12 45 52 14 50 -9 -1 -11 0 -16 6 -25 27 -32 157 -16 305 0 8 2 18 2 23 1 5 3 13 3 20 2 11 6 36 10 59 1 6 3 16 4 22 2 5 4 17 6 26 4 14 8 29 13 48 1 4 4 14 6 24 2 10 5 20 6 24 2 7 3 12 6 25 2 9 3 14 5 20 1 1 1 4 1 5 0 2 0 4 1 5 0 1 2 8 3 15 1 6 3 13 3 15 4 16 5 61 2 64 0 1 -1 2 -1 3 0 4 -7 15 -11 20 -11 10 -29 16 -44 13z m-891 -430 c13 -24 14 -81 2 -125 -4 -15 -5 -20 -9 -29 -17 -43 -41 -74 -63 -81 -10 -4 -16 2 -21 18 -4 13 -4 54 1 73 1 2 1 5 2 6 0 3 3 14 6 21 8 25 29 66 40 78 1 1 4 4 6 8 7 9 13 16 23 25 10 9 11 9 13 6z"/><path fill="currentColor" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M2134 868 c-8 -1 -15 -5 -18 -10 -4 -4 -16 -28 -16 -29 0 -1 -2 -5 -4 -10 -6 -13 -10 -21 -10 -22 0 0 -1 -2 -2 -4 -1 -3 -2 -6 -3 -8 -1 -4 -3 -7 -6 -14 -2 -4 -6 -16 -11 -27 0 -3 -2 -6 -2 -7 -1 -2 -3 -7 -5 -12 -2 -5 -4 -9 -4 -10 -4 -9 -7 -19 -7 -20 0 -2 -3 -3 -14 -7 -11 -4 -26 -9 -29 -11 -2 0 -7 -3 -13 -5 -7 -2 -15 -6 -20 -8 -4 -2 -8 -4 -9 -4 -2 0 -41 -20 -45 -23 -18 -17 3 -60 28 -59 7 1 18 4 30 8 4 2 12 4 17 6 4 1 11 3 14 4 3 1 6 2 6 2 0 -1 -2 -8 -8 -28 -14 -46 -27 -103 -32 -141 -2 -11 -9 -28 -24 -54 -9 -15 -30 -47 -34 -52 -1 -2 -4 -5 -6 -8 -15 -19 -40 -40 -48 -40 -7 0 -11 42 -6 68 1 3 1 11 2 17 1 10 2 18 5 37 1 3 3 14 5 25 3 17 6 29 14 66 7 34 8 38 9 50 0 17 -2 25 -12 36 -12 14 -46 26 -59 21 -7 -3 -9 -4 -12 -7 -5 -6 -19 -43 -25 -67 -1 -4 -2 -8 -3 -10 -1 -2 -2 -8 -3 -13 -2 -6 -3 -11 -3 -12 -1 -2 -4 -14 -5 -20 -1 -3 -2 -10 -3 -16 -4 -21 -7 -43 -10 -66 -2 -14 -2 -72 0 -84 6 -41 23 -67 57 -84 47 -24 92 -6 129 50 2 4 6 9 8 13 5 6 16 28 18 33 3 6 3 4 5 -10 5 -52 19 -87 45 -112 9 -10 16 -14 37 -23 12 -5 37 -9 47 -6 36 11 55 28 85 75 2 3 5 8 7 13 4 7 7 10 7 7 0 -2 10 -14 18 -22 39 -36 99 -48 144 -29 21 9 30 15 51 34 36 32 69 101 76 160 0 7 2 16 2 21 4 33 -4 81 -18 108 -18 34 -36 49 -69 57 -5 1 -11 4 -15 6 -7 4 -12 7 -19 10 -28 12 -69 -1 -108 -32 -18 -15 -19 -16 -30 -30 -19 -23 -29 -39 -41 -67 -8 -17 -9 -22 -17 -52 -3 -17 -6 -52 -5 -66 0 -5 0 -8 -1 -10 -2 -4 -16 -32 -19 -37 -1 -2 -5 -8 -8 -14 -22 -36 -51 -66 -62 -60 -15 7 -14 112 1 189 0 2 2 9 3 15 1 5 3 14 4 19 2 8 3 14 7 30 0 2 2 7 3 11 1 4 3 12 4 18 2 5 3 11 4 13 1 1 3 9 5 16 5 16 17 53 23 72 3 7 5 14 5 16 1 1 2 2 4 2 1 1 6 2 10 3 4 1 10 3 12 3 6 2 10 2 22 5 5 2 13 4 18 4 4 1 10 3 13 3 5 2 35 8 55 11 16 3 23 5 30 11 14 13 8 44 -10 52 -14 7 -35 6 -99 -2 -9 -1 -17 -2 -18 -3 -2 0 -3 2 -1 3 0 1 3 5 5 11 2 5 7 17 11 26 21 49 22 56 15 70 -10 21 -47 41 -69 37z m244 -343 c13 -19 16 -77 6 -119 -5 -21 -11 -38 -17 -53 -1 -2 -3 -6 -4 -8 -9 -24 -32 -59 -47 -72 -27 -23 -42 -16 -49 21 -2 17 0 46 6 67 0 1 2 6 3 10 6 21 20 57 27 69 0 1 3 5 5 10 4 7 7 13 17 27 11 15 46 50 51 51 0 0 1 -1 2 -3z"/><path fill="#d83d2a" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M1869 805 c-29 -9 -57 -43 -62 -77 -5 -26 0 -44 14 -58 14 -14 32 -19 51 -14 45 11 80 83 59 120 -14 24 -39 36 -62 29z"/><path fill="currentColor" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M2660 405 c-22 -8 -44 -30 -59 -57 -2 -4 -5 -9 -6 -11 -12 -22 -18 -60 -13 -83 8 -34 40 -54 71 -47 1 1 4 1 6 2 5 1 17 7 22 11 3 2 5 4 6 4 3 0 28 29 31 36 3 4 4 3 4 -3 2 -13 19 -35 33 -41 33 -16 69 2 89 45 9 18 12 28 15 45 1 8 1 38 0 44 -3 15 -12 31 -21 37 -4 3 -15 7 -18 7 -1 0 -3 1 -6 2 -30 15 -73 -18 -89 -69 -2 -6 -4 -12 -4 -12 0 -4 -11 -21 -19 -29 -30 -33 -43 -42 -58 -42 -23 0 -14 64 15 108 10 14 12 15 12 6 0 -15 8 -25 19 -21 9 3 14 13 14 31 0 22 -6 31 -25 39 -5 2 -12 1 -19 -2z m150 -45 c8 -14 4 -57 -8 -83 -7 -16 -20 -30 -24 -27 -3 3 -7 23 -5 32 0 3 1 9 2 13 4 23 14 45 29 63 4 5 4 5 6 2z"/><path fill="currentColor" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M2899 403 c-6 -2 -8 -5 -12 -14 -2 -4 -7 -26 -8 -34 -1 -5 -1 -11 -2 -15 -4 -25 -5 -86 -2 -100 3 -15 9 -21 20 -21 12 0 15 4 21 28 7 28 15 55 22 73 2 5 3 10 4 11 0 0 0 1 1 1 1 0 1 -10 1 -27 1 -38 3 -48 9 -56 8 -9 21 -9 29 -1 4 4 11 20 21 50 2 4 4 10 4 11 1 1 1 3 2 4 0 1 1 4 2 5 0 1 2 5 3 8 1 3 4 9 6 12 2 4 4 8 4 8 0 1 1 1 1 1 1 0 1 -7 1 -34 0 -56 4 -76 19 -92 13 -14 34 -15 44 -2 2 2 3 5 3 5 0 1 0 2 1 3 4 2 -1 12 -7 12 -3 0 -7 4 -8 8 -4 10 -4 11 -5 58 0 46 0 54 -4 63 -7 23 -31 33 -53 23 -8 -3 -21 -19 -28 -33 -3 -8 -4 -9 -5 -3 -2 21 -9 34 -20 37 -13 5 -28 -3 -37 -19 -4 -7 -5 -6 -3 10 1 12 0 16 -6 20 -4 3 -13 3 -18 0z"/><path fill="#d83d2a" transform="translate(0.000000,1020.000000) scale(1.000000,-1.000000)" d="M2511 284 c-19 -7 -34 -29 -35 -50 -2 -47 58 -45 74 2 10 32 -12 59 -39 48z"/></svg></a></div></footer>
<a class="wf" href="${wa('Hola, quería información sobre un coche.')}" rel="noopener" aria-label="Escribir por WhatsApp">${ic.wa}</a>
${alert ? ALERT_HTML : ''}${ads ? COOKIE_HTML() : ''}<script>${TRACK_JS}${FAV_JS}${ads ? cookieJs() : 'window.pgConv=()=>{};'}${alert ? ALERT_JS : ''}${script || ''}</script></body></html>`;
}

const FOOT_TIPOS = [['automaticos', 'Automáticos'], ['diesel', 'Diésel'], ['gasolina', 'Gasolina'], ['suv', 'SUV'], ['familiares', 'Familiares'], ['compactos', 'Compactos'], ['menos-de-10000', 'Menos de 10.000 €'], ['menos-de-15000', 'Menos de 15.000 €']];
const normTxt = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
// Rebaja: solo si el precio actual es más bajo que el más bajo de los 30 días anteriores a la bajada (regla de precios de referencia), y se muestra 30 días
const DAY = 864e5;
export function rebaja(c) {
  const ph = (c.priceHistory || []).filter((x) => x && x.d && x.p); if (ph.length < 2) return null;
  const last = ph[ph.length - 1]; if (last.p !== c.price) return null;
  const t = Date.parse(last.d); if (Date.now() - t > 30 * DAY) return null;
  const desde = t - 30 * DAY; const prev = ph.slice(0, -1);
  const base = [...prev].reverse().find((x) => Date.parse(x.d) <= desde);
  const ref = [...prev.filter((x) => Date.parse(x.d) > desde), ...(base ? [base] : [])].map((x) => x.p);
  if (!ref.length) return null; const antes = Math.min(...ref);
  return c.price < antes ? { antes } : null;
}
const tagDe = (c) => c.status === 'reservado' ? '<span class="tag r">Reservado</span>' : c.status === 'preparacion' ? '<span class="tag">Próximamente</span>' : '';
const heart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>';
const cover = (c) => (c.images && c.images[0]) || `${ST}/assets/logo.png`;
export function card(c) {
  const tag = tagDe(c);
  return `<a class="card" href="${B}/vehiculos/${c.slug}" data-p="${c.price}" data-f="${esc(c.fuel)}" data-t="${esc(c.trans)}" data-y="${c.year}" data-k="${c.km}" data-m="${esc(c.brand)}" data-c="${esc(c.body)}" data-s="${c.created || ''}" data-e="${c.seats || ''}" data-x="${esc(normTxt([c.brand, c.model, c.version, c.color, c.body, c.etiqueta].join(' ')))}">
<div class="ph"><img src="${esc(im(cover(c), 600))}" srcset="${esc(srcset(cover(c), [400, 600, 800]))}" sizes="(max-width:700px) 92vw, (max-width:980px) 46vw, 380px" alt="${esc(carName(c) + ' ' + c.year)}" loading="lazy" width="400" height="300">${tag}<span class="fv" role="button" tabindex="0" data-fav="${c.slug}" aria-label="Guardar en favoritos" title="Guardar en favoritos">${heart}</span><span class="pr">${eur(c.price)}</span></div>
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
b.disabled=true;try{const fd=new FormData(f);fd.append('origen',location.pathname);fd.append('canal',window.pgSrc||'');const r=await fetch(f.dataset.api,{method:'POST',body:fd});const j=await r.json();if(!r.ok)throw new Error(j.error||'Error');try{pgConv('lead',f.dataset.t)}catch(x){}setTimeout(()=>location.href='${B}/gracias?t='+encodeURIComponent(f.dataset.t)+(j.ref?'&r='+j.ref+'&k='+j.k:''),250)}catch(err){m.textContent=err.message;m.className='msg err';b.disabled=false}}));`;
const PICK_JS = `(()=>{const s=document.getElementById('pkc'),v=document.getElementById('pkv');if(!s)return;const d=()=>{const o=s.selectedOptions[0];v.innerHTML=o&&o.value?'<img alt="" src="'+o.dataset.i+'"><div><b>'+o.textContent.split(' · ')[0]+'</b><span>'+o.dataset.p+' · '+o.dataset.k+'</span></div>':''};s.onchange=d;d()})();`;
const SLOTS_JS = `(()=>{const cd=document.getElementById('cd');if(!cd)return;const cm=document.getElementById('cm'),fd=document.getElementById('fecha'),hh=document.getElementById('hora'),sl=document.getElementById('slots'),bp=document.querySelector('.ch .cp'),bn=document.querySelector('.ch .cn');
const MES=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];const now=new Date();let y=now.getFullYear(),m=now.getMonth();const y0=y,m0=m;
async function slots(d){hh.value='';sl.innerHTML='<span class="note">Cargando horas…</span>';const j=await fetch('${B}/api/slots?fecha='+d).then(r=>r.json()).catch(()=>({slots:[]}));
const fx=document.getElementById('flex');if(fx)fx.value='';sl.innerHTML=j.slots.length?'':'<span class="note">No quedan horas libres ese día.</span>';j.slots.forEach(h=>{const x=document.createElement('button');x.type='button';x.textContent=h;x.onclick=()=>{sl.querySelectorAll('button').forEach(z=>z.classList.remove('on'));x.classList.add('on');hh.value=h;if(fx)fx.value='';const o=document.getElementById('hfx');if(o)o.remove()};sl.appendChild(x)});
const ot=document.createElement('button');ot.type='button';ot.className='otra';ot.textContent='Proponer otra hora';ot.onclick=()=>{sl.querySelectorAll('button').forEach(z=>z.classList.remove('on'));ot.classList.add('on');hh.value='';if(document.getElementById('hfx'))return;const w=document.createElement('div');w.id='hfx';w.style.cssText='flex-basis:100%;margin-top:10px';const H=[];const hoy=new Date(),esHoy=fd.value===hoy.getFullYear()+'-'+String(hoy.getMonth()+1).padStart(2,'0')+'-'+String(hoy.getDate()).padStart(2,'0'),min=esHoy?hoy.getHours()*60+hoy.getMinutes()+60:0;for(let t=9*60;t<=20*60;t+=15)if(t>=min)H.push(String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'));
w.innerHTML='<label class="note" for="hfs" style="display:block;margin-bottom:6px">¿A qué hora te vendría bien?</label><select id="hfs"><option value="">Elige una hora</option>'+H.map(h=>'<option>'+h+'</option>').join('')+'</select><span class="note" style="display:block;margin-top:6px">Es una propuesta: te confirmamos por WhatsApp si podemos atenderte a esa hora.</span>';sl.appendChild(w);
w.querySelector('select').onchange=e=>{hh.value=e.target.value;if(fx)fx.value=e.target.value?'1':''}};sl.appendChild(ot)}
async function draw(){cm.textContent=MES[m]+' '+y;const mes=y+'-'+String(m+1).padStart(2,'0');bp.disabled=(y===y0&&m===m0);bn.disabled=((y-y0)*12+m-m0)>=2;cd.innerHTML='';
const j=await fetch('${B}/api/dias?mes='+mes).then(r=>r.json()).catch(()=>({dias:[]}));const av=new Set(j.dias);const first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
for(let i=0;i<first;i++){const e=document.createElement('button');e.type='button';e.className='ot';e.tabIndex=-1;cd.appendChild(e)}
for(let d=1;d<=n;d++){const iso=mes+'-'+String(d).padStart(2,'0');const e=document.createElement('button');e.type='button';e.textContent=d;if(av.has(iso)){e.className='av'+(fd.value===iso?' sel':'');e.setAttribute('aria-label','Elegir el '+d+' de '+MES[m]);e.onclick=()=>{fd.value=iso;cd.querySelectorAll('.sel').forEach(z=>z.classList.remove('sel'));e.classList.add('sel');slots(iso)}}else{e.disabled=true}cd.appendChild(e)}}
bp.onclick=()=>{m--;if(m<0){m=11;y--}draw()};bn.onclick=()=>{m++;if(m>11){m=0;y++}draw()};draw()})();`;

function citaForm({ cars, coche = '', motivo = '', inFicha = false }) {
  const mot = ['Ver un coche en concreto', 'Reservar este coche', 'Tasar mi coche', 'Información sobre financiación', 'Otro motivo'];
  const sel = cars.find((c) => c.slug === coche);
  const paso1 = sel ? `<input type="hidden" name="coche" value="${sel.slug}">${inFicha ? '' : `<div class="box pkv" style="padding:16px 20px;margin:0 0 24px"><img alt="" src="${esc(im(cover(sel), 200))}"><div><b>${esc(carName(sel))} (${sel.year})</b><span>${eur(sel.price)} · ${kms(sel.km)} · <a href="${B}/cita" style="color:var(--or)">cambiar</a></span></div></div>`}` : `<div class="box pk" style="padding:24px;margin:0 0 24px"><h3 style="margin:0 0 4px">1. ¿Qué coche quieres ver?</h3><p class="mu" style="margin:0 0 14px;font-size:14px">Así te lo tenemos preparado cuando llegues.</p>
<div class="pkr"><select name="coche" id="pkc" aria-label="Coche que quieres ver"><option value="">Aún no lo sé / quiero ver varios</option>${cars.map((c) => `<option value="${c.slug}" data-i="${esc(im(cover(c), 200))}" data-p="${eur(c.price)}" data-k="${kms(c.km)}"${c.slug === coche ? ' selected' : ''}>${esc(carName(c))} (${c.year}) · ${eur(c.price)}</option>`).join('')}</select><div class="pkv" id="pkv"></div></div></div>`;
  return `<form class="f" data-api="${B}/api/cita" data-t="cita" novalidate>${hp()}<input type="hidden" name="fecha" id="fecha"><input type="hidden" name="hora" id="hora"><input type="hidden" name="flex" id="flex">${paso1}
<div class="cg"><div class="box" style="padding:24px;margin:0"><div class="ch"><span>${ic.cal}${sel ? 'Elige una fecha' : '2. Elige día y hora'}</span><div><button type="button" class="cp" aria-label="Mes anterior">‹</button><b id="cm"></b><button type="button" class="cn" aria-label="Mes siguiente">›</button></div></div>
<div class="cw"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="cd" id="cd"></div>
<div class="ct"><span class="note" style="display:block;margin-bottom:8px">Horas disponibles</span><div class="slots" id="slots"><span class="note">Elige primero un día.</span></div></div></div>
<div class="box" style="padding:24px;margin:0;display:grid;gap:14px"><h3 style="margin:0">${sel ? 'Tus datos' : '3. Tus datos'}</h3>
<div class="f2"><label>Nombre completo *<input name="nombre" required minlength="2" maxlength="80" autocomplete="name" placeholder="Juan Pérez"></label><label>Teléfono *<input name="telefono" required type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="600 000 000"></label></div>
<label>Email *<input name="email" type="email" maxlength="200" autocomplete="email" required placeholder="tu@email.com"></label>
<label>Motivo de la visita *<select name="motivo">${mot.map((m) => `<option${m === motivo ? ' selected' : ''}>${m}</option>`).join('')}</select></label>
<label>Notas adicionales<textarea name="mensaje" maxlength="1000" placeholder="Cuéntanos cualquier detalle que debamos saber…"></textarea></label>${priv()}
<div class="msg" role="alert"></div><button class="btn" type="submit">Confirmar reserva</button><p class="note" style="margin:0">Te confirmamos la cita por WhatsApp o por teléfono.</p></div></div></form>`;
}
const INFO3 = `<div class="ic3"><div>${I('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>')}<p style="margin:0"><b>30 min de atención personal</b><span>Sin esperas: tu hora es tuya.</span></p></div><div>${I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>')}<p style="margin:0"><b>Sin compromiso</b><span>Visita gratuita e informativa.</span></p></div><div>${I('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>')}<p style="margin:0"><b>En Sabadell</b><span>Con cita previa.</span></p></div></div>`;

// Buscador escrito "a lo natural": convierte la frase en filtros con reglas
const NLQ_JS = `const NZ=s=>String(s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
const NUM=(x,k)=>{let n=+String(x).replace(/[.\\s]/g,'').replace(',','.');if(k)n*=1000;return n};
function nlq(q){q=' '+NZ(q)+' ';const o={};let m;
if((m=q.match(/(?:menos de|hasta|max(?:imo)?|<)\\s*([\\d.,]+)\\s*(k|mil)?\\s*(?:km|kilometros)/))){o.kmax=NUM(m[1],m[2]);q=q.replace(m[0],' ')}
if((m=q.match(/(?:menos de|hasta|max(?:imo)?|por debajo de|<)\\s*([\\d.,]+)\\s*(k|mil)?\\s*(?:€|eur|euros)?/))){o.pmax=NUM(m[1],m[2]);q=q.replace(m[0],' ')}
else if((m=q.match(/\\b([\\d.]{4,7}|\\d{1,3}\\s*(?:k|mil))\\s*(?:€|eur|euros)/))){o.pmax=NUM(m[1].replace(/k|mil/,''),/k|mil/.test(m[1]));q=q.replace(m[0],' ')}
else if((m=q.match(/\\b(\\d{1,3})\\s*(k|mil)\\b/))){o.pmax=NUM(m[1],1);q=q.replace(m[0],' ')}
else if((m=q.match(/\\b(\\d{1,3}\\.\\d{3}|\\d{4,6})\\b/))&&!/^(19|20)\\d\\d$/.test(m[1])){o.pmax=NUM(m[1]);q=q.replace(m[0],' ')}
if((m=q.match(/(?:desde|a partir de|del|de|posterior a|>)?\\s*\\b((?:19|20)\\d\\d)\\b/))){o.ymin=+m[1];q=q.replace(m[0],' ')}
const F=[['diesel','Diésel'],['gasoil','Diésel'],['tdi','Diésel'],['gasolina','Gasolina'],['tsi','Gasolina'],['hibrido','Híbrido'],['hybrid','Híbrido'],['electrico','Eléctrico'],['glp','GLP']];F.forEach(([w,v])=>{if(q.includes(w)){o.fuel=v;q=q.split(w).join(' ')}});
if(/\\bauto(matico)?s?\\b|\\bdsg\\b/.test(q)){o.trans='Automático';q=q.replace(/\\bauto(matico)?s?\\b|\\bdsg\\b/g,' ')}else if(/\\bmanual(es)?\\b/.test(q)){o.trans='Manual';q=q.replace(/\\bmanual(es)?\\b/g,' ')}
const C=[['suv','SUV'],['todoterreno','SUV'],['4x4','SUV'],['familiar','Familiar'],['ranchera','Familiar'],['compacto','Compacto'],['utilitario','Compacto'],['berlina','Berlina'],['sedan','Berlina'],['monovolumen','Monovolumen'],['coupe','Coupé'],['cabrio','Cabrio'],['descapotable','Cabrio'],['furgoneta','Furgoneta']];C.forEach(([w,v])=>{const r=new RegExp('\\\\b'+w+'s?\\\\b');if(r.test(q)){o.body=v;q=q.replace(r,' ')}});
const SYN=[['peque(?:no|na|nito)s?','Compacto'],['urbanos?','Compacto'],['ciudad','Compacto'],['grandes?','Familiar|SUV|Monovolumen'],['espacios[oa]s?','Familiar|SUV|Monovolumen'],['familia','Familiar|SUV|Monovolumen'],['maletero','Familiar|SUV|Monovolumen'],['deportivos?','Coupé|Cabrio'],['furgos?','Furgoneta'],['trabajo','Furgoneta']];SYN.forEach(([w,v])=>{const r=new RegExp('\\\\b'+w+'\\\\b');if(r.test(q)){o.bodies=v.split('|');if(!o.body)o.body=v.split('|').join(' / ');q=q.replace(r,' ')}});
if(/\\b(barat[oa]s?|economic[oa]s?)\\b/.test(q)){o.cheap=1;q=q.replace(/\\b(barat[oa]s?|economic[oa]s?)\\b/g,' ')}
if((m=q.match(/\\b7\\s*plazas\\b/))){o.seats=7;q=q.replace(m[0],' ')}
const STOP=new Set(['de','del','la','el','los','las','un','una','con','y','o','para','que','coche','coches','busco','quiero','en','sabadell','segunda','mano','ocasion','por','a','me','km','euros','eur','€','buen','barato','precio','color','plazas','algo','uno','bueno','necesito','tipo','mas','muy','poco','gaste','gastar','consuma','fiable']);
o.words=q.split(/[^a-z0-9]+/).filter(w=>w.length>1&&!STOP.has(w));return o}
function nlqMatch(o,d){if(o.kmax&&+d.k>o.kmax)return false;if(o.ymin&&+d.y<o.ymin)return false;if(o.fuel&&!NZ(d.f).startsWith(NZ(o.fuel).slice(0,5)))return false;if(o.trans&&d.t!==o.trans)return false;if(o.bodies?!o.bodies.includes(d.c):(o.body&&d.c!==o.body))return false;if(o.seats&&(+d.e||0)<o.seats)return false;return (o.words||[]).every(w=>d.x.includes(w))}
function nlqTxt(o){const p=[];if(o.words&&o.words.length)p.push('«'+o.words.join(' ')+'»');if(o.body)p.push(o.body);if(o.fuel)p.push(o.fuel);if(o.trans)p.push(o.trans.toLowerCase());if(o.pmax)p.push('hasta '+o.pmax.toLocaleString('es-ES')+' €');if(o.kmax)p.push('hasta '+o.kmax.toLocaleString('es-ES')+' km');if(o.ymin)p.push('desde '+o.ymin);if(o.seats)p.push(o.seats+' plazas');return p.length?'Buscando: '+p.join(' · '):''}`;

// Medición propia (sin cookies ni datos personales)
const TRACK_JS = `(()=>{try{const u=new URL(location.href),r=document.referrer?new URL(document.referrer).hostname:'';let s=u.searchParams.get('utm_source')||(u.searchParams.get('fbclid')?'facebook':'')||(u.searchParams.get('gclid')?'google-ads':'');
if(!s&&r&&r!==location.hostname){s=/google/.test(r)?'google':/facebook|fb\\\\./.test(r)?'facebook':/instagram/.test(r)?'instagram':/bing/.test(r)?'bing':/wallapop/.test(r)?'wallapop':/coches\\\\.net/.test(r)?'coches.net':/milanuncios/.test(r)?'milanuncios':r.replace(/^www\\\\./,'')}
const c=document.body.dataset.car||'',snd=o=>navigator.sendBeacon&&navigator.sendBeacon('${B}/api/hit',new Blob([JSON.stringify(o)],{type:'application/json'}));
snd({e:'view',p:location.pathname,s,c,n:!r||r!==location.hostname?1:0});window.pgSrc=s||(r&&r!==location.hostname?r:'directo');
const pth=location.pathname.replace('${B}','');const t=pth==='/'?'home':pth.startsWith('/vehiculos/')&&pth.length>11?'ficha':pth.startsWith('/vehiculos')?'catalogo':pth.startsWith('/coches')?'landing':pth.startsWith('/cita')?'cita':'otra';
let lcp=0,cls=0,inp=0;try{new PerformanceObserver(l=>{const e=l.getEntries();lcp=e[e.length-1].startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(!e.hadRecentInput)cls+=e.value})).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>l.getEntries().forEach(e=>{if(e.interactionId&&e.duration>inp)inp=e.duration})).observe({type:'event',buffered:true,durationThreshold:16})}catch(x){}
let sent=false;const fin=()=>{if(sent||!lcp)return;sent=true;snd({e:'cwv',t,lcp:Math.round(lcp),cls:+cls.toFixed(3),inp:Math.round(inp)})};addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')fin()});addEventListener('pagehide',fin);document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const h=a.getAttribute('href')||'';if(h.startsWith('https://wa.me')){snd({e:'wa',c});try{pgConv('contact','wa')}catch(x){}}else if(h.startsWith('tel:'))snd({e:'tel',c});else if(a.id==='pdf')snd({e:'pdf',c})},true)}catch(x){}})();`;

// Favoritos: se guardan solo en el navegador del visitante, a petición suya (no necesitan consentimiento)
const FAV_JS = `(()=>{const K='pg_fav';const get=()=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(x){return[]}};const put=a=>{try{localStorage.setItem(K,JSON.stringify(a))}catch(x){}};
const paint=()=>{const a=get();document.querySelectorAll('[data-fav]').forEach(e=>{const on=a.includes(e.dataset.fav);e.classList.toggle('on',on);e.setAttribute('aria-pressed',on)});const n=document.getElementById('fvn');if(n){n.textContent=a.length;n.classList.toggle('on',a.length>0)}};
const tog=e=>{const b=e.target.closest('[data-fav]');if(!b)return;e.preventDefault();e.stopPropagation();let a=get();const s=b.dataset.fav;a=a.includes(s)?a.filter(x=>x!==s):[...a,s].slice(-30);put(a);paint();document.dispatchEvent(new Event('pgfav'))};
document.addEventListener('click',tog,true);document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.fav)tog(e)},true);paint()})();`;

// Cookies de publicidad (Google Ads / Meta): solo se cargan si el visitante acepta. Rechazar es igual de fácil que aceptar.
const COOKIE_HTML = () => { const ads = !!(CTX.gtag || CTX.pixel);
  return `<div class="cb" id="cb" role="dialog" aria-label="Cookies"><p>Usamos cookies necesarias y, solo si aceptas, cookies de analítica (Microsoft Clarity) para ver cómo se usa la web y mejorarla${ads ? ', y de publicidad (Google y Meta) para medir nuestros anuncios' : ''}. <a href="${B}/cookies">Más información</a>.</p>
<div id="ckp" hidden style="margin:10px 0"><label class="chk"><input type="checkbox" id="cka"><span>Analítica: cómo se navega por la web (Microsoft Clarity)</span></label>${ads ? '<label class="chk"><input type="checkbox" id="ckd"><span>Publicidad: medir nuestros anuncios (Google y Meta)</span></label>' : ''}</div>
<div class="row"><button class="btn g" id="ckn" type="button">Rechazar</button><button class="btn g" id="ckx" type="button">Configurar</button><button class="btn" id="cky" type="button">Aceptar</button></div></div>`; };
const cookieJs = () => `(()=>{const G=${JSON.stringify(CTX.gtag || '')},P=${JSON.stringify(CTX.pixel || '')},CL=${JSON.stringify(CTX.clarity || '')},K='pg_ck';let st=null;try{st=localStorage.getItem(K)}catch(x){}
const cb=document.getElementById('cb');window.pgConv=(t,k)=>{try{if(window.gtag)gtag('event',t==='lead'?'generate_lead':'contact',{method:k});if(window.fbq)fbq('track',t==='lead'?'Lead':'Contact');if(window.clarity)clarity('event',t+'-'+k)}catch(x){}};
// Analítica: Microsoft Clarity, solo con permiso
const loadA=()=>{if(!CL||window.clarity)return;(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',CL);clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'})};
const load=()=>{if(G){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+G;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('config',G)}
if(P){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',P);fbq('track','PageView')}
};
// Elección guardada: 'si' (todo), 'no' (nada), 'a' (solo analítica), 'd' (solo publicidad)
const apply=v=>{if(v==='si'||v==='a')loadA();else if(window.clarity){try{clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'denied'});clarity('consent',false)}catch(x){}}if(v==='si'||v==='d')load()};
const set=v=>{try{localStorage.setItem(K,v)}catch(x){}cb.classList.remove('on');apply(v)};
if(st)apply(st);if(!st)cb.classList.add('on');
document.getElementById('cky').onclick=()=>set('si');document.getElementById('ckn').onclick=()=>set('no');
document.getElementById('ckx').onclick=()=>{const p=document.getElementById('ckp');if(p.hidden){p.hidden=false;const a=document.getElementById('cka'),d=document.getElementById('ckd');a.checked=st==='si'||st==='a';if(d)d.checked=st==='si'||st==='d';document.getElementById('ckx').textContent='Guardar mi elección';return}
const a=document.getElementById('cka').checked,d=(document.getElementById('ckd')||{}).checked;set(a&&d?'si':a?'a':d?'d':'no')};
const c=document.getElementById('ckc');if(c)c.onclick=e=>{e.preventDefault();cb.classList.add('on')}})();`;

// Aviso de stock (alertas): ventana discreta, una vez por sesión
const ALERT_HTML = `<div class="al" id="al" role="dialog" aria-label="Avisos de coches nuevos"><button class="x" aria-label="Cerrar">×</button><h3>¿No encuentras tu coche?</h3><p>Déjanos tu email y te avisamos cuando entre uno como el que buscas.</p>
<form id="alf" novalidate>${hp()}<input name="busca" maxlength="120" placeholder="Qué buscas (p. ej. SUV diésel automático)"><input name="max" inputmode="numeric" maxlength="6" placeholder="Presupuesto máximo (€)"><input name="email" type="email" required maxlength="200" placeholder="Tu email *">
<label class="chk"><input type="checkbox" name="consent" value="si"><span>Quiero recibir por email avisos de coches en stock que encajen con lo que busco. Me puedo dar de baja cuando quiera. <a href="${B}/privacidad" target="_blank">Privacidad</a></span></label><div class="msg" role="alert"></div><button class="btn sm" type="submit">Avisarme</button></form></div>`;
const ALERT_JS = `(()=>{const al=document.getElementById('al');if(!al)return;let seen=false;try{seen=sessionStorage.getItem('pg_al')==='1'}catch(x){}if(seen)return;
const open=()=>{if(seen)return;seen=true;try{sessionStorage.setItem('pg_al','1')}catch(x){}al.classList.add('on')};setTimeout(open,25000);addEventListener('scroll',()=>{if(scrollY>document.body.scrollHeight*.55)open()},{passive:true});
al.querySelector('.x').onclick=()=>al.classList.remove('on');const f=document.getElementById('alf');f.t.value=Date.now();
f.onsubmit=async e=>{e.preventDefault();const m=f.querySelector('.msg');m.className='msg';if(!f.consent.checked){m.textContent='Marca la casilla para que podamos avisarte.';m.className='msg err';return}
const fd=new FormData(f);fd.append('origen',location.pathname);fd.append('canal',window.pgSrc||'');const r=await fetch('${B}/api/alerta',{method:'POST',body:fd});const j=await r.json().catch(()=>({}));if(!r.ok){m.textContent=j.error||'Error';m.className='msg err';return}
f.innerHTML='<p class="msg ok" style="display:block">¡Hecho! Te avisaremos cuando entre un coche así.</p>'}})();`;

// ---------- páginas ----------
const HERO = `${ST}/assets/hero.jpg`;
export function home({ cars }) {
  const dest = cars.filter((c) => c.featured).sort((a, b) => b.price - a.price).slice(0, 6);
  const body = `<section class="hero" style="padding:0"><div class="bg"><img src="${esc(im(HERO, 1600))}" srcset="${esc(srcset(HERO, [640, 960, 1280, 1600, 2000]))}" sizes="100vw" alt="" fetchpriority="high" width="1920" height="1280"></div><div class="w"><div class="pill"><i></i>Coches seleccionados</div><h1>Vehículos de ocasión<br>en Sabadell, <span class="gr">con trato<br>directo.</span></h1>
<p class="l">Garantía de 12 meses y atención con cita previa. Mira el stock y ven a verlo sin compromiso.</p>
<form class="qs" action="${B}/vehiculos/" role="search"><input name="q" placeholder="¿Qué buscas? Ej.: SUV automático hasta 15.000 €" aria-label="Buscar coche"><button class="btn" type="submit">Buscar</button></form>
<div class="row" style="margin-top:14px"><a class="btn g sm" href="${B}/vehiculos/">Ver todo el stock ${ic.arrow}</a><a class="btn g sm" href="${B}/te-lo-buscamos">Busco un coche concreto</a></div>
<div class="tr"><div class="tc">${ic.shield}<b>Garantía 12 meses</b><span>En todos los vehículos</span></div><div class="tc">${ic.cal}<b>Atención con cita</b><span>Lun–Vie y sábados</span></div><div class="tc">${ic.chat}<b>Respuesta por WhatsApp</b><span>Escríbenos sin compromiso</span></div></div></div></section>
<section><div class="w"><div class="hd"><div><div class="pill">${ic.shield}Selección destacada</div><h2>Vehículos seleccionados,<br>trato <span class="gr">personalizado</span></h2></div><a class="v" href="${B}/vehiculos/">Ver todo →</a></div>
<div class="grid">${dest.map(card).join('')}</div><p style="text-align:center;margin-top:36px"><a class="btn g" href="${B}/vehiculos/">Explorar catálogo completo (${cars.length}) ${ic.arrow}</a></p></div></section>
<section><div class="w two"><div><div class="pill">${ic.shield}Cómo trabajamos</div><h2>Así es comprar<br><span class="gr">en Plata Garage.</span></h2><p class="lead">Te enseñamos el coche con calma, resolvemos tus dudas y te acompañamos hasta la entrega.</p>
<div class="stp"><div><i>1</i><p style="margin:0"><b>Eliges y reservas</b><span>Ven a verlo con cita y, si te convence, lo reservas con la señal.</span></p></div><div><i>2</i><p style="margin:0"><b>Pasa por taller</b><span>Lo revisamos y le hacemos el cambio de aceite antes de entregártelo.</span></p></div><div><i>3</i><p style="margin:0"><b>Te lo llevas con garantía</b><span>12 meses de garantía con cobertura en toda España.</span></p></div></div></div>
<div class="im"><img src="${im(ST + '/img/1785836189166-dpvwhc.jpg', 900)}" alt="Cupra León en la exposición de Plata Garage" loading="lazy" width="640" height="800"></div></div></section>
<section style="padding-top:0"><div class="w"><div class="hd" style="margin-bottom:18px"><h2 style="font-size:clamp(26px,3vw,36px)">Encuentra tu coche <span class="gr">más rápido</span></h2></div><div class="chipl">${tiposConStock(cars).map((t) => `<a href="${B}/coches/${t.slug}">${esc(t.h)} (${t.n})</a>`).join('')}${marcas(cars).map((m) => `<a href="${B}/coches/${m.slug}">${esc(m.name)} (${m.n})</a>`).join('')}</div></div></section>
<section style="padding-top:0"><div class="w">${faqHtml(FAQ.slice(0, 5))}<p style="margin-top:16px"><a href="${B}/preguntas-frecuentes" style="color:var(--or)">Ver todas las preguntas →</a></p></div></section>
<section id="cita"><div class="w"><div class="cta"><h2>¿Tienes un coche en mente?<br><span class="gr">Reserva una visita.</span></h2><p class="lead" style="max-width:520px;margin:18px auto 0">Atendemos con cita previa en Sabadell. Elige día y hora y te lo confirmamos.</p>
<div class="row"><a class="btn" href="${B}/cita">Reservar cita</a><a class="btn g" href="${B}/cuanto-vale-mi-coche">¿Cuánto vale mi coche?</a></div></div></div></section>`;
  return page({ title: 'Coches de segunda mano en Sabadell | Plata Garage', desc: 'Coches de segunda mano en Sabadell y el Vallès con garantía de 12 meses. Mira el stock, pide cita y ven a verlo sin compromiso.', on: 'home', body, alert: true, path: '/', head: `<link rel="preload" as="image" href="${esc(im(HERO, 1600))}" imagesrcset="${esc(srcset(HERO, [640, 960, 1280, 1600, 2000]))}" imagesizes="100vw" fetchpriority="high">` + ld(ldWeb()) + ld(ldFaq(FAQ.slice(0, 5))) });
}

export function catalog({ cars, q = {}, vendido = null }) {
  const opts = (k) => [...new Set(cars.map((c) => c[k]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const sel = (id, label, list) => `<select id="${id}" aria-label="${label}"><option value="">${label}</option>${list.map((x) => `<option${q[id] === x ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select>`;
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill"><i></i>${cars.length} coches disponibles</div><h1 class="s">Coches de segunda mano <span class="gr">en Sabadell</span></h1>
${vendido ? buscaMini({ titulo: `Ese ${vendido.brand} ${vendido.model} ya se ha vendido`, sub: 'Te buscamos uno igual o parecido, sin compromiso. Abajo tienes también todo lo que hay ahora en stock.', pre: { marca: vendido.brand, modelo: vendido.model, combustible: vendido.fuel || '', cambio: vendido.trans || '', presupuesto: Math.round((vendido.price * 1.1) / 500) * 500, mensaje: `Venía del ${vendido.brand} ${vendido.model} (${vendido.year}), ya vendido` } }) + '<div style="height:26px"></div>' : ''}
<form class="qs" id="qf" role="search"><input id="q" name="q" value="${esc(q.q || '')}" placeholder="Escribe lo que buscas: «diésel automático hasta 12.000 €», «SUV desde 2018»…" aria-label="Buscar coche"><button class="btn" type="submit">Buscar</button></form><p class="note" id="qi" style="min-height:20px"></p>
<div class="filters">${sel('m', 'Marca', opts('brand'))}${sel('f', 'Combustible', opts('fuel'))}${sel('t', 'Cambio', opts('trans'))}${sel('c', 'Carrocería', opts('body'))}
<select id="p" aria-label="Precio máximo"><option value="">Precio máximo</option>${[4000, 6000, 8000, 10000, 15000, 20000, 30000].map((v) => `<option value="${v}">Hasta ${eur(v)}</option>`).join('')}</select>
<select id="o" aria-label="Ordenar"><option value="p-">Precio: mayor a menor</option><option value="p+">Precio: menor a mayor</option><option value="k+">Menos kilómetros</option><option value="y-">Más nuevos</option><option value="s-">Últimos en llegar</option></select></div>
<p class="note" id="n"></p><div class="grid" id="g">${cars.sort((a, b) => b.price - a.price).map(card).join('')}</div>
<div class="chipl" style="margin-top:28px">${tiposConStock(cars).map((t) => `<a href="${B}/coches/${t.slug}">${esc(t.h)}</a>`).join('')}</div>
${buscaMini({ titulo: 'Ahora mismo no tenemos un coche así', sub: 'El stock cambia cada semana. Déjanos tus datos y te lo buscamos nosotros, sin compromiso.', id: 'z', oculto: true })}
<div class="box" id="avb" style="padding:20px;max-width:760px;margin-top:22px"><p style="margin:0"><b>¿Ninguno te convence?</b> <a href="#" id="avl" style="color:var(--or)">Avísame cuando entre un coche con estos filtros</a></p>
<form id="avf" hidden novalidate style="margin-top:12px">${hp()}<input type="hidden" name="busca"><input type="hidden" name="max"><input name="email" type="email" required maxlength="200" placeholder="Tu email *">
<label class="chk"><input type="checkbox" name="consent" value="si"><span>Quiero recibir por email avisos de coches que encajen con esta búsqueda. Me puedo dar de baja cuando quiera. <a href="${B}/privacidad" target="_blank">Privacidad</a></span></label><div class="msg" role="alert"></div><button class="btn sm" type="submit">Avisarme</button></form></div></div></section>`;
  const script = `const g=document.getElementById('g'),cs=[...g.children],v=id=>document.getElementById(id).value;
${NLQ_JS}
let Q={};const qi=document.getElementById('qi');
function run(){const m=v('m'),f=v('f'),t=v('t'),c=v('c'),p=Math.min(+v('p')||1e9,Q.pmax||1e9),o=Q.cheap&&v('o')==='p-'?'p+':v('o');let n=0;
const k=o[0]==='p'?'p':o[0]==='k'?'k':o[0]==='y'?'y':'s',dir=o[1]==='+'?1:-1;
cs.sort((a,b)=>{const x=a.dataset[k],y=b.dataset[k];return (k==='s'?x.localeCompare(y):(+x-+y))*dir}).forEach(e=>{const d=e.dataset,ok=(!m||d.m===m)&&(!f||d.f===f)&&(!t||d.t===t)&&(!c||d.c===c)&&+d.p<=p&&nlqMatch(Q,d);e.style.display=ok?'':'none';if(ok)n++;g.appendChild(e)});
let near=0;if(!n&&(document.getElementById('q').value.trim()||m||f||t||c||p<1e9)){
// Sin coincidencias exactas: enseñamos lo más parecido (cuantos más criterios cumple, antes sale)
const sc=e=>{const d=e.dataset;let s=0;if(m&&d.m===m)s+=3;if(f&&d.f===f)s+=2;if(t&&d.t===t)s+=2;if(c&&d.c===c)s+=2;if(Q.bodies&&Q.bodies.includes(d.c))s+=3;if(Q.fuel&&NZ(d.f).startsWith(NZ(Q.fuel).slice(0,5)))s+=2;if(Q.trans&&d.t===Q.trans)s+=2;if(p<1e9)s+=+d.p<=p*1.15?2:-1;(Q.words||[]).forEach(w=>{if(d.x.includes(w))s+=2});return s};
cs.map(e=>[sc(e),e]).sort((a,b)=>b[0]-a[0]||+a[1].dataset.p-+b[1].dataset.p).slice(0,6).forEach(([s,e])=>{e.style.display='';g.prepend(e);near++})}
document.getElementById('n').innerHTML=near?'<b>No tenemos exactamente eso.</b> Te enseñamos lo más parecido que hay ahora, y si quieres te lo buscamos:':n+' resultado'+(n===1?'':'s');const z=document.getElementById('z'),zf=z.querySelector('form'),qq=document.getElementById('q').value.trim();z.style.display=n?'none':'';
zf.marca.value=m;zf.combustible.value=f;zf.cambio.value=t;if(p<1e9&&!zf.presupuesto.dataset.u)zf.presupuesto.value=p;zf.mensaje.value='Buscó en el stock: '+[qq,m,f,t,c,p<1e9?'hasta '+p+' €':''].filter(Boolean).join(', ');
const af=document.getElementById('avf');af.busca.value=[qq,m,f,t,c].filter(Boolean).join(', ').slice(0,120)||'Cualquier coche';af.max.value=p<1e9?p:''}
document.querySelector('#z input[name=presupuesto]').addEventListener('input',e=>e.target.dataset.u=1);
(()=>{const f=document.getElementById('avf');document.getElementById('avl').onclick=e=>{e.preventDefault();f.hidden=!f.hidden;f.t.value=Date.now();if(!f.hidden)f.email.focus()};
f.onsubmit=async e=>{e.preventDefault();const m=f.querySelector('.msg');m.className='msg';if(!f.consent.checked){m.textContent='Marca la casilla para que podamos avisarte.';m.className='msg err';return}
const fd=new FormData(f);fd.append('origen',location.pathname+location.search);fd.append('canal',window.pgSrc||'');const r=await fetch('${B}/api/alerta',{method:'POST',body:fd});const j=await r.json().catch(()=>({}));if(!r.ok){m.textContent=j.error||'Error';m.className='msg err';return}f.innerHTML='<p class="msg ok" style="display:block">Hecho. Te avisaremos cuando entre un coche así.</p>'}})();
document.querySelectorAll('.filters select').forEach(s=>s.addEventListener('change',run));
const qf=document.getElementById('qf');qf.onsubmit=e=>{e.preventDefault();doQ(true)};
function doQ(push){const q=document.getElementById('q').value.trim();Q=nlq(q);qi.textContent=q?nlqTxt(Q):'';if(push){const u=new URL(location.href);q?u.searchParams.set('q',q):u.searchParams.delete('q');history.replaceState(null,'',u)}run();
// Qué busca la gente (anónimo, sin cookies): sirve para saber qué coches buscar y qué falta en la web
if(q){const n=cs.filter(e=>e.style.display!=='none').length,near=/parecido/.test(document.getElementById('n').textContent);try{navigator.sendBeacon('${B}/api/hit',new Blob([JSON.stringify({e:'q',q:NZ(q).slice(0,80),n:near?0:n})],{type:'application/json'}))}catch(x){}}}
doQ(false);`;
  return page({ title: 'Coches de segunda mano en Sabadell | Plata Garage', desc: `${cars.length} coches de ocasión en Sabadell con garantía de 12 meses. Filtra por marca, precio y combustible y pide cita.`, on: 'veh', body, script: FORM_JS + script, alert: !vendido, path: '/vehiculos/', noindex: !!q.q || !!vendido });
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
.pn{display:none}.bpf{display:grid;gap:10px;max-width:420px;margin-top:14px;background:rgba(10,10,10,.85);border:1px solid var(--line);border-radius:16px;padding:16px}.bpf[hidden]{display:none}.bpf .chk{font-size:12px;color:var(--mu)}
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
  const secs = [['coche', 'El coche'], feats.length >= 3 ? ['destacado', 'Lo destacado'] : null, c.comment ? ['opinion', 'Cómo lo vemos'] : null, feats.length ? ['equipamiento', 'Equipamiento'] : null, ['ficha', 'Ficha técnica'], imgs.length > 1 ? ['fotos', 'Fotos'] : null, ['dudas', 'Dudas'], ['visita', 'Verlo en persona']].filter(Boolean);
  const fq = [[`¿Puedo ver y probar el ${name}?`, `Sí. Pide cita en esta página eligiendo día y hora y te lo tenemos preparado en Sabadell. Atendemos de lunes a viernes de 9:30 a 19:30 y los sábados de 10:00 a 14:00.`], [`¿El ${c.brand} ${c.model} tiene garantía?`, 'Sí, garantía de 12 meses. Según la antigüedad del coche, se puede ampliar con coste adicional.'], ...(c.reserve > 0 && c.status === 'disponible' ? [['¿Puedo reservarlo?', `Sí, con una señal de ${eur(c.reserve)} que se descuenta del precio. Primero te confirmamos que sigue disponible y te explicamos las condiciones.`]] : []), ['¿Me lo podéis llevar a casa?', 'Sí, es posible. Pide presupuesto del envío con tu código postal aquí abajo, sin compromiso.'], ['¿Puedo financiarlo?', 'Consúltanos y te explicamos las opciones y condiciones antes de decidir.']];
  const title = (() => { const full = `${name} ${c.year} de segunda mano en Sabadell | Plata Garage`; if (full.length <= 70) return full; const s = `${c.brand} ${c.model} ${c.year} de segunda mano en Sabadell | Plata Garage`; return s.length <= 70 ? s : `${c.brand} ${c.model} ${c.year} en Sabadell | Plata Garage`; })();
  const desc = `${name} ${c.year}, ${kms(c.km)}, ${c.fuel.toLowerCase()}, ${c.trans.toLowerCase()}. ${eur(c.price)}. Garantía de 12 meses en Sabadell. Pide cita.`.slice(0, 158);
  const ldCar = { '@context': 'https://schema.org', '@type': ['Product', 'Car'], name: `${name} ${c.year}`, brand: { '@type': 'Brand', name: c.brand }, model: c.model, vehicleModelDate: String(c.year), mileageFromOdometer: { '@type': 'QuantitativeValue', value: c.km, unitCode: 'KMT' }, fuelType: c.fuel, vehicleTransmission: c.trans, color: c.color || undefined, bodyType: c.body || undefined, numberOfDoors: c.doors || undefined, vehicleSeatingCapacity: c.seats || undefined, vehicleEngine: c.cv ? { '@type': 'EngineSpecification', enginePower: { '@type': 'QuantitativeValue', value: c.cv, unitCode: 'BHP' } } : undefined, image: imgs.map(abs), url: abs(`${B}/vehiculos/${c.slug}`), description: (c.desc || '').slice(0, 500), offers: { '@type': 'Offer', price: c.price, priceCurrency: 'EUR', availability: c.status === 'reservado' ? 'https://schema.org/LimitedAvailability' : c.status === 'preparacion' ? 'https://schema.org/PreOrder' : 'https://schema.org/InStock', itemCondition: 'https://schema.org/UsedCondition', seller: { '@id': `${CTX.site}${B}/#negocio` } } };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: abs(`${B}/`) }, { '@type': 'ListItem', position: 2, name: 'Vehículos', item: abs(`${B}/vehiculos/`) }, { '@type': 'ListItem', position: 3, name }] };
  const ph = (i) => imgs[i] ? `<div class="ai" data-i="${i}"><img src="${esc(im(imgs[i], 900))}" alt="${esc(name)} ${c.year} – foto ${i + 1}" loading="lazy" width="800" height="600"></div>` : '';
  const waTxt = `Hola, me interesa el ${name} (${c.year}) de ${eur(c.price)}.`;
  const reservaBox = c.reserve > 0 && c.status === 'disponible' ? `<div class="box"><h3>${ic.key}Reserva este coche</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Señal de <b style="color:#fff">${eur(c.reserve)}</b> que se descuenta del precio. Primero te confirmamos que sigue disponible y te explicamos las condiciones; después puedes pagarla por Bizum${holder?.accounts?.length ? ' o transferencia' : ''}. <a href="${B}/condiciones-de-contratacion" style="color:inherit;text-decoration:underline">Condiciones de la reserva</a>.</p><a class="btn g" href="${B}/cita?coche=${c.slug}&motivo=${encodeURIComponent('Reservar este coche')}">Solicitar reserva</a></div>` : '';

  const body = `<section class="fh" style="padding:0"><img class="bgi" src="${esc(im(imgs[0], 1600))}" srcset="${esc(srcset(imgs[0], [640, 960, 1280, 1600]))}" sizes="100vw" alt="${esc(name)} ${c.year}" fetchpriority="high" width="1600" height="1200"><div class="w">
<div class="cr"><a href="${B}/">Inicio</a> · <a href="${B}/vehiculos/">Vehículos</a> · ${esc(c.brand)} ${esc(c.model)}</div>${stt}
<h1>${esc(c.brand)} ${esc(c.model)}${c.version ? `<span>${esc(c.version)}</span>` : ''}</h1>
<div class="chips"><span>${ic.cal}${c.year}</span><span>${ic.gauge}${kms(c.km)}</span><span>${ic.fuel}${esc(c.fuel)}</span><span>${ic.gear}${esc(c.trans)}</span>${c.cv ? `<span>${c.cv} CV</span>` : ''}${etq ? `<span>${etq.startsWith('Sin') ? esc(etq) : 'Etiqueta ' + esc(etq)}</span>` : ''}</div>
<div class="pz">${eur(c.price)}</div>
<div class="row"><a class="btn" href="#visita">${ic.cal}Pedir cita para verlo</a><a class="btn g" href="${wa(waTxt)}" rel="noopener">${ic.wa}WhatsApp</a><a class="btn g" href="#ficha">Ver los datos</a></div>
<a class="pdf" href="#" id="pdf">Descargar ficha (PDF)</a> · <a class="pdf" href="#" data-fav="${c.slug}">Guardar en favoritos</a> · <a class="pdf" href="#bp" id="bpl">Avísame si baja de precio</a>
<form id="bp" class="bpf" novalidate hidden>${hp()}<input type="hidden" name="coche" value="${c.slug}"><input name="email" type="email" required maxlength="200" placeholder="Tu email"><label class="chk"><input type="checkbox" name="consent" value="si"><span>Quiero que me aviséis por email si baja de precio este coche. Me puedo dar de baja cuando quiera. <a href="${B}/privacidad" target="_blank">Privacidad</a></span></label><div class="msg" role="alert"></div><button class="btn sm" type="submit">Avisarme</button></form></div></section>
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
<section class="fs" id="falta"><div class="box" style="padding:22px"><h3>¿Qué te falta para decidirte?</h3><p class="mu sm" style="margin:4px 0 12px">Un toque y te ayudamos con eso. Es anónimo.</p><div class="chipl" id="ftl">${[['precio', 'El precio'], ['financiacion', 'La financiación'], ['verlo', 'Verlo en persona'], ['datos', 'Más fotos o datos'], ['garantia', 'Saber qué cubre la garantía'], ['entregar', 'Entregar mi coche']].map(([k, t]) => `<a href="#" data-f="${k}">${t}</a>`).join('')}</div><div id="ftr" class="note" style="margin-top:12px"></div></div></section>
<section class="fs" id="dudas">${faqHtml(fq, 'Dudas sobre este coche')}</section>
<section class="fs" id="visita"><div class="ey">Verlo en persona</div><h2>Reserva tu visita para este coche</h2>${citaForm({ cars, coche: c.slug, inFicha: true })}
<div class="v3"><div class="box"><h3>${ic.chat}¿Prefieres preguntar?</h3><a class="btn" href="${wa(waTxt)}" rel="noopener">${ic.wa}Preguntar por WhatsApp</a><a class="tx" href="tel:+34660493228">${ic.tel} ${TEL}</a><p class="note">Garantía de 12 meses. Financiación: consúltanos condiciones.</p></div>${reservaBox}
<div class="box"><h3>${ic.key}¿Tienes coche para entregar?</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Te lo valoramos sin compromiso y te decimos cuánto te quedaría por pagar por el ${esc(c.brand)} ${esc(c.model)}.</p><a class="btn g" href="${B}/cuanto-vale-mi-coche?coche=${c.slug}">Valorar mi coche</a></div>
<div class="box"><h3>${ic.truck}Te lo llevamos a casa</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Dinos tu código postal y te pasamos presupuesto del envío, sin compromiso.</p>
<form class="f" data-api="${B}/api/envio" data-t="envio" novalidate>${hp()}<input type="hidden" name="coche" value="${c.slug}"><label>Código postal *<input name="cp" required inputmode="numeric" pattern="\\d{5}" maxlength="5"></label>${contactFields()}${priv()}<div class="msg" role="alert"></div><button class="btn g" type="submit">Pedir presupuesto de envío</button></form></div></div></section></div></div>
<section style="padding:10px 0 30px" id="busca"><div class="w">${buscaMini({ titulo: '¿No es exactamente lo que buscas?', sub: 'Dinos qué cambiarías y te buscamos uno parecido, sin compromiso.', pre: { marca: c.brand, modelo: c.model, combustible: c.fuel || '', cambio: c.trans || '', presupuesto: Math.round((c.price * 1.15) / 500) * 500, mensaje: `Parecido al ${name} (${c.year})` } })}</div></section>
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
(()=>{const f=document.getElementById('bp');document.getElementById('bpl').onclick=e=>{e.preventDefault();f.hidden=!f.hidden;f.t.value=Date.now();if(!f.hidden)f.email.focus()};
f.onsubmit=async e=>{e.preventDefault();const m=f.querySelector('.msg');m.className='msg';if(!f.consent.checked){m.textContent='Marca la casilla para que podamos avisarte.';m.className='msg err';return}
const r=await fetch('${B}/api/alerta',{method:'POST',body:new FormData(f)});const j=await r.json().catch(()=>({}));if(!r.ok){m.textContent=j.error||'Error';m.className='msg err';return}f.innerHTML='<p class="msg ok" style="display:block">Hecho. Te avisaremos si baja de precio.</p>'}})();
const sb=document.getElementById('sb'),hero=document.querySelector('.fh');new IntersectionObserver(([e])=>sb.classList.toggle('on',!e.isIntersecting)).observe(hero);
const links=[...document.querySelectorAll('.idx a')];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
(()=>{const R={precio:['Dinos hasta cuánto quieres gastar y te buscamos alternativas en ese precio.','Que me busquen uno','#busca'],financiacion:['Te calculamos la cuota sin compromiso: escríbenos y te decimos plazo y entrada.','Calcular mi cuota',${JSON.stringify(wa(`Hola, ¿me calculáis la cuota del ${name} (${c.year})?`))}],verlo:['Elige día y hora y te lo tenemos preparado para verlo y probarlo.','Pedir cita','${B}/cita?coche=${c.slug}'],datos:['Pregúntanos lo que quieras saber del coche y te contestamos.','Preguntar por WhatsApp',${JSON.stringify(wa(`Hola, quería más información del ${name} (${c.year}).`))}],garantia:['Todos llevan garantía de 12 meses. Tienes los detalles en las dudas de abajo.','Ver las dudas','#dudas'],entregar:['Te damos una valoración orientativa de tu coche como parte de pago.','Valorar mi coche','${B}/cuanto-vale-mi-coche?coche=${c.slug}']};
const r=document.getElementById('ftr');document.querySelectorAll('#ftl [data-f]').forEach(a=>a.onclick=e=>{e.preventDefault();const k=a.dataset.f,x=R[k];document.querySelectorAll('#ftl a').forEach(b=>b.classList.toggle('on',b===a));
try{navigator.sendBeacon('${B}/api/hit',new Blob([JSON.stringify({e:'falta',k,c:'${c.slug}'})],{type:'application/json'}))}catch(z){}
r.innerHTML=x[0]+' <a class="btn sm" style="margin-left:8px" href="'+x[2]+'"'+(x[2].startsWith('http')?' rel="noopener"':'')+'>'+x[1]+'</a>'})})();
${FORM_JS}${SLOTS_JS}`;
  return page({ title, desc, on: 'veh', body, head: `<link rel="preload" as="image" href="${esc(im(imgs[0], 1600))}" imagesrcset="${esc(srcset(imgs[0], [640, 960, 1280, 1600]))}" imagesizes="100vw" fetchpriority="high"><style>${FICHA_CSS}</style>` + ld(ldCar) + ld(crumbs) + ld(ldFaq(fq)), script, car: c.slug, alert: true, path: `/vehiculos/${c.slug}`, image: imgs[0] });
}

export function cita({ cars, coche, motivo }) {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${ic.cal}Agenda</div><h1 class="s">Reserva tu visita<br><span class="gr">en menos de un minuto.</span></h1>
<p class="lead" style="max-width:640px">Elige el día y la hora que mejor te vengan. Te recibimos en Sabadell, te enseñamos los coches que te interesen y resolvemos todas tus dudas.</p>${INFO3}${citaForm({ cars, coche, motivo })}</div></section>`;
  return page({ title: 'Pedir cita para ver un coche en Sabadell | Plata Garage', desc: 'Pide cita para ver un coche en Plata Garage (Sabadell). Elige día y hora y te lo tenemos preparado.', on: 'cita', body, script: FORM_JS + SLOTS_JS + PICK_JS, path: '/cita', noindex: !!(coche || motivo) });
}

export function contacto() {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${ic.chat}Contacto</div><h1 class="s">Hablemos <span class="gr">sin compromiso</span></h1>
<p class="lead">Atendemos con cita previa en Sabadell, de lunes a viernes de 9:30 a 19:30 y los sábados de 10:00 a 14:00. Lo más rápido es <a href="${wa('Hola, quería información.')}" style="color:var(--or)">WhatsApp</a> o el ${TEL}.</p>
<div class="two" style="align-items:start;gap:28px"><div class="box" style="padding:28px"><h3>Envíanos un mensaje</h3><form class="f" data-api="${B}/api/mensaje" data-t="mensaje" novalidate>${hp()}${contactFields()}<label>Asunto<input name="asunto" maxlength="120"></label><label>Mensaje *<textarea name="mensaje" required maxlength="3000"></textarea></label>${priv()}<div class="msg" role="alert"></div><button class="btn" type="submit">Enviar mensaje</button></form></div>
<div class="box" id="tasacion" style="padding:28px"><h3>¿Quieres vender tu coche?</h3><p class="mu" style="margin:0 0 16px">Te damos una valoración orientativa gratis, hecha por una persona, en 24 horas laborables. Son 4 preguntas rápidas.</p><a class="btn" href="${B}/cuanto-vale-mi-coche">Valorar mi coche</a><p class="note" style="margin-top:14px">También puedes entregarlo como parte del pago de uno de nuestros coches.</p></div></div></div></section>`;
  return page({ title: 'Contacto y tasación | Plata Garage', desc: 'Contacta con Plata Garage en Sabadell o pide la tasación de tu coche.', on: 'con', body, script: FORM_JS, path: '/contacto' });
}

export function gracias(t, { bk = null, car = null, cars = [] } = {}) {
  const txt = { cita: 'Hemos recibido tu solicitud de cita. Te la confirmamos en breve por WhatsApp o por teléfono.', envio: 'Hemos recibido tu solicitud. Te pasamos el presupuesto del envío lo antes posible.', tasacion: 'Hemos recibido los datos de tu coche. Te enviamos una valoración orientativa en 24 horas laborables.', busqueda: 'Hemos recibido lo que buscas. Te escribimos en cuanto tengamos opciones que encajen.', mensaje: 'Hemos recibido tu mensaje. Te respondemos lo antes posible.' }[t] || 'Hemos recibido tu solicitud.';
  if (!bk) return page({ noindex: true, title: 'Gracias | Plata Garage', desc: 'Solicitud recibida', body: `<section><div class="w"><div class="cta"><h2>¡Gracias!</h2><p class="lead" style="max-width:560px;margin:18px auto 0">${txt}</p><div class="row"><a class="btn" href="${B}/vehiculos/">Ver más coches</a><a class="btn g" href="${wa('Hola, acabo de enviar una solicitud desde la web.')}">Escribir por WhatsApp</a></div></div></div></section>` });
  // Resumen de la cita con lo que el cliente necesita: cuándo, qué coche, añadir al calendario y seguir mirando
  const dia = new Date(bk.fecha + 'T12:00:00Z').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const nm = car ? `${carName(car)} (${car.year})` : '';
  const [H, Mi] = bk.hora.split(':').map(Number); const pad = (n) => String(n).padStart(2, '0'); const end = H * 60 + Mi + 30;
  const d0 = bk.fecha.replace(/-/g, '') + 'T' + pad(H) + pad(Mi) + '00', d1 = bk.fecha.replace(/-/g, '') + 'T' + pad(Math.floor(end / 60)) + pad(end % 60) + '00';
  const tit = `Cita en Plata Garage${nm ? ' · ' + nm : ''}`, det = `Cita en Plata Garage (Sabadell). Si necesitas cambiarla: WhatsApp ${TEL}.`;
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(tit)}&dates=${d0}/${d1}&ctz=Europe/Madrid&details=${encodeURIComponent(det)}&location=Sabadell`;
  const ics = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Plata Garage//Cita//ES', 'BEGIN:VEVENT', `UID:${bk.id}@platagarage`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;TZID=Europe/Madrid:${d0}`, `DTEND;TZID=Europe/Madrid:${d1}`, `SUMMARY:${tit}`, `DESCRIPTION:${det}`, 'LOCATION:Sabadell', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'));
  const waTxt = `Hola, soy ${bk.nombre}. Acabo de pedir cita para el ${dia} a las ${bk.hora}${nm ? ' para ver el ' + nm : ''}.`;
  const sim = car ? cars.filter((x) => x.slug !== car.slug).sort((a, b) => Math.abs(a.price - car.price) - Math.abs(b.price - car.price)).slice(0, 3) : cars.filter((x) => x.featured).slice(0, 3);
  const body = `<section style="padding-top:56px"><div class="w"><div class="gx">
<div><div class="pill">${I('<path d="M20 6L9 17l-5-5"/>')}Solicitud recibida</div><h1 class="s">¡Gracias, ${esc(bk.nombre.split(' ')[0])}! <span class="gr">${bk.propuesta ? 'Hemos recibido tu propuesta.' : 'Tu cita está pedida.'}</span></h1>
<p class="lead">${bk.propuesta ? `Nos propones venir a las ${esc(bk.hora)}. Miramos si podemos atenderte a esa hora y te lo confirmamos en breve por WhatsApp o por teléfono.` : 'Te la confirmamos en breve por WhatsApp o por teléfono. Si te surge algo, avísanos y la cambiamos sin problema.'}</p>
<div class="box gsum"><div class="gd"><span class="mu">Día</span><b>${esc(dia[0].toUpperCase() + dia.slice(1))}</b></div><div class="gd"><span class="mu">Hora</span><b>${esc(bk.hora)}</b></div><div class="gd"><span class="mu">Dónde</span><b>Sabadell</b><span class="note" style="margin:0">Te pasamos la ubicación al confirmar</span></div><div class="gd"><span class="mu">Duración</span><b>30 min, sin prisas</b></div></div>
<div class="row" style="margin:18px 0 8px"><a class="btn" href="${gcal}" target="_blank" rel="noopener">${ic.cal}Añadir a Google Calendar</a><a class="btn g" href="${ics}" download="cita-plata-garage.ics">Añadir a otro calendario</a><a class="btn g" href="${wa(waTxt)}" rel="noopener">${ic.wa}Escribirnos</a></div></div>
${car ? `<a class="card" href="${B}/vehiculos/${car.slug}"><div class="ph"><img src="${esc(im(cover(car), 700))}" alt="${esc(nm)}" width="400" height="300"><span class="pr">${eur(car.price)}</span></div><div class="b"><div class="br">El coche que vas a ver</div><div class="md"><b>${esc(car.brand)} ${esc(car.model)}</b> <span>${esc(car.version || '')}</span></div><div class="sp"><div>${ic.cal}${car.year}</div><div>${ic.gauge}${kms(car.km)}</div><div>${ic.fuel}${esc(car.fuel)}</div><div>${ic.gear}${esc(car.trans)}</div></div></div></a>` : ''}</div>
<div class="box" style="margin-top:28px"><h3>${ic.key}¿Vas a entregar tu coche?</h3><p class="mu" style="margin:0 0 12px;font-size:14px">Si quieres dejar el tuyo como parte del pago, pídenos la valoración antes de venir y lo hablamos en la visita.</p><a class="btn g sm" style="width:auto" href="${B}/cuanto-vale-mi-coche${car ? '?coche=' + car.slug : ''}">Valorar mi coche</a></div>
${sim.length ? `<h2 style="font-size:28px;margin:48px 0 22px">${car ? 'Ya que vienes, échales un ojo' : 'Coches destacados'}</h2><div class="grid">${sim.map(card).join('')}</div>` : ''}</div></section>`;
  return page({ noindex: true, title: 'Cita pedida | Plata Garage', desc: 'Solicitud de cita recibida', body, head: '<style>.gx{display:grid;grid-template-columns:1.3fr 1fr;gap:36px;align-items:start}.gsum{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0 0}.gd{display:grid;gap:2px}.gd b{font-size:18px;font-family:\'Space Grotesk\',sans-serif}@media(max-width:900px){.gx{grid-template-columns:1fr}}</style>' });
}

const TITULARES = `<ul><li><b>Cristina Plata Galán</b> · NIF 48271238B · C/ Tetuán 92, 08203 Sabadell (Barcelona)</li><li><b>Juan Morante Cruz</b> · NIF 77123920K · C/ Tetuán 92, 08203 Sabadell (Barcelona)</li></ul>`;
export function privacidad() {
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Política de privacidad</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Responsables del tratamiento</h2><p>Los datos que nos facilitas en esta web los tratan, como corresponsables, los profesionales autónomos que operan bajo el nombre comercial «Plata Garage»:</p>${TITULARES}<p>Cada uno trata los datos de los clientes con los que contrata. Contacto para cualquier cuestión de privacidad: info@platagarage.com · ${TEL}.</p>
<h2>2. Qué datos tratamos y para qué</h2><ul><li><b>Citas, reservas, envíos, tasaciones, "Te lo buscamos" y mensajes:</b> nombre, teléfono, email y lo que nos cuentes en el formulario, para atender tu solicitud y contactarte por teléfono, WhatsApp o email sobre ella. Con tu solicitud guardamos también la página desde la que nos escribes y de dónde llegaste a la web (por ejemplo, Google), para saber qué funciona.</li>
<li><b>Avisos de coches nuevos:</b> tu email y lo que buscas, para enviarte avisos de coches en stock que encajen. Solo si marcas la casilla, y puedes darte de baja cuando quieras respondiendo a cualquier aviso o escribiendo a info@platagarage.com.</li>
<li><b>Medición de la web:</b> contamos visitas por página, de dónde llegan (por ejemplo, Google o Facebook), el tipo de dispositivo, la ciudad aproximada y lo que se escribe en el buscador de coches, siempre de forma agregada, sin cookies y sin guardar tu IP ni ningún dato que te identifique.</li></ul>
<h2>3. Base legal</h2><p>Tu consentimiento al enviar cada formulario o activar los avisos (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD). La medición agregada se basa en nuestro interés legítimo en saber qué funciona en la web (art. 6.1.f RGPD), sin datos personales.</p>
<h2>4. Conservación</h2><p>Mientras dure la gestión de tu solicitud y, después, durante los plazos legales aplicables. Si no llega a haber operación, borramos los datos como máximo a los 12 meses. Los avisos de coches nuevos, hasta que te des de baja.</p>
<h2>5. Destinatarios</h2><p>No cedemos tus datos a terceros salvo obligación legal. Usamos proveedores que actúan como encargados del tratamiento: Netlify (alojamiento de la web y de los datos, y envío de los avisos internos por correo), Google (correo electrónico)${CTX.clarity ? ' y, solo si aceptas las cookies de analítica, Microsoft (Clarity)' : ''}. Si nos escribes por WhatsApp, se aplican también las condiciones de WhatsApp (Meta).</p>
<h2>6. Tus derechos</h2><p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad, y retirar tu consentimiento en cualquier momento, escribiendo a info@platagarage.com. Si crees que no hemos atendido bien tu petición, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
<h2>7. Cookies</h2><p>${CTX.gtag || CTX.pixel ? 'Solo si lo aceptas, usamos cookies de Google y Meta para medir nuestros anuncios.' : 'Esta web no instala cookies de publicidad ni de analítica.'} Los favoritos y tu elección sobre cookies se guardan solo en tu navegador. Tienes el detalle en la <a href="${B}/cookies">política de cookies</a>.</p></div></section>`;
  return page({ title: 'Política de privacidad | Plata Garage', desc: 'Política de privacidad de Plata Garage', body, path: '/privacidad' });
}

export function avisoLegal() {
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Aviso legal</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Titulares de la web</h2><p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que esta web es una plataforma de venta de vehículos de ocasión operada conjuntamente, bajo el nombre comercial «Plata Garage», por los siguientes profesionales autónomos, con actividad de compraventa de vehículos de ocasión:</p>${TITULARES}<p>Contacto común: info@platagarage.com · ${TEL}.</p>
<h2>2. Objeto y uso</h2><p>Este aviso regula el acceso y uso de la web. Al navegar por ella aceptas estas condiciones. Te comprometes a hacer un uso adecuado de la web y a no emplearla para fines ilícitos.</p>
<h2>3. Información de los vehículos</h2><p>Los datos, fotos y precios de los vehículos son orientativos y no vinculantes: pueden contener errores y cambiar sin previo aviso. Las condiciones de cada operación son las que figuren en el contrato de compraventa. Los vehículos tienen garantía de 12 meses.</p>
<h2>4. Propiedad intelectual</h2><p>Los textos, fotografías, logotipos y el diseño de esta web pertenecen a sus titulares o se usan con autorización. No se pueden reproducir sin permiso.</p>
<h2>5. Responsabilidad</h2><p>No nos hacemos responsables de los daños derivados de un uso indebido de la web ni de interrupciones del servicio por causas ajenas. Los enlaces a otras webs se ofrecen solo como referencia.</p>
<h2>6. Legislación aplicable</h2><p>Este aviso se rige por la legislación española. Para cualquier controversia, y salvo que la normativa de consumidores disponga otra cosa, serán competentes los juzgados y tribunales del domicilio del consumidor.</p></div></section>`;
  return page({ title: 'Aviso legal | Plata Garage', desc: 'Aviso legal de Plata Garage', body, path: '/aviso-legal' });
}

export function condiciones() {
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Condiciones de contratación</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Vendedores</h2><p>Los vehículos de esta web los vende, según el caso, uno de estos dos profesionales autónomos, que operan bajo el nombre comercial «Plata Garage»:</p>${TITULARES}<p>Contacto: info@platagarage.com · ${TEL}.</p>
<h2>2. Objeto</h2><p>Estas condiciones regulan la reserva y, en su caso, la compraventa de los vehículos de ocasión que ofrecemos en esta web.</p>
<h2>3. Vendedor de cada vehículo</h2><p>Cada vehículo lo vende uno de los dos vendedores indicados. El vendedor concreto figura en el documento de reserva, en el contrato de compraventa y en la factura. La señal, la factura y la garantía corresponden a ese mismo vendedor.</p>
<h2>4. Reserva y señal</h2><p>4.1. En los vehículos que lo indican puedes reservar con una señal. Antes te confirmamos que el vehículo sigue disponible y te explicamos las condiciones; después puedes pagar la señal por Bizum o por transferencia bancaria a la cuenta del vendedor. En esta web no se hacen pagos con tarjeta.</p><p>4.2. Una vez recibida la señal, el vehículo queda reservado a tu favor durante siete (7) días naturales y se retira de la venta.</p><p>4.3. Si formalizas la compra, el importe de la señal se descuenta del precio total.</p><p>4.4. Si decides no comprar, la señal no se devuelve, sin perjuicio del derecho de desistimiento que te corresponda como consumidor según el punto 7. La señal se devuelve íntegra si el vendedor no puede llevar a cabo la venta o si el vehículo no se corresponde con lo ofertado.</p>
<h2>5. Precio y forma de pago</h2><p>5.1. Los precios están en euros. Si la operación tiene algún gasto adicional, se te indicará antes de formalizarla.</p><p>5.2. Los vehículos de ocasión pueden venderse bajo el Régimen Especial de Bienes Usados (REBU); en ese caso el IVA no se desglosa en la factura.</p><p>5.3. El resto del precio se paga en la entrega, por transferencia, financiación u otro medio acordado con el vendedor.</p>
<h2>6. Garantía</h2><p>Los vehículos vendidos a consumidores tienen la garantía que establece el Real Decreto Legislativo 1/2007 (TRLGDCU). Ofrecemos una garantía de doce (12) meses, en los términos que se detallan en el contrato de compraventa y en el documento de garantía que se entrega con el vehículo. La presta el vendedor del vehículo.</p>
<h2>7. Derecho de desistimiento</h2><p>7.1. Si la reserva se contrata a distancia, como consumidor dispones de catorce (14) días naturales para desistir de ella sin dar explicaciones, según el TRLGDCU y salvo las excepciones previstas en la ley.</p><p>7.2. Para ejercerlo basta con comunicarlo de forma clara a info@platagarage.com.</p><p>7.3. La compraventa del vehículo se firma y se entrega de forma presencial.</p><p>7.4. Las reservas hechas en persona, en nuestras instalaciones, no son contratos a distancia y no tienen este derecho de desistimiento; se rigen por el documento de reserva firmado.</p>
<h2>8. Protección de datos</h2><p>Tratamos los datos de la reserva o la compra según nuestra <a href="${B}/privacidad">política de privacidad</a>.</p>
<h2>9. Legislación aplicable</h2><p>Estas condiciones se rigen por la legislación española. Para cualquier controversia son competentes los juzgados y tribunales de Sabadell (Barcelona), salvo el fuero que la ley reconozca al consumidor.</p></div></section>`;
  return page({ title: 'Condiciones de contratación | Plata Garage', desc: 'Condiciones de reserva y compraventa de vehículos de Plata Garage', body, path: '/condiciones-de-contratacion' });
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
  return page({ title: 'Te buscamos coche en Sabadell | Plata Garage', desc: 'Dinos qué coche de segunda mano buscas y tu presupuesto y te lo buscamos. Sin compromiso.', body, script: FORM_JS, path: '/te-lo-buscamos' });
}

export function cuantoVale({ car, z } = {}) {
  const y = new Date().getFullYear();
  const enZ = z ? ` en ${esc(z.name)}` : '';
  const faqs = [
    ['¿La valoración es gratis?', 'Sí. Es gratis y sin compromiso: nos cuentas qué coche tienes y te respondemos en 24 horas laborables.'],
    ['¿La cifra que me dais es definitiva?', 'No. Es una valoración orientativa con los datos que nos das. El precio final depende de ver el coche en persona y comprobar su documentación.'],
    ['¿Qué miráis para valorar un coche?', 'Año y kilómetros, el mantenimiento que se le ha hecho, el estado de chapa, interior y neumáticos, la ITV, si tiene cargas y cuánta demanda real tiene ese modelo ahora mismo.'],
    ['¿Puedo entregarlo como parte del pago de uno de vuestros coches?', 'Sí. Al pedir la valoración dinos qué coche te interesa y te decimos cuánto te quedaría por pagar.'],
    ['¿Y si todavía lo estoy pagando?', 'Se puede estudiar. Si tiene reserva de dominio de una financiera hay que cancelarla antes de la venta; lo vemos contigo caso por caso.'],
    ['¿Qué documentación necesito?', 'Permiso de circulación, ficha técnica con la ITV en vigor y tu DNI. Si tienes las facturas del mantenimiento, mejor.'],
    ...(z ? [[`Soy de ${z.name}, ¿tengo que ir a Sabadell?`, z.km ? `Para darte la valoración orientativa no hace falta: lo hacemos con los datos que nos envías. Para el precio final quedamos con cita en Sabadell, a unos ${z.km} km de ${z.name}.` : 'Para la valoración orientativa no hace falta venir. Para el precio final quedamos con cita en nuestro local de Sabadell.']] : []),
  ];
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${I('<path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z"/><circle cx="7" cy="7" r="1.5"/>')}Tasación gratuita</div><h1 class="s">${z ? `Vender mi coche <span class="gr">en ${esc(z.name)}</span>` : '¿Cuánto vale <span class="gr">mi coche?</span>'}</h1>
${car ? `<div class="box" style="max-width:720px;display:flex;gap:14px;align-items:center"><img src="${esc(im(cover(car), 200))}" alt="" width="96" height="72" style="border-radius:10px;object-fit:cover"><div><b>Para entregarlo como parte del pago del ${esc(carName(car))} (${car.year})</b><div class="mu" style="font-size:14px">${eur(car.price)} · Te diremos cuánto te quedaría por pagar.</div></div></div>` : ''}
<p class="lead" style="max-width:640px">${z ? `¿Vives en ${esc(z.name)} y quieres saber cuánto te darían por tu coche? ` : ''}Responde 4 preguntas rápidas y te damos una valoración orientativa, hecha por una persona y no por un algoritmo, en 24 horas laborables. Sin compromiso de venta.</p>
<div class="box wz" style="padding:28px"><div class="stp2"><i class="on"></i><i></i><i></i><i></i></div>
<form class="f" data-api="${B}/api/tasacion" data-t="tasacion" novalidate id="wz">${hp()}${car ? `<input type="hidden" name="coche" value="${car.slug}">` : ''}
<fieldset class="on"><legend>1. ¿Qué coche es?</legend><div class="f2"><label>Marca *<input name="marca" required maxlength="40" placeholder="Seat"></label><label>Modelo *<input name="modelo" required maxlength="60" placeholder="León 1.5 TSI"></label></div>
<div class="f2"><label>Año de matriculación *<input name="anio" required inputmode="numeric" maxlength="4" placeholder="${y - 8}"></label><label>Kilómetros *<input name="km" required inputmode="numeric" maxlength="7" placeholder="120000"></label></div></fieldset>
<fieldset><legend>2. Motor y cambio</legend><span class="note">Combustible</span>${opts('combustible', ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico', 'GLP'])}<span class="note">Cambio</span>${opts('cambio', ['Manual', 'Automático'])}</fieldset>
<fieldset><legend>3. ¿Cómo está?</legend><span class="note">Estado general</span>${opts('estado', ['Como nuevo', 'Bien, uso normal', 'Con detalles de chapa o interior', 'Necesita reparación'])}<span class="note">ITV</span>${opts('itv', ['En vigor', 'Caducada', 'No lo sé'])}
<label>¿Algo que debamos saber?<textarea name="notas" maxlength="1500" placeholder="Extras, golpes, mantenimiento, un solo propietario…"></textarea></label></fieldset>
<fieldset><legend>4. ¿Dónde te enviamos la valoración?</legend>${contactFields()}${priv()}<div class="msg" role="alert"></div></fieldset>
<div class="row" style="justify-content:space-between;margin-top:6px"><button class="btn g" type="button" id="wzb" style="visibility:hidden">Atrás</button><button class="btn" type="button" id="wzn">Siguiente</button><button class="btn" type="submit" id="wzs" style="display:none">Recibir mi valoración</button></div></form>
<p class="note">Valoración orientativa y no vinculante: el precio final depende de ver el coche en persona.</p></div>
<div style="margin-top:56px"><h2>Cómo funciona</h2><div class="two" style="margin-top:18px;gap:16px">
<div class="box" style="margin:0"><b>1. Nos cuentas qué coche tienes</b><p class="mu" style="margin:6px 0 0">Marca, modelo, año, kilómetros y cómo está. Te lleva un par de minutos.</p></div>
<div class="box" style="margin:0"><b>2. Te enviamos una valoración orientativa</b><p class="mu" style="margin:6px 0 0">La hace una persona, mirando el mercado real de ese coche, en 24 horas laborables.</p></div>
<div class="box" style="margin:0"><b>3. Si te encaja, lo vemos en persona</b><p class="mu" style="margin:6px 0 0">Quedamos con cita en Sabadell, revisamos el coche y la documentación y te damos el precio final.</p></div>
<div class="box" style="margin:0"><b>4. Tú decides</b><p class="mu" style="margin:6px 0 0">Sin compromiso: si no te convence, no pasa nada.</p></div></div></div>
<div style="margin-top:48px"><h2>Qué puedes hacer con tu coche</h2><ul class="mu" style="line-height:1.7;margin-top:12px;max-width:720px">
<li><b style="color:#fff">Vendérnoslo:</b> si encaja con lo que buscamos para nuestro stock, te hacemos una oferta.</li>
<li><b style="color:#fff">Entregarlo como parte del pago</b> de uno de <a href="${B}/vehiculos/" style="color:var(--or)">nuestros coches</a>.</li>
<li><b style="color:#fff">Que lo vendamos por ti:</b> nos encargamos de anunciarlo, de atender a los interesados y de todo el papeleo de la venta. Te explicamos las condiciones por escrito antes de firmar nada.</li></ul></div>
<div style="margin-top:56px">${faqHtml(faqs)}</div>
<p class="note" style="margin-top:24px">${z ? `También valoramos coches de ${ZONAS_VENTA.filter((x) => x.slug !== z.slug).map((x) => `<a href="${B}/vender-mi-coche-${x.slug}">${esc(x.name)}</a>`).join(', ')} y del resto del Vallès. <a href="${B}/cuanto-vale-mi-coche">Tasación en Sabadell</a>.` : `También valoramos coches de ${ZONAS_VENTA.map((x) => `<a href="${B}/vender-mi-coche-${x.slug}">${esc(x.name)}</a>`).join(', ')} y del resto del Vallès.`}</p>
<p class="note" style="margin-top:10px">Información orientativa: puede contener errores y no es vinculante.</p></div></section>`;
  const script = `(()=>{const f=document.getElementById('wz'),fs=[...f.querySelectorAll('fieldset')],bar=[...document.querySelectorAll('.stp2 i')],b=document.getElementById('wzb'),n=document.getElementById('wzn'),sb=document.getElementById('wzs');let k=0;
const go=i=>{k=i;fs.forEach((x,j)=>x.classList.toggle('on',j===k));bar.forEach((x,j)=>x.classList.toggle('on',j<=k));b.style.visibility=k?'visible':'hidden';n.style.display=k<fs.length-1?'':'none';sb.style.display=k===fs.length-1?'':'none'};
n.onclick=()=>{const bad=[...fs[k].querySelectorAll('[required]')].find(x=>!x.value.trim());if(bad){bad.focus();bad.reportValidity&&bad.reportValidity();return}go(k+1)};b.onclick=()=>go(k-1)})();${FORM_JS}`;
  const path = z ? `/vender-mi-coche-${z.slug}` : '/cuanto-vale-mi-coche';
  const tz = z ? `Vender mi coche en ${z.name}: tasación gratis | Plata Garage` : '';
  return page({ title: z ? (tz.length <= 64 ? tz : `Vender mi coche en ${z.name} | Plata Garage`) : '¿Cuánto vale mi coche? Tasación gratis en Sabadell | Plata Garage', desc: z ? `¿Quieres vender tu coche en ${z.name}? Te damos una valoración orientativa gratis, hecha por una persona, en 24 horas laborables. Sin compromiso.`.slice(0, 158) : 'Pide una valoración orientativa de tu coche, hecha por una persona, en 24 horas laborables. Gratis y sin compromiso.', body, script, path, head: ld(ldFaq(faqs)) + ld(ldCrumb([['Inicio', '/'], z ? ['¿Cuánto vale mi coche?', '/cuanto-vale-mi-coche'] : null, [z ? `Vender mi coche en ${z.name}` : '¿Cuánto vale mi coche?']].filter(Boolean))) });
}

// Markdown sencillo y seguro (escapa todo el HTML)
export function md(src = '') {
  const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\((\/platagarage\/[^\s)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (m, t, u) => (u = u.replace(/^\/platagarage(?=\/|$)(?!\/(?:assets|img|media)\/)/, '') || '/', `<a href="${u}"${u.startsWith('/') ? '' : ' rel="noopener" target="_blank"'}>${t}</a>`));
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
  return page({ title: 'Blog | Plata Garage', desc: 'Guías y consejos para comprar un coche de segunda mano en Sabadell.', on: 'blog', body, path: '/blog/' });
}

export function blogPost({ post: p, cars }) {
  const ldA = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, datePublished: p.publishedAt, dateModified: p.updated || p.publishedAt, image: p.cover || undefined, publisher: { '@id': `${CTX.site}${B}/#negocio` } };
  const body = `<div class="w"><div class="crumb"><a href="${B}/blog/">${ic.back}Volver al blog</a></div><article class="post" style="padding:30px 0 60px"><p class="note">${fechaLarga(p.publishedAt)}${p.tags?.length ? ' · ' + p.tags.map(esc).join(' · ') : ''}</p><h1 class="s">${esc(p.title)}</h1>${p.cover ? `<img src="${esc(p.cover)}" alt="${esc(p.title)}" style="margin:24px 0">` : ''}${md(p.body)}</article>
${(() => { const tx = normTxt(`${p.title} ${(p.tags || []).join(' ')} ${p.body || ''}`);
  // Siguiente paso según el tema del artículo
  const [h, t, bt, url] = /vender|tasaci|cuanto vale|parte de pago|entregar mi coche/.test(tx) ? ['¿Quieres saber cuánto vale tu coche?', 'Te damos una valoración orientativa y, si te interesa, lo dejamos como parte de pago.', 'Valorar mi coche', `${B}/cuanto-vale-mi-coche`]
    : ['¿Buscas coche?', 'Mira lo que tenemos ahora o dinos qué buscas y te lo buscamos nosotros, sin compromiso.', 'Que me lo busquen', `${B}/te-lo-buscamos`];
  // Coches relacionados: los que más palabras comparten con el artículo (marca, modelo, combustible, carrocería)
  const rel = cars.map((c) => ({ c, s: [c.brand, c.model, c.fuel, c.body, c.trans].filter(Boolean).reduce((a, w) => a + (tx.includes(normTxt(w)) ? (w === c.brand || w === c.model ? 3 : 1) : 0), 0) })).sort((x, y) => y.s - x.s || x.c.price - y.c.price).slice(0, 3).map((x) => x.c);
  return `<div class="box" style="padding:26px;margin:0 0 50px"><h3>${h}</h3><p class="mu" style="margin:6px 0 16px">${t}</p><div class="row"><a class="btn" href="${url}">${bt}</a><a class="btn g" href="${B}/vehiculos/">Ver el stock</a></div></div>
<section style="padding:0 0 80px"><h2 style="font-size:30px;margin-bottom:24px">Coches que te pueden interesar</h2><div class="grid">${rel.map(card).join('')}</div></section></div>`; })()}`;
  return page({ title: `${p.title} | Plata Garage`, desc: p.excerpt || p.title, on: 'blog', body, head: ld(ldA), path: `/blog/${p.slug}`, image: p.cover });
}

export function notFound(msg = 'Esta página no existe o el coche ya no está disponible.') {
  return page({ noindex: true, title: 'Página no encontrada | Plata Garage', desc: msg, body: `<section><div class="w"><div class="cta"><h2>Vaya…</h2><p class="lead">${esc(msg)}</p><div class="row"><a class="btn" href="${B}/vehiculos/">Ver coches en stock</a></div></div></div></section>` });
}

const AV = '45';
export function adminShell() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Backoffice · Plata Garage</title><link rel="icon" href="${ST}/assets/icon-192.png"><link rel="manifest" href="${ST}/assets/manifest.webmanifest"><link rel="apple-touch-icon" href="${ST}/assets/icon-192.png"><meta name="theme-color" content="#050505"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Plata Garage"><link rel="stylesheet" href="${ST}/assets/admin.css?v=${AV}"></head><body><div id="app"></div><script src="${ST}/assets/admin.js?v=${AV}"></script></body></html>`;
}

// ---------- páginas de SEO local ----------
const ldList = (cars) => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: cars.slice(0, 30).map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`${B}/vehiculos/${c.slug}`), name: `${carName(c)} ${c.year}` })) });
const ldCrumb = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, ...(u ? { item: abs(B + u) } : {}) })) });
// Formulario corto "te lo buscamos" con lo que buscaba ya puesto: que nadie se vaya sin dejar el contacto cuando no tenemos su coche
const buscaMini = ({ titulo, sub = '', pre = {}, id = '', oculto = false }) => `<div class="box bm"${id ? ` id="${id}"` : ''} style="padding:26px;max-width:760px;margin-top:22px${oculto ? ';display:none' : ''}"><h3>${esc(titulo)}</h3>${sub ? `<p class="mu" style="margin:6px 0 16px">${sub}</p>` : ''}<form class="f" data-api="${B}/api/busqueda" data-t="busqueda" novalidate>${hp()}${['marca', 'modelo', 'combustible', 'cambio', 'mensaje'].map((k) => `<input type="hidden" name="${k}" value="${esc(pre[k] || '')}">`).join('')}
<label>Presupuesto máximo (€)<input name="presupuesto" inputmode="numeric" maxlength="7" value="${pre.presupuesto || ''}" placeholder="12000"></label>${contactFields()}${priv()}
<label class="chk"><input type="checkbox" name="avisar" value="si"><span>Además, avisadme por email cuando entre un coche así (opcional; me puedo dar de baja cuando quiera).</span></label><div class="msg" role="alert"></div><button class="btn" type="submit">Que me lo busquen</button></form></div>`;
const vacio = (txt, pre = {}) => buscaMini({ titulo: `Ahora mismo no tenemos ${txt} en stock`, sub: `El stock cambia cada semana. Déjanos tus datos y te lo buscamos nosotros, sin compromiso. O <a href="${B}/vehiculos/" style="color:var(--or)">mira todo el stock</a>.`, pre: { mensaje: `Buscaba ${txt}`, ...pre } });

export function landingPage({ l, cars }) {
  const list = [...l.cars].sort((a, b) => a.price - b.price);
  const h1 = l.kind === 'marca' ? `${l.h} de segunda mano en Sabadell` : `${l.h} de segunda mano en Sabadell`;
  const faqs = [
    [`¿Cuántos ${l.kind === 'marca' ? l.h : l.h.toLowerCase()} tenéis ahora?`, list.length ? `Ahora mismo tenemos ${list.length} en stock${list.length ? `, desde ${eur(list[0].price)}` : ''}. El stock cambia cada semana: lo que ves en esta página está actualizado.` : 'Ahora mismo ninguno, pero el stock cambia cada semana. Déjanos tu email en el aviso de coches nuevos o pídenos que te lo busquemos.'],
    FAQ[0], FAQ[1], FAQ[2],
  ];
  const rel = l.kind === 'marca' ? tiposConStock(cars).slice(0, 10).map((t) => [t.slug, t.h]) : marcas(cars).map((m) => [m.slug, m.name]);
  const body = `<section style="padding-top:56px" class="lh"><div class="w"><div class="crumb" style="padding:0 0 18px"><a href="${B}/vehiculos/">${ic.back}Todo el stock</a></div><div class="pill"><i></i>${list.length} en stock</div><h1 class="s">${esc(l.h)} <span class="gr">de segunda mano en Sabadell</span></h1>
<p class="lead">${esc(l.txt)} Todos con garantía de 12 meses y atención con cita previa.</p>
${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : vacio(l.kind === 'marca' ? l.h : l.h.toLowerCase(), l.kind === 'marca' ? { marca: l.h } : {})}
<div class="chipl" style="margin-top:34px">${rel.map(([s, t]) => `<a href="${B}/coches/${s}">${esc(t)}</a>`).join('')}</div>
<div style="margin-top:56px">${faqHtml(faqs)}</div></div></section>`;
  const title = `${h1} | Plata Garage`.length <= 62 ? `${h1} | Plata Garage` : `${l.h} en Sabadell | Plata Garage`;
  return page({ title, desc: `${l.h} de segunda mano en Sabadell: ${list.length} en stock${list.length ? ` desde ${eur(list[0].price)}` : ''}, con garantía de 12 meses. Pide cita y ven a verlos.`.slice(0, 158), on: 'veh', body, alert: !!list.length, script: list.length ? '' : FORM_JS, path: `/coches/${l.slug}`, noindex: !list.length, image: list[0]?.images?.[0], head: ld(ldList(list)) + ld(ldFaq(faqs)) + ld(ldCrumb([['Inicio', '/'], ['Vehículos', '/vehiculos/'], [l.h]])) });
}

export function zona({ z, cars }) {
  const list = [...cars].sort((a, b) => (b.featured - a.featured) || (b.price - a.price));
  const lejos = z.km >= 15;
  const faqs = [
    [`¿Dónde estáis? ¿Me queda lejos desde ${z.name}?`, z.km ? `Estamos en Sabadell, a unos ${z.km} km de ${z.name} en línea recta. Atendemos con cita previa: al pedirla te indicamos cómo llegar.` : 'Estamos en Sabadell y atendemos con cita previa. Al pedir cita te indicamos cómo llegar.'],
    [`¿Me podéis llevar el coche a ${z.name}?`, 'Sí, es posible. Indícanos tu código postal en la ficha del coche y te pasamos presupuesto del envío, sin compromiso.'],
    FAQ[0], FAQ[1],
  ];
  const body = `<section style="padding-top:56px" class="lh"><div class="w"><div class="pill">${I('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>')}${esc(z.name)}</div><h1 class="s">Coches de segunda mano <span class="gr">${z.slug === 'sabadell' ? 'en Sabadell' : 'cerca de ' + esc(z.name)}</span></h1>
<p class="lead">${esc(z.txt)} Tenemos ${list.length} coches en stock, todos con garantía de 12 meses.</p>
<div class="row" style="margin-bottom:34px"><a class="btn" href="${B}/cita">Pedir cita</a><a class="btn g" href="${wa(`Hola, soy de ${z.name} y quería información sobre un coche.`)}" rel="noopener">${ic.wa}WhatsApp</a>${lejos ? `<a class="btn g" href="${B}/vehiculos/">Ver coches y pedir envío</a>` : ''}</div>
<div class="grid">${list.slice(0, 12).map(card).join('')}</div>${list.length > 12 ? `<p style="text-align:center;margin-top:30px"><a class="btn g" href="${B}/vehiculos/">Ver los ${list.length} coches ${ic.arrow}</a></p>` : ''}
<div class="chipl" style="margin-top:34px">${tiposConStock(cars).slice(0, 10).map((t) => `<a href="${B}/coches/${t.slug}">${esc(t.h)}</a>`).join('')}</div>
<div style="margin-top:56px">${faqHtml(faqs)}</div>
<p class="note" style="margin-top:24px">También atendemos a clientes de ${ZONAS.filter((x) => x.slug !== z.slug).map((x) => `<a href="${B}/coches-segunda-mano-${x.slug}">${esc(x.name)}</a>`).join(', ')}.</p></div></section>`;
  const t = z.slug === 'sabadell' ? 'Coches de segunda mano en Sabadell | Plata Garage' : `Coches de segunda mano cerca de ${z.name} | Plata Garage`;
  return page({ title: t.length <= 64 ? t : `Coches de ocasión cerca de ${z.name} | Plata Garage`, desc: `Coches de segunda mano para ${z.name}: ${list.length} en stock en Sabadell con garantía de 12 meses. Pide cita o pide el envío a casa.`.slice(0, 158), body, alert: true, path: `/coches-segunda-mano-${z.slug}`, head: ld(ldList(list)) + ld(ldFaq(faqs)) + ld(ldCrumb([['Inicio', '/'], [`Coches cerca de ${z.name}`]])) });
}

export function faqPage({ cars }) {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${ic.chat}Dudas</div><h1 class="s">Preguntas <span class="gr">frecuentes</span></h1><p class="lead" style="max-width:640px">Lo que más nos preguntáis antes de venir. Si te queda alguna duda, escríbenos por <a href="${wa('Hola, tengo una duda.')}" style="color:var(--or)">WhatsApp</a>.</p>
${faqHtml(FAQ, '')}<div style="margin-top:36px"><h2 style="font-size:clamp(22px,2.4vw,28px)">¿Qué necesitas?</h2><div class="row" style="margin-top:16px;flex-wrap:wrap"><a class="btn" href="${B}/vehiculos/">Ver los ${cars.length} coches en stock</a><a class="btn g" href="${B}/cita">Pedir cita</a><a class="btn g" href="${B}/te-lo-buscamos">Pedir mi coche a la carta</a><a class="btn g" href="${B}/cuanto-vale-mi-coche">Valorar mi coche</a><a class="btn g" href="${wa('Hola, tengo una duda.')}" rel="noopener">${ic.wa}WhatsApp</a></div></div></div></section>`;
  return page({ title: 'Preguntas frecuentes | Plata Garage', desc: 'Cita previa, garantía de 12 meses, financiación, reserva, tasación de tu coche y envío a domicilio: resolvemos tus dudas.', body, path: '/preguntas-frecuentes', head: ld(ldFaq(FAQ)) });
}

// ---------- favoritos y comparador (todo dentro de la web) ----------
export function favoritos({ cars }) {
  const body = `<section style="padding-top:56px"><div class="w"><div class="pill">${heart}Favoritos</div><h1 class="s">Tus coches <span class="gr">guardados</span></h1>
<p class="lead" style="max-width:640px">Pulsa el corazón de cualquier coche para guardarlo aquí. Marca hasta 3 para compararlos lado a lado.</p>
<div class="row" style="margin-bottom:22px"><a class="btn" id="cmpb" href="#">Comparar seleccionados (0)</a><a class="btn g" href="${B}/vehiculos/">Seguir mirando</a></div>
<div class="grid" id="g">${cars.map((c) => `<div class="fwrap" data-s="${c.slug}" style="display:none">${card(c)}<label class="chk" style="margin-top:10px;font-size:14px"><input type="checkbox" data-cmp="${c.slug}">Comparar</label></div>`).join('')}</div>
<p class="mu" id="z" style="display:none">Todavía no has guardado ningún coche. <a href="${B}/vehiculos/" style="color:var(--or)">Mira el stock</a> y pulsa el corazón en los que te gusten.</p></div></section>`;
  const script = `(()=>{const get=()=>{try{return JSON.parse(localStorage.getItem('pg_fav')||'[]')}catch(x){return[]}};const draw=()=>{const a=get();let n=0;document.querySelectorAll('.fwrap').forEach(e=>{const on=a.includes(e.dataset.s);e.style.display=on?'':'none';if(on)n++});document.getElementById('z').style.display=n?'none':''};
draw();document.addEventListener('pgfav',draw);const b=document.getElementById('cmpb');const upd=()=>{const s=[...document.querySelectorAll('[data-cmp]:checked')].map(x=>x.dataset.cmp);b.textContent='Comparar seleccionados ('+s.length+')';b.href=s.length>1?'${B}/comparar?c='+s.join(','):'#'};
document.querySelectorAll('[data-cmp]').forEach(x=>x.onchange=()=>{const s=document.querySelectorAll('[data-cmp]:checked');if(s.length>3){x.checked=false;return}upd()});b.onclick=e=>{if(b.getAttribute('href')==='#'){e.preventDefault();alertMsg()}};function alertMsg(){b.textContent='Marca 2 o 3 coches para comparar'}})();`;
  return page({ title: 'Mis favoritos | Plata Garage', desc: 'Tus coches guardados en Plata Garage.', body, script, noindex: true });
}

export function comparar({ cars }) {
  const rows = [['Precio', (c) => eur(c.price)], ['Año', (c) => c.year], ['Kilómetros', (c) => kms(c.km)], ['Combustible', (c) => esc(c.fuel)], ['Cambio', (c) => esc(c.trans)], ['Potencia', (c) => (c.cv ? c.cv + ' CV' : '—')], ['Carrocería', (c) => esc(c.body || '—')], ['Plazas', (c) => c.seats || '—'], ['Puertas', (c) => c.doors || '—'], ['Color', (c) => esc(c.color || '—')], ['Etiqueta DGT', (c) => esc(etiquetaDe(c) || '—')], ['Garantía', () => '12 meses'], ['Equipamiento', (c) => (c.features || []).slice(0, 8).map(esc).join('<br>') || '—']];
  const body = `<section style="padding-top:56px"><div class="w"><div class="crumb" style="padding:0 0 18px"><a href="${B}/favoritos">${ic.back}Volver a favoritos</a></div><h1 class="s">Comparar <span class="gr">coches</span></h1>
${cars.length < 2 ? `<p class="lead">Elige al menos 2 coches en <a href="${B}/favoritos" style="color:var(--or)">tus favoritos</a> para compararlos.</p>` : `<div class="cmp" style="margin-top:28px"><table><thead><tr><th></th>${cars.map((c) => `<td><a href="${B}/vehiculos/${c.slug}"><img src="${esc(im(cover(c), 500))}" alt="${esc(carName(c))}" loading="lazy"></a><b style="display:block;margin-top:8px">${esc(c.brand)} ${esc(c.model)}</b><span class="mu" style="font-size:13px">${esc(c.version || '')}</span></td>`).join('')}</tr></thead>
<tbody>${rows.map(([k, f]) => `<tr><th>${k}</th>${cars.map((c) => `<td>${f(c)}</td>`).join('')}</tr>`).join('')}<tr><th></th>${cars.map((c) => `<td><a class="btn sm" data-cc="${c.slug}" href="${B}/cita?coche=${c.slug}">Pedir cita</a></td>`).join('')}</tr></tbody></table></div>
<p class="note" style="margin-top:16px">Datos orientativos y no vinculantes; pueden contener errores. Confírmalos con nosotros antes de decidir.</p>`}</div></section>`;
  // Medición de la prueba del comparador (sin cookies): cuántas comparaciones y cuántos contactan desde aquí
  const sl = JSON.stringify(cars.map((c) => c.slug));
  const script = `(()=>{const snd=o=>{try{navigator.sendBeacon('${B}/api/hit',new Blob([JSON.stringify(o)],{type:'application/json'}))}catch(x){}};const sl=${sl};if(sl.length>1)snd({e:'cmp',c:sl.slice().sort().join('+')});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(a.dataset.cc)snd({e:'cmpc',c:a.dataset.cc,k:'cita'});else if((a.getAttribute('href')||'').startsWith('https://wa.me'))snd({e:'cmpc',k:'wa'})},true)})();`;
  return page({ title: 'Comparar coches | Plata Garage', desc: 'Compara coches de Plata Garage lado a lado.', body, script, noindex: true });
}

export function cookies() {
  const ads = !!(CTX.gtag || CTX.pixel || CTX.clarity);
  const body = `<section style="padding-top:56px"><div class="w post legal"><h1 class="s">Política de cookies</h1><p class="note">Última actualización: octubre de 2026.</p>
<h2>1. Qué usamos</h2><ul><li><b>Técnicas y necesarias</b> (sin consentimiento, art. 22.2 LSSI): guardar en tu navegador los coches que marcas como favoritos y tu elección sobre las cookies, y la cookie de sesión del panel interno de gestión.</li>
<li><b>Medición propia sin cookies:</b> contamos visitas de forma agregada sin instalar cookies ni guardar datos que te identifiquen.</li>
${CTX.clarity ? '<li><b>Analítica (solo si aceptas):</b> Microsoft Clarity (Microsoft Ireland Operations Ltd.) registra de forma seudónima cómo se navega por la web (clics, desplazamiento, mapas de calor y grabaciones de la sesión) para detectar qué no funciona y mejorarla. No graba lo que escribes en los formularios. Cookies: _clck (1 año) y _clsk (1 día). Puede implicar transferencias internacionales con las garantías de Microsoft.</li>' : ''}
${CTX.gtag || CTX.pixel ? `<li><b>Publicidad (solo si aceptas):</b> ${CTX.gtag ? 'Google Ads / Google Analytics (Google Ireland Ltd.)' : ''}${CTX.gtag && CTX.pixel ? ' y ' : ''}${CTX.pixel ? 'Meta Pixel (Meta Platforms Ireland Ltd.)' : ''}, para medir qué anuncios funcionan y mostrar anuncios relevantes. Pueden implicar transferencias internacionales con las garantías de sus proveedores.</li>` : '<li><b>Publicidad:</b> ahora mismo no usamos cookies de publicidad. Si las activamos, te pediremos permiso antes.</li>'}</ul>
<h2>2. Cómo cambiar tu elección</h2><p>${ads ? 'Puedes aceptar, rechazar o elegir por tipo cuando quieras desde "Configurar cookies", al pie de cada página. Rechazarlas no impide usar la web.' : 'No hace falta: no instalamos cookies que requieran consentimiento.'} También puedes borrar las cookies desde la configuración de tu navegador.</p>
<h2>3. Más información</h2><p>Consulta nuestra <a href="${B}/privacidad">política de privacidad</a> o escríbenos a info@platagarage.com.</p></div></section>`;
  return page({ title: 'Política de cookies | Plata Garage', desc: 'Política de cookies de Plata Garage', body, path: '/cookies' });
}

