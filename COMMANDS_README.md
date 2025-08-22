# 🚀 Guía Completa de Comandos - Food Delivery SPA

Este documento es tu **guía definitiva** para todos los comandos disponibles en el proyecto, explicando **cuándo**, **por qué** y **cómo** usarlos correctamente.

## 📋 Índice de Comandos

### 🛠️ **Desarrollo Diario**
- `npm run dev` - Servidor de desarrollo
- `npm run preview` - Preview del build

### 🔨 **Build y Optimización**
- `npm run build` - Build básico
- `npm run build:analyze` - Build + análisis de bundle
- `npm run build:compress` - Build + compresión automática
- `npm run build:prod` - Build de producción

### 📊 **Análisis y Monitoreo**
- `npm run analyze` - Solo análisis del bundle
- `npm run compress` - Solo compresión de assets
- `npm run size` - Build completo + análisis

### 🚀 **Deploy y Publicación**
- `npm run predeploy` - Build optimizado para deploy
- `npm run deploy` - Deploy automático a GitHub Pages

### 🧹 **Mantenimiento**
- `npm run clean` - Limpiar archivos generados
- `npm run prefetch:test` - Probar sistema de prefetching

---

## 🛠️ **DESARROLLO DIARIO**

### `npm run dev`
```bash
npm run dev
```

**¿Cuándo usarlo?**
- ✅ **Siempre** cuando estés desarrollando
- ✅ **Cada vez** que hagas cambios en el código
- ✅ **Antes de** hacer commit de cambios

**¿Por qué?**
- Inicia el servidor de desarrollo con **hot reload**
- Detecta cambios automáticamente
- Muestra errores en tiempo real
- Activa el **prefetching inteligente** para testing

**¿Qué hace?**
- Levanta servidor en `http://localhost:5173`
- Compila TypeScript en tiempo real
- Activa todas las optimizaciones de desarrollo
- Monitorea performance automáticamente

---

## 🔨 **BUILD Y OPTIMIZACIÓN**

### `npm run build`
```bash
npm run build
```

**¿Cuándo usarlo?**
- ✅ **Antes de** hacer deploy
- ✅ **Para testing** de producción
- ✅ **Después de** cambios importantes
- ✅ **Antes de** commit final

**¿Por qué?**
- Genera archivos optimizados para producción
- Aplica todas las optimizaciones de Vite
- Crea la carpeta `dist/` con assets finales
- Verifica que no hay errores de compilación

**¿Qué hace?**
- Compila TypeScript a JavaScript
- Aplica code splitting automático
- Minifica y optimiza el código
- Genera chunks para mejor caching

---

### `npm run build:analyze`
```bash
npm run build:analyze
```

**¿Cuándo usarlo?**
- ✅ **Después de** cambios en `vite.config.ts`
- ✅ **Cuando** quieras optimizar el bundle
- ✅ **Antes de** deploy a producción
- ✅ **Para monitorear** el tamaño del bundle

**¿Por qué?**
- Te da **análisis detallado** del bundle
- Identifica archivos **muy grandes**
- Sugiere **optimizaciones** específicas
- Verifica que el **code splitting** funciona

**¿Qué hace?**
1. Ejecuta `npm run build`
2. Analiza recursivamente la carpeta `dist/`
3. Muestra **top 10** archivos más grandes
4. Da **recomendaciones** específicas
5. Verifica **número de chunks** JS

**Ejemplo de salida:**
```
🏆 Top 10 archivos más grandes:
🥇 main-abc123.js                   45.2 KB
🥈 vendor-def456.js                  32.1 KB
🥉 foods-ghi789.js                   28.7 KB

🧩 Chunks JS: 8
✅ Número de chunks optimizado
```

---

### `npm run build:compress`
```bash
npm run build:compress
```

**¿Cuándo usarlo?**
- ✅ **Siempre** antes de deploy a producción
- ✅ **Cuando** quieras máxima optimización
- ✅ **Para testing** de compresión
- ✅ **Antes de** subir a servidor

**¿Por qué?**
- Reduce el tamaño de transferencia en **75-80%**
- Mejora **Core Web Vitals** significativamente
- Prepara archivos para servidor con compresión
- Optimiza para **móviles** y conexiones lentas

**¿Qué hace?**
1. Ejecuta `npm run build`
2. Aplica **compresión Gzip** (nivel 9)
3. Aplica **compresión Brotli** (nivel 11)
4. Genera archivos `.gz` y `.br`
5. Muestra **estadísticas de compresión**

**Ejemplo de salida:**
```
📊 Resumen de compresión:
Archivos comprimidos: 12
Tamaño original: 245.67 KB
Tamaño Gzip: 67.89 KB (72.4% reducción)
Tamaño Brotli: 54.32 KB (77.9% reducción)

💰 Ahorro total:
Gzip: 177.78 KB
Brotli: 191.35 KB
```

---

### `npm run build:prod`
```bash
npm run build:prod
```

**¿Cuándo usarlo?**
- ✅ **Para builds** de producción final
- ✅ **Cuando** quieras máxima optimización
- ✅ **Antes de** deploy crítico
- ✅ **Para testing** de performance

**¿Por qué?**
- Aplica **todas las optimizaciones** disponibles
- Configuración específica para producción
- Mejor rendimiento en servidores reales
- Optimizado para **SEO** y **Core Web Vitals**

---

## 📊 **ANÁLISIS Y MONITOREO**

### `npm run analyze`
```bash
npm run analyze
```

**¿Cuándo usarlo?**
- ✅ **Después de** cambios en el código
- ✅ **Para verificar** optimizaciones
- ✅ **Antes de** commit importante
- ✅ **Para debugging** de performance

**¿Por qué?**
- **Análisis rápido** sin rebuild completo
- Identifica **problemas** de bundle
- Sugiere **mejoras** específicas
- Monitorea **tendencias** de tamaño

---

### `npm run compress`
```bash
npm run compress
```

**¿Cuándo usarlo?**
- ✅ **Solo** cuando ya tienes build
- ✅ **Para testing** de compresión
- ✅ **Cuando** cambies configuración de compresión
- ✅ **Para verificar** archivos comprimidos

**¿Por qué?**
- **Solo comprime** archivos existentes
- No hace rebuild completo
- Más rápido para testing
- Útil para **iteraciones** de compresión

---

### `npm run size`
```bash
npm run size
```

**¿Cuándo usarlo?**
- ✅ **Para análisis completo** del proyecto
- ✅ **Antes de** deploy importante
- ✅ **Para verificar** todas las optimizaciones
- ✅ **Para reporting** de performance

**¿Por qué?**
- Combina **build + análisis** en un comando
- **Análisis completo** en una ejecución
- Verifica **todo el pipeline** de optimización
- Útil para **CI/CD** y **monitoreo**

---

## 🚀 **DEPLOY Y PUBLICACIÓN**

### `npm run predeploy`
```bash
npm run predeploy
```

**¿Cuándo usarlo?**
- ✅ **Siempre** antes de `npm run deploy`
- ✅ **Para preparar** archivos de producción
- ✅ **Cuando** quieras verificar el build final
- ✅ **Para testing** antes de publicar

**¿Por qué?**
- Ejecuta **build optimizado** con compresión
- Prepara archivos para **GitHub Pages**
- Verifica que **todo funciona** correctamente
- Genera **archivos comprimidos** para mejor performance

**¿Qué hace?**
- Ejecuta `npm run build:compress`
- Genera carpeta `dist/` optimizada
- Crea archivos `.gz` y `.br`
- Prepara para deploy automático

---

### `npm run deploy`
```bash
npm run deploy
```

**¿Cuándo usarlo?**
- ✅ **Solo** cuando quieras publicar cambios
- ✅ **Después de** commit final en main
- ✅ **Para actualizar** la web en vivo
- ✅ **Cuando** estés listo para producción

**¿Por qué?**
- **Publica automáticamente** a GitHub Pages
- Actualiza la **rama deploy**
- Hace la web **pública** inmediatamente
- **No requiere** configuración manual

**¿Qué hace?**
1. Ejecuta `npm run predeploy` automáticamente
2. Construye la aplicación optimizada
3. Sube archivos a la **rama deploy**
4. **GitHub Pages** detecta cambios automáticamente
5. La web se actualiza en **2-5 minutos**

---

## 🧹 **MANTENIMIENTO**

### `npm run clean`
```bash
npm run clean
```

**¿Cuándo usarlo?**
- ✅ **Cuando** tengas problemas de build
- ✅ **Para liberar** espacio en disco
- ✅ **Antes de** rebuild completo
- ✅ **Para resolver** errores de caché

**¿Por qué?**
- Elimina archivos **generados** automáticamente
- Resuelve **conflictos** de build
- Libera **espacio** en disco
- **Fresh start** para builds

---

### `npm run prefetch:test`
```bash
npm run prefetch:test
```

**¿Cuándo usarlo?**
- ✅ **Para testing** del sistema de prefetching
- ✅ **Cuando** cambies configuración de prefetch
- ✅ **Para verificar** que funciona correctamente
- ✅ **Para debugging** de performance

**¿Por qué?**
- Activa el **servidor de desarrollo**
- Permite testing del **prefetching inteligente**
- Verifica **estrategias** de precarga
- Monitorea **performance** en tiempo real

---

## 🔄 **FLUJO COMPLETO DE DESARROLLO Y DEPLOY**

### **Flujo Diario (Desarrollo)**
```bash
# 1. Iniciar desarrollo
npm run dev

# 2. Hacer cambios en el código...

# 3. Verificar que funciona
# (navegar en la app, probar funcionalidades)

# 4. Hacer commit de cambios
git add .
git commit -m "Descripción de cambios"
git push origin main
```

### **Flujo de Deploy (Publicación)**
```bash
# 1. Verificar que todo funciona en desarrollo
npm run dev

# 2. Hacer commit final
git add .
git commit -m "Ready for production"
git push origin main

# 3. Deploy automático
npm run deploy

# 4. Verificar en GitHub Pages
# La web se actualiza automáticamente en 2-5 minutos
```

### **Flujo de Optimización (Performance)**
```bash
# 1. Analizar bundle actual
npm run build:analyze

# 2. Hacer optimizaciones en vite.config.ts

# 3. Verificar mejoras
npm run build:analyze

# 4. Probar compresión
npm run build:compress

# 5. Deploy optimizado
npm run deploy
```

---

## ⏰ **FRECUENCIA DE USO RECOMENDADA**

### **Comandos Diarios**
- `npm run dev` → **Siempre** que desarrolles
- `npm run clean` → **Cuando** tengas problemas

### **Comandos Semanales**
- `npm run build:analyze` → **1 vez por semana**
- `npm run size` → **1 vez por semana**

### **Comandos de Deploy**
- `npm run predeploy` → **Antes de cada deploy**
- `npm run deploy` → **Solo cuando publiques**

### **Comandos de Mantenimiento**
- `npm run clean` → **Cuando sea necesario**
- `npm run prefetch:test` → **Para testing específico**

---

## 🎯 **COMANDOS POR ESCENARIO**

### **🚀 Nuevo Feature**
```bash
npm run dev          # Desarrollo
npm run build:analyze # Verificar optimización
npm run deploy       # Publicar
```

### **🐛 Bug Fix**
```bash
npm run dev          # Desarrollo y testing
npm run deploy       # Deploy rápido
```

### **⚡ Optimización de Performance**
```bash
npm run build:analyze # Analizar estado actual
# Hacer cambios en vite.config.ts
npm run build:analyze # Verificar mejoras
npm run build:compress # Probar compresión
npm run deploy        # Deploy optimizado
```

### **🧹 Limpieza y Mantenimiento**
```bash
npm run clean        # Limpiar archivos
npm run dev          # Verificar que funciona
npm run build:analyze # Verificar optimización
```

---

## 🔍 **MONITOREO Y DEBUGGING**

### **Verificar Estado del Proyecto**
```bash
# Estado del bundle
npm run build:analyze

# Estado de compresión
npm run build:compress

# Estado completo
npm run size
```

### **Debugging de Problemas**
```bash
# Problemas de build
npm run clean
npm run build

# Problemas de performance
npm run build:analyze
npm run build:compress

# Problemas de desarrollo
npm run clean
npm run dev
```

---

## 💡 **CONSEJOS IMPORTANTES**

### **✅ Hacer SIEMPRE**
- Usar `npm run dev` para desarrollo
- Hacer `npm run predeploy` antes de deploy
- Verificar con `npm run build:analyze` semanalmente
- Limpiar con `npm run clean` cuando haya problemas

### **❌ NO hacer NUNCA**
- Deploy sin `npm run predeploy` primero
- Deploy sin verificar que funciona en desarrollo
- Deploy sin commit en main
- Deploy sin verificar optimizaciones

### **⚠️ ATENCIÓN**
- El deploy **NO** requiere configuración manual
- GitHub Pages se actualiza **automáticamente**
- Los archivos comprimidos **mejoran performance**
- El análisis semanal **previene problemas**

---

## 🎉 **RESUMEN RÁPIDO**

### **Para Desarrollo Diario:**
```bash
npm run dev
```

### **Para Deploy:**
```bash
npm run deploy
```

### **Para Optimización:**
```bash
npm run build:analyze
npm run build:compress
```

### **Para Mantenimiento:**
```bash
npm run clean
```

---

**🎯 Recuerda:** El flujo más importante es **desarrollo → commit → deploy**. Todo lo demás son herramientas de optimización y monitoreo que te ayudan a mantener la aplicación en su mejor estado.

**🚀 ¡Con estos comandos tienes control total sobre tu proyecto!**
