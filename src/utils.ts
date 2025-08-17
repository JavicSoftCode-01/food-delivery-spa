
                                    // src/utils.ts
/** Generates a unique ID with optional prefix. */
export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);

/** Gets current timestamp. */
export const nowTs = () => Date.now();

/** Clamps a value to a minimum. */
export const clamp = (v: number, min = 0) => Math.max(min, v);

/** Normalizes a name by trimming. */
export const normalizeName = (s?: string) => (s || '').toString().trim();

/** Formats a number as currency. */
export const formatCurrency = (n?: number) => '$ ' + Number(n || 0).toFixed(2);

/** Debounces a function call. */
export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 300) => {
  let t: number | undefined;
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
};

/** Normalizes phone input with dynamic limits for Ecuador formats. */
export const normalizePhone = (p?: string): string => {
  const s = (p || '').toString();
  let cleaned = '';

  if (s.startsWith('+')) {
    const afterPlus = s.substring(1);

    if (afterPlus.startsWith('593')) {
      const after593 = afterPlus.substring(3);

      if (after593.startsWith(' ')) {
        const remaining = after593.substring(1);
        let formatted = '+593 ';
        let digitCount = 0;

        for (let i = 0; i < remaining.length && digitCount < 9; i++) {
          const char = remaining[i];
          if (/[0-9]/.test(char)) {
            if (digitCount === 2 || digitCount === 5) {
              formatted += ' ';
            }
            formatted += char;
            digitCount++;
          }
        }
        cleaned = formatted;
      } else {
        cleaned = '+593' + after593.replace(/[^0-9]/g, '');
      }
    } else {
      cleaned = '+' + afterPlus.replace(/[^0-9]/g, '');
    }
  } else {
    cleaned = s.replace(/[^0-9]/g, '');
  }

  if (cleaned.startsWith('09')) {
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
  } else if (cleaned.startsWith('+593 9')) {
    if (cleaned.length > 16) {
      cleaned = cleaned.substring(0, 16);
    }
  } else if (cleaned.startsWith('+593')) {
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
  }

  return cleaned;
};

/** Gets error message for invalid phone prefix. */
export const getPhonePrefixError = (p?: string): string | null => {
  const phone = (p || '').toString().trim();

  if (!phone || phone.length < 2) {
    return null;
  }

  const normalizedForCheck = phone.replace(/\s/g, '');

  if (
    normalizedForCheck.startsWith('09') ||
    normalizedForCheck.startsWith('+5939')
  ) {
    return null;
  }

  return "Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'";
};

/** Validates if phone format is complete and correct. */
export const isValidPhoneFormat = (phone: string): boolean => {
  if (/^09\d{8}$/.test(phone)) {
    return true;
  }

  if (/^\+5939\d{8}$/.test(phone)) {
    return true;
  }

  if (/^\+593 9\d \d{3} \d{4}$/.test(phone)) {
    return true;
  }

  return false;
};

/** Converts phone to canonical E.164 format for Ecuador. */
export const toCanonicalPhone = (phone?: string): string => {
  if (!phone) {
    return '';
  }

  const cleaned = phone.replace(/\s/g, '');

  if (cleaned.startsWith('09') && cleaned.length === 10) {
    return `+593${cleaned.substring(1)}`;
  }

  if (cleaned.startsWith('+5939') && cleaned.length === 13) {
    return cleaned;
  }

  return '';
};

/** Gets digits-only string for searchable phone. */
export const getSearchablePhone = (phone?: string): string => {
  if (!phone) {
    return '';
  }
  return phone.toString().replace(/\D/g, '');
};

/** Gets last nine digits of phone for unique identification. */
export const getLastNineDigits = (phone?: string): string => {
  const digitsOnly = getSearchablePhone(phone);
  if (digitsOnly.length > 9) {
    return digitsOnly.slice(-9);
  }
  return digitsOnly;
};

/** Formats phone for WhatsApp link. */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) {
    const withoutZero = cleanPhone.substring(1);
    if (withoutZero.length === 9) {
      return `+593${withoutZero.substring(0, 2)}${withoutZero.substring(2, 5)}${withoutZero.substring(5)}`;
    }
  }
  if (cleanPhone.startsWith('593')) {
    const number = cleanPhone.substring(3);
    if (number.length === 9) {
      return `+593${number.substring(0, 2)}${number.substring(2, 5)}${number.substring(5)}`;
    }
  }
  return phone;
}

/** Formats ISO time for display. */
export function formatTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: true })
    .replace('AM', 'a. m.')
    .replace('PM', 'p. m.');
}

/** Formats HH:mm time to 12-hour with AM/PM. */
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

