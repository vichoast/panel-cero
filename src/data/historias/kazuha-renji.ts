// =====================================================================
// KAZUHA × RENJI — TEMPORADA 1: "Guerra Doméstica 2004"
// 10 capítulos, slow burn real: 1-2 fricción, 3-4 apuestas, 5-6 quiebre,
// 7-8 celos, 9-10 rendición.
//
// Este archivo es SOLO historia. Para agregar o corregir capítulos no hace
// falta tocar el resto de la app.
//
// Cómo se escribe un cuadro:
//   N('texto')                                   -> narrador
//   K('expresión', 'lo que dice', 'lo que calla', 'acotación')  -> Kazuha
//   R('expresión', 'lo que dice', 'lo que calla', 'acotación')  -> Renji
//   si('id-de-opción', cuadro)        -> solo aparece si ella eligió esa opción antes
//   siNinguna(['id', ...], cuadro)    -> aparece si no eligió ninguna de esas
// Expresiones: neutral, blush, intense, smirk, look-away, shock
// =====================================================================
import { BLChapter, CharacterId, DialogueBeat, SecretLog } from '../../types';

type Expr = NonNullable<DialogueBeat['expression']>;
type Cuadro = Omit<DialogueBeat, 'id'>;

const N = (texto: string): Cuadro => ({ speaker: 'narrator', spokenText: texto });
const voz =
  (quien: CharacterId) =>
  (expr: Expr, dice: string, calla?: string, acotacion?: string): Cuadro => ({
    speaker: quien,
    expression: expr,
    spokenText: dice,
    hiddenThought: calla,
    stageDirection: acotacion,
  });
const K = voz('kazuha');
const R = voz('renji');
const si = (opcion: string, c: Cuadro): Cuadro => ({ ...c, si: opcion });
const siNinguna = (opciones: string[], c: Cuadro): Cuadro => ({ ...c, siNinguna: opciones });

interface Opcion {
  id: string;
  tono: 'tension' | 'tierno' | 'caos';
  texto: string;
  sigue: Cuadro[];
}

interface Guion {
  n: number;
  titulo: string;
  subtitulo: string;
  tropo: string;
  gancho: { a: [CharacterId, string]; b: [CharacterId, string]; narrador: string };
  cuadros: Cuadro[];
  pregunta: string;
  opciones: Opcion[];
  adelanto: string;
}

function capitulo(g: Guion): BLChapter {
  const id = `kr-t1-${String(g.n).padStart(2, '0')}`;
  return {
    id,
    shipId: 'kazuha-renji',
    chapterNumber: g.n,
    title: `Episodio ${String(g.n).padStart(2, '0')}: ${g.titulo}`,
    subtitle: g.subtitulo,
    contextTrigger: 'any',
    tropeTag: g.tropo,
    cliffhangerPreview: {
      speakerA: g.gancho.a[0],
      lineA: g.gancho.a[1],
      speakerB: g.gancho.b[0],
      lineB: g.gancho.b[1],
      narratorHook: g.gancho.narrador,
    },
    beats: g.cuadros.map((c, i) => ({ ...c, id: `${id}-b${i + 1}` })),
    choicePrompt: g.pregunta,
    choices: g.opciones.map((o) => ({
      id: o.id,
      label: o.texto,
      tone: o.tono,
      chemistryDelta: 8,
      followUpBeats: o.sigue.map((c, i) => ({ ...c, id: `${o.id}-${i + 1}` })),
    })),
    nextCliffhangerTeaser: g.adelanto,
  };
}

export const TEMPORADA_KAZUHA_RENJI: BLChapter[] = [
  // ------------------------------------------------------------------
  // ARCO I — GRITOS EN EL PASILLO
  // ------------------------------------------------------------------
  capitulo({
    n: 1,
    titulo: 'La Taza de la Discordia',
    subtitulo: 'Lunes, 9:02 de la mañana. La guerra empieza por ocho cajas de leche de frutilla.',
    tropo: 'Enemigos de Estudio',
    gancho: {
      a: ['kazuha', '¡Siete cajas vacías, Renji! ¡Siete! ¡En MI mesa de luz!'],
      b: ['renji', 'Ocho. Hay una detrás del monitor, pero esa todavía tiene un poco, así que técnicamente es despensa.'],
      narrador: 'Kazuha está a un segundo de invocar fuego de zorro dentro del estudio.',
    },
    cuadros: [
      N('Lunes, 9:02. El estudio huele a té de jazmín recién hecho y, por debajo, a algo dulce y químico. Kazuha conoce ese olor. Lo odia con método.'),
      K(
        'intense',
        'Siete. Siete cajas vacías sobre la mesa de luz. Llevo doscientos años cuidando talleres y jamás, jamás, había tenido que escribir «no apilar basura rosada» en un reglamento.',
        'Las apiló en pirámide. Con cuidado. O sea que tuvo tiempo de ordenar y eligió esto.',
        'Sus orejas plateadas están tan echadas hacia atrás que casi desaparecen entre el pelo.'
      ),
      R(
        'smirk',
        'Ocho. Hay una detrás del monitor, pero esa todavía tiene un poco, así que técnicamente es despensa.',
        'Llegó hace cuatro minutos y ya se le erizó la cola. Nuevo récord personal.',
        'No levanta la vista de la tableta. Tiene una bombilla en la boca y ningún instinto de supervivencia.'
      ),
      K('intense', '¡No es despensa, es un monitor! ¡Y eso no es desayuno, es azúcar con colorante!', 'Tiene ojeras de tres días. No es asunto mío. Anotado que no es asunto mío.'),
      R(
        'smirk',
        '¿Viste? Primer capítulo y ya me están gritando. Así parten todas las buenas series, tú tranquila.',
        undefined,
        'Lo dice mirando hacia un punto vacío del estudio, más o menos donde estaría una cámara.'
      ),
      K('look-away', '...¿A quién le hablas?'),
      R('neutral', 'A la directora. La que nos está leyendo en vez de recoger sus propias tazas. Hola, directora.', 'Algún día el zorro va a mirar para allá también. Tengo fe.'),
      K('look-away', 'Ahí no hay nadie, Renji.', 'Otra vez le habla a la pared. Debería preocuparme. No pienso preocuparme.'),
      N('Kazuha no discute más. Saca del haori un rollo de cinta de enmascarar y, con la precisión de quien ha trazado sellos sagrados, pega una línea recta que parte el estudio en dos, de muro a muro.'),
      K('intense', 'De aquí para allá: tu chiquero. De aquí para acá: la civilización. Si una sola caja cruza esta línea, la quemo. Con la caja adentro de tu mochila.'),
      R('smirk', 'Entendido, mi general. Una consulta técnica: ¿el baño de qué lado quedó?'),
      K('neutral', '...Del mío.'),
      R('smirk', 'Entonces voy a necesitar visa. ¿Aceptan pago en leche de frutilla?', 'Se le movió la comisura. Medio milímetro. Lo vi.'),
      N('El día pasa. La línea aguanta. A las 2:47 de la madrugada, Kazuha vuelve al estudio a buscar una tetera que no olvidó.'),
      N('Renji está dormido sobre la tableta, con el lápiz todavía en la mano y el layout a medio terminar. A su lado, una caja de leche lavada y recortada hace de lapicero. Adentro están los tres pinceles que Kazuha daba por perdidos. La etiqueta, con letra horrible, dice: «del zorro, no tocar».'),
      K(
        'look-away',
        '...Idiota. Te vas a destrozar la espalda durmiendo así.',
        'El contrato dice «cuidar el estudio». No dice nada de cuidar al desastre que vive adentro.',
        'Cruza la cinta sin darse cuenta de que la cruzó. Tiene una manta en las manos y no recuerda haberla ido a buscar.'
      ),
    ],
    pregunta: 'Kazuha está del lado prohibido de la cinta, con una manta en las manos y ninguna excusa preparada. ¿Qué hace?',
    opciones: [
      {
        id: 'kr01-manta',
        tono: 'tension',
        texto: 'Arroparlo con la manta… y quedarse mirándolo un segundo más de lo necesario',
        sigue: [
          N('La manta cae sobre los hombros de Renji sin un solo ruido. Kazuha debería irse. En vez de eso se queda ahí, de pie, a la luz azul del monitor.'),
          K('look-away', '...Tienes las pestañas absurdamente largas para alguien tan molesto.', '¿Por qué dije eso en voz alta? Está dormido. Está dormido, ¿verdad?'),
          R(
            'smirk',
            '...mm. Cinco minutos más, zorrito.',
            'Estoy despierto desde que crujió la tabla del pasillo. No pienso abrir los ojos por nada del mundo.',
            'No abre los ojos. Kazuha sale del estudio caminando muy digno y muy rápido.'
          ),
        ],
      },
      {
        id: 'kr01-te',
        tono: 'tierno',
        texto: 'Dejarle un té caliente y una nota de regaño junto a la mano',
        sigue: [
          N('La nota, en caligrafía impecable, dice: «Duerme en una cama, como la gente. El té es de cebada y no tiene azúcar. No reclames. —K.»'),
          K('neutral', 'Esto no es amabilidad. Es mantenimiento del estudio.', 'Le puse miel. Dos cucharadas. Si pregunta, lo negaré bajo juramento.'),
          N('Por la mañana la taza está vacía, lavada y devuelta a su repisa. Es la primera cosa que Renji lava en la historia de ese estudio.'),
        ],
      },
      {
        id: 'kr01-bigotes',
        tono: 'caos',
        texto: 'Dibujarle bigotes de zorro con plumón… y recién ahí ponerle la manta',
        sigue: [
          K('smirk', 'Tres por lado. Simétricos. Considéralo un impuesto por las ocho cajas.', 'Se ve ridículo. Se ve… No. Ridículo. Esa es la palabra y no hay otra.'),
          N('Lo arropa igual. Con cuidado de no despertarlo, lo que arruina bastante la venganza.'),
          R(
            'shock',
            '¡¿POR QUÉ TENGO CARA DE MASCOTA DE CEREAL?!',
            'Me arropó. El plumón es lo de menos. Me arropó.',
            'A la mañana siguiente, frente al espejo del baño. Del lado de Kazuha. Sin visa.'
          ),
        ],
      },
    ],
    adelanto: 'En el próximo episodio: Renji redacta la «Constitución del Estudio» en una servilleta, y la cola de Kazuha comete traición a la patria.',
  }),

  capitulo({
    n: 2,
    titulo: 'Tratado de la Cinta Adhesiva',
    subtitulo: 'Toda guerra necesita un tratado. Este está escrito en una servilleta con manchas de frutilla.',
    tropo: 'Convivencia Forzada',
    gancho: {
      a: ['renji', 'Artículo tres: el zorro tiene prohibido suspirar más de cuatro veces por hora.'],
      b: ['kazuha', 'Artículo cuatro: toda caja vacía será devuelta a su dueño. Dentro de sus zapatos.'],
      narrador: 'La cola de Kazuha lleva diez minutos del lado equivocado de la cinta y ninguno de los dos lo ha mencionado.',
    },
    cuadros: [
      si('kr01-manta', R('smirk', 'Oye, zorrito. Anoche soñé que alguien decía que tengo las pestañas bonitas. Qué sueño más raro, ¿no?', 'Vamos a ver de qué color se pone.')),
      si('kr01-manta', K('shock', '¡Los sueños no significan nada! ¡Nada! ¡Es actividad cerebral residual!', 'Estaba despierto. Voy a mudarme de dimensión.')),
      si('kr01-te', R('smirk', 'Alguien me dejó un té anoche. La nota decía «sin azúcar» y tenía dos cucharadas de miel. Hay un mentiroso suelto en el edificio.')),
      si('kr01-te', K('look-away', '...Se habrá caído la miel adentro. Pasa. Los frascos son traicioneros.', 'Contó las cucharadas. ¿Quién cuenta las cucharadas?')),
      si('kr01-bigotes', R('neutral', 'Llevo tres días con bigotes. El plumón era permanente, Kazuha. Fui así a comprar pan. La señora de la panadería me hizo «pspsps».')),
      si('kr01-bigotes', K('smirk', 'Y te quedan mejor que la cara de siempre.', 'No se los ha tapado ni una vez. Podría haber usado una mascarilla. No lo hizo.')),
      siNinguna(['kr01-manta', 'kr01-te', 'kr01-bigotes'], R('smirk', 'Alguien me tapó con una manta anoche. No voy a decir quién, pero dejó pelos plateados en mi silla.')),
      siNinguna(['kr01-manta', 'kr01-te', 'kr01-bigotes'], K('look-away', 'Corrientes de aire. Este edificio es viejo.', 'Tengo que cepillarme la cola antes de cometer actos de caridad.')),
      N('Segundo día de la Línea. Renji llega con una servilleta de local de comida rápida, escrita por los dos lados, y la pone sobre la cinta como quien firma la paz en un acorazado.'),
      R('smirk', '«Constitución del Estudio». Artículo uno: la cinta se respeta. Artículo dos: el refrigerador es zona neutral. Artículo tres: el zorro tiene prohibido suspirar más de cuatro veces por hora.'),
      K('intense', 'Suspiro lo que la situación amerita.', 'Ya van tres. Maldición.', 'Toma un pincel, lo carga de tinta y agrega una línea con caligrafía de pergamino imperial.'),
      K('smirk', '«Artículo cuatro: toda caja de leche vacía será devuelta a su dueño. Dentro de sus zapatos.»'),
      R('shock', 'Eso es un crimen de guerra.', 'Tiene buena letra. Tiene una letra injustamente buena. ¿Por qué me fijo en la letra?'),
      N('Negocian durante una hora. Se discute el termostato, el volumen de los openings de anime y si el microondas cuenta como embajada. Mientras tanto, la cola de Kazuha, plateada y completamente autónoma, se va deslizando por encima de la cinta hacia el lado de Renji, donde a esa hora pega el sol.'),
      R('smirk', 'Kazuha. Tu cola está en mi país.'),
      K('look-away', 'Mi cola no tiene opiniones políticas.', 'Su lado es más tibio. Es por el sol. Es exclusivamente por el sol.'),
      N('Renji no insiste. Un rato después arrastra su silla diez centímetros hacia la pared, «porque le llegaba el reflejo a la pantalla». El rectángulo de sol queda entero del lado de Kazuha.'),
      R('neutral', 'Listo. Mucho mejor así.', 'Ahora me llega el reflejo de verdad. No importa.', 'Al sentarse se lleva una mano a la parte baja de la espalda, medio segundo, sin darse cuenta.'),
      N('Cuando Renji vuelve del baño (con visa, sellada con un timbre de zorrito que nadie admite haber fabricado) hay un cojín firme en su silla. Kazuha está de espaldas, limpiando una repisa que ya estaba limpia.'),
      K('neutral', 'Estaba estorbando en mi lado. No lo quiero. Bótalo si te molesta.', 'Es el cojín bueno. El de trigo sarraceno. No lo va a botar.'),
      R('look-away', '...Qué raro. Aparecen cosas. Este estudio está embrujado.', 'Doscientos años y todavía no aprende a mentir. No se lo voy a decir nunca.'),
    ],
    pregunta: 'El tratado está listo y solo falta la firma de Kazuha. ¿Cómo lo sella?',
    opciones: [
      {
        id: 'kr02-mano',
        tono: 'tension',
        texto: 'Estrecharle la mano por encima de la cinta… y que ninguno de los dos suelte primero',
        sigue: [
          N('Es un apretón formal. Dura un segundo. Luego dos. Luego seis.'),
          K('intense', 'Puedes soltar cuando quieras.', 'Tiene callos de lápiz en el dedo medio. Trabaja más de lo que deja ver.'),
          R('smirk', 'Tú primero, zorrito. Yo tengo todo el día.', 'Tiene la mano tibia. Pensé que iba a estar fría. No sé por qué pensé eso.'),
          N('Sueltan a la vez, a los once segundos, porque suena el microondas. Ninguno de los dos había puesto nada en el microondas.'),
        ],
      },
      {
        id: 'kr02-sello',
        tono: 'tierno',
        texto: 'Firmar con su sello de familiar y agregar, en letra muy chica: «Art. 5: Renji almuerza todos los días»',
        sigue: [
          K('neutral', 'Es una cláusula sanitaria. Un animador desmayado baja la productividad del estudio.', 'Ayer almorzó un chicle. Lo vi.'),
          R('look-away', '...Letra chica. Qué abogado más sucio me tocó.', 'Nadie me había puesto en un contrato para algo bueno.'),
          N('El sello queda estampado en rojo sobre la servilleta: un zorro diminuto, enroscado, con un ojo abierto.'),
        ],
      },
      {
        id: 'kr02-huella',
        tono: 'caos',
        texto: 'Mojar la punta de la cola en tinta y firmar con ella sobre la servilleta (y sobre la manga de Renji)',
        sigue: [
          K('smirk', 'Firma oficial de familiar. Tiene validez en tres planos espirituales.', 'La manga fue un accidente. La segunda pasada por la manga, no tanto.'),
          R('shock', '¡Era mi polerón bueno! ¡El único sin manchas de fideos!'),
          R('look-away', '...Igual no lo voy a lavar.', 'Lo dije en voz alta. ¿Por qué lo dije en voz alta?', 'Lo murmura hacia la tableta. Las orejas de Kazuha giran hacia él como antenas.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: cinco minutos, un clóset y una apuesta que nadie pensó hasta el final.',
  }),

  // ------------------------------------------------------------------
  // ARCO II — APUESTAS ABSURDAS
  // ------------------------------------------------------------------
  capitulo({
    n: 3,
    titulo: 'La Apuesta de los Cinco Minutos',
    subtitulo: 'El que ordene menos en cinco minutos obedece al otro un día entero. ¿Qué podría salir mal?',
    tropo: 'Atrapados en el Clóset',
    gancho: {
      a: ['kazuha', '¡Eso no es ordenar, es esconder evidencia! ¡Saca todo de ese clóset ahora mismo!'],
      b: ['renji', 'Kazuha, no abras esa puerta. Te lo digo en serio. Kazuha. KAZUHA.'],
      narrador: 'Lo que hay detrás de la puerta del clóset desafía varias leyes de la física.',
    },
    cuadros: [
      N('Jueves. El tratado lleva tres días vigente y el estudio nunca había estado tan tranquilo. Renji no lo soporta.'),
      R('smirk', 'Propongo una apuesta. Cinco minutos de reloj. El que ordene más de su lado, gana. El que pierde obedece al otro un día completo.'),
      K('intense', 'Llevo doscientos años ordenando. Vas a pasar veinticuatro horas lavando tazas con cepillo de dientes.', 'Por fin. Un duelo en mi idioma.'),
      R('neutral', 'Es el método de la directora: cinco minutos y se acabó, sin pensar en todo lo demás. Si a ella le funciona, a nosotros también.', undefined, 'Le guiña un ojo a la pared. Kazuha decide no ver eso.'),
      N('Suena el cronómetro. Kazuha se mueve como una ceremonia del té en cámara rápida: cada lápiz a su estuche, cada papel a su carpeta, la cola barriendo migas con eficiencia militar.'),
      N('Renji abre el clóset del fondo, toma todo lo que hay en su lado con los dos brazos (bocetos, polerones, un ventilador, una guitarra sin cuerdas) y lo empuja adentro. Cierra con la cadera. Tiempo total: cuarenta segundos.'),
      R('smirk', 'Listo. Me sobran cuatro minutos veinte para tomar leche y verte sufrir.'),
      K('shock', '¡Eso no es ordenar, es esconder evidencia! ¡Estás descalificado! ¡Saca todo de ese clóset ahora mismo!', undefined, 'Cruza la cinta a zancadas y agarra la manilla.'),
      R('shock', 'Kazuha, no abras esa puerta. Te lo digo en serio. Está todo en equilibrio. Kazuha. KAZUHA.'),
      N('La abre. El contenido del clóset, liberado, se inclina hacia él como una ola. Renji lo agarra del haori, tira, y los dos caen hacia el único lugar donde no está cayendo nada: adentro del clóset. La avalancha pasa de largo. La puerta se cierra sola, empujada por un polerón. Clic.'),
      N('Oscuridad. Un metro cuadrado. Olor a ropa guardada y a frutilla.'),
      R('look-away', '...Tus ojos brillan.', 'Ámbar. En la oscuridad son ámbar con una raya negra en el medio. Qué práctico. Qué injusto.'),
      K('neutral', 'Soy un zorro. Veo en la oscuridad. Tú, en cambio, me estás pisando.', 'Tengo la oreja contra su mentón. Si muevo la cabeza, es peor. Si no la muevo, también.'),
      R(
        'smirk',
        'Este es el capítulo del clóset. Todas las series tienen uno. Es porque es barato de animar, ¿sabes? Un solo fondo, todo negro, dos pares de ojos, el estudio se ahorra un dineral y…',
        'Estoy hablando mucho. ¿Por qué estoy hablando tanto? Cállate, Renji.'
      ),
      N('Kazuha tiene oído de zorro. A esa distancia escucha perfectamente el corazón de Renji, y va rápido. Demasiado rápido para alguien que está haciendo chistes.'),
      K('intense', 'Tu pulso está acelerado. ¿Le temes a los espacios cerrados?', 'No me lo había dicho. Lo arrastré a una discusión frente a un clóset y no me lo había dicho.'),
      R('look-away', '...Sí. Eso. Exactamente eso. Espacios cerrados. Terrible.', 'No le temo a los espacios cerrados.'),
      K(
        'neutral',
        'Entonces respira conmigo. Adentro, contando hasta cinco. Afuera, hasta cinco. No pienses en la puerta. Piensa solo en el número.',
        'Es mi deber. Es estrictamente mi deber de familiar.',
        'Lo dice bajo, con una voz que Renji no le había escuchado nunca: la que debe haber usado durante doscientos años con gente asustada.'
      ),
      R('blush', '...Uno. Dos. Tres.', 'Así que esta es la voz que tiene cuando no me está gritando. Estoy en problemas.'),
    ],
    pregunta: 'La puerta está trabada y afuera el cronómetro sigue corriendo. ¿Qué pasa dentro del clóset?',
    opciones: [
      {
        id: 'kr03-quietos',
        tono: 'tension',
        texto: 'Quedarse quietos y callados, a ver quién aguanta más sin decir nada',
        sigue: [
          N('Renji aguanta nueve segundos. Es su marca histórica de silencio estando despierto.'),
          R('blush', '...Hueles a té. Y a algo como hojas secas. No es queja. Es un dato.', 'No era un dato. Era lo contrario de un dato.'),
          K('blush', 'Y tú hueles a jarabe de frutilla. Tampoco es queja.', 'No me estoy apartando. Hay espacio para apartarme tres centímetros y no lo estoy usando.'),
          N('Afuera suena el cronómetro. Adentro nadie se mueve para ir a apagarlo.'),
        ],
      },
      {
        id: 'kr03-luz',
        tono: 'tierno',
        texto: 'Kazuha enciende una llamita de fuego de zorro en la palma, para que Renji no esté a oscuras',
        sigue: [
          N('Es una llama azul pálido, del tamaño de una nuez, que no quema ni hace humo. Alumbra las dos caras desde abajo, como en los cuentos de terror, pero nadie tiene miedo.'),
          K('look-away', 'No es para ti. Es para ver dónde está la manilla.', 'Hace ciento cuarenta años que no la enciendo para alguien.'),
          R('blush', 'Kazuha. Es lo más bonito que he visto en este estudio. Y eso que una vez me salió bien una mano a la primera.', 'No estoy mirando la llama.'),
        ],
      },
      {
        id: 'kr03-patada',
        tono: 'caos',
        texto: 'Renji intenta abrir de una patada heroica (la puerta abría hacia adentro)',
        sigue: [
          R('intense', 'Atrás, zorrito. Vi esto en cuarenta animes distintos.'),
          N('La patada es técnicamente perfecta. La puerta, que abre hacia adentro, no se entera. Renji rebota, cae sentado sobre la guitarra sin cuerdas y la guitarra, contra todo pronóstico, suena.'),
          K('smirk', 'Formidable. Has derrotado a tu propia rodilla.', 'No me voy a reír. No me voy a…', 'Se ríe. Es un sonido corto, por la nariz, que intenta disfrazar de tos. Es la primera vez que Renji lo oye.'),
          R('blush', '...Hazlo de nuevo.', 'Me duele todo y quiero que se ría otra vez. Estoy mal de la cabeza.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: el cronómetro sonó con los dos adentro. ¿Quién perdió la apuesta? Los dos. Y los dos piensan cobrar.',
  }),

  capitulo({
    n: 4,
    titulo: 'El Perdedor Obedece',
    subtitulo: 'Empate técnico. Cada uno le da una orden al otro, y ninguna es la que esperaban.',
    tropo: 'Una Orden por Cabeza',
    gancho: {
      a: ['renji', 'Mi orden: te sientas a almorzar conmigo. Diez minutos. Sin limpiar nada. Las manos donde yo las vea.'],
      b: ['kazuha', 'Entonces la mía: vas a dormir ocho horas. Seguidas. En una superficie horizontal.'],
      narrador: 'Ninguno de los dos sabe todavía cuál de las dos órdenes es más difícil de cumplir.',
    },
    cuadros: [
      N('Los sacó del clóset la señora del departamento de abajo, que subió por el ruido. Veredicto oficial de la apuesta: empate por incompetencia mutua. Según el artículo seis (agregado esa misma tarde), cada uno le debe al otro una orden.'),
      R('smirk', 'Yo primero. Mi orden: te sientas a almorzar conmigo. Diez minutos. Sin limpiar, sin ordenar, sin servirle nada a nadie.'),
      K('shock', '¿Esa es tu orden? Podías pedirme que lavara tu ropa un mes. Que te cediera el lado con sol.', '¿Dónde está la trampa? Tiene que haber una trampa.'),
      R('neutral', 'Llevas dos semanas en este estudio y nunca te he visto sentado. Comes de pie, al lado del lavaplatos, como un caballo. Me pone nervioso.'),
      N('Kazuha se sienta. Es evidente que no sabe qué hacer con las manos. A los cuarenta segundos, la derecha empieza a avanzar sola hacia una miga sobre la mesa.'),
      R('intense', 'Las manos donde yo las vea, zorrito.'),
      K('look-away', '...Es una miga.', 'Es una miga y me está mirando.'),
      R('smirk', 'Es MI miga. Está de mi lado de la mesa. Tiene derechos.'),
      N('El almuerzo de Renji son fideos instantáneos y un pan de ayer. Parte el pan por la mitad y le pone un pedazo adelante sin preguntar.'),
      K(
        'neutral',
        'Los familiares no se sientan a la mesa. Servimos la mesa. En doscientos años nadie me había…',
        'No termines esa frase. No es asunto suyo.',
        'Se calla. Mira el pedazo de pan como si fuera un objeto de otra civilización.'
      ),
      R('neutral', 'Pues en esta mesa sí.', 'Doscientos años. Doscientos. Y nadie le corrió una silla.', 'Lo dice sin chiste, mirando sus fideos. Después hace mucho ruido al sorber, para que no se note.'),
      K('look-away', '...Estos fideos son una ofensa a la agricultura. Mañana traigo almuerzo yo. Para que veas la diferencia. Nada más.', 'Va a necesitar proteína. Y verduras. Y una caja con divisiones.'),
      N('Pasan los diez minutos. Pasan veinticinco. Nadie mira el reloj.'),
      K('intense', 'Mi turno. Mi orden: vas a dormir ocho horas. Seguidas. En una superficie horizontal.'),
      R('shock', '¿Ocho? ¿Seguidas? Eso es ilegal en la industria de la animación.'),
      K('neutral', 'Te he contado las horas. Esta semana llevas diecinueve en total. No es una negociación.', 'Dije «te he contado las horas» en voz alta. Excelente, Kazuha. Muy discreto.'),
      R(
        'look-away',
        '...No es que no quiera. Es que cuando hay silencio, la cabeza me empieza a pasar lista de todo lo que debo. Entregas, correcciones, mensajes sin contestar. Se pone a ordenar la lista en vez de dormir. Así que me quedo trabajando, que mete más ruido.',
        'Eso no se lo había dicho a nadie. Tenía un chiste preparado para tapar esto y se me olvidó cuál era.'
      ),
      K('neutral', 'Entonces no habrá silencio.', 'Eso sí sé arreglarlo.'),
      N('Renji se echa en el sillón del estudio, tieso, como paciente de dentista. Kazuha se sienta en el otro extremo con su piedra de tinta y empieza a moler: un roce parejo, lento, redondo. De vez en cuando, el golpecito de un pincel contra el borde de un vaso.'),
      R('neutral', 'Esto no va a funcionar, te aviso. Tengo el cerebro de un hámster con caf…', undefined, 'No termina la frase.'),
      N('Cuatro minutos. Kazuha los contó. La cabeza de Renji se va ladeando de a poco, por etapas, hasta quedar apoyada en su hombro.'),
    ],
    pregunta: 'Renji duerme profundamente con la cabeza en el hombro de Kazuha. Faltan siete horas y cincuenta y seis minutos para cumplir la orden. ¿Qué hace Kazuha?',
    opciones: [
      {
        id: 'kr04-inmovil',
        tono: 'tension',
        texto: 'No moverse ni un milímetro en toda la noche, con el corazón metiendo más ruido que los pinceles',
        sigue: [
          N('A la tercera hora se le duerme el brazo. A la quinta, la cola. Kazuha ha custodiado santuarios bajo la nieve sin pestañear, y nada lo había preparado para esto.'),
          K('blush', '...', 'Respira por la boca cuando duerme. Es antihigiénico. Es… No voy a terminar ese pensamiento.'),
          R('look-away', 'Buenos días. Oye… ¿estuviste así toda la noche?', 'Tiene la marca de mi pelo en el cuello del haori. Ocho horas. No se movió en ocho horas.'),
          K('look-away', 'Me quedé dormido en esta posición por casualidad. Los zorros dormimos sentados. Es un hecho biológico.'),
        ],
      },
      {
        id: 'kr04-haori',
        tono: 'tierno',
        texto: 'Acomodarle la cabeza con cuidado y cubrirlo con su propio haori',
        sigue: [
          N('Lo desliza hasta el cojín con la delicadeza de quien traslada una taza llena hasta el borde. Después se quita el haori y lo tapa hasta el mentón.'),
          K('neutral', 'Ocho horas. Ni un minuto menos. Yo vigilo.', 'Nunca me lo había quitado delante de nadie. Se ve mejor en él que colgado en el perchero. Dato irrelevante.'),
          N('Renji despierta nueve horas después, envuelto en tela que huele a hojas secas y a té. No lo devuelve hasta el mediodía. Kazuha no lo pide.'),
        ],
      },
      {
        id: 'kr04-cojin',
        tono: 'caos',
        texto: 'Entrar en pánico, sustituirse por un cojín con técnica ninja… y quedarse a vigilar al cojín toda la noche',
        sigue: [
          N('La maniobra toma dos segundos y una nube de humo completamente innecesaria. Donde estaba el hombro de Kazuha ahora hay un cojín. Renji ni se entera.'),
          K('intense', 'Bien. Problema resuelto. Distancia segura restablecida.', '¿Por qué me molesta que no haya notado la diferencia?', 'Se sienta en el suelo, a cuarenta centímetros, y fulmina al cojín con la mirada durante siete horas.'),
          R('smirk', 'Buenos días… ¿Por qué estás mirando feo a un cojín?'),
          K('look-away', 'Sabe lo que hizo.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: llega un correo al estudio, y Renji hace lo único que nadie le había visto hacer: quedarse callado.',
  }),

  // ------------------------------------------------------------------
  // ARCO III — SILENCIO INESPERADO
  // ------------------------------------------------------------------
  capitulo({
    n: 5,
    titulo: 'Silencio Inesperado',
    subtitulo: 'Tres semanas de trabajo rechazadas en un correo de dos líneas.',
    tropo: 'El Gracioso Deja de Reír',
    gancho: {
      a: ['kazuha', 'Di algo. Un chiste. Una de tus referencias incomprensibles. Lo que sea.'],
      b: ['renji', 'Hoy no tengo, zorrito. Se me acabaron.'],
      narrador: 'El estudio lleva cuatro horas en silencio. Kazuha jamás pensó que lo iba a echar de menos.',
    },
    cuadros: [
      N('El correo llega a las 11:14. Kazuha no lo lee, pero ve a Renji leerlo. Ve cómo se le va quedando quieta la cara, de arriba hacia abajo, como una pantalla que se apaga.'),
      R('neutral', 'Ya.', undefined, 'Cierra el computador. No dice nada más.'),
      N('«Rehacer desde el layout. No tiene vida.» Tres semanas de trabajo. La secuencia que Renji animó durmiendo diecinueve horas por semana.'),
      K('neutral', '...¿Renji?', 'Ahora viene el chiste. Va a decir que el cliente es un villano de relleno. Va a mirar a la pared y decirle algo a su directora imaginaria.'),
      N('El chiste no viene. Renji abre el archivo y se queda mirando el primer cuadro, con el lápiz en la mano, sin apoyarlo.'),
      N('Pasa una hora. Pasan cuatro. Kazuha descubre algo espantoso: el estudio en silencio, el estudio que pidió a gritos durante semanas, es insoportable.'),
      K('neutral', 'Té. De jazmín. Está a la temperatura correcta.', 'Tómatelo. Reclama que no tiene azúcar. Por favor reclama.'),
      R('neutral', 'Gracias, Kazuha.', undefined, 'No lo toca. Dice «Kazuha», no «zorrito». De alguna forma eso es lo peor.'),
      N('A las cuatro de la tarde, Kazuha sale del edificio sin explicación. Vuelve a los quince minutos con una bolsa del almacén de la esquina y la expresión de quien acaba de cometer un delito contra sus principios.'),
      K('look-away', 'Toma. No digas nada.', 'El cajero me preguntó si quería la promoción de seis. Dije que sí. No sé quién soy.', 'Deja una caja de leche de frutilla sobre el escritorio de Renji. Del lado de Renji. Cruzando la cinta a propósito, mirándola al cruzar.'),
      R('look-away', '...Compraste leche de frutilla. Tú.', 'Fue hasta el almacén. Con las orejas a la vista. Por esto.'),
      K('intense', 'Dije que no dijeras nada. Y además… Escucha con atención, porque esto me cuesta.'),
      K(
        'intense',
        '¿Qué le dice un pincel a otro pincel?',
        'No. No puedo creer que lo voy a hacer.',
        'Lo pregunta de pie, con las manos a la espalda y la solemnidad de un funeral de Estado.'
      ),
      R('neutral', '...¿Qué?'),
      K('intense', '«Qué mala pinta tienes.»'),
      N('Silencio. Renji lo mira. Kazuha sostiene la mirada con la dignidad hecha pedazos y las orejas completamente rojas por dentro.'),
      R(
        'smirk',
        'Es… es lo peor que he escuchado en mi vida. Es pésimo. Lo dijiste como si leyeras una sentencia.',
        undefined,
        'Se le escapa una risa. Después otra. Después se ríe en serio, doblado sobre el escritorio, hasta que la risa le sale mojada y tiene que taparse los ojos con el antebrazo.'
      ),
      R(
        'look-away',
        '...Todo el mundo espera que el gracioso sea yo. Siempre. Aunque no tenga ganas. Eres el primero que intenta serlo por mí.',
        'No me voy a recuperar nunca de un zorro de doscientos años contando un chiste de pinceles.'
      ),
      K('look-away', 'No te acostumbres. Me dolió físicamente.', 'Lo haría de nuevo. Lo haría cien veces.'),
      K(
        'neutral',
        'Y ahora escúchame. No vas a rehacer tres semanas hoy. Vas a rehacer el primer cuadro. Solo ese. Cinco minutos. Yo cuento el tiempo.',
        'Lo demás se bloquea con llave hasta mañana. De eso me encargo yo.'
      ),
    ],
    pregunta: 'Renji tiene los ojos rojos de reírse (y de lo otro) y el lápiz por fin apoyado en la tableta. ¿Qué hace Kazuha?',
    opciones: [
      {
        id: 'kr05-pulgar',
        tono: 'tension',
        texto: 'Limpiarle una lágrima con el pulgar antes de alcanzar a pensarlo',
        sigue: [
          N('Es un gesto de medio segundo. La mano de Kazuha llega antes que su cabeza, y cuando la cabeza llega ya es tarde: tiene el pulgar en el pómulo de Renji y los dos lo saben.'),
          K('blush', 'Tenías… Era… Pelusa. Una pelusa.', 'Retira la mano. Retírala. ¿Por qué sigue ahí?'),
          R('blush', 'Sí. Pelusa. Muy peligrosas en esta época.', 'No se me ocurre nada gracioso. Es la segunda vez hoy. Este zorro me está desarmando el oficio.'),
        ],
      },
      {
        id: 'kr05-lado',
        tono: 'tierno',
        texto: 'Sentarse a su lado, hombro con hombro, y quedarse hasta que termine el primer cuadro',
        sigue: [
          N('Kazuha arrastra su silla hasta el lado de Renji. Cruza la cinta con silla y todo. No explica nada.'),
          K('neutral', 'Cinco minutos. Empiezan ahora. No mires el resto de la secuencia, mira solo este.', 'Dibuja distinto cuando no está tratando de ser brillante. Más suelto. Con vida. El del correo es un imbécil.'),
          R('neutral', '...Ya está. Uno. Salió.', 'Los cinco minutos pasaron hace cuarenta y sigue ahí sentado.'),
          K('smirk', 'Entonces otros cinco. Sigo contando.'),
        ],
      },
      {
        id: 'kr05-chiste',
        tono: 'caos',
        texto: 'Contarle un segundo chiste todavía peor, con apoyo visual de marionetas de calcetín',
        sigue: [
          K('intense', 'Tengo otro. Este requiere utilería.', 'Si funcionó una vez, funcionará dos. Es método científico.', 'Aparece con un calcetín en cada mano. A uno le ha pegado orejas de papel.'),
          N('El chiste dura cuatro minutos, tiene tres personajes y carece por completo de remate. El calcetín con orejas tiene, sospechosamente, la mejor parte del diálogo.'),
          R('smirk', 'Dios mío. Eres horrible. Eres un peligro para la comedia. Sigue. No pares nunca.', 'Hizo un calcetín de él y otro de mí. El mío tiene una caja de leche dibujada. Me quiero morir.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: los kitsune no se resfrían. Eso asegura Kazuha, con treinta y nueve de fiebre y las orejas caídas.',
  }),

  capitulo({
    n: 6,
    titulo: 'Fiebre de Zorro',
    subtitulo: 'Doscientos años cuidando a otros. Cero experiencia en que lo cuiden a él.',
    tropo: 'Uno Enfermo, el Otro lo Cuida',
    gancho: {
      a: ['kazuha', 'Los kitsune no nos resfriamos. Devuélveme la escoba. Estoy perfectamente. El piso se está moviendo porque es viejo.'],
      b: ['renji', 'Dame eso. Y siéntate antes de que te siente yo.'],
      narrador: 'Es la primera vez que Renji da una orden sin sonreír. Kazuha obedece antes de darse cuenta.',
    },
    cuadros: [
      N('Renji entregó la secuencia corregida un viernes. El lunes, Kazuha llega al estudio con las orejas caídas hacia los lados, como un avión triste.'),
      K('neutral', 'Buenos días. No me pasa nada. No preguntes.', 'El pasillo está más largo que ayer. Alguien alargó el pasillo.', 'Tiene la escoba en la mano. La está usando más como bastón que como escoba.'),
      R('neutral', 'Kazuha. Estás barriendo el mismo cuadrado hace diez minutos. Y tu llamita está tosiendo.'),
      N('Es verdad. El fuego de zorro que Kazuha enciende cada mañana para el té flota junto a su hombro, pálido, y cada tanto hace «pff» y suelta una chispa.'),
      K('intense', 'Los kitsune no nos resfriamos. Es una imposibilidad espiritual. Devuélveme la… ¿Cuándo me quitaste la escoba?'),
      R('intense', 'Recién. Siéntate antes de que te siente yo.', 'Está ardiendo. Le rocé la mano y está ardiendo.', 'No hay chiste. No hay sonrisa. Kazuha lo mira sin reconocerlo.'),
      N('Kazuha da un paso hacia el sillón y el piso, efectivamente, se mueve. Renji lo agarra antes de que llegue al suelo.'),
      R('smirk', 'Te tengo. …Oye. Pesas mucho menos de lo que gritas.', 'Tiembla. El tipo que custodió santuarios en la nieve está temblando en mis brazos y pidiendo perdón con la cara.'),
      K('look-away', 'Suéltame. Esto es indigno. Un familiar no… Yo soy el que…', 'No me sueltes. Se mueve todo.'),
      N('Renji lo deja en el sillón. Después hace algo insólito: ordena. Mal, lento, guardando las cosas en lugares equivocados, pero despeja la mesa, hierve agua y llama por teléfono a su mamá para preguntar cómo se hace una sopa de arroz.'),
      N('La sopa queda un poco quemada. Encima, por razones que solo él entiende, hay una frutilla.'),
      R('neutral', 'Vitamina C. No me mires así. Abre la boca.'),
      K('look-away', 'Es la peor sopa que he probado en dos siglos.', 'Me la voy a tomar entera.', 'Se la toma entera.'),
      si('kr01-manta', R('neutral', 'Y ahora, manta. Te la debía desde la noche de las ocho cajas. Sí, estaba despierto. Sí, lo de las pestañas también lo oí.', 'Ahora estamos a mano. No quiero estar a mano. Quiero deberle algo siempre.')),
      si('kr01-te', R('neutral', 'Té de cebada. Con dos cucharadas de miel. Ya me sé tu receta secreta, mentiroso.', 'La taza que me dejó esa noche está en mi repisa. No la he vuelto a usar para que no se gaste.')),
      si('kr01-bigotes', R('smirk', 'Podría vengarme ahora mismo, ¿sabes? Tengo un plumón permanente y estás indefenso.', 'No.', 'Destapa el plumón. Lo mira. Lo vuelve a tapar y lo arropa con la manta.')),
      siNinguna(['kr01-manta', 'kr01-te', 'kr01-bigotes'], R('neutral', 'Manta. La misma que apareció sola sobre mí una noche por «corrientes de aire».', 'Tiene pelos plateados todavía. No la lavé.')),
      K('look-away', '...Perdón. Por las molestias. Mañana repongo las horas de trabajo que…', 'No sé hacer esto. No sé estar de este lado.'),
      R(
        'intense',
        'Kazuha. Llevas doscientos años cuidando gente y te estás disculpando por tener fiebre un lunes. Cállate y duerme.',
        '¿Nadie lo cuidó nunca? ¿Ni una vez? Me dan ganas de ir a pelear con dos siglos de gente.'
      ),
      N('La fiebre sube al anochecer. Kazuha ya no distingue bien el sueño del estudio. Las orejas le tiemblan.'),
      K(
        'blush',
        'Renji… No te vayas a tu lado de la cinta.',
        undefined,
        'Lo dice con los ojos cerrados, muy bajo, sin ninguna de sus defensas. Mañana no se va a acordar. O va a jurar que no se acuerda.'
      ),
      R('look-away', '...No me voy.', 'Mi lado de la cinta. Como si todavía tuviera uno.'),
      N('Cuando Kazuha por fin se duerme, Renji se arrodilla en el piso del estudio y despega la cinta de enmascarar, de muro a muro, despacio para no hacer ruido. La enrolla en una bola del tamaño de un puño y se la guarda en el bolsillo.'),
    ],
    pregunta: 'Medio dormido, Kazuha estira la mano y agarra la manga de Renji. No la suelta. ¿Qué hace Renji?',
    opciones: [
      {
        id: 'kr06-frente',
        tono: 'tension',
        texto: 'Apoyar su frente en la de Kazuha «para medir la fiebre» y quedarse ahí',
        sigue: [
          N('Es lo que hacía su mamá. Eso se dice Renji. Es una técnica médica tradicional y no tiene nada de raro.'),
          R('blush', '...Sigues caliente. O sea. De temperatura. Con fiebre. Eso.', 'Tiene las pestañas blancas. De cerca son blancas. Llevo semanas mirándolo y no sabía.'),
          K('blush', 'Mides mal. Así no se… No te muevas.', 'Su frente está fría. Es agradable. Es por la fiebre que es agradable.', 'No abre los ojos. La cola, sin permiso de nadie, se enrosca en la muñeca de Renji.'),
        ],
      },
      {
        id: 'kr06-mano',
        tono: 'tierno',
        texto: 'Dejarle la manga, sentarse en el suelo junto al sillón y tomarle la mano hasta la mañana',
        sigue: [
          N('Renji se sienta en el piso, con la espalda contra el sillón. La espalda le va a pasar la cuenta. No le importa.'),
          R('neutral', 'Estoy aquí. Duerme. Hoy cuento yo las horas.', 'Tiene la mano más chica que la mía. Nunca me había fijado. Siempre está haciendo algo con ellas.'),
          N('Kazuha despierta al amanecer, sin fiebre, con la mano atrapada entre las dos de Renji, que duerme sentado con la boca abierta. Podría soltarse. Se queda mirando el techo cuarenta minutos más.'),
        ],
      },
      {
        id: 'kr06-cuento',
        tono: 'caos',
        texto: 'Narrarle de memoria un anime completo, con voces, hasta que se duerma',
        sigue: [
          R('smirk', 'Ya que me tienes secuestrado: temporada uno, episodio uno. Nuestro héroe es un samurái desempleado con problemas de azúcar…', 'Si hago las voces bien, quizás se ríe dormido.'),
          N('Hace todas las voces. Hace los efectos de sonido. En el episodio siete se emociona con su propia narración.'),
          K('smirk', '...El villano era el más sensato de todos.', 'Me dormí por aburrimiento. Eso voy a decir. No que su voz baja cuando narra y que me quedé escuchando hasta el final.', 'Lo murmura a la mañana siguiente, sin fiebre, revelando que no se durmió hasta el episodio doce.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: Kazuha despierta sano, sin cinta en el piso… y con una visita en la puerta que abraza a Renji demasiado.',
  }),

  // ------------------------------------------------------------------
  // ARCO IV — CELOS MAL DISIMULADOS
  // ------------------------------------------------------------------
  capitulo({
    n: 7,
    titulo: 'La Visita',
    subtitulo: 'Se llama Sora, estudió con Renji, lo abraza sin pedir permiso y trae una oferta de trabajo.',
    tropo: 'Celos (Desaprobación Territorial)',
    gancho: {
      a: ['renji', '¿Estás celoso, zorrito?'],
      b: ['kazuha', 'Los familiares no sentimos celos. Sentimos desaprobación territorial. Es completamente distinto.'],
      narrador: 'La cola de Kazuha tiene el doble de su volumen habitual. El té que acaba de servir está a noventa y ocho grados.',
    },
    cuadros: [
      N('Kazuha despierta sin fiebre. Lo primero que ve es el piso del estudio: madera lisa, de muro a muro. Donde estuvo la cinta queda apenas una línea más clara.'),
      K('neutral', 'Renji. La cinta. ¿Qué pasó con…?', '¿La quitó él? ¿Por qué? ¿Qué significa? ¿Tengo que preguntar qué significa?'),
      N('Suena el timbre. Tres veces, con ritmo.'),
      N('El que entra se llama Sora: compañero de Renji en la escuela de animación, ahora en un estudio enorme de la capital. Habla fuerte, se ríe fuerte, y lo primero que hace es colgarse del cuello de Renji y despeinarlo con las dos manos. Le dice «Ren-Ren».'),
      R('smirk', '¡Suelta, animal! ¡Me costó cuarenta segundos este peinado!', 'Sora no ha cambiado nada. …¿Por qué siento una corriente fría en la nuca?'),
      N('La corriente fría es Kazuha, de pie junto a la tetera, perfectamente inmóvil, con una sonrisa de cortesía que no le llega a ninguna parte de la cara.'),
      K('intense', 'Bienvenido. Tome asiento, por favor. Esa silla. No, esa. La otra.', 'La que cojea.', 'La reverencia es impecable. La cola, detrás, parece un plumero electrocutado.'),
      N('Sora mira las orejas, mira la cola, mira a Renji, y pregunta, divertido, si «ese» es su conserje.'),
      R('neutral', 'Es Kazuha.', 'No sé qué más decir. «Compañero» queda corto. Todo queda corto.', 'Lo dice así. Sin título, sin explicación, como si el nombre alcanzara.'),
      K('look-away', '...', 'No dijo «el familiar». No dijo «el que limpia». Dijo mi nombre como si fuera una respuesta completa. ¿Por qué eso es peor? ¿Por qué eso es mejor?'),
      N('Kazuha sirve el té. Está a noventa y ocho grados. Las galletas que lo acompañan son de una lata que lleva en la despensa desde antes de que Renji naciera.'),
      N('Sora, soplándose la lengua, va al grano: su estudio necesita un animador principal. Sueldo de verdad, equipo de verdad, horarios humanos. Empieza el próximo mes. En la capital. A seis horas de ahí. Deja una tarjeta sobre la mesa.'),
      R('look-away', '...Guau. Es harto. Lo voy a pensar.', 'Es todo lo que quería hace un año. ¿Por qué lo primero que hice fue mirar hacia la tetera?'),
      N('Se oye un «crac» muy pequeño. A Kazuha se le acaba de trizar la taza en la mano.'),
      K('neutral', 'Cerámica vieja. Pasa.', 'Seis horas. El próximo mes. Lo va a pensar.'),
      N('Sora se va con otro abrazo, más largo que el primero. Kazuha lo acompaña a la puerta, la cierra, y con mucha calma echa una pizca de sal en el umbral.'),
      R('smirk', '¿Acabas de echarle sal a mi amigo?'),
      K('intense', 'Es una costumbre de limpieza. No tiene nada de personal.'),
      R('smirk', 'Le diste la silla coja. El té hirviendo. Galletas del período Edo. Kazuha… ¿estás celoso?', 'Di que sí. No, no digas nada. No, di que sí.'),
      K('look-away', 'Los familiares no sentimos celos. Sentimos desaprobación territorial. Es completamente distinto y tiene base jurídica.', 'Lo abrazó dos veces. Yo no lo he abrazado ninguna. No es que lleve la cuenta.'),
      N('La tarjeta de Sora sigue sobre la mesa. Renji va a lavar las tazas (lava las tazas, ahora; desde cuándo). Kazuha se queda solo con ese rectángulo de cartón.'),
    ],
    pregunta: 'La tarjeta está ahí, con un número de teléfono y un futuro a seis horas de distancia. ¿Qué hace Kazuha?',
    opciones: [
      {
        id: 'kr07-mirada',
        tono: 'tension',
        texto: 'Ir hasta el lavaplatos, sostenerle la mirada a Renji y preguntar, muy bajo: «¿Vas a ir?»',
        sigue: [
          K('intense', '¿Vas a ir?', 'No tengo derecho a preguntar esto. Lo estoy preguntando igual.'),
          R('look-away', '...No sé. ¿Tú qué…?', 'Dime que no vaya. Dime una sola palabra y rompo la tarjeta.', 'Tiene las manos llenas de espuma y se le está cayendo el agua. No cierra la llave.'),
          N('Kazuha abre la boca. La cierra. Estira el brazo y cierra la llave del agua. Están muy cerca. Ninguno de los dos dice nada más, y esa noche ninguno duerme.'),
        ],
      },
      {
        id: 'kr07-tarjeta',
        tono: 'tierno',
        texto: 'Guardar la tarjeta en un lugar seguro para que Renji no la pierda, aunque le queme los dedos',
        sigue: [
          N('La pone en la carpeta de documentos importantes de Renji, la que el propio Kazuha le armó, entre el contrato de arriendo y la garantía de la tableta. Bien visible. Con un clip.'),
          K('neutral', 'Es una buena oferta. Sería un desperdicio que la perdieras entre cajas de leche.', 'Un familiar cuida lo que es bueno para su gente. Aunque lo bueno quede a seis horas.'),
          R('look-away', '...Sí. Gracias.', 'La guardó. Con clip. Quiere que vaya. Claro que quiere, por fin tendría el estudio limpio.', 'Es la primera vez que un «gracias» de Renji suena así de apagado.'),
        ],
      },
      {
        id: 'kr07-sal',
        tono: 'caos',
        texto: 'Barrer las huellas de Sora, echar más sal y «archivar» la tarjeta bajo la pata de la silla coja',
        sigue: [
          K('intense', 'La silla cojeaba. Necesitaba un calce. Reciclaje responsable.', 'No la boté. Técnicamente no la boté. Está en uso.'),
          R('smirk', 'Kazuha. ¿Esa es la tarjeta de Sora debajo de la silla?'),
          K('look-away', 'Es un cartón genérico de procedencia desconocida.'),
          R('look-away', 'Ya. …Oye. La silla quedó firme, eso sí.', 'No la voy a sacar de ahí. Todavía no sé qué significa que no la voy a sacar de ahí.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: «Haz lo que quieras». Tres palabras que Kazuha no quería decir y que Renji no quería oír.',
  }),

  capitulo({
    n: 8,
    titulo: 'Haz lo que Quieras',
    subtitulo: 'La primera pelea de verdad. Sin gritos, sin chistes y sin cinta en el piso.',
    tropo: 'La Pelea que Duele',
    gancho: {
      a: ['renji', 'Quité la cinta, Kazuha. ¿Qué creías que significaba?'],
      b: ['kazuha', '...Que se había gastado el pegamento.'],
      narrador: 'Afuera empieza a llover. Renji toma las llaves y deja la chaqueta.',
    },
    cuadros: [
      N('Pasan tres días. Nadie nombra la tarjeta. Kazuha limpia más que nunca; Renji bromea más que nunca. El estudio brilla y suena a risas, y está peor que en el capítulo uno.'),
      N('La tercera noche, Renji apaga el monitor a medio trabajo.'),
      R('neutral', 'Ya. No doy más. Dime algo, Kazuha. Lo que sea. ¿Voy o no voy?'),
      K('neutral', 'No me corresponde opinar. Es tu carrera.', 'No. No vayas. No.'),
      R('intense', 'No te pregunté qué te corresponde. Te pregunté qué quieres.'),
      K(
        'look-away',
        'Un familiar cuida el lugar y a quien lo habita. No retiene a nadie. La gente llega, crece y se va; así es el contrato y así ha sido doscientos años. No está en mi naturaleza pedir.',
        'Si lo pido y se queda, lo amarré. Si lo pido y se va igual… No. No voy a averiguar cuál de las dos.'
      ),
      K('neutral', 'Haz lo que quieras.'),
      N('Renji se ríe. Es una risa corta y fea, sin nada adentro.'),
      R(
        'intense',
        '«Haz lo que quieras.» ¿Tú sabes lo que cuesta sacarte una sola cosa que quieras tú? Llevo ocho capítulos intentándolo. Te corrí la silla para que te llegara el sol. Aprendí a hacer sopa. Me dormí en tu hombro, y eso que yo no me duermo en ninguna parte.',
        'Estoy diciendo todo. Sin remate. Se siente como saltar sin red.'
      ),
      R('intense', 'Quité la cinta, Kazuha. Me arrodillé en el piso a despegarla mientras dormías con fiebre. ¿Qué creías que significaba?'),
      K('look-away', '...Que se había gastado el pegamento.', 'Cobarde. Doscientos años y sigo siendo un cobarde.'),
      R('look-away', '...Claro. El pegamento.', undefined, 'Asiente despacio, varias veces, como alguien que acaba de leer un correo de dos líneas.'),
      R('neutral', 'Voy a tomar aire.', 'Si me quedo, voy a hacer un chiste para arreglarlo, y no quiero arreglarlo con un chiste.', 'Toma las llaves. Deja la chaqueta en el respaldo de la silla. La puerta no se azota; se cierra suave, que es peor.'),
      N('Empieza a llover.'),
      N('Kazuha hace lo único que sabe hacer: ordena. Recoge el lápiz de Renji, endereza su silla, abre el cajón de su escritorio para guardar la goma.'),
      N('En el cajón hay tres cosas. Una bola de cinta de enmascarar, del tamaño de un puño. Una servilleta de comida rápida, plastificada, con caligrafía a pincel en el artículo cuatro. Y una caja de leche lavada y recortada, con una etiqueta de letra horrible: «del zorro, no tocar».'),
      K(
        'shock',
        '...Lo guardó. Todo. Lo plastificó.',
        'Doscientos años cuidando las cosas de otros. Nadie había guardado nunca algo mío.',
        'Se sienta en la silla de Renji. Es la primera vez que se sienta sin que nadie se lo ordene.'
      ),
      K('intense', 'No se gastó el pegamento, idiota. Idiota yo. Idiota él por creerme.'),
      N('La lluvia arrecia contra los vidrios. En el respaldo de la silla, la chaqueta de Renji todavía está tibia. Junto a la puerta hay un solo paraguas.'),
    ],
    pregunta: 'Kazuha está frente a la puerta, con dos siglos de costumbre diciéndole que un familiar no persigue a nadie. ¿Cómo sale?',
    opciones: [
      {
        id: 'kr08-correr',
        tono: 'tension',
        texto: 'Corriendo bajo la lluvia, sin paraguas, con las orejas empapadas',
        sigue: [
          N('No piensa en el paraguas. No piensa en nada. Baja los cuatro pisos de dos en dos y sale a la calle con el haori pegándosele a la espalda.'),
          K('intense', '¡RENJI!', 'Que no se haya ido lejos. Que no se haya ido.', 'Es la primera vez en doscientos años que grita el nombre de alguien en plena calle.'),
          N('Su oído de zorro lo encuentra antes que sus ojos: un corazón conocido, arriba, muy arriba. En la azotea. Kazuha vuelve a entrar y sube corriendo, chorreando agua en cada peldaño que él mismo enceró.'),
        ],
      },
      {
        id: 'kr08-chaqueta',
        tono: 'tierno',
        texto: 'Con el paraguas y con la chaqueta de Renji: va a tener frío, el muy idiota',
        sigue: [
          K('neutral', 'Salió sin chaqueta. Con esta lluvia. Tiene la resistencia inmunológica de una galleta mojada.', 'Voy a llevársela. Y voy a decir algo. No sé qué. Algo.', 'Dobla la chaqueta sobre el brazo con el mismo cuidado que usa para la seda.'),
          N('En el bolsillo de la chaqueta hay un envoltorio de caramelo, un lápiz mordido y un papelito: una lista de compras con la letra de Renji. «Fideos. Leche. Té de jazmín (del bueno, el de la lata verde, para K).»'),
          K('blush', '...Del bueno. Sabe cuál es el bueno.', 'Arriba. Lo escucho arriba, en la azotea. Voy.'),
        ],
      },
      {
        id: 'kr08-zorro',
        tono: 'caos',
        texto: 'Transformándose en zorro para llegar más rápido (y resbalando gloriosamente en la escalera)',
        sigue: [
          N('Una voltereta, una nube de humo, y donde había un guardián solemne hay un zorro plateado de tamaño mediano y determinación enorme.'),
          N('La escalera está recién encerada. Por él. El zorro baja el primer tramo corriendo, el segundo rodando y el tercero deslizándose de espaldas con las cuatro patas al aire.'),
          K('intense', 'Nadie vio eso. Nadie vio eso.', 'La señora del tercero vio eso.', 'Ya de vuelta en su forma habitual, con una hoja en el pelo. Levanta las orejas: el corazón de Renji suena arriba, en la azotea. Era para el otro lado.'),
        ],
      },
    ],
    adelanto: 'Próximo episodio: una azotea, la lluvia, y Kazuha pidiendo algo para sí mismo por primera vez en doscientos años.',
  }),

  // ------------------------------------------------------------------
  // ARCO V — RENDICIÓN TOTAL
  // ------------------------------------------------------------------
  capitulo({
    n: 9,
    titulo: 'Sin Chistes',
    subtitulo: 'Una azotea bajo la lluvia. Una caja de leche de frutilla. Ninguna cuarta pared que valga.',
    tropo: 'Confesión Bajo la Lluvia',
    gancho: {
      a: ['kazuha', 'Cállate. Voy a decir algo y, si me interrumpes, no voy a poder terminarlo.'],
      b: ['renji', '...'],
      narrador: 'Por primera vez desde que se conocen, Renji obedece a la primera.',
    },
    cuadros: [
      N('La azotea del edificio tiene un estanque de agua oxidado, tres maceteros muertos y una vista decente de la ciudad bajo la lluvia. Renji está sentado contra el estanque, empapado, con una caja de leche de frutilla que no ha abierto.'),
      N('La puerta de la azotea se abre de golpe. Kazuha aparece en el umbral, sin aliento, mojado hasta las orejas, con cara de haber peleado contra una escalera.'),
      R('look-away', 'Te vas a resfriar otra vez, zorrito. Y mi sopa no ha mejorado.', 'Vino. Subió hasta acá. No te ilusiones, Renji, capaz que viene a decirte que cierres bien la puerta al irte.'),
      K('intense', 'Cállate. Voy a decir algo y, si me interrumpes, no voy a poder terminarlo.'),
      N('Renji cierra la boca.'),
      K(
        'intense',
        'El contrato dice que cuido el estudio. Eso dice. No dice nada de contar tus horas de sueño. No dice nada de comprar leche de frutilla sin que nadie me la pida. No dice que el estudio en silencio me resulte insoportable.',
        'Sigue. No pares. Si paras no vas a volver a partir.'
      ),
      K('look-away', 'No se gastó el pegamento. Lo sé. Lo supe apenas vi el piso. Te mentí porque la verdad me dio miedo.'),
      K(
        'intense',
        'En doscientos años nadie me enseñó a pedir. No sé cómo se hace. Así que lo voy a hacer mal, y te va a tocar aguantarlo.',
        'Dilo. Una palabra. Has sellado demonios con menos.',
        'Tiene los puños apretados y las orejas pegadas a la cabeza. Tiembla, y no es por la lluvia.'
      ),
      K('blush', 'Quédate.'),
      N('Llueve. Pasan cuatro segundos, que en una azotea son muchísimos.'),
      R('look-away', '...Le dije que no a Sora. Ayer. Lo llamé antes de que le sirvieras el té a temperatura de volcán.'),
      K('shock', '¿...Qué? ¡¿Y me dejaste sufrir un capítulo entero?!', '¿Acabo de decir «capítulo»? Me lo está contagiando.'),
      R(
        'neutral',
        'Quería oírtelo decir. Una sola vez. Que alguien me pidiera que me quedara por mí, no porque soy el que hace reír a la mesa. Perdón. …No. No perdón. Valió la pena.',
        'Lo dijo. «Quédate.» Con esa cara. Voy a vivir cien años de esa cara.'
      ),
      N('Renji se pone de pie. No mira hacia ninguna pared. No hay directora, ni cámara, ni público: solo un zorro mojado con los puños apretados.'),
      R('intense', 'Me gustas, Kazuha. Así. Sin remate. Sin chiste después.', 'Ya está. Lo dije. No se acabó el mundo. Creo.'),
      N('Silencio. La lluvia baja un poco, por respeto.'),
      R('blush', '...Okay, la pausa está muy larga, me estoy poniendo nervioso, voy a tener que decir algo sobre el presupuesto de animación de esta esce…'),
      K(
        'blush',
        'Ni uno. Ni un solo chiste.',
        'Tiene la boca tibia contra mi palma. Y está sonriendo. Lo siento sonreír.',
        'Le tapa la boca con la mano. La cola, empapada y decidida, se le enrosca a Renji en la muñeca y aprieta.'
      ),
    ],
    pregunta: 'Lluvia, azotea, la mano de Kazuha sobre la boca de Renji y la cola en su muñeca. ¿Qué hace Kazuha ahora?',
    opciones: [
      {
        id: 'kr09-frente',
        tono: 'tension',
        texto: 'Bajar la mano despacio y apoyar la frente contra la de Renji, bajo la lluvia',
        sigue: [
          N('La mano baja de la boca al mentón, del mentón al cuello de la polera, y ahí se queda, agarrada. Kazuha apoya la frente contra la de Renji. Tiene que ponerse un poco en puntas de pie. Ninguno de los dos lo va a mencionar jamás.'),
          K('blush', 'Todavía no. Aquí no. Estás helado, y la primera vez no va a ser con sabor a lluvia y a óxido de estanque.', 'Dije «la primera vez». Como si ya estuviera decidido. Está decidido.'),
          R('blush', '...¿Estás planificando nuestro primer beso con criterios de calidad?', 'Dijo «la primera vez». Hay una lista. Estoy en una lista de Kazuha. Es lo más romántico que me ha pasado.'),
          K('smirk', 'Alguien tiene que mantener los estándares en este estudio.'),
        ],
      },
      {
        id: 'kr09-tambien',
        tono: 'tierno',
        texto: 'Decirlo de vuelta, bajito y furioso: «…Yo también, idiota»',
        sigue: [
          K('blush', '...Yo también. Idiota. Desde el cojín de trigo sarraceno, probablemente. No me hagas repetirlo.', 'Lo dije. Sigo vivo. Qué extraño.'),
          R('blush', '¿Desde el COJÍN? ¡Eso fue el capítulo dos! ¡Yo creía que iba ganando!', 'Desde el cojín. Me quiero sentar en el suelo.'),
          N('Kazuha saca de la manga la chaqueta de Renji, o su propio haori, o lo que tenga a mano, y se lo pone encima con brusquedad. Es la forma más furiosa en que alguien ha abrigado a otra persona.'),
          K('look-away', 'Adentro. Ahora. Voy a hacerte un té. Y vas a reclamar que no tiene azúcar, como corresponde.'),
        ],
      },
      {
        id: 'kr09-estornudo',
        tono: 'caos',
        texto: 'Estornudar en el momento exacto y arruinarlo todo con chispas de fuego de zorro',
        sigue: [
          N('Kazuha baja la mano. Se inclina. La distancia se reduce a nada. Y entonces su nariz, traidora, hace lo suyo.'),
          K('shock', '¡ACHÍS!', undefined, 'El estornudo sale con una llamarada azul del tamaño de un melón, que pasa rozando la oreja de Renji y deja un macetero muerto ligeramente menos muerto.'),
          R('smirk', '...Me estornudaste fuego. En la cara. En mi confesión.', 'Lo adoro. Es un desastre. Lo adoro.'),
          K('look-away', 'Los kitsune no nos resfria…', undefined, 'No alcanza a terminar. Renji se está riendo tanto que tiene que afirmarse en él, y Kazuha, por primera vez, lo deja.'),
        ],
      },
    ],
    adelanto: 'Final de temporada: una mañana cualquiera, un rollo de cinta nuevo, y lo que pasa cuando por fin nadie interrumpe.',
  }),

  capitulo({
    n: 10,
    titulo: 'Rendición Total',
    subtitulo: 'Final de temporada. Dos resfriados, ocho cajas de leche y un territorio nuevo.',
    tropo: 'Final de Temporada',
    gancho: {
      a: ['kazuha', '¿Un rollo de cinta? ¿Otra vez? Renji, si vuelves a dividir este estudio te juro que…'],
      b: ['renji', 'Tranquilo, zorrito. Esta vez la frontera es otra.'],
      narrador: 'Renji está arrodillado en el piso, con cinta de enmascarar entre los dientes y la sonrisa más peligrosa de toda la temporada.',
    },
    cuadros: [
      N('Sábado, 10:30. Hay sol. En el estudio suenan dos estornudos perfectamente sincronizados.'),
      K('look-away', 'Los kitsune no nos resfriamos.', 'Dos veces en un mes. Esto es culpa suya. Todo es culpa suya. No cambiaría nada.', 'Lo dice envuelto en una manta, con la nariz roja y dos tazas de té en una bandeja.'),
      R('smirk', 'Claro que no. Eso que tienes es desaprobación territorial de las vías respiratorias.'),
      si('kr02-mano', N('En la pared, enmarcada, cuelga la servilleta plastificada. Debajo, Renji agregó una nota: «Sellado con apretón de manos. Ninguno soltó primero. Sigue vigente.»')),
      si('kr02-sello', N('En la pared, enmarcada, cuelga la servilleta plastificada. El artículo cinco, el de letra chica, está subrayado con rojo: «Renji almuerza todos los días». Sobre el escritorio hay una caja de almuerzo con divisiones.')),
      si('kr02-huella', N('En la pared, enmarcada, cuelga la servilleta plastificada, firmada con un brochazo de cola. En el perchero, sin lavar, cuelga un polerón con la misma firma en la manga.')),
      siNinguna(['kr02-mano', 'kr02-sello', 'kr02-huella'], N('En la pared, enmarcada, cuelga la servilleta plastificada: la «Constitución del Estudio», con manchas de frutilla en una esquina y caligrafía de pergamino en el artículo cuatro.')),
      N('Renji saca del cajón un rollo de cinta de enmascarar. Nuevo.'),
      K('shock', '¿Un rollo de cinta? ¿Otra vez? Renji, si vuelves a dividir este estudio te juro que…', '¿Se arrepintió? ¿Fue la fiebre? ¿Fue el estornudo?'),
      R('smirk', 'Tranquilo, zorrito. Esta vez la frontera es otra.'),
      N('Se arrodilla y pega cuatro tiras en el piso: un cuadrado que encierra las dos sillas, los dos escritorios y el rectángulo de sol de la tarde. Adentro deja la bola de cinta vieja, como una piedra fundacional.'),
      R('neutral', 'Territorio compartido. Artículo único: aquí adentro no hay tu lado ni mi lado.', 'Si se ríe de esto me muero. Si no se ríe, también.'),
      K(
        'look-away',
        '...Te quedó chueca la esquina.',
        'Territorio compartido. Lo dijo como si nada. Voy a necesitar sentarme.',
        'Se arrodilla junto a él, despega la esquina y la vuelve a pegar perfectamente recta. Sus hombros quedan tocándose. No se aparta.'
      ),
      K('neutral', 'Si vas a hacer algo, hazlo derecho. Y hay almuerzo. Con verduras. No es negociable.'),
      R('smirk', 'Sí, mi general. …Oye, ¿y esa bolsa del almacén?'),
      K('look-away', 'No sé de qué bolsa hablas.'),
      R('shock', 'Kazuha. Aquí hay siete cajas de leche de frutilla.'),
      K('smirk', 'Ocho. Hay una detrás del monitor.'),
      N('Renji lo mira. Se le va la sonrisa de payaso y le queda la otra, la que casi nadie ha visto: chica, torcida, sin defensa.'),
      R(
        'neutral',
        'Oye, directora. Sí, tú. Gracias por los cinco minutos. Todos. Cada vez que partiste aunque no tenías ganas, acá pasó algo. Ahora mira para otro lado un ratito, ¿ya?',
        undefined,
        'Lo dice hacia el punto vacío de siempre, donde estaría la cámara.'
      ),
      K('neutral', '¿A quién le…?', 'Siempre le habla a ese rincón. Siempre.', 'Se detiene. Por primera vez en toda la temporada, Kazuha gira la cabeza y mira hacia allá también. Directo. Las orejas se le inclinan, curiosas.'),
      K('look-away', '...Gracias. Quienquiera que seas. Y recoge tus tazas.'),
    ],
    pregunta: 'Un cuadrado de cinta, sol de sábado y por fin nadie que interrumpa. ¿Cómo es el primer beso?',
    opciones: [
      {
        id: 'kr10-primero',
        tono: 'tension',
        texto: 'Kazuha lo agarra del cuello de la polera y lo besa primero, harto de esperar',
        sigue: [
          K('intense', 'Doscientos años de paciencia y tú me la gastaste en diez capítulos.', undefined, 'Lo agarra con las dos manos y tira.'),
          N('No es un beso tímido. Es el beso de alguien que por fin pidió algo y descubrió que se lo daban. Renji tarda un segundo entero en reaccionar, que para él es un récord de lentitud, y después le pone una mano en la nuca, justo bajo el pelo plateado.'),
          R('blush', '...Okay. Okay. Retiro todo lo que dije sobre los capítulos de clóset. Este es mi favorito.', 'Me besó él. ME BESÓ ÉL. Que alguien me anime esto en veinticuatro cuadros por segundo.'),
          K('blush', 'Cállate. Y ven acá otra vez.', 'Sabe a frutilla. Era obvio. No me molesta. Que nadie se entere de que no me molesta.'),
        ],
      },
      {
        id: 'kr10-lento',
        tono: 'tierno',
        texto: 'Un beso lento, torpe, con sabor a té de jazmín y a frutilla',
        sigue: [
          N('Chocan las narices. Los dos van hacia el mismo lado, corrigen hacia el mismo lado, y Renji suelta una risa bajita contra su boca.'),
          R('blush', 'Perdón. Es que nunca había querido que algo me saliera tan bien.'),
          K('blush', 'Quédate quieto. Yo te guío. Cinco tiempos, ¿te acuerdas?', 'Como en el clóset. Adentro, afuera. Solo que ahora el que no puede respirar soy yo.', 'Le toma la cara con las dos manos, con el cuidado con que sostiene las tazas antiguas.'),
          N('Es lento y es torpe y sabe a jazmín y a frutilla, que no deberían combinar y combinan. Cuando se separan, la cola de Kazuha está enroscada en la cintura de Renji. Ninguno de los dos dice nada. No hace falta.'),
        ],
      },
      {
        id: 'kr10-risa',
        tono: 'caos',
        texto: 'Estornudan los dos a un centímetro de distancia, se ríen… y el beso llega igual, entre risas',
        sigue: [
          N('Se acercan. Cierran los ojos. Y estornudan los dos, a la vez, con una precisión que ningún animador podría sincronizar a propósito. Una chispa azul sale volando y enciende la vela de la repisa.'),
          R('smirk', '¡Iluminación ambiental! ¡El zorro trae efectos especiales incluidos!'),
          K('smirk', 'Eres insoportable. Eres la persona más insoportable que he conocido en dos siglos.', 'Y no cambiaría ni una coma.', 'Se está riendo. De verdad, sin disfrazarlo de tos. Lo besa a mitad de la risa.'),
          N('Es un beso con risas adentro, interrumpido dos veces por la nariz de alguien. A la luz de una vela que nadie pensaba encender. Es, objetivamente, un desastre. Es perfecto.'),
        ],
      },
    ],
    adelanto: 'Temporada 2, próximamente: el primer aniversario de la cinta, la mamá de Renji quiere conocer «al zorrito», y alguien tiene que explicarle a Kazuha qué es exactamente una cita.',
  }),
];

// Lo que se muestra en la portada cuando ya leyó los 10 capítulos.
export const ESPERA_KAZUHA_RENJI: BLChapter = {
  id: 'kr-t2-espera',
  shipId: 'kazuha-renji',
  chapterNumber: 11,
  title: 'Temporada 2 — En producción',
  subtitle: 'La Temporada 1 está completa. Puedes releerla entera más abajo.',
  contextTrigger: 'any',
  tropeTag: 'Temporada 1 completa',
  cliffhangerPreview: {
    speakerA: 'renji',
    lineA: 'Directora, llegaste al final. Los animadores estamos dibujando la Temporada 2 lo más rápido que nos deja el zorro.',
    speakerB: 'kazuha',
    lineB: 'Los dejo trabajar cuando almuerzan. Tú sigue con tus cinco minutos: cada bloque te da Plumas para las cartas de tropo.',
    narratorHook: 'Mientras llega la Temporada 2, cada bloque completado suma Plumas extra.',
  },
  beats: [],
  choicePrompt: '',
  choices: [],
  nextCliffhangerTeaser: '',
};

// Chats y cuadernos secretos. "unlockRequirementSessions" aquí cuenta capítulos
// leídos de ESTA pareja, para que ningún secreto adelante la historia.
export const SECRETOS_KAZUHA_RENJI: SecretLog[] = [
  {
    id: 'log-kr-t1-chat1',
    shipId: 'kazuha-renji',
    title: 'Chat Oculto — 02:53 AM: «¿Los zorros duermen?»',
    unlockRequirementSessions: 2,
    type: 'chat-3am',
    summary: 'La primera vez que Renji le escribió a Kazuha de madrugada. Oficialmente, por un asunto del tratado.',
    chatMessages: [
      { sender: 'renji', time: '02:53 AM', text: 'Consulta constitucional: ¿los zorros duermen?', deletedDraft: 'Gracias por el cojín. Hace dos años que me dolía la espalda y nadie se había dado cuenta.' },
      { sender: 'kazuha', time: '02:54 AM', text: 'Los zorros con vecinos ruidosos, no.', deletedDraft: '¿Por qué estás despierto? ¿Comiste?' },
      { sender: 'renji', time: '02:54 AM', text: 'Ah, perfecto, entonces estás disponible. ¿El artículo 2 cubre el microondas o solo el refrigerador?' },
      { sender: 'kazuha', time: '02:56 AM', text: 'Solo el refrigerador. Duérmete, Renji.', deletedDraft: 'El microondas también. Lo que quieras. Pero duerme.' },
      { sender: 'renji', time: '02:57 AM', text: 'Buenas noches, zorrito.', deletedDraft: 'Me gusta que me contestes al tiro.' },
    ],
  },
  {
    id: 'log-kr-t1-storyboard',
    shipId: 'kazuha-renji',
    title: 'Margen del Storyboard de Renji',
    unlockRequirementSessions: 4,
    type: 'sketchbook-note',
    summary: 'Seis viñetas dibujadas en el borde de una entrega, donde debería haber notas de cámara.',
    sketchbookEntry: {
      author: 'renji',
      subject: 'kazuha',
      dateLabel: 'Hoja 14 del storyboard — margen derecho',
      sketchCaption: 'Seis cuadros a lápiz azul: una cola de zorro acercándose a una línea en el piso, tanteándola, cruzándola de a poco y quedándose dormida al sol del otro lado.',
      monologue:
        'Se supone que acá va «paneo lento a la derecha». Llevo veinte minutos dibujando una cola. Tiene más actuación que mi protagonista. Él cree que no se le nota nada; la cola le cuenta todo al que quiera mirar.',
      marginNote: 'Nota al margen: BORRAR ANTES DE ENTREGAR. (No lo borró. El cliente preguntó si el zorro era un personaje nuevo.)',
    },
  },
  {
    id: 'log-kr-t1-bitacora',
    shipId: 'kazuha-renji',
    title: 'Bitácora del Familiar: «Registro de Mantenimiento»',
    unlockRequirementSessions: 6,
    type: 'sketchbook-note',
    summary: 'El cuaderno donde Kazuha anota el estado del estudio. Últimamente anota otra cosa.',
    sketchbookEntry: {
      author: 'kazuha',
      subject: 'renji',
      dateLabel: 'Día 41 del contrato actual',
      sketchCaption: 'Columnas a pincel, impecables: «Piso: encerado. Ventanas: limpias. Horas de sueño de R.: 6 (mejora). Almuerzo de R.: completo, dejó el brócoli. Risa de R.: 14 veces, 3 de las fingidas.»',
      monologue:
        'Este registro es para el estado del taller. No sé en qué momento agregué la última columna. He aprendido a distinguir la risa que usa para los demás de la que se le escapa. La segunda es más corta y le cierra un ojo. Hoy la escuché once veces. Estoy llevando la cuenta de la risa de un humano. Debería consultar a alguien.',
      marginNote: 'Nota al margen, con otra tinta, fechada después de la fiebre: «No me fui a mi lado. —R.» (Kazuha no ha arrancado la hoja.)',
    },
  },
  {
    id: 'log-kr-t1-chat2',
    shipId: 'kazuha-renji',
    title: 'Chat Oculto — 03:20 AM: «Estás a tres metros»',
    unlockRequirementSessions: 9,
    type: 'chat-3am',
    summary: 'La noche de la azotea. Los dos resfriados, los dos despiertos, cada uno en su sillón.',
    chatMessages: [
      { sender: 'renji', time: '03:20 AM', text: '¿Estás despierto?' },
      { sender: 'kazuha', time: '03:20 AM', text: 'Estás a tres metros. Te escucho teclear. Y sorber.', deletedDraft: 'No puedo dormir. Cada vez que cierro los ojos estoy de nuevo en la azotea.' },
      { sender: 'renji', time: '03:21 AM', text: 'Es que si te lo digo en voz alta se me va a escapar un chiste, y me prohibiste los chistes.', deletedDraft: 'Dijiste «quédate». Lo tengo en repetición.' },
      { sender: 'kazuha', time: '03:22 AM', text: 'Te los prohibí por cinco minutos. No de por vida. ¿Qué querías decir?', deletedDraft: 'Me gustan tus chistes. No todos. La mayoría. No se lo voy a decir.' },
      { sender: 'renji', time: '03:24 AM', text: 'Que no fue por el frío ni por la lluvia. Lo que dije. Por si mañana te entra la duda.' },
      { sender: 'kazuha', time: '03:27 AM', text: 'No me va a entrar. Duérmete. Mañana hay que comprar cinta.', deletedDraft: 'Yo tampoco. Lo mío tampoco fue por la lluvia. Yo también. Yo también. Yo también.' },
    ],
  },
];
