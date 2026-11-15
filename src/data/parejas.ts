// =====================================================================
// FIDELIDAD: nadie es infiel.
// - Una historia activa ocupa a sus dos personajes hasta que termina.
// - Máximo dos historias a la vez, sin personajes repetidos (con cuatro
//   personajes, eso son siempre dos parejas que no se cruzan).
// - Al leer el último capítulo, la historia queda "terminada": se puede
//   releer, y sus personajes quedan libres para otra combinación.
// =====================================================================
import { CharacterId, SavedProgress, ShipId } from '../types';
import { HISTORIAS, SHIPS } from './content';

export const MAX_ACTIVAS = 2;
export const TODAS = Object.keys(SHIPS) as ShipId[];

const largo = (s: ShipId) => HISTORIAS[s]?.length ?? 10;
const elenco = (s: ShipId): CharacterId[] => [SHIPS[s].charA, SHIPS[s].charB];

export const terminada = (p: SavedProgress, s: ShipId) => (p.shipChapterIndex[s] || 0) >= largo(s);
export const terminadas = (p: SavedProgress) => TODAS.filter((s) => terminada(p, s));
export const activas = (p: SavedProgress) => (p.parejas ?? []).filter((s) => !terminada(p, s));

// Personaje -> pareja activa en la que está (si está ocupado).
export function ocupados(p: SavedProgress): Partial<Record<CharacterId, ShipId>> {
  const m: Partial<Record<CharacterId, ShipId>> = {};
  for (const s of activas(p)) for (const c of elenco(s)) m[c] = s;
  return m;
}

export type Bloqueo = null | { motivo: 'terminada' } | { motivo: 'ocupado'; quien: CharacterId; con: ShipId } | { motivo: 'lleno' };

// ¿Puede empezar esta historia ahora? Si no, por qué.
export function bloqueo(p: SavedProgress, s: ShipId): Bloqueo {
  if (terminada(p, s)) return { motivo: 'terminada' };
  if (activas(p).includes(s)) return null;
  const occ = ocupados(p);
  for (const c of elenco(s)) {
    const con = occ[c];
    if (con) return { motivo: 'ocupado', quien: c, con };
  }
  if (activas(p).length >= MAX_ACTIVAS) return { motivo: 'lleno' };
  return null;
}

export const disponibles = (p: SavedProgress) => TODAS.filter((s) => !activas(p).includes(s) && bloqueo(p, s) === null);

// La pareja complementaria: los otros dos personajes.
export function complemento(s: ShipId): ShipId | undefined {
  const usados = new Set(elenco(s));
  return TODAS.find((o) => elenco(o).every((c) => !usados.has(c)));
}

export function parejaDe(a: CharacterId, b: CharacterId): ShipId | undefined {
  return TODAS.find((s) => {
    const e = elenco(s);
    return e.includes(a) && e.includes(b) && a !== b;
  });
}

function mejorCombinacion(p: SavedProgress, empezadas: ShipId[]): ShipId[] {
  const puntaje = (ss: ShipId[]) => ss.reduce((t, s) => t + (p.shipChapterIndex[s] || 0) + (s === p.activeShip ? 0.5 : 0), 0);
  let mejor: ShipId[] = [];
  for (const a of empezadas) {
    if (puntaje([a]) > puntaje(mejor)) mejor = [a];
    for (const b of empezadas) {
      if (a >= b || elenco(a).some((c) => elenco(b).includes(c))) continue;
      if (puntaje([a, b]) > puntaje(mejor)) mejor = [a, b];
    }
  }
  return mejor.sort((x, y) => Number(y === p.activeShip) - Number(x === p.activeShip));
}

// Deja cualquier avance (nuevo, antiguo o recuperado de un respaldo) cumpliendo las reglas.
export function normalizar(p: SavedProgress): SavedProgress {
  const yaEmpezadas = TODAS.filter((s) => (p.shipChapterIndex[s] || 0) > 0 && !terminada(p, s));
  const tenia = p.parejas !== undefined;
  // Avance anterior a las reglas: de lo que ya había empezado, se quedan las (hasta dos) historias
  // compatibles con más capítulos leídos; a igualdad, gana la que estaba mirando.
  let candidatas: ShipId[] = tenia ? p.parejas! : mejorCombinacion(p, yaEmpezadas);
  if (!tenia && candidatas.length === 0 && p.isShipLocked && !terminada(p, p.activeShip)) candidatas = [p.activeShip];

  const elegidas: ShipId[] = [];
  const usados = new Set<CharacterId>();
  for (const s of candidatas) {
    if (!SHIPS[s] || terminada(p, s) || elegidas.length >= MAX_ACTIVAS) continue;
    if (elenco(s).some((c) => usados.has(c))) continue;
    elegidas.push(s);
    elenco(s).forEach((c) => usados.add(c));
  }

  const presentado = p.presentado ?? (elegidas.length > 0 || terminadas(p).length > 0);
  const visibles = [...elegidas, ...terminadas(p)];
  const activeShip = visibles.includes(p.activeShip) ? p.activeShip : (visibles[0] ?? p.activeShip);
  return { ...p, parejas: elegidas, presentado, activeShip, isShipLocked: elegidas.length > 0 };
}
