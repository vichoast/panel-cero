import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { ShipId } from '../types';
import { CHARACTERS, SHIPS } from '../data/content';
import { PRESENTACION } from '../data/presentacion';
import { CharacterPortrait } from './CharacterPortrait';
import { Maquina } from '../ui/Bocadillo';

// Despedida al terminar una historia: los dos se despiden, se rompe el sello y quedan libres.
export function FinDeHistoria({
  ship,
  hayLibres,
  onNueva,
  onCerrar,
}: {
  ship: ShipId;
  hayLibres: boolean;
  onNueva: () => void;
  onCerrar: () => void;
}) {
  const a = CHARACTERS[SHIPS[ship].charA];
  const b = CHARACTERS[SHIPS[ship].charB];
  const [fase, setFase] = useState(0); // 0 habla A, 1 habla B, 2 cierre
  const habla = fase === 0 ? a : b;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#0b0b0d] text-zinc-100">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[160%] max-w-[900px] h-[70%] rounded-full blur-3xl bg-rose-500/15" />
      <div className="pointer-events-none absolute inset-0 bg-halftone-dark opacity-50" />
      <div className="relative w-full max-w-md h-[100dvh] flex flex-col px-6 pt-[calc(2rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <div className="text-center">
          <div className="text-[11px] uppercase tracking-[0.2em] text-rose-300/80">Fin de la Temporada 1</div>
          <h1 className="font-editorial text-[34px] leading-tight mt-1">{SHIPS[ship].title}</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center cursor-pointer select-none" onClick={() => fase < 2 && setFase(fase + 1)}>
          <div className="flex justify-center items-end">
            {[a, b].map((c, k) => (
              <motion.div
                key={c.id}
                animate={{ x: k === 0 ? 12 : -12, opacity: fase === 2 || habla.id === c.id ? 1 : 0.5, scale: fase < 2 && habla.id === c.id ? 1.04 : 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <CharacterPortrait characterId={c.id} size="stage" expression="blush" className="rounded-[2rem] ring-1 ring-white/10" />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 min-h-[150px]">
            <AnimatePresence mode="wait">
              {fase < 2 ? (
                <motion.div key={fase} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[1.6rem] px-5 py-4 bg-zinc-900/80 ring-1 ring-white/[0.08]">
                  <div className="text-sm font-semibold mb-1" style={{ color: habla.colorHex }}>
                    {habla.name}
                  </div>
                  <p className="text-[16px] leading-relaxed text-zinc-50">
                    <Maquina texto={PRESENTACION[habla.id].final} />
                  </p>
                </motion.div>
              ) : (
                <motion.div key="cierre" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center px-2 space-y-2">
                  <p className="text-[15px] leading-relaxed text-zinc-300">
                    Diez capítulos, diez decisiones tuyas. La historia queda guardada para releerla cuando quieras.
                  </p>
                  <p className="text-[14px] leading-relaxed text-zinc-500">
                    {a.name} y {b.name} quedaron libres.{' '}
                    {hayLibres ? 'Ya puedes elegir una combinación nueva.' : 'Termina la otra historia en curso para armar combinaciones nuevas.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {fase < 2 ? (
          <button
            onClick={() => setFase(fase + 1)}
            className="w-full h-14 rounded-[1.4rem] bg-white/[0.06] ring-1 ring-white/10 text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-white/10 active:scale-[0.98] transition"
          >
            Seguir <ArrowRight size={17} weight="bold" />
          </button>
        ) : (
          <div className="space-y-2">
            {hayLibres && (
              <button
                onClick={onNueva}
                className="w-full h-14 rounded-[1.4rem] bg-rose-500 hover:bg-rose-400 text-white text-[15px] font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
              >
                Elegir una pareja nueva <ArrowRight size={17} weight="bold" />
              </button>
            )}
            <button
              onClick={onCerrar}
              className={`w-full h-14 rounded-[1.4rem] text-[15px] font-medium active:scale-[0.98] transition ${
                hayLibres ? 'bg-white/[0.04] ring-1 ring-white/10 text-zinc-200' : 'bg-rose-500 hover:bg-rose-400 text-white'
              }`}
            >
              {hayLibres ? 'Más tarde' : 'Volver'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
