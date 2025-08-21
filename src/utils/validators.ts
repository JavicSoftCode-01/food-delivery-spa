// src/utils/validators.ts
// Validaciones específicas para el proyecto food-delivery-spa

import { CONFIG } from '../app/config';

/**
 * Valida si un nombre es válido
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (name.trim().length < CONFIG.VALIDATION.MIN_NAME_LENGTH) {
    return { 
      isValid: false, 
      error: `El nombre debe tener al menos ${CONFIG.VALIDATION.MIN_NAME_LENGTH} caracteres` 
    };
  }
  
  if (name.trim().length > CONFIG.VALIDATION.MAX_NAME_LENGTH) {
    return { 
      isValid: false, 
      error: `El nombre no puede exceder ${CONFIG.VALIDATION.MAX_NAME_LENGTH} caracteres` 
    };
  }
  
  // Validar que solo contenga letras, espacios y algunos caracteres especiales
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'El nombre solo puede contener letras y espacios' };
  }
  
  return { isValid: true };
}

/**
 * Valida si un teléfono es válido
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string } {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'El teléfono es requerido' };
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < CONFIG.VALIDATION.MIN_PHONE_LENGTH) {
    return { 
      isValid: false, 
      error: `El teléfono debe tener al menos ${CONFIG.VALIDATION.MIN_PHONE_LENGTH} dígitos` 
    };
  }
  
  if (cleanPhone.length > CONFIG.VALIDATION.MAX_PHONE_LENGTH) {
    return { 
      isValid: false, 
      error: `El teléfono no puede exceder ${CONFIG.VALIDATION.MAX_PHONE_LENGTH} dígitos` 
    };
  }
  
  // Validar formato ecuatoriano
  const ecuadorPhoneRegex = /^(593|0)?[0-9]{9}$/;
  if (!ecuadorPhoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Formato de teléfono inválido para Ecuador' };
  }
  
  return { isValid: true };
}

/**
 * Valida si una dirección es válida
 */
export function validateAddress(address: string): { isValid: boolean; error?: string } {
  if (!address || address.trim().length === 0) {
    return { isValid: false, error: 'La dirección es requerida' };
  }
  
  if (address.trim().length < CONFIG.VALIDATION.MIN_ADDRESS_LENGTH) {
    return { 
      isValid: false, 
      error: `La dirección debe tener al menos ${CONFIG.VALIDATION.MIN_ADDRESS_LENGTH} caracteres` 
    };
  }
  
  if (address.trim().length > CONFIG.VALIDATION.MAX_ADDRESS_LENGTH) {
    return { 
      isValid: false, 
      error: `La dirección no puede exceder ${CONFIG.VALIDATION.MAX_ADDRESS_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
}

/**
 * Valida si un email es válido
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'El email es requerido' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
}

/**
 * Valida si una cantidad es válida
 */
export function validateQuantity(quantity: number): { isValid: boolean; error?: string } {
  if (quantity <= 0) {
    return { isValid: false, error: 'La cantidad debe ser mayor a 0' };
  }
  
  if (quantity > 100) {
    return { isValid: false, error: 'La cantidad no puede exceder 100' };
  }
  
  if (!Number.isInteger(quantity)) {
    return { isValid: false, error: 'La cantidad debe ser un número entero' };
  }
  
  return { isValid: true };
}

/**
 * Valida si un precio es válido
 */
export function validatePrice(price: number): { isValid: boolean; error?: string } {
  if (price < 0) {
    return { isValid: false, error: 'El precio no puede ser negativo' };
  }
  
  if (price > 1000) {
    return { isValid: false, error: 'El precio no puede exceder $1000' };
  }
  
  if (price === 0) {
    return { isValid: false, error: 'El precio debe ser mayor a 0' };
  }
  
  return { isValid: true };
}

/**
 * Valida si una hora de entrega es válida
 */
export function validateDeliveryTime(time: string): { isValid: boolean; error?: string } {
  if (!time || time.trim().length === 0) {
    return { isValid: false, error: 'La hora de entrega es requerida' };
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time.trim())) {
    return { isValid: false, error: 'Formato de hora inválido (HH:MM)' };
  }
  
  return { isValid: true };
}

/**
 * Valida si un pedido cumple con el monto mínimo
 */
export function validateOrderAmount(amount: number): { isValid: boolean; error?: string } {
  if (amount < CONFIG.BUSINESS.MIN_ORDER_AMOUNT) {
    return { 
      isValid: false, 
      error: `El pedido debe tener un monto mínimo de ${formatCurrency(CONFIG.BUSINESS.MIN_ORDER_AMOUNT)}` 
    };
  }
  
  return { isValid: true };
}

// Importar formatCurrency para usar en validaciones
import { formatCurrency } from './formatters';
