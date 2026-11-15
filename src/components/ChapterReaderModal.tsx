import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Heart,
  Sparkle,
  X,
  ArrowRight,
  BookOpenText,
  ArrowCounterClockwise,
} from '@phosphor-icons/react';
import { BLChapter, SceneChoice } from '../types';
import { CHARACTERS } from '../data/content';
import { CharacterPortrait } from './CharacterPortrait';

interface ChapterReaderModalProps {
  chapter: BLChapter | null;
  onClose: () => void;
  onFinishChapter: (choice: SceneChoice) => void;
}

export const ChapterReaderModal: React.FC<ChapterReaderModalProps> = ({
  chapter,
  onClose,
  onFinishChapter,
}) => {
  const [revealedThoughts, setRevealedThoughts] = useState<Record<string, boolean>>({});
  const [selectedChoice, setSelectedChoice] = useState<SceneChoice | null>(null);

  // Reset choice and revealed thoughts every time a different chapter opens!
  useEffect(() => {
    setSelectedChoice(null);
    setRevealedThoughts({});
  }, [chapter?.id]);

  if (!chapter) return null;

  const toggleThought = (beatId: string) => {
    setRevealedThoughts((prev) => ({ ...prev, [beatId]: !prev[beatId] }));
  };

  const revealAllThoughts = () => {
    const all: Record<string, boolean> = {};
    chapter.beats.forEach((b) => {
      if (b.hiddenThought) all[b.id] = true;
    });
    if (selectedChoice) {
      selectedChoice.followUpBeats.forEach((b) => {
        if (b.hiddenThought) all[b.id] = true;
      });
    }
    setRevealedThoughts(all);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-zinc-950/90 backdrop-blur-xl">
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 110, damping: 20 }}
          className="relative w-full max-w-3xl max-h-[90dvh] flex flex-col rounded-3xl bg-zinc-900 border border-white/15 shadow-2xl overflow-hidden text-zinc-100"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {chapter.tropeTag}
                </span>
                <span className="text-xs text-zinc-400 font-mono-tech">
                  Doble Canal Activo
                </span>
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-editorial font-semibold text-white">
                {chapter.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={revealAllThoughts}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-rose-300 border border-rose-500/20 flex items-center gap-1.5 transition"
                title="Revelar lo que están pensando en secreto"
              >
                <Eye size={15} weight="duotone" />
                Revelar pensamientos ocultos
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Webtoon / Visual Novel Panels */}
          <div className="p-6 md:p-8 space-y-5 overflow-y-auto bg-halftone-dark flex-1">
            <p className="text-sm text-zinc-400 italic border-l-2 border-rose-500/40 pl-3">
              {chapter.subtitle} — Toca cualquier cuadro con el ícono de ojo para leer lo que el personaje calla por dentro.
            </p>

            {chapter.beats.map((beat, idx) => {
              if (beat.speaker === 'narrator') {
                return (
                  <motion.div
                    key={beat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-2xl bg-zinc-950/85 border border-white/10 text-sm md:text-base font-editorial italic text-zinc-300 leading-relaxed"
                  >
                    {beat.spokenText}
                  </motion.div>
                );
              }

              const char = CHARACTERS[beat.speaker];
              const isThoughtOpen = !!revealedThoughts[beat.id];

              return (
                <motion.div
                  key={beat.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  onClick={() => beat.hiddenThought && toggleThought(beat.id)}
                  className={`p-5 rounded-2xl bg-zinc-950/90 border transition ${
                    beat.hiddenThought
                      ? 'cursor-pointer hover:border-rose-400/40 border-white/10'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <CharacterPortrait
                      characterId={char.id}
                      expression={beat.expression || 'neutral'}
                      size="md"
                      className="rounded-2xl border border-white/10"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">
                          {char.name}{' '}
                          <span className="text-xs font-normal text-zinc-400">
                            — {char.epithet}
                          </span>
                        </span>
                        {beat.hiddenThought && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono-tech text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                            <Eye size={13} />
                            {isThoughtOpen ? 'Pensamiento visible' : 'Tocar para leer mente'}
                          </span>
                        )}
                      </div>

                      <p className="text-base text-zinc-100 leading-relaxed">
                        "{beat.spokenText}"
                      </p>

                      {beat.stageDirection && (
                        <p className="text-xs text-zinc-400 italic">
                          * {beat.stageDirection}
                        </p>
                      )}

                      {/* Hidden Inner Monologue (El Doble Canal) */}
                      <AnimatePresence>
                        {beat.hiddenThought && isThoughtOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs md:text-sm text-rose-200 font-editorial italic"
                          >
                            <strong className="font-sans not-italic text-rose-300 uppercase tracking-wider text-[11px] block mb-1">
                              [Lo que {char.name} calla por dentro]:
                            </strong>
                            "{beat.hiddenThought}"
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Choice Section */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider text-rose-300">
                  <Sparkle size={15} weight="fill" />
                  Decisión de Escena: {chapter.choicePrompt}
                </div>
                {selectedChoice && (
                  <button
                    onClick={() => setSelectedChoice(null)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 flex items-center gap-1 transition shrink-0"
                  >
                    <ArrowCounterClockwise size={13} />
                    Elegir otra opción
                  </button>
                )}
              </div>

              {!selectedChoice ? (
                <div className="grid grid-cols-1 gap-3">
                  {chapter.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => setSelectedChoice(choice)}
                      className="text-left p-4 rounded-2xl bg-zinc-800/80 hover:bg-rose-950/50 border border-white/10 hover:border-rose-400/50 transition flex items-center justify-between gap-4 group active:scale-[0.99]"
                    >
                      <span className="text-sm md:text-base font-medium text-zinc-100 group-hover:text-white">
                        {choice.label}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono-tech bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        +{choice.chemistryDelta}% Tensión
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-200">
                    <strong>Elegiste:</strong> {selectedChoice.label}
                  </div>

                  {selectedChoice.followUpBeats.map((fb) => {
                    const char =
                      fb.speaker === 'narrator' ? null : CHARACTERS[fb.speaker];
                    return (
                      <div
                        key={fb.id}
                        className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2"
                      >
                        {char && (
                          <div className="flex items-center gap-3">
                            <CharacterPortrait
                              characterId={char.id}
                              expression={fb.expression || 'blush'}
                              size="sm"
                              className="rounded-xl"
                            />
                            <span className="text-sm font-semibold text-white">
                              {char.name}
                            </span>
                          </div>
                        )}
                        <p className="text-base text-zinc-100 leading-relaxed">
                          "{fb.spokenText}"
                        </p>
                        {fb.hiddenThought && (
                          <p className="text-xs text-rose-200/90 font-editorial italic pt-1">
                            [Pensamiento oculto]: "{fb.hiddenThought}"
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {/* Next Cliffhanger Hook */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-mono-tech uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <BookOpenText size={15} weight="fill" />
                        Adelanto del próximo capítulo:
                      </span>
                      <p className="text-sm text-zinc-300">
                        {chapter.nextCliffhangerTeaser}
                      </p>
                    </div>
                    <button
                      onClick={() => onFinishChapter(selectedChoice)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shrink-0 transition active:scale-[0.98]"
                    >
                      <Heart size={18} weight="fill" />
                      Guardar Progreso (+{selectedChoice.chemistryDelta}% Química)
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
