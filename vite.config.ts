import { defineConfig } from 'vite'

export default defineConfig({
  base: '/food-delivery-spa/', // <--- el nombre de tu repositorio
  
  // Optimizaciones de build
  build: {
    target: 'es2015', // Soporte para navegadores más antiguos
    minify: 'esbuild', // Usar esbuild (más rápido y incluido por defecto)
    chunkSizeWarningLimit: 1000, // Aumenta el límite de advertencia
    sourcemap: false, // Desactiva sourcemaps en producción para reducir tamaño
    
    // Configuración de rollup para mejor code splitting
    rollupOptions: {
      // Externalizar módulos de Node.js problemáticos
      external: ['fsevents', 'fs', 'path', 'crypto', 'os', 'child_process'],
      
      output: {
        // Generar nombres de archivos más legibles
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        
        // Configuración de chunks para mejor caching
        manualChunks: {
          // Chunks por funcionalidad
          core: ['./src/main', './src/app/config', './src/app/router'],
          ui: ['./src/ui/ui', './src/ui/layout'],
          utils: ['./src/utils/index', './src/utils/formatters', './src/utils/validators'],
          
          // Chunks por feature
          foods: ['./src/features/foods/foodForm', './src/features/foods/salesHistory'],
          orders: ['./src/features/orders/orderForm', './src/features/orders/orderDetails']
        }
      }
    }
  },

  // Optimizaciones de desarrollo
  optimizeDeps: {
    exclude: ['fsevents', 'fs', 'path', 'crypto', 'os', 'child_process']
  },

  // Configuración de CSS
  css: {
    devSourcemap: false
  },

  // Configuración de servidor para desarrollo
  server: {
    // Headers para testing de compresión
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff'
    }
  }
})
