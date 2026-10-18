// Páginas de SEO local: zonas del Vallès, tipos de coche y marcas (se generan solas a partir del stock)
// Cuota «desde» de cada coche (la pone views.mjs con las tarifas de las financieras)
let CUOTA = () => null;
export const setCuota = (f) => { CUOTA = f; };
export const cuotaDe = (c) => { const q = CUOTA(c); return q ? q.c : null; };
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Distancias en línea recta desde el centro de Sabadell, redondeadas (orientativas)
// Solo estas zonas se indexan (las demás quedan con noindex,follow y fuera del sitemap: evitan páginas casi iguales)
export const ZONAS_IDX = ['sabadell', 'terrassa', 'sant-cugat', 'barbera-del-valles', 'cerdanyola', 'rubi', 'mollet-del-valles', 'barcelona', 'badalona', 'granollers', 'martorell', 'mataro', 'manresa', 'vilafranca-del-penedes', 'igualada'];
// Texto propio de cada zona indexable
export const ZONA_MAS = {
  sabadell: 'Somos una compraventa pequeña de Sabadell: cada coche lo elegimos nosotros, lo revisamos en taller y le cambiamos el aceite antes de entregarlo. Atendemos con cita para enseñarte el coche con calma, sin prisas y sin colas, y si te encaja lo puedes reservar con una señal que se descuenta del precio.',
  terrassa: 'Entre Terrassa y Sabadell hay unos 9 km por la C-58, así que puedes venir a ver el coche en la misma tarde. Si lo prefieres, te mandamos antes por WhatsApp las fotos y los datos que nos pidas para que no hagas el viaje en balde.',
  'sant-cugat': 'Desde Sant Cugat se llega a Sabadell en pocos minutos. En el stock puedes filtrar por automáticos, SUV o precio para ver solo lo que te encaja y pedir cita para ese coche.',
  'barbera-del-valles': 'Barberà del Vallès y Sabadell están pegadas, así que es la visita más cómoda: pide cita a la hora que te vaya bien y te tenemos el coche preparado.',
  cerdanyola: 'Cerdanyola del Vallès está a unos 7 km, así que es fácil venir a ver el coche al salir del trabajo. Pide cita y te lo tenemos preparado, con la ficha y los papeles a mano y la garantía de 12 meses explicada.',
  rubi: 'Desde Rubí se llega a Sabadell en pocos minutos. Si buscas algo concreto que ahora no tenemos, dínoslo en «Te lo buscamos» y te avisamos cuando entre un coche que encaje.',
  'mollet-del-valles': 'Mollet del Vallès está a un paso de Sabadell. Pide cita a la hora que te vaya bien y te tenemos el coche preparado; si quieres asegurarlo antes de venir, lo puedes reservar con una señal que se descuenta del precio.',
  barcelona: 'Mucha gente de Barcelona viene a Sabadell a buscar coche: te enseñamos el coche con calma, con cita y sin colas. Si no te va bien subir, pídenos presupuesto para llevártelo a casa; y si lo vas a financiar, la solicitud la haces desde la ficha del coche sin moverte.',
  badalona: 'Desde Badalona estás a unos 16 km de Sabadell en línea recta. Mira el stock, calcula la cuota de cada coche en su ficha y pide cita para venir a verlo; si no puedes venir, te pasamos presupuesto de envío.',
  granollers: 'Entre Granollers y Sabadell hay unos 16 km. Si estás en el Vallès Oriental, pide cita el día que te vaya bien y te enseñamos el coche sin prisas; y si tienes coche, te lo valoramos como parte de pago.',
  martorell: 'Desde Martorell tienes Sabadell a unos 17 km. Te enseñamos el coche con cita, sin colas, y si lo necesitas tramitamos nosotros la financiación con la entidad.',
  mataro: 'Desde Mataró y el Maresme, Sabadell queda a unos 28 km en línea recta. Mira el stock con calma en la web, filtra por cuota al mes si vas a financiar y, cuando tengas uno claro, pide cita para venir a verlo.',
  manresa: 'Desde Manresa y el Bages, Sabadell queda a unos 30 km en línea recta. Para que no hagas el viaje en balde, antes de venir te resolvemos por WhatsApp las dudas del coche que te interese y te lo tenemos preparado a la hora de la cita.',
  'vilafranca-del-penedes': 'Si eres de Vilafranca del Penedès, puedes hacer casi todo a distancia: calcular la cuota, pedir la financiación y reservar el coche con la señal. Cuando esté todo listo, vienes a recogerlo o te pasamos presupuesto para llevártelo.',
  igualada: 'Si vienes desde Igualada o el Anoia, te recomendamos reservar antes el coche que te interese para no encontrarte con que se ha vendido: la señal se descuenta del precio y, si lo compras con financiación y no te la aprueban, te la devolvemos.',
};
export const ZONAS = [
  { slug: 'sabadell', name: 'Sabadell', km: 0, txt: 'Estamos en Sabadell. Si eres de aquí, pide cita y ven a ver el coche con calma, el día y la hora que mejor te vayan.' },
  { slug: 'terrassa', name: 'Terrassa', km: 9, txt: 'Desde Terrassa estás a unos minutos de nosotros por la C-58. Pide cita y ven a ver el coche sin prisas.' },
  { slug: 'sant-cugat', name: 'Sant Cugat del Vallès', km: 9, txt: 'Si vives en Sant Cugat del Vallès, Sabadell te queda muy cerca. Elige día y hora y te tenemos el coche preparado.' },
  { slug: 'barbera-del-valles', name: 'Barberà del Vallès', km: 4, txt: 'Barberà del Vallès está pegada a Sabadell: en pocos minutos estás viendo el coche que te interesa.' },
  { slug: 'cerdanyola', name: 'Cerdanyola del Vallès', km: 7, txt: 'Desde Cerdanyola del Vallès llegas a Sabadell en un momento por la C-58. Reserva tu visita y te atendemos sin esperas.' },
  { slug: 'ripollet', name: 'Ripollet', km: 7, txt: 'Si eres de Ripollet, estamos al lado. Mira el stock, pide cita y ven a verlo sin compromiso.' },
  { slug: 'badia-del-valles', name: 'Badia del Vallès', km: 5, txt: 'Badia del Vallès está a un paso de Sabadell. Pide cita y te enseñamos el coche con tranquilidad.' },
  { slug: 'sant-quirze-del-valles', name: 'Sant Quirze del Vallès', km: 3, txt: 'Desde Sant Quirze del Vallès estás prácticamente en Sabadell. Elige el coche, pide cita y ven a verlo.' },
  { slug: 'castellar-del-valles', name: 'Castellar del Vallès', km: 7, txt: 'Si vives en Castellar del Vallès, bajas a Sabadell en pocos minutos. Te esperamos con cita previa.' },
  { slug: 'santa-perpetua-de-mogoda', name: 'Santa Perpètua de Mogoda', km: 6, txt: 'Santa Perpètua de Mogoda está muy cerca de Sabadell. Mira el stock y reserva tu visita sin compromiso.' },
  { slug: 'polinya', name: 'Polinyà', km: 4, txt: 'Desde Polinyà llegas a Sabadell en nada. Pide cita y ven a ver el coche cuando te vaya bien.' },
  { slug: 'rubi', name: 'Rubí', km: 9, txt: 'Si eres de Rubí, Sabadell te queda a pocos minutos. Elige día y hora y te atendemos personalmente.' },
  { slug: 'montcada-i-reixac', name: 'Montcada i Reixac', km: 10, txt: 'Desde Montcada i Reixac estás cerca de Sabadell por la C-58. Pide cita y ven a ver el coche sin prisas.' },
  { slug: 'mollet-del-valles', name: 'Mollet del Vallès', km: 9, txt: 'Mollet del Vallès está al lado de Sabadell. Pide cita y ven a ver el coche cuando te vaya bien.' },
  { slug: 'badalona', name: 'Badalona', km: 16, txt: 'Desde Badalona llegas a Sabadell sin complicaciones. Pide cita para ver el coche o pide el envío a casa.' },
  { slug: 'granollers', name: 'Granollers', km: 16, txt: 'Desde Granollers llegas a Sabadell en poco rato. Elige día y hora y ven a ver el coche sin prisas.' },
  { slug: 'martorell', name: 'Martorell', km: 17, txt: 'Desde Martorell llegas a Sabadell en poco rato. Pide cita y te enseñamos el coche sin prisas.' },
  { slug: 'mataro', name: 'Mataró', km: 28, txt: 'Desde Mataró estás a menos de una hora de Sabadell. Pide cita y ven a ver el coche con calma, o pide el envío a casa.' },
  { slug: 'manresa', name: 'Manresa', km: 30, txt: 'Si eres de Manresa, Sabadell te queda a menos de una hora en coche. Pide cita y te tenemos el coche preparado, o pide el envío a casa.' },
  { slug: 'vilafranca-del-penedes', name: 'Vilafranca del Penedès', km: 41, txt: 'Desde Vilafranca del Penedès estás a algo menos de una hora de Sabadell. Pide cita para ver el coche o pide el envío a casa.' },
  { slug: 'igualada', name: 'Igualada', km: 41, txt: 'Desde Igualada estás a algo menos de una hora de Sabadell. Reserva el coche, pide cita o pide el envío a casa.' },
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
  { slug: 'japoneses', h: 'Coches japoneses', f: (c) => ['toyota', 'mazda', 'nissan', 'honda', 'suzuki', 'mitsubishi', 'lexus', 'subaru', 'infiniti', 'daihatsu'].includes(slugBrand(c.brand)), txt: 'Coches japoneses de segunda mano: Toyota, Mazda, Nissan y otras marcas japonesas, conocidas por su fiabilidad y su bajo coste de mantenimiento.' },
  { slug: 'alemanes', h: 'Coches alemanes', f: (c) => ['audi', 'bmw', 'mercedes', 'mercedes-benz', 'porsche', 'volkswagen', 'opel', 'smart'].includes(slugBrand(c.brand)), txt: 'Coches alemanes de segunda mano: Audi, BMW, Mercedes, Volkswagen y otras marcas alemanas, con buen acabado y comportamiento en carretera.' },
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
  // Por cuota: sin entrada, al plazo más largo y con la financiera más barata para cada coche
  { slug: 'menos-de-150-al-mes', cuota: 150, h: 'Coches por menos de 150 € al mes', f: (c) => { const q = cuotaDe(c); return q != null && q <= 150; }, txt: 'Coches de segunda mano con cuota de menos de 150 € al mes, financiados sin entrada.' },
  { slug: 'menos-de-200-al-mes', cuota: 200, h: 'Coches por menos de 200 € al mes', f: (c) => { const q = cuotaDe(c); return q != null && q <= 200; }, txt: 'Coches de segunda mano con cuota de menos de 200 € al mes, financiados sin entrada.' },
  { slug: 'menos-de-250-al-mes', cuota: 250, h: 'Coches por menos de 250 € al mes', f: (c) => { const q = cuotaDe(c); return q != null && q <= 250; }, txt: 'Coches de segunda mano con cuota de menos de 250 € al mes, financiados sin entrada.' },
  { slug: 'menos-de-300-al-mes', cuota: 300, h: 'Coches por menos de 300 € al mes', f: (c) => { const q = cuotaDe(c); return q != null && q <= 300; }, txt: 'Coches de segunda mano con cuota de menos de 300 € al mes, financiados sin entrada.' },
  { slug: 'pocos-kilometros', h: 'Coches con pocos kilómetros', f: (c) => c.km != null && c.km <= 80000, txt: 'Coches de segunda mano con menos de 80.000 km.' },
];

// Contenido propio de las categorías con más stock e intención de compra (texto y dudas específicas)
export const EXTRA = {
  japoneses: {
    p: ['Los coches japoneses tienen fama de fiables y de tener un mantenimiento sencillo, y por eso muchos clientes nos piden "un japonés" sin tener aún claro el modelo. En el stock suele haber Toyota, Mazda y Nissan: Toyota destaca por sus híbridos con etiqueta ECO, Mazda por motores de gasolina sin turbo y un buen acabado, y Nissan por sus SUV.', 'Como con cualquier coche de ocasión, lo importante es el estado de cada unidad: por eso todos pasan por taller antes de entregarse y salen con 12 meses de garantía.'],
    faq: [['¿Son más fiables los coches japoneses?', 'Tienen buena fama de fiabilidad, pero en un coche de segunda mano pesa más cómo se ha cuidado cada unidad. Te enseñamos el coche, te contamos lo que sabemos de él y sale revisado y con 12 meses de garantía.'], ['¿Tenéis híbridos japoneses?', 'Depende del stock de cada semana. En esta página ves todos los japoneses que tenemos ahora; si buscas un híbrido concreto y no está, dínoslo en "Te lo buscamos".']],
  },
  automaticos: {
    p: ['El cambio automático es lo que más nos piden: en ciudad y en los atascos del Vallès se agradece no tener que tocar el embrague. Hay varios tipos (convertidor de par, doble embrague o el cambio de los híbridos) y cada uno tiene su forma de conducirse y su mantenimiento.', 'Si no has llevado nunca un automático, en la visita te explicamos cómo funciona antes de decidir.'],
    faq: [['¿Un automático tiene más mantenimiento?', 'Según el tipo de cambio, el fabricante puede indicar el cambio de aceite de la caja cada cierto número de kilómetros. Te decimos lo que toca en el coche que te interese antes de que lo compres.'], ['¿Puedo ver el coche antes?', 'Sí. Pide cita y te lo tenemos preparado para verlo con calma. La prueba en carretera la reservamos para cuando hay compromiso de compra.']],
  },
  'menos-de-10000': {
    p: ['Por menos de 10.000 € lo normal es encontrar coches con algunos años y kilómetros, pero eso no tiene por qué ser un problema si el coche se ha cuidado. Aquí tienes los que tenemos ahora en ese precio, ordenados de más barato a más caro.', 'Aunque sean los más asequibles, pasan la misma revisión en taller que el resto y llevan los mismos 12 meses de garantía.'],
    faq: [['¿Los coches baratos también tienen garantía?', 'Sí, todos los coches tienen 12 meses de garantía, cuesten lo que cuesten.']],
  },
  mazda: {
    p: ['En nuestro stock suele haber varios Mazda: buen acabado, conducción agradable y motores de gasolina sin turbo en muchos modelos. Aquí ves todos los Mazda que tenemos ahora en stock.'],
    faq: [],
  },
  nissan: {
    p: ['Nissan es sobre todo marca de SUV y crossovers, muy prácticos para el día a día y para la familia. Aquí ves todos los Nissan que tenemos ahora en stock.'],
    faq: [],
  },
};

// Texto propio de las páginas por cuota
for (const t of TIPOS.filter((x) => x.cuota)) EXTRA[t.slug] = {
  p: ['La cuota de cada coche la calculamos con las tarifas reales de las financieras con las que trabajamos (Confía y Lendrock), sin entrada y al plazo más largo que permite cada coche según su antigüedad. Ya incluye el cambio de nombre y la comisión de apertura.', 'Si das entrada o eliges menos meses, la cuota cambia. En la ficha de cada coche tienes la calculadora para verlo al momento y pedir la financiación en 2 minutos, sin compromiso.'],
  faq: [['¿La cuota es definitiva?', 'Es orientativa. La financiera estudia cada caso y la aprobación depende de ella. Te confirmamos la cuota final antes de firmar nada.'], ['¿Hace falta dar entrada?', 'No. Las cuotas de esta página son sin entrada. Si das entrada, la cuota baja.'], ['¿Cómo pido la financiación?', 'Desde la ficha del coche: rellenas tus datos en 2 minutos, nosotros lo tramitamos con la financiera y te decimos la respuesta.']],
};

export const slugBrand = (b) => norm(b).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export function marcas(cars) {
  const m = new Map(); cars.forEach((c) => { const s = slugBrand(c.brand); if (!m.has(s)) m.set(s, { slug: s, name: c.brand, n: 0 }); m.get(s).n++; });
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
// Resuelve /coches/<slug> → {kind, h1, cars, txt}
export function landing(slug, cars) {
  const t = TIPOS.find((x) => x.slug === slug);
  if (t) return { kind: 'tipo', slug, h: t.h, txt: t.txt, cuota: t.cuota || 0, cars: cars.filter(t.f) };
  const mk = marcas(cars).find((x) => x.slug === slug);
  if (mk) return { kind: 'marca', slug, h: `${mk.name}`, txt: `${mk.name} de segunda mano en stock en Sabadell, revisados y con garantía de 12 meses.`, cars: cars.filter((c) => slugBrand(c.brand) === slug), brand: mk.name };
  return null;
}
export const tiposConStock = (cars) => TIPOS.map((t) => ({ ...t, n: cars.filter(t.f).length })).filter((t) => t.n > 0);

// Preguntas frecuentes (solo datos confirmados del negocio)
export const FAQ = [
  ['¿Hace falta pedir cita para ver un coche?', 'Sí. Atendemos con cita previa en Sabadell, de lunes a viernes de 9:30 a 19:30 y los sábados de 10:00 a 14:00. Puedes pedirla en la web eligiendo día y hora, por WhatsApp o por teléfono. Así te tenemos el coche preparado y te dedicamos el tiempo que necesites.', ['Pedir cita', '/cita']],
  ['¿Los coches tienen garantía?', 'Sí, todos los coches tienen garantía de 12 meses. Según la antigüedad del coche, se puede ampliar con coste adicional; pregúntanos.', ['Ver los coches', '/vehiculos/']],
  ['¿Puedo financiar el coche?', 'Sí. En la ficha de cada coche tienes el botón «Financiarlo»: rellenas tus datos en 2 minutos, la entidad financiera te envía un enlace por SMS o email para hacer la validación bancaria y nosotros te contamos la respuesta y las condiciones antes de que decidas nada. Sin compromiso.', ['Solicitar financiación', '/financiar']],
  ['¿Es segura la validación bancaria de la financiación?', 'Sí. Se hace en la página segura de la entidad financiera, que está supervisada, y es un proceso regulado por la normativa europea de servicios de pago: solo sirve para consultar tu cuenta y estudiar la financiación. Nadie de Plata Garage te pedirá nunca tus claves del banco.'],
  ['¿Puedo reservar un coche?', 'Sí, con una señal que se descuenta del precio; el importe lo ves en la ficha de cada coche. Primero te confirmamos que sigue disponible y te explicamos las condiciones, y después puedes pagarla por Bizum o transferencia.', ['Ver los coches', '/vehiculos/']],
  ['¿Os quedáis mi coche?', 'Te hacemos una valoración orientativa de tu coche, hecha por una persona, en 24 horas laborables y sin compromiso. Puedes pedirla en "¿Cuánto vale mi coche?".', ['Valorar mi coche', '/cuanto-vale-mi-coche']],
  ['¿Me lo podéis llevar a casa?', 'Sí, es posible. Indícanos tu código postal en la ficha del coche y te pasamos presupuesto del envío, sin compromiso.', ['Ver coches y pedir envío', '/vehiculos/']],
  ['¿Qué pasa con la señal si no me aprueban la financiación?', 'Te la devolvemos íntegra.', ['Cómo comprar en Plata Garage', '/como-comprar']],
  ['¿Qué documentación me llevo con el coche?', 'El coche se entrega con la ficha técnica, el contrato de compraventa, la documentación de la garantía y el permiso provisional de circulación de la DGT. El cambio de nombre lo hacemos nosotros antes de la entrega.', ['Cómo comprar en Plata Garage', '/como-comprar']],
  ['¿Cuándo se paga el coche?', 'El pago total se hace 24 horas antes de la entrega, para tener el cambio de nombre hecho y el coche listo el día que vienes a por él.', ['Cómo comprar en Plata Garage', '/como-comprar']],
  ['No encuentro el coche que busco, ¿me lo buscáis?', 'Sí. Dinos en "Te lo buscamos" qué coche quieres y tu presupuesto, y te escribimos cuando tengamos opciones que encajen.', ['Pedir mi coche a la carta', '/te-lo-buscamos']],
];
