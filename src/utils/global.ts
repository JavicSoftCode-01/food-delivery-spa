// Funciones utilitarias globales (genéricas, sin depender del dominio)

/** Genera un ID único con prefijo opcional. */
export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

/** Timestamp actual en milisegundos. */
export const nowTs = () => Date.now();

/** Limita un valor a un mínimo. */
export const clamp = (v: number, min = 0) => Math.max(min, v);

/** Normaliza un nombre (trim). */
export const normalizeName = (s?: string) => (s || '').toString().trim();

/** Formatea un número como moneda. */
export const formatCurrency = (n?: number) => '$ ' + Number(n || 0).toFixed(2);

/** Crea un debounce de una función. */
export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 300) => {
  let t: number | undefined;
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
};

/** Formatea un ISO date-time para mostrar hora local en formato amigable. */
export function formatTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace('AM', 'a. m.')
    .replace('PM', 'p. m.');
}

/** Convierte tiempo HH:mm a 12h con AM/PM. */
export function formatClockTime(time: string): string {
  if (!time || !time.includes(':')) {
    return time;
  }
  const [hour, minute] = time.split(':');
  let h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'p.m.' : 'a.m.';
  h = h % 12;
  h = h ? h : 12;
  const hourStr = h < 10 ? '0' + h : h.toString();
  return `${hourStr}:${minute} ${suffix}`;
}


