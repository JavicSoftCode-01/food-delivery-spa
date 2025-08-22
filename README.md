# Food Delivery SPA

Una Aplicación de Página Única (SPA) moderna para la gestión de pedidos de comida a domicilio, diseñada para pequeñas empresas que buscan digitalizar sus operaciones.

**Tecnologías:** TypeScript • Vite • Tailwind CSS • Arquitectura Modular

---

## 📋 Descripción del Proyecto

Esta aplicación centraliza las operaciones diarias de negocios de comida, desde la gestión del menú hasta el seguimiento de pedidos. Proporciona una interfaz rápida, intuitiva y responsiva que funciona en cualquier dispositivo.

### 🎯 Características Principales

- **📊 Dashboard Inteligente**: Resumen visual con pedidos pendientes, entregados, ingresos totales y estadísticas de productos
- **👥 Gestión de Pedidos**: Creación, edición y seguimiento completo de pedidos con validaciones en tiempo real
- **🍕 Administración de Menú**: Control total del inventario, precios, combos y disponibilidad de productos
- **📱 Contacto Directo**: Integración con WhatsApp y llamadas telefónicas desde la aplicación
- **⚙️ Configuración Flexible**: Personalización de tiempos de entrega, modo oscuro y parámetros del negocio
- **💾 Persistencia Local**: Almacenamiento en `localStorage` sin necesidad de base de datos externa

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js**: Versión 18 o superior
- **npm**: Versión 9 o superior

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/JavicSoftCode/food-delivery-spa.git
   cd food-delivery-spa
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

4. **Construir para producción**
   ```bash
   npm run build
   ```

### Comandos Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run preview   # Preview del build
npm run deploy    # Deploy a GitHub Pages
```

---

## 💼 Guía de Uso

### 1️⃣ Configuración Inicial
- **Configurar el menú**: Agregar comidas y combos en la sección "Comidas"
- **Definir precios**: Establecer costos y precios de venta con validación de rentabilidad
- **Configurar horarios**: Definir disponibilidad de productos por horario

### 2️⃣ Gestión de Pedidos
- **Crear pedido**: Formulario inteligente con validaciones automáticas
- **Validación en tiempo real**:
  - Normalización de números telefónicos
  - Detección de conflictos de horario
  - Verificación de stock disponible
- **Seguimiento**: Estados de pedido (pendiente/entregado) con archivado automático

### 3️⃣ Funcionalidades Avanzadas
- **Combos inteligentes**: Ofertas automáticas con validación de rentabilidad
- **Contacto directo**: Botones de WhatsApp y llamada desde cada pedido
- **Historial de ventas**: Análisis de rendimiento por producto
- **Modo oscuro**: Cambio de tema para mejor experiencia visual

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
food-delivery-spa/
├── src/
│   ├── app/                 # Núcleo de la aplicación
│   │   ├── config.ts        # Configuración centralizada
│   │   ├── router.ts        # Gestión de rutas
│   │   └── header.ts        # Header con estado global
│   │
│   ├── features/            # Funcionalidades por dominio
│   │   ├── foods/           # Gestión de comidas
│   │   │   ├── components/  # Componentes específicos
│   │   │   ├── hooks/       # Custom hooks
│   │   │   └── *.ts         # Lógica de negocio
│   │   └── orders/          # Gestión de pedidos
│   │       ├── components/  # Componentes específicos
│   │       └── *.ts         # Formularios y lógica
│   │
│   ├── services/            # Servicios globales
│   │   ├── api.ts           # Cliente HTTP centralizado
│   │   ├── foodService.ts   # Lógica de comidas
│   │   ├── orderService.ts  # Lógica de pedidos
│   │   └── storage.ts       # localStorage wrapper
│   │
│   ├── ui/                  # Interfaz visual
│   │   ├── screens/         # Pantallas principales
│   │   ├── layout/          # Layouts reutilizables
│   │   ├── theme/           # Sistema de tema
│   │   └── components.ts    # Componentes base
│   │
│   └── utils/               # Utilidades
│       ├── formatters.ts    # Formateadores
│       ├── validators.ts    # Validaciones
│       ├── business.ts      # Reglas de negocio
│       └── global.ts        # Funciones genéricas
```

### Principios de Diseño

- **🔄 Escalabilidad**: Arquitectura modular que permite crecimiento
- **🛠️ Mantenibilidad**: Código organizado por responsabilidades
- **♻️ Reutilización**: Componentes y hooks compartidos
- **⚡ Performance**: Lazy loading y optimizaciones
- **🧪 Testing**: Estructura preparada para pruebas unitarias

### Flujo de Datos

```
UI Components → Custom Hooks → Services → Storage/API
     ↑              ↓           ↓         ↓
     └── State Management ←── Events ←── Updates
```

---

## 🎨 Características Técnicas

### Sistema de Tema
- **Tema Claro/Oscuro**: Cambio dinámico con persistencia
- **Variables CSS**: Sistema centralizado de colores y espaciado
- **Transiciones**: Animaciones suaves (150ms, 300ms, 500ms)
- **Responsive**: Mobile-first con breakpoints consistentes

### Validaciones Inteligentes
- **Teléfonos**: Normalización automática de formatos
- **Horarios**: Prevención de conflictos de entrega
- **Stock**: Verificación en tiempo real
- **Precios**: Validación de rentabilidad mínima

### Gestión de Estado
- **Custom Hooks**: Estado local optimizado
- **localStorage**: Persistencia automática
- **Event Listeners**: Actualizaciones en tiempo real
- **Cache**: Sistema de cache inteligente

---

## 🔮 Roadmap

### Corto Plazo
- [✅] Implementar lazy loading de pantallas
- [ ] Agregar unit tests con Jest
- [✅] Optimizar bundle size

### Mediano Plazo
- [ ] Sistema de notificaciones push
- [ ] Soporte offline con Service Workers
- [ ] Capacidades PWA completas

### Largo Plazo
- [ ] Backend API real con base de datos
- [ ] Sistema de autenticación
- [ ] Soporte multi-tenant

---

## 🤝 Contribución

1. **Fork** el repositorio
2. **Crea** una rama: `git checkout -b feature/nueva-funcionalidad`
3. **Sigue** las convenciones de código establecidas
4. **Testea** todos los cambios
5. **Envía** un pull request detallado

### Convenciones de Código
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Funciones**: camelCase con verbos descriptivos
- **Variables**: camelCase con nombres claros
- **Constantes**: UPPER_SNAKE_CASE

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**JavicSoftCode-01**
- GitHub: [@JavicSoftCode](https://github.com/JavicSoftCode-01)

---
