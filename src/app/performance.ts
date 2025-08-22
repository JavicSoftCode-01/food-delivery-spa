// src/app/performance.ts
// Configuraciones y optimizaciones de rendimiento

import { CONFIG } from './config';

/**
 * Configuraciones de rendimiento
 */
export const PERFORMANCE_CONFIG = {
  // Lazy loading
  LAZY_LOADING: {
    ENABLED: true,
    PRELOAD_DELAY: 1000, // ms antes de precargar
    CACHE_SIZE_LIMIT: 10, // máximo de módulos en cache
    RETRY_ATTEMPTS: 3
  },

  // Bundle optimization
  BUNDLE: {
    CHUNK_SIZE_LIMIT: 100 * 1024, // 100KB
    ENABLE_COMPRESSION: true,
    ENABLE_TREE_SHAKING: true
  },

  // Memory management
  MEMORY: {
    CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutos
    MAX_CACHE_AGE: 10 * 60 * 1000, // 10 minutos
    ENABLE_GARBAGE_COLLECTION: true
  }
};

/**
 * Estrategias de precarga inteligente
 */
export const PRELOAD_STRATEGIES = {
  // Precargar pantallas basado en uso frecuente
  FREQUENT_USE: ['dashboard', 'foods'],
  
  // Precargar en idle time
  IDLE_TIME: ['clients', 'settings'],
  
  // Precargar en hover
  HOVER_PRELOAD: true,
  
  // Precargar en viewport
  VIEWPORT_PRELOAD: true
};

/**
 * Configuraciones de cache
 */
export const CACHE_CONFIG = {
  // TTL para diferentes tipos de datos
  TTL: {
    SCREEN_RENDERERS: 30 * 60 * 1000, // 30 minutos
    FEATURE_MODULES: 15 * 60 * 1000,  // 15 minutos
    API_RESPONSES: 5 * 60 * 1000,     // 5 minutos
    UI_COMPONENTS: 60 * 60 * 1000     // 1 hora
  },

  // Estrategias de invalidación
  INVALIDATION: {
    ON_ROUTE_CHANGE: true,
    ON_MEMORY_PRESSURE: true,
    ON_VERSION_CHANGE: true
  }
};

/**
 * Métricas de rendimiento a monitorear
 */
export const PERFORMANCE_METRICS = {
  // Core Web Vitals
  CORE_WEB_VITALS: {
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100,  // First Input Delay (ms)
    CLS: 0.1   // Cumulative Layout Shift
  },

  // Lazy loading metrics
  LAZY_LOADING: {
    MODULE_LOAD_TIME: 1000,    // Tiempo máximo de carga (ms)
    CACHE_HIT_RATIO: 0.8,     // Ratio mínimo de cache hits
    PRELOAD_SUCCESS_RATE: 0.9  // Tasa mínima de éxito en precarga
  },

  // Bundle metrics
  BUNDLE: {
    INITIAL_LOAD_SIZE: 500 * 1024, // 500KB máximo
    TOTAL_LOAD_SIZE: 2 * 1024 * 1024, // 2MB máximo
    CHUNK_COUNT: 10 // Máximo número de chunks
  }
};

/**
 * Configuraciones de compresión y optimización
 */
export const OPTIMIZATION_CONFIG = {
  // Compresión de código
  COMPRESSION: {
    ENABLE_GZIP: true,
    ENABLE_BROTLI: true,
    MIN_COMPRESSION_RATIO: 0.7
  },

  // Tree shaking
  TREE_SHAKING: {
    ENABLED: true,
    SIDE_EFFECT_FREE: true,
    PURE_FUNCTIONS: true
  },

  // Code splitting
  CODE_SPLITTING: {
    ENABLED: true,
    STRATEGY: 'route-based', // 'route-based' | 'feature-based' | 'vendor-based'
    MIN_CHUNK_SIZE: 10 * 1024, // 10KB
    MAX_CHUNK_SIZE: 500 * 1024 // 500KB
  }
};
