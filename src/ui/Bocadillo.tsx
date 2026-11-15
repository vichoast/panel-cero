import React, { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterProfile } from '../types';
import { CharacterPortrait } from '../components/CharacterPortrait';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Escribe el texto letra por letra, como si el personaje lo estuviera diciendo.
export const Maquina = memo(function Maquina({
  texto,
  velocidad = 22,
  completo = false,
  onFin,
}: {
  texto: string;
  velocidad?: number;
  completo?: boolean;
  onFin?: () => void;
}) {
  const [n, setN] = useState(() => (reduceMotion() ? texto.length : 0));

  useEffect(() => {
    if (reduceMotion()) {
      setN(texto.length);
      return;
    }
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= texto.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, velocidad);
    return () => clearInterval(id);
  }, [texto, velocidad]);

  useEffect(() => {
    if (completo) setN(texto.length);
  }, [completo, texto.length]);

  useEffect(() => {
    if (n >= texto.length) onFin?.();
  }, [n, texto.length, onFin]);

  return (
    <span>
      {texto.slice(0, n)}
      <span className="opacity-0">{texto.slice(n)}</span>
    </span>
  );
});

// Globo de diálogo de un personaje que le habla directamente a ella.
export function Bocadillo({
  char,
  texto,
  expresion = 'neutral',
  lado = 'izq',
  tam = 'md',
  className = '',
}: {
  char: CharacterProfile;
  texto: string;
  expresion?: 'neutral' | 'blush' | 'intense' | 'smirk' | 'look-away' | 'shock';
  lado?: 'izq' | 'der';
  tam?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`flex items-end gap-3 ${lado === 'der' ? 'flex-row-reverse' : ''} ${className}`}
    >
      <CharacterPortrait
        characterId={char.id}
        expression={expresion}
        size={tam === 'sm' ? 'xs' : 'sm'}
        className="rounded-2xl ring-1 ring-white/10 shrink-0"
      />
      <div
        className={`relative max-w-[85%] rounded-3xl px-4 py-3 bg-zinc-900 ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
          lado === 'der' ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
      >
        <div className="text-[11px] font-semibold tracking-wide mb-0.5" style={{ color: char.colorHex }}>
          {char.name}
        </div>
        <p className={`${tam === 'sm' ? 'text-sm' : 'text-[15px]'} leading-relaxed text-zinc-100`}>
          <Maquina key={texto} texto={texto} />
        </p>
      </div>
    </motion.div>
  );
}

// Hoja que sube desde abajo (cómoda con el pulgar en el celular).
export function Hoja({
  abierta,
  onCerrar,
  children,
  titulo,
}: {
  abierta: boolean;
  onCerrar: () => void;
  children: React.ReactNode;
  titulo?: string;
}) {
  useEffect(() => {
    if (!abierta) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [abierta, onCerrar]);

  if (!abierta) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <motion.button
        aria-label="Cerrar"
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCerrar}
      />
      <motion.div
        role="dialog"
        aria-label={titulo}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-t-[2rem] bg-[#121214] ring-1 ring-white/10 px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />
        {children}
      </motion.div>
    </div>
  );
}

// Respuesta de ella: los botones están escritos como si ella contestara.
export function Respuesta({
  children,
  onClick,
  principal = false,
  disabled = false,
  icono,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  principal?: boolean;
  disabled?: boolean;
  icono?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[52px] px-5 py-3.5 rounded-2xl text-[15px] font-medium flex items-center justify-between gap-3 text-left transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 ${
        principal
          ? 'bg-rose-500 text-white hover:bg-rose-400 shadow-[0_12px_30px_-12px_rgba(244,63,94,0.55)]'
          : 'bg-white/[0.04] text-zinc-100 ring-1 ring-white/10 hover:bg-white/[0.07]'
      }`}
    >
      <span>{children}</span>
      {icono}
    </button>
  );
}
