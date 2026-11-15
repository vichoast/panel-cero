import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Pause, Play, Plus, CaretDown } from '@phosphor-icons/react';
import { CharacterProfile, MicroMission } from '../types';
import { getLiveTimerBanter } from '../data/content';
import { dice } from '../data/voces';
import { Bocadillo } from '../ui/Bocadillo';

// Pantalla de trabajo: el reloj en el centro y los chicos acompañándola.
export function MissionTimer({
  mission,
  guia,
  otro,
  onClose,
  onComplete,
}: {
  mission: MicroMission;
  guia: CharacterProfile;
  otro: CharacterProfile;
  onClose: () => void;
  onComplete: (mission: MicroMission, flow: boolean) => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(mission.durationMinutes * 60);
  const [totalSeconds, setTotalSeconds] = useState(mission.durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [flow, setFlow] = useState(false);
  const [charla, setCharla] = useState(-1); // -1 = frase de inicio del guía
  const [verNota, setVerNota] = useState(true);
  const [porQue, setPorQue] = useState(false);

  // El reloj se calcula contra la hora real de término: no se atrasa si cambia de app.
  const endAtRef = useRef(Date.now() + mission.durationMinutes * 60_000);
  const alarmFiredRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
      audioCtxRef.current?.resume().catch(() => {});
    } catch {
      // sin audio: el aviso será visual y por vibración
    }
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const ringAlarm = () => {
    try {
      const ctx = audioCtxRef.current;
      if (ctx) {
        ctx.resume().catch(() => {});
        [0, 0.22, 0.44, 1.1, 1.32, 1.54].forEach((offset, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = [659.25, 783.99, 1046.5][i % 3];
          const t = ctx.currentTime + offset;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.65);
        });
      }
    } catch {
      // ignorar
    }
    try {
      navigator.vibrate?.([250, 120, 250, 120, 400]);
    } catch {
      // ignorar
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const left = Math.max(0, Math.round((endAtRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0 && !alarmFiredRef.current) {
        alarmFiredRef.current = true;
        ringAlarm();
      }
    };
    tick();
    const interval = setInterval(tick, 500);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [isRunning]);

  // Pantalla encendida mientras corre el reloj.
  useEffect(() => {
    if (!isRunning) return;
    type Lock = { release: () => Promise<void> };
    let lock: Lock | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        const wl = (navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<Lock> } }).wakeLock;
        if (!wl || document.visibilityState !== 'visible') return;
        const l = await wl.request('screen');
        if (cancelled) l.release().catch(() => {});
        else lock = l;
      } catch {
        // denegado
      }
    };
    request();
    document.addEventListener('visibilitychange', request);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', request);
      lock?.release().catch(() => {});
    };
  }, [isRunning]);

  useEffect(() => {
    const original = document.title;
    return () => {
      document.title = original;
    };
  }, []);
  useEffect(() => {
    const m = Math.floor(secondsLeft / 60);
    const s = String(secondsLeft % 60).padStart(2, '0');
    document.title = secondsLeft === 0 ? '¡Tiempo! — Panel Cero' : `${m}:${s} — Panel Cero`;
  }, [secondsLeft]);

  // La nota se repliega sola a los 8 segundos para dejar el reloj limpio.
  useEffect(() => {
    const t = setTimeout(() => setVerNota(false), 8000);
    return () => clearTimeout(t);
  }, []);

  // Los chicos conversan entre ellos cada 40 s (sin distraerla).
  const banter = getLiveTimerBanter(guia, otro, mission.domain);
  useEffect(() => {
    if (!isRunning) return;
    const t = setInterval(() => setCharla((c) => (c + 1) % banter.length), 40_000);
    return () => clearInterval(t);
  }, [isRunning, banter.length]);

  const togglePause = () => {
    if (isRunning) setIsRunning(false);
    else {
      endAtRef.current = Date.now() + secondsLeft * 1000;
      setIsRunning(true);
    }
  };

  const addFlow = () => {
    setFlow(true);
    alarmFiredRef.current = false;
    setTotalSeconds((t) => t + 600);
    endAtRef.current = Math.max(endAtRef.current, Date.now()) + 600_000;
    setSecondsLeft(Math.round((endAtRef.current - Date.now()) / 1000));
    if (!isRunning) setIsRunning(true);
  };

  const terminado = secondsLeft === 0;
  const linea = terminado
    ? dice(guia, otro, 'finTimer')
    : !isRunning
      ? dice(guia, otro, 'pausa')
      : charla < 0
        ? dice(guia, otro, 'inicioTimer')
        : { char: banter[charla].speaker, texto: banter[charla].line };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const R = 112;
  const C = 2 * Math.PI * R;
  const frac = Math.min(1, Math.max(0, (totalSeconds - secondsLeft) / totalSeconds));

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[#0b0b0d]">
      <div className="relative w-full max-w-md h-[100dvh] overflow-y-auto flex flex-col px-5 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <div className="pointer-events-none absolute inset-0 bg-halftone-dark opacity-50" />

        <header className="relative flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Dejar la misión"
            className="w-10 h-10 grid place-items-center rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X size={20} />
          </button>
          <div className="flex-1 min-w-0 text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {mission.domain === 'pieza' ? 'Mi pieza' : 'La U'}
            </div>
            <div className="text-[15px] font-medium text-zinc-100 truncate">{mission.title}</div>
          </div>
          <div className="w-10" />
        </header>

        {/* Nota que le deja el guía con la única instrucción */}
        <button
          onClick={() => setVerNota((v) => !v)}
          className="relative mt-4 text-left rounded-3xl bg-[#f3ede4] text-zinc-800 px-5 py-4 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.8)] rotate-[-0.6deg]"
        >
          <div className="flex items-center justify-between">
            <span className="font-editorial italic text-[15px] text-zinc-500">Nota de {guia.name}</span>
            <motion.span animate={{ rotate: verNota ? 180 : 0 }} className="text-zinc-400">
              <CaretDown size={14} />
            </motion.span>
          </div>
          <AnimatePresence initial={false}>
            {verNota && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="pt-2 text-[15px] leading-relaxed">{mission.actionInstruction}</p>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setPorQue((p) => !p);
                  }}
                  className="inline-block mt-2 text-[13px] underline decoration-zinc-400 underline-offset-2 text-zinc-500"
                >
                  {porQue ? 'Ocultar' : '¿Por qué funciona?'}
                </span>
                {porQue && <p className="pt-1 text-[13px] leading-relaxed text-zinc-600">{mission.whyItWorks}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Reloj */}
        <div className="relative flex-1 grid place-items-center py-6 min-h-[300px]">
          <div className="relative w-[260px] h-[260px]">
            <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <motion.circle
                cx="130"
                cy="130"
                r={R}
                fill="none"
                stroke={terminado ? '#fda4af' : '#f43f5e'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: C * (1 - frac) }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className={`font-mono-tech text-[56px] leading-none tracking-tight ${isRunning || terminado ? 'text-zinc-50' : 'text-zinc-500'}`}>
                  {mm}:{ss}
                </div>
                <div className="mt-2 text-[12px] text-zinc-500">
                  {terminado ? 'Tiempo cumplido' : flow ? 'Modo flow' : isRunning ? 'Corriendo' : 'En pausa'}
                </div>
              </div>
            </div>
          </div>

          {!terminado && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={togglePause}
                className="h-10 px-4 rounded-full bg-white/[0.06] ring-1 ring-white/10 text-sm text-zinc-200 flex items-center gap-2 hover:bg-white/10 active:scale-[0.97] transition"
              >
                {isRunning ? <Pause size={15} weight="fill" /> : <Play size={15} weight="fill" />}
                {isRunning ? 'Pausa' : 'Seguir'}
              </button>
              <button
                onClick={addFlow}
                className="h-10 px-4 rounded-full bg-white/[0.06] ring-1 ring-white/10 text-sm text-zinc-200 flex items-center gap-2 hover:bg-white/10 active:scale-[0.97] transition"
              >
                <Plus size={15} weight="bold" />
                10 min
              </button>
            </div>
          )}
        </div>

        {/* Ellos le hablan */}
        <div className="relative min-h-[96px]">
          <AnimatePresence mode="wait">
            <motion.div key={linea.texto} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Bocadillo
                char={linea.char}
                texto={linea.texto}
                expresion={terminado ? 'blush' : 'smirk'}
                lado={linea.char.id === guia.id ? 'izq' : 'der'}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative mt-4">
          <button
            onClick={() => onComplete(mission, flow)}
            className={`w-full min-h-[56px] rounded-2xl text-[15px] font-medium transition active:scale-[0.98] ${
              terminado
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-[0_12px_30px_-12px_rgba(244,63,94,0.55)]'
                : 'bg-white/[0.04] ring-1 ring-white/10 text-zinc-200 hover:bg-white/[0.08]'
            }`}
          >
            {terminado ? 'Ver lo que pasó' : 'Ya lo hice'}
          </button>
        </div>
      </div>
    </div>
  );
}
