// =====================================================================
// PRESENTACIÓN: lo que cada chico le dice a ella la primera vez que entra,
// y lo que dicen cuando ella los empareja ("{nombre}" = el otro).
// =====================================================================
import { CharacterId } from '../types';

export interface Presentacion {
  // Tres frases que dice al presentarse, una tras otra.
  intro: [string, string, string];
  // Cómo es enamorado, en una línea (lo ve ella, no lo dice él).
  enamorado: string;
  // Lo que dice al quedar emparejado con el otro.
  elegido: string;
  // Su promesa de fidelidad.
  promesa: string;
  // Lo que dice cuando su historia termina.
  final: string;
}

export const PRESENTACION: Record<CharacterId, Presentacion> = {
  kazuha: {
    intro: [
      'Ah. Llegaste. Soy Kazuha, guardián de esta casa desde hace doscientos años. No, no te voy a dar la mano; tengo garras.',
      'Mi trabajo es cuidar a quien vive aquí. Hago té, ordeno, regaño. Mucho. Es parte del servicio.',
      'Si te quedas, voy a vigilar que comas y que duermas. No es cariño. Es protocolo. …Bienvenida.',
    ],
    enamorado: 'Gruñe, regaña y cuida en secreto. Sus orejas lo delatan siempre.',
    elegido: '¿Con {nombre}? …Hmf. Podría ser peor. No mucho peor, pero podría.',
    promesa: 'Un familiar sirve a una sola casa. Mientras dure esta historia, no miro a nadie más. Es un juramento, no una opinión.',
    final: 'Se terminó. …No me mires así. No estoy llorando. Es el vapor del té.',
  },
  renji: {
    intro: [
      '¡Hola, directora! Renji, animador, adicto a la leche de frutilla y a los chistes malos. Gracias por venir.',
      'Sí, te digo «directora». Tú decides qué pasa en esta historia, yo solo actúo. Y hago caras raras.',
      'Te aviso una cosa: hago reír a todo el mundo. Lo que me cuesta es que alguien se quede cuando dejo de hacerlo.',
    ],
    enamorado: 'Bromea para esconderse, hasta que alguien le ve la cara de verdad.',
    elegido: '¿Yo con {nombre}? Directora, tienes buen ojo. O muy malo. Lo vamos a averiguar juntos.',
    promesa: 'Puedo ser un payaso, pero no soy de los que se van con otro a mitad de temporada. Hasta el final, palabra.',
    final: 'Fin de temporada. Sin chiste. …Gracias por quedarte hasta el último capítulo, directora.',
  },
  noctis: {
    intro: [
      'Hola. Soy Noctis. Dibujo. Hablo poco; perdón si parezco frío, es que me cuesta.',
      'Me gustan las manos, la luz de las tres de la mañana y el silencio. Bueno, no siempre el silencio.',
      'Si alguna vez te sientes bloqueada frente a algo en blanco, yo te entiendo. Hagámoslo de a un trazo.',
    ],
    enamorado: 'Callado, observador. Se enamora mirando, y lo dibuja antes de decirlo.',
    elegido: '¿Con {nombre}? …Está bien. Me pone nervioso. Eso es buena señal, creo.',
    promesa: 'Yo no sé querer a medias. Si es con {nombre}, es solo con {nombre}. Hasta que se cierre la última página.',
    final: 'Llegamos al final. Voy a guardar cada página. Gracias por leernos despacio.',
  },
  vesper: {
    intro: [
      'Buenas noches. Vesper, director. Le ruego que no se acerque a menos de cuatro pasos; es una norma, no algo personal.',
      'Todo en mi escenario se hace en cuatro: cuatro actos, cuatro tiempos, cuatro correcciones. La máscara no se comenta.',
      'Usted elegirá con quién comparto la función. Elija bien. Yo no actúo con cualquiera.',
    ],
    enamorado: 'Controlado, teatral, perfeccionista. Pierde la cuenta cuando alguien se le acerca.',
    elegido: '¿Con {nombre}? Interesante elección de reparto. Aceptable. Por ahora.',
    promesa: 'Una función se interpreta con un solo compañero de escena. Hasta el último acto, ese será {nombre}. Nadie más sube a mi escenario.',
    final: 'Telón. Ha sido… impecable. Gracias por quedarse hasta el aplauso.',
  },
};
