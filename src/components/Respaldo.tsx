import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DeviceMobile, ShareNetwork, Copy, Check, DownloadSimple, ArrowCounterClockwise, FileText, CaretLeft, WarningCircle } from '@phosphor-icons/react';
import { CharacterProfile, SavedProgress } from '../types';
import { crearCodigo, leerCodigo, nombreArchivo, Recuperado } from '../data/respaldo';
import { dice } from '../data/voces';
import { Bocadillo, Hoja, Respuesta } from '../ui/Bocadillo';

type Paso = 'inicio' | 'guardado' | 'recuperar' | 'confirmar' | 'listo';

const fechaLarga = (d: Date) =>
  d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) +
  ', ' +
  d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

// Guardar y recuperar el avance. Todo pasa en el celular: nada se sube a internet.
export function Respaldo({
  abierta,
  inicial = 'inicio',
  progress,
  guia,
  otro,
  onCerrar,
  onGuardado,
  onRecuperar,
  onInstalar,
}: {
  abierta: boolean;
  inicial?: Paso;
  progress: SavedProgress;
  guia: CharacterProfile;
  otro: CharacterProfile;
  onCerrar: () => void;
  onGuardado: () => void;
  onRecuperar: (avance: Partial<SavedProgress>) => void;
  onInstalar?: () => void;
}) {
  const [paso, setPaso] = useState<Paso>(inicial);
  const [codigo, setCodigo] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [pegado, setPegado] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [leido, setLeido] = useState<Recuperado | null>(null);
  const [cargando, setCargando] = useState(false);
  const archivo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (abierta) {
      setPaso(inicial);
      setCopiado(false);
      setPegado('');
      setError(null);
      setLeido(null);
    }
  }, [abierta, inicial]);

  const capitulos = Object.values(progress.shipChapterIndex).reduce((a, b) => a + b, 0);
  const ultimo = progress.ultimoRespaldo ? new Date(progress.ultimoRespaldo) : null;

  const guardar = async () => {
    setCargando(true);
    try {
      const c = await crearCodigo(progress);
      setCodigo(c);
      onGuardado();
      setPaso('guardado');
    } finally {
      setCargando(false);
    }
  };

  const textoArchivo = () =>
    `Respaldo de Panel Cero\n${fechaLarga(new Date())}\n\nPara recuperarlo: abre Panel Cero, toca el ícono de respaldo arriba y elige «Recuperar mi avance». Pega este código entero:\n\n${codigo}\n`;

  const compartir = async () => {
    const file = new File([textoArchivo()], nombreArchivo(), { type: 'text/plain' });
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Respaldo de Panel Cero' });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: 'Respaldo de Panel Cero', text: textoArchivo() });
        return;
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
    descargar();
  };

  const descargar = () => {
    const url = URL.createObjectURL(new Blob([textoArchivo()], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch {
      const t = document.createElement('textarea');
      t.value = codigo;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const revisar = async (texto: string) => {
    setError(null);
    setCargando(true);
    try {
      setLeido(await leerCodigo(texto));
      setPaso('confirmar');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setCargando(false);
    }
  };

  const elegirArchivo = async (f?: File) => {
    if (!f) return;
    revisar(await f.text());
  };

  const habla = (clave: Parameters<typeof dice>[2], quien = guia, expr: 'smirk' | 'blush' | 'neutral' | 'intense' = 'neutral') => {
    const l = dice(quien, quien.id === guia.id ? otro : guia, clave);
    return <Bocadillo key={clave} char={l.char} texto={l.texto} expresion={expr} />;
  };

  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Respaldo">
      {(paso === 'recuperar' || paso === 'confirmar') && inicial === 'inicio' && (
        <button onClick={() => setPaso(paso === 'confirmar' ? 'recuperar' : 'inicio')} className="-mt-1 mb-3 h-8 pr-3 flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
          <CaretLeft size={16} /> Atrás
        </button>
      )}

      <motion.div key={paso} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} className="space-y-5">
        {paso === 'inicio' && (
          <>
            {habla('respaldoIntro', guia, 'intense')}
            <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.07] px-4 py-3.5 text-[13px] leading-relaxed text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Capítulos leídos</span>
                <span className="font-mono-tech text-zinc-200">{capitulos}</span>
              </div>
              <div className="flex justify-between">
                <span>Plumas</span>
                <span className="font-mono-tech text-zinc-200">{progress.plumas}</span>
              </div>
              <div className="flex justify-between">
                <span>Última copia</span>
                <span className="text-zinc-200">{ultimo ? ultimo.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : 'nunca'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Respuesta principal onClick={guardar} disabled={cargando} icono={<DownloadSimple size={18} weight="bold" />}>
                Guardar una copia
              </Respuesta>
              <Respuesta onClick={() => setPaso('recuperar')} icono={<ArrowCounterClockwise size={18} />}>
                Recuperar mi avance
              </Respuesta>
              {onInstalar && (
                <Respuesta onClick={onInstalar} icono={<DeviceMobile size={18} />}>
                  Instalar la app en el celular
                </Respuesta>
              )}
            </div>
            <p className="text-[12px] leading-relaxed text-zinc-500 px-1">
              La copia queda contigo: no se sube a ningún lado. Sirve si cambias de celular, si se borran los datos del navegador o si pasas de abrirla en el navegador a la app instalada.
            </p>
          </>
        )}

        {paso === 'guardado' && (
          <>
            {habla('respaldoGuardado', otro, 'smirk')}
            <div className="space-y-2">
              <Respuesta principal onClick={compartir} icono={<ShareNetwork size={18} weight="bold" />}>
                Enviármelo (WhatsApp, correo…)
              </Respuesta>
              <Respuesta onClick={copiar} icono={copiado ? <Check size={18} weight="bold" className="text-emerald-300" /> : <Copy size={18} />}>
                {copiado ? 'Código copiado' : 'Copiar el código'}
              </Respuesta>
              <Respuesta onClick={descargar} icono={<FileText size={18} />}>
                Descargar como archivo
              </Respuesta>
            </div>
            <div className="rounded-2xl bg-black/30 ring-1 ring-white/[0.06] p-3">
              <div className="text-[11px] text-zinc-500 mb-1.5">Tu código ({codigo.length} letras)</div>
              <p className="font-mono-tech text-[11px] leading-snug text-zinc-400 break-all max-h-24 overflow-y-auto select-all">{codigo}</p>
            </div>
          </>
        )}

        {paso === 'recuperar' && (
          <>
            {inicial === 'recuperar' ? (
              <Bocadillo char={guia} texto="¿Ya tenías avance en otro lado? Pega aquí el código que guardaste, o elige el archivo." expresion="neutral" />
            ) : (
              <Bocadillo char={guia} texto="Pega el código que guardaste, entero. O elige el archivo, si lo descargaste." expresion="neutral" />
            )}
            <div className="space-y-2">
              <label htmlFor="codigo-respaldo" className="block text-[13px] text-zinc-400 px-1">
                Código de respaldo
              </label>
              <textarea
                id="codigo-respaldo"
                value={pegado}
                onChange={(e) => {
                  setPegado(e.target.value);
                  setError(null);
                }}
                placeholder="PC1.…"
                rows={4}
                className="w-full rounded-2xl px-4 py-3 bg-white/[0.04] ring-1 ring-white/10 font-mono-tech text-[12px] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-rose-400/60 resize-none"
              />
              {error && (
                <p className="flex gap-2 text-[13px] text-rose-300 px-1">
                  <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5" />
                  {error}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Respuesta principal disabled={!pegado.trim() || cargando} onClick={() => revisar(pegado)} icono={<ArrowCounterClockwise size={18} weight="bold" />}>
                Revisar el código
              </Respuesta>
              <Respuesta onClick={() => archivo.current?.click()} icono={<FileText size={18} />}>
                Elegir el archivo
              </Respuesta>
              <input ref={archivo} type="file" accept=".txt,text/plain" className="hidden" onChange={(e) => elegirArchivo(e.target.files?.[0])} />
            </div>
          </>
        )}

        {paso === 'confirmar' && leido && (
          <>
            <Bocadillo char={guia} texto="Encontré esto. Revisa que sea tuyo antes de seguir." expresion="neutral" />
            <div className="rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.07] px-4 py-3.5 text-[13px] text-zinc-400 space-y-1">
              <div className="flex justify-between">
                <span>Guardado el</span>
                <span className="text-zinc-200">{fechaLarga(leido.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span>Capítulos leídos</span>
                <span className="font-mono-tech text-zinc-200">{leido.capitulos}</span>
              </div>
              <div className="flex justify-between">
                <span>Plumas</span>
                <span className="font-mono-tech text-zinc-200">{leido.avance.plumas}</span>
              </div>
            </div>
            {capitulos > 0 && (
              <p className="flex gap-2 text-[13px] leading-relaxed text-amber-200/90 px-1">
                <WarningCircle size={16} weight="fill" className="shrink-0 mt-0.5" />
                Esto reemplaza el avance que tienes ahora en este celular ({capitulos} capítulos). No se puede deshacer.
              </p>
            )}
            <Respuesta
              principal
              onClick={() => {
                onRecuperar(leido.avance);
                setPaso('listo');
              }}
              icono={<Check size={18} weight="bold" />}
            >
              Sí, es mío. Recuperarlo
            </Respuesta>
          </>
        )}

        {paso === 'listo' && (
          <>
            {habla('respaldoRecuperado', guia, 'blush')}
            <Respuesta principal onClick={onCerrar}>
              Volver
            </Respuesta>
          </>
        )}
      </motion.div>
    </Hoja>
  );
}
