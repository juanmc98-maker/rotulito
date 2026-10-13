// Cada mañana avisa al móvil de los seguimientos que tocan ese día
import { diario } from './platagarage/platagarage.mjs';

export default async () => {
  const r = await diario();
  return new Response(JSON.stringify(r), { headers: { 'content-type': 'application/json' } });
};

export const config = { schedule: '10 7 * * *' };
