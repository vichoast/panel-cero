import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Export, PlusSquare, DotsThreeVertical, DotsThree, ArrowDown, Copy, Check, DownloadSimple, WarningCircle, DeviceMobile } from '@phosphor-icons/react';
import { CHARACTERS } from '../data/content';
import { alCambiar, entorno, Entorno, instalarDirecto, puedeInstalarDirecto } from '../data/instalacion';
import { CharacterPortrait } from './CharacterPortrait';
import { Maquina } from '../ui/Bocadillo';

const renji = CHARACTERS.renji;

function Paso({ n, children, icono }: { n: number; children: React.ReactNode; icono?: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-7 h-7 shrink-0 rounded-full bg-white/[0.07] ring-1 ring-white/10 grid place-items-center font-mono-tech text-[13px] text-zinc-300">{n}</span>
      <span className="flex-1 pt-0.5 text-[15px] leading-snug text-zinc-200">{children}</span>
      {icono && <span className="shrink-0 w-9 h-9 rounded-xl bg-white/[0.06] grid place-items-center text-sky-300">{icono}</span>}
    </li>
  );
}

// Guía para instalar la app en el celular. Aparece la primera vez que la abre desde el navegador.
export function Instalar({ onSeguir, primeraVez = true }: { onSeguir: () => void; primeraVez?: boolean }) {
  const [donde] = useState<Entorno>(entorno);
  const [directo, setDirecto] = useState(puedeInstalarDirecto());
  const [listo, setListo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => alCambiar(() => setDirecto(puedeInstalarDirecto())), []);

  const instalar = async () => {
    if (await instalarDirecto()) setListo(true);
  };

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(location.href.split('?')[0]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // sin portapapeles
    }
  };

  const linea = listo
    ? 'Listo, directora. Ya tienes el ícono en tu pantalla. Ábrela desde ahí y nos vemos adentro.'
    : donde === 'dentro-de-app'
      ? 'Directora, estás mirándonos desde adentro de otra app. Así no te puedo guardar bien. Ábreme en tu navegador de verdad.'
      : primeraVez
        ? 'Antes de presentarte a los demás: instálame en tu celular. Así me abres con un toque, como cualquier app, y no te pierdo el avance.'
        : 'Directora, instálame en tu celular. Así me abres con un toque, como cualquier app, y no te pierdo el avance.';

  return (
    <div className="fixed inset-0 z-[60] flex justify-center bg-[#0b0b0d] text-zinc-100">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[160%] max-w-[900px] h-[60%] rounded-full blur-3xl bg-amber-500/10" />
      <div className="pointer-events-none absolute inset-0 bg-halftone-dark opacity-50" />
      <div className={`relative w-full max-w-md h-[100dvh] overflow-y-auto flex flex-col px-6 pt-[calc(1.5rem+env(safe-area-inset-top))] ${donde === 'iphone-safari' && !listo ? 'pb-[calc(3.5rem+env(safe-area-inset-bottom))]' : 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]'}`}>
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 grid place-items-center rounded-xl bg-rose-500 font-editorial font-bold text-white text-xl">0</span>
          <div>
            <div className="text-[13px] font-semibold tracking-[0.2em] text-zinc-300">PANEL CERO</div>
            <div className="text-[12px] text-zinc-500">Instálala en tu celular</div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex items-end gap-3">
          <CharacterPortrait characterId="renji" size="md" expression={listo ? 'blush' : 'smirk'} className="rounded-[1.4rem] ring-1 ring-white/10 shrink-0" />
          <div className="flex-1 rounded-3xl rounded-bl-md px-4 py-3 bg-zinc-900 ring-1 ring-white/[0.08]">
            <div className="text-[11px] font-semibold mb-0.5" style={{ color: renji.colorHex }}>
              Renji
            </div>
            <p className="text-[15px] leading-relaxed">
              <Maquina key={linea} texto={linea} />
            </p>
          </div>
        </motion.div>

        <div className="mt-7 flex-1">
          {listo ? (
            <div className="rounded-[1.6rem] p-5 bg-emerald-500/10 ring-1 ring-emerald-300/20 flex gap-3">
              <DeviceMobile size={22} className="text-emerald-300 shrink-0" />
              <p className="text-[15px] leading-relaxed text-zinc-200">Busca el ícono rosado con un «0» en tu pantalla de inicio y abre la app desde ahí.</p>
            </div>
          ) : donde === 'android' && directo ? (
            <button
              onClick={instalar}
              className="w-full h-16 rounded-[1.4rem] bg-rose-500 hover:bg-rose-400 text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-[0_16px_34px_-14px_rgba(244,63,94,0.7)] active:scale-[0.98] transition"
            >
              <DownloadSimple size={20} weight="bold" /> Instalar Panel Cero
            </button>
          ) : donde === 'android' ? (
            <ol className="space-y-4">
              <Paso n={1} icono={<DotsThreeVertical size={22} weight="bold" />}>
                Toca los <b>tres puntos</b> arriba a la derecha de Chrome.
              </Paso>
              <Paso n={2} icono={<DownloadSimple size={20} />}>
                Elige <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.
              </Paso>
              <Paso n={3}>Confirma, y ábrela desde el ícono nuevo.</Paso>
            </ol>
          ) : donde === 'iphone-safari' || donde === 'iphone-otro' ? (
            <>
              <ol className="space-y-4">
                <Paso n={1} icono={<Export size={20} weight="bold" />}>
                  Toca el botón <b>Compartir</b>
                  {donde === 'iphone-safari' ? ', abajo al centro (el cuadrado con la flecha).' : ' (el cuadrado con la flecha, junto a la barra de dirección).'}
                </Paso>
                <Paso n={2} icono={<PlusSquare size={20} />}>
                  Baja un poco y elige <b>Agregar a pantalla de inicio</b>.
                </Paso>
                <Paso n={3}>
                  Toca <b>Agregar</b>, y ábrela desde el ícono nuevo.
                </Paso>
              </ol>
              <div className="mt-6 flex gap-2.5 rounded-2xl px-4 py-3 bg-amber-400/10 ring-1 ring-amber-300/20">
                <WarningCircle size={18} weight="fill" className="text-amber-200 shrink-0 mt-0.5" />
                <p className="text-[13px] leading-relaxed text-amber-100/90">
                  En iPhone, lo que hagas aquí en el navegador no pasa a la app instalada. Instálala ahora y empieza desde el ícono.
                </p>
              </div>
            </>
          ) : donde === 'dentro-de-app' ? (
            <ol className="space-y-4">
              <Paso n={1} icono={<DotsThree size={22} weight="bold" />}>
                Toca los <b>tres puntos</b> (arriba o abajo de la pantalla).
              </Paso>
              <Paso n={2}>
                Elige <b>Abrir en Safari</b> o <b>Abrir en Chrome</b> (a veces dice «Abrir en el navegador»).
              </Paso>
              <Paso n={3}>Allá te explico cómo instalarla.</Paso>
              <li>
                <button
                  onClick={copiarLink}
                  className="mt-1 w-full h-12 rounded-2xl bg-white/[0.05] ring-1 ring-white/10 text-sm text-zinc-200 flex items-center justify-center gap-2 active:scale-[0.98] transition"
                >
                  {copiado ? <Check size={16} weight="bold" className="text-emerald-300" /> : <Copy size={16} />}
                  {copiado ? 'Link copiado: pégalo en Safari o Chrome' : 'O copia el link'}
                </button>
              </li>
            </ol>
          ) : null}
        </div>

        <button
          onClick={onSeguir}
          className="mt-8 w-full h-12 rounded-2xl text-[14px] text-zinc-400 hover:text-white active:scale-[0.98] transition"
        >
          {listo ? 'Seguir aquí de todas formas' : 'Ahora no, seguir en el navegador'}
        </button>
      </div>

      {/* En iPhone con Safari, una flecha que apunta al botón Compartir de abajo */}
      {donde === 'iphone-safari' && !listo && (
        <motion.div
          className="pointer-events-none fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-sky-300"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={26} weight="bold" />
        </motion.div>
      )}
    </div>
  );
}
