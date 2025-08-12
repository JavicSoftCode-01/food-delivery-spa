// src/utils.ts

export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);
export const nowTs = () => Date.now();
export const clamp = (v: number, min = 0) => Math.max(min, v);
export const normalizeName = (s?: string) => (s || '').toString().trim();
export const formatCurrency = (n?: number) => '$ ' + Number(n || 0).toFixed(2);
export const debounce = <T extends (...args: any[]) => void>(fn: T, wait = 300) => {
  let t: number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), wait);
  };
};

/**
 * Normaliza y formatea una cadena de teléfono en tiempo real con límites dinámicos.
 * - Solo permite números y un '+' inicial.
 * - Elimina cualquier caracter inválido (letras, espacios, otros símbolos).
 * - Límites dinámicos según el prefijo:
 *   - 10 dígitos si empieza con '09'
 *   - 16 caracteres si empieza con '+593 9' (formato con espacios: +593 99 999 9999)
 *   - 13 caracteres si empieza con '+593' sin espacios (formato: +593999999999)
 */
export const normalizePhone = (p?: string): string => {
  const s = (p || '').toString();
  let cleaned = '';

  // Paso 1: Limpiar entrada - solo números, '+' inicial y espacios después de +593
  if (s.startsWith('+')) {
    const afterPlus = s.substring(1);

    // Para formato +593, permitimos espacios después del código de país
    if (afterPlus.startsWith('593')) {
      const after593 = afterPlus.substring(3);

      // Si hay espacio después de 593, permitimos formato con espacios
      if (after593.startsWith(' ')) {
        const remaining = after593.substring(1);
        // Formato: +593 9X XXX XXXX - permitimos espacios en posiciones específicas
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
        // Formato sin espacios: +593xxxxxxxxx
        cleaned = '+593' + after593.replace(/[^0-9]/g, '');
      }
    } else {
      // Si no es 593, solo números
      cleaned = '+' + afterPlus.replace(/[^0-9]/g, '');
    }
  } else {
    // Sin '+', solo números
    cleaned = s.replace(/[^0-9]/g, '');
  }

  // Paso 2: Aplicar límites según el formato detectado
  if (cleaned.startsWith('09')) {
    // Formato local: 09xxxxxxxx (10 dígitos máx)
    if (cleaned.length > 10) {
      cleaned = cleaned.substring(0, 10);
    }
  } else if (cleaned.startsWith('+593 9')) {
    // Formato internacional con espacios: +593 9X XXX XXXX (16 caracteres máx)
    if (cleaned.length > 16) {
      cleaned = cleaned.substring(0, 16);
    }
  } else if (cleaned.startsWith('+593')) {
    // Formato internacional sin espacios: +593xxxxxxxxx (13 caracteres máx)
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
  }

  return cleaned;
};

/**
 * Comprueba si los dígitos iniciales de un número son válidos para Ecuador.
 * Diseñada para usarse con retardo (debounce) mientras el usuario escribe.
 * @param p El número de teléfono (puede tener espacios, estar incompleto).
 * @returns Un string con el error o null si el prefijo es válido o la entrada es muy corta.
 */
export const getPhonePrefixError = (p?: string): string | null => {
  const phone = (p || '').toString().trim();

  // No mostrar error si está vacío o es muy corto para determinar el prefijo
  if (!phone || phone.length < 2) {
    return null;
  }

  // Normalizar quitando espacios solo para la verificación del prefijo
  const normalizedForCheck = phone.replace(/\s/g, '');

  if (
    normalizedForCheck.startsWith('09') ||
    normalizedForCheck.startsWith('+5939')
  ) {
    return null;
  }

  // Si se han ingresado al menos 2 caracteres y no coinciden con los prefijos válidos
  return "Formato válido: '09xxxxxxxx' o '+5939xxxxxxxx'";
};

/**
 * Valida si un número de teléfono tiene el formato correcto y está completo.
 * @param phone El número de teléfono normalizado
 * @returns true si el formato es válido y completo
 */
export const isValidPhoneFormat = (phone: string): boolean => {
  // Formato local completo: 09xxxxxxxx (10 dígitos)
  if (/^09\d{8}$/.test(phone)) {
    return true;
  }

  // Formato internacional sin espacios: +5939xxxxxxxx (13 caracteres)
  if (/^\+5939\d{8}$/.test(phone)) {
    return true;
  }

  // Formato internacional con espacios: +593 9X XXX XXXX (16 caracteres)
  if (/^\+593 9\d \d{3} \d{4}$/.test(phone)) {
    return true;
  }

  return false;
};


/**
 * --- NUEVA FUNCIÓN ---
 * Convierte diferentes formatos de número de teléfono de Ecuador a un formato canónico único.
 * El formato canónico es el estándar internacional E.164: `+593` seguido del número nacional sin el '0' inicial.
 * Ejemplo: '0999999999', '+593 99 999 9999', '+593999999999' se convierten a '+593999999999'.
 * 
 * @param phone - El número de teléfono a convertir.
 * @returns El número en formato canónico (+5939xxxxxxxx) o una cadena vacía si no se puede convertir.
 */
export const toCanonicalPhone = (phone?: string): string => {
  if (!phone) {
    return '';
  }

  // Quita todos los espacios en blanco para una comparación más sencilla.
  const cleaned = phone.replace(/\s/g, '');
  
  // Caso 1: Formato local (ej: 0999999999)
  // Debe tener 10 dígitos y empezar con '09'.
  if (cleaned.startsWith('09') && cleaned.length === 10) {
    // Reemplaza el '0' inicial con el código de país '+593'.
    return `+593${cleaned.substring(1)}`;
  }

  // Caso 2: Formato internacional (ej: +593999999999)
  // Debe empezar con '+5939' y tener 13 caracteres.
  if (cleaned.startsWith('+5939') && cleaned.length === 13) {
    return cleaned; // Ya está en formato canónico.
  }
  
  // Si no coincide con ninguno de los patrones válidos completos, no se puede canonizar.
  return '';
};


/**
 * --- NUEVA FUNCIÓN ---
 * Simplifica un número de teléfono a una cadena de solo dígitos para facilitar búsquedas.
 * Esto permite comparar números independientemente de su formato ('+', espacios, etc.).
 * Ej: '+593 99 123 4567' se convierte en '593991234567'.
 * Ej: '0991234567' se convierte en '0991234567'.
 *
 * @param phone - El número de teléfono en cualquier formato.
 * @returns Una cadena que contiene únicamente los dígitos del teléfono.
 */
export const getSearchablePhone = (phone?: string): string => {
  if (!phone) {
    return '';
  }
  // replace(/\D/g, '') es una expresión regular que elimina todo lo que NO sea un dígito.
  return phone.toString().replace(/\D/g, '');
};

/**
 * --- NUEVA FUNCIÓN ---
 * Extrae los últimos 9 dígitos de un número de teléfono, que representan la identidad única en Ecuador.
 * Se usa para comparaciones precisas.
 * Ej: '+593 99 123 4567' -> '991234567'
 * Ej: '0991234567' -> '991234567'
 *
 * @param phone - El número de teléfono en cualquier formato.
 * @returns Una cadena con los últimos 9 dígitos, o una cadena parcial si hay menos de 9.
 */
export const getLastNineDigits = (phone?: string): string => {
  const digitsOnly = getSearchablePhone(phone); // Reutilizamos la función anterior
  if (digitsOnly.length > 9) {
    return digitsOnly.slice(-9);
  }
  return digitsOnly;
};