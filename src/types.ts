export type CharacterId = 'noctis' | 'vesper' | 'kazuha' | 'renji';

export type ShipId =
  | 'noctis-vesper'
  | 'kazuha-noctis'
  | 'kazuha-renji'
  | 'vesper-renji'
  | 'kazuha-vesper'
  | 'noctis-renji';

export type ThemeMode = 'ink-night' | 'shojo-2004';

export type TaskDomain = 'pieza' | 'universidad';

export type UniCategory =
  | 'storyboard'
  | 'modelado3d'
  | 'animacion'
  | 'ilustracion'
  | 'portafolio';

export interface CharacterProfile {
  id: CharacterId;
  name: string;
  epithet: string;
  archetype: string;
  inspiration: string;
  quote: string;
  colorHex: string;
  badgeBg: string;
  badgeText: string;
  traits: string[];
  roomStyleNote: string;
  uniStyleNote: string;
}

export interface DialogueBeat {
  id: string;
  speaker: CharacterId | 'narrator';
  expression?: 'neutral' | 'blush' | 'intense' | 'smirk' | 'look-away' | 'shock';
  spokenText: string;
  hiddenThought?: string; // Revealed when tapping/clicking the character or thought trigger
  stageDirection?: string;
  // Memoria de decisiones: el cuadro solo aparece si ella eligió esa opción en un capítulo anterior...
  si?: string;
  // ...o si no eligió ninguna de estas.
  siNinguna?: string[];
}

export interface SceneChoice {
  id: string;
  label: string;
  tone: 'tension' | 'tierno' | 'caos';
  chemistryDelta: number;
  followUpBeats: DialogueBeat[];
}

export interface BLChapter {
  id: string;
  shipId: ShipId;
  chapterNumber: number;
  title: string;
  subtitle: string;
  contextTrigger: 'pieza' | 'universidad' | 'any';
  tropeTag: string;
  cliffhangerPreview: {
    speakerA: CharacterId;
    lineA: string;
    speakerB: CharacterId;
    lineB: string;
    narratorHook: string;
  };
  beats: DialogueBeat[];
  choicePrompt: string;
  choices: SceneChoice[];
  nextCliffhangerTeaser: string;
}

export interface ChatMessage3AM {
  sender: CharacterId;
  time: string;
  text: string;
  deletedDraft?: string; // Shows what they typed and erased before sending!
}

export interface SecretLog {
  id: string;
  shipId: ShipId;
  title: string;
  unlockRequirementSessions: number;
  type: 'chat-3am' | 'sketchbook-note';
  summary: string;
  chatMessages?: ChatMessage3AM[];
  sketchbookEntry?: {
    author: CharacterId;
    subject: CharacterId;
    dateLabel: string;
    sketchCaption: string;
    monologue: string;
    marginNote: string;
  };
}

export interface TropeCard {
  id: string;
  title: string;
  tag: string;
  description: string;
  costPlumas: number;
  customSceneGenerator: (charA: CharacterProfile, charB: CharacterProfile, domain: TaskDomain) => BLChapter;
}

export interface MicroMission {
  id: string;
  domain: TaskDomain;
  category: string;
  title: string;
  durationMinutes: number;
  actionInstruction: string;
  whyItWorks: string;
  characterIntro: Record<CharacterId, string>;
}
