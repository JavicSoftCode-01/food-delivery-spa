# Food Delivery SPA

Esta es una Aplicación de Página Única (SPA) para gestionar pedidos de comida a domicilio. Está construida con TypeScript y Vite, y utiliza Tailwind CSS para los estilos. La aplicación está diseñada para ser una herramienta simple y eficiente para que las pequeñas empresas administren sus pedidos de comida.

## Características

- **Dashboard:** Un resumen del negocio, que incluye pedidos pendientes, pedidos entregados, ingresos totales y una variedad de productos.
- **Clientes:** Gestiona los pedidos de los clientes, incluyendo la creación, edición y visualización de los detalles del pedido. También puedes contactar a los clientes por teléfono o WhatsApp.
- **Comidas:** Gestiona el menú de comidas, incluyendo agregar, editar y ver los artículos de comida. También puedes ver el historial de ventas de cada artículo de comida.
- **Ajustes:** Configura los ajustes de la aplicación, como el tiempo de espera de entrega y el modo oscuro.

## Estructura del Proyecto

El proyecto está estructurado de la siguiente manera:

```
/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── src/
    ├── main.ts
    ├── models.ts
    ├── styles.css
    ├── utils.ts
    ├── services/
    └── ui/
```

- **`.gitignore`**: Especifica los archivos y carpetas que Git debe ignorar.
- **`index.html`**: El punto de entrada HTML de la aplicación.
- **`package.json`**: Contiene los metadatos del proyecto y las dependencias.
- **`README.md`**: La documentación del proyecto.
- **`tsconfig.json`**: El archivo de configuración para el compilador de TypeScript.

### `src/`

- **`main.ts`**: El punto de entrada principal de la aplicación. Inicializa la interfaz de usuario, maneja la navegación y gestiona el estado principal de la aplicación.
- **`models.ts`**: Contiene los modelos de datos para la aplicación, como `Food`, `Order` y `FoodSaleRecord`.
- **`styles.css`**: Estilos globales y correcciones visuales para la aplicación.
- **`utils.ts`**: Funciones de utilidad utilizadas en toda la aplicación.

#### `services/`

- **`foodService.ts`**: Gestiona los datos de la comida, incluyendo la creación, lectura, actualización y eliminación de artículos de comida.
- **`orderService.ts`**: Gestiona los datos de los pedidos, incluyendo la creación, lectura, actualización y eliminación de pedidos.
- **`storage.ts`**: Una utilidad para interactuar con el `localStorage` del navegador.

#### `ui/`

- **`components.ts`**: Renderiza las diferentes pantallas de la aplicación, como el dashboard, los clientes y las pantallas de comidas.
- **`ui.ts`**: Una utilidad para renderizar elementos de la interfaz de usuario, como modales, toasts y el shell principal de la aplicación.

## Cómo Usar

### Clonar el Repositorio

Para clonar el repositorio, ejecuta el siguiente comando:

```bash
git clone https://github.com/JavicSoftCode/food-delivery-spa.git
```

### Instalación

Para instalar las dependencias, ejecuta el siguiente comando:

```bash
npm install
```

### Ejecutar la Aplicación

Para ejecutar la aplicación en modo de desarrollo, ejecuta el siguiente comando:

```bash
npm run dev
```

Esto iniciará un servidor de desarrollo en `http://localhost:5173`.

### Construir la Aplicación

Para construir la aplicación para producción, ejecuta el siguiente comando:

```bash
npm run build
```

Esto creará un directorio `dist` con los archivos listos para producción.

## Mejores Prácticas

Este proyecto implementa varias de las mejores prácticas, que incluyen:

- **Modularidad:** El código está organizado en módulos con responsabilidades claras, lo que facilita su comprensión y mantenimiento.
- **Separación de Preocupaciones:** La lógica de negocio está separada de la interfaz de usuario, lo que hace que el código sea más reutilizable y comprobable.
- **Modelos de Datos:** La aplicación utiliza modelos de datos para representar los datos, lo que ayuda a garantizar la coherencia e integridad de los datos.
- **Funciones de Utilidad:** La aplicación utiliza funciones de utilidad para encapsular tareas comunes, lo que ayuda a reducir la duplicación de código.
- **Manejo de Errores:** La aplicación incluye manejo de errores para manejar con gracia los errores inesperados.
- **Diseño Responsivo:** La aplicación está diseñada para ser responsiva y funcionar en una variedad de dispositivos, desde teléfonos móviles hasta computadoras de escritorio.
- **Accesibilidad:** La aplicación incluye características de accesibilidad, como atributos ARIA y navegación por teclado, para que sea utilizable por personas con discapacidades.
