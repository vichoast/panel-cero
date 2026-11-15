import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkle,
  LockKey,
  LockKeyOpen,
  HouseLine,
  PaintBrushBroad,
  Shuffle,
  Heart,
  BookOpenText,
  ChatCircleDots,
  Cards,
  MoonStars,
  SunHorizon,
  Play,
  DiceFive,
  Cube,
  FilmStrip,
  FolderOpen,
  PencilCircle,
  Lightning,
  Eye,
  WarningCircle,
  ArrowCounterClockwise,
  CheckCircle,
} from '@phosphor-icons/react';
import {
  CharacterId,
  ShipId,
  ThemeMode,
  TaskDomain,
  UniCategory,
  MicroMission,
  BLChapter,
  SceneChoice,
  SecretLog,
} from './types';
import {
  CHARACTERS,
  SHIPS,
  MICRO_MISSIONS,
  SECRET_LOGS,
  TROPE_CARDS,
  getOrGenerateChapter,
} from './data/content';
import { CharacterPortrait } from './components/CharacterPortrait';
import { OverthinkingModal } from './components/OverthinkingModal';
import { ActiveTimerModal } from './components/ActiveTimerModal';
import { ChapterReaderModal } from './components/ChapterReaderModal';

interface SavedProgress {
  activeShip: ShipId;
  isShipLocked: boolean;
  theme: ThemeMode;
  plumas: number;
  sessionsCompleted: number;
  shipChemistry: Record<ShipId, number>;
  shipChapterIndex: Record<ShipId, number>;
  unlockedChapterHistory: BLChapter[];
}

const DEFAULT_PROGRESS: SavedProgress = {
  activeShip: 'noctis-vesper',
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
};

export function App() {
  const [progress, setProgress] = useState<SavedProgress>(() => {
    try {
      const saved = localStorage.getItem('panel_cero_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If they already progressed in any ship previously, mark as locked automatically
        const hasStartedAny =
          (parsed.unlockedChapterHistory && parsed.unlockedChapterHistory.length > 0) ||
          Object.values(parsed.shipChapterIndex || {}).some((v: any) => v > 0);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          isShipLocked:
            typeof parsed.isShipLocked === 'boolean' ? parsed.isShipLocked : hasStartedAny,
        };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  const [activeDomain, setActiveDomain] = useState<TaskDomain>('pieza');
  const [activeUniCat, setActiveUniCat] = useState<UniCategory>('storyboard');
  const [piezaMissionIdx, setPiezaMissionIdx] = useState(0);
  const [customUniInput, setCustomUniInput] = useState('');

  // Modals & Subviews
  const [isOverthinkingOpen, setIsOverthinkingOpen] = useState(false);
  const [runningMission, setRunningMission] = useState<MicroMission | null>(null);
  const [readingChapter, setReadingChapter] = useState<BLChapter | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'misiones' | 'tropos' | 'secretos'>('misiones');
  const [openedSecretLog, setOpenedSecretLog] = useState<SecretLog | null>(null);
  const [selectedCharacterFilter, setSelectedCharacterFilter] = useState<CharacterId | 'all'>('all');

  // Confirmation modal for resetting current ship to switch to another
  const [pendingSwitchShip, setPendingSwitchShip] = useState<ShipId | null>(null);
  const [showResetRouteModal, setShowResetRouteModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('panel_cero_v1', JSON.stringify(progress));
    } catch {
      // ignore storage errors
    }
  }, [progress]);

  const currentShip = SHIPS[progress.activeShip];
  const charA = CHARACTERS[currentShip.charA];
  const charB = CHARACTERS[currentShip.charB];
  const currentChem = progress.shipChemistry[progress.activeShip] || 15;
  const currentChapIdx = progress.shipChapterIndex[progress.activeShip] || 0;

  // Stage index (0 to 4) based on chemistry (0-100+)
  const stageIndex = Math.min(4, Math.floor(currentChem / 22));
  const currentStageName = currentShip.stageNames[stageIndex];

  // Current Cliffhanger Chapter waiting to be unlocked
  const nextChapter = getOrGenerateChapter(
    progress.activeShip,
    currentChapIdx,
    activeDomain
  );

  // Missions filtered
  const piezaMissions = MICRO_MISSIONS.filter((m) => m.domain === 'pieza');
  const currentPiezaMission = piezaMissions[piezaMissionIdx % piezaMissions.length];
  const currentUniMission =
    MICRO_MISSIONS.find(
      (m) => m.domain === 'universidad' && m.category === activeUniCat
    ) || MICRO_MISSIONS[4];

  const spinPiezaRoulette = () => {
    const nextIdx =
      (piezaMissionIdx + 1 + Math.floor(Math.random() * (piezaMissions.length - 1))) %
      piezaMissions.length;
    setPiezaMissionIdx(nextIdx);
  };

  // Starting any mission automatically locks the active ship route!
  const startMissionAndLockShip = (mission: MicroMission) => {
    setProgress((prev) => ({
      ...prev,
      isShipLocked: true,
    }));
    setRunningMission(mission);
  };

  const handleSelectShipCard = (targetShipId: ShipId) => {
    if (targetShipId === progress.activeShip) return;
    if (progress.isShipLocked) {
      // Ask for confirmation to reset current ship progress before switching!
      setPendingSwitchShip(targetShipId);
      setShowResetRouteModal(true);
      return;
    }
    setProgress((prev) => ({ ...prev, activeShip: targetShipId }));
  };

  const handleConfirmResetAndSwitchShip = () => {
    const nextShip = pendingSwitchShip || progress.activeShip;
    setProgress((prev) => ({
      ...prev,
      activeShip: nextShip,
      // Unlock selector if they clicked the top "Cambiar Pareja / Reiniciar" button without a specific card, or lock into the new one with reset progress
      isShipLocked: pendingSwitchShip ? true : false,
      shipChemistry: {
        ...DEFAULT_PROGRESS.shipChemistry,
      },
      shipChapterIndex: {
        ...DEFAULT_PROGRESS.shipChapterIndex,
      },
      unlockedChapterHistory: [],
    }));
    setPendingSwitchShip(null);
    setShowResetRouteModal(false);
  };

  const handleCompleteMission = (mission: MicroMission, bonusFlow: boolean) => {
    setRunningMission(null);
    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.7 },
    });

    const chapterToUnlock = getOrGenerateChapter(
      progress.activeShip,
      currentChapIdx,
      mission.domain
    );

    setProgress((prev) => ({
      ...prev,
      isShipLocked: true,
      plumas: prev.plumas + (bonusFlow ? 25 : 15),
      sessionsCompleted: prev.sessionsCompleted + 1,
    }));

    setReadingChapter(chapterToUnlock);
  };

  const handleFinishChapter = (choice: SceneChoice) => {
    if (!readingChapter) return;
    setProgress((prev) => {
      const prevChem = prev.shipChemistry[prev.activeShip] || 15;
      const prevIdx = prev.shipChapterIndex[prev.activeShip] || 0;
      const alreadyInHistory = prev.unlockedChapterHistory.some(
        (c) => c.id === readingChapter.id
      );
      return {
        ...prev,
        isShipLocked: true,
        shipChemistry: {
          ...prev.shipChemistry,
          [prev.activeShip]: prevChem + choice.chemistryDelta,
        },
        shipChapterIndex: {
          ...prev.shipChapterIndex,
          [prev.activeShip]: alreadyInHistory ? prevIdx : prevIdx + 1,
        },
        unlockedChapterHistory: alreadyInHistory
          ? prev.unlockedChapterHistory
          : [readingChapter, ...prev.unlockedChapterHistory],
      };
    });
    setReadingChapter(null);
  };

  const handleCreateCustomUniMicroStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUniInput.trim()) return;
    const raw = customUniInput.trim();
    setCustomUniInput('');
    startMissionAndLockShip({
      id: `custom-uni-${Date.now()}`,
      domain: 'universidad',
      category: 'Entrega Desglosada',
      title: `Paso Cero: ${raw}`,
      durationMinutes: 5,
      actionInstruction: `Prohibido intentar terminar "${raw}" hoy. Durante estos 5 minutos solo abre el programa/carpeta, crea el archivo base con nombre y haz el primer trazo o bloque sin detallar.`,
      whyItWorks:
        'Tu cerebro se congela cuando ve la entrega entera. Al reducir el requisito a solo abrir y poner la primera piedra en 5 minutos, entras en flow sin dolor.',
      characterIntro: {
        noctis: `Yo me quedo a tu lado mientras abres el archivo de "${raw}". Sin presión.`,
        vesper: `El Acto I de "${raw}" solo requiere abrir el telón por cinco minutos.`,
        kazuha: `Nada de asustarse con "${raw}". Hacemos solo el inicio y yo te cuido el tiempo.`,
        renji: `Cinco minutos de "${raw}" en versión boceto feo y desbloqueamos el capítulo.`,
      },
    });
  };

  const isInkNight = progress.theme === 'ink-night';

  const shipList = Object.values(SHIPS).filter((s) =>
    selectedCharacterFilter === 'all'
      ? true
      : s.charA === selectedCharacterFilter || s.charB === selectedCharacterFilter
  );

  // Only show secret logs for the active ship so everything stays focused on the locked ship!
  const currentShipSecretLogs = SECRET_LOGS.filter(
    (l) => l.shipId === progress.activeShip
  );

  return (
    <div
      className={`min-h-[100dvh] w-full transition-colors duration-300 ${
        isInkNight
          ? 'bg-zinc-950 text-zinc-100 bg-halftone-dark'
          : 'bg-[#f8f3ec] text-zinc-900 bg-halftone-light'
      }`}
    >
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md ${
          isInkNight
            ? 'bg-zinc-950/85 border-white/10'
            : 'bg-[#f8f3ec]/90 border-rose-950/10'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white font-editorial font-bold text-lg shadow-sm">
              0
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base">
                  PANEL CERO
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[11px] font-mono-tech uppercase bg-rose-500/15 text-rose-400 border border-rose-500/25">
                  Estudio & Crónicas BL
                </span>
              </div>
              <p
                className={`text-xs hidden md:block ${
                  isInkNight ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                Un solo micropaso de 5 minutos para destrabar el siguiente capítulo
              </p>
            </div>
          </div>

          {/* Right Metrics & Theme Switcher */}
          <div className="flex items-center gap-2.5 md:gap-3">
            {/* Emergency Overthinking Unblocker Button */}
            <button
              onClick={() => setIsOverthinkingOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition active:scale-[0.98]"
            >
              <Shuffle size={15} weight="bold" className="text-rose-400" />
              <span>¿Sobrepensando el orden?</span>
            </button>

            {/* Plumas counter */}
            <div
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono-tech flex items-center gap-1.5 ${
                isInkNight
                  ? 'bg-zinc-900 border-white/10 text-zinc-200'
                  : 'bg-white border-rose-950/15 text-zinc-800'
              }`}
              title="Plumas de Tinta ganadas al iniciar bloques de 5 minutos"
            >
              <Sparkle size={14} weight="fill" className="text-rose-400" />
              <span>{progress.plumas} Plumas</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() =>
                setProgress((p) => ({
                  ...p,
                  theme: p.theme === 'ink-night' ? 'shojo-2004' : 'ink-night',
                }))
              }
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                isInkNight
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-white/10 text-zinc-300'
                  : 'bg-white hover:bg-rose-50 border-rose-950/15 text-zinc-800'
              }`}
              title="Cambiar entre estética Tinta Nocturna (Hwei/Aphelios) y Papel Manga 2004 (Kamisama)"
            >
              {isInkNight ? (
                <>
                  <MoonStars size={15} weight="fill" className="text-sky-400" />
                  <span className="hidden sm:inline">Tinta Nocturna</span>
                </>
              ) : (
                <>
                  <SunHorizon size={15} weight="fill" className="text-rose-500" />
                  <span className="hidden sm:inline">Manga 2004</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Asymmetric Workspace */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* SHIP ROUTE STATUS OR INITIAL SHIP SELECTOR */}
        <section className="mb-7">
          {progress.isShipLocked ? (
            /* LOCKED SHIP BANNER: Once started, she is locked into this Ship unless she resets from zero */
            <div
              className={`p-4 md:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isInkNight
                  ? 'bg-zinc-900/90 border-rose-500/40'
                  : 'bg-white border-rose-500/50 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex -space-x-3 shrink-0">
                  <CharacterPortrait
                    characterId={charA.id}
                    size="sm"
                    className="rounded-xl ring-2 ring-zinc-950"
                  />
                  <CharacterPortrait
                    characterId={charB.id}
                    size="sm"
                    className="rounded-xl ring-2 ring-zinc-950"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono-tech uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <LockKey size={12} weight="fill" />
                      Ruta BL Fijada
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      Episodio {currentChapIdx + 1} en curso
                    </span>
                  </div>
                  <h1 className="text-lg md:text-xl font-bold tracking-tight mt-0.5">
                    {charA.name} × {charB.name} —{' '}
                    <span className="text-rose-400 font-editorial italic font-normal">
                      {currentShip.title}
                    </span>
                  </h1>
                </div>
              </div>

              <button
                onClick={() => {
                  setPendingSwitchShip(null);
                  setShowResetRouteModal(true);
                }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition shrink-0 ${
                  isInkNight
                    ? 'bg-zinc-950 hover:bg-zinc-800 border-white/10 text-zinc-400 hover:text-rose-300'
                    : 'bg-rose-50 hover:bg-rose-100 border-rose-950/15 text-zinc-700'
                }`}
              >
                <ArrowCounterClockwise size={15} />
                <span>Reiniciar historia para cambiar de Ship</span>
              </button>
            </div>
          ) : (
            /* UNLOCKED INITIAL SELECTOR: Before starting Episode 1, she picks her Ship and locks it */
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-400">
                    Paso Inicial — Elige tu Ruta BL (Se bloqueará al comenzar)
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    ¿Qué pareja quieres seguir en esta historia?
                  </h1>
                  <p className="text-xs text-zinc-400 mt-1">
                    Una vez que inicies tu primera misión o fijes la pareja, quedarás comprometida con su historia (para cambiar a otro ship tendrás que reiniciar desde el Episodio 1).
                  </p>
                </div>

                {/* Filter by individual archetype */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCharacterFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      selectedCharacterFilter === 'all'
                        ? 'bg-rose-600 text-white'
                        : isInkNight
                        ? 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/10'
                        : 'bg-white text-zinc-700 border border-rose-950/10'
                    }`}
                  >
                    Todas las Parejas (6)
                  </button>
                  {Object.values(CHARACTERS).map((char) => (
                    <button
                      key={char.id}
                      onClick={() =>
                        setSelectedCharacterFilter(
                          selectedCharacterFilter === char.id ? 'all' : char.id
                        )
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                        selectedCharacterFilter === char.id
                          ? 'bg-rose-600 text-white'
                          : isInkNight
                          ? 'bg-zinc-900 text-zinc-300 hover:text-white border border-white/10'
                          : 'bg-white text-zinc-800 border border-rose-950/10'
                      }`}
                    >
                      <span>{char.name}</span>
                      <span className="opacity-65 text-[11px] hidden sm:inline">
                        ({char.id === 'noctis'
                          ? 'Emo/Pintor'
                          : char.id === 'vesper'
                          ? 'Máscara'
                          : char.id === 'kazuha'
                          ? 'Kitsune'
                          : 'Comedia 2000s'})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ship Cards + Confirm Lock Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {shipList.map((ship) => {
                  const cA = CHARACTERS[ship.charA];
                  const cB = CHARACTERS[ship.charB];
                  const isSelected = progress.activeShip === ship.id;

                  return (
                    <div
                      key={ship.id}
                      onClick={() => handleSelectShipCard(ship.id)}
                      className={`cursor-pointer text-left p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 active:scale-[0.99] ${
                        isSelected
                          ? isInkNight
                            ? 'bg-zinc-900 border-rose-500/60 shadow-lg'
                            : 'bg-white border-rose-500 shadow-md'
                          : isInkNight
                          ? 'bg-zinc-900/45 hover:bg-zinc-900/80 border-white/10'
                          : 'bg-white/60 hover:bg-white border-rose-950/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex -space-x-3 shrink-0">
                          <CharacterPortrait
                            characterId={cA.id}
                            size="sm"
                            className="rounded-xl ring-2 ring-zinc-950"
                          />
                          <CharacterPortrait
                            characterId={cB.id}
                            size="sm"
                            className="rounded-xl ring-2 ring-zinc-950"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm truncate">
                              {cA.name} × {cB.name}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            )}
                          </div>
                          <p
                            className={`text-xs truncate ${
                              isInkNight ? 'text-zinc-400' : 'text-zinc-600'
                            }`}
                          >
                            {ship.tropeHeadline}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProgress((prev) => ({
                              ...prev,
                              isShipLocked: true,
                            }));
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition"
                        >
                          <LockKey size={13} weight="fill" />
                          Fijar Ship
                        </button>
                      ) : (
                        <span className="text-xs font-mono-tech text-zinc-500 shrink-0">
                          Ver
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ASYMMETRIC 12-COLUMN BENTO GRID: Left (7 cols) BL Cliffhanger Stage | Right (5 cols) Anti-Paralysis Unblocker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (7 cols): THE LIVE BL CLIFFHANGER STAGE */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className={`rounded-3xl border overflow-hidden shadow-xl ${
                isInkNight
                  ? 'bg-zinc-900/90 border-white/10'
                  : 'bg-white border-rose-950/15'
              }`}
            >
              {/* Relationship Slow-Burn Bar */}
              <div
                className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                  isInkNight
                    ? 'bg-zinc-950/60 border-white/10'
                    : 'bg-rose-50/70 border-rose-950/10'
                }`}
              >
                <div>
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-400 block">
                    Arco Actual — {currentShip.title}
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">
                    {currentStageName}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-36 h-2.5 rounded-full bg-zinc-800 overflow-hidden p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-rose-500"
                      animate={{ width: `${Math.min(100, currentChem)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono-tech font-semibold text-rose-400">
                    {currentChem}% Química
                  </span>
                </div>
              </div>

              {/* Dual Character Stage + Paused Cliffhanger Dialogue */}
              <div className="p-6 md:p-7 space-y-6">
                {/* Character Cards Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[charA, charB].map((char, idx) => (
                    <div
                      key={char.id}
                      className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                        isInkNight
                          ? 'bg-zinc-950/75 border-white/10'
                          : 'bg-[#faf6f0] border-rose-950/10'
                      }`}
                    >
                      <CharacterPortrait
                        characterId={char.id}
                        expression={idx === 0 ? 'blush' : 'smirk'}
                        size="lg"
                        className="rounded-2xl border border-white/10"
                      />
                      <div className="min-w-0 space-y-1.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-mono-tech uppercase border ${char.badgeBg} ${char.badgeText}`}
                        >
                          {char.epithet}
                        </span>
                        <h3 className="text-base font-bold">{char.name}</h3>
                        <p
                          className={`text-xs leading-relaxed ${
                            isInkNight ? 'text-zinc-400' : 'text-zinc-600'
                          }`}
                        >
                          {activeDomain === 'pieza'
                            ? char.roomStyleNote
                            : char.uniStyleNote}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* THE CLIFFHANGER HOOK BOX */}
                <div
                  className={`p-5 md:p-6 rounded-2xl border relative overflow-hidden space-y-4 ${
                    isInkNight
                      ? 'bg-zinc-950 border-rose-500/35'
                      : 'bg-rose-950 text-zinc-100 border-rose-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tech uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <LockKey size={14} weight="fill" />
                      Escena en Cliffhanger — {nextChapter.title}
                    </span>
                    <span className="text-xs font-mono-tech text-zinc-400">
                      {nextChapter.tropeTag}
                    </span>
                  </div>

                  {/* Preview Lines */}
                  <div className="space-y-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block mb-1">
                        {CHARACTERS[nextChapter.cliffhangerPreview.speakerA].name}:
                      </span>
                      <p className="text-sm md:text-base font-editorial italic text-zinc-100">
                        "{nextChapter.cliffhangerPreview.lineA}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
                        {CHARACTERS[nextChapter.cliffhangerPreview.speakerB].name}:
                      </span>
                      <p className="text-sm md:text-base font-editorial italic text-zinc-100">
                        "{nextChapter.cliffhangerPreview.lineB}"
                      </p>
                    </div>
                  </div>

                  {/* Unlock Callout */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 text-xs text-rose-200">
                    <p className="leading-relaxed">
                      <strong>Cómo destrabar qué pasa ahora:</strong> Inicia cualquier micropaso de 3 a 5 minutos en{' '}
                      <span className="underline">Mi Pieza</span> o{' '}
                      <span className="underline">Universidad</span> en el panel derecho.
                    </p>
                    <button
                      onClick={() =>
                        startMissionAndLockShip(
                          activeDomain === 'pieza'
                            ? currentPiezaMission
                            : currentUniMission
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shrink-0 flex items-center gap-1.5 transition active:scale-[0.98]"
                    >
                      <Play size={14} weight="fill" />
                      Destrabar con 5 min
                    </button>
                  </div>
                </div>

                {/* Previously Unlocked Chapters History for THIS Ship */}
                {progress.unlockedChapterHistory.filter((c) => c.shipId === progress.activeShip)
                  .length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-mono-tech uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <BookOpenText size={15} />
                      Capítulos Desbloqueados de {charA.name} × {charB.name}:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {progress.unlockedChapterHistory
                        .filter((c) => c.shipId === progress.activeShip)
                        .slice(0, 4)
                        .map((chap) => (
                          <button
                            key={chap.id}
                            onClick={() => setReadingChapter(chap)}
                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                              isInkNight
                                ? 'bg-zinc-950/70 hover:bg-zinc-950 border-white/10'
                                : 'bg-[#faf6f0] hover:bg-rose-50 border-rose-950/10'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate">
                                {chap.title}
                              </div>
                              <div className="text-[11px] text-rose-400 truncate">
                                {chap.tropeTag}
                              </div>
                            </div>
                            <Eye size={16} className="text-rose-400 shrink-0" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (5 cols): ANTI-PARALYSIS TASK ENGINE + TROPE DECK + 3 AM LOGS */}
          <div className="lg:col-span-5 space-y-5">
            {/* Sub-navigation tabs */}
            <div
              className={`grid grid-cols-3 p-1.5 rounded-2xl border ${
                isInkNight
                  ? 'bg-zinc-900 border-white/10'
                  : 'bg-white border-rose-950/10'
              }`}
            >
              <button
                onClick={() => setActiveRightTab('misiones')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeRightTab === 'misiones'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Lightning size={15} weight="fill" />
                <span>Partir (3-5m)</span>
              </button>
              <button
                onClick={() => setActiveRightTab('tropos')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeRightTab === 'tropos'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cards size={15} weight="fill" />
                <span>Tropos BL</span>
              </button>
              <button
                onClick={() => setActiveRightTab('secretos')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeRightTab === 'secretos'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ChatCircleDots size={15} weight="fill" />
                <span>Chats 3 AM</span>
              </button>
            </div>

            {/* TAB 1: MICRO-MISSIONS (MI PIEZA vs UNIVERSIDAD) */}
            {activeRightTab === 'misiones' && (
              <div
                className={`rounded-3xl border p-6 space-y-6 shadow-xl ${
                  isInkNight
                    ? 'bg-zinc-900/90 border-white/10'
                    : 'bg-white border-rose-950/15'
                }`}
              >
                {/* The Two Giant Portals */}
                <div className="space-y-2">
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                    Paso 1: ¿Dónde estás bloqueada ahora mismo?
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveDomain('pieza')}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 active:scale-[0.98] ${
                        activeDomain === 'pieza'
                          ? 'bg-rose-600 text-white border-rose-400 shadow-lg'
                          : isInkNight
                          ? 'bg-zinc-950 text-zinc-300 border-white/10 hover:border-white/25'
                          : 'bg-[#faf6f0] text-zinc-800 border-rose-950/10'
                      }`}
                    >
                      <HouseLine size={24} weight="duotone" />
                      <div>
                        <div className="font-bold text-base">Mi Pieza</div>
                        <div className="text-xs opacity-80">
                          Ordenar con ellos sin abrumarte
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveDomain('universidad')}
                      className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 active:scale-[0.98] ${
                        activeDomain === 'universidad'
                          ? 'bg-sky-600 text-white border-sky-400 shadow-lg'
                          : isInkNight
                          ? 'bg-zinc-950 text-zinc-300 border-white/10 hover:border-white/25'
                          : 'bg-[#faf6f0] text-zinc-800 border-rose-950/10'
                      }`}
                    >
                      <PaintBrushBroad size={24} weight="duotone" />
                      <div>
                        <div className="font-bold text-base">Universidad</div>
                        <div className="text-xs opacity-80">
                          3D, Storyboard, Animación, Portafolio
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* MODO MI PIEZA VIEW */}
                {activeDomain === 'pieza' ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-400">
                        1 Sola Micro-Misión Activa (Prohibido hacer más)
                      </span>
                      <button
                        onClick={spinPiezaRoulette}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-medium text-rose-300 flex items-center gap-1.5 transition active:scale-[0.97]"
                      >
                        <DiceFive size={16} weight="fill" />
                        Girar otra misión (3m)
                      </button>
                    </div>

                    {/* Single Mission Card */}
                    <div
                      className={`p-5 rounded-2xl border space-y-4 ${
                        isInkNight
                          ? 'bg-zinc-950 border-white/10'
                          : 'bg-[#faf6f0] border-rose-950/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-tech bg-rose-500/15 text-rose-400">
                          {currentPiezaMission.category}
                        </span>
                        <span className="text-xs font-mono-tech font-semibold text-zinc-400">
                          Duración: {currentPiezaMission.durationMinutes} min
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight">
                        {currentPiezaMission.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed ${
                          isInkNight ? 'text-zinc-200' : 'text-zinc-800'
                        }`}
                      >
                        {currentPiezaMission.actionInstruction}
                      </p>

                      {/* Companion's personal comment */}
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                        <CharacterPortrait
                          characterId={charA.id}
                          expression="smirk"
                          size="sm"
                          className="rounded-lg"
                        />
                        <p className="text-xs italic leading-relaxed">
                          <strong>{charA.name}:</strong> "
                          {currentPiezaMission.characterIntro[charA.id]}"
                        </p>
                      </div>

                      <button
                        onClick={() => startMissionAndLockShip(currentPiezaMission)}
                        className="w-full py-4 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
                      >
                        <Play size={18} weight="fill" />
                        Iniciar estos {currentPiezaMission.durationMinutes} min y destrabar Capítulo BL
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MODO UNIVERSIDAD VIEW */
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <span className="text-xs font-mono-tech uppercase tracking-wider text-sky-400">
                        Elige tu Ramo de Animación Digital (Paso Cero de 5 min):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'storyboard', label: 'Storyboard', icon: FilmStrip },
                          { id: 'modelado3d', label: 'Modelado 3D', icon: Cube },
                          { id: 'animacion', label: 'Animación', icon: Play },
                          { id: 'ilustracion', label: 'Ilustración', icon: PencilCircle },
                          { id: 'portafolio', label: 'Portafolio', icon: FolderOpen },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isAct = activeUniCat === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveUniCat(tab.id as UniCategory)}
                              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
                                isAct
                                  ? 'bg-sky-600 text-white'
                                  : isInkNight
                                  ? 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/10'
                                  : 'bg-[#faf6f0] text-zinc-700 border-rose-950/10'
                              }`}
                            >
                              <Icon size={15} weight="duotone" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Single Uni Micro-Mission Card */}
                    <div
                      className={`p-5 rounded-2xl border space-y-4 ${
                        isInkNight
                          ? 'bg-zinc-950 border-white/10'
                          : 'bg-[#faf6f0] border-rose-950/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-mono-tech bg-sky-500/15 text-sky-400 uppercase">
                          Rompehielos Anti-Hoja en Blanco
                        </span>
                        <span className="text-xs font-mono-tech font-semibold text-zinc-400">
                          {currentUniMission.durationMinutes} min
                        </span>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight">
                        {currentUniMission.title}
                      </h3>

                      <p
                        className={`text-sm leading-relaxed ${
                          isInkNight ? 'text-zinc-200' : 'text-zinc-800'
                        }`}
                      >
                        {currentUniMission.actionInstruction}
                      </p>

                      <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center gap-3">
                        <CharacterPortrait
                          characterId={charB.id}
                          expression="neutral"
                          size="sm"
                          className="rounded-lg"
                        />
                        <p className="text-xs italic leading-relaxed">
                          <strong>{charB.name}:</strong> "
                          {currentUniMission.characterIntro[charB.id]}"
                        </p>
                      </div>

                      <button
                        onClick={() => startMissionAndLockShip(currentUniMission)}
                        className="w-full py-4 px-5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
                      >
                        <Play size={18} weight="fill" />
                        Partir estos 5 min y desbloquear Capítulo BL
                      </button>
                    </div>

                    {/* Custom University Task Splitter */}
                    <form
                      onSubmit={handleCreateCustomUniMicroStep}
                      className="pt-3 border-t border-white/10 space-y-2"
                    >
                      <label className="block text-xs font-mono-tech uppercase tracking-wider text-zinc-400">
                        ¿Tienes una entrega específica que te da miedo empezar?
                      </label>
                      <div className="flex gap-2">
                        <input
                          value={customUniInput}
                          onChange={(e) => setCustomUniInput(e.target.value)}
                          placeholder="Ej: Hacer rig de manos en Blender..."
                          className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-sky-400 ${
                            isInkNight
                              ? 'bg-zinc-950 border-white/10 text-white'
                              : 'bg-white border-rose-950/15 text-zinc-900'
                          }`}
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shrink-0 transition"
                        >
                          Crear Paso Cero
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MAZO DE CARTAS DE TROPOS BL */}
            {activeRightTab === 'tropos' && (
              <div
                className={`rounded-3xl border p-6 space-y-4 shadow-xl ${
                  isInkNight
                    ? 'bg-zinc-900/90 border-white/10'
                    : 'bg-white border-rose-950/15'
                }`}
              >
                <div>
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-400">
                    Directora de Escena ({progress.plumas} Plumas disponibles)
                  </span>
                  <h3 className="text-lg font-bold">
                    Inyecta un Tropo BL en {charA.name} × {charB.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Usa las Plumas que ganas completando tus bloques de 5 minutos para obligar a{' '}
                    <strong>
                      {charA.name} y {charB.name}
                    </strong>{' '}
                    a vivir una situación clásica de manhwa BL.
                  </p>
                </div>

                <div className="space-y-3">
                  {TROPE_CARDS.map((card) => {
                    const canAfford = progress.plumas >= card.costPlumas;
                    return (
                      <div
                        key={card.id}
                        className={`p-4 rounded-2xl border space-y-2.5 ${
                          isInkNight
                            ? 'bg-zinc-950 border-white/10'
                            : 'bg-[#faf6f0] border-rose-950/15'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono-tech bg-rose-500/15 text-rose-400">
                            {card.tag}
                          </span>
                          <span className="text-xs font-mono-tech text-amber-400 font-semibold">
                            {card.costPlumas} Plumas
                          </span>
                        </div>
                        <h4 className="font-bold text-sm">{card.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {card.description}
                        </p>
                        <button
                          disabled={!canAfford}
                          onClick={() => {
                            setProgress((prev) => ({
                              ...prev,
                              isShipLocked: true,
                              plumas: prev.plumas - card.costPlumas,
                            }));
                            const customChap = card.customSceneGenerator(
                              charA,
                              charB,
                              activeDomain
                            );
                            setReadingChapter(customChap);
                          }}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                            canAfford
                              ? 'bg-rose-600 hover:bg-rose-500 text-white'
                              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                          }`}
                        >
                          <Sparkle size={14} weight="fill" />
                          {canAfford
                            ? `Activar escena con ${charA.name} × ${charB.name}`
                            : 'Completa 1 bloque de 5 min para ganar más Plumas'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CHATS DE LAS 3 AM & BOCETOS SECRETOS */}
            {activeRightTab === 'secretos' && (
              <div
                className={`rounded-3xl border p-6 space-y-4 shadow-xl ${
                  isInkNight
                    ? 'bg-zinc-900/90 border-white/10'
                    : 'bg-white border-rose-950/15'
                }`}
              >
                <div>
                  <span className="text-xs font-mono-tech uppercase tracking-wider text-rose-400">
                    Archivos Confidenciales ({progress.sessionsCompleted} bloques completados)
                  </span>
                  <h3 className="text-lg font-bold">
                    Chats de las 3 AM & Cuadernos Ocultos
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Lee los mensajes que escribieron y borraron de madrugada y las páginas escondidas de sus croquis.
                  </p>
                </div>

                <div className="space-y-3">
                  {(currentShipSecretLogs.length > 0 ? currentShipSecretLogs : SECRET_LOGS).map(
                    (log) => {
                      const isUnlocked =
                        progress.sessionsCompleted >= log.unlockRequirementSessions;
                      return (
                        <div
                          key={log.id}
                          className={`p-4 rounded-2xl border space-y-2 ${
                            isInkNight
                              ? 'bg-zinc-950 border-white/10'
                              : 'bg-[#faf6f0] border-rose-950/15'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono-tech text-rose-400 flex items-center gap-1">
                              {isUnlocked ? (
                                <LockKeyOpen size={14} weight="fill" />
                              ) : (
                                <LockKey size={14} weight="fill" />
                              )}
                              {log.type === 'chat-3am'
                                ? 'Historial de Chat Privado'
                                : 'Cuaderno de Bocetos'}
                            </span>
                            <span className="text-[11px] font-mono-tech text-zinc-500">
                              Req: {log.unlockRequirementSessions} sesiones
                            </span>
                          </div>
                          <h4 className="font-bold text-sm">{log.title}</h4>
                          <p className="text-xs text-zinc-400">{log.summary}</p>

                          {isUnlocked ? (
                            <button
                              onClick={() =>
                                setOpenedSecretLog(
                                  openedSecretLog?.id === log.id ? null : log
                                )
                              }
                              className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
                            >
                              {openedSecretLog?.id === log.id
                                ? 'Ocultar archivo'
                                : 'Abrir archivo secreto'}
                            </button>
                          ) : (
                            <div className="text-[11px] font-mono-tech text-zinc-500 pt-1">
                              Completa{' '}
                              {log.unlockRequirementSessions - progress.sessionsCompleted}{' '}
                              bloque(s) más de 5 min para desbloquear.
                            </div>
                          )}

                          {/* Expanded Secret Content */}
                          <AnimatePresence>
                            {openedSecretLog?.id === log.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="pt-3 mt-2 border-t border-white/10 space-y-2.5"
                              >
                                {log.chatMessages &&
                                  log.chatMessages.map((msg, i) => (
                                    <div
                                      key={i}
                                      className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs space-y-1"
                                    >
                                      <div className="flex justify-between font-mono-tech text-[11px] text-rose-300">
                                        <strong>{CHARACTERS[msg.sender].name}</strong>
                                        <span>{msg.time}</span>
                                      </div>
                                      <p className="text-zinc-100">{msg.text}</p>
                                      {msg.deletedDraft && (
                                        <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-white/5">
                                          [Borrador escrito y borrado antes de enviar]: "
                                          {msg.deletedDraft}"
                                        </p>
                                      )}
                                    </div>
                                  ))}

                                {log.sketchbookEntry && (
                                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-rose-500/30 text-xs space-y-2 font-editorial">
                                    <div className="font-mono-tech text-[11px] text-rose-300">
                                      {log.sketchbookEntry.dateLabel}
                                    </div>
                                    <p className="italic text-zinc-300">
                                      [Boceto]: {log.sketchbookEntry.sketchCaption}
                                    </p>
                                    <p className="text-sm text-zinc-100 leading-relaxed">
                                      "{log.sketchbookEntry.monologue}"
                                    </p>
                                    <p className="text-xs text-rose-300 pt-1 border-t border-white/10">
                                      {log.sketchbookEntry.marginNote}
                                    </p>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* RESET SHIP ROUTE CONFIRMATION MODAL */}
      <AnimatePresence>
        {showResetRouteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md rounded-3xl bg-zinc-900 border border-rose-500/30 p-6 space-y-5 text-zinc-100 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400">
                <WarningCircle size={28} weight="fill" />
                <h3 className="text-lg font-bold text-white">
                  ¿Reiniciar ruta para cambiar de Ship?
                </h3>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed">
                Actualmente estás vinculada a la historia de{' '}
                <strong className="text-white">
                  {charA.name} × {charB.name}
                </strong>{' '}
                (Episodio {currentChapIdx + 1}, {currentChem}% de Química).
              </p>
              <p className="text-xs text-rose-200/90 bg-rose-950/40 border border-rose-500/30 p-3.5 rounded-xl leading-relaxed">
                En <strong>Panel Cero</strong> solo puedes vivir un Ship a la vez. Si decides cambiar de pareja ahora, el progreso de capítulos y química de tu ruta actual se reiniciará desde cero.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setPendingSwitchShip(null);
                    setShowResetRouteModal(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
                >
                  Seguir con {charA.name} × {charB.name}
                </button>
                <button
                  onClick={handleConfirmResetAndSwitchShip}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white flex items-center gap-1.5 transition"
                >
                  <ArrowCounterClockwise size={15} />
                  Sí, reiniciar ruta y cambiar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <OverthinkingModal
        isOpen={isOverthinkingOpen}
        onClose={() => setIsOverthinkingOpen(false)}
        charA={charA}
        charB={charB}
        onStartUnblockedMission={(m) => startMissionAndLockShip(m)}
      />

      <ActiveTimerModal
        mission={runningMission}
        charA={charA}
        charB={charB}
        onClose={() => setRunningMission(null)}
        onCompleteMission={handleCompleteMission}
      />

      <ChapterReaderModal
        key={readingChapter?.id || 'empty-reader'}
        chapter={readingChapter}
        onClose={() => setReadingChapter(null)}
        onFinishChapter={handleFinishChapter}
      />
    </div>
  );
}
export default App;
