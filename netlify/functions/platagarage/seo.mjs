// Páginas de SEO local: zonas del Vallès, tipos de coche y marcas (se generan solas a partir del stock)
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Distancias en línea recta desde el centro de Sabadell, redondeadas (orientativas)
export const ZONAS = [
  { slug: 'sabadell', name: 'Sabadell', km: 0, txt: 'Estamos en Sabadell. Si eres de aquí, pide cita y ven a ver el coche con calma, el día y la hora que mejor te vayan.' },
  { slug: 'terrassa', name: 'Terrassa', km: 9, txt: 'Desde Terrassa estás a unos minutos de nosotros por la C-58. Pide cita, ven a ver el coche y pruébalo sin prisas.' },
  { slug: 'sant-cugat', name: 'Sant Cugat del Vallès', km: 9, txt: 'Si vives en Sant Cugat del Vallès, Sabadell te queda muy cerca. Elige día y hora y te tenemos el coche preparado.' },
  { slug: 'barbera-del-valles', name: 'Barberà del Vallès', km: 4, txt: 'Barberà del Vallès está pegada a Sabadell: en pocos minutos estás viendo el coche que te interesa.' },
  { slug: 'cerdanyola', name: 'Cerdanyola del Vallès', km: 7, txt: 'Desde Cerdanyola del Vallès llegas a Sabadell en un momento por la C-58. Reserva tu visita y te atendemos sin esperas.' },
  { slug: 'ripollet', name: 'Ripollet', km: 7, txt: 'Si eres de Ripollet, estamos al lado. Mira el stock, pide cita y ven a verlo sin compromiso.' },
  { slug: 'badia-del-valles', name: 'Badia del Vallès', km: 5, txt: 'Badia del Vallès está a un paso de Sabadell. Pide cita y te enseñamos el coche con tranquilidad.' },
  { slug: 'sant-quirze-del-valles', name: 'Sant Quirze del Vallès', km: 3, txt: 'Desde Sant Quirze del Vallès estás prácticamente en Sabadell. Elige el coche, pide cita y ven a probarlo.' },
  { slug: 'castellar-del-valles', name: 'Castellar del Vallès', km: 7, txt: 'Si vives en Castellar del Vallès, bajas a Sabadell en pocos minutos. Te esperamos con cita previa.' },
  { slug: 'santa-perpetua-de-mogoda', name: 'Santa Perpètua de Mogoda', km: 6, txt: 'Santa Perpètua de Mogoda está muy cerca de Sabadell. Mira el stock y reserva tu visita sin compromiso.' },
  { slug: 'polinya', name: 'Polinyà', km: 4, txt: 'Desde Polinyà llegas a Sabadell en nada. Pide cita y ven a ver el coche cuando te vaya bien.' },
  { slug: 'rubi', name: 'Rubí', km: 9, txt: 'Si eres de Rubí, Sabadell te queda a pocos minutos. Elige día y hora y te atendemos personalmente.' },
  { slug: 'montcada-i-reixac', name: 'Montcada i Reixac', km: 10, txt: 'Desde Montcada i Reixac estás cerca de Sabadell por la C-58. Pide cita y ven a ver el coche sin prisas.' },
  { slug: 'barcelona', name: 'Barcelona', km: 19, txt: 'Desde Barcelona estás a unos 25-30 minutos de Sabadell por la C-58, según el tráfico. Y si no puedes venir, te pasamos presupuesto para llevarte el coche a casa.' },
];

// Páginas "vender mi coche" por zona: solo las poblaciones más cercanas, para no hacer páginas de relleno
export const ZONAS_VENTA = ['terrassa', 'sant-cugat', 'barbera-del-valles', 'cerdanyola', 'sant-quirze-del-valles', 'castellar-del-valles'].map((s) => ZONAS.find((z) => z.slug === s)).filter(Boolean);

const hasFuel = (c, ...f) => f.some((x) => norm(c.fuel).includes(x));
// Cada tipo: filtro sobre el stock y textos propios
export const TIPOS = [
  { slug: 'automaticos', h: 'Coches automáticos', f: (c) => norm(c.trans).startsWith('auto'), txt: 'Coches de segunda mano con cambio automático: más cómodos en ciudad y en los atascos de la C-58 y la AP-7.' },
  { slug: 'manuales', h: 'Coches con cambio manual', f: (c) => norm(c.trans).startsWith('manual'), txt: 'Coches de segunda mano con cambio manual, normalmente más asequibles de compra y de mantenimiento.' },
  { slug: 'diesel', h: 'Coches diésel', f: (c) => hasFuel(c, 'diesel'), txt: 'Coches diésel de segunda mano: buena opción si haces muchos kilómetros por carretera.' },
  { slug: 'gasolina', h: 'Coches de gasolina', f: (c) => hasFuel(c, 'gasolina'), txt: 'Coches de gasolina de segunda mano, ideales si haces trayectos cortos o vas mucho por ciudad.' },
  { slug: 'hibridos', h: 'Coches híbridos', f: (c) => hasFuel(c, 'hibrid'), txt: 'Coches híbridos de segunda mano, con etiqueta ECO o CERO.' },
  { slug: 'electricos', h: 'Coches eléctricos', f: (c) => hasFuel(c, 'electr'), txt: 'Coches eléctricos de segunda mano, con etiqueta CERO.' },
  { slug: 'suv', h: 'SUV', f: (c) => norm(c.body) === 'suv', txt: 'SUV de segunda mano: posición de conducción alta, más espacio y maletero para el día a día.' },
  { slug: 'familiares', h: 'Coches familiares', f: (c) => norm(c.body) === 'familiar' || norm(c.body) === 'monovolumen' || (c.seats || 0) >= 7, txt: 'Familiares y monovolúmenes de segunda mano, con espacio de sobra para la familia y el maletero.' },
  { slug: 'compactos', h: 'Coches compactos', f: (c) => norm(c.body) === 'compacto', txt: 'Compactos de segunda mano: fáciles de aparcar, con poco consumo y suficiente espacio para el día a día.' },
  { slug: 'berlinas', h: 'Berlinas', f: (c) => norm(c.body) === 'berlina', txt: 'Berlinas de segunda mano: confort, buen maletero y comodidad en viajes largos.' },
  { slug: 'deportivos', h: 'Coupés y descapotables', f: (c) => ['coupe', 'cabrio'].includes(norm(c.body)), txt: 'Coupés y descapotables de segunda mano para disfrutar conduciendo.' },
  { slug: '7-plazas', h: 'Coches de 7 plazas', f: (c) => (c.seats || 0) >= 7, txt: 'Coches de 7 plazas de segunda mano para familias numerosas.' },
  { slug: 'etiqueta-eco', h: 'Coches con etiqueta ECO o CERO', f: (c) => ['ECO', 'CERO'].includes(String(c.etiqueta || '').toUpperCase()) || hasFuel(c, 'hibrid', 'electr', 'glp'), txt: 'Coches de segunda mano con etiqueta ECO o CERO de la DGT.' },
  { slug: 'menos-de-6000', h: 'Coches por menos de 6.000 €', f: (c) => c.price <= 6000, txt: 'Coches de segunda mano por menos de 6.000 €: el primer coche, uno para la ciudad o el segundo coche de casa.' },
  { slug: 'menos-de-10000', h: 'Coches por menos de 10.000 €', f: (c) => c.price <= 10000, txt: 'Coches de segunda mano por menos de 10.000 €, revisados y con garantía de 12 meses.' },
  { slug: 'menos-de-15000', h: 'Coches por menos de 15.000 €', f: (c) => c.price <= 15000, txt: 'Coches de segunda mano por menos de 15.000 €, revisados y con garantía de 12 meses.' },
  { slug: 'menos-de-20000', h: 'Coches por menos de 20.000 €', f: (c) => c.price <= 20000, txt: 'Coches de segunda mano por menos de 20.000 €, revisados y con garantía de 12 meses.' },
  { slug: 'pocos-kilometros', h: 'Coches con pocos kilómetros', f: (c) => c.km != null && c.km <= 80000, txt: 'Coches de segunda mano con menos de 80.000 km.' },
];

export const slugBrand = (b) => norm(b).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export function marcas(cars) {
  const m = new Map(); cars.forEach((c) => { const s = slugBrand(c.brand); if (!m.has(s)) m.set(s, { slug: s, name: c.brand, n: 0 }); m.get(s).n++; });
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
// Resuelve /coches/<slug> → {kind, h1, cars, txt}
export function landing(slug, cars) {
  const t = TIPOS.find((x) => x.slug === slug);
  if (t) return { kind: 'tipo', slug, h: t.h, txt: t.txt, cars: cars.filter(t.f) };
  const mk = marcas(cars).find((x) => x.slug === slug);
  if (mk) return { kind: 'marca', slug, h: `${mk.name}`, txt: `${mk.name} de segunda mano en stock en Sabadell, revisados y con garantía de 12 meses.`, cars: cars.filter((c) => slugBrand(c.brand) === slug), brand: mk.name };
  return null;
}
export const tiposConStock = (cars) => TIPOS.map((t) => ({ ...t, n: cars.filter(t.f).length })).filter((t) => t.n > 0);

// Preguntas frecuentes (solo datos confirmados del negocio)
export const FAQ = [
  ['¿Hace falta pedir cita para ver un coche?', 'Sí. Atendemos con cita previa en Sabadell, de lunes a viernes de 9:30 a 19:30 y los sábados de 10:00 a 14:00. Puedes pedirla en la web eligiendo día y hora, por WhatsApp o por teléfono. Así te tenemos el coche preparado y te dedicamos el tiempo que necesites.', ['Pedir cita', '/cita']],
  ['¿Los coches tienen garantía?', 'Sí, todos los coches tienen garantía de 12 meses. Según la antigüedad del coche, se puede ampliar con coste adicional; pregúntanos.', ['Ver los coches', '/vehiculos/']],
  ['¿Puedo financiar el coche?', 'Consúltanos. Te explicamos las opciones y las condiciones de financiación de cada caso antes de que decidas nada.', ['Preguntar por WhatsApp', 'wa:Hola, quería información sobre la financiación de un coche.']],
  ['¿Puedo reservar un coche?', 'En los coches que lo indican, sí, con una señal que se descuenta del precio. Primero te confirmamos que sigue disponible y te explicamos las condiciones, y después puedes pagarla por Bizum o transferencia.', ['Ver los coches', '/vehiculos/']],
  ['¿Os quedáis mi coche?', 'Te hacemos una valoración orientativa de tu coche, hecha por una persona, en 24 horas laborables y sin compromiso. Puedes pedirla en "¿Cuánto vale mi coche?".', ['Valorar mi coche', '/cuanto-vale-mi-coche']],
  ['¿Me lo podéis llevar a casa?', 'Sí, es posible. Indícanos tu código postal en la ficha del coche y te pasamos presupuesto del envío, sin compromiso.', ['Ver coches y pedir envío', '/vehiculos/']],
  ['No encuentro el coche que busco, ¿me lo buscáis?', 'Sí. Dinos en "Te lo buscamos" qué coche quieres y tu presupuesto, y te escribimos cuando tengamos opciones que encajen.', ['Pedir mi coche a la carta', '/te-lo-buscamos']],
];
