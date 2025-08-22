// src/app/lazyLoader.ts
// Sistema de lazy loading para pantallas y componentes

import { ScreenType } from './config';

// Cache para módulos ya cargados
const moduleCache = new Map<string, any>();

// Definición de las rutas lazy para cada pantalla
const lazyRoutes: Record<ScreenType, () => Promise<any>> = {
  dashboard: () => import('../ui/screens/dashboard'),
  clients: () => import('../ui/screens/clients'),
  foods: () => import('../ui/screens/foods'),
  settings: () => import('../ui/screens/settings')
};

// Definición de lazy loading para features
const lazyFeatures = {
  orderForm: () => import('../features/orders/orderForm'),
  foodForm: () => import('../features/foods/foodForm'),
  salesHistory: () => import('../features/foods/salesHistory'),
  orderDetails: () => import('../features/orders/orderDetails'),
  callModal: () => import('../features/orders/callModal'),
  deliveryToggle: () => import('../features/orders/deliveryToggle')
};

/**
 * Carga lazy de una pantalla específica
 */
export async function loadScreen(screen: ScreenType): Promise<any> {
  try {
    // Verificar si ya está en cache
    if (moduleCache.has(screen)) {
      return moduleCache.get(screen);
    }

    // Cargar el módulo
    const module = await lazyRoutes[screen]();
    
    // Guardar en cache
    moduleCache.set(screen, module);
    
    return module;
  } catch (error) {
    console.error(`Error cargando pantalla ${screen}:`, error);
    throw error;
  }
}

/**
 * Carga lazy de un feature específico
 */
export async function loadFeature(feature: keyof typeof lazyFeatures): Promise<any> {
  try {
    // Verificar si ya está en cache
    if (moduleCache.has(feature)) {
      return moduleCache.get(feature);
    }

    // Cargar el módulo
    const module = await lazyFeatures[feature]();
    
    // Guardar en cache
    moduleCache.set(feature, module);
    
    return module;
  } catch (error) {
    console.error(`Error cargando feature ${feature}:`, error);
    throw error;
  }
}

/**
 * Precarga una pantalla en background (para mejorar UX)
 */
export function preloadScreen(screen: ScreenType): void {
  if (!moduleCache.has(screen)) {
    // Cargar en background sin bloquear
    lazyRoutes[screen]().then(module => {
      moduleCache.set(screen, module);
    }).catch(error => {
      console.warn(`Preload falló para ${screen}:`, error);
    });
  }
}

/**
 * Precarga todas las pantallas principales
 */
export function preloadAllScreens(): void {
  Object.keys(lazyRoutes).forEach(screen => {
    preloadScreen(screen as ScreenType);
  });
}

/**
 * Limpia el cache (útil para testing o desarrollo)
 */
export function clearCache(): void {
  moduleCache.clear();
}

/**
 * Obtiene estadísticas del cache
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: moduleCache.size,
    keys: Array.from(moduleCache.keys())
  };
}
