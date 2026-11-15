// =====================================================================
// INSTALACIÓN: averigua dónde se abrió la app y cómo se instala ahí.
// =====================================================================

export type Entorno =
  | 'instalada' // ya abierta desde el ícono
  | 'iphone-safari'
  | 'iphone-otro' // Chrome, Firefox… en iPhone
  | 'android'
  | 'dentro-de-app' // navegador interno de Instagram, WhatsApp, TikTok…
  | 'computador';

interface EventoInstalar extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Chrome en Android avisa una sola vez, al cargar, que la app se puede instalar.
// Se guarda ese aviso para usarlo cuando ella toque el botón.
let aviso: EventoInstalar | null = null;
const oyentes = new Set<() => void>();

export function escucharInstalacion() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    aviso = e as EventoInstalar;
    oyentes.forEach((f) => f());
  });
  window.addEventListener('appinstalled', () => {
    aviso = null;
    oyentes.forEach((f) => f());
  });
}

export const puedeInstalarDirecto = () => !!aviso;

export function alCambiar(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

export async function instalarDirecto(): Promise<boolean> {
  if (!aviso) return false;
  await aviso.prompt();
  const { outcome } = await aviso.userChoice;
  aviso = null;
  return outcome === 'accepted';
}

export function entorno(): Entorno {
  // Solo para probar en el computador: http://localhost:5199/?entorno=iphone-safari
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    const forzado = new URLSearchParams(location.search).get('entorno');
    if (forzado) return forzado as Entorno;
  }
  const ua = navigator.userAgent;
  const instalada =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: fullscreen)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  if (instalada) return 'instalada';

  if (/Instagram|FBAN|FBAV|FB_IAB|Line\/|musical_ly|BytedanceWebview|TikTok|Snapchat|Twitter|WhatsApp|GSA\//i.test(ua)) return 'dentro-de-app';

  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? 'iphone-otro' : 'iphone-safari';

  if (/Android/i.test(ua)) return /; wv\)/.test(ua) ? 'dentro-de-app' : 'android';

  return 'computador';
}

// Para el modo sin internet: registra el service worker (solo en la versión publicada).
export function registrarSinConexion() {
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (local || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
