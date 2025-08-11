export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2,9);
export const nowTs = () => Date.now();
export const clamp = (v: number, min = 0) => Math.max(min, v);
export const normalizePhone = (p?: string) => (p || '').toString().replace(/\D/g, '');
export const normalizeName = (s?: string) => (s || '').toString().trim();
export const formatCurrency = (n?: number) => '$' + Number(n || 0).toFixed(2);
export const debounce = <T extends (...args:any[])=>void>(fn:T, wait=300) => {
  let t: number|undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(()=> fn(...args), wait);
  };
};
