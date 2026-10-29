// Cada hora (lunes a sábado, horario de tienda): avisa al móvil de los leads que llevan más de 2 horas sin contestar
import { sinRespuesta } from './platagarage/platagarage.mjs';

export default async () => {
  const r = await sinRespuesta();
  return new Response(JSON.stringify(r), { headers: { 'content-type': 'application/json' } });
};

// Hora UTC: de 8:20 a 20:20 en Sabadell en invierno (de 9:20 a 21:20 en verano)
export const config = { schedule: '20 7-19 * * 1-6' };
