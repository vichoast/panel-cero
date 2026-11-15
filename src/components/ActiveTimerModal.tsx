import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  CheckCircle,
  ChatCenteredText,
  Sparkle,
  X,
  FastForward,
  Broadcast,
} from '@phosphor-icons/react';
import { CharacterProfile, MicroMission } from '../types';
import { getLiveTimerBanter } from '../data/content';
import { CharacterPortrait } from './CharacterPortrait';

interface ActiveTimerModalProps {
  mission: MicroMission | null;
  charA: CharacterProfile;
  charB: CharacterProfile;
  onClose: () => void;
  onCompleteMission: (mission: MicroMission, bonusFlow: boolean) => void;
}

const STREAM_HYPE_MESSAGES = [
  {
    user: 'ValoRadiant_99',
    color: 'text-emerald-400',
    text: 'ESE CLUTCH PARTIENDO LA TAREA SIN SOBREPENSAR, GG EZ',
  },
  {
    user: 'KamisamaFan2004',
    color: 'text-pink-400',
    text: '5 minutos no son nada, tú puedes reina del storyboard',
  },
  {
    user: 'BlenderCubeEnjoyer',
    color: 'text-sky-400',
    text: '+1000 de aura solo por abrir el programa y dar el primer paso',
  },
  {
    user: 'BL_Archivist',
    color: 'text-rose-400',
    text: 'Termina estos minutos que necesito ver qué pasa entre ellos dos en el capítulo',
  },
  {
    user: 'MichiSupervisor',
    color: 'text-amber-400',
    text: 'El sindicato de gatos aprueba oficialmente este avance de hoy',
  },
  {
    user: 'JhinFourActs',
    color: 'text-purple-400',
    text: 'Cuatro objetos menos en la pieza = perfección escénica absoluta',
  },
];

export const ActiveTimerModal: React.FC<ActiveTimerModalProps> = ({
  mission,
  charA,
  charB,
  onClose,
  onCompleteMission,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(true);
  const [banterIndex, setBanterIndex] = useState(0);
  const [streamIndex, setStreamIndex] = useState(0);
  const [isFlowExtension, setIsFlowExtension] = useState(false);

  useEffect(() => {
    if (mission) {
      setSecondsLeft(mission.durationMinutes * 60);
      setIsRunning(true);
      setBanterIndex(0);
      setIsFlowExtension(false);
    }
  }, [mission]);

  useEffect(() => {
    if (!mission || !isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mission, isRunning]);

  useEffect(() => {
    if (!mission || !isRunning) return;
    const banterTimer = setInterval(() => {
      setBanterIndex((prev) => (prev + 1) % 5);
      setStreamIndex((prev) => (prev + 1) % STREAM_HYPE_MESSAGES.length);
    }, 7000);
    return () => clearInterval(banterTimer);
  }, [mission, isRunning]);

  if (!mission) return null;

  const banterList = getLiveTimerBanter(charA, charB, mission.domain);
  const activeBanter = banterList[banterIndex % banterList.length];

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = (isFlowExtension ? 10 : mission.durationMinutes) * 60;
  const progressPct = Math.min(
    100,
    Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100)
  );

  const msg1 = STREAM_HYPE_MESSAGES[streamIndex % STREAM_HYPE_MESSAGES.length];
  const msg2 = STREAM_HYPE_MESSAGES[(streamIndex + 1) % STREAM_HYPE_MESSAGES.length];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-zinc-950/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 110, damping: 18 }}
          className="relative w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl text-zinc-100"
        >
          {/* Top progress bar */}
          <div className="h-1.5 w-full bg-zinc-800 overflow-hidden sticky top-0 z-10">
            <motion.div
              className="h-full bg-rose-500"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-5 md:p-7 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tech uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  <Sparkle size={13} weight="fill" />
                  Modo Una Sola Cosa — {mission.domain === 'pieza' ? 'Mi Pieza' : 'Universidad'}
                </span>
                <h2 className="mt-2 text-xl md:text-2xl font-bold tracking-tight text-white">
                  {mission.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Single Micro-Instruction Box */}
            <div className="p-4 md:p-5 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-2.5">
              <div className="text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                Tu única instrucción por ahora (olvida todo lo demás):
              </div>
              <p className="text-base md:text-lg text-zinc-100 leading-relaxed font-medium">
                {mission.actionInstruction}
              </p>
              <p className="text-xs text-zinc-400 border-t border-white/5 pt-2">
                Por qué sirve: {mission.whyItWorks}
              </p>
            </div>

            {/* Timer + Live Studio Companions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              {/* Clock */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-zinc-950 border border-white/10">
                <span className="text-xs font-mono-tech uppercase tracking-widest text-zinc-400 text-center">
                  {isFlowExtension ? 'Racha Modo Flow (+Doble Tensión)' : 'Reloj de Arranque'}
                </span>
                <div className="my-2 text-5xl font-mono-tech font-semibold tracking-tight text-white">
                  {formattedTime}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setIsRunning((r) => !r)}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition"
                  >
                    {isRunning ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
                    {isRunning ? 'Pausar' : 'Reanudar'}
                  </button>
                  <button
                    onClick={() => {
                      setIsFlowExtension(true);
                      setSecondsLeft((s) => s + 600);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-medium text-rose-300 transition"
                    title="Si ya agarraste vuelo y quieres aprovechar que estás concentrada"
                  >
                    +10m Flow
                  </button>
                </div>
              </div>

              {/* Live BL Companions Banter */}
              <div className="md:col-span-7 p-4 rounded-2xl bg-zinc-950/70 border border-white/10 flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                    <ChatCenteredText size={15} weight="fill" />
                    En vivo en el estudio mientras trabajas:
                  </span>
                  <button
                    onClick={() => setBanterIndex((b) => b + 1)}
                    className="text-xs text-zinc-400 hover:text-white underline transition shrink-0"
                  >
                    Siguiente diálogo
                  </button>
                </div>

                <div className="flex items-center gap-3.5">
                  <CharacterPortrait
                    characterId={activeBanter.speaker.id}
                    expression="blush"
                    size="md"
                    className="rounded-xl border border-white/10"
                  />
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-white">
                      {activeBanter.speaker.name}
                    </div>
                    <p className="text-sm text-zinc-200 italic leading-relaxed">
                      "{activeBanter.line}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width Live Stream Chat Box (Never truncated!) */}
            <div className="p-4 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-tech uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Broadcast size={14} weight="fill" />
                  Stream Chat en Vivo (Hype Squad)
                </span>
                <button
                  onClick={() => setStreamIndex((s) => s + 1)}
                  className="text-[11px] font-mono-tech text-zinc-400 hover:text-zinc-200 transition"
                >
                  Ver más chat
                </button>
              </div>
              <div className="space-y-1.5 text-xs font-mono-tech leading-relaxed">
                <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 break-words">
                  <strong className={msg1.color}>[{msg1.user}]: </strong>
                  <span className="text-zinc-200">{msg1.text}</span>
                </div>
                <div className="p-2 rounded-lg bg-zinc-900/50 border border-white/5 break-words opacity-85">
                  <strong className={msg2.color}>[{msg2.user}]: </strong>
                  <span className="text-zinc-300">{msg2.text}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1">
              <button
                onClick={() => onCompleteMission(mission, isFlowExtension)}
                className="w-full py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
              >
                {secondsLeft === 0 ? (
                  <>
                    <CheckCircle size={20} weight="fill" />
                    ¡Tiempo cumplido! Desbloquear Episodio BL ahora
                  </>
                ) : (
                  <>
                    <FastForward size={20} weight="fill" />
                    ¡Ya completé el micropaso! Cobrar y leer Episodio BL
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
