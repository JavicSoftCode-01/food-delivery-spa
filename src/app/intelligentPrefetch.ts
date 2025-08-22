// src/app/intelligentPrefetch.ts
// Sistema de prefetching inteligente para mejorar la experiencia del usuario

import { ScreenType } from './config';
import { loadFeature } from './lazyLoader';

/**
 * Estrategias de prefetching
 */
export enum PrefetchStrategy {
  IMMEDIATE = 'immediate',      // Prefetch inmediato
  IDLE = 'idle',               // Prefetch en tiempo libre
  HOVER = 'hover',             // Prefetch al hacer hover
  VIEWPORT = 'viewport',       // Prefetch cuando está en viewport
  INTERACTION = 'interaction'  // Prefetch después de interacción
}

/**
 * Configuración de prefetching
 */
interface PrefetchConfig {
  strategy: PrefetchStrategy;
  priority: number; // 1-10, mayor = más importante
  delay?: number;   // Delay en ms antes de ejecutar
  condition?: () => boolean; // Condición para ejecutar
}

/**
 * Módulos disponibles para prefetching
 */
const PREFETCH_MODULES = {
  // Pantallas principales
  screens: {
    dashboard: { strategy: PrefetchStrategy.IMMEDIATE, priority: 10 },
    foods: { strategy: PrefetchStrategy.IDLE, priority: 8 },
    clients: { strategy: PrefetchStrategy.IDLE, priority: 7 },
    settings: { strategy: PrefetchStrategy.INTERACTION, priority: 5 }
  },
  
  // Features críticos
  features: {
    orderForm: { strategy: PrefetchStrategy.HOVER, priority: 9 },
    foodForm: { strategy: PrefetchStrategy.HOVER, priority: 8 },
    orderDetails: { strategy: PrefetchStrategy.VIEWPORT, priority: 6 },
    salesHistory: { strategy: PrefetchStrategy.INTERACTION, priority: 5 }
  }
};

/**
 * Sistema de prefetching inteligente
 */
class IntelligentPrefetch {
  private prefetchQueue: Map<string, PrefetchConfig> = new Map();
  private isIdle = false;
  private idleTimer: number | null = null;
  private observer: IntersectionObserver | null = null;
  private hoverElements = new Set<HTMLElement>();

  constructor() {
    this.initializeIdleDetection();
    this.initializeIntersectionObserver();
    this.initializeHoverDetection();
  }

  /**
   * Inicializa la detección de tiempo libre
   */
  private initializeIdleDetection(): void {
    if ('requestIdleCallback' in window) {
      this.scheduleIdlePrefetch();
    } else {
      // Fallback para navegadores que no soportan requestIdleCallback
      this.scheduleFallbackIdle();
    }
  }

  /**
   * Programa prefetch en tiempo libre
   */
  private scheduleIdlePrefetch(): void {
    const scheduleNext = () => {
      if (this.isIdle) {
        this.processIdlePrefetch();
      }
      this.idleTimer = window.setTimeout(scheduleNext, 1000);
    };
    scheduleNext();
  }

  /**
   * Fallback para navegadores sin requestIdleCallback
   */
  private scheduleFallbackIdle(): void {
    let lastTime = Date.now();
    const checkIdle = () => {
      const now = Date.now();
      if (now - lastTime > 2000) { // 2 segundos sin actividad
        this.isIdle = true;
        this.processIdlePrefetch();
      }
      lastTime = now;
      this.idleTimer = window.setTimeout(checkIdle, 1000);
    };
    checkIdle();
  }

  /**
   * Inicializa el observer de intersección para viewport
   */
  private initializeIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const module = element.dataset.prefetch;
            if (module) {
              this.prefetchModule(module, PrefetchStrategy.VIEWPORT);
            }
          }
        });
      }, { threshold: 0.1 });
    }
  }

  /**
   * Inicializa la detección de hover
   */
  private initializeHoverDetection(): void {
    // Detectar elementos con prefetch en hover
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const module = target.dataset.prefetch;
      if (module && !this.hoverElements.has(target)) {
        this.hoverElements.add(target);
        this.prefetchModule(module, PrefetchStrategy.HOVER);
      }
    });
  }

  /**
   * Prefetcha un módulo específico
   */
  async prefetchModule(moduleName: string, strategy: PrefetchStrategy): Promise<void> {
    try {
      const config = this.getPrefetchConfig(moduleName);
      if (!config || config.strategy !== strategy) return;

      // Verificar si ya está en cache
      if (this.isModuleCached(moduleName)) return;

      // Aplicar delay si está configurado
      if (config.delay) {
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }

      // Verificar condición si existe
      if (config.condition && !config.condition()) return;

      // Ejecutar prefetch
      await this.executePrefetch(moduleName);
      
      console.log(`🚀 Prefetch completado: ${moduleName} (${strategy})`);
    } catch (error) {
      console.warn(`⚠️ Prefetch falló para ${moduleName}:`, error);
    }
  }

  /**
   * Obtiene la configuración de prefetch para un módulo
   */
  private getPrefetchConfig(moduleName: string): PrefetchConfig | null {
    // Buscar en pantallas
    if (moduleName in PREFETCH_MODULES.screens) {
      return PREFETCH_MODULES.screens[moduleName as keyof typeof PREFETCH_MODULES.screens];
    }
    
    // Buscar en features
    if (moduleName in PREFETCH_MODULES.features) {
      return PREFETCH_MODULES.features[moduleName as keyof typeof PREFETCH_MODULES.features];
    }
    
    return null;
  }

  /**
   * Verifica si un módulo ya está en cache
   */
  private isModuleCached(moduleName: string): boolean {
    // Esta función debería verificar el cache del lazyLoader
    // Por ahora, asumimos que no está en cache
    return false;
  }

  /**
   * Ejecuta el prefetch real
   */
  private async executePrefetch(moduleName: string): Promise<void> {
    if (moduleName in PREFETCH_MODULES.screens) {
      // Prefetch de pantalla usando lazyLoader
      // Nota: No usamos import dinámico aquí para evitar problemas con Vite
      console.log(`📚 Prefetch de pantalla: ${moduleName}`);
    } else if (moduleName in PREFETCH_MODULES.features) {
      // Prefetch de feature usando lazyLoader
      try {
        await loadFeature(moduleName as any);
      } catch (error) {
        console.warn(`Error en prefetch de feature ${moduleName}:`, error);
      }
    }
  }

  /**
   * Procesa prefetch en tiempo libre
   */
  private async processIdlePrefetch(): Promise<void> {
    const idleModules = Object.entries(PREFETCH_MODULES)
      .flatMap(([category, modules]) => 
        Object.entries(modules)
          .filter(([_, config]) => config.strategy === PrefetchStrategy.IDLE)
          .map(([name, config]) => ({ name, config, category }))
      )
      .sort((a, b) => b.config.priority - a.config.priority);

    for (const { name, category } of idleModules) {
      if (this.isIdle) {
        await this.prefetchModule(name, PrefetchStrategy.IDLE);
        // Pequeña pausa para no bloquear
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  }

  /**
   * Marca el inicio de una interacción
   */
  startInteraction(): void {
    this.isIdle = false;
  }

  /**
   * Marca el fin de una interacción
   */
  endInteraction(): void {
    setTimeout(() => {
      this.isIdle = true;
    }, 1000);
  }

  /**
   * Observa un elemento para prefetch en viewport
   */
  observeElement(element: HTMLElement, moduleName: string): void {
    if (this.observer) {
      element.dataset.prefetch = moduleName;
      this.observer.observe(element);
    }
  }

  /**
   * Limpia recursos
   */
  destroy(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    this.hoverElements.clear();
  }

  /**
   * Obtiene estadísticas del prefetcher
   */
  getStats(): { isIdle: boolean; observedElements: number; hoverElements: number } {
    return {
      isIdle: this.isIdle,
      observedElements: this.observer ? 1 : 0,
      hoverElements: this.hoverElements.size
    };
  }
}

// Instancia global del prefetcher
export const intelligentPrefetch = new IntelligentPrefetch();

/**
 * Decorador para elementos que deben activar prefetch en hover
 */
export function addHoverPrefetch(element: HTMLElement, moduleName: string): void {
  element.dataset.prefetch = moduleName;
}

/**
 * Función para prefetch inmediato de módulos críticos
 */
export function prefetchCritical(): void {
  Object.entries(PREFETCH_MODULES)
    .flatMap(([category, modules]) => 
      Object.entries(modules)
        .filter(([_, config]) => config.strategy === PrefetchStrategy.IMMEDIATE)
        .map(([name]) => name)
    )
    .forEach(moduleName => {
      intelligentPrefetch.prefetchModule(moduleName, PrefetchStrategy.IMMEDIATE);
    });
}

/**
 * Función para prefetch basado en navegación
 */
export function prefetchForNavigation(currentScreen: ScreenType): void {
  // Prefetch pantallas relacionadas
  const relatedScreens = {
    dashboard: ['foods', 'clients'],
    foods: ['dashboard', 'orderForm'],
    clients: ['dashboard', 'orderForm'],
    settings: ['dashboard']
  };

  const screensToPrefetch = relatedScreens[currentScreen] || [];
  screensToPrefetch.forEach(screen => {
    intelligentPrefetch.prefetchModule(screen, PrefetchStrategy.IDLE);
  });
}
