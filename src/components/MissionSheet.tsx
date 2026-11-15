import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  HouseLine,
  PaintBrushBroad,
  Spiral,
  ArrowRight,
  Shuffle,
  CaretLeft,
  FilmStrip,
  Cube,
  PersonSimpleRun,
  PencilSimple,
  FolderOpen,
  LockKey,
} from '@phosphor-icons/react';
import { CharacterProfile, MicroMission, TaskDomain, UniCategory } from '../types';
import { MICRO_MISSIONS } from '../data/content';
import { dice } from '../data/voces';
import { Bocadillo, Hoja, Respuesta } from '../ui/Bocadillo';

type Paso = 'donde' | 'pieza' | 'uni' | 'bloqueada' | 'decidido';

const RAMOS: { id: UniCategory; label: string; icon: typeof Cube }[] = [
  { id: 'storyboard', label: 'Storyboard', icon: FilmStrip },
  { id: 'modelado3d', label: 'Modelado 3D', icon: Cube },
  { id: 'animacion', label: 'Animación', icon: PersonSimpleRun },
  { id: 'ilustracion', label: 'Ilustración', icon: PencilSimple },
  { id: 'portafolio', label: 'Portafolio', icon: FolderOpen },
];

// Respuestas rápidas que ella puede "decir" cuando está bloqueada.
const NUDOS: { label: string; domain: TaskDomain; paso: string }[] = [
  {
    label: 'Quiero dibujar, pero el escritorio está lleno de cosas',
    domain: 'pieza',
    paso: 'Empuja todo lo de la mesa a un costado o saca solo las tazas. Tres minutos. Prohibido ordenar el resto de la pieza antes de abrir tu programa.',
  },
  {
    label: 'Tengo que ordenar, pero no sé si partir por la ropa, la cama o el piso',
    domain: 'pieza',
    paso: 'El piso y el clóset quedan con candado. Tu única misión por tres minutos es despejar la parte de arriba de tu cama.',
  },
  {
    label: 'Tengo varias entregas de la U y me paraliza elegir',
    domain: 'universidad',
    paso: 'Todas las entregas congeladas menos la más cercana. Abre solo ese programa, guarda el archivo con nombre y haz el primer cubo o boceto feo.',
  },
];

function MisionCard({ m }: { m: MicroMission }) {
  return (
    <div className="rounded-3xl bg-[#f3ede4] text-zinc-800 px-5 py-4 rotate-[-0.5deg] shadow-[0_20px_40px_-25px_rgba(0,0,0,0.8)]">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[17px] font-semibold tracking-tight">{m.title}</h3>
        <span className="font-mono-tech text-xs text-zinc-500 shrink-0">{m.durationMinutes} min</span>
      </div>
      <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-700">{m.actionInstruction}</p>
    </div>
  );
}

export function MissionSheet({
  abierta,
  inicial = 'donde',
  guia,
  otro,
  onCerrar,
  onEmpezar,
}: {
  abierta: boolean;
  inicial?: Paso;
  guia: CharacterProfile;
  otro: CharacterProfile;
  onCerrar: () => void;
  onEmpezar: (m: MicroMission) => void;
}) {
  const [paso, setPaso] = useState<Paso>(inicial);
  const [historial, setHistorial] = useState<Paso[]>([]);
  const [piezaIdx, setPiezaIdx] = useState(() => Math.floor(Math.random() * 4));
  const [ramo, setRamo] = useState<UniCategory | null>(null);
  const [propia, setPropia] = useState('');
  const [cosas, setCosas] = useState(['', '', '']);
  const [decidido, setDecidido] = useState<MicroMission | null>(null);
  const [candados, setCandados] = useState<string[]>([]);

  React.useEffect(() => {
    if (abierta) {
      setPaso(inicial);
      setHistorial([]);
      setRamo(null);
      setDecidido(null);
    }
  }, [abierta, inicial]);

  const ir = (p: Paso) => {
    setHistorial((h) => [...h, paso]);
    setPaso(p);
  };
  const volver = () => {
    const h = [...historial];
    const p = h.pop();
    setHistorial(h);
    if (p) setPaso(p);
  };

  const piezas = useMemo(() => MICRO_MISSIONS.filter((m) => m.domain === 'pieza'), []);
  const mPieza = piezas[piezaIdx % piezas.length];
  const mUni = ramo ? MICRO_MISSIONS.find((m) => m.domain === 'universidad' && m.category === ramo) : null;

  const destrabador = (texto: string, domain: TaskDomain, bloqueadas: string[]) => {
    setCandados(bloqueadas);
    setDecidido({
      id: `unblock-${Date.now()}`,
      domain,
      category: 'Destrabador',
      title: 'Solo esto, nada más',
      durationMinutes: 4,
      actionInstruction: texto,
      whyItWorks:
        'Cuando tu cabeza dice «antes tengo que hacer X, y antes Y», se paraliza intentando ordenar todo. Con lo demás bajo llave ya no tienes que decidir.',
      characterIntro: {
        noctis: 'Yo guardo lo demás. Haz solo este paso.',
        vesper: 'Eliminé el ruido del escenario. Solo este acto.',
        kazuha: 'Prohibido pensar en lo otro. Yo vigilo el candado.',
        renji: 'Lo demás se fue por la ventana. Cinco minutos a esto.',
      },
    });
    ir('decidido');
  };

  const decidirPorElla = () => {
    const items = cosas.map((s) => s.trim()).filter(Boolean);
    if (!items.length) return;
    const k = Math.floor(Math.random() * items.length);
    destrabador(
      `Solo los primeros minutos de: «${items[k]}». Lo demás está prohibido por ahora.`,
      'pieza',
      items.filter((_, j) => j !== k)
    );
  };

  const empezar = (m: MicroMission) => {
    onEmpezar(m);
  };

  const habla = (clave: Parameters<typeof dice>[2], quien = guia) => {
    const l = dice(quien, quien.id === guia.id ? otro : guia, clave);
    return <Bocadillo key={clave + quien.id} char={l.char} texto={l.texto} expresion="smirk" />;
  };

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Elegir misión">
      {historial.length > 0 && (
        <button onClick={volver} className="-mt-1 mb-3 h-8 pr-3 flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
          <CaretLeft size={16} /> Atrás
        </button>
      )}

      <motion.div key={paso} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} className="space-y-5">
        {paso === 'donde' && (
          <>
            {habla('donde')}
            <div className="space-y-2">
              <Respuesta onClick={() => ir('pieza')} icono={<HouseLine size={20} weight="duotone" className="text-rose-300" />}>
                Mi pieza
              </Respuesta>
              <Respuesta onClick={() => ir('uni')} icono={<PaintBrushBroad size={20} weight="duotone" className="text-sky-300" />}>
                Algo de la U
              </Respuesta>
              <Respuesta onClick={() => ir('bloqueada')} icono={<Spiral size={20} weight="duotone" className="text-amber-200" />}>
                No sé ni por dónde partir
              </Respuesta>
            </div>
          </>
        )}

        {paso === 'pieza' && (
          <>
            <Bocadillo char={guia} texto={mPieza.characterIntro[guia.id]} expresion="smirk" />
            <MisionCard m={mPieza} />
            <div className="space-y-2">
              <Respuesta principal onClick={() => empezar(mPieza)} icono={<ArrowRight size={18} weight="bold" />}>
                Ya, partamos
              </Respuesta>
              <Respuesta onClick={() => setPiezaIdx((i) => i + 1)} icono={<Shuffle size={18} />}>
                Esa no, otra
              </Respuesta>
            </div>
          </>
        )}

        {paso === 'uni' && (
          <>
            {!mUni ? habla('eligeRamo') : <Bocadillo key={mUni.id} char={guia} texto={mUni.characterIntro[guia.id]} expresion="smirk" />}
            <div className="flex flex-wrap gap-2">
              {RAMOS.map((r) => {
                const Ic = r.icon;
                const act = ramo === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRamo(r.id)}
                    className={`h-10 px-3.5 rounded-full text-sm flex items-center gap-1.5 transition active:scale-[0.97] ${
                      act ? 'bg-zinc-100 text-zinc-900' : 'bg-white/[0.05] ring-1 ring-white/10 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    <Ic size={16} weight="duotone" />
                    {r.label}
                  </button>
                );
              })}
            </div>
            {mUni && (
              <>
                <MisionCard m={mUni} />
                <Respuesta principal onClick={() => empezar(mUni)} icono={<ArrowRight size={18} weight="bold" />}>
                  Ya, partamos
                </Respuesta>
              </>
            )}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              {habla('entregaPropia', otro)}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const raw = propia.trim();
                  if (!raw) return;
                  setPropia('');
                  empezar({
                    id: `propia-${Date.now()}`,
                    domain: 'universidad',
                    category: 'Entrega propia',
                    title: `Paso cero: ${raw}`,
                    durationMinutes: 5,
                    actionInstruction: `Prohibido intentar terminar «${raw}» hoy. Solo abre el programa o la carpeta, crea el archivo con nombre y haz el primer trazo o bloque, sin detalles.`,
                    whyItWorks:
                      'Tu cabeza se congela cuando ve la entrega entera. Si el requisito es solo abrir y poner la primera piedra, entras en ritmo sin dolor.',
                    characterIntro: {
                      noctis: `Me quedo contigo mientras abres «${raw}». Sin presión.`,
                      vesper: `El primer acto de «${raw}» solo pide abrir el telón.`,
                      kazuha: `Nada de asustarse con «${raw}». Solo el inicio, yo cuido el tiempo.`,
                      renji: `Cinco minutos de «${raw}» versión boceto feo. Vamos.`,
                    },
                  });
                }}
                className="flex gap-2"
              >
                <label htmlFor="entrega" className="sr-only">
                  Entrega
                </label>
                <input
                  id="entrega"
                  value={propia}
                  onChange={(e) => setPropia(e.target.value)}
                  placeholder="Ej: rig de manos en Blender"
                  className="flex-1 min-w-0 h-12 px-4 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 text-[15px] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-rose-400/60"
                />
                <button
                  type="submit"
                  disabled={!propia.trim()}
                  aria-label="Partir con esta entrega"
                  className="h-12 w-12 grid place-items-center rounded-2xl bg-rose-500 text-white disabled:opacity-30 active:scale-[0.97] transition"
                >
                  <ArrowRight size={18} weight="bold" />
                </button>
              </form>
            </div>
          </>
        )}

        {paso === 'bloqueada' && (
          <>
            {habla('bloqueada')}
            <div className="space-y-2">
              {NUDOS.map((n) => (
                <Respuesta key={n.label} onClick={() => destrabador(n.paso, n.domain, ['Pensar en el orden perfecto de toda la semana', 'Terminar todo de una vez'])}>
                  {n.label}
                </Respuesta>
              ))}
            </div>
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              <p className="text-sm text-zinc-400">O escríbelo con tus palabras:</p>
              {['Lo que quiero hacer', 'Pero siento que antes debo…', 'Y antes de eso… (opcional)'].map((ph, k) => (
                <input
                  key={k}
                  aria-label={ph}
                  value={cosas[k]}
                  onChange={(e) => setCosas((c) => c.map((v, j) => (j === k ? e.target.value : v)))}
                  placeholder={ph}
                  className="w-full h-12 px-4 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 text-[15px] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-rose-400/60"
                />
              ))}
              <Respuesta principal disabled={!cosas.some((c) => c.trim())} onClick={decidirPorElla}>
                Decidan ustedes por mí
              </Respuesta>
            </div>
          </>
        )}

        {paso === 'decidido' && decidido && (
          <>
            {habla('bloqueadaResultado', otro)}
            {candados.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {candados.map((c) => (
                  <span key={c} className="h-8 px-3 rounded-full bg-white/[0.04] ring-1 ring-white/[0.06] text-xs text-zinc-500 line-through flex items-center gap-1.5">
                    <LockKey size={12} weight="fill" className="text-amber-300/70" />
                    {c}
                  </span>
                ))}
              </div>
            )}
            <MisionCard m={decidido} />
            <Respuesta principal onClick={() => empezar(decidido)} icono={<ArrowRight size={18} weight="bold" />}>
              Ya, solo eso
            </Respuesta>
          </>
        )}
      </motion.div>
    </Hoja>
  );
}
