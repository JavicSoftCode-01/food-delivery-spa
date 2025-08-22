// src/utils/bundleAnalyzer.ts
// Utilidades para analizar y monitorear el bundle size y lazy loading

// Declaraciones para tipos del navegador
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
      jsHeapSizeLimit: number;
    };
  }
  
  interface Navigator {
    connection?: {
      effectiveType?: string;
    };
    deviceMemory?: number;
  }
  
  interface Window {
    import?: (modulePath: string) => Promise<any>;
  }
}

/**
 * Analiza el tamaño del bundle actual
 */
export function analyzeBundleSize(): void {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType('resource');
    
    console.group('📊 Análisis de Bundle y Recursos');
    
    // Tiempo de carga inicial
    if (navigation) {
      console.log(`⏱️  Tiempo de carga inicial: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
      console.log(`🚀 Tiempo de respuesta: ${navigation.responseEnd - navigation.requestStart}ms`);
    }
    
    // Análisis de recursos cargados
    const jsResources = resources.filter(r => r.name.endsWith('.js'));
    const cssResources = resources.filter(r => r.name.endsWith('.css'));
    
    console.log(`📦 Scripts cargados: ${jsResources.length}`);
    console.log(`🎨 Estilos cargados: ${cssResources.length}`);
    
    // Tamaño total de recursos
    const totalSize = resources.reduce((acc, r) => {
      const resource = r as PerformanceResourceTiming;
      return acc + (resource.transferSize || 0);
    }, 0);
    console.log(`💾 Tamaño total transferido: ${(totalSize / 1024).toFixed(2)}KB`);
    
    console.groupEnd();
  }
}

/**
 * Monitorea el rendimiento del lazy loading
 */
export function monitorLazyLoading(): void {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.log(`🔄 Lazy loading completado en: ${navEntry.loadEventEnd - navEntry.loadEventStart}ms`);
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('PerformanceObserver no soportado en este navegador');
    }
  }
}

/**
 * Muestra estadísticas de memoria del navegador
 */
export function showMemoryStats(): void {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = performance.memory!;
    console.group('🧠 Estadísticas de Memoria');
    console.log(`📊 Memoria usada: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`💾 Memoria total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`🚫 Límite de memoria: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
    console.groupEnd();
  }
}

/**
 * Analiza el rendimiento de las importaciones dinámicas
 */
export function analyzeDynamicImports(): void {
  if (typeof window !== 'undefined' && window.import) {
    const originalImport = window.import;
    
    // Interceptar import() para medir rendimiento
    window.import = function(modulePath: string) {
      const startTime = performance.now();
      
      return originalImport(modulePath).then((module: any) => {
        const endTime = performance.now();
        console.log(`⚡ Módulo cargado: ${modulePath} en ${(endTime - startTime).toFixed(2)}ms`);
        return module;
      }).catch((error: any) => {
        console.error(`❌ Error cargando módulo ${modulePath}:`, error);
        throw error;
      });
    };
  }
}

/**
 * Genera un reporte completo de rendimiento
 */
export function generatePerformanceReport(): void {
  console.group('📈 REPORTE COMPLETO DE RENDIMIENTO');
  
  analyzeBundleSize();
  showMemoryStats();
  
  // Información del navegador
  console.group('🌐 Información del Navegador');
  console.log(`User Agent: ${navigator.userAgent}`);
  console.log(`Conexión: ${navigator.connection?.effectiveType || 'Desconocida'}`);
  console.log(`Memoria disponible: ${navigator.deviceMemory || 'Desconocida'}GB`);
  console.groupEnd();
  
  console.groupEnd();
}

/**
 * Inicializa todas las herramientas de monitoreo
 */
export function initializeBundleMonitoring(): void {
  // Solo en desarrollo
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    monitorLazyLoading();
    analyzeDynamicImports();
    
    // Reporte automático después de 5 segundos
    setTimeout(() => {
      generatePerformanceReport();
    }, 5000);
    
    console.log('🔍 Monitoreo de bundle inicializado');
  }
}
