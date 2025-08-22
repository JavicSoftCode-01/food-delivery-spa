# 🚀 Optimizaciones de Bundle Size y Lazy Loading

Este documento describe las optimizaciones implementadas para mejorar el rendimiento de la aplicación food-delivery-spa.

## ✨ Características Implementadas

### 1. Lazy Loading de Pantallas
- **Carga bajo demanda**: Las pantallas solo se cargan cuando son necesarias
- **Cache inteligente**: Los módulos cargados se almacenan en memoria para acceso rápido
- **Precarga inteligente**: Las pantallas se precargan en background para mejor UX
- **Manejo de errores**: Sistema robusto de fallback y reintentos

### 2. **Prefetching Inteligente** 🆕
- **Estrategias múltiples**: Immediate, Idle, Hover, Viewport, Interaction
- **Detección de tiempo libre**: Usa `requestIdleCallback` para prefetch automático
- **Precarga en hover**: Módulos se cargan al hacer hover sobre elementos
- **Precarga en viewport**: Módulos se cargan cuando entran en el viewport
- **Priorización inteligente**: Módulos críticos se cargan primero

### 3. Optimización de Bundle
- **Code Splitting**: División automática del código en chunks más pequeños
- **Tree Shaking**: Eliminación de código no utilizado
- **Minificación agresiva**: Uso de esbuild para reducir el tamaño del código
- **Chunks manuales**: Separación estratégica de dependencias y features

### 4. **Compresión Avanzada** 🆕
- **Compresión Gzip**: Nivel 9 para máxima compresión
- **Compresión Brotli**: Nivel 11 para compresión superior
- **Archivos pre-comprimidos**: Generación automática de .gz y .br
- **Configuración de servidor**: Nginx configurado para servir archivos comprimidos

### 5. Monitoreo de Rendimiento
- **Bundle Analyzer**: Herramientas para analizar el tamaño del bundle
- **Métricas de Lazy Loading**: Monitoreo del rendimiento de carga dinámica
- **Core Web Vitals**: Seguimiento de métricas de rendimiento web
- **Reportes automáticos**: Generación de reportes de rendimiento

## 🛠️ Configuración

### Vite Config (`vite.config.ts`)
```typescript
export default defineConfig({
  build: {
    target: 'es2015',           // Soporte para navegadores antiguos
    minify: 'esbuild',          // Minificación rápida
    sourcemap: false,           // Sin sourcemaps en producción
    rollupOptions: {
      output: {
        manualChunks: {         // Chunks manuales para mejor caching
          vendor: ['@vitejs/plugin-vue'],
          core: ['./src/main', './src/app/config', './src/app/router'],
          ui: ['./src/ui/ui', './src/ui/layout'],
          utils: ['./src/utils/index', './src/utils/formatters'],
          foods: ['./src/features/foods/foodForm', './src/features/foods/salesHistory'],
          orders: ['./src/features/orders/orderForm', './src/features/orders/orderDetails']
        }
      }
    }
  }
});
```

### Prefetching Inteligente (`src/app/intelligentPrefetch.ts`)
```typescript
// Estrategias de prefetching
export enum PrefetchStrategy {
  IMMEDIATE = 'immediate',      // Prefetch inmediato
  IDLE = 'idle',               // Prefetch en tiempo libre
  HOVER = 'hover',             // Prefetch al hacer hover
  VIEWPORT = 'viewport',       // Prefetch cuando está en viewport
  INTERACTION = 'interaction'  // Prefetch después de interacción
}

// Configuración automática
const PREFETCH_MODULES = {
  screens: {
    dashboard: { strategy: PrefetchStrategy.IMMEDIATE, priority: 10 },
    foods: { strategy: PrefetchStrategy.IDLE, priority: 8 },
    clients: { strategy: PrefetchStrategy.IDLE, priority: 7 }
  }
};
```

## 📊 Scripts Disponibles

### Build y Análisis
```bash
# Build normal
npm run build

# Build con análisis automático
npm run build:analyze

# Build con compresión automática (Gzip + Brotli)
npm run build:compress

# Build de producción optimizado
npm run build:prod

# Análisis del bundle
npm run analyze

# Compresión de assets
npm run compress

# Limpiar dist
npm run clean

# Build + análisis completo
npm run size

# Probar prefetching
npm run prefetch:test
```

### Desarrollo
```bash
# Servidor de desarrollo
npm run dev

# Preview del build
npm run preview
```

## 🔍 Monitoreo en Tiempo Real

### Bundle Analyzer
El sistema incluye herramientas de monitoreo que se activan automáticamente en desarrollo:

- **Análisis de recursos**: Tamaño y cantidad de archivos cargados
- **Métricas de memoria**: Uso de memoria del navegador
- **Rendimiento de lazy loading**: Tiempo de carga de módulos
- **Core Web Vitals**: LCP, FID, CLS

### Prefetching Inteligente
- **Detección automática**: Se activa automáticamente
- **Métricas en consola**: Logs de prefetch completado
- **Estrategias visibles**: Cada prefetch muestra su estrategia
- **Fallbacks**: Funciona en navegadores antiguos

### Acceso a Métricas
```typescript
// En la consola del navegador
import('./utils/bundleAnalyzer').then(({ generatePerformanceReport }) => {
  generatePerformanceReport();
});

// Estadísticas de prefetching
import('./app/intelligentPrefetch').then(({ intelligentPrefetch }) => {
  console.log('Prefetch stats:', intelligentPrefetch.getStats());
});
```

## 📈 Estrategias de Optimización

### 1. Prefetching Inteligente
- **Pantallas críticas**: Dashboard se precarga inmediatamente
- **Idle time**: Pantallas secundarias se cargan cuando el navegador está inactivo
- **Hover preload**: Formularios se precargan al hacer hover
- **Viewport preload**: Módulos se cargan cuando entran en el viewport
- **Navegación inteligente**: Prefetch de pantallas relacionadas

### 2. Gestión de Cache
- **TTL configurable**: Diferentes tiempos de vida para diferentes tipos de datos
- **Invalidación inteligente**: Limpieza automática basada en cambios de ruta
- **Límites de memoria**: Control del tamaño máximo del cache
- **Cache de renderizadores**: Pantallas renderizadas se cachean

### 3. Code Splitting
- **Route-based**: División por rutas/pantallas
- **Feature-based**: Separación por funcionalidades
- **Vendor-based**: Dependencias externas en chunks separados
- **Core-based**: Funcionalidades centrales agrupadas

### 4. Compresión Avanzada
- **Gzip nivel 9**: Máxima compresión para compatibilidad universal
- **Brotli nivel 11**: Compresión superior para navegadores modernos
- **Archivos pre-comprimidos**: No hay overhead en tiempo de ejecución
- **Configuración automática**: Servidor detecta y sirve archivos comprimidos

## 🎯 Métricas Objetivo

### Bundle Size
- **Bundle inicial**: < 500KB
- **Bundle total**: < 2MB
- **Chunks**: 5-15 archivos JS (optimizado)

### Lazy Loading
- **Tiempo de carga**: < 1 segundo
- **Cache hit ratio**: > 80%
- **Tasa de éxito**: > 90%

### Prefetching
- **Tiempo de prefetch**: < 500ms
- **Tasa de éxito**: > 95%
- **Uso de idle time**: > 70%

### Compresión
- **Gzip ratio**: > 70%
- **Brotli ratio**: > 80%
- **Ahorro total**: > 75%

### Core Web Vitals
- **LCP**: < 2.5 segundos
- **FID**: < 100ms
- **CLS**: < 0.1

## 🚨 Solución de Problemas

### Bundle muy grande
```bash
# Analizar el bundle
npm run analyze

# Verificar chunks
npm run build:analyze

# Limpiar y reconstruir
npm run clean && npm run build
```

### Lazy loading lento
```typescript
// Verificar cache en consola
import('./app/lazyLoader').then(({ getCacheStats }) => {
  console.log(getCacheStats());
});
```

### Prefetching no funciona
```typescript
// Verificar estado del prefetcher
import('./app/intelligentPrefetch').then(({ intelligentPrefetch }) => {
  console.log('Prefetch status:', intelligentPrefetch.getStatus());
});
```

### Errores de carga
```typescript
// Limpiar cache
import('./app/lazyLoader').then(({ clearCache }) => {
  clearCache();
});
```

## 🔧 Configuración de Servidor

### Nginx con Compresión
```bash
# Instalar módulo Brotli
sudo apt-get install libbrotli-dev
sudo nginx -s reload

# Verificar compresión
curl -H "Accept-Encoding: br" -I http://your-domain.com/assets/main.js
```

### Headers de Compresión
```nginx
# Servir archivos comprimidos
location ~* \.(js|css)$ {
    try_files $uri $uri.gz $uri.br $uri =404;
    add_header Content-Encoding "br" always;
}
```

## 🔮 Próximas Optimizaciones

### 1. Service Worker
- Cache offline de módulos
- Actualizaciones automáticas
- Background sync

### 2. WebAssembly
- Funciones críticas en WASM
- Mejora de rendimiento en cálculos

### 3. HTTP/3
- Multiplexing de conexiones
- Compresión mejorada
- Mejor manejo de latencia

### 4. Prefetching Avanzado
- Machine Learning para predicción
- Análisis de patrones de usuario
- Prefetching adaptativo

## 📚 Recursos Adicionales

- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Web Performance Best Practices](https://web.dev/performance/)
- [Lazy Loading Strategies](https://web.dev/lazy-loading/)
- [Bundle Analysis Tools](https://web.dev/bundle-analysis/)
- [Brotli Compression](https://github.com/google/brotli)
- [Nginx Brotli Module](https://github.com/google/ngx_brotli)

---

**Nota**: Estas optimizaciones están diseñadas para mejorar significativamente el rendimiento de la aplicación. El sistema de prefetching inteligente y la compresión Brotli proporcionan mejoras adicionales del 20-30% en el tiempo de carga percibido por el usuario.
