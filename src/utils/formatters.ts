// src/utils/formatters.ts
// Formateadores específicos para el proyecto food-delivery-spa

import { CONFIG } from '../app/config';

/**
 * Formatea un número como moneda
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: CONFIG.BUSINESS.CURRENCY,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea una fecha en formato legible
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatea una hora en formato HH:mm
 */
export function formatTime(time: string | Date): string {
  const d = new Date(time);
  return d.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Formatea un teléfono para mostrar
 */
export function formatPhoneDisplay(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('593')) {
    return `+${clean}`;
  }
  if (clean.startsWith('0')) {
    return `+593${clean.substring(1)}`;
  }
  return phone;
}

/**
 * Formatea un teléfono para WhatsApp
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('593')) {
    return clean;
  }
  if (clean.startsWith('0')) {
    return `593${clean.substring(1)}`;
  }
  return clean;
}

/**
 * Formatea un nombre para mostrar (primera letra mayúscula)
 */
export function formatName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Formatea una dirección para mostrar
 */
export function formatAddress(address: string): string {
  return address
    .split(',')
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .join(', ');
}

/**
 * Formatea un timestamp para mostrar
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours} horas`;
  if (days < 7) return `Hace ${days} días`;
  
  return formatDate(date);
}
