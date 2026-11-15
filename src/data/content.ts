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
      'Vesper exige perfección absoluta tras su máscara de porcelana, pero pierde la compostura cada vez que las manos manchadas de tinta de Noctis rozan su rostro.',
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
      'Noctis olvida comer, abrigarse y dormir cuando dibuja. Kazuha jura que lo cuida solo porque le molesta el desorden, pero sus orejas de zorro lo delatan cada vez que Noctis le sonríe.',
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
      'Ninguno de los dos acepta órdenes del otro. Cuando se quedan encerrados ordenando el estudio, cada roce de guante y garra se convierte en un duelo de tensión pura.',
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

export const INITIAL_CHAPTERS: BLChapter[] = [
  // ================= NOCTIS x VESPER =================
  {
    id: 'nv-ch1',
    shipId: 'noctis-vesper',
    chapterNumber: 1,
    title: 'Episodio 01: La Corrección del Cuarto Trazo',
    subtitle: 'El olor a trementina y el frío de la porcelana a medianoche.',
    contextTrigger: 'any',
    tropeTag: 'Espacio Personal Invadido',
    cliffhangerPreview: {
      speakerA: 'vesper',
      lineA: 'Tu muñeca está rígida, Noctis. Si sigues dudando antes de tocar el lienzo, tendré que sostenerte la mano yo mismo.',
      speakerB: 'noctis',
      lineB: 'Vesper... estás tan cerca que tu máscara me está rozando la sien.',
      narratorHook: 'Vesper apoya los dedos enguantados sobre el dorso manchado de tinta de Noctis. Completa 5 minutos de arranque para destrabar la escena completa.',
    },
    beats: [
      {
        id: 'nv1-1',
        speaker: 'narrator',
        spokenText: 'Pasan de las once de la noche en el taller. Una sola lámpara ilumina la mesa de trabajo mientras afuera cae una llovizna fina.',
      },
      {
        id: 'nv1-2',
        speaker: 'noctis',
        expression: 'look-away',
        spokenText: 'Sabía que seguías aquí... Haces demasiado silencio al caminar, Vesper. Casi pareces un fantasma detrás del caballete.',
        hiddenThought: 'Lleva veinte minutos mirándome desde el marco de la puerta. Tengo el pulso acelerado desde que entró.',
        stageDirection: 'Noctis aprieta el pincel con los dedos manchados de azul índigo sin girar del todo.',
      },
      {
        id: 'nv1-3',
        speaker: 'vesper',
        expression: 'smirk',
        spokenText: 'Conté exactamente cuatro suspiros tuyos en tres minutos. Una cadencia trágica, incluso para ti. ¿Por qué no has trazado la línea base?',
        hiddenThought: 'Tiene un mechón de pelo pegado a la mejilla con acuarela seca. Si estiro la mano ahora, ¿se apartará o se quedará quieto?',
        stageDirection: 'El borde dorado de su media máscara refleja la luz tibia del monitor.',
      },
      {
        id: 'nv1-4',
        speaker: 'noctis',
        expression: 'blush',
        spokenText: 'Porque si arruino el primer trazo, toda la estructura se cae... Es ridículo, lo sé. A veces miro el desorden de la mesa y me congelo antes de partir.',
        hiddenThought: 'Por favor no te acerques más... huele a madera de sándalo y lluvia fría.',
      },
      {
        id: 'nv1-5',
        speaker: 'vesper',
        expression: 'intense',
        spokenText: 'El miedo al primer movimiento es el único pecado que no tolero en mi escenario. Permíteme.',
        hiddenThought: 'Su piel arde a través del cuero de mi guante. Está temblando, pero no me está pidiendo que me aleje.',
        stageDirection: 'Vesper se inclina por detrás de la silla de Noctis, rodeando sus hombros hasta cubrir la mano de Noctis con la suya.',
      },
      {
        id: 'nv1-6',
        speaker: 'noctis',
        expression: 'shock',
        spokenText: 'Espera... Vesper, si te inclinas así no puedo ver la pantalla. Tu máscara... está fría contra mi cuello.',
        hiddenThought: 'Su respiración está justo debajo de mi oído. Se me olvidó por completo qué estaba intentando dibujar.',
      },
    ],
    choicePrompt: 'La mano enguantada de Vesper sigue cerrándose sobre los dedos de Noctis. ¿Cómo reacciona Noctis?',
    choices: [
      {
        id: 'nv1-c1',
        label: 'Girar el rostro y rozar el borde de la máscara de Vesper con los dedos manchados de pintura',
        tone: 'tension',
        chemistryDelta: 25,
        followUpBeats: [
          {
            id: 'nv1-c1-1',
            speaker: 'noctis',
            expression: 'intense',
            spokenText: 'Siempre te escondes detrás de esta porcelana cuando me corriges... ¿Qué cara estás poniendo ahí debajo ahora mismo?',
            hiddenThought: 'Mis dedos dejaron una marca azul justo en el borde de su mejilla descubierta.',
          },
          {
            id: 'nv1-c1-2',
            speaker: 'vesper',
            expression: 'blush',
            spokenText: '...Cuidado, Noctis. El cuarto acto todavía no empieza, y no respondo de mí si me quitas el broche.',
            hiddenThought: 'Nadie había osado tocar la máscara. Mi corazón acaba de perder la cuenta del compás.',
          },
        ],
      },
      {
        id: 'nv1-c2',
        label: 'Quedarse completamente quieto y dejar que Vesper guíe el trazo respirando bajito',
        tone: 'tierno',
        chemistryDelta: 20,
        followUpBeats: [
          {
            id: 'nv1-c2-1',
            speaker: 'noctis',
            expression: 'blush',
            spokenText: '...Uno, dos, tres, cuatro. ¿Así está bien para tu estándar, director?',
            hiddenThought: 'No quiero que suelte mi mano todavía. Por primera vez en todo el día mi cabeza dejó de hacer ruido.',
          },
          {
            id: 'nv1-c2-2',
            speaker: 'vesper',
            expression: 'smirk',
            spokenText: 'Sublime. Aunque tu pulso sigue peligrosamente rápido. Tendré que quedarme a supervisar el resto de la noche.',
            hiddenThought: 'Excusas. Solo busco cualquier pretexto para no soltarlo.',
          },
        ],
      },
    ],
    nextCliffhangerTeaser: 'En el próximo episodio: Vesper encuentra un boceto oculto en la carpeta de Noctis... y es el rostro de Vesper sin máscara.',
  },

  {
    id: 'nv-ch2',
    shipId: 'noctis-vesper',
    chapterNumber: 2,
    title: 'Episodio 02: El Boceto Prohibido en la Carpeta',
    subtitle: 'Ordenar la mesa juntos siempre revela lo que no debía verse.',
    contextTrigger: 'pieza',
    tropeTag: 'Secreto Descubierto Ordenando',
    cliffhangerPreview: {
      speakerA: 'noctis',
      lineA: '¡No abras ese cuaderno negro, Vesper! Dijimos que solo íbamos a despejar las cajas de la esquina...',
      speakerB: 'vesper',
      lineB: '¿Me dibujaste sin máscara de memoria... o me miraste la noche que me quedé dormido en el sofá?',
      narratorHook: 'Vesper sostiene el croquis a pocos centímetros de sus labios mientras acorrala a Noctis contra el estante. Haz 5 minutos de acción para abrir el capítulo.',
    },
    beats: [
      {
        id: 'nv2-1',
        speaker: 'narrator',
        spokenText: 'El piso del cuarto tenía pilas de hojas sueltas y tazas vacías. Habían acordado despejar solo cuatro cosas antes de descansar.',
      },
      {
        id: 'nv2-2',
        speaker: 'vesper',
        expression: 'neutral',
        spokenText: 'Tres tazas fuera, los cables recogidos... y este cuaderno de cuero caído entre las mantas. Qué descuido tan impropio.',
        hiddenThought: 'Las páginas están gastadas de tanto abrirse en el mismo sitio.',
      },
      {
        id: 'nv2-3',
        speaker: 'noctis',
        expression: 'shock',
        spokenText: 'Dámelo. Ese no es de la entrega de la universidad, es... práctica personal.',
        hiddenThought: 'Se me va a salir el corazón por la boca. Está abierto justo en el carboncillo de anoche.',
        stageDirection: 'Noctis estira el brazo para arrebatárselo, pero tropieza con el borde de la alfombra y Vesper lo sostiene de la cintura con un solo brazo.',
      },
      {
        id: 'nv2-4',
        speaker: 'vesper',
        expression: 'intense',
        spokenText: 'Conque "práctica de anatomía"... Dibujaste la cicatriz fina junto a mi ojo derecho. Eso solo se ve cuando me quito la máscara a menos de diez centímetros.',
        hiddenThought: 'La forma en que sombreó mis pestañas y mi boca... Me mira como si yo fuera algo sagrado.',
      },
    ],
    choicePrompt: 'Vesper tiene a Noctis sujeto por la cintura y el dibujo en la otra mano. ¿Qué hace Noctis?',
    choices: [
      {
        id: 'nv2-c1',
        label: 'Admitir en voz baja que el modelo real es mucho más difícil de dejar de mirar',
        tone: 'tension',
        chemistryDelta: 30,
        followUpBeats: [
          {
            id: 'nv2-c1-1',
            speaker: 'noctis',
            expression: 'blush',
            spokenText: 'El dibujo quedó mal de todas formas... La sombra no le hace justicia a cómo me miras ahora.',
            hiddenThought: 'Ya no tengo dónde esconderme, así que al menos voy a ser honesto.',
          },
          {
            id: 'nv2-c1-2',
            speaker: 'vesper',
            expression: 'blush',
            spokenText: '...Llevaré los dedos a la hebilla de mi máscara. Si quieres corregir el dibujo, vas a tener que mirarme de frente sin parpadear.',
            hiddenThought: 'Me acaba de desarmar con una sola frase.',
          },
        ],
      },
      {
        id: 'nv2-c2',
        label: 'Esconder la cara en el hombro del abrigo de Vesper muerto de vergüenza',
        tone: 'tierno',
        chemistryDelta: 25,
        followUpBeats: [
          {
            id: 'nv2-c2-1',
            speaker: 'noctis',
            expression: 'blush',
            spokenText: 'Cállate y cierra el cuaderno... te prometo que termino de ordenar la mesa si finges que no viste nada.',
            hiddenThought: 'Su abrigo está tibio y su mano en mi cintura acaba de apretar más fuerte en vez de soltarme.',
          },
          {
            id: 'nv2-c2-2',
            speaker: 'vesper',
            expression: 'smirk',
            spokenText: 'Trato rechazado. Este boceto queda confiscado en mi bolsillo interior junto al pecho.',
            hiddenThought: 'No pienso devolverlo jamás.',
          },
        ],
      },
    ],
    nextCliffhangerTeaser: 'Próximo episodio: Un corte de luz deja el estudio a oscuras y Vesper se quita la máscara por primera vez.',
  },

  // ================= KAZUHA x NOCTIS =================
  {
    id: 'kn-ch1',
    shipId: 'kazuha-noctis',
    chapterNumber: 1,
    title: 'Episodio 01: Contrato de Medianoche y Té con Miel',
    subtitle: 'Un guardián kitsune que reniega en voz alta pero abriga en silencio.',
    contextTrigger: 'any',
    tropeTag: 'Cuidado Tsundere Nocturno',
    cliffhangerPreview: {
      speakerA: 'kazuha',
      lineA: '¡Tienes los dedos como témpanos de hielo, idiota! Suelta ese lápiz digital ahora mismo o te confisco la tableta.',
      speakerB: 'noctis',
      lineB: 'Kazuha... si me envuelves las manos así contra tu pecho, tus orejas me están haciendo cosquillas en la barbilla.',
      narratorHook: 'Kazuha se sonroja hasta la punta de las orejas plateadas sin soltar las manos de Noctis. Completa 5 minutos para leer la escena.',
    },
    beats: [
      {
        id: 'kn1-1',
        speaker: 'narrator',
        spokenText: 'El reloj marca la 1:40 AM. Kazuha entra al cuarto sin hacer ruido, llevando una bandeja con té humeante y el ceño fruncido al ver la cama todavía sin tocar.',
      },
      {
        id: 'kn1-2',
        speaker: 'kazuha',
        expression: 'intense',
        spokenText: 'Lo sabía. Dijiste "solo voy a ordenar mis archivos" y llevas media hora mirando la pantalla en blanco con cara de tragedia.',
        hiddenThought: 'Tiene ojeras otra vez. Si no vengo yo a revisarlo, este humano sería capaz de marchitarse frente al escritorio.',
        stageDirection: 'Las orejas de zorro de Kazuha se inclinan hacia atrás con fastidio fingido mientras deja la taza en la mesa.',
      },
      {
        id: 'kn1-3',
        speaker: 'noctis',
        expression: 'look-away',
        spokenText: 'Quería avanzar... pero empecé a pensar en todo lo que tengo atrasado, y antes de eso tenía que despejar la silla, y me bloqueé.',
        hiddenThought: 'Cada vez que Kazuha entra, el cuarto deja de sentirse frío.',
      },
      {
        id: 'kn1-4',
        speaker: 'kazuha',
        expression: 'blush',
        spokenText: 'Suspiro... Eres un caso perdido sin mí. Dame las manos. No me mires con esa cara, es solo para que no te dé un calambre antes de los cinco minutos que vamos a hacer juntos.',
        hiddenThought: 'Están heladas. Voy a tener que calentarlas con mi propio aliento aunque se ría de mí.',
        stageDirection: 'Kazuha se arrodilla junto a la silla de Noctis, toma ambas manos manchadas de grafito y las acerca a sus propios labios para entibiarlas.',
      },
      {
        id: 'kn1-5',
        speaker: 'noctis',
        expression: 'blush',
        spokenText: 'Kazuha... tu cola me acaba de rodear el tobillo debajo de la silla.',
        hiddenThought: 'Siempre actúa como si le molestara cuidarme, pero me sostiene como si yo fuera de cristal.',
      },
    ],
    choicePrompt: 'Kazuha se da cuenta de que su cola delató lo mucho que le gusta estar cerca. ¿Qué pasa ahora?',
    choices: [
      {
        id: 'kn1-c1',
        label: 'Acariciar suavemente la base de las orejas plateadas de Kazuha para agradecerle',
        tone: 'tierno',
        chemistryDelta: 30,
        followUpBeats: [
          {
            id: 'kn1-c1-1',
            speaker: 'kazuha',
            expression: 'shock',
            spokenText: '¡O-oye! ¡Ahí no se toca sin aviso! ...Maldición, no dejes de hacerlo tan rápido tampoco.',
            hiddenThought: 'Si me mira con esa media sonrisa dulce un segundo más, voy a terminar acurrucado en su regazo.',
          },
          {
            id: 'kn1-c1-2',
            speaker: 'noctis',
            expression: 'smirk',
            spokenText: 'Trato hecho: tú te quedas aquí conmigo cinco minutos mientras parto el trabajo, y después te peino el pelo.',
            hiddenThought: 'Tiene las mejillas completamente rojas.',
          },
        ],
      },
      {
        id: 'kn1-c2',
        label: 'Apoyar la frente cansada contra el hombro del haori de Kazuha',
        tone: 'tension',
        chemistryDelta: 25,
        followUpBeats: [
          {
            id: 'kn1-c2-1',
            speaker: 'noctis',
            expression: 'blush',
            spokenText: 'Solo déjame recargar batería treinta segundos así... hueles a hojas de otoño y té dulce.',
          },
          {
            id: 'kn1-c2-2',
            speaker: 'kazuha',
            expression: 'blush',
            spokenText: '...Tonto. Está bien, no me voy a mover a ningún lado. Yo me encargo de vigilar que nada te abrume hoy.',
            hiddenThought: 'Que nadie se atreva a interrumpirnos ahora mismo.',
          },
        ],
      },
    ],
    nextCliffhangerTeaser: 'En el próximo episodio: Ordenando la ropa de la cama, el haori de Kazuha termina sobre los hombros de Noctis... y alguien pierde el equilibrio.',
  },

  // ================= VESPER x RENJI =================
  {
    id: 'vr-ch1',
    shipId: 'vesper-renji',
    chapterNumber: 1,
    title: 'Episodio 01: Sabotaje al Cuarto Acto',
    subtitle: 'El único hombre capaz de hacer reír y temblar al Virtuoso Enmascarado.',
    contextTrigger: 'any',
    tropeTag: 'Tensión y Comedia Peligrosa',
    cliffhangerPreview: {
      speakerA: 'vesper',
      lineA: 'Estás a menos de cuatro pulgadas de mi máscara, Renji. Retrocede antes de que pierda la paciencia.',
      speakerB: 'renji',
      lineB: 'Oblígame, fantasma de la ópera. Tienes una mancha de crema en la comisura del labio y te la voy a quitar yo.',
      narratorHook: 'El pulgar de Renji roza el labio descubierto de Vesper bajo el borde de porcelana. Haz 5 minutos de acción para desbloquear.',
    },
    beats: [
      {
        id: 'vr1-1',
        speaker: 'narrator',
        spokenText: 'Vesper había alineado sus lápices y archivos en simetría perfecta. Renji se sienta en el borde de su escritorio balanceando las piernas.',
      },
      {
        id: 'vr1-2',
        speaker: 'vesper',
        expression: 'intense',
        spokenText: 'Estás invadiendo mi plano escénico. Y esa bebida rosada tuya rompe por completo la paleta cromática de la habitación.',
        hiddenThought: '¿Por qué siempre se sienta tan cerca que puedo sentir el calor de su rodilla contra mi brazo?',
      },
      {
        id: 'vr1-3',
        speaker: 'renji',
        expression: 'smirk',
        spokenText: 'Relaja la pelvis, señor drama. Si te la pasas planificando la sinfonía perfecta en tu cabeza, nunca empezamos el archivo.',
        hiddenThought: 'Todo el mundo le tiene respeto o miedo por la máscara, pero cuando se frustra aprieta la mandíbula de una forma que me encanta.',
      },
      {
        id: 'vr1-4',
        speaker: 'vesper',
        expression: 'look-away',
        spokenText: 'Yo no dudo. Yo calculo cada variable antes de ejecutar...',
      },
      {
        id: 'vr1-5',
        speaker: 'renji',
        expression: 'intense',
        spokenText: 'Pues calcula esta variable.',
        hiddenThought: 'Su piel debajo de la porcelana es mucho más suave de lo que imaginaba.',
        stageDirection: 'Renji se inclina hacia adelante, sujeta la barbilla de Vesper con dos dedos y pasa el pulgar lento por la comisura de su boca.',
      },
      {
        id: 'vr1-6',
        speaker: 'vesper',
        expression: 'blush',
        spokenText: '...¿Qué crees que estás haciendo?',
        hiddenThought: 'No puedo moverme. Me acaba de cortar la respiración en seco.',
      },
    ],
    choicePrompt: 'Vesper tiene la respiración agitada bajo la máscara mientras el pulgar de Renji sigue en su labio. ¿Qué sucede?',
    choices: [
      {
        id: 'vr1-c1',
        label: 'Vesper sujeta la muñeca de Renji y le besa la palma de la mano sin apartar la mirada',
        tone: 'tension',
        chemistryDelta: 30,
        followUpBeats: [
          {
            id: 'vr1-c1-1',
            speaker: 'vesper',
            expression: 'smirk',
            spokenText: 'Si vas a provocarme a mitad del ensayo, al menos sostén la mirada hasta el final, Renji.',
          },
          {
            id: 'vr1-c1-2',
            speaker: 'renji',
            expression: 'blush',
            spokenText: '...Oye, eso es trampa. Se suponía que el que te ponía nervioso era yo.',
            hiddenThought: 'Se me subió toda la sangre a las orejas en medio segundo.',
          },
        ],
      },
      {
        id: 'vr1-c2',
        label: 'Renji sonríe con descaro y le desabrocha un centímetro la cinta trasera de la máscara',
        tone: 'caos',
        chemistryDelta: 25,
        followUpBeats: [
          {
            id: 'vr1-c2-1',
            speaker: 'renji',
            expression: 'smirk',
            spokenText: 'Cinco minutos de avance hoy y me dejas ver el resto de la cara. Trato justo, ¿no?',
          },
          {
            id: 'vr1-c2-2',
            speaker: 'vesper',
            expression: 'blush',
            spokenText: 'Eres insoportable... Empieza el cronómetro antes de que me arrepienta.',
          },
        ],
      },
    ],
    nextCliffhangerTeaser: 'En el próximo episodio: Renji se queda dormido en el sillón y Vesper se quita la máscara creyendo que nadie lo mira.',
  },
];

// Fallback generator for ships or chapters beyond the initial set so EVERY ship and EVERY level has deep, rich multi-beat scenes!
// Parejas con temporada escrita a mano (cada una en su archivo de src/data/historias).
// Para sumar una pareja o una temporada nueva basta con agregarla aquí.
export const HISTORIAS: Partial<Record<ShipId, BLChapter[]>> = {
  'kazuha-renji': TEMPORADA_KAZUHA_RENJI,
};
// Portada que se muestra cuando ya leyó todos los capítulos escritos de una pareja.
const ESPERAS: Partial<Record<ShipId, BLChapter>> = {
  'kazuha-renji': ESPERA_KAZUHA_RENJI,
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
  {
    id: 'log-nv-chat1',
    shipId: 'noctis-vesper',
    title: 'Chat Oculto — 03:14 AM: "Sigues despierto"',
    unlockRequirementSessions: 1,
    type: 'chat-3am',
    summary: 'Lo que Vesper escribió y borró tres veces antes de mandarle un mensaje a Noctis desde la habitación contigua.',
    chatMessages: [
      {
        sender: 'vesper',
        time: '03:12 AM',
        text: 'La luz debajo de tu puerta sigue encendida.',
        deletedDraft: 'No puedo dormir sabiendo que estás al otro lado de la pared con frío.',
      },
      {
        sender: 'noctis',
        time: '03:13 AM',
        text: 'No podía dormir. Me quedé mirando la mancha de pintura azul que dejé en el borde de tu máscara hoy.',
        deletedDraft: 'Tenía ganas de escuchar tu voz otra vez.',
      },
      {
        sender: 'vesper',
        time: '03:14 AM',
        text: 'No la limpié. La dejé ahí.',
        deletedDraft: 'Abre la puerta. Voy con té caliente.',
      },
      {
        sender: 'vesper',
        time: '03:15 AM',
        text: 'Abre. Llevo dos tazas.',
      },
    ],
  },
  {
    id: 'log-kn-sketch1',
    shipId: 'kazuha-noctis',
    title: 'Hoja Arrancada del Croquis de Noctis',
    unlockRequirementSessions: 2,
    type: 'sketchbook-note',
    summary: 'Un dibujo a lápiz que Noctis escondió al fondo de su carpeta de Storyboard para que Kazuha no lo viera.',
    sketchbookEntry: {
      author: 'noctis',
      subject: 'kazuha',
      dateLabel: 'Martes, 02:40 AM — En el escritorio',
      sketchCaption: 'Trazo rápido en carboncillo: Kazuha dormido sentado junto a mi cama, con las orejas de zorro caídas hacia adelante y su haori cubriéndome las piernas.',
      monologue:
        'Siempre entra gruñendo que soy un desastre y que mi pieza lo estresa, pero esperó hasta creer que yo estaba dormido para arroparme y sacarme el lápiz de la mano sin despertarme.',
      marginNote: 'Nota al margen: Si se despierta y ve que le dibujé las pestañas tan de cerca, me va a gritar durante una hora (con la cara completamente roja).',
    },
  },
  {
    id: 'log-vr-sketch1',
    shipId: 'vesper-renji',
    title: 'Bitácora Privada de Vesper: "Anomalía #4"',
    unlockRequirementSessions: 3,
    type: 'sketchbook-note',
    summary: 'Anotación manuscrita en la libreta de dirección de arte de Vesper.',
    sketchbookEntry: {
      author: 'vesper',
      subject: 'renji',
      dateLabel: 'Acto IV — Fuera de Guion',
      sketchCaption: 'Estudio de proporciones: La sonrisa insolente de Renji vista a menos de diez centímetros.',
      monologue:
        'Llevo años usando esta máscara para que nadie lea mis expresiones. Renji ni siquiera necesita quitármela: sabe exactamente cuándo contengo el aliento cada vez que me toca el mentón.',
      marginNote: 'Peligro crítico: Hoy me pidió cinco minutos de trabajo a cambio de desatar el listón. Quiero perder la apuesta a propósito.',
    },
  },
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
