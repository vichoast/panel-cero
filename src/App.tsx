import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  HouseSimple,
  BookOpenText,
  ChatsCircle,
  Cards,
  Feather,
  CaretDown,
  ArrowRight,
  Spiral,
  LockSimple,
  Check,
  Fire,
  Heart,
  Smiley,
  Notebook,
  ShieldCheck,
} from '@phosphor-icons/react';
import { ShipId, MicroMission, BLChapter, SceneChoice, SecretLog, SavedProgress } from './types';
import { CHARACTERS, SHIPS, SECRET_LOGS, TROPE_CARDS, getOrGenerateChapter, HISTORIAS } from './data/content';
import { claveSaludo, dice, guias, Linea } from './data/voces';
import { CharacterPortrait } from './components/CharacterPortrait';
import { MissionSheet } from './components/MissionSheet';
import { MissionTimer } from './components/MissionTimer';
import { StoryReader } from './components/StoryReader';
import { Respaldo } from './components/Respaldo';
import { pedirPersistencia } from './data/respaldo';
import { activas, bloqueo, disponibles, normalizar, terminada, terminadas, TODAS } from './data/parejas';
import { PRESENTACION } from './data/presentacion';
import { Encuentro } from './components/Encuentro';
import { FinDeHistoria } from './components/FinDeHistoria';
import { Instalar } from './components/Instalar';
import { entorno } from './data/instalacion';
import { Bocadillo, Hoja } from './ui/Bocadillo';


const DEFAULT_PROGRESS: SavedProgress = {
  activeShip: 'kazuha-renji',
  isShipLocked: false,
  theme: 'ink-night',
  plumas: 25,
  sessionsCompleted: 0,
  shipChemistry: {
    'noctis-vesper': 15,
    'kazuha-noctis': 15,
    'kazuha-renji': 15,
    'vesper-renji': 15,
    'kazuha-vesper': 10,
    'noctis-renji': 10,
  },
  shipChapterIndex: {
    'noctis-vesper': 0,
    'kazuha-noctis': 0,
    'kazuha-renji': 0,
    'vesper-renji': 0,
    'kazuha-vesper': 0,
    'noctis-renji': 0,
  },
  unlockedChapterHistory: [],
  choicesMade: {},
};

type Pestana = 'hoy' | 'capitulos' | 'secretos' | 'cartas';

const TONO_ICONO = { tension: Fire, tierno: Heart, caos: Smiley } as const;

function cargar(): SavedProgress {
  try {
    const saved = localStorage.getItem('panel_cero_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      const empezo =
        (parsed.unlockedChapterHistory && parsed.unlockedChapterHistory.length > 0) ||
        Object.values(parsed.shipChapterIndex || {}).some((v) => (v as number) > 0);
      // normalizar() aplica las reglas de fidelidad, también a un avance de antes de que existieran.
      return normalizar({
        ...DEFAULT_PROGRESS,
        ...parsed,
        isShipLocked: typeof parsed.isShipLocked === 'boolean' ? parsed.isShipLocked : empezo,
      });
    }
  } catch {
    // sin almacenamiento disponible
  }
  return normalizar(DEFAULT_PROGRESS);
}

export function App() {
  const [progress, setProgress] = useState<SavedProgress>(cargar);
  const [pestana, setPestana] = useState<Pestana>('hoy');
  const [hojaMision, setHojaMision] = useState<null | 'donde' | 'bloqueada'>(null);
  const [hojaPareja, setHojaPareja] = useState(false);
  // Presentación de los personajes y elección de pareja ('completo' la primera vez, 'nueva' al liberarse alguien).
  const [encuentro, setEncuentro] = useState<null | 'completo' | 'nueva'>(progress.presentado ? null : 'completo');
  // Pareja cuya historia acaba de terminar (pantalla de despedida).
  const [finalDe, setFinalDe] = useState<ShipId | null>(null);
  // Guía de instalación: en el celular, si no la abrió desde el ícono y no la ha visto.
  const [donde] = useState(entorno);
  const instalable = donde !== 'instalada' && donde !== 'computador';
  const [verInstalar, setVerInstalar] = useState(instalable && !progress.instalacionVista);
  const [mision, setMision] = useState<MicroMission | null>(null);
  const [leyendo, setLeyendo] = useState<BLChapter | null>(null);
  const [secreto, setSecreto] = useState<SecretLog | null>(null);
  const [aviso, setAviso] = useState<Linea | null>(null);
  const [hojaRespaldo, setHojaRespaldo] = useState<null | 'inicio' | 'recuperar'>(null);

  // Pide al navegador que no borre estos datos por su cuenta (sobre todo en iPhone).
  useEffect(() => {
    pedirPersistencia();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('panel_cero_v1', JSON.stringify(progress));
    } catch {
      // ignorar
    }
  }, [progress]);

  const ship = SHIPS[progress.activeShip];
  const charA = CHARACTERS[ship.charA];
  const charB = CHARACTERS[ship.charB];
  const [guia, otro] = guias(charA, charB);
  const capIdx = progress.shipChapterIndex[progress.activeShip] || 0;
  const quimica = Math.min(100, progress.shipChemistry[progress.activeShip] || 15);

  const temporada = HISTORIAS[progress.activeShip];
  const temporadaLista = !!temporada && capIdx >= temporada.length;
  const etapa = temporada
    ? Math.min(4, Math.floor((capIdx * 5) / temporada.length))
    : Math.min(4, Math.floor(quimica / 22));
  const avanceSecretos = temporada ? capIdx : progress.sessionsCompleted;

  const proximo = getOrGenerateChapter(progress.activeShip, capIdx, 'pieza');
  const historial = useMemo(
    () => progress.unlockedChapterHistory.filter((c) => c.shipId === progress.activeShip),
    [progress.unlockedChapterHistory, progress.activeShip]
  );
  const elegidas = Object.values(progress.choicesMade);
  // Recordatorio de respaldo: con 3+ capítulos leídos y sin copia en los últimos 14 días.
  const leidos = Object.values(progress.shipChapterIndex).reduce((a, b) => a + b, 0);
  const diasSinRespaldo = progress.ultimoRespaldo ? (Date.now() - new Date(progress.ultimoRespaldo).getTime()) / 86_400_000 : Infinity;
  const pideRespaldo = leidos >= 3 && diasSinRespaldo > 14;

  const recuperar = (avance: Partial<SavedProgress>) => {
    const p = normalizar({ ...DEFAULT_PROGRESS, ...avance });
    setProgress(p);
    setHojaPareja(false);
    setEncuentro(p.presentado ? null : 'completo');
    setPestana('hoy');
    setAviso(null);
  };

  const enCurso = activas(progress);
  const listas = terminadas(progress);
  const libres = disponibles(progress);
  const viendoTerminada = terminada(progress, progress.activeShip);

  const sellar = (nuevas: ShipId[]) => {
    setProgress((p) => normalizar({ ...p, parejas: [...activas(p), ...nuevas], presentado: true, activeShip: nuevas[0] }));
    setEncuentro(null);
    setHojaPareja(false);
    setPestana('hoy');
    setAviso(null);
  };
  const secretos = SECRET_LOGS.filter((l) => l.shipId === progress.activeShip);

  useEffect(() => setAviso(null), [progress.activeShip]);

  const empezarMision = (m: MicroMission) => {
    setHojaMision(null);
    setProgress((p) => ({ ...p, isShipLocked: true }));
    setMision(m);
  };

  const completarMision = (m: MicroMission, flow: boolean) => {
    setMision(null);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.75 }, colors: ['#f43f5e', '#fda4af', '#fef3c7', '#e4e4e7'] });

    // Si está mirando una historia terminada, el bloque hace avanzar una de las que siguen en curso.
    const destino = viendoTerminada ? enCurso[0] : progress.activeShip;
    if (!destino) {
      setProgress((p) => ({ ...p, plumas: p.plumas + 30, sessionsCompleted: p.sessionsCompleted + 1 }));
      setAviso(dice(otro, guia, 'bloqueTerminado'));
      setPestana('hoy');
      return;
    }

    const idxDestino = progress.shipChapterIndex[destino] || 0;
    const cap = getOrGenerateChapter(destino, idxDestino, m.domain);
    setProgress((p) => {
      const idx = p.shipChapterIndex[destino] || 0;
      const ya = p.unlockedChapterHistory.some((c) => c.id === cap.id);
      return {
        ...p,
        activeShip: destino,
        plumas: p.plumas + (flow ? 25 : 15),
        sessionsCompleted: p.sessionsCompleted + 1,
        shipChapterIndex: { ...p.shipChapterIndex, [destino]: ya ? idx : idx + 1 },
        unlockedChapterHistory: ya ? p.unlockedChapterHistory : [cap, ...p.unlockedChapterHistory],
      };
    });
    setLeyendo(cap);
  };

  const terminarCapitulo = (choice: SceneChoice) => {
    if (!leyendo) return;
    const cap = leyendo;
    // Último capítulo de la temporada, leído por primera vez: despedida y personajes libres.
    const ultimo = (HISTORIAS[cap.shipId]?.length ?? 0) === cap.chapterNumber && !progress.choicesMade[cap.id];
    if (ultimo) setFinalDe(cap.shipId);
    setProgress((p) => {
      if (p.choicesMade[cap.id]) return p;
      const prev = p.shipChemistry[cap.shipId] || 15;
      return {
        ...p,
        shipChemistry: { ...p.shipChemistry, [cap.shipId]: Math.min(100, prev + choice.chemistryDelta) },
        choicesMade: { ...p.choicesMade, [cap.id]: choice.id },
      };
    });
    setLeyendo(null);
  };

  const usarCarta = (id: string) => {
    const carta = TROPE_CARDS.find((c) => c.id === id);
    if (!carta || progress.plumas < carta.costPlumas) return;
    const cap = carta.customSceneGenerator(charA, charB, 'pieza');
    setProgress((p) => ({
      ...p,
      plumas: p.plumas - carta.costPlumas,
      unlockedChapterHistory: [cap, ...p.unlockedChapterHistory],
    }));
    setLeyendo(cap);
  };

  // Solo se puede mirar una historia en curso o una terminada (para releer).
  const elegirPareja = (id: ShipId) => {
    if (!enCurso.includes(id) && !terminada(progress, id)) return;
    setProgress((p) => ({ ...p, activeShip: id }));
    setHojaPareja(false);
    setPestana('hoy');
  };

  const saludo = aviso ?? (temporadaLista ? { char: guia, texto: PRESENTACION[guia.id].final } : dice(guia, otro, claveSaludo()));

  return (
    <div className="min-h-[100dvh] bg-[#0b0b0d] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-halftone-dark opacity-40" />
      <div className={`relative mx-auto w-full max-w-md min-h-[100dvh] px-5 pt-[calc(1rem+env(safe-area-inset-top))] ${pestana === 'hoy' ? 'pb-[calc(11rem+env(safe-area-inset-bottom))]' : 'pb-[calc(6.5rem+env(safe-area-inset-bottom))]'}`}>
        {/* Encabezado */}
        <header className="flex items-center justify-between h-10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 grid place-items-center rounded-lg bg-rose-500 font-editorial font-bold text-white text-base leading-none">0</span>
            <span className="text-[13px] font-semibold tracking-[0.2em] text-zinc-300">PANEL CERO</span>
          </div>
          <div className="flex items-center gap-2">
          <button
            onClick={() => setHojaRespaldo('inicio')}
            className="relative h-9 w-9 grid place-items-center rounded-full bg-white/[0.05] ring-1 ring-white/10 text-zinc-300"
            aria-label="Respaldo de tu avance"
          >
            <ShieldCheck size={17} weight={pideRespaldo ? 'regular' : 'fill'} className={pideRespaldo ? 'text-amber-200' : 'text-zinc-400'} />
            {pideRespaldo && <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-[#0b0b0d]" />}
          </button>
          <button
            onClick={() => setPestana('cartas')}
            className="h-9 px-3 rounded-full bg-white/[0.05] ring-1 ring-white/10 flex items-center gap-1.5 text-sm"
            aria-label={`${progress.plumas} Plumas`}
          >
            <Feather size={15} weight="fill" className="text-rose-300" />
            <span className="font-mono-tech">{progress.plumas}</span>
          </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pestana}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="pt-6"
          >
            {pestana === 'hoy' && (
              <div className="space-y-8">
                {/* La pareja */}
                <button onClick={() => setHojaPareja(true)} className="w-full flex items-center gap-4 text-left group">
                  <div className="flex -space-x-5 shrink-0">
                    <CharacterPortrait characterId={charA.id} expression="smirk" size="md" className="rounded-[1.4rem] ring-2 ring-[#0b0b0d]" />
                    <CharacterPortrait characterId={charB.id} expression="look-away" size="md" className="rounded-[1.4rem] ring-2 ring-[#0b0b0d]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] text-zinc-500">
                      {charA.name} × {charB.name}
                    </div>
                    <div className="font-editorial text-[26px] leading-[1.05] text-zinc-50">{ship.title}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] text-zinc-400">
                      {temporadaLista ? 'Historia completa' : ship.stageNames[etapa]}
                      {enCurso.length + listas.length > 1 && (
                        <span className="ml-1 h-5 px-2 rounded-full bg-white/[0.06] text-[10px] text-zinc-300 grid place-items-center">
                          {enCurso.length} en curso
                        </span>
                      )}
                      <CaretDown size={12} className="text-zinc-600 group-hover:text-zinc-300 transition" />
                    </div>
                  </div>
                </button>

                {temporada && (
                  <div className="flex gap-1" aria-label={`${Math.min(capIdx, temporada.length)} de ${temporada.length} capítulos`}>
                    {temporada.map((c, k) => (
                      <div key={c.id} className={`h-1 flex-1 rounded-full ${k < capIdx ? 'bg-rose-400' : k === capIdx ? 'bg-rose-400/30' : 'bg-white/[0.07]'}`} />
                    ))}
                  </div>
                )}

                {/* Saludo del guía */}
                <Bocadillo char={saludo.char} texto={saludo.texto} expresion={aviso ? 'blush' : 'smirk'} />

                {/* Dónde quedaron: el gancho del próximo episodio */}
                {!temporadaLista && (
                  <section className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-[13px] font-medium text-zinc-400">
                        Próximo episodio <span className="font-mono-tech text-zinc-600">{String(capIdx + 1).padStart(2, '0')}</span>
                      </h2>
                      <span className="flex items-center gap-1 text-[12px] text-zinc-600">
                        <LockSimple size={12} weight="fill" /> se abre con 5 min
                      </span>
                    </div>
                    <div className="rounded-[1.75rem] p-5 bg-gradient-to-b from-white/[0.05] to-white/[0.02] ring-1 ring-white/[0.08] space-y-4">
                      <div className="font-editorial text-[21px] leading-snug text-zinc-50">
                        {proximo.title.replace(/^Episodio \d+:\s*/, '')}
                      </div>
                      {[
                        [proximo.cliffhangerPreview.speakerA, proximo.cliffhangerPreview.lineA],
                        [proximo.cliffhangerPreview.speakerB, proximo.cliffhangerPreview.lineB],
                      ].map(([id, linea], k) => {
                        const c = CHARACTERS[id as keyof typeof CHARACTERS];
                        return (
                          <div key={k} className={`flex gap-3 ${k === 1 ? 'flex-row-reverse text-right' : ''}`}>
                            <CharacterPortrait characterId={c.id} size="xs" expression={k === 0 ? 'intense' : 'smirk'} className="rounded-xl shrink-0" />
                            <p className="text-[14px] leading-relaxed text-zinc-300">
                              <span className="block text-[11px] font-semibold mb-0.5" style={{ color: c.colorHex }}>
                                {c.name}
                              </span>
                              «{linea}»
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Historia terminada: releer, volver a otra en curso o elegir una pareja nueva */}
                {temporadaLista && (
                  <section className="rounded-[1.75rem] p-5 bg-gradient-to-b from-rose-500/[0.10] to-white/[0.02] ring-1 ring-rose-300/20 space-y-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-rose-300/80">Temporada 1 completa</div>
                      <p className="mt-1 text-[14px] leading-relaxed text-zinc-300">
                        {charA.name} y {charB.name} ya vivieron toda su historia. Puedes releerla cuando quieras; ellos quedaron libres para otra combinación.
                      </p>
                    </div>
                    <div className="space-y-2">
                      {libres.length > 0 && (
                        <button
                          onClick={() => setEncuentro('nueva')}
                          className="w-full min-h-[52px] rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
                        >
                          Elegir una pareja nueva <ArrowRight size={17} weight="bold" />
                        </button>
                      )}
                      {enCurso.map((s) => (
                        <button
                          key={s}
                          onClick={() => elegirPareja(s)}
                          className="w-full min-h-[52px] rounded-2xl bg-white/[0.04] ring-1 ring-white/10 text-zinc-100 font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition"
                        >
                          Volver a {SHIPS[s].title}
                        </button>
                      ))}
                      <button
                        onClick={() => setPestana('capitulos')}
                        className="w-full min-h-[48px] rounded-2xl text-zinc-400 hover:text-white text-sm flex items-center justify-center gap-2"
                      >
                        <BookOpenText size={16} /> Releer los capítulos
                      </button>
                    </div>
                  </section>
                )}

                {pideRespaldo && !aviso && (
                  <button onClick={() => setHojaRespaldo('inicio')} className="w-full text-left">
                    <Bocadillo char={otro} texto={dice(otro, guia, 'respaldoRecordar').texto} expresion="intense" lado="der" tam="sm" />
                  </button>
                )}

                {/* Invitación del otro chico */}
                <Bocadillo char={otro} texto={dice(otro, guia, 'invitar').texto} expresion="smirk" lado="der" tam="sm" />
              </div>
            )}

            {pestana === 'capitulos' && (
              <div className="space-y-6">
                <h1 className="font-editorial text-[30px] leading-none">Capítulos</h1>
                <Bocadillo
                  char={guia}
                  texto={dice(guia, otro, historial.length ? 'capitulosIntro' : 'capitulosVacio').texto}
                  expresion="look-away"
                />
                <ol className="space-y-2">
                  {(temporada ?? historial.filter((c) => c.chapterNumber < 99).slice().reverse()).map((c, k) => {
                    const leido = !temporada || k < capIdx;
                    const siguiente = !!temporada && k === capIdx;
                    const eleccion = progress.choicesMade[c.id];
                    const tono = eleccion ? c.choices.find((x) => x.id === eleccion)?.tone : undefined;
                    const Ic = tono ? TONO_ICONO[tono] : null;
                    return (
                      <li key={c.id}>
                        <button
                          disabled={!leido}
                          onClick={() => setLeyendo(c)}
                          className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition ${
                            leido ? 'bg-white/[0.03] ring-1 ring-white/[0.07] hover:bg-white/[0.06] active:scale-[0.99]' : 'opacity-40'
                          }`}
                        >
                          <span className="font-mono-tech text-sm text-zinc-500 w-6 shrink-0">{String(c.chapterNumber).padStart(2, '0')}</span>
                          <span className="flex-1 min-w-0">
                            <span className={`block text-[15px] truncate ${leido ? 'text-zinc-100' : 'text-zinc-500'}`}>
                              {leido ? c.title.replace(/^Episodio \d+:\s*/, '') : siguiente ? 'Se abre con tu próximo bloque' : '· · ·'}
                            </span>
                            {leido && <span className="block text-[12px] text-zinc-500 truncate">{c.tropeTag}</span>}
                          </span>
                          {Ic ? <Ic size={16} weight="duotone" className="text-rose-300/80 shrink-0" /> : !leido && <LockSimple size={14} className="text-zinc-600 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ol>
                {historial.some((c) => c.chapterNumber >= 99) && (
                  <section className="space-y-2">
                    <h2 className="text-[13px] font-medium text-zinc-400">Escenas especiales</h2>
                    {historial
                      .filter((c) => c.chapterNumber >= 99)
                      .map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setLeyendo(c)}
                          className="w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 text-left bg-white/[0.03] ring-1 ring-white/[0.07] hover:bg-white/[0.06] transition"
                        >
                          <Cards size={16} weight="duotone" className="text-rose-300/80 shrink-0" />
                          <span className="flex-1 min-w-0 text-[15px] truncate">{c.title.replace(/^Especial de Tropo:\s*/, '')}</span>
                        </button>
                      ))}
                  </section>
                )}
              </div>
            )}

            {pestana === 'secretos' && (
              <div className="space-y-6">
                <h1 className="font-editorial text-[30px] leading-none">Secretos</h1>
                <Bocadillo char={otro} texto={dice(otro, guia, secretos.length ? 'secretosIntro' : 'secretosVacio').texto} expresion="blush" />
                <div className="space-y-2">
                  {secretos.map((s) => {
                    const abierto = avanceSecretos >= s.unlockRequirementSessions;
                    const Ic = s.type === 'chat-3am' ? ChatsCircle : Notebook;
                    return (
                      <button
                        key={s.id}
                        disabled={!abierto}
                        onClick={() => setSecreto(s)}
                        className={`w-full flex gap-4 rounded-2xl px-4 py-4 text-left transition ${
                          abierto ? 'bg-white/[0.03] ring-1 ring-white/[0.07] hover:bg-white/[0.06] active:scale-[0.99]' : 'ring-1 ring-dashed ring-white/[0.08]'
                        }`}
                      >
                        <Ic size={20} weight="duotone" className={`mt-0.5 shrink-0 ${abierto ? 'text-rose-300' : 'text-zinc-600'}`} />
                        <span className="flex-1 min-w-0">
                          <span className={`block text-[15px] ${abierto ? 'text-zinc-100' : 'text-zinc-500'}`}>{abierto ? s.title : '· · ·'}</span>
                          <span className="block mt-0.5 text-[13px] leading-snug text-zinc-500">
                            {abierto
                              ? s.summary
                              : temporada
                                ? `Se abre en el capítulo ${s.unlockRequirementSessions}`
                                : `Se abre tras ${s.unlockRequirementSessions} bloques`}
                          </span>
                        </span>
                        {!abierto && <LockSimple size={14} className="text-zinc-600 shrink-0 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {pestana === 'cartas' && (
              <div className="space-y-6">
                <div className="flex items-end justify-between">
                  <h1 className="font-editorial text-[30px] leading-none">Cartas</h1>
                  <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                    <Feather size={15} weight="fill" className="text-rose-300" />
                    <span className="font-mono-tech text-zinc-100">{progress.plumas}</span> Plumas
                  </span>
                </div>
                <Bocadillo
                  char={guia}
                  texto={dice(guia, otro, TROPE_CARDS.some((c) => progress.plumas >= c.costPlumas) ? 'cartasIntro' : 'sinPlumas').texto}
                  expresion="smirk"
                />
                <div className="space-y-3">
                  {TROPE_CARDS.map((c, k) => {
                    const alcanza = progress.plumas >= c.costPlumas;
                    return (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: k * 0.06, type: 'spring', stiffness: 120, damping: 20 }}
                        className="rounded-[1.75rem] p-5 bg-gradient-to-br from-rose-500/[0.09] via-white/[0.02] to-transparent ring-1 ring-white/[0.08]"
                      >
                        <div className="text-[11px] uppercase tracking-[0.16em] text-rose-300/80">{c.tag}</div>
                        <h3 className="mt-1 font-editorial text-[22px] leading-tight">{c.title}</h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-zinc-400">{c.description}</p>
                        <button
                          disabled={!alcanza}
                          onClick={() => usarCarta(c.id)}
                          className="mt-4 h-11 px-4 rounded-full bg-white/[0.07] ring-1 ring-white/10 text-sm flex items-center gap-2 hover:bg-white/[0.12] active:scale-[0.97] disabled:opacity-35 transition"
                        >
                          <Feather size={14} weight="fill" className="text-rose-300" />
                          Jugar esta carta · {c.costPlumas}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.main>
        </AnimatePresence>
      </div>

      {/* Navegación inferior (con la respuesta principal siempre a mano en "Hoy") */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {pestana === 'hoy' && (enCurso.length > 0 || !temporadaLista) && (
            <div className="flex gap-2 mb-2.5">
              <button
                onClick={() => setHojaMision('donde')}
                className="flex-1 h-14 rounded-[1.4rem] bg-rose-500 hover:bg-rose-400 text-white text-[15px] font-medium flex items-center justify-center gap-2 shadow-[0_16px_34px_-14px_rgba(244,63,94,0.7)] active:scale-[0.98] transition"
              >
                Ya, cinco minutos
                <ArrowRight size={17} weight="bold" />
              </button>
              <button
                onClick={() => setHojaMision('bloqueada')}
                className="h-14 px-4 rounded-[1.4rem] bg-zinc-900/90 backdrop-blur-xl ring-1 ring-white/10 text-[13px] text-zinc-200 flex items-center gap-1.5 active:scale-[0.98] transition"
              >
                <Spiral size={17} className="text-amber-200" />
                Bloqueada
              </button>
            </div>
          )}
          <div className="grid grid-cols-4 rounded-[1.6rem] bg-zinc-900/80 backdrop-blur-xl ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_-20px_rgba(0,0,0,0.9)] p-1.5">
            {(
              [
                ['hoy', 'Hoy', HouseSimple],
                ['capitulos', 'Capítulos', BookOpenText],
                ['secretos', 'Secretos', ChatsCircle],
                ['cartas', 'Cartas', Cards],
              ] as const
            ).map(([id, label, Ic]) => {
              const act = pestana === id;
              return (
                <button
                  key={id}
                  onClick={() => setPestana(id)}
                  className="relative h-14 rounded-[1.2rem] flex flex-col items-center justify-center gap-0.5 text-[11px]"
                  aria-current={act ? 'page' : undefined}
                >
                  {act && <motion.span layoutId="nav" className="absolute inset-0 rounded-[1.2rem] bg-white/[0.07]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                  <Ic size={21} weight={act ? 'fill' : 'regular'} className={`relative ${act ? 'text-rose-300' : 'text-zinc-500'}`} />
                  <span className={`relative ${act ? 'text-zinc-100' : 'text-zinc-500'}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Elegir pareja */}
      <Hoja abierta={hojaPareja} onCerrar={() => setHojaPareja(false)} titulo="Tus historias">
        <div className="space-y-6">
          <Bocadillo char={guia} texto={PRESENTACION[guia.id].promesa.replace(/\{nombre\}/g, otro.name)} expresion="look-away" />
          {(
            [
              ['En curso', enCurso],
              ['Terminadas', listas],
              ['Esperando', TODAS.filter((s) => !enCurso.includes(s) && !listas.includes(s))],
            ] as const
          ).map(([titulo, lista]) =>
            lista.length === 0 ? null : (
              <section key={titulo} className="space-y-2">
                <h3 className="text-[12px] uppercase tracking-[0.16em] text-zinc-500 px-1">{titulo}</h3>
                {lista.map((id) => {
                  const s = SHIPS[id];
                  const a = CHARACTERS[s.charA];
                  const b = CHARACTERS[s.charB];
                  const act = id === progress.activeShip;
                  const n = Math.min(progress.shipChapterIndex[id] || 0, HISTORIAS[id]?.length ?? 10);
                  const bl = titulo === 'Esperando' ? bloqueo(progress, id) : null;
                  const espera = titulo === 'Esperando';
                  const motivo =
                    bl?.motivo === 'ocupado'
                      ? `${CHARACTERS[bl.quien].name} está en ${SHIPS[bl.con].title}`
                      : bl?.motivo === 'lleno'
                        ? 'Ya tienes dos historias en curso'
                        : 'Disponible';
                  return (
                    <button
                      key={id}
                      onClick={() => (espera ? !bl && setEncuentro('nueva') : elegirPareja(id))}
                      disabled={espera && !!bl}
                      className={`w-full flex items-center gap-3 rounded-2xl p-3 text-left transition active:scale-[0.99] ${
                        act ? 'bg-white/[0.07] ring-1 ring-rose-300/30' : 'hover:bg-white/[0.04]'
                      } ${espera && bl ? 'opacity-45' : ''}`}
                    >
                      <div className="flex -space-x-3 shrink-0">
                        <CharacterPortrait characterId={a.id} size="sm" className="rounded-xl ring-2 ring-[#121214]" />
                        <CharacterPortrait characterId={b.id} size="sm" className="rounded-xl ring-2 ring-[#121214]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-editorial text-[18px] leading-tight truncate">{s.title}</div>
                        <div className="text-[12px] text-zinc-500 truncate">
                          {a.name} × {b.name} · {espera ? motivo : titulo === 'Terminadas' ? 'para releer' : `${n} de ${HISTORIAS[id]?.length ?? 10}`}
                        </div>
                      </div>
                      {act ? (
                        <Check size={18} weight="bold" className="text-rose-300 shrink-0" />
                      ) : espera ? (
                        bl ? <LockSimple size={15} className="text-zinc-600 shrink-0" /> : <ArrowRight size={15} className="text-rose-300 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </section>
            )
          )}
          <p className="text-[12px] leading-relaxed text-zinc-500 px-1">
            Aquí nadie es infiel: mientras dura una historia, sus dos personajes no pueden estar con nadie más. Puedes llevar dos historias a la vez, y cuando una termina, sus personajes quedan libres.
          </p>
        </div>
      </Hoja>

      {encuentro && !hojaRespaldo && (
        <Encuentro
          key={encuentro}
          progress={progress}
          completo={encuentro === 'completo'}
          onTerminar={sellar}
          onCerrar={encuentro === 'nueva' ? () => setEncuentro(null) : undefined}
          onRecuperar={() => setHojaRespaldo('recuperar')}
        />
      )}

      {/* Despedida al terminar una historia */}
      {finalDe && !leyendo && (
        <FinDeHistoria
          ship={finalDe}
          hayLibres={disponibles(progress).length > 0}
          onNueva={() => {
            setFinalDe(null);
            setEncuentro('nueva');
          }}
          onCerrar={() => {
            setFinalDe(null);
            const otra = activas(progress)[0];
            if (otra) setProgress((p) => ({ ...p, activeShip: otra }));
          }}
        />
      )}

      <Respaldo
        abierta={!!hojaRespaldo}
        inicial={hojaRespaldo ?? 'inicio'}
        progress={progress}
        guia={guia}
        otro={otro}
        onCerrar={() => setHojaRespaldo(null)}
        onGuardado={() => setProgress((p) => ({ ...p, ultimoRespaldo: new Date().toISOString() }))}
        onRecuperar={recuperar}
        onInstalar={
          instalable
            ? () => {
                setHojaRespaldo(null);
                setVerInstalar(true);
              }
            : undefined
        }
      />

      {verInstalar && (
        <Instalar
          primeraVez={!progress.presentado}
          onSeguir={() => {
            setVerInstalar(false);
            setProgress((p) => ({ ...p, instalacionVista: true }));
          }}
        />
      )}

      <MissionSheet
        abierta={!!hojaMision}
        inicial={hojaMision ?? 'donde'}
        guia={guia}
        otro={otro}
        onCerrar={() => setHojaMision(null)}
        onEmpezar={empezarMision}
      />

      {/* Secreto abierto: chat de teléfono o página de cuaderno */}
      <Hoja abierta={!!secreto} onCerrar={() => setSecreto(null)} titulo={secreto?.title}>
        {secreto && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">{secreto.type === 'chat-3am' ? 'Chat privado' : 'Cuaderno'}</div>
              <h3 className="mt-1 font-editorial text-[22px] leading-tight">{secreto.title}</h3>
            </div>
            {secreto.chatMessages && (
              <div className="space-y-3">
                {secreto.chatMessages.map((m, k) => {
                  const c = CHARACTERS[m.sender];
                  const der = m.sender === secreto.chatMessages![0].sender;
                  return (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 * k }}
                      className={`flex flex-col ${der ? 'items-end' : 'items-start'}`}
                    >
                      {m.deletedDraft && (
                        <div className={`max-w-[80%] mb-1 px-3 py-2 rounded-2xl text-[13px] italic text-zinc-500 ring-1 ring-dashed ring-white/10 ${der ? 'text-right' : ''}`}>
                          <span className="block text-[10px] not-italic uppercase tracking-wider text-zinc-600 mb-0.5">escribió y borró</span>
                          <span className="line-through decoration-zinc-600">{m.deletedDraft}</span>
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-3xl text-[15px] leading-snug ${
                          der ? 'bg-rose-500 text-white rounded-br-md' : 'bg-zinc-800 text-zinc-100 rounded-bl-md'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="mt-1 text-[10px] text-zinc-600 font-mono-tech">
                        {c.name} · {m.time}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
            {secreto.sketchbookEntry && (
              <div className="rounded-3xl bg-[#f3ede4] text-zinc-800 p-5 rotate-[-0.6deg] space-y-3 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.8)]">
                <div className="font-mono-tech text-[11px] text-zinc-500">{secreto.sketchbookEntry.dateLabel}</div>
                <p className="text-[13px] italic text-zinc-500">{secreto.sketchbookEntry.sketchCaption}</p>
                <p className="font-editorial text-[19px] leading-snug">{secreto.sketchbookEntry.monologue}</p>
                <p className="pt-3 border-t border-zinc-300 text-[13px] text-rose-700">{secreto.sketchbookEntry.marginNote}</p>
              </div>
            )}
          </div>
        )}
      </Hoja>

      {mision && (
        <MissionTimer
          key={mision.id}
          mission={mision}
          guia={guia}
          otro={otro}
          onClose={() => setMision(null)}
          onComplete={completarMision}
        />
      )}

      {leyendo && (
        <StoryReader
          key={leyendo.id}
          chapter={leyendo}
          elegidas={elegidas}
          elegidaAntes={progress.choicesMade[leyendo.id]}
          onClose={() => setLeyendo(null)}
          onFinish={terminarCapitulo}
        />
      )}
    </div>
  );
}
export default App;
