// Enrutador optimizado con lazy loading para manejar la pantalla actual y suscriptores
import { ScreenType } from './config';
import { loadScreen, preloadScreen } from './lazyLoader';
import { intelligentPrefetch, prefetchForNavigation } from './intelligentPrefetch';

export type Screen = ScreenType;

type Listener = (screen: Screen) => void;
type RenderFunction = (container: HTMLElement) => void;

let currentScreen: Screen = 'dashboard';
const listeners = new Set<Listener>();
const renderCache = new Map<Screen, RenderFunction>();

// Array de todas las pantallas disponibles
const ALL_SCREENS: ScreenType[] = ['dashboard', 'clients', 'foods', 'settings'];

export const Router = {
  getScreen(): Screen {
    return currentScreen;
  },

  async setScreen(next: Screen) {
    if (next === currentScreen) return;
    
    // Marcar inicio de interacción
    intelligentPrefetch.startInteraction();
    
    // Precarga la siguiente pantalla si no está en cache
    if (!renderCache.has(next)) {
      preloadScreen(next);
    }
    
    currentScreen = next;
    
    // Prefetch inteligente para la nueva pantalla
    prefetchForNavigation(next);
    
    // Marcar fin de interacción después de un delay
    setTimeout(() => {
      intelligentPrefetch.endInteraction();
    }, 500);
    
    listeners.forEach(l => l(currentScreen));
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Obtiene la función de renderizado para una pantalla específica
   */
  async getRenderer(screen: Screen): Promise<RenderFunction> {
    // Verificar cache primero
    if (renderCache.has(screen)) {
      return renderCache.get(screen)!;
    }

    try {
      // Cargar el módulo lazy
      const module = await loadScreen(screen);
      
      // Buscar la función de renderizado
      const renderFn = module.renderDashboard || 
                      module.renderClients || 
                      module.renderFoods || 
                      module.renderSettings;
      
      if (renderFn && typeof renderFn === 'function') {
        // Guardar en cache
        renderCache.set(screen, renderFn);
        return renderFn;
      } else {
        throw new Error(`Función de renderizado no encontrada para ${screen}`);
      }
    } catch (error) {
      console.error(`Error obteniendo renderizador para ${screen}:`, error);
      throw error;
    }
  },

  /**
   * Precarga todas las pantallas para mejorar la experiencia del usuario
   */
  preloadAll() {
    ALL_SCREENS.forEach(screen => {
      preloadScreen(screen);
    });
  },

  /**
   * Limpia el cache de renderizadores
   */
  clearCache() {
    renderCache.clear();
  },

  /**
   * Obtiene estadísticas del cache
   */
  getCacheStats() {
    return {
      renderCacheSize: renderCache.size,
      renderCacheKeys: Array.from(renderCache.keys())
    };
  }
};


