// Herramientas compartidas para escribir temporadas (ver kazuha-renji.ts como ejemplo).
//   N('texto')                                        -> narrador
//   voz('kazuha')('expresión', 'dice', 'calla', 'acotación')
//   si('id-de-opción', cuadro)      -> solo aparece si ella eligió esa opción antes
//   siNinguna(['id', ...], cuadro)  -> aparece si no eligió ninguna de esas
import { BLChapter, CharacterId, DialogueBeat, ShipId } from '../../types';

export type Expr = NonNullable<DialogueBeat['expression']>;
export type Cuadro = Omit<DialogueBeat, 'id'>;

export const N = (texto: string): Cuadro => ({ speaker: 'narrator', spokenText: texto });
export const voz =
  (quien: CharacterId) =>
  (expr: Expr, dice: string, calla?: string, acotacion?: string): Cuadro => ({
    speaker: quien,
    expression: expr,
    spokenText: dice,
    hiddenThought: calla,
    stageDirection: acotacion,
  });
export const si = (opcion: string, c: Cuadro): Cuadro => ({ ...c, si: opcion });
export const siNinguna = (opciones: string[], c: Cuadro): Cuadro => ({ ...c, siNinguna: opciones });

export interface Opcion {
  id: string;
  tono: 'tension' | 'tierno' | 'caos';
  texto: string;
  sigue: Cuadro[];
}

export interface Guion {
  n: number;
  titulo: string;
  subtitulo: string;
  tropo: string;
  gancho: { a: [CharacterId, string]; b: [CharacterId, string] };
  cuadros: Cuadro[];
  pregunta: string;
  opciones: Opcion[];
  adelanto: string;
}

// Devuelve el constructor de capítulos de una pareja. "prefijo" va en los ids (ej: 'nv').
export function temporada(shipId: ShipId, prefijo: string) {
  return (g: Guion): BLChapter => {
    const id = `${prefijo}-t1-${String(g.n).padStart(2, '0')}`;
    return {
      id,
      shipId,
      chapterNumber: g.n,
      title: `Episodio ${String(g.n).padStart(2, '0')}: ${g.titulo}`,
      subtitle: g.subtitulo,
      contextTrigger: 'any',
      tropeTag: g.tropo,
      cliffhangerPreview: {
        speakerA: g.gancho.a[0],
        lineA: g.gancho.a[1],
        speakerB: g.gancho.b[0],
        lineB: g.gancho.b[1],
        narratorHook: '',
      },
      beats: g.cuadros.map((c, i) => ({ ...c, id: `${id}-b${i + 1}` })),
      choicePrompt: g.pregunta,
      choices: g.opciones.map((o) => ({
        id: o.id,
        label: o.texto,
        tone: o.tono,
        chemistryDelta: 8,
        followUpBeats: o.sigue.map((c, i) => ({ ...c, id: `${o.id}-${i + 1}` })),
      })),
      nextCliffhangerTeaser: g.adelanto,
    };
  };
}

// Portada que se muestra cuando ya leyó toda la temporada de una pareja.
export function espera(
  shipId: ShipId,
  prefijo: string,
  a: [CharacterId, string],
  b: [CharacterId, string]
): BLChapter {
  return {
    id: `${prefijo}-t2-espera`,
    shipId,
    chapterNumber: 11,
    title: 'Temporada 2 — En producción',
    subtitle: 'La Temporada 1 está completa.',
    contextTrigger: 'any',
    tropeTag: 'Temporada 1 completa',
    cliffhangerPreview: { speakerA: a[0], lineA: a[1], speakerB: b[0], lineB: b[1], narratorHook: '' },
    beats: [],
    choicePrompt: '',
    choices: [],
    nextCliffhangerTeaser: '',
  };
}
