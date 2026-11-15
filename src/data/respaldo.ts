// =====================================================================
// RESPALDO: convierte el avance en un código de texto que ella puede
// guardarse (en WhatsApp, notas, correo) y recuperar en cualquier celular.
// Los capítulos escritos se guardan solo por su id; las escenas especiales
// de las cartas (que se generan una vez) se guardan completas.
// =====================================================================
import { BLChapter, SavedProgress, ShipId } from '../types';
import { HISTORIAS } from './content';

const PREFIJO_GZ = 'PC1.';
const PREFIJO_PLANO = 'PC0.';

interface Compacto {
  v: 1;
  s: ShipId;
  l: boolean;
  p: number;
  n: number;
  q: Record<string, number>;
  i: Record<string, number>;
  h: (string | BLChapter)[];
  c: Record<string, string>;
  f: string; // fecha del respaldo
}

const capitulosEscritos = (): Map<string, BLChapter> => {
  const m = new Map<string, BLChapter>();
  for (const caps of Object.values(HISTORIAS)) for (const c of caps ?? []) m.set(c.id, c);
  return m;
};

function aBase64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64(txt: string): Uint8Array {
  const b = atob(txt.replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

async function pasar(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const salida = new Blob([bytes]).stream().pipeThrough(stream as unknown as ReadableWritablePair<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(salida).arrayBuffer());
}

export async function crearCodigo(p: SavedProgress): Promise<string> {
  const escritos = capitulosEscritos();
  const datos: Compacto = {
    v: 1,
    s: p.activeShip,
    l: p.isShipLocked,
    p: p.plumas,
    n: p.sessionsCompleted,
    q: p.shipChemistry,
    i: p.shipChapterIndex,
    h: p.unlockedChapterHistory.map((c) => (escritos.has(c.id) ? c.id : c)),
    c: p.choicesMade,
    f: new Date().toISOString(),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(datos));
  if (typeof CompressionStream !== 'undefined') {
    try {
      return PREFIJO_GZ + aBase64(await pasar(bytes, new CompressionStream('gzip')));
    } catch {
      // sigue sin comprimir
    }
  }
  return PREFIJO_PLANO + aBase64(bytes);
}

export interface Recuperado {
  avance: Partial<SavedProgress>;
  fecha: Date;
  capitulos: number;
}

// Lee un código. Tolera espacios, saltos de línea y texto alrededor (si lo pegó desde un chat).
export async function leerCodigo(texto: string): Promise<Recuperado> {
  const m = texto.replace(/\s+/g, '').match(/PC[01]\.[A-Za-z0-9_-]+/);
  if (!m) throw new Error('No encontré un código de Panel Cero en ese texto.');
  const [prefijo, cuerpo] = [m[0].slice(0, 4), m[0].slice(4)];
  let bytes: Uint8Array;
  try {
    bytes = deBase64(cuerpo);
    if (prefijo === PREFIJO_GZ) {
      if (typeof DecompressionStream === 'undefined') throw new Error('viejo');
      bytes = await pasar(bytes, new DecompressionStream('gzip'));
    }
  } catch (e) {
    if ((e as Error).message === 'viejo') throw new Error('Este navegador es muy antiguo para abrir el código. Prueba desde Chrome o un iPhone actualizado.');
    throw new Error('El código está incompleto o cortado. Cópialo entero, desde «PC» hasta el final.');
  }
  let d: Compacto;
  try {
    d = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new Error('El código está incompleto o cortado. Cópialo entero, desde «PC» hasta el final.');
  }
  if (d.v !== 1) throw new Error('Este código es de otra versión de la app.');
  const escritos = capitulosEscritos();
  const historial = d.h
    .map((x) => (typeof x === 'string' ? escritos.get(x) : x))
    .filter((c): c is BLChapter => !!c && typeof c === 'object' && !!c.id);
  return {
    avance: {
      activeShip: d.s,
      isShipLocked: d.l,
      plumas: d.p,
      sessionsCompleted: d.n,
      shipChemistry: d.q as SavedProgress['shipChemistry'],
      shipChapterIndex: d.i as SavedProgress['shipChapterIndex'],
      unlockedChapterHistory: historial,
      choicesMade: d.c,
      ultimoRespaldo: d.f,
    },
    fecha: new Date(d.f),
    capitulos: Object.values(d.i).reduce((a, b) => a + b, 0),
  };
}

// Le pide al navegador que trate estos datos como importantes y no los borre solo.
export async function pedirPersistencia(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}

export function nombreArchivo(): string {
  const d = new Date();
  const f = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return `panel-cero-respaldo-${f}.txt`;
}
