# Food Delivery SPA

Una Aplicación de Página Única (SPA) para la gestión de pedidos de comida a domicilio, diseñada para ser una herramienta simple y eficiente para pequeñas empresas.

Construida con **TypeScript** y **Vite**, y estilizada con **Tailwind CSS**.

## Contexto de la Aplicación

Esta aplicación permite a los negocios de comida gestionar sus operaciones diarias de manera centralizada. El sistema maneja un flujo de trabajo completo: desde la gestión de los productos del menú (comidas y combos) hasta la toma de pedidos de clientes y el seguimiento de su estado (pendiente o entregado).

El objetivo es proporcionar una interfaz rápida, intuitiva y responsiva que funcione en cualquier dispositivo, facilitando la administración de pedidos en tiempo real.

## Características Principales

- **Dashboard:** Ofrece un resumen visual del estado del negocio, incluyendo pedidos pendientes, pedidos entregados, ingresos totales y la variedad de productos disponibles.
- **Gestión de Clientes y Pedidos:** Permite crear, editar y visualizar los detalles de los pedidos. Incluye la capacidad de contactar a los clientes por teléfono o WhatsApp directamente desde la aplicación.
- **Gestión de Comidas:** Administra el menú, permitiendo agregar, editar y ver los productos. También proporciona un historial de ventas para cada artículo.
- **Configuraciones:** Permite ajustar parámetros de la aplicación, como el tiempo de espera entre entregas y la activación del modo oscuro.
- **Persistencia de Datos:** Toda la información se almacena localmente en el navegador (`localStorage`), lo que significa que no se requiere una base de datos externa.

## Funcionamiento Detallado

### 1. Gestión de Comidas
- **Creación/Edición:** Puedes agregar nuevas comidas con su costo, precio de venta, stock inicial y horario de disponibilidad. El sistema valida que el precio de venta asegure una ganancia mínima.
- **Combos:** Es posible definir ofertas de combos (ej. "2 por $5.00"), que se asocian a una comida principal. El sistema también valida la rentabilidad de los combos.
- **Disponibilidad:** Las comidas pueden activarse o desactivarse. Una comida no puede desactivarse si está asociada a un pedido activo.

### 2. Gestión de Pedidos
- **Formulario Inteligente:** Al crear un pedido, el formulario valida la información en tiempo real:
    - **Teléfono:** Normaliza y valida el formato del número de teléfono.
    - **Conflictos de Horario:** Detecta si la hora de entrega solicitada está demasiado cerca de otro pedido y sugiere automáticamente una nueva hora para evitar conflictos.
    - **Stock:** Verifica que haya suficiente stock del producto seleccionado antes de confirmar el pedido.
- **Estado del Pedido:** Los pedidos pueden marcarse como "entregados". Una vez entregados, el sistema inicia un conteo regresivo para archivarlos y limpiar la lista de pedidos activos.

### 3. Flujo de Trabajo
El flujo de trabajo típico sería:
1.  **Configurar el menú:** Agregar las comidas y combos disponibles en la sección "Comidas".
2.  **Recibir un pedido:** Ir a la sección "Clientes" y hacer clic en "Agregar Pedido".
3.  **Llenar el formulario:** Ingresar los datos del cliente, seleccionar la comida y la cantidad. El sistema calculará el total y validará la información.
4.  **Marcar como entregado:** Una vez que el pedido se entrega, se marca como tal en la lista de clientes.
5.  **Archivar:** Después de un tiempo, los pedidos entregados se pueden archivar para mantener la interfaz limpia.

## Dependencias Requeridas

Para ejecutar este proyecto, solo necesitas tener instalado **Node.js** y **npm** (o un gestor de paquetes compatible como Yarn o pnpm).

- **Node.js:** Versión 18 o superior.
- **npm:** Versión 9 o superior.

## Guía de Instalación

Sigue estos pasos para configurar el proyecto en tu sistema local.

### 1. Clonar el Repositorio
Primero, clona el repositorio desde GitHub:
```bash
git clone https://github.com/JavicSoftCode/food-delivery-spa.git
cd food-delivery-spa
```

### 2. Instalar Dependencias
Una vez dentro del directorio del proyecto, instala las dependencias necesarias. El comando es el mismo para Windows, macOS y Linux.

```bash
npm install
```

### 3. Ejecutar la Aplicación
Para iniciar la aplicación en modo de desarrollo, ejecuta:
```bash
npm run dev
```
Esto iniciará un servidor de desarrollo local. Podrás acceder a la aplicación en tu navegador a través de la URL que se muestra en la terminal (generalmente `http://localhost:5173`).

### 4. Construir para Producción
Si deseas generar una versión optimizada para producción, utiliza el siguiente comando:
```bash
npm run build
```
Los archivos listos para desplegar se generarán en la carpeta `dist/`.

---

Realizado por **JavicSoftCode**.