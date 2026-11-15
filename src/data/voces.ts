// =====================================================================
// VOCES: todo lo que la app le dice a ella lo dicen los personajes.
// Cada clave tiene una o más frases por personaje; se elige una distinta
// según el día para que no se repita siempre la misma.
// {nombre} se reemplaza por el nombre del otro chico de la pareja.
// =====================================================================
import { CharacterId, CharacterProfile } from '../types';

export type Clave =
  | 'saludoManana'
  | 'saludoTarde'
  | 'saludoNoche'
  | 'saludoMadrugada'
  | 'invitar'
  | 'donde'
  | 'eligeRamo'
  | 'entregaPropia'
  | 'bloqueada'
  | 'bloqueadaResultado'
  | 'inicioTimer'
  | 'pausa'
  | 'finTimer'
  | 'capituloListo'
  | 'temporadaFin'
  | 'bloqueTerminado'
  | 'capitulosVacio'
  | 'capitulosIntro'
  | 'secretosIntro'
  | 'secretosVacio'
  | 'secretoBloqueado'
  | 'cartasIntro'
  | 'sinPlumas'
  | 'parejaIntro'
  | 'respaldoIntro'
  | 'respaldoGuardado'
  | 'respaldoRecuperado'
  | 'respaldoRecordar';

type Voz = Record<Clave, string[]>;

const VOCES: Record<CharacterId, Voz> = {
  kazuha: {
    saludoManana: [
      'Ya era hora. El té está listo y tú todavía tienes cara de almohada.',
      'Buenos días, humana. No mires todo lo que tienes pendiente. Mírame a mí.',
    ],
    saludoTarde: [
      'Volviste. Bien. ¿Comiste algo de verdad o fue otra galleta?',
      'La tarde se pasa rápido si te quedas pensando. Mejor hacemos algo chico.',
    ],
    saludoNoche: [
      'Es tarde. Una sola cosa y después te vas a dormir. No es una sugerencia.',
      'Te estaba esperando. No porque me preocupe. Solo… te estaba esperando.',
    ],
    saludoMadrugada: [
      '¿Despierta a esta hora? Cinco minutos y a la cama. Yo vigilo.',
    ],
    invitar: [
      'Cinco minutos. Yo cuento el tiempo, tú solo partes.',
      'No tienes que terminar nada. Solo empezar. Eso sí lo puedes hacer.',
    ],
    donde: ['¿Qué te tiene trabada hoy? Dime y yo decido por dónde se empieza.'],
    eligeRamo: ['¿Cuál ramo te pesa más? Elige uno. Los demás los guardo yo.'],
    entregaPropia: ['¿Hay una entrega que te da miedo abrir? Dímela. La partimos en chiquito.'],
    bloqueada: [
      'Te congelaste otra vez, ¿cierto? Escríbeme qué cosas te chocan en la cabeza. Yo bloqueo todas menos una.',
    ],
    bloqueadaResultado: ['Listo. Todo lo demás queda bajo llave. Hoy solo esto, y nada más.'],
    inicioTimer: ['Empezamos. No mires el resto de la pieza. Solo esto.'],
    pausa: ['Pausa. Está bien. Respira, aquí sigo.'],
    finTimer: ['Lo hiciste. …No me mires así. Estoy orgulloso, nada más.'],
    capituloListo: ['Te ganaste el capítulo. Léelo. Y no comentes mi cara en la página tres.'],
    temporadaFin: [
      'Ya lo leíste todo. Los que dibujan la segunda parte van lento, yo les reclamo. Mientras, cada bloque te da Plumas.',
    ],
    bloqueTerminado: ['Bloque cumplido. Treinta Plumas. Úsalas para meternos en problemas, si quieres.'],
    capitulosVacio: ['Todavía no hay nada que releer. El primero se gana con cinco minutos.'],
    capitulosIntro: ['Todo lo que ya viste. Puedes volver cuando quieras. Yo no voy a decir nada.'],
    secretosIntro: ['Esto es privado. …Si lo vas a leer igual, por lo menos no se lo cuentes a {nombre}.'],
    secretosVacio: ['No tenemos secretos. Ninguno. …Todavía.'],
    secretoBloqueado: ['Eso no. Todavía no.'],
    cartasIntro: ['Con tus Plumas puedes obligarnos a vivir una escena. Abusas de ese poder, lo sé.'],
    sinPlumas: ['Te faltan Plumas. Un bloque de cinco minutos y vuelves.'],
    parejaIntro: ['¿Quieres ver otra historia? Ve. Aquí te guardo el lugar.'],
    respaldoIntro: ['Tu avance vive solo en este celular. Si se borra, se borra todo, y no pienso volver a explicarte el capítulo uno. Guarda una copia. Ahora.'],
    respaldoGuardado: ['Listo. Guárdalo donde no lo pierdas. En tu chat contigo misma, por ejemplo. No en el desorden de tu galería.'],
    respaldoRecuperado: ['Ya estás aquí otra vez, con todo en su lugar. …No me había preocupado. Nada.'],
    respaldoRecordar: ['Hace tiempo que no guardas una copia de tu avance. Hazlo. No es una sugerencia.'],
  },

  renji: {
    saludoManana: [
      'Buenos días, directora. Ya desayuné. Leche de frutilla. Es un lácteo, cuenta.',
      'Ah, llegaste. Te guardé el lado de la mesa con sol.',
    ],
    saludoTarde: [
      'Directora. La tarde es ideal para hacer una cosa chiquita y sentirse una heroína.',
      'Volviste. Estaba fingiendo trabajar, pero ahora puedo fingir contigo.',
    ],
    saludoNoche: [
      'Horario estelar. A esta hora los capítulos pegan más fuerte. Cinco minutos y te cuento algo.',
      'Hola, directora. Noche de entrega, ¿cierto? Te acompaño.',
    ],
    saludoMadrugada: ['¿Tú también despierta a esta hora? Club de las tres de la mañana. Hagamos algo cortito.'],
    invitar: [
      'Cinco minutos sin dignidad. Mal hecho también cuenta.',
      'Partimos feo y después vemos. Así se hace en todos los estudios del mundo.',
    ],
    donde: ['¿Qué jefe final te toca hoy? ¿La pieza o la U?'],
    eligeRamo: ['Elige un ramo. Uno. Los otros se van a la banca.'],
    entregaPropia: ['¿Hay una entrega con nombre y apellido que te persigue? Escríbela y la bajamos de nivel.'],
    bloqueada: [
      'Parálisis por análisis, clásico. Tírame las cosas que te dan vueltas y elegimos una a la suerte. Las otras se van por la ventana.',
    ],
    bloqueadaResultado: ['Decidido. Lo demás está prohibido por ley hasta mañana.'],
    inicioTimer: ['Corre el tiempo. No mires el reloj, mírame a mí. Bueno, no. Mira la tarea.'],
    pausa: ['Pausa técnica. Aprovecho de tomar leche.'],
    finTimer: ['¡Terminaste! Directora, eso fue una escena de acción.'],
    capituloListo: ['Capítulo desbloqueado. Agárrate, que en este me sale una cara rara.'],
    temporadaFin: [
      'Llegaste al final de la temporada, directora. Estamos animando la segunda. Mientras, cada bloque paga Plumas extra.',
    ],
    bloqueTerminado: ['Bloque listo. Treinta Plumas al bolsillo. Gástalas en algo que me haga sufrir.'],
    capitulosVacio: ['Aquí van los capítulos que te ganes. Por ahora, estante vacío. Triste. Arreglémoslo.'],
    capitulosIntro: ['El archivo de la temporada. Puedes repetir capítulos. Yo no los vuelvo a actuar igual de bien, eso sí.'],
    secretosIntro: ['Los chats de madrugada. No los leas en voz alta, por favor. Bueno, sí, léelos.'],
    secretosVacio: ['No hay chats todavía. {nombre} no contesta los mensajes, ese es el problema.'],
    secretoBloqueado: ['Spoiler. No te lo puedo mostrar todavía.'],
    cartasIntro: ['Tienes poder de directora. Paga Plumas y nos metes en un tropo. Sé cruel.'],
    sinPlumas: ['Sin Plumas, sin escena. Un bloque de cinco y vuelves rica.'],
    parejaIntro: ['¿Me vas a cambiar por otra historia? Bueno. Aquí te espero. Con leche.'],
    respaldoIntro: ['Directora, dato técnico: todo lo que vivimos está guardado solo en este teléfono. Si se cae al inodoro, nos vamos con él. Haz un respaldo, por si acaso.'],
    respaldoGuardado: ['Respaldo hecho. Mándatelo por WhatsApp a ti misma, que ahí nada se pierde. Bueno, casi nada.'],
    respaldoRecuperado: ['¡Volviste con todo! Capítulos, Plumas, decisiones. Como si nada. Mejor que un guardado de PlayStation.'],
    respaldoRecordar: ['Oye, hace rato que no respaldas. No quiero perder la temporada por un celular mojado.'],
  },

  noctis: {
    saludoManana: [
      'Buenos días. Abrí la ventana. Hoy la luz está suave, como para empezar algo chico.',
    ],
    saludoTarde: [
      'Hola. ¿Cómo va la cabeza? Si está ruidosa, hagamos una sola cosa, en silencio.',
    ],
    saludoNoche: [
      'Volviste. A esta hora todo se siente más pesado. Por eso hagamos solo un trazo.',
    ],
    saludoMadrugada: ['Yo tampoco puedo dormir. Hagamos algo pequeño juntos, y después descansas.'],
    invitar: ['El primer trazo no tiene que ser bonito. Solo tiene que existir.'],
    donde: ['¿Dónde se siente el ruido hoy? ¿En tu pieza o en la U?'],
    eligeRamo: ['Elige solo uno. Los demás pueden esperar, de verdad.'],
    entregaPropia: ['Si hay algo que te asusta abrir, escríbelo aquí. Lo hacemos más pequeño.'],
    bloqueada: ['Cuando todo parece urgente, nada se mueve. Escríbeme lo que te da vueltas. Elijo una por ti.'],
    bloqueadaResultado: ['Ya. Solo esto. Lo demás lo guardo yo hasta que vuelvas.'],
    inicioTimer: ['Empezamos. Respira. No hace falta que salga bien.'],
    pausa: ['Está bien parar un poco. Te espero.'],
    finTimer: ['Lo hiciste. ¿Ves? El primer trazo ya está.'],
    capituloListo: ['Te ganaste esto. Léelo despacio.'],
    temporadaFin: ['Ya leíste todo lo que existe por ahora. Lo que viene se está pintando. Cada bloque te da Plumas mientras.'],
    bloqueTerminado: ['Bloque terminado. Treinta Plumas. Te las ganaste.'],
    capitulosVacio: ['Todavía no hay páginas. La primera llega con cinco minutos.'],
    capitulosIntro: ['Todo lo que hemos vivido hasta ahora. Puedes volver a cualquier página.'],
    secretosIntro: ['Cosas que no le dije a nadie. Ten cuidado con ellas.'],
    secretosVacio: ['Todavía no escribo nada sobre {nombre}. …O no lo he dejado ver.'],
    secretoBloqueado: ['Esta página todavía está en blanco para ti.'],
    cartasIntro: ['Con tus Plumas puedes pintarnos una escena distinta. Elige con cariño.'],
    sinPlumas: ['Te faltan Plumas. Cinco minutos más y la tenemos.'],
    parejaIntro: ['¿Otra historia? Ve tranquila. Aquí queda todo como lo dejaste.'],
    respaldoIntro: ['Lo que hemos vivido está guardado solo aquí, en este teléfono. Si quieres, guarda una copia. Así no se pierde nada.'],
    respaldoGuardado: ['Ya está. Guárdalo en algún lugar tranquilo. Con eso basta.'],
    respaldoRecuperado: ['Volviste. Todo está donde lo dejaste.'],
    respaldoRecordar: ['Hace un tiempo que no guardas una copia. Cuando puedas, sin apuro.'],
  },

  vesper: {
    saludoManana: [
      'Buenos días. El telón sube. Hoy la función es breve: cuatro movimientos, nada más.',
    ],
    saludoTarde: [
      'Llegas a mitad del segundo acto. No importa. Siempre se puede entrar a escena.',
    ],
    saludoNoche: [
      'La función nocturna. Mi favorita. Un solo acto y bajamos el telón.',
    ],
    saludoMadrugada: ['¿A esta hora en el escenario? Qué dramático. Un acto breve y te retiras.'],
    invitar: ['Toda obra maestra empieza con un movimiento torpe. Haz el tuyo.'],
    donde: ['¿Dónde está el desorden hoy, en tu habitación o en tu obra?'],
    eligeRamo: ['Elige el acto que interpretarás. Uno solo.'],
    entregaPropia: ['¿Una obra concreta que te intimida? Nómbrala. Le haremos un ensayo pequeño.'],
    bloqueada: ['Demasiados actos a la vez arruinan la función. Escríbelos. Yo elijo cuál sube al escenario.'],
    bloqueadaResultado: ['Decidido. El resto queda tras bambalinas.'],
    inicioTimer: ['Comienza la función. Cuatro tiempos. Uno.'],
    pausa: ['Intermedio. Se permite.'],
    finTimer: ['Telón. Impecable. …Casi impecable. Suficiente.'],
    capituloListo: ['Te ganaste tu asiento en primera fila. Adelante.'],
    temporadaFin: ['La temporada terminó. La próxima se ensaya. Mientras tanto, cada acto te paga Plumas.'],
    bloqueTerminado: ['Acto cumplido. Treinta Plumas. Bien interpretado.'],
    capitulosVacio: ['Aún no hay actos que repetir. El primero se gana en cinco minutos.'],
    capitulosIntro: ['El repertorio hasta ahora. Puedes repetir cualquier función.'],
    secretosIntro: ['Notas privadas. Leerlas es casi indecente. Adelante.'],
    secretosVacio: ['No dejo notas sobre {nombre}. Por ahora.'],
    secretoBloqueado: ['Esa escena aún no se representa.'],
    cartasIntro: ['Con Plumas puedes reescribir el guion. Elige bien el tropo.'],
    sinPlumas: ['Faltan Plumas. Un acto de cinco minutos lo resuelve.'],
    parejaIntro: ['¿Cambiar de obra? Las demás también te esperan. Esta no se va a ninguna parte.'],
    respaldoIntro: ['Toda la función está escrita solo en este teléfono. Un buen director siempre guarda una copia del libreto. Hágalo.'],
    respaldoGuardado: ['Copia guardada. Consérvela fuera de escena: en un chat, en sus notas.'],
    respaldoRecuperado: ['El telón vuelve a subir exactamente donde bajó. Bienvenida de vuelta.'],
    respaldoRecordar: ['Hace tiempo que no respalda el libreto. Ningún teatro sobrevive sin copia.'],
  },
};

// Elige una frase estable durante el día (cambia al día siguiente).
function elegir(lista: string[], semilla: string): string {
  const dia = new Date().toDateString();
  let h = 0;
  for (const c of semilla + dia) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return lista[h % lista.length];
}

export interface Linea {
  char: CharacterProfile;
  texto: string;
}

// El "guía" del día alterna entre los dos chicos de la pareja.
export function guias(a: CharacterProfile, b: CharacterProfile): [CharacterProfile, CharacterProfile] {
  const dia = Math.floor(Date.now() / 86_400_000);
  return dia % 2 === 0 ? [a, b] : [b, a];
}

export function dice(char: CharacterProfile, otro: CharacterProfile, clave: Clave): Linea {
  const texto = elegir(VOCES[char.id][clave], `${char.id}-${clave}`).replace(/\{nombre\}/g, otro.name);
  return { char, texto };
}

export function claveSaludo(): Clave {
  const h = new Date().getHours();
  if (h < 5) return 'saludoMadrugada';
  if (h < 12) return 'saludoManana';
  if (h < 20) return 'saludoTarde';
  return 'saludoNoche';
}
