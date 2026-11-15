import {
  CharacterId,
  CharacterProfile,
  ShipId,
  BLChapter,
  SecretLog,
  TropeCard,
  MicroMission,
} from '../types';
import {
  TEMPORADA_KAZUHA_RENJI,
  ESPERA_KAZUHA_RENJI,
  SECRETOS_KAZUHA_RENJI,
} from './historias/kazuha-renji';
import { TEMPORADA_NOCTIS_VESPER, ESPERA_NOCTIS_VESPER, SECRETOS_NOCTIS_VESPER } from './historias/noctis-vesper';
import { TEMPORADA_KAZUHA_NOCTIS, ESPERA_KAZUHA_NOCTIS, SECRETOS_KAZUHA_NOCTIS } from './historias/kazuha-noctis';
import { TEMPORADA_VESPER_RENJI, ESPERA_VESPER_RENJI, SECRETOS_VESPER_RENJI } from './historias/vesper-renji';
import { TEMPORADA_KAZUHA_VESPER, ESPERA_KAZUHA_VESPER, SECRETOS_KAZUHA_VESPER } from './historias/kazuha-vesper';
import { TEMPORADA_NOCTIS_RENJI, ESPERA_NOCTIS_RENJI, SECRETOS_NOCTIS_RENJI } from './historias/noctis-renji';

export const CHARACTERS: Record<CharacterId, CharacterProfile> = {
  noctis: {
    id: 'noctis',
    name: 'Noctis',
    epithet: 'El Pintor de Tinta Lunar',
    archetype: 'Melancólico / Andrógino Artístico',
    inspiration: 'Estética Hwei & Aphelios — silencio lunar, acuarela oscura y sensibilidad',
    quote: 'Mirar el lienzo vacío duele... pero no tienes que llenarlo hoy. Tira solo el primer trazo conmigo.',
    colorHex: '#38bdf8',
    badgeBg: 'bg-sky-500/15 border-sky-400/30',
    badgeText: 'text-sky-300',
    traits: ['Dedos manchados de tinta', 'Voz baja a las 3 AM', 'Se sonroja en silencio'],
    roomStyleNote: 'Te pide despejar solo un rincón pequeño para que tu mente deje de sentir ruido visual.',
    uniStyleNote: 'Entiende el bloqueo creativo de Animación y 3D; celebra hasta abrir el archivo vacío.',
  },
  vesper: {
    id: 'vesper',
    name: 'Vesper',
    epithet: 'El Virtuoso tras la Máscara',
    archetype: 'Misterioso con Máscara / Perfeccionista Teatral',
    inspiration: 'Estética Jhin — media máscara de porcelana y oro, obsesión con los 4 actos',
    quote: '¿Ordenar todo de golpe? Qué falta de estética. Toda obra maestra comienza con apenas cuatro movimientos.',
    colorHex: '#f43f5e',
    badgeBg: 'bg-rose-500/15 border-rose-400/30',
    badgeText: 'text-rose-300',
    traits: ['Media máscara ornamentada', 'Cuenta todo en 4 tiempos', 'Intimidante hasta que alguien se le acerca'],
    roomStyleNote: 'Convierte limpiar tu pieza en una coreografía de exactamente 4 objetos por ronda.',
    uniStyleNote: 'Trata tu storyboard o modelo 3D como el Acto I de una función privada.',
  },
  kazuha: {
    id: 'kazuha',
    name: 'Kazuha',
    epithet: 'El Kitsune del Estudio',
    archetype: 'Guardián Tsundere / Shojo Principios de los 2000',
    inspiration: 'Estética Tomoe (Kamisama Hajimemashita) — devoto, gruñón y protector',
    quote: '¿Otra vez te congelaste mirando el desorden? Suspiro... Ven acá, yo decido por dónde empezamos. Hazme caso 5 minutos.',
    colorHex: '#fb7185',
    badgeBg: 'bg-pink-500/15 border-pink-400/30',
    badgeText: 'text-pink-300',
    traits: ['Orejas de zorro plateadas', 'Prepara té mientras te regaña', 'Ferozmente leal en secreto'],
    roomStyleNote: 'Actúa como tu familiar guardián: te prohíbe estresarte y te guía paso a paso como en casa.',
    uniStyleNote: 'Te obliga a hacer solo lo mínimo para que no te desveles frente al monitor.',
  },
  renji: {
    id: 'renji',
    name: 'Renji',
    epithet: 'El Senpai de Leche de Frutilla',
    archetype: 'Comedia Caótica 2000s / Rompe la Cuarta Pared',
    inspiration: 'Estética Gintama & Lovely Complex — humor absurdo, cero culpa y corazón enorme',
    quote: '¿Parálisis por análisis? Amiga, hasta los animadores profesionales entregan el layout con palitos. Partamos 5 minutos sin dignidad.',
    colorHex: '#f59e0b',
    badgeBg: 'bg-amber-500/15 border-amber-400/30',
    badgeText: 'text-amber-300',
    traits: ['Adicto al azúcar nocturno', 'Rompe la cuarta pared', 'Se pone serio cuando menos lo esperas'],
    roomStyleNote: 'Le quita toda la solemnidad a limpiar la pieza: si juntas 3 cosas ya ganaste la ronda.',
    uniStyleNote: 'Se burla del perfeccionismo universitario para que sueltes la mano en 30 segundos.',
  },
};

export interface ShipMetadata {
  id: ShipId;
  charA: CharacterId;
  charB: CharacterId;
  title: string;
  tropeHeadline: string;
  synopsis: string;
  stageNames: [string, string, string, string, string];
}

export const SHIPS: Record<ShipId, ShipMetadata> = {
  'noctis-vesper': {
    id: 'noctis-vesper',
    charA: 'noctis',
    charB: 'vesper',
    title: 'Tinta Bajo la Máscara',
    tropeHeadline: 'Musa Melancólica × Obsesión Teatral',
    synopsis:
      'Vesper dirige una obra desde la cuarta fila y cada mañana clava cuatro correcciones en el telón que pinta Noctis. Nunca cinco. Hasta que un día hay una quinta, y no es sobre la pintura.',
    stageNames: [
      'I. Crítica a Distancia',
      'II. El Pulso Compartido',
      'III. Grietas en la Porcelana',
      'IV. Cuatro Latidos a Oscuras',
      'V. Sin Máscara al Amanecer',
    ],
  },
  'kazuha-noctis': {
    id: 'kazuha-noctis',
    charA: 'kazuha',
    charB: 'noctis',
    title: 'Té Caliente a las Cuatro AM',
    tropeHeadline: 'Guardián Tsundere × Artista Insomne',
    synopsis:
      'Noctis deja enfriar once tazas de té al día. Kazuha, guardián de la casa hace doscientos años, jura que se las sigue subiendo por obligación. Sus orejas dicen otra cosa.',
    stageNames: [
      'I. Quejas en el Taller',
      'II. El Haori Prestado',
      'III. Fiebre de Entrega',
      'IV. Manos Frías, Cuello Tibio',
      'V. Promesa del Familiar',
    ],
  },
  'kazuha-renji': {
    id: 'kazuha-renji',
    charA: 'kazuha',
    charB: 'renji',
    title: 'Guerra Doméstica 2004',
    tropeHeadline: 'Del Odio al Amor / Peleas de Casados',
    synopsis:
      'Como en una comedia romántica de principios de los 2000: discuten por cada taza sucia del estudio, hasta que Renji deja de bromear por un segundo y deja a Kazuha completamente mudo.',
    stageNames: [
      'I. Gritos en el Pasillo',
      'II. Apuestas Absurdas',
      'III. Silencio Inesperado',
      'IV. Celos Mal Disimulados',
      'V. Rendición Total',
    ],
  },
  'vesper-renji': {
    id: 'vesper-renji',
    charA: 'vesper',
    charB: 'renji',
    title: 'El Cuarto Acto Improvisado',
    tropeHeadline: 'El Intocable con Máscara × El Único que le Arruina el Guion',
    synopsis:
      'Vesper controla cada centímetro de su espacio personal. Renji invade ese espacio con una caja de leche de frutilla y la mirada peligrosamente fija en los labios visibles bajo la máscara.',
    stageNames: [
      'I. Guion Saboteado',
      'II. Distancia Ilegal',
      'III. El Broche Suelto',
      'IV. Detrás del Telón',
      'V. Fuera de Personaje',
    ],
  },
  'kazuha-vesper': {
    id: 'kazuha-vesper',
    charA: 'kazuha',
    charB: 'vesper',
    title: 'Orgullo de Porcelana y Fuego',
    tropeHeadline: 'Dos Dominantes que se Niegan a Ceder',
    synopsis:
      'Vesper arrienda un teatro viejo y lo ordena de a cuatro. El teatro ya tiene guardián, y Kazuha lo desordena por siglo cada noche. Una guerra de cartas cada vez más corteses y más venenosas.',
    stageNames: [
      'I. Territorio Dividido',
      'II. Duelo de Miradas',
      'III. Guantes de Seda',
      'IV. Orgullo Roto',
      'V. Tregua Privada',
    ],
  },
  'noctis-renji': {
    id: 'noctis-renji',
    charA: 'noctis',
    charB: 'renji',
    title: 'Ruido Blanco para Dormir',
    tropeHeadline: 'Sol de Mediodía × Luna de Medianoche',
    synopsis:
      'Renji usa el humor para que Noctis deje de sobrepensar sus dibujos; Noctis es el único que nota cuando la sonrisa de Renji es una armadura.',
    stageNames: [
      'I. Chistes Malos en el Estudio',
      'II. Audífonos Compartidos',
      'III. Siesta en el Hombro',
      'IV. La Verdad sin Chistes',
      'V. Refugio Mutuo',
    ],
  },
};

// Los capítulos viven en src/data/historias/<pareja>.ts. Esta lista queda vacía a propósito.
export const INITIAL_CHAPTERS: BLChapter[] = [];

// Parejas con temporada escrita a mano (cada una en su archivo de src/data/historias).
// Para sumar una pareja o una temporada nueva basta con agregarla aquí.
export const HISTORIAS: Partial<Record<ShipId, BLChapter[]>> = {
  'kazuha-renji': TEMPORADA_KAZUHA_RENJI,
  'noctis-vesper': TEMPORADA_NOCTIS_VESPER,
  'kazuha-noctis': TEMPORADA_KAZUHA_NOCTIS,
  'vesper-renji': TEMPORADA_VESPER_RENJI,
  'kazuha-vesper': TEMPORADA_KAZUHA_VESPER,
  'noctis-renji': TEMPORADA_NOCTIS_RENJI,
};
// Portada que se muestra cuando ya leyó todos los capítulos escritos de una pareja.
const ESPERAS: Partial<Record<ShipId, BLChapter>> = {
  'kazuha-renji': ESPERA_KAZUHA_RENJI,
  'noctis-vesper': ESPERA_NOCTIS_VESPER,
  'kazuha-noctis': ESPERA_KAZUHA_NOCTIS,
  'vesper-renji': ESPERA_VESPER_RENJI,
  'kazuha-vesper': ESPERA_KAZUHA_VESPER,
  'noctis-renji': ESPERA_NOCTIS_RENJI,
};

export function getOrGenerateChapter(
  shipId: ShipId,
  chapterIndex: number,
  domain: 'pieza' | 'universidad'
): BLChapter {
  const escrita = HISTORIAS[shipId];
  if (escrita) {
    return escrita[chapterIndex] ?? ESPERAS[shipId] ?? escrita[escrita.length - 1];
  }

  const existingForShip = INITIAL_CHAPTERS.filter((c) => c.shipId === shipId);
  if (existingForShip[chapterIndex]) {
    return existingForShip[chapterIndex];
  }

  const ship = SHIPS[shipId];
  const charA = CHARACTERS[ship.charA];
  const charB = CHARACTERS[ship.charB];
  const epNum = chapterIndex + 1;
  const epLabel = String(epNum).padStart(2, "0");

  const isPieza = domain === 'pieza';

  const scenarios = [
    {
      titlePieza: `Episodio ${epLabel}: Atrapados Entre Cajas y Ropa a Medianoche`,
      titleUni: `Episodio ${epLabel}: Audífonos Compartidos en la Entrega Nocturna`,
      tropePieza: 'Proximidad Forzada en la Pieza',
      tropeUni: 'Desvelo en el Estudio',
      lineA: isPieza
        ? `Cuidado donde pisas, ${charB.name}... si te apoyas en esa pila nos vamos a caer los dos.`
        : `No cierres el programa todavía, ${charB.name}... quédate a mi lado solo cinco minutos más.`,
      lineB: isPieza
        ? `Demasiado tarde. Y honestamente... no tengo ninguna prisa por levantarme de aquí.`
        : `Si me sigues mirando así en vez de mirar el monitor, no vamos a terminar nunca.`,
    },
    {
      titlePieza: `Episodio ${epLabel}: La Prenda Equivocada y el Silencio en la Cama`,
      titleUni: `Episodio ${epLabel}: Mano sobre Mano en la Tableta Gráfica`,
      tropePieza: 'Tensión Doméstica',
      tropeUni: 'Pulso Compartido a las 3 AM',
      lineA: isPieza
        ? `Oye... esa camisa que tienes en la mano es mía, ${charB.name}. ¿Desde cuándo la tenías tú?`
        : `Tu mano está temblando por el cansancio, ${charB.name}. Déjame sostenerte la muñeca para este trazo.`,
      lineB: isPieza
        ? `No preguntes cosas cuya respuesta te va a hacer sonrojar hasta las orejas.`
        : `Si me agarras la mano por detrás así, ¿cómo esperas que mire la línea de tiempo?`,
    },
    {
      titlePieza: `Episodio ${epLabel}: Lluvia Afuera y Una Sola Manta Limpia`,
      titleUni: `Episodio ${epLabel}: Renderizando a Oscuras en el Mismo Sillón`,
      tropePieza: 'Tormenta y Refugio',
      tropeUni: 'Confesión Mientras Renderiza',
      lineA: isPieza
        ? `Ya despejamos la cama... pero hace demasiado frío para que te vayas a tu lado del cuarto.`
        : `El render va a tardar diez minutos. No te atrevas a mover el hombro que estoy cómodo apoyado en ti.`,
      lineB: isPieza
        ? `¿Me estás pidiendo que me quede? Dilo mirándome a los ojos.`
        : `Llevas media hora fingiendo que tienes sueño solo para abrazarme el brazo.`,
    },
  ];

  const sc = scenarios[chapterIndex % scenarios.length];
  const scenarioTitle = isPieza ? sc.titlePieza : sc.titleUni;

  return {
    id: `${shipId}-ep-${epNum}`,
    shipId,
    chapterNumber: epNum,
    title: scenarioTitle,
    subtitle: isPieza
      ? 'Ordenar un espacio pequeño entre dos siempre reduce la distancia a cero.'
      : 'La luz del monitor de madrugada hace que cualquier roce parezca una confesión.',
    contextTrigger: domain,
    tropeTag: isPieza ? sc.tropePieza : sc.tropeUni,
    cliffhangerPreview: {
      speakerA: charA.id,
      lineA: sc.lineA,
      speakerB: charB.id,
      lineB: sc.lineB,
      narratorHook: `${charA.name} y ${charB.name} quedan a centímetros de distancia en silencio. Completa tu bloque de 5 minutos para leer todo el capítulo.`,
    },
    beats: [
      {
        id: `${shipId}-ep${epNum}-b1`,
        speaker: 'narrator',
        spokenText: isPieza
          ? `Habían empezado despejando solo una esquina de la habitación para que fuera más fácil respirar, pero el espacio entre la cama y el escritorio era demasiado estrecho para los dos.`
          : `El ventilador del computador zumbaba suave mientras avanzaban el proyecto. El cansancio de la noche había bajado todas las defensas habituales entre ${charA.name} y ${charB.name}.`,
      },
      {
        id: `${shipId}-ep${epNum}-b2`,
        speaker: charA.id,
        expression: 'look-away',
        spokenText: isPieza
          ? `Te dije que yo recogía esta parte solo... Cuando estás tan cerca me distraigo y olvido qué iba a guardar primero.`
          : `A veces siento que hay demasiadas cosas que hacer antes de empezar... pero cuando te sientas al lado mío el ruido mental se apaga.`,
        hiddenThought: `Tiene el cuello descubierto a un palmo de mi vista. No sé dónde poner las manos.`,
      },
      {
        id: `${shipId}-ep${epNum}-b3`,
        speaker: charB.id,
        expression: 'smirk',
        spokenText: isPieza
          ? `¿Ah, sí? Entonces supongo que soy una distracción necesaria. Dame eso que tienes en la mano antes de que vuelvas a sobrepensar.`
          : `No tienes que ordenar todo el universo hoy. Solo concéntrate en mi voz y en el próximo minuto.`,
        hiddenThought: `La excusa de ayudarlo con el trabajo ya no me la creo ni yo mismo.`,
        stageDirection: `${charB.name} acorta el último paso que los separaba, apoyando una mano en el respaldo junto a la nuca de ${charA.name}.`,
      },
      {
        id: `${shipId}-ep${epNum}-b4`,
        speaker: charA.id,
        expression: 'blush',
        spokenText: `${charB.name}... tu respiración me está dando directo en la mejilla. Así no puedo concentrarme.`,
        hiddenThought: `Por favor que no se aleje todavía.`,
      },
      {
        id: `${shipId}-ep${epNum}-b5`,
        speaker: charB.id,
        expression: 'intense',
        spokenText: `Bien. Porque no quiero que pienses en nada más que en nosotros dos ahora mismo.`,
        hiddenThought: `Cinco minutos más y le digo todo lo que me llevo guardando desde el primer capítulo.`,
      },
    ],
    choicePrompt: `La distancia entre ${charA.name} y ${charB.name} desapareció por completo en el Episodio ${epNum}. ¿Cómo reacciona ${charA.name}?`,
    choices: [
      {
        id: `${shipId}-ep${epNum}-c1`,
        label: `${charA.name} entrelaza sus dedos con los de ${charB.name} y le sostiene la mirada de frente`,
        tone: 'tension',
        chemistryDelta: 30,
        followUpBeats: [
          {
            id: `${shipId}-ep${epNum}-c1-1`,
            speaker: charA.id,
            expression: 'blush',
            spokenText: `Entonces no me sueltes la mano hasta que terminemos la próxima ronda.`,
            hiddenThought: `Mis dedos encajan con los suyos como si lleváramos meses haciendo esto.`,
          },
          {
            id: `${shipId}-ep${epNum}-c1-2`,
            speaker: charB.id,
            expression: 'blush',
            spokenText: `...Ni aunque me lo pidieras.`,
            hiddenThought: `Me acaba de dejar sin aire.`,
          },
        ],
      },
      {
        id: `${shipId}-ep${epNum}-c2`,
        label: `Apoyar la frente cansada en el hombro de ${charB.name} dejando escapar un suspiro suave`,
        tone: 'tierno',
        chemistryDelta: 25,
        followUpBeats: [
          {
            id: `${shipId}-ep${epNum}-c2-1`,
            speaker: charB.id,
            expression: 'blush',
            spokenText: `Descansa un segundo aquí conmigo. Ya hicimos la parte más difícil, que era empezar.`,
            hiddenThought: `Le estoy acariciando la nuca casi por instinto.`,
          },
          {
            id: `${shipId}-ep${epNum}-c2-2`,
            speaker: charA.id,
            expression: 'smirk',
            spokenText: `Tu corazón va rapidísimo, ${charB.name}... y luego dices que el nervioso soy yo.`,
          },
        ],
      },
    ],
    nextCliffhangerTeaser: `En el Episodio ${String(epNum + 1).padStart(2, "0")} de ${ship.title}: la tensión sube al siguiente nivel cuando quedan a solas después de medianoche.`,
  };
}

// ================= SECRET 3 AM CHATS & SKETCHBOOK LOGS =================
export const SECRET_LOGS: SecretLog[] = [
  ...SECRETOS_KAZUHA_RENJI,
  ...SECRETOS_NOCTIS_VESPER,
  ...SECRETOS_KAZUHA_NOCTIS,
  ...SECRETOS_VESPER_RENJI,
  ...SECRETOS_KAZUHA_VESPER,
  ...SECRETOS_NOCTIS_RENJI,
];

// ================= TROPE CARDS (CARTAS DE SITUACION BL) =================
export const TROPE_CARDS: TropeCard[] = [
  {
    id: 'trope-rain',
    title: 'Corte de Luz y Lluvia en el Estudio',
    tag: 'Clásico Slow Burn',
    description: 'Se corta la electricidad en pleno aguacero. Solo queda la luz del celular y una sola manta en el sillón.',
    costPlumas: 20,
    customSceneGenerator: (charA, charB, domain) => ({
      id: `trope-rain-${charA.id}-${charB.id}-${Date.now()}`,
      shipId: `${charA.id}-${charB.id}` as ShipId,
      chapterNumber: 99,
      title: 'Especial de Tropo: Corte de Luz a Medianoche',
      subtitle: 'Cuando los monitores se apagan, ya no queda ninguna excusa para mirar a otro lado.',
      contextTrigger: domain,
      tropeTag: 'Atrapados por la Tormenta',
      cliffhangerPreview: {
        speakerA: charA.id,
        lineA: 'Se apagó todo el edificio... no veo nada.',
        speakerB: charB.id,
        lineB: 'No te muevas. Quédate donde estás, sigo el sonido de tu voz.',
        narratorHook: 'Escena especial invocada con tu Carta de Tropo.',
      },
      beats: [
        {
          id: 'tr-1',
          speaker: 'narrator',
          spokenText: 'Un trueno hace vibrar los cristales de la ventana y, de golpe, todas las pantallas y lámparas se apagan. El cuarto queda sumergido en penumbra azulada.',
        },
        {
          id: 'tr-2',
          speaker: charA.id,
          expression: 'shock',
          spokenText: `¿${charB.name}? Se cortó la luz... Cuidado con las cosas del piso, no des un paso en falso.`,
          hiddenThought: 'En la oscuridad su voz suena el doble de cerca.',
        },
        {
          id: 'tr-3',
          speaker: charB.id,
          expression: 'intense',
          spokenText: `Ya te encontré. Tienes los hombros tensos... ven acá, hace frío ahora que se apagó la calefacción.`,
          hiddenThought: 'Mis manos encontraron su cintura a la primera, como si la conociera de memoria.',
          stageDirection: `${charB.name} rodea a ${charA.id === 'kazuha' ? 'Kazuha' : charA.name} con la única manta del estudio, atrayéndolo contra su pecho en el sillón.`,
        },
        {
          id: 'tr-4',
          speaker: charA.id,
          expression: 'blush',
          spokenText: `Si nos sentamos así bajo la misma manta... puedo escuchar tus latidos contra mi espalda.`,
          hiddenThought: 'Ojalá la luz tarde al menos una hora en volver.',
        },
      ],
      choicePrompt: 'La lluvia golpea el vidrio mientras comparten la única manta. ¿Qué pasa en la oscuridad?',
      choices: [
        {
          id: 'tr-c1',
          label: 'Girarse dentro de la manta hasta quedar frente a frente respirando el mismo aire',
          tone: 'tension',
          chemistryDelta: 35,
          followUpBeats: [
            {
              id: 'tr-c1-1',
              speaker: charB.id,
              expression: 'blush',
              spokenText: 'Menos mal que está oscuro... porque no podría disimular cómo te estoy mirando ahora.',
            },
          ],
        },
      ],
      nextCliffhangerTeaser: 'La electricidad regresa justo cuando sus frentes se estaban tocando.',
    }),
  },
  {
    id: 'trope-mask',
    title: 'El Hilo Suelto / Demasiado Cerca',
    tag: 'Alta Tensión',
    description: 'Uno tiene que quedarse completamente inmóvil mientras el otro le arregla el cuello, el pelo o el borde de la máscara.',
    costPlumas: 20,
    customSceneGenerator: (charA, charB, domain) => ({
      id: `trope-mask-${charA.id}-${charB.id}-${Date.now()}`,
      shipId: `${charA.id}-${charB.id}` as ShipId,
      chapterNumber: 99,
      title: 'Especial de Tropo: Prohibido Parpadear',
      subtitle: 'Diez centímetros de distancia y un nudo que se resiste a soltarse.',
      contextTrigger: domain,
      tropeTag: 'Cercanía Extrema',
      cliffhangerPreview: {
        speakerA: charA.id,
        lineA: 'Si te mueves ahora te voy a tirar del pelo sin querer...',
        speakerB: charB.id,
        lineB: 'No me estoy moviendo. Eres tú a quien le tiemblan los dedos contra mi nuca.',
        narratorHook: 'Escena especial invocada con tu Carta de Tropo.',
      },
      beats: [
        {
          id: 'tm-1',
          speaker: 'narrator',
          spokenText: `Durante la pausa de cinco minutos, un mechón rebelde y el broche del cuello quedaron enganchados. ${charA.name} tuvo que acercarse para destrabarlo.`,
        },
        {
          id: 'tm-2',
          speaker: charA.id,
          expression: 'blush',
          spokenText: `No respires tan hondo, ${charB.name}... casi lo tengo, pero necesito usar las dos manos.`,
          hiddenThought: 'Tengo sus labios literalmente a la altura de mi clavícula.',
        },
        {
          id: 'tm-3',
          speaker: charB.id,
          expression: 'smirk',
          spokenText: `Tómate todo el tiempo del mundo. La vista desde aquí abajo es excelente.`,
          hiddenThought: 'Huele tan bien de cerca que estoy a punto de enredar el broche aún más a propósito.',
        },
      ],
      choicePrompt: 'El nudo cede de golpe, dejando sus manos apoyadas en el cuello de su compañero.',
      choices: [
        {
          id: 'tm-c1',
          label: 'No retirar las manos del cuello y sostenerle la mirada en silencio',
          tone: 'tension',
          chemistryDelta: 35,
          followUpBeats: [
            {
              id: 'tm-c1-1',
              speaker: charA.id,
              expression: 'intense',
              spokenText: 'Ya está suelto... pero todavía no te di permiso de alejarte.',
            },
          ],
        },
      ],
      nextCliffhangerTeaser: 'Sus dedos quedan marcados de calor en la piel del otro.',
    }),
  },
  {
    id: 'trope-pose',
    title: 'Posar como Modelo de Anatomía a Solas',
    tag: 'Especial Animación & Arte',
    description: 'Para destrabar un dibujo o storyboard de la U, uno de los chicos ofrece sus propias manos y postura como referencia en vivo.',
    costPlumas: 20,
    customSceneGenerator: (charA, charB, domain) => ({
      id: `trope-pose-${charA.id}-${charB.id}-${Date.now()}`,
      shipId: `${charA.id}-${charB.id}` as ShipId,
      chapterNumber: 99,
      title: 'Especial de Tropo: Referencia en Vivo',
      subtitle: 'Estudiar la línea del cuello y las manos de alguien a quien no puedes ver solo como amigo.',
      contextTrigger: domain,
      tropeTag: 'Modelo Privado en el Taller',
      cliffhangerPreview: {
        speakerA: charB.id,
        lineA: 'Deja de buscar fotos en internet. Mírame a mí y corrígeme la pose con tus manos.',
        speakerB: charA.id,
        lineB: 'Si te desabrochas el primer botón del cuello para que vea la clavícula, me vas a matar de un infarto.',
        narratorHook: 'Escena especial invocada con tu Carta de Tropo.',
      },
      beats: [
        {
          id: 'tp-1',
          speaker: 'narrator',
          spokenText: `La pose clave del storyboard no salía bien. ${charB.name} cerró el buscador de referencias y se subió al borde de la mesa bajo la luz lateral.`,
        },
        {
          id: 'tp-2',
          speaker: charB.id,
          expression: 'smirk',
          spokenText: `¿Qué ángulo necesitas dibujar? ¿El giro de los hombros o cómo apoyo la mano cuando te miro así?`,
          hiddenThought: 'Cualquier excusa es buena para que me mire sin apartar los ojos durante diez minutos seguidos.',
        },
        {
          id: 'tp-3',
          speaker: charA.id,
          expression: 'blush',
          spokenText: `Necesito... ajustar el ángulo de tu mentón. Permiso.`,
          hiddenThought: 'Se me secó la garganta apenas mis dedos tocaron su mandíbula.',
          stageDirection: `${charA.name} se acerca y le inclina suavemente el rostro hacia la luz con la yema de los dedos.`,
        },
      ],
      choicePrompt: 'Mientras ajusta la pose, sus miradas se cruzan a pocos centímetros.',
      choices: [
        {
          id: 'tp-c1',
          label: 'Dejar el lápiz sobre la mesa porque la referencia real es demasiado tentadora',
          tone: 'tension',
          chemistryDelta: 35,
          followUpBeats: [
            {
              id: 'tp-c1-1',
              speaker: charB.id,
              expression: 'blush',
              spokenText: 'Oye... soltaste el lápiz. Creo que la clase de anatomía acaba de cambiar de tema.',
            },
          ],
        },
      ],
      nextCliffhangerTeaser: 'El boceto quedó a medias, pero ninguno de los dos se arrepiente.',
    }),
  },
];

// ================= ANTI-PARALYSIS MICRO-MISSIONS =================
// Strictly 3-5 minutes, 1 single concrete step so she NEVER freezes from "I have to do X first"!
export const MICRO_MISSIONS: MicroMission[] = [
  // --- MODO MI PIEZA ---
  {
    id: 'pieza-tazas',
    domain: 'pieza',
    category: 'Rescate de Escritorio',
    title: 'Operación 4 Objetos Fuera',
    durationMinutes: 3,
    actionInstruction:
      'Ignora el resto de la pieza. Toma únicamente las tazas, vasos, platos o envases vacíos que veas y llévalos a la cocina o a una bolsa. Prohibido ordenar ropa o papeles todavía.',
    whyItWorks:
      'Cuando limpias para tu mamá o los gatos te resulta fácil porque tiene un límite claro. Sacar solo los vasos tarda 3 minutos y despeja el 50% del ruido visual.',
    characterIntro: {
      noctis: 'Hagamos espacio solo alrededor de tu mesa para que puedas respirar. Yo te espero aquí.',
      vesper: 'El Acto I exige retirar exactamente cuatro elementos que rompan la armonía de tu escritorio. Ejecuta.',
      kazuha: 'Ni se te ocurra mirar el clóset todavía. Dame esas tazas vacías primero, humana desordenada.',
      renji: 'Si sacamos los vasos con restos de café de hace dos días ya cuenta como victoria épica. Vamos.',
    },
  },
  {
    id: 'pieza-ropa-cama',
    domain: 'pieza',
    category: 'Caos de Ropa',
    title: 'La Isla de las 5 Prendas',
    durationMinutes: 4,
    actionInstruction:
      'No separes ni dobles toda tu ropa hoy. Elige SOLO 5 prendas que estén encima de tu cama o de tu silla y ponlas en el canasto o colgadas. Cuando llegues a 5, tienes permiso oficial de parar.',
    whyItWorks:
      'Tu cerebro se bloquea porque cree que para mover una polera primero tienes que ordenar todo el clóset. Mover solo 5 prendas rompe esa mentira en 4 minutos.',
    characterIntro: {
      noctis: 'Cinco prendas nada más. No pienses en dónde va el resto todavía.',
      vesper: 'Cuatro prendas más una de gracia. Ni una más. Mantén la elegancia del movimiento.',
      kazuha: 'Despeja solo el pedazo de cama donde te vas a sentar. Yo vigilo que no te abrumes con el resto.',
      renji: 'Agarra 5 trapos, tíralos donde correspondan y cobramos el capítulo del BL. Trato redondo.',
    },
  },
  {
    id: 'pieza-superficie-cero',
    domain: 'pieza',
    category: 'Bloqueo Total',
    title: 'Despeje de 30 Centímetros',
    durationMinutes: 3,
    actionInstruction:
      'Despeja únicamente el espacio exacto donde van tu teclado, tu tableta gráfica o tus manos en el escritorio (empujando lo demás a una cajita temporal si hace falta).',
    whyItWorks:
      'No necesitas la pieza entera impecable para funcionar: solo necesitas un rectángulo libre frente a tus ojos.',
    characterIntro: {
      noctis: 'Un lienzo limpio empieza por despejar el rincón donde apoyas las muñecas.',
      vesper: 'Prepara el escenario principal. Lo que quede fuera del reflector no existe por ahora.',
      kazuha: 'Ven, hagamos solo un huequito limpio en tu mesa. El resto lo vemos otro día.',
      renji: 'Técnica secreta de estudio de animación: si cabe el mouse y la tableta, el escritorio está oficialmente listo.',
    },
  },
  {
    id: 'pieza-basura-express',
    domain: 'pieza',
    category: 'Ruleta Express',
    title: 'Cacería de Papeles y Envoltorios',
    durationMinutes: 3,
    actionInstruction:
      'Toma una bolsita pequeña y recoge solo papeles, etiquetas, servilletas o envoltorios que estén a la vista durante 3 minutos. Cero decisiones difíciles.',
    whyItWorks:
      'La basura no requiere decidir dónde guardarla: va directo a la bolsa y libera dopamina instantánea.',
    characterIntro: {
      noctis: 'Quitemos el ruido pequeño primero, sin pensar en ordenar cajones.',
      vesper: 'Eliminemos lo superfluo en tres minutos exactos.',
      kazuha: 'Yo sostengo la bolsa, tú solo mete todo lo que no sirva sin pensarlo dos veces.',
      renji: 'Speedrun de basura en 3 minutos. Chat, pongan el cronómetro.',
    },
  },

  // --- MODO UNIVERSIDAD (ANIMACION DIGITAL / 3D / STORYBOARD / PORTAFOLIO) ---
  {
    id: 'uni-storyboard',
    domain: 'universidad',
    category: 'storyboard',
    title: 'Storyboard: Los 3 Cuadrados Feos',
    durationMinutes: 5,
    actionInstruction:
      'Abre el programa (o una hoja), guarda el archivo con nombre y dibuja SOLO 3 rectángulos con monigotes de palitos ultra feos para las primeras 3 viñetas. Prohibido hacer líneas limpias hoy.',
    whyItWorks:
      'El bloqueo en Storyboard viene de querer que la primera viñeta quede bien dibujada. Hacer 3 mamarrachos de palitos en 5 minutos apaga al crítico interno y te mete en flow.',
    characterIntro: {
      noctis: 'El primer trazo no tiene que ser hermoso, solo tiene que existir. Haz tres cuadros sueltos conmigo.',
      vesper: 'Todo acto dramático comienza con marcas de posición en el escenario. Traza los primeros recuadros.',
      kazuha: 'Nada de borrar veinte veces. Dibuja tres muñecos de palitos ahora mismo y te doy tu recompensa.',
      renji: 'Haz los monigotes más deformes de la historia de tu carrera. En 5 minutos ya venciste a la hoja en blanco.',
    },
  },
  {
    id: 'uni-modelado3d',
    domain: 'universidad',
    category: 'modelado3d',
    title: 'Modelado 3D: El Ritual del Cubo Base',
    durationMinutes: 5,
    actionInstruction:
      'Solo abre Blender/Maya/ZBrush, guarda el archivo como "Avance_01", importa 1 imagen de referencia y pon la primitiva base (cubo o esfera) en posición. Si al sonar los 5 min quieres cerrar, ¡ya ganaste!',
    whyItWorks:
      'Como tú misma dijiste: una vez que empiezas a trabajar ya fluyes bien; lo que cuesta es abrir el programa sin abrumarte con todo el modelo.',
    characterIntro: {
      noctis: 'Abrir el visor 3D es la mitad de la batalla. Pon solo la forma base y respira.',
      vesper: 'Coloca el bloque primordial en escena. No esculpas el detalle antes de tiempo.',
      kazuha: 'Abre el programa sin pensar en la entrega entera. Cinco minutos poniendo la base y listo.',
      renji: 'Abrir Blender sin llorar ya convalida medio ramo. Pon un cubo, muévelo dos centímetros y celebramos.',
    },
  },
  {
    id: 'uni-animacion',
    domain: 'universidad',
    category: 'animacion',
    title: 'Animación: Solo Pose A y Pose B',
    durationMinutes: 5,
    actionInstruction:
      'Olvida el in-betweening, las curvas y el timing perfecto. En estos 5 minutos solo marca la Pose Inicial (Keyframe 1) y la Pose Final (Keyframe 2) de un solo segundo de acción.',
    whyItWorks:
      'Pensar en animar toda la escena paraliza. Poner solo 2 poses extremas en la línea de tiempo activa tu cerebro de animadora de inmediato.',
    characterIntro: {
      noctis: 'Dos instantes congelados en el tiempo. No pienses en los fotogramas intermedios todavía.',
      vesper: 'El inicio y el clímax del gesto. Marca solo esos dos cuadros en la línea de tiempo.',
      kazuha: 'Solo dos poses clave, ¿me oyes? No intentes hacer toda la escena de golpe.',
      renji: 'Keyframe 1, Keyframe 2, y que el computador sufra después. Vamos con esos 5 minutos.',
    },
  },
  {
    id: 'uni-ilustracion',
    domain: 'universidad',
    category: 'ilustracion',
    title: 'Dibujo / Ilustración: Mancha de Color Cero',
    durationMinutes: 5,
    actionInstruction:
      'Crea el lienzo, ponle un color de fondo que no sea blanco puro, y con un pincel gigante (sin hacer zoom) tira las manchas generales de silueta o gesto durante 5 minutos.',
    whyItWorks:
      'Prohibir el zoom durante los primeros 5 minutos evita que te quedes pegada corrigiendo un ojo antes de tener la pose.',
    characterIntro: {
      noctis: 'Mata el blanco del lienzo primero. Con un fondo suave, la mano deja de tener miedo.',
      vesper: 'Mancha el escenario con trazos amplios. La precisión vendrá en el segundo acto.',
      kazuha: 'Aleja el zoom y suelta la muñeca cinco minutos. Yo te cuento el tiempo.',
      renji: 'Pincel tamaño monstruo y prohibido hacer Control+Z por cinco minutos. ¡A manchar!',
    },
  },
  {
    id: 'uni-portafolio',
    domain: 'universidad',
    category: 'portafolio',
    title: 'Portafolio: La Carpeta de 3 Archivos',
    durationMinutes: 4,
    actionInstruction:
      'No diseñes ni edites el portafolio hoy. Solo crea una carpeta nueva en el escritorio llamada "Seleccion_Portafolio" y arrastra adentro 3 renders, dibujos o videos que ya tengas hechos.',
    whyItWorks:
      '"Hacer el portafolio" suena gigante y abstracto. Reunir 3 archivos que ya existen en una carpeta tarda 4 minutos y te da la base lista.',
    characterIntro: {
      noctis: 'Ya tienes obras hermosas hechas. Hoy solo juntemos tres en un mismo lugar.',
      vesper: 'Toda galería comienza seleccionando las primeras piezas de exhibición.',
      kazuha: 'No tienes que armar toda la página hoy. Solo mete tres trabajos en una carpeta y cumpliste.',
      renji: 'Crear carpeta -> Arrastrar 3 archivos -> Cobrar capítulo BL. La jugada maestra.',
    },
  },
];

// Live studio banter between the two active characters while the 5-minute timer is running!
export function getLiveTimerBanter(
  charA: CharacterProfile,
  charB: CharacterProfile,
  domain: 'pieza' | 'universidad'
): Array<{ speaker: CharacterProfile; line: string }> {
  return [
    {
      speaker: charA,
      line:
        domain === 'pieza'
          ? 'No mires el resto de la habitación. Concéntrate solo en esta micro-misión con nosotros.'
          : 'Ya hiciste lo más difícil: abrir el trabajo y partir. Mantén el ritmo suave.',
    },
    {
      speaker: charB,
      line: `Oye, ${charA.name}... deja de mirarme de reojo mientras le llevamos el tiempo a ella.`,
    },
    {
      speaker: charA,
      line: `No te estaba mirando a ti, ${charB.name}. Estaba viendo que no te acerques tanto a mi silla...`,
    },
    {
      speaker: charB,
      line: 'Quedan pocos minutos en el reloj. Terminemos este bloque para mostrarle qué pasó entre nosotros anoche.',
    },
    {
      speaker: charA,
      line: '¡Cállate! No le adelantes el capítulo mientras está concentrada trabajando.',
    },
  ];
}
