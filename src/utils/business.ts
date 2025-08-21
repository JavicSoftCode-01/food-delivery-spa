// Funciones utilitarias de negocio (dependen del dominio: clientes, pedidos, comidas)

/** Normaliza el teléfono a formato esperado visual (Ecuador). */
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

/** Mensaje de error por prefijo inválido de teléfono. */
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

/** Valida si el formato del teléfono es completo y correcto. */
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

/** Convierte teléfono a formato canónico E.164 para Ecuador. */
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

/** Solo dígitos para búsquedas por teléfono. */
export const getSearchablePhone = (phone?: string): string => {
  if (!phone) {
    return '';
  }
  return phone.toString().replace(/\D/g, '');
};

/** Últimos nueve dígitos del teléfono para identificación única. */
export const getLastNineDigits = (phone?: string): string => {
  const digitsOnly = getSearchablePhone(phone);
  if (digitsOnly.length > 9) {
    return digitsOnly.slice(-9);
  }
  return digitsOnly;
};

/** Formatea teléfono a enlace de WhatsApp. */
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


