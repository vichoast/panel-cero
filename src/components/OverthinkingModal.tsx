import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LockKey,
  Sparkle,
  X,
  Shuffle,
  Lightning,
  CheckCircle,
} from '@phosphor-icons/react';
import { CharacterProfile, MicroMission, TaskDomain } from '../types';
import { CharacterPortrait } from './CharacterPortrait';

interface OverthinkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  charA: CharacterProfile;
  charB: CharacterProfile;
  onStartUnblockedMission: (mission: MicroMission) => void;
}

const PRESET_TANGLES = [
  {
    label: 'Quiero animar/dibujar pero mi escritorio está lleno de cosas',
    domain: 'pieza' as TaskDomain,
    microResult:
      'Empuja todo lo de la mesa a un costado o saca solo las tazas durante 3 minutos. Prohibido ordenar el resto de la pieza antes de abrir tu programa.',
  },
  {
    label: 'Tengo que limpiar la pieza pero no sé si partir por la ropa, la cama o el piso',
    domain: 'pieza' as TaskDomain,
    microResult:
      'Bloqueamos el piso y el clóset con candado. Tu única misión legal por los próximos 3 minutos es despejar solo la parte de arriba de tu cama.',
  },
  {
    label: 'Tengo varias entregas de la U (3D, Storyboard, Portafolio) y me paraliza elegir',
    domain: 'universidad' as TaskDomain,
    microResult:
      'Congelamos todas las entregas menos una: abre solo el programa de la entrega más cercana, guarda el archivo con nombre y haz el primer cubo o boceto feo por 5 minutos.',
  },
];

export const OverthinkingModal: React.FC<OverthinkingModalProps> = ({
  isOpen,
  onClose,
  charA,
  charB,
  onStartUnblockedMission,
}) => {
  const [stepA, setStepA] = useState('');
  const [stepB, setStepB] = useState('');
  const [stepC, setStepC] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<TaskDomain>('pieza');
  const [resolvedStep, setResolvedStep] = useState<string | null>(null);
  const [lockedSteps, setLockedSteps] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleBreakLoop = () => {
    const items = [stepA, stepB, stepC].map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) {
      const fallback = PRESET_TANGLES[0];
      setResolvedStep(fallback.microResult);
      setLockedSteps(['Ordenar el resto de la habitación', 'Planificar toda la semana']);
      return;
    }
    const chosenIndex = Math.floor(Math.random() * items.length);
    const chosen = items[chosenIndex];
    const others = items.filter((_, idx) => idx !== chosenIndex);
    setResolvedStep(
      `Solo haz los primeros 3 minutos de: "${chosen}". Todo lo demás tiene prohibición estricta de tocarse ahora.`
    );
    setLockedSteps(
      others.length > 0
        ? others
        : ['El resto de tareas mentales que te estaban bloqueando']
    );
  };

  const handleLaunch = () => {
    if (!resolvedStep) return;
    onStartUnblockedMission({
      id: `unblock-${Date.now()}`,
      domain: selectedDomain,
      category: 'Destrabador Anti-Bucle',
      title: 'Corte de Parálisis por Análisis',
      durationMinutes: 4,
      actionInstruction: resolvedStep,
      whyItWorks:
        'Cuando tu cerebro dice "tengo que hacer X primero y antes Y", se paraliza intentando ordenar todo. Al bloquear con candado el resto, ya no tienes que decidir.',
      characterIntro: {
        noctis: 'Yo guardo el resto de tus pendientes bajo llave. Haz solo este primer paso.',
        vesper: 'He eliminado el ruido del escenario. Ejecuta únicamente este acto.',
        kazuha: 'Prohibido pensar en las demás cosas. Yo vigilo el candado mientras haces esto.',
        renji: 'Tiramos el resto de la lista por la ventana. Cinco minutos a esto y cobramos capítulo.',
      },
    });
    setResolvedStep(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative w-full max-w-2xl rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden text-zinc-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-zinc-950/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
                <Shuffle size={22} weight="duotone" />
              </div>
              <div>
                <span className="text-xs font-mono-tech uppercase tracking-widest text-rose-400">
                  Protocolo Anti-Parálisis por Análisis
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  "Siento que tengo que hacer otra cosa primero"
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80dvh] overflow-y-auto">
            {/* Character reassurance */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/70 border border-white/10">
              <CharacterPortrait characterId={charA.id} expression="intense" size="sm" className="rounded-xl" />
              <div className="text-sm leading-relaxed text-zinc-300">
                <span className="font-semibold text-white">{charA.name}: </span>
                "No intentes ordenar todo en tu cabeza antes de empezar. Dime qué cosas chocan en tu mente (o toca un botón rápido) y{' '}
                <span className="text-rose-300 font-medium">{charB.name} y yo bloquearemos con candado todo menos una</span>."
              </div>
            </div>

            {!resolvedStep ? (
              <>
                {/* Quick 1-click tangles */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                    Opción A: Toca tu bucle actual (1 clic, sin escribir)
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {PRESET_TANGLES.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDomain(preset.domain);
                          setResolvedStep(preset.microResult);
                          setLockedSteps([
                            'Pensar en el orden perfecto de toda la semana',
                            'Terminar todo de una sola vez',
                          ]);
                        }}
                        className="text-left p-3.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-white/10 hover:border-rose-400/40 transition flex items-center justify-between gap-3 group active:scale-[0.99]"
                      >
                        <span className="text-sm text-zinc-200 group-hover:text-white">
                          {preset.label}
                        </span>
                        <Lightning size={18} className="text-rose-400 shrink-0" weight="fill" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Or write the 2-3 competing thoughts */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                      Opción B: Escribe las 2 o 3 cosas que te tienen en bucle
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDomain('pieza')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          selectedDomain === 'pieza'
                            ? 'bg-rose-500 text-white'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        Es de Mi Pieza
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDomain('universidad')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          selectedDomain === 'universidad'
                            ? 'bg-sky-500 text-white'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        Es de la Uni
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400">Cosa 1 que quiero hacer</span>
                      <input
                        value={stepA}
                        onChange={(e) => setStepA(e.target.value)}
                        placeholder="Ej: Avanzar el 3D"
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400">Pero siento que antes debo...</span>
                      <input
                        value={stepB}
                        onChange={(e) => setStepB(e.target.value)}
                        placeholder="Ej: Limpiar el escritorio"
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs text-zinc-400">Y antes de eso... (opcional)</span>
                      <input
                        value={stepC}
                        onChange={(e) => setStepC(e.target.value)}
                        placeholder="Ej: Ordenar la ropa"
                        className="px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleBreakLoop}
                    className="w-full py-3.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
                  >
                    <Sparkle size={18} weight="fill" />
                    Que {charA.name} y {charB.name} decidan por mí ahora
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Locked items */}
                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                    <LockKey size={16} className="text-amber-400" weight="fill" />
                    Bloqueado por {charB.name} (Prohibido pensar en esto hoy):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lockedSteps.map((locked, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs text-zinc-500 line-through flex items-center gap-1.5"
                      >
                        <LockKey size={13} />
                        {locked}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Single chosen micro-step */}
                <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-rose-300">
                    <CheckCircle size={16} weight="fill" />
                    Tu Único Paso Autorizado (4 Minutos):
                  </div>
                  <p className="text-base font-medium text-white leading-relaxed">
                    {resolvedStep}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setResolvedStep(null)}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition"
                  >
                    Cambiar
                  </button>
                  <button
                    onClick={handleLaunch}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
                  >
                    <Lightning size={18} weight="fill" />
                    Partir estos 4 minutos y desbloquear escena BL
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
