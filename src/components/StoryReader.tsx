import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Eye, CaretLeft, Fire, Heart, Smiley, BookmarkSimple, CaretDown } from '@phosphor-icons/react';
import { BLChapter, CharacterId, DialogueBeat, SceneChoice } from '../types';
import { CHARACTERS, SHIPS } from '../data/content';
import { CharacterPortrait } from './CharacterPortrait';
import { Maquina } from '../ui/Bocadillo';

type Fase = 'escena' | 'decision' | 'despues' | 'fin';

const TONO = {
  tension: { icono: Fire, etiqueta: 'Tensión', color: 'text-rose-300' },
  tierno: { icono: Heart, etiqueta: 'Ternura', color: 'text-pink-200' },
  caos: { icono: Smiley, etiqueta: 'Caos', color: 'text-amber-200' },
} as const;

// Lector tipo novela visual: un cuadro por vez, tocar para avanzar.
export function StoryReader({
  chapter,
  elegidas,
  elegidaAntes,
  onClose,
  onFinish,
}: {
  chapter: BLChapter;
  elegidas: string[];
  elegidaAntes?: string;
  onClose: () => void;
  onFinish: (choice: SceneChoice) => void;
}) {
  const visible = useCallback(
    (b: DialogueBeat) =>
      (!b.si || elegidas.includes(b.si)) && (!b.siNinguna || !b.siNinguna.some((id) => elegidas.includes(id))),
    [elegidas]
  );

  const cuadros = useMemo(() => chapter.beats.filter(visible), [chapter, visible]);
  const [fase, setFase] = useState<Fase>('escena');
  const [i, setI] = useState(0);
  const [eleccion, setEleccion] = useState<SceneChoice | null>(null);
  const [escrito, setEscrito] = useState(false);
  const [pensamiento, setPensamiento] = useState(false);

  const despues = useMemo(() => (eleccion ? eleccion.followUpBeats.filter(visible) : []), [eleccion, visible]);
  const lista = fase === 'despues' ? despues : cuadros;
  const actual: DialogueBeat | undefined = fase === 'escena' || fase === 'despues' ? lista[i] : undefined;

  const ship = SHIPS[chapter.shipId];
  const elenco: CharacterId[] = ship
    ? [ship.charA, ship.charB]
    : (Array.from(new Set(chapter.beats.map((b) => b.speaker).filter((s) => s !== 'narrator'))) as CharacterId[]).slice(0, 2);

  const total = cuadros.length + 1 + Math.max(despues.length, 2);
  const hecho =
    fase === 'escena' ? i : fase === 'decision' ? cuadros.length : fase === 'despues' ? cuadros.length + 1 + i : total;
  const avance = Math.min(100, (hecho / total) * 100);

  useEffect(() => {
    setEscrito(false);
    setPensamiento(false);
  }, [fase, i]);

  const siguiente = () => {
    if (fase === 'decision' || fase === 'fin') return;
    if (!escrito) {
      setEscrito(true);
      return;
    }
    if (i < lista.length - 1) {
      setI(i + 1);
      return;
    }
    if (fase === 'escena') {
      setFase(chapter.choices.length ? 'decision' : 'fin');
      setI(0);
    } else {
      setFase('fin');
    }
  };

  const anterior = () => {
    if (fase === 'escena' && i > 0) setI(i - 1);
    else if (fase === 'despues' && i > 0) setI(i - 1);
    else if (fase === 'despues' || fase === 'fin') {
      if (fase === 'fin' && despues.length) {
        setFase('despues');
        setI(despues.length - 1);
      } else {
        setFase('decision');
      }
    } else if (fase === 'decision') {
      setFase('escena');
      setI(cuadros.length - 1);
    }
  };

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        siguiente();
      }
      if (e.key === 'ArrowLeft') anterior();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  const hablante = actual && actual.speaker !== 'narrator' ? CHARACTERS[actual.speaker] : null;
  const tinte = hablante?.colorHex ?? '#f43f5e';

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#0b0b0d]">
      <div className="relative w-full max-w-md h-[100dvh] flex flex-col overflow-hidden">
        {/* Luz ambiente del que habla */}
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[140%] h-[60%] rounded-full blur-3xl"
          animate={{ backgroundColor: tinte, opacity: hablante ? 0.16 : 0.07 }}
          transition={{ duration: 0.8 }}
        />
        <div className="pointer-events-none absolute inset-0 bg-halftone-dark opacity-60" />

        {/* Barra superior */}
        <header className="relative z-10 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Cerrar capítulo"
              className="w-10 h-10 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              <X size={20} />
            </button>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500 truncate">{chapter.tropeTag}</div>
              <div className="font-editorial text-lg leading-tight text-zinc-100 truncate">
                {chapter.title.replace(/^Episodio \d+:\s*/, '')}
              </div>
            </div>
            <button
              onClick={anterior}
              aria-label="Cuadro anterior"
              disabled={fase === 'escena' && i === 0}
              className="w-10 h-10 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition disabled:opacity-0"
            >
              <CaretLeft size={20} />
            </button>
          </div>
          <div className="mt-3 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full bg-rose-400/80" animate={{ width: `${avance}%` }} transition={{ type: 'spring', stiffness: 80, damping: 20 }} />
          </div>
        </header>

        {/* Escenario: los dos personajes, el que habla al frente */}
        <div className="relative flex-1 min-h-0 cursor-pointer select-none" onClick={siguiente}>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-0 px-2">
            {elenco.map((id, k) => {
              const activo = hablante?.id === id;
              const algunoHabla = !!hablante;
              return (
                <motion.div
                  key={id}
                  animate={{
                    opacity: activo ? 1 : algunoHabla ? 0.28 : 0.55,
                    scale: activo ? 1.04 : 0.9,
                    y: activo ? 0 : 14,
                    x: k === 0 ? 10 : -10,
                  }}
                  transition={{ type: 'spring', stiffness: 140, damping: 22 }}
                  className={activo ? 'z-10' : 'z-0'}
                  style={{ filter: activo || !algunoHabla ? 'none' : 'saturate(0.4)' }}
                >
                  <CharacterPortrait
                    characterId={id}
                    expression={activo ? actual?.expression || 'neutral' : 'neutral'}
                    size="stage"
                    className="rounded-[2rem] ring-1 ring-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
                  />
                </motion.div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0b0b0d] to-transparent" />
        </div>

        {/* Caja de diálogo */}
        <div className="relative z-10 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 min-h-[42%] flex flex-col justify-end">
          <AnimatePresence mode="wait">
            {(fase === 'escena' || fase === 'despues') && actual && (
              <motion.div
                key={`${fase}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-2"
              >
                <AnimatePresence>
                  {pensamiento && actual.hiddenThought && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="rounded-3xl px-4 py-3 bg-rose-950/50 ring-1 ring-rose-300/20"
                    >
                      <div className="text-[11px] tracking-wide text-rose-300/80 mb-1">Lo que {hablante?.name} calla</div>
                      <p className="font-editorial italic text-[17px] leading-snug text-rose-50">{actual.hiddenThought}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  onClick={siguiente}
                  className="cursor-pointer rounded-[1.75rem] px-5 pt-4 pb-3 bg-zinc-900/90 backdrop-blur ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  {hablante ? (
                    <>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-sm font-semibold" style={{ color: hablante.colorHex }}>
                          {hablante.name}
                        </span>
                        {actual.hiddenThought && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPensamiento((p) => !p);
                            }}
                            className={`h-8 px-3 rounded-full text-xs flex items-center gap-1.5 transition ${
                              pensamiento ? 'bg-rose-400/20 text-rose-200' : 'bg-white/[0.06] text-zinc-300 hover:bg-white/10'
                            }`}
                          >
                            <Eye size={14} weight={pensamiento ? 'fill' : 'regular'} />
                            {pensamiento ? 'Ocultar' : 'Lo que calla'}
                          </button>
                        )}
                      </div>
                      {actual.stageDirection && (
                        <p className="text-[13px] italic text-zinc-400 leading-snug mb-1.5">{actual.stageDirection}</p>
                      )}
                      <p className="text-[17px] leading-relaxed text-zinc-50">
                        <Maquina texto={actual.spokenText} completo={escrito} onFin={() => setEscrito(true)} />
                      </p>
                    </>
                  ) : (
                    <p className="font-editorial italic text-[18px] leading-snug text-zinc-200">
                      <Maquina texto={actual.spokenText} completo={escrito} onFin={() => setEscrito(true)} />
                    </p>
                  )}
                  <div className="h-5 flex items-center justify-end">
                    {escrito && (
                      <motion.span
                        animate={{ y: [0, 3, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="text-zinc-500"
                      >
                        <CaretDown size={14} />
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {fase === 'decision' && (
              <motion.div
                key="decision"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <p className="font-editorial italic text-[18px] leading-snug text-zinc-200 px-1">{chapter.choicePrompt}</p>
                <div className="space-y-2">
                  {chapter.choices.map((c, k) => {
                    const t = TONO[c.tone];
                    const Ic = t.icono;
                    return (
                      <motion.button
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * k, type: 'spring', stiffness: 140, damping: 20 }}
                        onClick={() => {
                          setEleccion(c);
                          setFase(c.followUpBeats.length ? 'despues' : 'fin');
                          setI(0);
                        }}
                        className="w-full text-left rounded-2xl px-4 py-3.5 bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.08] active:scale-[0.98] transition flex gap-3"
                      >
                        <Ic size={18} weight="duotone" className={`mt-0.5 shrink-0 ${t.color}`} />
                        <span className="text-[15px] leading-snug text-zinc-100">
                          {c.label}
                          {elegidaAntes === c.id && (
                            <span className="ml-2 text-[11px] text-zinc-500 whitespace-nowrap">(la elegiste antes)</span>
                          )}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {fase === 'fin' && (
              <motion.div
                key="fin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1.75rem] p-5 bg-zinc-900/90 ring-1 ring-white/[0.08] space-y-4"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Fin del episodio {chapter.chapterNumber < 99 ? chapter.chapterNumber : ''}</div>
                  <p className="mt-2 font-editorial italic text-[18px] leading-snug text-zinc-200">{chapter.nextCliffhangerTeaser}</p>
                </div>
                <button
                  onClick={() => (eleccion ? onFinish(eleccion) : onClose())}
                  className="w-full min-h-[52px] rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
                >
                  <BookmarkSimple size={18} weight="fill" />
                  Guardar y volver
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {fase === 'escena' && i === 0 && (
            <p className="text-center text-[11px] text-zinc-600 mt-2">Toca para seguir</p>
          )}
        </div>
      </div>
    </div>
  );
}
