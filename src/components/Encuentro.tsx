import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, LockSimple, Check, CaretLeft, BookOpen, Sparkle } from '@phosphor-icons/react';
import { CharacterId, SavedProgress, ShipId } from '../types';
import { CHARACTERS, HISTORIAS, SHIPS } from '../data/content';
import { PRESENTACION } from '../data/presentacion';
import { bloqueo, complemento, MAX_ACTIVAS, ocupados, parejaDe, activas, terminada } from '../data/parejas';
import { CharacterPortrait } from './CharacterPortrait';
import { Maquina } from '../ui/Bocadillo';

type Paso = 'portada' | 'intro' | 'elegir' | 'sellar' | 'segunda' | 'sellar2';
const ORDEN: CharacterId[] = ['kazuha', 'renji', 'noctis', 'vesper'];

// Primera vez: portada → los cuatro se presentan → ella arma la pareja → la historia se sella.
// Más adelante (al liberarse personajes) se abre directo en "elegir".
export function Encuentro({
  progress,
  completo,
  onTerminar,
  onCerrar,
  onRecuperar,
}: {
  progress: SavedProgress;
  completo: boolean;
  onTerminar: (nuevas: ShipId[]) => void;
  onCerrar?: () => void;
  onRecuperar?: () => void;
}) {
  const [paso, setPaso] = useState<Paso>(completo ? 'portada' : 'elegir');
  const [quien, setQuien] = useState(0);
  const [linea, setLinea] = useState(0);
  const [sel, setSel] = useState<CharacterId[]>([]);
  const [elegida, setElegida] = useState<ShipId | null>(null);

  const ocup = ocupados(progress);
  const libresAhora = MAX_ACTIVAS - activas(progress).length;

  const tocar = (c: CharacterId) => {
    if (ocup[c]) return;
    setSel((s) => (s.includes(c) ? s.filter((x) => x !== c) : s.length >= 2 ? [s[1], c] : [...s, c]));
  };

  const candidata = sel.length === 2 ? parejaDe(sel[0], sel[1]) : undefined;
  const motivo = candidata ? bloqueo(progress, candidata) : null;

  // Al formar una pareja, su tarjeta sube sola a la vista.
  const tarjeta = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (candidata) setTimeout(() => tarjeta.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 250);
  }, [candidata]);

  // Con el primero elegido, se marca qué compañeros no se pueden (historia ya terminada).
  const imposibleCon = (c: CharacterId) => {
    if (sel.length !== 1 || sel[0] === c) return false;
    const s = parejaDe(sel[0], c);
    return !s || terminada(progress, s);
  };

  const segunda = elegida ? complemento(elegida) : undefined;
  const puedeSegunda = !!segunda && libresAhora >= 2 && bloqueo({ ...progress, parejas: [...(progress.parejas ?? []), elegida!] }, segunda) === null;

  const fondo = paso === 'intro' ? CHARACTERS[ORDEN[quien]].colorHex : '#f43f5e';

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#0b0b0d] text-zinc-100">
      <motion.div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[160%] max-w-[900px] h-[70%] rounded-full blur-3xl"
        animate={{ backgroundColor: fondo, opacity: paso === 'portada' ? 0.1 : 0.15 }}
        transition={{ duration: 0.8 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-halftone-dark opacity-50" />

      <div className="relative w-full max-w-md h-[100dvh] overflow-y-auto flex flex-col px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {/* ---------------- PORTADA ---------------- */}
          {paso === 'portada' && (
            <motion.div key="portada" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex -space-x-4 mb-10">
                  {ORDEN.map((c, k) => (
                    <motion.div
                      key={c}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: [0, -4, 0] }}
                      transition={{ opacity: { delay: 0.15 * k }, y: { delay: 0.15 * k, duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
                    >
                      <CharacterPortrait characterId={c} size="md" expression="smirk" className="rounded-[1.4rem] ring-2 ring-[#0b0b0d]" />
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 grid place-items-center rounded-lg bg-rose-500 font-editorial font-bold text-white">0</span>
                    <span className="text-[13px] font-semibold tracking-[0.2em] text-zinc-400">PANEL CERO</span>
                  </div>
                  <h1 className="font-editorial text-[44px] leading-[0.95] tracking-tight">
                    Cuatro chicos.
                    <br />
                    Seis historias.
                    <br />
                    <span className="italic text-rose-300">Cero infidelidades.</span>
                  </h1>
                  <p className="mt-5 text-[15px] leading-relaxed text-zinc-400 max-w-[32ch]">
                    Tú eliges quién se enamora de quién. Cada cinco minutos que le ganas al bloqueo, ellos avanzan un capítulo.
                  </p>
                </motion.div>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={() => setPaso('intro')}
                className="w-full h-14 rounded-[1.4rem] bg-rose-500 hover:bg-rose-400 text-white text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_16px_34px_-14px_rgba(244,63,94,0.7)] active:scale-[0.98] transition"
              >
                Conocerlos <ArrowRight size={17} weight="bold" />
              </motion.button>
              {onRecuperar && (
                <button onClick={onRecuperar} className="mt-3 h-10 text-[13px] text-zinc-500 hover:text-zinc-200">
                  Ya tenía avance en otro celular
                </button>
              )}
            </motion.div>
          )}

          {/* ---------------- PRESENTACIONES ---------------- */}
          {paso === 'intro' &&
            (() => {
              const c = CHARACTERS[ORDEN[quien]];
              const pr = PRESENTACION[c.id];
              const ultimaLinea = linea >= pr.intro.length - 1;
              const siguiente = () => {
                if (!ultimaLinea) return setLinea(linea + 1);
                if (quien < ORDEN.length - 1) {
                  setQuien(quien + 1);
                  setLinea(0);
                } else setPaso('elegir');
              };
              return (
                <motion.div key={'intro-' + c.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ type: 'spring', stiffness: 160, damping: 24 }} className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between h-10">
                    <div className="flex gap-1.5">
                      {ORDEN.map((x, k) => (
                        <span key={x} className={`h-1 rounded-full transition-all ${k === quien ? 'w-6' : 'w-2'} ${k <= quien ? 'bg-zinc-200' : 'bg-white/15'}`} />
                      ))}
                    </div>
                    <button onClick={() => setPaso('elegir')} className="text-[13px] text-zinc-500 hover:text-zinc-200">
                      Saltar
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col justify-center cursor-pointer select-none" onClick={siguiente}>
                    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} className="self-center mb-6">
                      <CharacterPortrait
                        characterId={c.id}
                        size="stage"
                        expression={linea === 0 ? 'neutral' : linea === 1 ? 'smirk' : 'blush'}
                        className="rounded-[2rem] ring-1 ring-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
                      />
                    </motion.div>
                    <div className="text-[11px] uppercase tracking-[0.2em]" style={{ color: c.colorHex }}>
                      {c.epithet}
                    </div>
                    <h2 className="font-editorial text-[46px] leading-none mt-1">{c.name}</h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.traits.map((t) => (
                        <span key={t} className="h-7 px-3 rounded-full bg-white/[0.05] ring-1 ring-white/[0.08] text-[12px] text-zinc-300 grid place-items-center">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 min-h-[120px] rounded-[1.6rem] px-5 py-4 bg-zinc-900/80 ring-1 ring-white/[0.08]">
                      <p className="text-[16px] leading-relaxed text-zinc-50">
                        <Maquina key={c.id + linea} texto={pr.intro[linea]} />
                      </p>
                    </div>
                    <p className="mt-3 text-[13px] italic text-zinc-500">{pr.enamorado}</p>
                  </div>

                  <button
                    onClick={siguiente}
                    className="w-full h-14 rounded-[1.4rem] bg-white/[0.06] ring-1 ring-white/10 text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition"
                  >
                    {!ultimaLinea ? 'Seguir escuchando' : quien < ORDEN.length - 1 ? `Conocer a ${CHARACTERS[ORDEN[quien + 1]].name}` : 'Elegir a quién emparejar'}
                    <ArrowRight size={17} weight="bold" />
                  </button>
                </motion.div>
              );
            })()}

          {/* ---------------- ELEGIR PAREJA ---------------- */}
          {paso === 'elegir' && (
            <motion.div key="elegir" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <div className="flex items-center justify-between h-10">
                {completo ? (
                  <button onClick={() => { setPaso('intro'); setQuien(3); setLinea(2); }} className="h-8 pr-3 flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
                    <CaretLeft size={16} /> Atrás
                  </button>
                ) : onCerrar ? (
                  <button onClick={onCerrar} className="h-8 pr-3 flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
                    <CaretLeft size={16} /> Volver
                  </button>
                ) : (
                  <span />
                )}
              </div>
              <h2 className="font-editorial text-[34px] leading-[1.05] mt-2">¿A quién quieres ver enamorarse?</h2>
              <p className="mt-2 text-[14px] text-zinc-400 leading-relaxed">Toca a dos. Su historia dura diez capítulos, y mientras dure, no pueden estar con nadie más.</p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {ORDEN.map((id) => {
                  const c = CHARACTERS[id];
                  const ocupadoCon = ocup[id];
                  const on = sel.includes(id);
                  const no = imposibleCon(id);
                  const pareja = ocupadoCon ? CHARACTERS[SHIPS[ocupadoCon].charA === id ? SHIPS[ocupadoCon].charB : SHIPS[ocupadoCon].charA] : null;
                  return (
                    <motion.button
                      key={id}
                      whileTap={{ scale: ocupadoCon ? 1 : 0.97 }}
                      onClick={() => tocar(id)}
                      disabled={!!ocupadoCon}
                      className={`relative rounded-[1.6rem] p-3 text-left transition ${on ? 'bg-white/[0.08]' : 'bg-white/[0.03]'} ${ocupadoCon || no ? 'opacity-40' : ''}`}
                      style={{ boxShadow: on ? `inset 0 0 0 2px ${c.colorHex}` : 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                    >
                      <CharacterPortrait characterId={id} size="fill" expression={on ? "blush" : "neutral"} className="rounded-2xl" />
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-editorial text-[20px]">{c.name}</span>
                        {on && (
                          <span className="w-5 h-5 rounded-full grid place-items-center" style={{ background: c.colorHex }}>
                            <Check size={12} weight="bold" className="text-white" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">
                        {ocupadoCon && pareja ? (
                          <span className="flex items-center gap-1">
                            <LockSimple size={11} weight="fill" /> con {pareja.name}
                          </span>
                        ) : no ? (
                          'su historia ya terminó'
                        ) : (
                          c.archetype.split('/')[0].trim()
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex-1" />

              <AnimatePresence>
                {candidata && (
                  <motion.div
                    key={candidata}
                    ref={tarjeta}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 22 }}
                    className="mt-6 rounded-[1.75rem] p-5 bg-zinc-900/90 ring-1 ring-white/10 space-y-3"
                  >
                    <div className="text-[11px] uppercase tracking-[0.16em] text-rose-300/80">{SHIPS[candidata].tropeHeadline}</div>
                    <h3 className="font-editorial text-[26px] leading-tight">{SHIPS[candidata].title}</h3>
                    <p className="text-[14px] leading-relaxed text-zinc-300">{SHIPS[candidata].synopsis}</p>
                    {(() => {
                      const ep1 = HISTORIAS[candidata]?.[0];
                      if (!ep1) return null;
                      return (
                        <div className="pt-1 space-y-2">
                          {[
                            [ep1.cliffhangerPreview.speakerA, ep1.cliffhangerPreview.lineA],
                            [ep1.cliffhangerPreview.speakerB, ep1.cliffhangerPreview.lineB],
                          ].map(([id, l], k) => (
                            <p key={k} className="text-[13px] leading-snug text-zinc-400">
                              <span className="font-semibold" style={{ color: CHARACTERS[id as CharacterId].colorHex }}>
                                {CHARACTERS[id as CharacterId].name}:
                              </span>{' '}
                              «{l}»
                            </p>
                          ))}
                        </div>
                      );
                    })()}
                    <div className="flex items-center gap-1.5 text-[12px] text-zinc-500">
                      <BookOpen size={13} /> 10 capítulos · 30 decisiones · 4 secretos
                    </div>
                    {motivo ? (
                      <p className="text-[13px] text-amber-200/90">
                        {motivo.motivo === 'terminada'
                          ? 'Esta historia ya la terminaste. Puedes releerla desde Capítulos.'
                          : motivo.motivo === 'lleno'
                            ? 'Ya tienes dos historias en curso. Termina una para empezar otra.'
                            : `${CHARACTERS[motivo.quien].name} ya está en otra historia.`}
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          setElegida(candidata);
                          setPaso('sellar');
                        }}
                        className="w-full h-13 min-h-[52px] rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
                      >
                        Quiero su historia <ArrowRight size={17} weight="bold" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {!candidata && (
                <p className="mt-6 text-center text-[13px] text-zinc-600">{sel.length === 1 ? `¿Con quién, ${CHARACTERS[sel[0]].name}?` : 'Elige al primero'}</p>
              )}
            </motion.div>
          )}

          {/* ---------------- SELLAR ---------------- */}
          {paso === 'sellar' && elegida && (
            <Sello
              key={'sello-' + elegida}
              ship={elegida}
              onSeguir={() => (puedeSegunda ? setPaso('segunda') : onTerminar([elegida]))}
              onVolver={() => setPaso('elegir')}
            />
          )}

          {paso === 'sellar2' && elegida && segunda && (
            <Sello key={'sello2-' + segunda} ship={segunda} onSeguir={() => onTerminar([elegida, segunda])} onVolver={() => setPaso('segunda')} volverTexto="Mejor no" />
          )}

          {/* ---------------- SEGUNDA HISTORIA ---------------- */}
          {paso === 'segunda' && elegida && segunda && (
            <motion.div key="segunda" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex -space-x-4 mb-6">
                  {[SHIPS[segunda].charA, SHIPS[segunda].charB].map((c) => (
                    <CharacterPortrait key={c} characterId={c} size="lg" expression="look-away" className="rounded-[1.6rem] ring-2 ring-[#0b0b0d]" />
                  ))}
                </div>
                <h2 className="font-editorial text-[32px] leading-[1.05]">
                  ¿Y {CHARACTERS[SHIPS[segunda].charA].name} y {CHARACTERS[SHIPS[segunda].charB].name}?
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">
                  Quedaron libres. Puedes tener una segunda historia al mismo tiempo, solo con ellos dos. O dejarlos esperando hasta que termines esta.
                </p>
                <div className="mt-5 rounded-[1.5rem] p-4 bg-white/[0.03] ring-1 ring-white/[0.08]">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-rose-300/80">{SHIPS[segunda].tropeHeadline}</div>
                  <div className="font-editorial text-[22px] leading-tight mt-0.5">{SHIPS[segunda].title}</div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-400">{SHIPS[segunda].synopsis}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setPaso('sellar2')}
                  className="w-full min-h-[52px] rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
                >
                  <Sparkle size={17} weight="fill" /> Sí, las dos historias
                </button>
                <button
                  onClick={() => onTerminar([elegida])}
                  className="w-full min-h-[52px] rounded-2xl bg-white/[0.04] ring-1 ring-white/10 text-zinc-200 font-medium active:scale-[0.98] transition"
                >
                  Por ahora, solo {SHIPS[elegida].title}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// El momento de "sellar" la pareja: se miran, prometen fidelidad y cae el sello.
function Sello({ ship, onSeguir, onVolver, volverTexto = 'Elegir otra' }: { ship: ShipId; onSeguir: () => void; onVolver: () => void; volverTexto?: string }) {
  const a = CHARACTERS[SHIPS[ship].charA];
  const b = CHARACTERS[SHIPS[ship].charB];
  const [fase, setFase] = useState(0); // 0 reacción A, 1 reacción B, 2 promesa A, 3 promesa B, 4 sello
  const lineas = useMemo(
    () => [
      { c: a, t: PRESENTACION[a.id].elegido.replace(/\{nombre\}/g, b.name) },
      { c: b, t: PRESENTACION[b.id].elegido.replace(/\{nombre\}/g, a.name) },
      { c: a, t: PRESENTACION[a.id].promesa.replace(/\{nombre\}/g, b.name) },
      { c: b, t: PRESENTACION[b.id].promesa.replace(/\{nombre\}/g, a.name) },
    ],
    [a, b]
  );
  const l = lineas[Math.min(fase, 3)];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
      <div className="h-10 flex items-center">
        {fase < 4 && (
          <button onClick={onVolver} className="h-8 pr-3 flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
            <CaretLeft size={16} /> {volverTexto}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center cursor-pointer select-none" onClick={() => fase < 4 && setFase(fase + 1)}>
        <div className="relative flex justify-center items-end gap-0">
          {[a, b].map((c, k) => {
            const habla = fase < 4 && l.c.id === c.id;
            return (
              <motion.div
                key={c.id}
                animate={{
                  x: fase >= 4 ? (k === 0 ? 14 : -14) : k === 0 ? 4 : -4,
                  scale: habla ? 1.04 : fase >= 4 ? 1 : 0.94,
                  opacity: habla || fase >= 4 ? 1 : 0.45,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className={habla ? 'z-10' : ''}
              >
                <CharacterPortrait
                  characterId={c.id}
                  size="stage"
                  expression={fase >= 4 ? 'blush' : habla ? (fase < 2 ? 'smirk' : 'intense') : 'look-away'}
                  className="rounded-[2rem] ring-1 ring-white/10"
                />
              </motion.div>
            );
          })}

          <AnimatePresence>
            {fase >= 4 && (
              <motion.div
                initial={{ scale: 2.4, opacity: 0, rotate: -24 }}
                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                className="absolute -bottom-6 z-20 px-5 py-2.5 rounded-xl border-[3px] border-rose-400 text-rose-300 bg-[#0b0b0d]/80 backdrop-blur font-editorial italic text-[22px] tracking-wide shadow-[0_10px_40px_-10px_rgba(244,63,94,0.6)]"
              >
                Juntos hasta el final
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 min-h-[140px]">
          <AnimatePresence mode="wait">
            {fase < 4 ? (
              <motion.div key={fase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[1.6rem] px-5 py-4 bg-zinc-900/80 ring-1 ring-white/[0.08]">
                <div className="text-sm font-semibold mb-1" style={{ color: l.c.colorHex }}>
                  {l.c.name}
                </div>
                <p className="text-[16px] leading-relaxed text-zinc-50">
                  <Maquina texto={l.t} />
                </p>
              </motion.div>
            ) : (
              <motion.div key="sellado" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center px-2">
                <h2 className="font-editorial text-[30px] leading-tight">{SHIPS[ship].title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">
                  Desde ahora, {a.name} y {b.name} solo tienen ojos el uno para el otro. Quedan libres cuando termines su historia.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {fase < 4 ? (
        <button
          onClick={() => setFase(fase + 1)}
          className="w-full h-14 rounded-[1.4rem] bg-white/[0.06] ring-1 ring-white/10 text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition"
        >
          {fase === 3 ? 'Sellar su historia' : 'Seguir'} <ArrowRight size={17} weight="bold" />
        </button>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onSeguir}
          className="w-full h-14 rounded-[1.4rem] bg-rose-500 hover:bg-rose-400 text-white text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_16px_34px_-14px_rgba(244,63,94,0.7)] active:scale-[0.98] transition"
        >
          Empezar <ArrowRight size={17} weight="bold" />
        </motion.button>
      )}
    </motion.div>
  );
}
